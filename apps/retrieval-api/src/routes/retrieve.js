import express from "express";

const router = express.Router();

function resolveWorkflow(question, workflow) {
  if (workflow) {
    return workflow;
  }

  const normalized = String(question || "").toLowerCase();

  if (normalized.includes("incident") || normalized.includes("ticket") || normalized.includes("outage")) {
    return "operational-issue";
  }

  if (normalized.includes("approval") || normalized.includes("change") || normalized.includes("update")) {
    return "workflow-update";
  }

  return "analysis-request";
}

function buildTracePayload(workflow, question) {
  return {
    scenario: workflow,
    question,
    coarseResults: [
      {
        documentId: `${workflow}-doc-001`,
        fileName: "placeholder-source.md",
        title: "Placeholder source document",
        level: "document",
        coarseScore: 0.88
      }
    ],
    fineResults: [
      {
        chunkId: `${workflow}-chunk-001`,
        fileName: "placeholder-source.md",
        topic: workflow,
        vectorStatus: "placeholder",
        fineScore: 0.91
      }
    ],
    selectedEvidence: [
      {
        chunkId: `${workflow}-chunk-001`,
        fileName: "placeholder-source.md",
        documentTitle: "Placeholder source document",
        topic: workflow,
        chunkText:
          "Neutral placeholder evidence retained so the repository preserves the retrieval contract without exposing private business content.",
        sourcePath: `data/placeholders/${workflow}.md`,
        fineScore: 0.91,
        vectorStatus: "placeholder"
      }
    ],
    extractedFacts: {
      repositoryMode: true,
      note: "Replace placeholder retrieval assets with private source content in your environment."
    }
  };
}

router.post("/", async (req, res) => {
  const question = String(req.body?.question || "").trim();
  const workflow = resolveWorkflow(question, req.body?.scenario);
  res.json(buildTracePayload(workflow, question));
});

export default router;
