function getPromptMetrics(prompt) {
  const text = prompt || "";
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return {
    lines: lines.length,
    words
  };
}

export default function ModelPromptPanel({ prompt }) {
  const hasPrompt = Boolean(prompt && prompt.trim());
  const metrics = getPromptMetrics(prompt);

  return (
    <section className="panel">
      <h2>Model Request</h2>

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
            color: "#1d4ed8",
            fontWeight: 700,
            fontSize: "0.8rem"
          }}
        >
          Grounded-only model input
        </div>

        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Execution Summary</h3>

        <div style={{ color: "#344054", marginBottom: "1rem" }}>
          <div><strong>Input Type:</strong> Grounded context package</div>
          <div><strong>Prompt Lines:</strong> {metrics.lines}</div>
          <div><strong>Prompt Words:</strong> {metrics.words}</div>
          <div><strong>Status:</strong> {hasPrompt ? "Prepared" : "No prompt available"}</div>
        </div>

        <div
          style={{
            padding: "0.85rem",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#475467",
            marginBottom: "1rem"
          }}
        >
          This panel shows the exact runtime request shape sent into the response model after retrieval and grounded context assembly.
        </div>

        {hasPrompt ? (
          <pre className="code-block" style={{ marginBottom: 0 }}>
            {prompt}
          </pre>
        ) : (
          <div style={{ color: "#667085" }}>No model request available.</div>
        )}
      </div>
    </section>
  );
}