import express from "express";

const router = express.Router();

const SERVICE_NAME = process.env.SERVICE_NAME || "audit-api";
const CONTAINER_APP_NAME = process.env.CONTAINER_APP_NAME || "ca-audit-api";
const CONTAINER_APP_URL =
  process.env.CONTAINER_APP_URL ||
  "https://ca-audit-api.<env-suffix>.azurecontainerapps.io";
const SERVICE_BUS_NAMESPACE =
  process.env.SERVICE_BUS_NAMESPACE ||
  "sb-placeholder.servicebus.windows.net";

function buildTrace(traceId) {
  return {
    traceId,
    summary: "Neutral placeholder trace retained for public-shareable packaging.",
    transport: {
      dispatchChannel: "placeholder",
      namespace: SERVICE_BUS_NAMESPACE
    },
    events: [
      {
        step: "request-received",
        status: "placeholder"
      },
      {
        step: "audit-record-persisted",
        status: "placeholder"
      }
    ]
  };
}

router.get("/:scenario", (req, res) => {
  const { scenario = "trace-placeholder" } = req.params;

  res.json({
    service: {
      name: SERVICE_NAME,
      containerAppName: CONTAINER_APP_NAME,
      containerAppUrl: CONTAINER_APP_URL
    },
    trace: buildTrace(scenario)
  });
});

export default router;
