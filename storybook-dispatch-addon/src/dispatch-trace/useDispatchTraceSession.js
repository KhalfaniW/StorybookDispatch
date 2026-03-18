import { useEffect, useMemo, useRef, useState } from "react";
import { toSerializable } from "./serialization";

function defaultLabelFormatter(action, index) {
  if (index === 0) {
    return "Initial";
  }

  return action?.type ?? `Step ${index}`;
}

function createInitialTimeline(initialState, initAction, getActionLabel) {
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

function createInitialSession({
  reducer,
  initialState,
  initAction,
  getActionLabel,
  initialActions,
}) {
  let session = {
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

function buildNextSession({
  session,
  reducer,
  action,
  getActionLabel,
}) {
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

export function useDispatchTraceSession({
  reducer,
  initialState,
  initAction = { type: "@@INIT" },
  initialActions = [],
  getActionLabel = defaultLabelFormatter,
}) {
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

  const dispatchAction = (action) => {
    try {
      const nextSession = buildNextSession({
        session: sessionRef.current,
        reducer,
        action,
        getActionLabel,
      });
      sessionRef.current = nextSession;
      setSession(nextSession);
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  };

  const goToStep = (index) => {
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
