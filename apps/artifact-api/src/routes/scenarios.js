import express from "express";
import { loadScenarios } from "../services/artifactService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const scenarios = await loadScenarios();

    res.json({ scenarios });
  } catch (error) {
    res.status(500).json({
      error: "Failed to load scenarios."
    });
  }
});

export default router;