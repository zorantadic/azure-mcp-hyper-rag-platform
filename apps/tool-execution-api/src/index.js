import cors from "cors";
import express from "express";
import healthRouter from "./routes/health.js";
import executeRouter from "./routes/execute.js";

const app = express();

const PORT = Number(process.env.PORT || 8080);
const SERVICE_NAME = process.env.SERVICE_NAME || "tool-execution-api";

app.use(cors());
app.use(express.json());

app.use("/health", healthRouter);
app.use("/execute", executeRouter);

app.listen(PORT, () => {
  console.log(`[${SERVICE_NAME}] listening on port ${PORT}`);
});