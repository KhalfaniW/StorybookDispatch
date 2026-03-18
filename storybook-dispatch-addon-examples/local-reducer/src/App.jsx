import { useDispatchTraceSession } from "storybook-dispatch-addon";
import { CounterWorkbench } from "./CounterWorkbench";
import {
  counterWorkbenchInitialState,
  counterWorkbenchReducer,
  getCounterWorkbenchActionLabel,
} from "./counterWorkbenchModel";

export default function App() {
  const trace = useDispatchTraceSession({
    reducer: counterWorkbenchReducer,
    initialState: counterWorkbenchInitialState,
    getActionLabel: getCounterWorkbenchActionLabel,
  });

  return (
    <CounterWorkbench
      state={trace.state}
      dispatchAction={trace.dispatchAction}
      timeline={trace.timeline}
      currentIndex={trace.currentIndex}
    />
  );
}
