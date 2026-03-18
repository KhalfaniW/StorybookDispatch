import { ReduxToolkitWorkbench } from "./ReduxToolkitWorkbench";
import { createDispatchStory } from "storybook-dispatch-addon";
import {
  getReduxToolkitActionLabel,
  reduxToolkitInitialState,
  reduxToolkitSeedActions,
  toolkitReducer,
} from "./reduxToolkitWorkbenchModel.js";

const seedActions = reduxToolkitSeedActions;

const ReduxToolkitWorkbenchStory = createDispatchStory({
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
};

export default meta;

export const Default = {};
