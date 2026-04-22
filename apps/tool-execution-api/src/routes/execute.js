import express from "express";

const router = express.Router();

const SERVICE_NAME = process.env.SERVICE_NAME || "tool-execution-api";

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

function getExecutorDefinition(toolName) {
  if (toolName === "send-summary-email") {
    return {
      executorType: "workflow",
      targetSystem: "logic-apps-standard",
      operation: "invoke-workflow",
      targetResource: {
        serviceType: "Azure Logic Apps Standard",
        baseUrl: LOGIC_APP_BASE_URL,
        workflowName: LOGIC_APP_SEND_SUMMARY_WORKFLOW
      }
    };
  }

  if (toolName === "add-case-note") {
    return {
      executorType: "write",
      targetSystem: "azure-sql",
      operation: "insert-account-note",
      targetResource: {
        serviceType: "Azure SQL Database",
        server: AZURE_SQL_SERVER,
        database: AZURE_SQL_DATABASE,
        table: "account_notes"
      }
    };
  }

  if (toolName === "update-account-status") {
    return {
      executorType: "write",
      targetSystem: "azure-sql",
      operation: "update-account-status",
      targetResource: {
        serviceType: "Azure SQL Database",
        server: AZURE_SQL_SERVER,
        database: AZURE_SQL_DATABASE,
        table: "accounts"
      }
    };
  }

  return null;
}

function buildExecutionPreview(toolName, payload) {
  if (toolName === "send-summary-email") {
    return {
      resolvedOperation: "send-summary-email",
      recipientResolutionSource: "Azure SQL Database",
      workflowAction: "logic-app-run",
      workflowName: LOGIC_APP_SEND_SUMMARY_WORKFLOW,
      emailSubject: payload?.emailSubject || "Business recap",
      accountName: payload?.accountName || "",
      summaryText: payload?.summaryText || ""
    };
  }

  if (toolName === "add-case-note") {
    return {
      resolvedOperation: "insert-account-note",
      sqlTable: "account_notes",
      targetRecord: payload?.accountName || "",
      proposedValues: {
        accountId: payload?.accountId || "",
        noteText: payload?.noteText || "",
        createdBy: payload?.createdBy || "account-team-assistant"
      }
    };
  }

  if (toolName === "update-account-status") {
    return {
      resolvedOperation: "update-account-status",
      sqlTable: "accounts",
      targetRecord: payload?.accountName || "",
      proposedValues: {
        accountId: payload?.accountId || "",
        currentStatus: payload?.currentStatus || "",
        newStatus: payload?.newStatus || "",
        updatedBy: payload?.updatedBy || "account-team-assistant"
      }
    };
  }

  return {};
}

router.post("/", (req, res) => {
  const {
    requestId = "",
    toolName = "",
    scenario = "",
    payload = {}
  } = req.body || {};

  const executor = getExecutorDefinition(toolName);

  if (!executor) {
    return res.status(404).json({
      error: "Execution target for requested tool was not found."
    });
  }

  const acceptedAt = new Date().toISOString();
  const preview = buildExecutionPreview(toolName, payload);

  return res.status(202).json({
    requestId: requestId || `exec-${Date.now()}`,
    acceptedAt,
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    scenario,
    tool: {
      toolName,
      executorType: executor.executorType,
      operation: executor.operation,
      targetSystem: executor.targetSystem
    },
    executionTarget: executor.targetResource,
    transport: {
      dispatchChannel: "Azure Service Bus",
      requestQueue: REQUEST_QUEUE_NAME,
      resultQueue: RESULT_QUEUE_NAME,
      namespace: SERVICE_BUS_NAMESPACE,
      status: "processing"
    },
    preview,
    message:
      "Execution request accepted by tool-execution-api and prepared for target-system execution."
  });
});

router.post("/results", (req, res) => {
  const {
    requestId = "",
    toolName = "",
    scenario = "",
    outcome = "completed"
  } = req.body || {};

  res.json({
    requestId: requestId || `result-${Date.now()}`,
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    scenario,
    toolName,
    resultTransport: {
      dispatchChannel: "Azure Service Bus",
      resultQueue: RESULT_QUEUE_NAME,
      namespace: SERVICE_BUS_NAMESPACE,
      status: "completed"
    },
    outcome
  });
});

export default router;