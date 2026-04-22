import express from "express";

const router = express.Router();

const SERVICE_NAME = process.env.SERVICE_NAME || "mcp-server";

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

const toolRegistry = [
  {
    toolName: "send-summary-email",
    toolType: "notification",
    targetSystem: "logic-apps-standard",
    riskLevel: "medium",
    requiresApproval: false,
    executionMode: "service-bus-dispatch",
    dispatchChannel: "Azure Service Bus",
    requestQueue: REQUEST_QUEUE_NAME,
    resultQueue: RESULT_QUEUE_NAME,
    downstreamExecutor: {
      serviceName: "tool-execution-api",
      baseUrl: EXECUTION_API_BASE_URL
    }
  },
  {
    toolName: "add-case-note",
    toolType: "write",
    targetSystem: "azure-sql",
    riskLevel: "high",
    requiresApproval: true,
    executionMode: "service-bus-dispatch",
    dispatchChannel: "Azure Service Bus",
    requestQueue: REQUEST_QUEUE_NAME,
    approvalQueue: APPROVAL_QUEUE_NAME,
    resultQueue: RESULT_QUEUE_NAME,
    downstreamExecutor: {
      serviceName: "tool-execution-api",
      baseUrl: EXECUTION_API_BASE_URL
    }
  },
  {
    toolName: "update-account-status",
    toolType: "write",
    targetSystem: "azure-sql",
    riskLevel: "high",
    requiresApproval: true,
    executionMode: "service-bus-dispatch",
    dispatchChannel: "Azure Service Bus",
    requestQueue: REQUEST_QUEUE_NAME,
    approvalQueue: APPROVAL_QUEUE_NAME,
    resultQueue: RESULT_QUEUE_NAME,
    downstreamExecutor: {
      serviceName: "tool-execution-api",
      baseUrl: EXECUTION_API_BASE_URL
    }
  }
];

function getToolByName(toolName) {
  return toolRegistry.find((tool) => tool.toolName === toolName) || null;
}

function buildDispatchState(selectedTool) {
  if (selectedTool.requiresApproval) {
    return {
      status: "pending-approval",
      approvalQueue: selectedTool.approvalQueue || APPROVAL_QUEUE_NAME,
      requestQueue: selectedTool.requestQueue || REQUEST_QUEUE_NAME,
      resultQueue: selectedTool.resultQueue || RESULT_QUEUE_NAME
    };
  }

  return {
    status: "queued",
    requestQueue: selectedTool.requestQueue || REQUEST_QUEUE_NAME,
    resultQueue: selectedTool.resultQueue || RESULT_QUEUE_NAME
  };
}

router.post("/", (req, res) => {
  const {
    toolName = "",
    scenario = "",
    arguments: toolArguments = {},
    requestId = ""
  } = req.body || {};

  const selectedTool = getToolByName(toolName);

  if (!selectedTool) {
    return res.status(404).json({
      error: "Requested MCP tool was not found."
    });
  }

  const acceptedAt = new Date().toISOString();
  const dispatchState = buildDispatchState(selectedTool);

  return res.status(202).json({
    requestId: requestId || `mcp-${Date.now()}`,
    acceptedAt,
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    scenario,
    tool: {
      toolName: selectedTool.toolName,
      toolType: selectedTool.toolType,
      targetSystem: selectedTool.targetSystem,
      requiresApproval: selectedTool.requiresApproval,
      riskLevel: selectedTool.riskLevel
    },
    execution: {
      mode: selectedTool.executionMode,
      dispatchChannel: selectedTool.dispatchChannel,
      serviceBusNamespace: SERVICE_BUS_NAMESPACE,
      requestQueue: dispatchState.requestQueue || "",
      approvalQueue: dispatchState.approvalQueue || "",
      resultQueue: dispatchState.resultQueue || "",
      status: dispatchState.status,
      downstreamExecutor: selectedTool.downstreamExecutor
    },
    payload: toolArguments,
    message:
      "MCP request accepted by mcp-server and prepared for Azure Service Bus dispatch."
  });
});

export default router;