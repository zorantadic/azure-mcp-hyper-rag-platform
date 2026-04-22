import express from "express";
import { loadScenarioTrace } from "../services/artifactService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const scenario = req.query.scenario || "analysis-request";
    const trace = await loadScenarioTrace(scenario);

    res.json(trace);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load retrieval trace."
    });
  }
});

export default router;