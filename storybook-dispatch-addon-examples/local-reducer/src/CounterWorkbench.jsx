import { useMemo } from "react";

export function CounterWorkbench({ state, dispatchAction }) {
  const quickStats = useMemo(
    () => [
      { label: "Count", value: state.count },
      { label: "Step", value: state.step },
      { label: "Items", value: state.items.length },
    ],
    [state],
  );

  return (
    <div className="app-shell">
      <section className="hero-card">
        <div className="eyebrow">Reducer playground</div>
        <h1>{state.label}</h1>
        <p>
          Drive reducer actions, then move backward or forward through the
          timeline to inspect each state transition.
        </p>

        <div className="stat-grid">
          {quickStats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>

        <div className="button-row">
          <button onClick={() => dispatchAction({ type: "decrement" })}>- Step</button>
          <button onClick={() => dispatchAction({ type: "increment" })}>+ Step</button>
          <button
            onClick={() =>
              dispatchAction({
                type: "addItem",
                payload: { item: `Item ${state.items.length + 1}` },
              })
            }
          >
            Add item
          </button>
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
