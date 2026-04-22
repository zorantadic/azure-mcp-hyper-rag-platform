import express from "express";

const router = express.Router();

const SERVICE_NAME = process.env.SERVICE_NAME || "approval-api";

const CONTAINER_APP_NAME =
  process.env.CONTAINER_APP_NAME || "ca-approval-api";
const CONTAINER_APP_URL =
  process.env.CONTAINER_APP_URL ||
  "https://ca-approval-api.<env-suffix>.azurecontainerapps.io";

const AZURE_SQL_SERVER =
  process.env.AZURE_SQL_SERVER || "sqldb-mcp-ops.database.windows.net";
const AZURE_SQL_DATABASE =
  process.env.AZURE_SQL_DATABASE || "sqldb-mcp-ops";

const SERVICE_BUS_NAMESPACE =
  process.env.SERVICE_BUS_NAMESPACE ||
  "sb-placeholder.servicebus.windows.net";

const APPROVAL_QUEUE_NAME =
  process.env.APPROVAL_QUEUE_NAME || "approval-requests";

const RESULT_QUEUE_NAME =
  process.env.RESULT_QUEUE_NAME || "mcp-action-results";

function buildApprovalRecord(body) {
  const {
    requestId = "",
    scenario = "",
    action = "",
    targetSystem = "",
    targetRecord = "",
    proposedPayload = {},
    requestedBy = "account-team-user"
  } = body || {};

  return {
    approvalRequestId: requestId || `approval-${Date.now()}`,
    scenario,
    status: "pending",
    requestedBy,
    action,
    targetSystem,
    targetRecord,
    proposedPayload,
    recordStore: {
      serviceType: "Azure SQL Database",
      server: AZURE_SQL_SERVER,
      database: AZURE_SQL_DATABASE,
      table: "approval_requests"
    },
    transport: {
      dispatchChannel: "Azure Service Bus",
      approvalQueue: APPROVAL_QUEUE_NAME,
      namespace: SERVICE_BUS_NAMESPACE
    }
  };
}

router.post("/request", (req, res) => {
  const approvalRecord = buildApprovalRecord(req.body);

  res.status(202).json({
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    approval: approvalRecord,
    message:
      "Approval request accepted by approval-api and prepared for approval queue dispatch."
  });
});

router.post("/decision", (req, res) => {
  const {
    approvalRequestId = "",
    scenario = "",
    decision = "approved",
    decidedBy = "account-team-user",
    action = "",
    targetSystem = "",
    targetRecord = "",
    proposedPayload = {}
  } = req.body || {};

  res.json({
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    approvalDecision: {
      approvalRequestId: approvalRequestId || `approval-${Date.now()}`,
      scenario,
      decision,
      decidedBy,
      action,
      targetSystem,
      targetRecord,
      proposedPayload,
      approvalStore: {
        serviceType: "Azure SQL Database",
        server: AZURE_SQL_SERVER,
        database: AZURE_SQL_DATABASE,
        tables: ["approval_requests", "action_log"]
      },
      resultTransport: {
        dispatchChannel: "Azure Service Bus",
        resultQueue: RESULT_QUEUE_NAME,
        namespace: SERVICE_BUS_NAMESPACE,
        status: "completed"
      }
    },
    message:
      "Approval decision recorded by approval-api and prepared for action-result signaling."
  });
});

export default router;