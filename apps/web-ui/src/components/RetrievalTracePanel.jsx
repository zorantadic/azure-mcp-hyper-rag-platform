function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toFixed(2);
}

function getWorkflowAccent(title) {
  if (title === "Operational Issue") {
    return "#1d4ed8";
  }

  if (title === "Workflow Update") {
    return "#7c3aed";
  }

  return "#027a48";
}

function renderMetricBox(label, value, accentColor) {
  return (
    <div
      style={{
        minWidth: "150px",
        flex: "1 1 150px",
        border: "1px solid #d0d7de",
        borderRadius: "8px",
        padding: "0.75rem",
        background: "#ffffff"
      }}
    >
      <div style={{ fontSize: "0.78rem", color: "#475467", marginBottom: "0.25rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: accentColor }}>
        {value}
      </div>
    </div>
  );
}

function renderItem(item, accentColor, scoreLabel) {
  return (
    <li
      key={item.chunkId || item.documentId || item.fileName}
      style={{
        border: "1px solid #d0d7de",
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: "10px",
        padding: "0.85rem 1rem",
        marginBottom: "0.75rem",
        background: "#ffffff",
        listStyle: "none"
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "1rem" }}>{item.fileName}</div>
      <div style={{ marginTop: "0.5rem", color: "#344054" }}>
        {item.title ? <div><strong>Document Title:</strong> {item.title}</div> : null}
        {item.topic ? <div><strong>Topic:</strong> {item.topic}</div> : null}
        {item.level ? <div><strong>Document Level:</strong> {item.level}</div> : null}
        {item.vectorStatus ? <div><strong>Vector Status:</strong> {item.vectorStatus}</div> : null}
        <div><strong>{scoreLabel}:</strong> {formatScore(item.coarseScore ?? item.fineScore)}</div>
      </div>
    </li>
  );
}

export default function RetrievalTracePanel({
  scenarioTitle,
  coarseResults = [],
  fineResults = [],
  items = []
}) {
  const hasTraceData = coarseResults.length > 0 || fineResults.length > 0 || items.length > 0;

  if (!hasTraceData) {
    return (
      <section className="panel">
        <h2>Retrieval Trace</h2>
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            border: "1px solid #d0d7de",
            borderRadius: "10px",
            background: "#fcfcfd",
            color: "#475467"
          }}
        >
          Submit a question to generate the retrieval trace.
        </div>
      </section>
    );
  }

  const accentColor = getWorkflowAccent(scenarioTitle);

  return (
    <section className="panel">
      <h2>Retrieval Trace</h2>
      <p>{scenarioTitle}</p>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          border: "1px solid #d0d7de",
          borderRadius: "10px",
          background: "#fcfcfd"
        }}
      >
        <div
          style={{
            display: "inline-block",
            marginBottom: "0.75rem",
            padding: "0.2rem 0.55rem",
            borderRadius: "999px",
            background: "#f2f4f7",
            color: accentColor,
            fontWeight: 700,
            fontSize: "0.8rem"
          }}
        >
          Repository-safe retrieval path
        </div>

        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Knowledge-Store Path</h3>
        <div style={{ marginBottom: "1rem", color: "#344054" }}>
          <div><strong>Root Entity:</strong> Placeholder workspace</div>
          <div><strong>Focus:</strong> {scenarioTitle || "Analysis Request"}</div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {renderMetricBox("Related Documents", coarseResults.length, accentColor)}
          {renderMetricBox("Relation-Aware Narrowing", fineResults.length, accentColor)}
          {renderMetricBox("Selected Evidence", items.length, accentColor)}
        </div>
      </div>

      <div style={{ marginTop: "1rem", padding: "0.9rem", border: "1px solid #e5e7eb", borderRadius: "10px", background: "#fafafa" }}>
        <h3 style={{ marginTop: 0 }}>Step 1 - Related Documents</h3>
        <ul style={{ padding: 0, margin: "0.75rem 0 0" }}>
          {coarseResults.map((item) => renderItem(item, accentColor, "Document Score"))}
        </ul>
      </div>

      <div style={{ marginTop: "1rem", padding: "0.9rem", border: "1px solid #e5e7eb", borderRadius: "10px", background: "#fafafa" }}>
        <h3 style={{ marginTop: 0 }}>Step 2 - Retrieval Narrowing</h3>
        <ul style={{ padding: 0, margin: "0.75rem 0 0" }}>
          {fineResults.map((item) => renderItem(item, accentColor, "Chunk Score"))}
        </ul>
      </div>

      <div style={{ marginTop: "1rem", padding: "0.9rem", border: "1px solid #e5e7eb", borderRadius: "10px", background: "#fafafa" }}>
        <h3 style={{ marginTop: 0 }}>Step 3 - Selected Evidence</h3>
        <ul style={{ padding: 0, margin: "0.75rem 0 0" }}>
          {items.map((item) => renderItem(item, accentColor, "Selected Score"))}
        </ul>
      </div>
    </section>
  );
}
