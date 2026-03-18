import { useEffect } from "react";
import { WINDOW_COMMAND_EVENT, WINDOW_STATE_EVENT } from "./dispatchBridgeEvents";

export function useStorybookDispatchBridge({
  enabled,
  state,
  timeline,
  currentIndex,
  seedActions,
  dispatchAction,
  goToStep,
}) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const handleCommand = (event) => {
      const command = event.detail;
      if (!command || typeof command !== "object") {
        return;
      }

      if (command.kind === "dispatch") {
        dispatchAction(command.action);
        return;
      }

      if (command.kind === "gotoStep") {
        goToStep(command.index);
      }
    };

    window.addEventListener(WINDOW_COMMAND_EVENT, handleCommand);

    return () => {
      window.removeEventListener(WINDOW_COMMAND_EVENT, handleCommand);
    };
  }, [dispatchAction, enabled, goToStep]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(WINDOW_STATE_EVENT, {
        detail: { state, timeline, currentIndex, seedActions },
      }),
    );
  }, [currentIndex, enabled, seedActions, state, timeline]);
}
