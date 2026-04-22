function metricBoxStyle() {
  return {
    minWidth: "150px",
    flex: "1 1 150px",
    border: "1px solid #d0d7de",
    borderRadius: "8px",
    padding: "0.75rem",
    background: "#ffffff"
  };
}

function renderMetricBox(label, value, accentColor) {
  return (
    <div style={metricBoxStyle()}>
      <div style={{ fontSize: "0.78rem", color: "#475467", marginBottom: "0.25rem" }}>
        {label}
      </div>
      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: accentColor }}>
        {value}
      </div>
    </div>
  );
}

function cardStyle(accentColor) {
  return {
    border: "1px solid #d0d7de",
    borderLeft: `4px solid ${accentColor}`,
    borderRadius: "10px",
    padding: "0.85rem 1rem",
    marginBottom: "0.75rem",
    background: "#ffffff",
    listStyle: "none"
  };
}

function sectionStyle() {
  return {
    marginTop: "1rem",
    padding: "0.9rem",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fafafa"
  };
}

function buttonStyle(variant = "secondary") {
  const isPrimary = variant === "primary";

  return {
    padding: "0.65rem 0.95rem",
    borderRadius: "8px",
    border: isPrimary ? "1px solid #7c3aed" : "1px solid #d0d7de",
    background: isPrimary ? "#7c3aed" : "#ffffff",
    color: isPrimary ? "#ffffff" : "#344054",
    fontWeight: 600,
    cursor: "pointer"
  };
}

function getPathLabel(path = []) {
  if (!Array.isArray(path) || path.length === 0) {
    return "No capability path recorded";
  }

  return path.join(" -> ");
}

function getApprovalColor(status) {
  if (status === "approved") {
    return "#027a48";
  }

  if (status === "not-required") {
    return "#475467";
  }

  if (status === "pending") {
    return "#b54708";
  }

  return "#b42318";
}

function getDisplayValue(value, fallback = "-") {
  return value && String(value).trim() ? value : fallback;
}

export default function McpTracePanel({ mcp, onReviewApproval }) {
  const decision = mcp?.decision || {};
  const tools = Array.isArray(mcp?.tools) ? mcp.tools : [];
  const execution = mcp?.execution || {};
  const approval = execution?.approval || {};
  const executedCapabilities = Array.isArray(execution?.executedCapabilities)
    ? execution.executedCapabilities
    : [];
  const executedTools = Array.isArray(execution?.executedTools)
    ? execution.executedTools
    : [];
  const portalProofTargets = Array.isArray(execution?.portalProofTargets)
    ? execution.portalProofTargets
    : [];
  const hasMcp = Boolean(decision?.mcpRequested);
  const accentColor = "#7c3aed";
  const canReviewApproval =
    approval?.required &&
    approval?.status === "pending" &&
    typeof onReviewApproval === "function";

  return (
    <section className="panel">
      <h2>Capability Trace</h2>

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
            background: "#f4f3ff",
            color: accentColor,
            fontWeight: 700,
            fontSize: "0.8rem"
          }}
        >
          Capability and action trace
        </div>

        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Decision Summary</h3>

        <div style={{ marginBottom: "1rem", color: "#344054" }}>
          <div><strong>Capability Path:</strong> {getPathLabel(decision.path)}</div>
          <div><strong>Hyper-RAG Requested:</strong> {decision.hyperRagRequested ? "Yes" : "No"}</div>
          <div><strong>MCP Requested:</strong> {decision.mcpRequested ? "Yes" : "No"}</div>
          <div><strong>Clarification Required:</strong> {decision.clarificationRequired ? "Yes" : "No"}</div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {renderMetricBox("Requested MCP Tools", tools.length, accentColor)}
          {renderMetricBox("Executed MCP Tools", executedTools.length, accentColor)}
          {renderMetricBox("Executed Capabilities", executedCapabilities.length, accentColor)}
        </div>
      </div>

      {!hasMcp ? (
        <div style={sectionStyle()}>
          <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Capability Outcome</h3>
          <div
            style={{
              padding: "0.85rem",
              border: "1px solid #d0d7de",
              borderLeft: `4px solid ${getApprovalColor(approval.status)}`,
              borderRadius: "10px",
              background: "#ffffff",
              color: "#344054"
            }}
          >
            <div><strong>MCP Requested:</strong> No</div>
            <div><strong>Approval Required:</strong> No</div>
            <div><strong>Authorization:</strong> Not needed</div>
            <div><strong>Outcome:</strong> Hyper-RAG handled this question without operational actions.</div>
          </div>
        </div>
      ) : (
        <>
          <div style={sectionStyle()}>
            <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Requested Tools</h3>

            {tools.length === 0 ? (
              <div style={{ color: "#667085" }}>No MCP tools were requested for this question.</div>
            ) : (
              <ul className="trace-list" style={{ paddingLeft: 0, marginBottom: 0 }}>
                {tools.map((tool) => (
                  <li key={tool.toolName} style={cardStyle(accentColor)}>
                    <div style={{ fontWeight: 700, fontSize: "1rem" }}>{tool.toolName}</div>
                    <div style={{ marginTop: "0.5rem", color: "#344054" }}>
                      <div><strong>Type:</strong> {tool.toolType || "-"}</div>
                      <div><strong>Target System:</strong> {tool.targetSystem || "-"}</div>
                      <div><strong>Status:</strong> {tool.executionStatus || "-"}</div>
                      <div><strong>Summary:</strong> {tool.summary || "-"}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={sectionStyle()}>
            <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Approval and Authorization</h3>

            <div
              style={{
                padding: "0.85rem",
                border: "1px solid #d0d7de",
                borderLeft: `4px solid ${getApprovalColor(approval.status)}`,
                borderRadius: "10px",
                background: "#ffffff",
                color: "#344054"
              }}
            >
              <div><strong>Approval Required:</strong> {approval.required ? "Yes" : "No"}</div>
              <div><strong>Approval Status:</strong> {approval.status || "not-required"}</div>
              <div><strong>Authorization Status:</strong> {execution.authorizationStatus || "not-needed"}</div>
              <div><strong>Target Action:</strong> {getDisplayValue(approval.targetAction)}</div>
              <div><strong>Reason:</strong> {getDisplayValue(approval.reason)}</div>
              <div><strong>Dispatch Channel:</strong> {getDisplayValue(execution.dispatchChannel, "not-used")}</div>
              <div><strong>Request Queue:</strong> {getDisplayValue(execution.requestQueue)}</div>
              <div><strong>Approval Queue:</strong> {getDisplayValue(execution.approvalQueue)}</div>
              <div><strong>Result Queue:</strong> {getDisplayValue(execution.resultQueue)}</div>
              <div><strong>Queue Status:</strong> {getDisplayValue(execution.queueStatus, "not-used")}</div>
              <div><strong>Action Outcome:</strong> {getDisplayValue(execution.actionOutcome)}</div>

              {canReviewApproval ? (
                <div style={{ marginTop: "1rem" }}>
                  <button type="button" style={buttonStyle("primary")} onClick={onReviewApproval}>
                    Review Approval
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {portalProofTargets.length > 0 ? (
            <div style={sectionStyle()}>
              <h3 style={{ marginTop: 0, marginBottom: "0.35rem" }}>Portal Proof Targets</h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#344054" }}>
                {portalProofTargets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}