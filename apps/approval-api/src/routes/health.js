import express from "express";

const router = express.Router();

const PORT = Number(process.env.PORT || 8080);
const SERVICE_NAME = process.env.SERVICE_NAME || "approval-api";
const SERVICE_VERSION = process.env.SERVICE_VERSION || "1.0.0";

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

router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: {
      name: SERVICE_NAME,
      version: SERVICE_VERSION
    },
    runtime: {
      platform: "Azure Container Apps",
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL,
      port: PORT
    },
    stores: {
      approvalRecords: {
        serviceType: "Azure SQL Database",
        server: AZURE_SQL_SERVER,
        database: AZURE_SQL_DATABASE,
        tables: ["approval_requests", "action_log"]
      }
    },
    transport: {
      dispatchChannel: "Azure Service Bus",
      approvalQueue: APPROVAL_QUEUE_NAME,
      resultQueue: RESULT_QUEUE_NAME,
      namespace: SERVICE_BUS_NAMESPACE
    }
  });
});

export default router;