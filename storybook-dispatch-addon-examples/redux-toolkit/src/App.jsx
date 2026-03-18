import { useDispatchTraceSession } from "storybook-dispatch-addon";
import { ReduxToolkitWorkbench } from "./ReduxToolkitWorkbench";
import {
  getReduxToolkitActionLabel,
  reduxToolkitInitialState,
  toolkitReducer,
} from "./reduxToolkitWorkbenchModel";

export default function App() {
  const trace = useDispatchTraceSession({
    reducer: toolkitReducer,
    initialState: reduxToolkitInitialState,
    getActionLabel: getReduxToolkitActionLabel,
  });

  return (
    <ReduxToolkitWorkbench
      state={trace.state}
      dispatchAction={trace.dispatchAction}
    />
  );
}
