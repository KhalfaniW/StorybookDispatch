import React, { useEffect } from "react";
import type { Preview } from "@storybook/react";
import { addons } from "@storybook/preview-api";
import {
  DISPATCH_COMMAND,
  DISPATCH_STATE_SYNC,
  WINDOW_COMMAND_EVENT,
  WINDOW_STATE_EVENT,
} from "./storybook/dispatchBridgeEvents";
import type { DispatchActionBase, DispatchBridgeCommand, DispatchBridgeState } from "./types";

type DispatchBridgeProps = {
  storyId: string;
};

type CommandPayload = {
  storyId?: string;
  command: DispatchBridgeCommand<DispatchActionBase>;
};

function DispatchBridge({ storyId }: DispatchBridgeProps) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const channel = addons.getChannel();
    const handleCommand = (payload: CommandPayload) => {
      if (payload?.storyId !== storyId) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent<DispatchBridgeCommand<DispatchActionBase>>(WINDOW_COMMAND_EVENT, {
          detail: payload.command,
        }),
      );
    };

    const handleState = (event: Event) => {
      channel.emit(DISPATCH_STATE_SYNC, {
        storyId,
        ...(event as CustomEvent<DispatchBridgeState<unknown, DispatchActionBase>>).detail,
      });
    };

    channel.on(DISPATCH_COMMAND, handleCommand);
    window.addEventListener(WINDOW_STATE_EVENT, handleState as EventListener);
    channel.emit(DISPATCH_STATE_SYNC, {
      storyId,
      state: null,
      timeline: [],
      currentIndex: 0,
      seedActions: [],
    });

    return () => {
      channel.off(DISPATCH_COMMAND, handleCommand);
      window.removeEventListener(WINDOW_STATE_EVENT, handleState as EventListener);
    };
  }, [storyId]);

  return null;
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <>
        <DispatchBridge storyId={context.id} />
        <Story />
      </>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "charcoal",
      values: [{ name: "charcoal", value: "#120f12" }],
    },
  },
};

export default preview;
