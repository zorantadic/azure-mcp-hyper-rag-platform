const WORKFLOWS = [
  {
    id: "analysis-request",
    title: "Analysis Request",
    summary: "Generic analytical path retained for public-shareable packaging."
  },
  {
    id: "operational-issue",
    title: "Operational Issue",
    summary: "Generic incident-oriented path retained for public-shareable packaging."
  },
  {
    id: "workflow-update",
    title: "Workflow Update",
    summary: "Generic workflow-change path retained for public-shareable packaging."
  }
];

function getWorkflow(id) {
  return WORKFLOWS.find((item) => item.id === id) || WORKFLOWS[0];
}

export async function loadScenarios() {
  return WORKFLOWS;
}

export async function loadScenarioTrace(workflowId = "analysis-request") {
  const workflow = getWorkflow(workflowId);

  return {
    workflow: workflow.id,
    retrievalTrace: [
      {
        chunkId: `${workflow.id}-chunk-001`,
        fileName: "placeholder-source.md",
        topic: workflow.id,
        vectorStatus: "placeholder",
        fineScore: 0.91
      }
    ],
    coarseResults: [
      {
        documentId: `${workflow.id}-doc-001`,
        fileName: "placeholder-source.md",
        title: "Placeholder source document",
        level: "document",
        coarseScore: 0.88
      }
    ],
    fineResults: [
      {
        chunkId: `${workflow.id}-chunk-001`,
        fileName: "placeholder-source.md",
        topic: workflow.id,
        vectorStatus: "placeholder",
        fineScore: 0.91
      }
    ],
    note: workflow.summary
  };
}

export async function loadScenarioContext(workflowId = "analysis-request") {
  const workflow = getWorkflow(workflowId);

  return {
    contextPackageId: `ctx-${workflow.id}`,
    focus: workflow.title,
    account: "Placeholder workspace",
    riskLevel: "informational",
    facts: {
      note: workflow.summary,
      repositoryMode: true
    },
    evidenceExcerpts: [
      {
        chunkId: `${workflow.id}-chunk-001`,
        fileName: "placeholder-source.md",
        excerpt: "Public repository package with neutral placeholders."
      }
    ]
  };
}

export async function loadScenarioPrompt(workflowId = "analysis-request") {
  const workflow = getWorkflow(workflowId);

  return {
    requestId: `req-${workflow.id}`,
    prompt: [
      "System: Repository-safe reference mode.",
      `Workflow: ${workflow.title}`,
      "Instruction: Replace placeholder context with connected private data sources."
    ].join("\n")
  };
}

export async function loadScenarioResponse(workflowId = "analysis-request") {
  const workflow = getWorkflow(workflowId);

  return {
    responseId: `resp-${workflow.id}`,
    response: `${workflow.title} placeholder response. Replace with environment-specific grounded output.`
  };
}
