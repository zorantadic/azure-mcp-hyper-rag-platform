console.log("ARTIFACT API INDEX LOADED FROM:", import.meta.url);
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import scenariosRouter from "./routes/scenarios.js";
import tracesRouter from "./routes/traces.js";
import promptsRouter from "./routes/prompts.js";
import responsesRouter from "./routes/responses.js";
import contextsRouter from "./routes/contexts.js";
import { logInfo } from "./utils/logger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4200;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "artifact-api",
    status: "running"
  });
});
app.get("/diag-context-route", (req, res) => {
  res.json({
    ok: true,
    route: "diag-context-route"
  });
});
app.use("/health", healthRouter);
app.use("/api/scenarios", scenariosRouter);
app.use("/api/traces", tracesRouter);
app.use("/api/contexts", contextsRouter);
app.use("/api/prompts", promptsRouter);
app.use("/api/responses", responsesRouter);

app.listen(port, () => {
  logInfo(`Artifact API listening on port ${port}`);
});