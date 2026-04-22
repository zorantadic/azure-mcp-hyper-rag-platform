import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  retrievalApiBaseUrl: process.env.RETRIEVAL_API_BASE_URL || "http://localhost:4100",
  artifactApiBaseUrl: process.env.ARTIFACT_API_BASE_URL || "http://localhost:4200",
  foundryProjectEndpoint: process.env.FOUNDRY_PROJECT_ENDPOINT || "",
  foundryModelDeploymentName: process.env.FOUNDRY_MODEL_DEPLOYMENT_NAME || "",
  foundryApiKey: process.env.FOUNDRY_API_KEY || "",

  mcpServerBaseUrl: process.env.MCP_SERVER_BASE_URL || "http://localhost:4400",
  toolExecutionApiBaseUrl:
    process.env.TOOL_EXECUTION_API_BASE_URL || "http://localhost:4500",
  approvalApiBaseUrl: process.env.APPROVAL_API_BASE_URL || "http://localhost:4600",
  auditApiBaseUrl: process.env.AUDIT_API_BASE_URL || "http://localhost:4700",

  azureSqlServer: process.env.AZURE_SQL_SERVER || "",
  azureSqlDatabase: process.env.AZURE_SQL_DATABASE || "sqldb-mcp-ops",
  azureSqlUser: process.env.AZURE_SQL_USER || "",
  azureSqlPassword: process.env.AZURE_SQL_PASSWORD || "",

  azureServiceBusNamespace: process.env.AZURE_SERVICEBUS_NAMESPACE || "",
  azureServiceBusConnectionString: process.env.AZURE_SERVICEBUS_CONNECTION_STRING || "",
  azureServiceBusQueueActionRequests:
    process.env.AZURE_SERVICEBUS_QUEUE_ACTION_REQUESTS || "mcp-action-requests",
  azureServiceBusQueueActionResults:
    process.env.AZURE_SERVICEBUS_QUEUE_ACTION_RESULTS || "mcp-action-results",
  azureServiceBusQueueApprovalRequests:
    process.env.AZURE_SERVICEBUS_QUEUE_APPROVAL_REQUESTS || "approval-requests",

  logicAppSendSummaryEmailUrl: process.env.LOGIC_APP_SEND_SUMMARY_EMAIL_URL || "",
  logicAppApprovalRequestFlowUrl:
    process.env.LOGIC_APP_APPROVAL_REQUEST_FLOW_URL || ""
};