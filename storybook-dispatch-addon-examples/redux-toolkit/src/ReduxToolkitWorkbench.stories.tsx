import type { Meta, StoryObj } from "@storybook/react";
import { createDispatchStory } from "storybook-dispatch-addon";
import { ReduxToolkitWorkbench } from "./ReduxToolkitWorkbench";
import {
  getReduxToolkitActionLabel,
  reduxToolkitInitialState,
  reduxToolkitSeedActions,
  toolkitReducer,
} from "./reduxToolkitWorkbenchModel";
import type { ReduxToolkitAction, ReduxToolkitWorkbenchState } from "./reduxToolkitWorkbenchModel";

const seedActions = reduxToolkitSeedActions;

const ReduxToolkitWorkbenchStory = createDispatchStory<
  ReduxToolkitWorkbenchState,
  ReduxToolkitAction
>({
  reducer: toolkitReducer,
  initialState: reduxToolkitInitialState,
  seedActions,
  getActionLabel: getReduxToolkitActionLabel,
  render: ({ state, dispatchAction }) => (
    <ReduxToolkitWorkbench state={state} dispatchAction={dispatchAction} />
  ),
});

const meta = {
  title: "Examples/Redux Toolkit/ReduxToolkitWorkbench",
  component: ReduxToolkitWorkbenchStory,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ReduxToolkitWorkbenchStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
