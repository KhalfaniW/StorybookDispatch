import { useEffect, useMemo, useRef, useState } from "react";
import { toSerializable } from "./serialization";
import type {
  DispatchActionBase,
  DispatchLabelFormatter,
  DispatchTimelineEntry,
  DispatchTraceSession,
} from "../types";

type SessionState<TState, TAction> = {
  timeline: DispatchTimelineEntry<TState, TAction>[];
  currentIndex: number;
};

type CreateInitialSessionOptions<TState, TAction> = {
  reducer: (state: TState, action: TAction) => TState;
  initialState: TState;
  initAction: TAction;
  getActionLabel: DispatchLabelFormatter<TAction>;
  initialActions: TAction[];
};

type BuildNextSessionOptions<TState, TAction> = {
  session: SessionState<TState, TAction>;
  reducer: (state: TState, action: TAction) => TState;
  action: TAction;
  getActionLabel: DispatchLabelFormatter<TAction>;
};

function defaultLabelFormatter<TAction extends DispatchActionBase>(action: TAction, index: number) {
  if (index === 0) {
    return "Initial";
  }

  return action?.type ?? `Step ${index}`;
}

function createInitialTimeline<TState, TAction>(
  initialState: TState,
  initAction: TAction,
  getActionLabel: DispatchLabelFormatter<TAction>,
): DispatchTimelineEntry<TState, TAction>[] {
  return [
    {
      id: "step-0",
      label: getActionLabel(initAction, 0),
      action: toSerializable(initAction),
      state: toSerializable(initialState),
      timestamp: "Ready",
    },
  ];
}

function createInitialSession<TState, TAction>({
  reducer,
  initialState,
  initAction,
  getActionLabel,
  initialActions,
}: CreateInitialSessionOptions<TState, TAction>): SessionState<TState, TAction> {
  let session: SessionState<TState, TAction> = {
    timeline: createInitialTimeline(initialState, initAction, getActionLabel),
    currentIndex: 0,
  };

  for (const action of initialActions) {
    session = buildNextSession({
      session,
      reducer,
      action,
      getActionLabel,
    });
  }

  return session;
}

function buildNextSession<TState, TAction>({
  session,
  reducer,
  action,
  getActionLabel,
}: BuildNextSessionOptions<TState, TAction>): SessionState<TState, TAction> {
  const timestamp = new Date().toISOString();
  const baseState = session.timeline[session.currentIndex].state;
  const nextState = reducer(baseState, action);
  const nextTimeline = session.timeline.slice(0, session.currentIndex + 1);
  const nextIndex = nextTimeline.length;

  nextTimeline.push({
    id: `step-${nextIndex}`,
    label: getActionLabel(action, nextIndex),
    action: toSerializable(action),
    state: toSerializable(nextState),
    timestamp,
  });

  return {
    timeline: nextTimeline,
    currentIndex: nextIndex,
  };
}

type UseDispatchTraceSessionOptions<TState, TAction extends DispatchActionBase> = {
  reducer: (state: TState, action: TAction) => TState;
  initialState: TState;
  initAction?: TAction;
  initialActions?: TAction[];
  getActionLabel?: DispatchLabelFormatter<TAction>;
};

export function useDispatchTraceSession<TState, TAction extends DispatchActionBase>({
  reducer,
  initialState,
  initAction = { type: "@@INIT" } as TAction,
  initialActions = [],
  getActionLabel = defaultLabelFormatter,
}: UseDispatchTraceSessionOptions<TState, TAction>): DispatchTraceSession<TState, TAction> {
  const initialSessionKey = JSON.stringify({
    initialState: toSerializable(initialState),
    initAction: toSerializable(initAction),
    initialActions: toSerializable(initialActions),
  });
  const [session, setSession] = useState(() =>
    createInitialSession({
      reducer,
      initialState,
      initAction,
      getActionLabel,
      initialActions,
    }),
  );
  const sessionRef = useRef(session);
  const initialSessionKeyRef = useRef(initialSessionKey);
  sessionRef.current = session;

  useEffect(() => {
    if (initialSessionKeyRef.current === initialSessionKey) {
      return;
    }

    const nextSession = createInitialSession({
      reducer,
      initialState,
      initAction,
      getActionLabel,
      initialActions,
    });

    initialSessionKeyRef.current = initialSessionKey;
    sessionRef.current = nextSession;
    setSession(nextSession);
  }, [getActionLabel, initAction, initialActions, initialSessionKey, initialState, reducer]);

  const state = session.timeline[session.currentIndex].state;
  const history = useMemo(() => session.timeline.slice(1).reverse(), [session.timeline]);

  const dispatchAction = (action: TAction) => {
    try {
      const nextSession = buildNextSession({
        session: sessionRef.current,
        reducer,
        action,
        getActionLabel,
      });
      sessionRef.current = nextSession;
      setSession(nextSession);
      return { ok: true } as const;
    } catch (error) {
      return { ok: false, error } as const;
    }
  };

  const goToStep = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, sessionRef.current.timeline.length - 1));
    const nextSession = {
      ...sessionRef.current,
      currentIndex: nextIndex,
    };
    sessionRef.current = nextSession;
    setSession(nextSession);
  };

  return {
    state,
    timeline: session.timeline,
    currentIndex: session.currentIndex,
    history,
    dispatchAction,
    goToStep,
  };
}
