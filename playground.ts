import { createFineTuneJob } from "./src";
import dotenv from "dotenv";

dotenv.config();
console.log("🚀 Playground started");

async function main() {
  try {
    const job = await createFineTuneJob({
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY!,
      suffix: "example-model",
      data_size: 100,
      base_model: "gpt-4o-mini",
      dataset_api: "https://api.example.com/dataset",
      api_options: {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 5000,
      },
    });

    console.log("Fine-tune job started:", job);
  } catch (error: any) {
    console.error("Failed to start fine-tune job:", error.message);
  }
}

main();
