import express from "express";

const router = express.Router();

const RETRIEVAL_API_BASE_URL =
  process.env.RETRIEVAL_API_BASE_URL || "http://localhost:4100";
const INDEXING_PIPELINE_BASE_URL =
  process.env.INDEXING_PIPELINE_BASE_URL || "http://localhost:4300";

function inferWorkflow(question) {
  const normalized = String(question || "").toLowerCase();

  if (normalized.includes("incident") || normalized.includes("ticket") || normalized.includes("outage")) {
    return "operational-issue";
  }

  if (normalized.includes("approval") || normalized.includes("change") || normalized.includes("update")) {
    return "workflow-update";
  }

  return "analysis-request";
}

function getWorkflowTitle(workflow) {
  if (workflow === "operational-issue") {
    return "Operational Issue";
  }

  if (workflow === "workflow-update") {
    return "Workflow Update";
  }

  return "Analysis Request";
}

function buildCapability(workflow) {
  return {
    decision: {
      path: workflow === "workflow-update" ? ["hyper-rag", "mcp"] : ["hyper-rag"],
      hyperRagRequested: true,
      mcpRequested: workflow === "workflow-update",
      clarificationRequired: false
    },
    tools:
      workflow === "workflow-update"
        ? [
            {
              toolName: "request-approval",
              executionStatus: "planned",
              summary: "Placeholder workflow step retained for repository structure."
            }
          ]
        : [],
    execution: {
      executedTools: [],
      executedCapabilities: workflow === "workflow-update" ? ["hyper-rag", "mcp"] : ["hyper-rag"],
      authorizationStatus: workflow === "workflow-update" ? "pending-review" : "not-needed",
      approval: {
        required: workflow === "workflow-update",
        status: workflow === "workflow-update" ? "placeholder" : "not-required",
        reason: workflow === "workflow-update" ? "Public repository build uses a neutral placeholder workflow." : "",
        targetAction: workflow === "workflow-update" ? "Review requested operational change" : "",
        details:
          workflow === "workflow-update"
            ? {
                action: "Review requested operational change",
                targetSystem: "Placeholder system",
                targetRecord: "placeholder-record",
                proposedPayload: {
                  noteText: "Replace with a real workflow payload in your private environment."
                }
              }
            : null
      },
      dispatchChannel: workflow === "workflow-update" ? "placeholder" : "not-used",
      requestQueue: workflow === "workflow-update" ? "placeholder-request-queue" : "",
      resultQueue: workflow === "workflow-update" ? "placeholder-result-queue" : "",
      approvalQueue: workflow === "workflow-update" ? "placeholder-approval-queue" : "",
      queueStatus: workflow === "workflow-update" ? "placeholder" : "not-used",
      actionOutcome: workflow === "workflow-update" ? "No live action is performed in the public-shareable build." : "",
      portalProofTargets: []
    }
  };
}

function buildContext(workflow, question) {
  const workflowTitle = getWorkflowTitle(workflow);

  return {
    contextPackageId: `ctx-${workflow}`,
    scenario: workflow,
    account: "Placeholder workspace",
    focus: workflowTitle,
    riskLevel: workflow === "operational-issue" ? "medium" : "informational",
    facts: {
      note: "Business-specific source content was removed from the public repository package.",
      nextStep: "Replace placeholder data sources and prompts with environment-specific artifacts."
    },
    evidenceExcerpts: [
      {
        chunkId: `${workflow}-chunk-001`,
        fileName: "placeholder-source.md",
        documentTitle: "Placeholder source document",
        topic: workflow,
        sourcePath: `data/placeholders/${workflow}.md`,
        excerpt: "This public-shareable package keeps the architecture and service boundaries while removing private operational payloads and business-specific content."
      }
    ],
    signals: [
      "Repository-safe placeholder context is active",
      "Replace placeholder artifacts with private environment data"
    ],
    evidence: ["placeholder-source.md"],
    question
  };
}

function buildModelPrompt(workflow, question, context) {
  return [
    "System: You are operating in a public-shareable reference build.",
    `Workflow: ${workflow}`,
    `Question: ${question}`,
    `Focus: ${context.focus}`,
    "Instruction: Use retrieved evidence and environment-specific data once connected."
  ].join("\n");
}

function buildModelResponse(workflow) {
  const workflowTitle = getWorkflowTitle(workflow);

  return [
    `${workflowTitle} summary`,
    "",
    "This response is a neutral placeholder designed for the public repository package.",
    "It confirms the orchestration pattern, grounded context packaging, and trace surfaces without exposing private business content or business data.",
    "",
    "Replace the placeholder retrieval outputs, model prompt content, and connected system integrations in your private implementation environment."
  ].join("\n");
}

function buildRetrievalTrace(workflow) {
  return [
    {
      chunkId: `${workflow}-chunk-001`,
      fileName: "placeholder-source.md",
      documentTitle: "Placeholder source document",
      topic: workflow,
      sourcePath: `data/placeholders/${workflow}.md`,
      excerpt: "Neutral placeholder evidence retained to show the retrieval shape of the platform.",
      fineScore: 0.91,
      vectorStatus: "placeholder"
    }
  ];
}

function buildCoarseResults(workflow) {
  return [
    {
      documentId: `${workflow}-doc-001`,
      fileName: "placeholder-source.md",
      title: "Placeholder source document",
      level: "document",
      coarseScore: 0.88
    }
  ];
}

function buildFineResults(workflow) {
  return [
    {
      chunkId: `${workflow}-chunk-001`,
      fileName: "placeholder-source.md",
      topic: workflow,
      vectorStatus: "placeholder",
      fineScore: 0.91
    }
  ];
}

async function refreshIndexingArtifacts() {
  try {
    const response = await fetch(`${INDEXING_PIPELINE_BASE_URL}/run`, { method: "POST" });

    if (!response.ok) {
      throw new Error("Index refresh request failed.");
    }

    return await response.json();
  } catch {
    return {
      pipeline: {
        status: "placeholder",
        generated: ["normalized-content", "retrieval-ready-structure", "trace-placeholders"]
      }
    };
  }
}

router.post("/refresh-index", async (req, res) => {
  const result = await refreshIndexingArtifacts();
  res.json(result);
});

router.post("/", async (req, res) => {
  const question = String(req.body?.question || "").trim();
  const workflow = inferWorkflow(question);

  try {
    await fetch(`${RETRIEVAL_API_BASE_URL}/api/retrieve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, scenario: workflow })
    }).catch(() => null);
  } catch {
    // Ignore downstream failures in public-shareable mode.
  }

  const context = buildContext(workflow, question);
  const answer = buildModelResponse(workflow);

  res.json({
    scenario: workflow,
    answer,
    coarseResults: buildCoarseResults(workflow),
    fineResults: buildFineResults(workflow),
    retrievalTrace: buildRetrievalTrace(workflow),
    context,
    modelPrompt: buildModelPrompt(workflow, question, context),
    modelResponse: answer,
    capability: buildCapability(workflow)
  });
});

export default router;
