import type { Meta, StoryObj } from "@storybook/react";
import { createDispatchStory } from "storybook-dispatch-addon";
import { CounterWorkbench } from "./CounterWorkbench";
import {
  counterWorkbenchInitialState,
  counterWorkbenchReducer,
  getCounterWorkbenchActionLabel,
} from "./counterWorkbenchModel";
import type { CounterWorkbenchAction, CounterWorkbenchState } from "./counterWorkbenchModel";

const seedActions: CounterWorkbenchAction[] = [
  { type: "increment", payload: { amount: 3 } },
  { type: "setStep", payload: { step: 4 } },
  { type: "rename", payload: { label: "Dispatch Lab" } },
  { type: "addItem", payload: { item: "Espresso" } },
  { type: "reset" },
];

const CounterWorkbenchStory = createDispatchStory<CounterWorkbenchState, CounterWorkbenchAction>({
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
} satisfies Meta<typeof CounterWorkbenchStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
