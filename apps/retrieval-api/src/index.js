import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import retrieveRouter from "./routes/retrieve.js";
import { logInfo } from "./utils/logger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4100;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "retrieval-api",
    status: "running"
  });
});

app.use("/health", healthRouter);
app.use("/api/retrieve", retrieveRouter);

app.listen(port, () => {
  logInfo(`Retrieval API listening on port ${port}`);
});