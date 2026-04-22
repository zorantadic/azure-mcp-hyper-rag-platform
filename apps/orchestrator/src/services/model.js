function formatFactLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function formatFacts(facts) {
  if (!facts || typeof facts !== "object") {
    return "- none";
  }

  const lines = [];

  for (const [key, value] of Object.entries(facts)) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    lines.push(`- ${formatFactLabel(key)}: ${value}`);
  }

  return lines.length > 0 ? lines.join("\n") : "- none";
}

function formatEvidenceExcerpts(excerpts) {
  if (!Array.isArray(excerpts) || excerpts.length === 0) {
    return "- none";
  }

  return excerpts
    .map((item, index) => {
      const documentTitle = item?.documentTitle || "Unknown document";
      const sourcePath = item?.sourcePath || "-";
      const excerpt = item?.excerpt || "-";

      return [
        `${index + 1}. ${documentTitle}`,
        `   Source: ${sourcePath}`,
        `   Excerpt: ${excerpt}`
      ].join("\n");
    })
    .join("\n\n");
}

function buildRuntimePrompt({ scenario, question, context }) {
  const account = context?.account || "Unknown Account";
  const focus = context?.focus || scenario;
  const riskLevel = context?.riskLevel || "n/a";

  return [
    "You are the Hyper-RAG response model.",
    "Answer only using the grounded context package provided below.",
    "Be concise, business-oriented, and explicit about the recommended action.",
    "Do not invent facts that are not supported by the evidence.",
    "",
    `Scenario: ${scenario}`,
    `Question: ${question}`,
    "",
    "Grounded Context Package",
    "",
    `Account: ${account}`,
    `Focus: ${focus}`,
    `Risk Level: ${riskLevel}`,
    "",
    "Facts:",
    formatFacts(context?.facts),
    "",
    "Evidence Excerpts:",
    formatEvidenceExcerpts(context?.evidenceExcerpts),
    "",
    "Return a direct answer based only on this grounded context."
  ].join("\n");
}

function isProposalEmailFlow(question) {
  const normalized = String(question || "").toLowerCase();

  return (
    normalized.includes("email") ||
    normalized.includes("recap") ||
    normalized.includes("account owner") ||
    normalized.includes("send")
  );
}

function isProposalNoteFlow(question) {
  const normalized = String(question || "").toLowerCase();

  return (
    normalized.includes("note") ||
    normalized.includes("follow-up") ||
    normalized.includes("sales team")
  );
}

function isStatusUpdateFlow(question) {
  const normalized = String(question || "").toLowerCase();

  const wantsStatusUpdate =
    normalized.includes("update the account status") ||
    normalized.includes("update account status") ||
    normalized.includes("status update") ||
    normalized.includes("executive attention needed") ||
    normalized.includes("update the status");

  const wantsNotification =
    normalized.includes("notify") ||
    normalized.includes("notification") ||
    normalized.includes("send summary email") ||
    normalized.includes("send an email") ||
    normalized.includes("send email") ||
    normalized.includes("account owner");

  return wantsStatusUpdate || wantsNotification;
}

function buildRuntimeResponse({ scenario, question }) {
  if (scenario === "analysis-request" && isStatusUpdateFlow(question)) {
    return [
      "The account risk is currently being driven by reduced service confidence, weaker executive engagement, and incomplete renewal-readiness follow-through. Taken together, those signals suggest the account now needs visible executive attention rather than routine follow-up.",
      "",
      "I’m ready to update the account status and notify the account owner, but because that changes the operational record, I need your approval before I proceed."
    ].join("\n");
  }

  if (scenario === "analysis-request") {
    return [
      "The account risk is elevated. Key signals driving this risk are: a recent support escalation that affected customer confidence, mixed stakeholder sentiment after a service incident, incomplete renewal readiness, and lower-than-expected executive participation, with executive alignment now a critical factor in confidence and continuity.",
      "",
      "Recommended action: Prioritize executive re-engagement, stabilize customer confidence after the escalation, and complete renewal-readiness actions before the renewal review."
    ].join("\n");
  }

  if (scenario === "operational-issue") {
    return [
      "The support case was escalated because a critical production issue disrupted operations, reduced confidence, and increased service impact. The escalation remains business-critical until recovery is fully validated.",
      "",
      "Recommended action: Complete recovery validation, confirm closure criteria, and maintain a strong customer communication cadence until the escalation is closed."
    ].join("\n");
  }

  if (scenario === "workflow-update" && isProposalEmailFlow(question)) {
    return [
      "The active proposal does not appear to be blocked by a single issue. What stands out is that scope alignment is still not fully settled, ownership of the next commercial decision is not completely clear, and the last discussion did not end with a firm commitment on next steps. In other words, the proposal is still active, but it is not moving with enough decision clarity.",
      "",
      "I’ve summarized the current blockers and prepared a recap for the account owner so the follow-up conversation can focus on scope, decision ownership, and the path to a final commitment."
    ].join("\n");
  }

  if (scenario === "workflow-update" && isProposalNoteFlow(question)) {
    return [
      "The active proposal still appears active, but it is not moving because the next commercial step is not clearly locked. The main blockers are unresolved scope alignment, unclear ownership for the next decision, and the lack of a firm follow-up commitment after the last discussion.",
      "",
      "I’ve prepared an internal follow-up note for the sales team so the next action is clearly documented, but I need your approval before writing that note to the operational record."
    ].join("\n");
  }

  return [
    "The next best step for the active proposal is to schedule a focused decision-committee session to confirm the commercial scope, align on the approval path, and secure final business commitment.",
    "",
    "This is supported by evidence that technical validation is complete, commercial terms are still under discussion, and final approval depends on decision committee alignment."
  ].join("\n");
}

function getRequestId(scenario) {
  if (scenario === "analysis-request") {
    return "req-placeholder-renewal-001";
  }

  if (scenario === "operational-issue") {
    return "req-placeholder-escalation-001";
  }

  return "req-placeholder-workflow-001";
}

function getResponseId(scenario) {
  if (scenario === "analysis-request") {
    return "resp-placeholder-renewal-001";
  }

  if (scenario === "operational-issue") {
    return "resp-placeholder-escalation-001";
  }

  return "resp-placeholder-workflow-001";
}

export async function runModel({ scenario, question, context }) {
  const modelPrompt = buildRuntimePrompt({
    scenario,
    question,
    context
  });

  const modelResponse = buildRuntimeResponse({
    scenario,
    question
  });

  return {
    modelPrompt,
    modelResponse,
    modelRequestId: getRequestId(scenario),
    modelResponseId: getResponseId(scenario)
  };
}