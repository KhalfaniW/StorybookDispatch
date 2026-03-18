import React, { useEffect, useMemo, useState } from "react";
import { AddonPanel } from "@storybook/components";
import { addons, types, useStorybookState } from "@storybook/manager-api";
import {
  DISPATCH_ADDON_ID,
  DISPATCH_COMMAND,
  DISPATCH_PANEL_ID,
  DISPATCH_STATE_SYNC,
} from "./storybook/dispatchBridgeEvents.js";

function formatJson(value) {
  return JSON.stringify(value, null, 2);
}

function formatTimestamp(value) {
  if (!value) {
    return "Ready";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function DispatchPanel({ active }) {
  const { storyId } = useStorybookState();
  const [draft, setDraft] = useState(`{
  "type": "increment",
  "payload": {
    "amount": 1
  }
}`);
  const [error, setError] = useState("");
  const [store, setStore] = useState({});

  useEffect(() => {
    const channel = addons.getChannel();

    const handleStateSync = ({
      storyId: nextStoryId,
      state,
      timeline,
      currentIndex,
      seedActions,
    }) => {
      setStore((current) => ({
        ...current,
        [nextStoryId]: {
          state,
          timeline: timeline ?? [],
          currentIndex: currentIndex ?? 0,
          seedActions: seedActions ?? [],
        },
      }));
    };

    channel.on(DISPATCH_STATE_SYNC, handleStateSync);

    return () => {
      channel.off(DISPATCH_STATE_SYNC, handleStateSync);
    };
  }, []);

  const entry = store[storyId] ?? {
    state: null,
    timeline: [],
    currentIndex: 0,
    seedActions: [],
  };
  const timeline = entry.timeline;
  const selectedIndex = Math.max(0, Math.min(entry.currentIndex, Math.max(timeline.length - 1, 0)));
  const selectedStep = timeline[selectedIndex] ?? null;
  const templates = useMemo(() => entry.seedActions ?? [], [entry.seedActions]);

  const sendCommand = (command) => {
    addons.getChannel().emit(DISPATCH_COMMAND, { storyId, command });
  };

  const submitDraft = () => {
    try {
      const action = JSON.parse(draft);
      if (!action || typeof action !== "object" || Array.isArray(action)) {
        throw new Error("Action must be a JSON object.");
      }
      if (typeof action.type !== "string" || !action.type) {
        throw new Error('Action requires a string "type".');
      }

      sendCommand({ kind: "dispatch", action });
      setError("");
    } catch (nextError) {
      setError(nextError.message);
    }
  };

  const goToStep = (index) => {
    sendCommand({ kind: "gotoStep", index });
  };

  return (
    <AddonPanel active={active}>
      <div style={panelStyles.shell}>
        <section style={panelStyles.section}>
          <div style={panelStyles.sectionHeader}>
            <div>
              <strong>Timeline</strong>
              <div style={panelStyles.sectionText}>
                Move the story to any captured step.
              </div>
            </div>
            <div style={panelStyles.timelineMeta}>
              <span style={panelStyles.badge}>
                {timeline.length > 0 ? `${timeline.length - 1} step(s)` : "No steps"}
              </span>
              <span style={panelStyles.badge}>{storyId ?? "No story selected"}</span>
            </div>
            <div style={panelStyles.buttonRow}>
              <button
                style={panelStyles.navButton}
                disabled={selectedIndex <= 0}
                onClick={() => goToStep(selectedIndex - 1)}
              >
                Back
              </button>
              <button
                style={panelStyles.navButton}
                disabled={selectedIndex >= timeline.length - 1}
                onClick={() => goToStep(selectedIndex + 1)}
              >
                Forward
              </button>
            </div>
          </div>

          <div style={panelStyles.timelineRail}>
            {timeline.length === 0 ? (
              <div style={panelStyles.emptyText}>Waiting for story timeline.</div>
            ) : null}
            {timeline.map((step, index) => (
              <button
                key={step.id ?? `step-${index}`}
                style={{
                  ...panelStyles.stepCard,
                  ...(index === selectedIndex ? panelStyles.stepCardActive : {}),
                }}
                onClick={() => goToStep(index)}
              >
                <div style={panelStyles.stepIndex}>Step {index}</div>
                <div style={panelStyles.stepLabel}>{step.label}</div>
                <div style={panelStyles.stepMeta}>
                  {formatTimestamp(step.timestamp)}
                </div>
              </button>
            ))}
          </div>
        </section>

        <div style={panelStyles.grid}>
          <section style={panelStyles.section}>
            <div style={panelStyles.sectionHeader}>
              <div>
                <strong>Dispatch composer</strong>
                <div style={panelStyles.sectionText}>
                  Send a new action from the currently selected timeline step.
                </div>
              </div>
            </div>
            <textarea
              style={panelStyles.textarea}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div style={panelStyles.buttonRow}>
              <button style={panelStyles.primaryButton} onClick={submitDraft}>
                Dispatch action
              </button>
            </div>
            {error ? <div style={panelStyles.errorText}>{error}</div> : null}

            <div style={panelStyles.templateGrid}>
              {templates.length === 0 ? (
                <div style={panelStyles.emptyText}>No story seed actions provided.</div>
              ) : null}
              {templates.map((action, index) => (
                <button
                  key={`${action.type}-${index}`}
                  style={panelStyles.templateCard}
                  onClick={() => setDraft(formatJson(action))}
                >
                  <div style={panelStyles.templateTitle}>{action.type}</div>
                  <pre style={panelStyles.codeBlock}>{formatJson(action)}</pre>
                </button>
              ))}
            </div>
          </section>

          <section style={panelStyles.section}>
            <div style={panelStyles.sectionHeader}>
              <div>
                <strong>Selected step</strong>
                <div style={panelStyles.sectionText}>
                  Action payload and state snapshot for the active timeline step.
                </div>
              </div>
            </div>

            <div style={panelStyles.snapshotCard}>
              <div style={panelStyles.snapshotHeader}>
                <span style={panelStyles.snapshotLabel}>
                  {selectedStep?.label ?? "No step selected"}
                </span>
                <span style={panelStyles.snapshotMeta}>
                  {formatTimestamp(selectedStep?.timestamp)}
                </span>
              </div>
              <pre style={panelStyles.codeBlock}>
                {selectedStep ? formatJson(selectedStep.action) : "No action captured yet."}
              </pre>
            </div>

            <div style={panelStyles.snapshotCard}>
              <div style={panelStyles.snapshotHeader}>
                <span style={panelStyles.snapshotLabel}>State snapshot</span>
                <span style={panelStyles.snapshotMeta}>
                  {selectedIndex === entry.currentIndex ? "Loaded in canvas" : "Inspecting"}
                </span>
              </div>
              <pre style={panelStyles.codeBlock}>
                {entry.state ? formatJson(entry.state) : "No state snapshot yet."}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </AddonPanel>
  );
}

const panelStyles = {
  shell: {
    minHeight: "100%",
    padding: 12,
    display: "grid",
    gap: 12,
    background: "#2b2b2b",
    color: "#d4d4d4",
  },
  badge: {
    padding: "6px 10px",
    borderRadius: 4,
    background: "#3c3c3c",
    border: "1px solid #4a4a4a",
    fontSize: 12,
    color: "#c5c5c5",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 12,
  },
  section: {
    display: "grid",
    gap: 12,
    padding: 12,
    borderRadius: 6,
    border: "1px solid #3a3a3a",
    background: "#252526",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  timelineMeta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginLeft: "auto",
  },
  sectionText: {
    marginTop: 4,
    fontSize: 12,
    color: "#9da1a6",
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  navButton: {
    padding: "8px 12px",
    borderRadius: 4,
    border: "1px solid #4c4c4c",
    background: "#3a3d41",
    color: "#d4d4d4",
    cursor: "pointer",
  },
  primaryButton: {
    padding: "8px 12px",
    borderRadius: 4,
    border: "1px solid #0e639c",
    background: "#0e639c",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
  timelineRail: {
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "minmax(150px, 180px)",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 4,
  },
  stepCard: {
    display: "grid",
    gap: 6,
    padding: 10,
    textAlign: "left",
    borderRadius: 4,
    border: "1px solid #3f3f46",
    background: "#1e1e1e",
    color: "#d4d4d4",
    cursor: "pointer",
  },
  stepCardActive: {
    border: "1px solid #0e639c",
    background: "#094771",
  },
  stepIndex: {
    fontSize: 11,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#75beff",
  },
  stepLabel: {
    fontSize: 15,
    fontWeight: 700,
  },
  stepMeta: {
    fontSize: 12,
    color: "#9da1a6",
  },
  textarea: {
    width: "100%",
    minHeight: 160,
    padding: 12,
    borderRadius: 4,
    border: "1px solid #3f3f46",
    background: "#1e1e1e",
    color: "#d4d4d4",
    resize: "vertical",
    fontFamily: "IBM Plex Mono, Menlo, monospace",
    fontSize: 12,
    lineHeight: 1.5,
  },
  templateGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 8,
  },
  templateCard: {
    display: "grid",
    gap: 6,
    padding: 10,
    textAlign: "left",
    borderRadius: 4,
    border: "1px solid #3f3f46",
    background: "#1e1e1e",
    color: "#d4d4d4",
    cursor: "pointer",
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#75beff",
  },
  snapshotCard: {
    display: "grid",
    gap: 10,
    padding: 12,
    borderRadius: 4,
    border: "1px solid #3f3f46",
    background: "#1e1e1e",
  },
  snapshotHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  snapshotLabel: {
    fontSize: 15,
    fontWeight: 700,
  },
  snapshotMeta: {
    fontSize: 12,
    color: "#9da1a6",
  },
  codeBlock: {
    margin: 0,
    padding: 12,
    borderRadius: 4,
    background: "#252526",
    color: "#d4d4d4",
    fontFamily: "IBM Plex Mono, Menlo, monospace",
    fontSize: 12,
    lineHeight: 1.55,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  emptyText: {
    color: "#9da1a6",
    fontSize: 13,
    padding: "8px 0",
  },
  errorText: {
    color: "#f48771",
    fontSize: 13,
  },
};

addons.register(DISPATCH_ADDON_ID, () => {
  addons.add(DISPATCH_PANEL_ID, {
    title: "Dispatch Trace",
    type: types.PANEL,
    render: ({ active, key }) => <DispatchPanel key={key} active={active} />,
  });
});
