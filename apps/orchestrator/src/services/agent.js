import { runModel } from "./model.js";

export async function runAgent({ scenario, question, context }) {
  const modelResult = await runModel({
    scenario,
    question,
    context
  });

  return {
    modelPrompt: modelResult.modelPrompt || "",
    modelResponse: modelResult.modelResponse || "",
    answer: modelResult.modelResponse || "",
    modelRequestId: modelResult.modelRequestId || "",
    modelResponseId: modelResult.modelResponseId || ""
  };
}