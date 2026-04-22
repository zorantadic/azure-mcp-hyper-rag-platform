import express from "express";

const router = express.Router();

const SERVICE_NAME = process.env.SERVICE_NAME || "audit-api";

const CONTAINER_APP_NAME =
  process.env.CONTAINER_APP_NAME || "ca-audit-api";
const CONTAINER_APP_URL =
  process.env.CONTAINER_APP_URL ||
  "https://ca-audit-api.<env-suffix>.azurecontainerapps.io";

const AZURE_SQL_SERVER =
  process.env.AZURE_SQL_SERVER || "sqldb-mcp-ops.database.windows.net";
const AZURE_SQL_DATABASE =
  process.env.AZURE_SQL_DATABASE || "sqldb-mcp-ops";

function buildAuditStore() {
  return {
    serviceType: "Azure SQL Database",
    server: AZURE_SQL_SERVER,
    database: AZURE_SQL_DATABASE,
    table: "action_log"
  };
}

router.post("/record", (req, res) => {
  const {
    requestId = "",
    scenario = "",
    action = "",
    status = "completed",
    targetSystem = "",
    targetRecord = "",
    outcome = "",
    initiatedBy = "orchestrator"
  } = req.body || {};

  res.status(202).json({
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    auditRecord: {
      auditRecordId: requestId || `audit-${Date.now()}`,
      scenario,
      action,
      status,
      targetSystem,
      targetRecord,
      outcome,
      initiatedBy,
      auditStore: buildAuditStore()
    },
    message:
      "Audit record accepted by audit-api and prepared for persistence in the operational audit store."
  });
});

router.get("/record/:auditRecordId", (req, res) => {
  const { auditRecordId = "" } = req.params;

  res.json({
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    auditRecord: {
      auditRecordId,
      status: "completed",
      source: buildAuditStore()
    }
  });
});

export default router;