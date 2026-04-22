function getResponseMetrics(response) {
  const text = response || "";
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return {
    lines: lines.length,
    words
  };
}

export default function ModelResponsePanel({ response }) {
  const hasResponse = Boolean(response && response.trim());
  const metrics = getResponseMetrics(response);

  return (
    <section className="panel">
      <h2>Model Response</h2>

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
            background: "#ecfdf3",
            color: "#027a48",
            fontWeight: 700,
            fontSize: "0.8rem"
          }}
        >
          Repository-safe grounded answer
        </div>

        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Execution Summary</h3>

        <div style={{ color: "#344054", marginBottom: "1rem" }}>
          <div><strong>Output Type:</strong> Final answer text</div>
          <div><strong>Response Lines:</strong> {metrics.lines}</div>
          <div><strong>Response Words:</strong> {metrics.words}</div>
          <div><strong>Status:</strong> {hasResponse ? "Generated" : "No response available"}</div>
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
          This panel shows a neutral placeholder response that preserves the orchestration and grounding shape without exposing private business content.
        </div>

        {hasResponse ? (
          <div
            style={{
              padding: "1rem",
              border: "1px solid #d0d7de",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#101828",
              lineHeight: 1.6,
              whiteSpace: "pre-wrap"
            }}
          >
            {response}
          </div>
        ) : (
          <div style={{ color: "#667085" }}>No model response available.</div>
        )}
      </div>
    </section>
  );
}
