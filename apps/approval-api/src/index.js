import cors from "cors";
import express from "express";
import healthRouter from "./routes/health.js";
import approvalsRouter from "./routes/approvals.js";
import authorizationsRouter from "./routes/authorizations.js";

const app = express();

const PORT = Number(process.env.PORT || 8080);
const SERVICE_NAME = process.env.SERVICE_NAME || "approval-api";

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/approvals", approvalsRouter);
app.use("/authorizations", authorizationsRouter);

app.listen(PORT, () => {
  console.log(`[${SERVICE_NAME}] listening on port ${PORT}`);
});