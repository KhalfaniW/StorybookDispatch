import { useEffect } from "react";
import { WINDOW_COMMAND_EVENT, WINDOW_STATE_EVENT } from "./dispatchBridgeEvents";
import type { DispatchActionBase, DispatchBridgeCommand, DispatchBridgeState } from "../types";

type UseStorybookDispatchBridgeOptions<TState, TAction extends DispatchActionBase> =
  DispatchBridgeState<TState, TAction> & {
    enabled: boolean;
    dispatchAction: (action: TAction) => unknown;
    goToStep: (index: number) => void;
  };

export function useStorybookDispatchBridge<TState, TAction extends DispatchActionBase>({
  enabled,
  state,
  timeline,
  currentIndex,
  seedActions,
  dispatchAction,
  goToStep,
}: UseStorybookDispatchBridgeOptions<TState, TAction>) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return undefined;
    }

    const handleCommand = (
      event: Event,
    ) => {
      const command = (event as CustomEvent<DispatchBridgeCommand<TAction>>).detail;
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

    window.addEventListener(WINDOW_COMMAND_EVENT, handleCommand as EventListener);

    return () => {
      window.removeEventListener(WINDOW_COMMAND_EVENT, handleCommand as EventListener);
    };
  }, [dispatchAction, enabled, goToStep]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent<DispatchBridgeState<TState, TAction>>(WINDOW_STATE_EVENT, {
        detail: { state, timeline, currentIndex, seedActions },
      }),
    );
  }, [currentIndex, enabled, seedActions, state, timeline]);
}
