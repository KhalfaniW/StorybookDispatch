import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DispatchLabelFormatter } from "storybook-dispatch-addon";

export type ReduxToolkitWorkbenchState = {
  count: number;
  step: number;
  status: "idle" | "busy";
  label: string;
  items: string[];
  lastUpdatedAt: string | null;
};

export type ReduxToolkitAction =
  | { type: "orders/increment"; payload?: { amount?: number } }
  | { type: "orders/decrement"; payload?: { amount?: number } }
  | { type: "orders/setStep"; payload?: { step?: number } }
  | { type: "orders/rename"; payload?: { label?: string } }
  | { type: "orders/addItem"; payload?: { item?: string } }
  | { type: "orders/markBusy" }
  | { type: "orders/reset" }
  | { type: "@@INIT" };

export const reduxToolkitInitialState: ReduxToolkitWorkbenchState = {
  count: 5,
  step: 2,
  status: "idle",
  label: "Orders",
  items: ["Invoice", "Receipt"],
  lastUpdatedAt: null,
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState: reduxToolkitInitialState,
  reducers: {
    increment: (state, action: PayloadAction<{ amount?: number } | undefined>) => {
      state.count += action.payload?.amount ?? state.step;
      state.lastUpdatedAt = new Date().toISOString();
    },
    decrement: (state, action: PayloadAction<{ amount?: number } | undefined>) => {
      state.count -= action.payload?.amount ?? state.step;
      state.lastUpdatedAt = new Date().toISOString();
    },
    setStep: (state, action: PayloadAction<{ step?: number } | undefined>) => {
      state.step = Number(action.payload?.step ?? 1);
      state.lastUpdatedAt = new Date().toISOString();
    },
    rename: (state, action: PayloadAction<{ label?: string } | undefined>) => {
      state.label = String(action.payload?.label ?? "Untitled");
      state.lastUpdatedAt = new Date().toISOString();
    },
    addItem: (state, action: PayloadAction<{ item?: string } | undefined>) => {
      state.items.push(String(action.payload?.item ?? "New item"));
      state.lastUpdatedAt = new Date().toISOString();
    },
    markBusy: (state) => {
      state.status = "busy";
      state.lastUpdatedAt = new Date().toISOString();
    },
    reset: () => ({
      ...reduxToolkitInitialState,
      lastUpdatedAt: new Date().toISOString(),
    }),
  },
});

export const reduxToolkitSeedActions: ReduxToolkitAction[] = [
  ordersSlice.actions.increment({ amount: 4 }),
  ordersSlice.actions.setStep({ step: 3 }),
  ordersSlice.actions.rename({ label: "Orders Console" }),
  ordersSlice.actions.addItem({ item: "Packing Slip" }),
  ordersSlice.actions.markBusy(),
  ordersSlice.actions.reset(),
];

export function toolkitReducer(
  state: ReduxToolkitWorkbenchState,
  action: ReduxToolkitAction,
): ReduxToolkitWorkbenchState {
  if (action.type === "@@INIT") {
    return state;
  }

  const store = configureStore({
    reducer: ordersSlice.reducer,
    preloadedState: state,
  });
  store.dispatch(action);
  return store.getState();
}

export const getReduxToolkitActionLabel: DispatchLabelFormatter<ReduxToolkitAction> = (
  action,
  index,
) => {
  if (index === 0) {
    return "Initial";
  }

  return action.type;
};
