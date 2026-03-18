# Storybook Dispatch

`storybook-dispatch-addon` is a Storybook addon for reducer-driven stories.

It adds a panel that lets you:

- inspect a story's state timeline
- jump backward and forward through recorded steps
- dispatch JSON actions into the story from the Storybook UI
- expose seeded actions as quick templates

The goal is to make reducer and state-machine style stories interactive and debuggable from inside Storybook, without building custom in-canvas debug UIs for every example.

## What It Does

The addon has two parts:

- a manager panel that renders the dispatch/timeline UI in Storybook
- a preview bridge that syncs story state, timeline entries, and commands between the canvas and the panel

Stories opt in by using the provided hooks:

- `useDispatchTraceSession`
- `useStorybookDispatchBridge`
- `createDispatchStory`

## How It Works

Inside a story, you create a trace session around your reducer state. That session tracks:

- the current state
- the timeline of actions and snapshots
- the selected step
- commands to dispatch actions or jump to another step

The preview bridge publishes that state to Storybook. The addon panel then shows the timeline, selected snapshot, and dispatch composer.

## Example

```tsx
import { createDispatchStory } from "storybook-dispatch-addon";

const seedActions = [
  { type: "increment", payload: { amount: 3 } },
  { type: "setStep", payload: { step: 4 } },
];

const ExampleStory = createDispatchStory({
  reducer,
  initialState,
  seedActions,
  getActionLabel,
  render: ({ state, dispatchAction }) => (
    <ExampleApp state={state} dispatchAction={dispatchAction} />
  ),
});
```

## Installation

Package name:

```bash
storybook-dispatch-addon
```

Storybook preset:

```ts
addons: ["storybook-dispatch-addon/preset.js"];
```

The addon is currently developed in this repository under:

- [storybook-dispatch-addon](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon)

## Repository Layout

- [storybook-dispatch-addon](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon): addon source
- [storybook-dispatch-addon-examples](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon-examples): example workspace
  - [storybook-dispatch-addon-examples/local-reducer](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon-examples/local-reducer): local reducer example
  - [storybook-dispatch-addon-examples/redux-toolkit](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon-examples/redux-toolkit): Redux Toolkit example

## Local Development

From [storybook-dispatch-addon-examples](/home/khalfani/Projects/StorybookDispatch/storybook-dispatch-addon-examples):

```bash
pnpm install
pnpm run storybook:local-reducer
pnpm run storybook:redux-toolkit
pnpm run storybook:all
pnpm test:e2e
```
