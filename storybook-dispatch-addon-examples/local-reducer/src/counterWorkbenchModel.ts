import type { DispatchLabelFormatter } from "storybook-dispatch-addon";

export type CounterWorkbenchState = {
  count: number;
  step: number;
  label: string;
  items: string[];
  lastUpdatedAt: string | null;
};

export type CounterWorkbenchAction =
  | { type: "increment"; payload?: { amount?: number } }
  | { type: "decrement"; payload?: { amount?: number } }
  | { type: "setStep"; payload?: { step?: number } }
  | { type: "rename"; payload?: { label?: string } }
  | { type: "addItem"; payload?: { item?: string } }
  | { type: "reset" }
  | { type: "@@INIT" };

export const counterWorkbenchInitialState: CounterWorkbenchState = {
  count: 2,
  step: 1,
  label: "Inventory",
  items: ["Tea", "Coffee"],
  lastUpdatedAt: null,
};

export function counterWorkbenchReducer(
  state: CounterWorkbenchState,
  action: CounterWorkbenchAction,
): CounterWorkbenchState {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        count: state.count + (action.payload?.amount ?? state.step),
        lastUpdatedAt: new Date().toISOString(),
      };
    case "decrement":
      return {
        ...state,
        count: state.count - (action.payload?.amount ?? state.step),
        lastUpdatedAt: new Date().toISOString(),
      };
    case "setStep":
      return {
        ...state,
        step: Number(action.payload?.step ?? 1),
        lastUpdatedAt: new Date().toISOString(),
      };
    case "rename":
      return {
        ...state,
        label: String(action.payload?.label ?? "Untitled"),
        lastUpdatedAt: new Date().toISOString(),
      };
    case "addItem":
      return {
        ...state,
        items: [...state.items, String(action.payload?.item ?? "New item")],
        lastUpdatedAt: new Date().toISOString(),
      };
    case "reset":
    case "@@INIT":
      return {
        ...counterWorkbenchInitialState,
        lastUpdatedAt: action.type === "reset" ? new Date().toISOString() : state.lastUpdatedAt,
      };
    default:
      return state;
  }
}

export const getCounterWorkbenchActionLabel: DispatchLabelFormatter<CounterWorkbenchAction> = (
  action,
  index,
) => {
  if (index === 0) {
    return "Initial";
  }

  return action.type;
};
