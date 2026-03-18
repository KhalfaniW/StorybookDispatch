import { CounterWorkbench } from "./CounterWorkbench";
import { createDispatchStory } from "storybook-dispatch-addon";
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

const CounterWorkbenchStory = createDispatchStory({
  reducer: counterWorkbenchReducer,
  initialState: counterWorkbenchInitialState,
  seedActions,
  getActionLabel: getCounterWorkbenchActionLabel,
  render: ({ state, dispatchAction }) => (
    <CounterWorkbench state={state} dispatchAction={dispatchAction} />
  ),
});

const meta = {
  title: "Examples/Local Reducer/CounterWorkbench",
  component: CounterWorkbenchStory,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Default = {};
