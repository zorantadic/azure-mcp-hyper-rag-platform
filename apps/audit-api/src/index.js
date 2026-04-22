import cors from "cors";
import express from "express";
import healthRouter from "./routes/health.js";
import auditRouter from "./routes/audit.js";
import tracesRouter from "./routes/traces.js";

const app = express();

const PORT = Number(process.env.PORT || 8080);
const SERVICE_NAME = process.env.SERVICE_NAME || "audit-api";

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/audit", auditRouter);
app.use("/traces", tracesRouter);

app.listen(PORT, () => {
  console.log(`[${SERVICE_NAME}] listening on port ${PORT}`);
});