import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import healthRouter from "./routes/health.js";
import chatRouter from "./routes/chat.js";
import { logInfo } from "./utils/logger.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "orchestrator",
    status: "running"
  });
});

app.get("/config-summary", (req, res) => {
  res.json({
    service: "orchestrator",
    config: {
      retrievalApiBaseUrl: env.retrievalApiBaseUrl,
      artifactApiBaseUrl: env.artifactApiBaseUrl,
      mcpServerBaseUrl: env.mcpServerBaseUrl,
      toolExecutionApiBaseUrl: env.toolExecutionApiBaseUrl,
      approvalApiBaseUrl: env.approvalApiBaseUrl,
      auditApiBaseUrl: env.auditApiBaseUrl,
      azureSqlServerConfigured: Boolean(env.azureSqlServer),
      azureSqlDatabase: env.azureSqlDatabase,
      azureServiceBusNamespace: env.azureServiceBusNamespace,
      azureServiceBusConfigured: Boolean(env.azureServiceBusConnectionString),
      logicAppSendSummaryEmailConfigured: Boolean(env.logicAppSendSummaryEmailUrl),
      logicAppApprovalRequestConfigured: Boolean(env.logicAppApprovalRequestFlowUrl),
      foundryConfigured: Boolean(
        env.foundryProjectEndpoint &&
          env.foundryModelDeploymentName &&
          env.foundryApiKey
      )
    }
  });
});

app.use("/health", healthRouter);
app.use("/api/chat", chatRouter);

app.listen(env.port, () => {
  logInfo(`Orchestrator listening on port ${env.port}`);
  logInfo(`Retrieval API: ${env.retrievalApiBaseUrl}`);
  logInfo(`Artifact API: ${env.artifactApiBaseUrl}`);
  logInfo(`MCP Server: ${env.mcpServerBaseUrl}`);
  logInfo(`Tool Execution API: ${env.toolExecutionApiBaseUrl}`);
  logInfo(`Approval API: ${env.approvalApiBaseUrl}`);
  logInfo(`Audit API: ${env.auditApiBaseUrl}`);
  logInfo(
    `Logic App send-summary-email configured: ${Boolean(env.logicAppSendSummaryEmailUrl)}`
  );
  logInfo(
    `Logic App approval-request-flow configured: ${Boolean(env.logicAppApprovalRequestFlowUrl)}`
  );
});