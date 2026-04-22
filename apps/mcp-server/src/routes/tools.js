import express from "express";

const router = express.Router();

const SERVICE_BUS_NAMESPACE =
  process.env.SERVICE_BUS_NAMESPACE ||
  "sb-placeholder.servicebus.windows.net";

router.get("/", (req, res) => {
  res.json({
    tools: [
      {
        toolName: "request-approval",
        category: "workflow",
        availability: "placeholder",
        transport: {
          namespace: SERVICE_BUS_NAMESPACE
        }
      },
      {
        toolName: "record-audit-note",
        category: "write",
        availability: "placeholder",
        transport: {
          namespace: SERVICE_BUS_NAMESPACE
        }
      }
    ]
  });
});

export default router;
