import { useDispatchTraceSession } from "../dispatch-trace/useDispatchTraceSession.js";
import { useStorybookDispatchBridge } from "./useStorybookDispatchBridge.js";

export function createDispatchStory({
  reducer,
  initialState,
  initAction,
  seedActions = [],
  getActionLabel,
  enabled = true,
  render,
}) {
  function DispatchStory(args, context) {
    const trace = useDispatchTraceSession({
      reducer,
      initialState,
      initAction,
      initialActions: seedActions,
      getActionLabel,
    });

    useStorybookDispatchBridge({
      enabled,
      state: trace.state,
      timeline: trace.timeline,
      currentIndex: trace.currentIndex,
      seedActions,
      dispatchAction: trace.dispatchAction,
      goToStep: trace.goToStep,
    });

    return render(trace, args, context);
  }

  DispatchStory.displayName = render.name || "DispatchStory";

  return DispatchStory;
}
