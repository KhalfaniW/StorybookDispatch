export const counterWorkbenchInitialState = {
  count: 2,
  step: 1,
  label: "Inventory",
  items: ["Tea", "Coffee"],
  lastUpdatedAt: null,
};

export function counterWorkbenchReducer(state, action) {
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
      return {
        ...counterWorkbenchInitialState,
        lastUpdatedAt: new Date().toISOString(),
      };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

export function getCounterWorkbenchActionLabel(action, index) {
  if (index === 0) {
    return "Initial";
  }

  return action.type;
}
