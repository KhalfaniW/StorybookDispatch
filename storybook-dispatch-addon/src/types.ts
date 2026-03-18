import type { ReactNode } from "react";

export type DispatchActionBase = {
  type: string;
  payload?: unknown;
};

export type DispatchTraceResult =
  | { ok: true }
  | { ok: false; error: unknown };

export type DispatchLabelFormatter<TAction> = (action: TAction, index: number) => string;

export type DispatchTimelineEntry<TState, TAction> = {
  id: string;
  label: string;
  action: TAction;
  state: TState;
  timestamp: string;
};

export type DispatchTraceSession<TState, TAction> = {
  state: TState;
  timeline: DispatchTimelineEntry<TState, TAction>[];
  currentIndex: number;
  history: DispatchTimelineEntry<TState, TAction>[];
  dispatchAction: (action: TAction) => DispatchTraceResult;
  goToStep: (index: number) => void;
};

export type DispatchBridgeCommand<TAction> =
  | { kind: "dispatch"; action: TAction }
  | { kind: "gotoStep"; index: number };

export type DispatchBridgeState<TState, TAction> = {
  state: TState;
  timeline: DispatchTimelineEntry<TState, TAction>[];
  currentIndex: number;
  seedActions: TAction[];
};

export type CreateDispatchStoryOptions<TState, TAction, TArgs = unknown, TContext = unknown> = {
  reducer: (state: TState, action: TAction) => TState;
  initialState: TState;
  initAction?: TAction;
  seedActions?: TAction[];
  getActionLabel?: DispatchLabelFormatter<TAction>;
  enabled?: boolean;
  render: (
    trace: DispatchTraceSession<TState, TAction>,
    args: TArgs,
    context: TContext,
  ) => ReactNode;
};
