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

function CounterWorkbenchStory({ seedActions: storySeedActions }) {
  const trace = useDispatchTraceSession({
    reducer: counterWorkbenchReducer,
    initialState: counterWorkbenchInitialState,
    initialActions: storySeedActions,
    getActionLabel: getCounterWorkbenchActionLabel,
  });
  const seededActionsKey = JSON.stringify(storySeedActions ?? []);
  const appliedSeedKeyRef = useRef(null);

  useEffect(() => {
    if (!storySeedActions?.length) {
      return;
    }

    if (trace.timeline.length > 1) {
      appliedSeedKeyRef.current = seededActionsKey;
      return;
    }

    if (appliedSeedKeyRef.current === seededActionsKey) {
      return;
    }

    for (const action of storySeedActions) {
      trace.dispatchAction(action);
    }

    appliedSeedKeyRef.current = seededActionsKey;
  }, [seededActionsKey, storySeedActions, trace]);

  useStorybookDispatchBridge({
    enabled: true,
    state: trace.state,
    timeline: trace.timeline,
    currentIndex: trace.currentIndex,
    seedActions: storySeedActions,
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
  args: {
    seedActions,
  },
};
