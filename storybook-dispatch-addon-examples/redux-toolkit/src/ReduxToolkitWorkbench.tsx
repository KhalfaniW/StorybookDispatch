import { useMemo } from "react";
import type { DispatchTraceSession } from "storybook-dispatch-addon";
import type { ReduxToolkitAction, ReduxToolkitWorkbenchState } from "./reduxToolkitWorkbenchModel";

type ReduxToolkitWorkbenchProps = Pick<
  DispatchTraceSession<ReduxToolkitWorkbenchState, ReduxToolkitAction>,
  "state" | "dispatchAction"
>;

export function ReduxToolkitWorkbench({ state, dispatchAction }: ReduxToolkitWorkbenchProps) {
  const quickStats = useMemo(
    () => [
      { label: "Count", value: state.count },
      { label: "Step", value: state.step },
      { label: "Items", value: state.items.length },
      { label: "Status", value: state.status },
    ],
    [state],
  );

  return (
    <div className="app-shell">
      <section className="hero-card">
        <div className="eyebrow">Redux Toolkit playground</div>
        <h1>{state.label}</h1>
        <p>
          This example uses Redux Toolkit actions and reducers while exposing the
          same timeline controls to the Storybook addon.
        </p>

        <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {quickStats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>

        <div className="button-row">
          <button onClick={() => dispatchAction({ type: "orders/decrement" })}>- Step</button>
          <button onClick={() => dispatchAction({ type: "orders/increment" })}>+ Step</button>
          <button onClick={() => dispatchAction({ type: "orders/markBusy" })}>Mark busy</button>
        </div>

        <div className="surface-panel">
          <div className="surface-panel-header">
            <span>Current state</span>
            <small>{state.lastUpdatedAt ?? "No reducer updates yet"}</small>
          </div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      </section>
    </div>
  );
}
