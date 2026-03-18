import React, { useEffect } from "react";
import { addons } from "@storybook/preview-api";
import {
  DISPATCH_COMMAND,
  DISPATCH_STATE_SYNC,
  WINDOW_COMMAND_EVENT,
  WINDOW_STATE_EVENT,
} from "./storybook/dispatchBridgeEvents.js";

function DispatchBridge({ storyId }) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const channel = addons.getChannel();
    const handleCommand = (payload) => {
      if (payload?.storyId !== storyId) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent(WINDOW_COMMAND_EVENT, {
          detail: payload.command,
        }),
      );
    };

    const handleState = (event) => {
      channel.emit(DISPATCH_STATE_SYNC, {
        storyId,
        ...event.detail,
      });
    };

    channel.on(DISPATCH_COMMAND, handleCommand);
    window.addEventListener(WINDOW_STATE_EVENT, handleState);
    channel.emit(DISPATCH_STATE_SYNC, {
      storyId,
      state: null,
      timeline: [],
      currentIndex: 0,
      seedActions: [],
    });

    return () => {
      channel.off(DISPATCH_COMMAND, handleCommand);
      window.removeEventListener(WINDOW_STATE_EVENT, handleState);
    };
  }, [storyId]);

  return null;
}

const preview = {
  decorators: [
    (Story, context) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(DispatchBridge, { storyId: context.id }),
        React.createElement(Story),
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
      values: [
        { name: "charcoal", value: "#120f12" },
      ],
    },
  },
};

export default preview;
