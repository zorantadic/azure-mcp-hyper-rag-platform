import { useState } from "react";
import { refreshIndex, submitQuestion } from "../api/orchestratorClient.js";
import ChatWindow from "../components/ChatWindow.jsx";
import RetrievalTracePanel from "../components/RetrievalTracePanel.jsx";
import McpTracePanel from "../components/McpTracePanel.jsx";
import ContextPackagePanel from "../components/ContextPackagePanel.jsx";
import ModelPromptPanel from "../components/ModelPromptPanel.jsx";
import ModelResponsePanel from "../components/ModelResponsePanel.jsx";

function getScenarioTitle(scenario) {
  if (scenario === "operational-issue") {
    return "Operational Issue";
  }

  if (scenario === "workflow-update") {
    return "Workflow Update";
  }

  return "Analysis Request";
}

const pageContainerStyle = {
  width: "100%",
  maxWidth: "1760px",
  margin: "0 auto",
  padding: "0 0.75rem 1rem",
  boxSizing: "border-box"
};

const topLayoutStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(320px, 0.88fr) minmax(520px, 1.25fr) minmax(360px, 0.9fr)",
  gap: "0.9rem",
  alignItems: "start"
};

const leftColumnStyle = {
  minWidth: 0,
  alignSelf: "start"
};

const middleColumnStyle = {
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const rightColumnStyle = {
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1rem"
};

const headerActionsStyle = {
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  alignItems: "flex-start"
};

const tabsContainerStyle = {
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
  marginBottom: "1rem"
};

function tabButtonStyle(isActive) {
  return {
    padding: "0.6rem 0.9rem",
    borderRadius: "8px",
    border: isActive ? "1px solid #7c3aed" : "1px solid #d0d7de",
    background: isActive ? "#f4f3ff" : "#ffffff",
    color: isActive ? "#5b21b6" : "#344054",
    fontWeight: 600,
    cursor: "pointer"
  };
}

function summaryCardStyle() {
  return {
    marginTop: "1rem",
    padding: "1rem",
    border: "1px solid #d0d7de",
    borderRadius: "10px",
    background: "#fcfcfd"
  };
}

function proofTrailPanelStyle() {
  return {
    padding: "1rem",
    border: "1px solid #d0d7de",
    borderRadius: "10px",
    background: "#ffffff"
  };
}

function overlayStyle() {
  return {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    zIndex: 1000
  };
}

function modalStyle() {
  return {
    width: "100%",
    maxWidth: "760px",
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #d0d7de",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.20)",
    padding: "1.25rem"
  };
}

function modalSectionStyle() {
  return {
    marginTop: "1rem",
    padding: "0.9rem",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fafafa"
  };
}

function modalButtonRowStyle() {
  return {
    marginTop: "1rem",
    display: "flex",
    gap: "0.75rem",
    justifyContent: "flex-end"
  };
}

function modalButtonStyle(variant = "secondary") {
  const isPrimary = variant === "primary";

  return {
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: isPrimary ? "1px solid #7c3aed" : "1px solid #d0d7de",
    background: isPrimary ? "#7c3aed" : "#ffffff",
    color: isPrimary ? "#ffffff" : "#344054",
    fontWeight: 600,
    cursor: "pointer"
  };
}

function payloadBoxStyle() {
  return {
    marginTop: "0.5rem",
    padding: "0.85rem",
    border: "1px solid #d0d7de",
    borderRadius: "8px",
    background: "#ffffff",
    whiteSpace: "pre-wrap",
    lineHeight: 1.6,
    color: "#101828"
  };
}

function getDefaultCapabilityState() {
  return {
    decision: {
      path: [],
      hyperRagRequested: false,
      mcpRequested: false,
      clarificationRequired: false
    },
    tools: [],
    execution: {
      executedTools: [],
      executedCapabilities: [],
      authorizationStatus: "not-needed",
      approval: {
        required: false,
        status: "not-required",
        reason: "",
        targetAction: "",
        details: null
      },
      dispatchChannel: "not-used",
      requestQueue: "",
      resultQueue: "",
      queueStatus: "not-used",
      actionOutcome: ""
    }
  };
}

function getApprovalDetails(capability) {
  return capability?.execution?.approval?.details || null;
}

function applyApprovalToCapability(capability) {
  const approvalDetails = getApprovalDetails(capability);
  const currentTools = Array.isArray(capability?.tools) ? capability.tools : [];
  const targetAction = capability?.execution?.approval?.targetAction || "";

  const updatedTools = currentTools.map((tool) => {
    if (targetAction === "Add internal follow-up note" && tool.toolName === "add-case-note") {
      return {
        ...tool,
        executionStatus: "executed",
        summary: "Internal follow-up note added to the placeholder workflow record."
      };
    }

    if (targetAction === "Update account status" && tool.toolName === "update-account-status") {
      return {
        ...tool,
        executionStatus: "executed",
        summary: "Account status updated for placeholder workspace."
      };
    }

    if (targetAction === "Update account status" && tool.toolName === "send-summary-email") {
      return {
        ...tool,
        executionStatus: "executed",
        summary: "Summary email sent to the placeholder workspace account owner."
      };
    }

    return tool;
  });

  if (targetAction === "Add internal follow-up note") {
    return {
      ...capability,
      execution: {
        ...capability.execution,
        executedTools: ["add-case-note"],
        executedCapabilities: ["hyper-rag", "mcp"],
        approval: {
          ...capability.execution.approval,
          status: "approved"
        },
        dispatchChannel: "Azure Service Bus",
        requestQueue: "mcp-action-requests",
        resultQueue: "mcp-action-results",
        queueStatus: "completed",
        actionOutcome:
          approvalDetails?.targetRecord
            ? "Internal follow-up note added to the placeholder workflow record."
            : capability.execution.actionOutcome || ""
      },
      tools: updatedTools
    };
  }

  if (targetAction === "Update account status") {
    return {
      ...capability,
      execution: {
        ...capability.execution,
        executedTools: ["update-account-status", "send-summary-email"],
        executedCapabilities: ["hyper-rag", "mcp"],
        approval: {
          ...capability.execution.approval,
          status: "approved"
        },
        dispatchChannel: "Azure Service Bus",
        requestQueue: "mcp-action-requests",
        resultQueue: "mcp-action-results",
        queueStatus: "completed",
        actionOutcome:
          "Account status updated to Executive Attention Needed and the responsible owner was notified."
      },
      tools: updatedTools
    };
  }

  return capability;
}

function ApprovalModal({ details, onApprove, onClose }) {
  const noteText = details?.proposedPayload?.noteText || "";
  const currentStatus = details?.proposedPayload?.currentStatus || "";
  const newStatus = details?.proposedPayload?.newStatus || "";
  const additionalAction = details?.proposedPayload?.additionalAction || "";
  const isStatusUpdate = Boolean(currentStatus || newStatus || additionalAction);

  return (
    <div style={overlayStyle()}>
      <div style={modalStyle()}>
        <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Approval Required</h2>
        <p style={{ marginTop: 0, color: "#475467" }}>
          Review the pending operational action before execution continues.
        </p>

        <div style={modalSectionStyle()}>
          <div><strong>Action:</strong> {details?.action || "-"}</div>
          <div><strong>Target system:</strong> {details?.targetSystem || "-"}</div>
          <div><strong>Target record:</strong> {details?.targetRecord || "-"}</div>
        </div>

        <div style={modalSectionStyle()}>
          <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Proposed Payload</h3>

          {isStatusUpdate ? (
            <>
              <div><strong>Current status:</strong> {currentStatus || "-"}</div>
              <div><strong>New status:</strong> {newStatus || "-"}</div>
              <div><strong>Additional downstream action:</strong> {additionalAction || "-"}</div>
            </>
          ) : (
            <>
              <div><strong>Note text:</strong></div>
              <div style={payloadBoxStyle()}>
                {noteText || "-"}
              </div>
            </>
          )}
        </div>

        <div style={modalButtonRowStyle()}>
          <button type="button" style={modalButtonStyle("secondary")} onClick={onClose}>
            Cancel
          </button>
          <button type="button" style={modalButtonStyle("primary")} onClick={onApprove}>
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [question, setQuestion] = useState("Summarize the current state of the request.");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingIndex, setIsRefreshingIndex] = useState(false);
  const [indexRefreshStatus, setIndexRefreshStatus] = useState("");
  const [coarseResults, setCoarseResults] = useState([]);
  const [fineResults, setFineResults] = useState([]);
  const [traceItems, setTraceItems] = useState([]);
  const [context, setContext] = useState({});
  const [modelPrompt, setModelPrompt] = useState("");
  const [modelResponse, setModelResponse] = useState("");
  const [capability, setCapability] = useState(getDefaultCapabilityState());
  const [scenarioTitle, setScenarioTitle] = useState("Analysis Request");
  const [activeTab, setActiveTab] = useState("capability");
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const chatResult = await submitQuestion({
        question
      });

      setAnswer(chatResult.answer || "");
      setCoarseResults(chatResult.coarseResults || []);
      setFineResults(chatResult.fineResults || []);
      setTraceItems(chatResult.retrievalTrace || []);
      setContext(chatResult.context || {});
      setModelPrompt(chatResult.modelPrompt || "");
      setModelResponse(chatResult.modelResponse || "");
      setCapability(chatResult.capability || getDefaultCapabilityState());
      setScenarioTitle(getScenarioTitle(chatResult.scenario || ""));
      setActiveTab("capability");
      setIsApprovalModalOpen(false);
    } catch (error) {
      setAnswer("Failed to load answer from orchestrator.");
      setCoarseResults([]);
      setFineResults([]);
      setTraceItems([]);
      setContext({});
      setModelPrompt("");
      setModelResponse("");
      setCapability(getDefaultCapabilityState());
      setScenarioTitle("Unknown Scenario");
      setIsApprovalModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshIndex = async () => {
    try {
      setIsRefreshingIndex(true);
      setIndexRefreshStatus("Refreshing indexing artifacts...");

      const result = await refreshIndex();
      const generatedCount = result?.pipeline?.generated?.length || 0;

      setIndexRefreshStatus(`Index refresh completed. Generated workflows: ${generatedCount}`);
    } catch (error) {
      setIndexRefreshStatus("Index refresh failed.");
    } finally {
      setIsRefreshingIndex(false);
    }
  };

  const handleReviewApproval = () => {
    setIsApprovalModalOpen(true);
  };

  const handleCloseApproval = () => {
    setIsApprovalModalOpen(false);
  };

  const handleApproveAction = () => {
    setCapability((current) => applyApprovalToCapability(current));
    setIsApprovalModalOpen(false);
  };

  const renderActiveProofPanel = () => {
    if (activeTab === "capability") {
      return <McpTracePanel mcp={capability} onReviewApproval={handleReviewApproval} />;
    }

    if (activeTab === "context") {
      return <ContextPackagePanel context={context} />;
    }

    if (activeTab === "request") {
      return <ModelPromptPanel prompt={modelPrompt} />;
    }

    return <ModelResponsePanel response={modelResponse} />;
  };

  const approvalDetails = getApprovalDetails(capability);

  return (
    <div className="app-shell">
      <div style={pageContainerStyle}>
        <header className="app-header">
          <h1>Hyper-RAG Demo</h1>
          <p>Hierarchical retrieval, grounded context, and model response trace.</p>

          <div style={headerActionsStyle}>
            <button onClick={handleRefreshIndex} disabled={isRefreshingIndex}>
              {isRefreshingIndex ? "Refreshing Index..." : "Refresh Index"}
            </button>
            {indexRefreshStatus ? <p style={{ margin: 0 }}>{indexRefreshStatus}</p> : null}
          </div>
        </header>

        <main className="app-main">
          <section style={topLayoutStyle}>
            <div style={leftColumnStyle}>
              <ChatWindow
                question={question}
                onQuestionChange={setQuestion}
                onSubmit={handleSubmit}
                answer={isSubmitting ? "Loading answer..." : answer}
              />

              <div style={summaryCardStyle()}>
                <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Execution Summary</h3>
                <div><strong>Workflow Focus:</strong> {scenarioTitle}</div>
                <div><strong>Capability Path:</strong> {(capability?.decision?.path || []).join(" -> ") || "-"}</div>
                <div><strong>Hyper-RAG Requested:</strong> {capability?.decision?.hyperRagRequested ? "Yes" : "No"}</div>
                <div><strong>MCP Requested:</strong> {capability?.decision?.mcpRequested ? "Yes" : "No"}</div>
              </div>
            </div>

            <div style={middleColumnStyle}>
              <RetrievalTracePanel
                scenarioTitle={scenarioTitle}
                coarseResults={coarseResults}
                fineResults={fineResults}
                items={traceItems}
              />
            </div>

            <div style={rightColumnStyle}>
              <div className="panel" style={proofTrailPanelStyle()}>
                <h2>Proof Trail</h2>

                <div style={tabsContainerStyle}>
                  <button
                    type="button"
                    style={tabButtonStyle(activeTab === "capability")}
                    onClick={() => setActiveTab("capability")}
                  >
                    Capability Trace
                  </button>
                  <button
                    type="button"
                    style={tabButtonStyle(activeTab === "context")}
                    onClick={() => setActiveTab("context")}
                  >
                    Grounded Context
                  </button>
                  <button
                    type="button"
                    style={tabButtonStyle(activeTab === "request")}
                    onClick={() => setActiveTab("request")}
                  >
                    Model Request
                  </button>
                  <button
                    type="button"
                    style={tabButtonStyle(activeTab === "response")}
                    onClick={() => setActiveTab("response")}
                  >
                    Model Response
                  </button>
                </div>

                {renderActiveProofPanel()}
              </div>
            </div>
          </section>
        </main>
      </div>

      {isApprovalModalOpen && approvalDetails ? (
        <ApprovalModal
          details={approvalDetails}
          onApprove={handleApproveAction}
          onClose={handleCloseApproval}
        />
      ) : null}
    </div>
  );
}