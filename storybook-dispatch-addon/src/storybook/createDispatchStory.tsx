import { useDispatchTraceSession } from "../dispatch-trace/useDispatchTraceSession";
import { useStorybookDispatchBridge } from "./useStorybookDispatchBridge";
import type { CreateDispatchStoryOptions, DispatchActionBase } from "../types";

export function createDispatchStory<
  TState,
  TAction extends DispatchActionBase,
  TArgs = unknown,
  TContext = unknown,
>({
  reducer,
  initialState,
  initAction,
  seedActions = [],
  getActionLabel,
  enabled = true,
  render,
}: CreateDispatchStoryOptions<TState, TAction, TArgs, TContext>) {
  function DispatchStory(args: TArgs, context: TContext) {
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
