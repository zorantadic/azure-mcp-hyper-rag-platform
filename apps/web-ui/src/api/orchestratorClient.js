const ORCHESTRATOR_API_BASE_URL =
  import.meta.env.VITE_ORCHESTRATOR_API_BASE_URL || "http://localhost:4000";

export async function submitQuestion(payload) {
  const response = await fetch(`${ORCHESTRATOR_API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to submit question to orchestrator.");
  }

  return response.json();
}

export async function refreshIndex() {
  const response = await fetch(`${ORCHESTRATOR_API_BASE_URL}/api/chat/refresh-index`, {
    method: "POST"
  });

  if (!response.ok) {
    throw new Error("Failed to refresh index through orchestrator.");
  }

  return response.json();
}