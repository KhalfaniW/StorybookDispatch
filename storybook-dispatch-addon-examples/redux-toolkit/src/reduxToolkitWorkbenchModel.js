import { configureStore, createSlice } from "@reduxjs/toolkit";

export const reduxToolkitInitialState = {
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
    increment: (state, action) => {
      state.count += action.payload?.amount ?? state.step;
      state.lastUpdatedAt = new Date().toISOString();
    },
    decrement: (state, action) => {
      state.count -= action.payload?.amount ?? state.step;
      state.lastUpdatedAt = new Date().toISOString();
    },
    setStep: (state, action) => {
      state.step = Number(action.payload?.step ?? 1);
      state.lastUpdatedAt = new Date().toISOString();
    },
    rename: (state, action) => {
      state.label = String(action.payload?.label ?? "Untitled");
      state.lastUpdatedAt = new Date().toISOString();
    },
    addItem: (state, action) => {
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

export const reduxToolkitSeedActions = [
  ordersSlice.actions.increment({ amount: 4 }),
  ordersSlice.actions.setStep({ step: 3 }),
  ordersSlice.actions.rename({ label: "Orders Console" }),
  ordersSlice.actions.addItem({ item: "Packing Slip" }),
  ordersSlice.actions.markBusy(),
  ordersSlice.actions.reset(),
];

export function toolkitReducer(state, action) {
  const store = configureStore({
    reducer: ordersSlice.reducer,
    preloadedState: state,
  });
  store.dispatch(action);
  return store.getState();
}

export function getReduxToolkitActionLabel(action, index) {
  if (index === 0) {
    return "Initial";
  }

  return action.type;
}
