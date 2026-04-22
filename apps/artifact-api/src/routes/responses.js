import express from "express";
import { loadScenarioResponse } from "../services/artifactService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const scenario = req.query.scenario || "analysis-request";
    const result = await loadScenarioResponse(scenario);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to load model response."
    });
  }
});

export default router;