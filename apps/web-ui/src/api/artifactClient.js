const ARTIFACT_API_BASE_URL =
  import.meta.env.VITE_ARTIFACT_API_BASE_URL || "http://localhost:4200";

export async function getScenarios() {
  const response = await fetch(`${ARTIFACT_API_BASE_URL}/api/scenarios`);

  if (!response.ok) {
    throw new Error("Failed to load workflows.");
  }

  return response.json();
}

export async function getTrace(scenario) {
  const response = await fetch(
    `${ARTIFACT_API_BASE_URL}/api/traces?scenario=${encodeURIComponent(scenario)}`
  );

  if (!response.ok) {
    throw new Error("Failed to load trace.");
  }

  return response.json();
}

export async function getContext(scenario) {
  const response = await fetch(
    `${ARTIFACT_API_BASE_URL}/api/contexts?scenario=${encodeURIComponent(scenario)}`
  );

  if (!response.ok) {
    throw new Error("Failed to load grounded context.");
  }

  return response.json();
}

export async function getModelPrompt(scenario) {
  const response = await fetch(
    `${ARTIFACT_API_BASE_URL}/api/prompts?scenario=${encodeURIComponent(scenario)}`
  );

  if (!response.ok) {
    throw new Error("Failed to load model prompt.");
  }

  return response.json();
}

export async function getModelResponse(scenario) {
  const response = await fetch(
    `${ARTIFACT_API_BASE_URL}/api/responses?scenario=${encodeURIComponent(scenario)}`
  );

  if (!response.ok) {
    throw new Error("Failed to load model response.");
  }

  return response.json();
}