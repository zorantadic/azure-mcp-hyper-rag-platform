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

function resolveAuthorization(action) {
  if (action === "add-case-note") {
    return {
      allowed: true,
      policyName: "sales-note-write-policy",
      requiredRole: "account-team-contributor"
    };
  }

  if (action === "update-account-status") {
    return {
      allowed: true,
      policyName: "account-status-update-policy",
      requiredRole: "account-owner-or-manager"
    };
  }

  if (action === "send-summary-email") {
    return {
      allowed: true,
      policyName: "notification-send-policy",
      requiredRole: "account-team-contributor"
    };
  }

  return {
    allowed: false,
    policyName: "unknown-action-policy",
    requiredRole: "not-authorized"
  };
}

router.post("/check", (req, res) => {
  const {
    requestId = "",
    action = "",
    requestedBy = "account-team-user",
    targetSystem = "",
    targetRecord = ""
  } = req.body || {};

  const authorization = resolveAuthorization(action);

  res.json({
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    authorization: {
      requestId: requestId || `auth-${Date.now()}`,
      action,
      requestedBy,
      targetSystem,
      targetRecord,
      allowed: authorization.allowed,
      policyName: authorization.policyName,
      requiredRole: authorization.requiredRole,
      policyStore: {
        serviceType: "Azure SQL Database",
        server: AZURE_SQL_SERVER,
        database: AZURE_SQL_DATABASE,
        table: "approval_requests"
      }
    },
    message:
      "Authorization decision produced by approval-api for the requested MCP action."
  });
});

export default router;