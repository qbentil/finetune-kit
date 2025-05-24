import { CreateFineTuneParams, ProviderAdapter } from "./types";

import { OpenAIAdapter } from "./providers/openai";

export async function createFineTuneJob(params: CreateFineTuneParams) {
  const { provider, apiKey } = params;

  if (!apiKey) {
    throw new Error("API key is required for creating a fine-tune job.");
  }

  let adapter: ProviderAdapter;

  switch (provider) {
    case "openai":
      adapter = new OpenAIAdapter(params);
      break;

    case "custom":
      throw new Error("Custom provider not yet implemented.");

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }

  return await adapter.createFineTune(params);
}
