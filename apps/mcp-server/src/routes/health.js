import express from "express";

const router = express.Router();

const PORT = Number(process.env.PORT || 8080);
const SERVICE_NAME = process.env.SERVICE_NAME || "mcp-server";
const SERVICE_VERSION = process.env.SERVICE_VERSION || "1.0.0";

const CONTAINER_APP_NAME =
  process.env.CONTAINER_APP_NAME || "ca-mcp-server";
const CONTAINER_APP_URL =
  process.env.CONTAINER_APP_URL ||
  "https://ca-mcp-server.<env-suffix>.azurecontainerapps.io";

const EXECUTION_API_BASE_URL =
  process.env.TOOL_EXECUTION_API_BASE_URL ||
  "https://ca-tool-execution-api.<env-suffix>.azurecontainerapps.io";

const SERVICE_BUS_NAMESPACE =
  process.env.SERVICE_BUS_NAMESPACE ||
  "sb-placeholder.servicebus.windows.net";

const REQUEST_QUEUE_NAME =
  process.env.REQUEST_QUEUE_NAME || "mcp-action-requests";

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
    execution: {
      mode: "service-bus-dispatch",
      downstreamExecutor: EXECUTION_API_BASE_URL,
      serviceBusNamespace: SERVICE_BUS_NAMESPACE,
      requestQueue: REQUEST_QUEUE_NAME,
      approvalQueue: APPROVAL_QUEUE_NAME,
      resultQueue: RESULT_QUEUE_NAME
    }
  });
});

export default router;