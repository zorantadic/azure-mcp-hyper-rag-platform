import express from "express";

const router = express.Router();

const PORT = Number(process.env.PORT || 8080);
const SERVICE_NAME = process.env.SERVICE_NAME || "tool-execution-api";
const SERVICE_VERSION = process.env.SERVICE_VERSION || "1.0.0";

const CONTAINER_APP_NAME =
  process.env.CONTAINER_APP_NAME || "ca-tool-execution-api";
const CONTAINER_APP_URL =
  process.env.CONTAINER_APP_URL ||
  "https://ca-tool-execution-api.<env-suffix>.azurecontainerapps.io";

const AZURE_SQL_SERVER =
  process.env.AZURE_SQL_SERVER || "sqldb-mcp-ops.database.windows.net";
const AZURE_SQL_DATABASE =
  process.env.AZURE_SQL_DATABASE || "sqldb-mcp-ops";

const LOGIC_APP_BASE_URL =
  process.env.LOGIC_APP_BASE_URL ||
  "https://logicapp-mcp-workflows.<region>.logic.azure.com";

const LOGIC_APP_SEND_SUMMARY_WORKFLOW =
  process.env.LOGIC_APP_SEND_SUMMARY_WORKFLOW || "send-summary-email";

const SERVICE_BUS_NAMESPACE =
  process.env.SERVICE_BUS_NAMESPACE ||
  "sb-placeholder.servicebus.windows.net";

const REQUEST_QUEUE_NAME =
  process.env.REQUEST_QUEUE_NAME || "mcp-action-requests";

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
    targets: {
      azureSql: {
        server: AZURE_SQL_SERVER,
        database: AZURE_SQL_DATABASE
      },
      logicApps: {
        baseUrl: LOGIC_APP_BASE_URL,
        sendSummaryWorkflow: LOGIC_APP_SEND_SUMMARY_WORKFLOW
      },
      serviceBus: {
        namespace: SERVICE_BUS_NAMESPACE,
        requestQueue: REQUEST_QUEUE_NAME,
        resultQueue: RESULT_QUEUE_NAME
      }
    }
  });
});

export default router;