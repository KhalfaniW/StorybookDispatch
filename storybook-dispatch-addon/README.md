# storybook-dispatch-addon

`storybook-dispatch-addon` is a Storybook addon for reducer-driven stories.

It adds a panel that lets you:

- inspect a story's state timeline
- jump backward and forward through recorded steps
- dispatch JSON actions into the story from the Storybook UI
- expose seeded actions as quick templates

## Installation

```bash
pnpm add storybook-dispatch-addon
```

Add the preset to Storybook:

```ts
const config = {
  addons: ["storybook-dispatch-addon/preset.js"],
};

export default config;
```

## Usage

Stories opt in by using the provided hooks and helpers:

- `useDispatchTraceSession`
- `useStorybookDispatchBridge`
- `createDispatchStory`

Example:

```tsx
import { createDispatchStory } from "storybook-dispatch-addon";

const seedActions = [
  { type: "increment", payload: { amount: 3 } },
  { type: "setStep", payload: { step: 4 } },
];

export const ExampleStory = createDispatchStory({
  reducer,
  initialState,
  seedActions,
  getActionLabel,
  render: ({ state, dispatchAction }) => (
    <ExampleApp state={state} dispatchAction={dispatchAction} />
  ),
});
```

## Development

This package is developed in the Storybook Dispatch repository alongside runnable examples:

- [root README](/home/khalfani/Projects/StorybookDispatch/README.md)
- [local reducer example](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon-examples/local-reducer)
- [redux toolkit example](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon-examples/redux-toolkit)
