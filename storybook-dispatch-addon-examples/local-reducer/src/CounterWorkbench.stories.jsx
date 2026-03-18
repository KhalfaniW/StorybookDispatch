import { useEffect, useRef } from "react";
import { CounterWorkbench } from "./CounterWorkbench";
import { useDispatchTraceSession } from "storybook-dispatch-addon";
import { useStorybookDispatchBridge } from "storybook-dispatch-addon";
import {
  counterWorkbenchInitialState,
  counterWorkbenchReducer,
  getCounterWorkbenchActionLabel,
} from "./counterWorkbenchModel.js";

const seedActions = [
  { type: "increment", payload: { amount: 3 } },
  { type: "setStep", payload: { step: 4 } },
  { type: "rename", payload: { label: "Dispatch Lab" } },
  { type: "addItem", payload: { item: "Espresso" } },
  { type: "reset" },
];

function CounterWorkbenchStory() {
  const trace = useDispatchTraceSession({
    reducer: counterWorkbenchReducer,
    initialState: counterWorkbenchInitialState,
    initialActions: seedActions,
    getActionLabel: getCounterWorkbenchActionLabel,
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
    <CounterWorkbench
      state={trace.state}
      dispatchAction={trace.dispatchAction}
      timeline={trace.timeline}
      currentIndex={trace.currentIndex}
    />
  );
}

const meta = {
  title: "Examples/Local Reducer/CounterWorkbench",
  component: CounterWorkbenchStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default = {
};
