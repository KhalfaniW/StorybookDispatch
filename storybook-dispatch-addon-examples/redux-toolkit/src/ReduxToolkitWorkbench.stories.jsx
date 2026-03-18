import { useEffect, useRef } from "react";
import { ReduxToolkitWorkbench } from "./ReduxToolkitWorkbench";
import { useDispatchTraceSession } from "storybook-dispatch-addon";
import { useStorybookDispatchBridge } from "storybook-dispatch-addon";
import {
  getReduxToolkitActionLabel,
  reduxToolkitInitialState,
  reduxToolkitSeedActions,
  toolkitReducer,
} from "./reduxToolkitWorkbenchModel.js";

const seedActions = reduxToolkitSeedActions;

function ReduxToolkitWorkbenchStory() {
  const trace = useDispatchTraceSession({
    reducer: toolkitReducer,
    initialState: reduxToolkitInitialState,
    initialActions: seedActions,
    getActionLabel: getReduxToolkitActionLabel,
  });
  const seededActionsKey = JSON.stringify(seedActions);
  const appliedSeedKeyRef = useRef(null);

  useEffect(() => {
    if (!seedActions.length) {
      return;
    }

    if (trace.timeline.length > 1) {
      appliedSeedKeyRef.current = seededActionsKey;
      return;
    }

    if (appliedSeedKeyRef.current === seededActionsKey) {
      return;
    }

    for (const action of seedActions) {
      trace.dispatchAction(action);
    }

    appliedSeedKeyRef.current = seededActionsKey;
  }, [seededActionsKey, trace]);

  useStorybookDispatchBridge({
    enabled: true,
    state: trace.state,
    timeline: trace.timeline,
    currentIndex: trace.currentIndex,
    seedActions,
    dispatchAction: trace.dispatchAction,
    goToStep: trace.goToStep,
  });

  return (
    <ReduxToolkitWorkbench
      state={trace.state}
      dispatchAction={trace.dispatchAction}
      timeline={trace.timeline}
      currentIndex={trace.currentIndex}
    />
  );
}

const meta = {
  title: "Examples/Redux Toolkit/ReduxToolkitWorkbench",
  component: ReduxToolkitWorkbenchStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default = {
};
