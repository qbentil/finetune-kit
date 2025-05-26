import {
  CreateFineTuneParams,
  ProviderAdapter,
  ProviderAdapterConfig,
} from "../../types";
import { readFile, writeFile } from "fs/promises";

import OpenAI from "openai";
import fs from "fs";
import { join } from "path";
import { tmpdir } from "os";

export class OpenAIAdapter implements ProviderAdapter {
  private readonly client: OpenAI;

  constructor(config: ProviderAdapterConfig) {
    if (!config.apiKey) {
      throw new Error("API key is required for OpenAI adapter.");
    }
    this.client = new OpenAI({ apiKey: config.apiKey });
  }
  // ✅ Used to validate any .jsonl file (from URL or path)
  private async validateFile(filePath: string): Promise<void> {
    const fileContent = await readFile(filePath, "utf8");
    fileContent.split("\n").forEach((line, index) => {
      if (line.trim() === "") return; // skip empty lines
      try {
        JSON.parse(line);
      } catch {
        throw new Error(`Invalid JSONL format at line ${index + 1}`);
      }
    });
  }

  async createFineTune(params: CreateFineTuneParams): Promise<any> {
    // ensure either dataset_api or dataset_url is provided
    if (!params.dataset_api && !params.dataset_url) {
      throw new Error("Either dataset_api or dataset_url must be provided.");
    }
    let filePath: string;

    if (params.dataset_api) {
      filePath = await this.prepareFile(params);
    } else if (params.dataset_url) {
      await this.validateFile(params.dataset_url);
      filePath = params.dataset_url;
    } else {
      throw new Error("Either dataset_api or dataset_url must be provided.");
    }

    const fileUpload = await this.client.files.create({
      file: fs.createReadStream(filePath),
      purpose: "fine-tune",
    });

    const job = await this.client.fineTuning.jobs.create({
      training_file: fileUpload.id,
      model: "gpt-4o-mini",
      suffix: params.suffix,
    });

    return job;
  }

  async getStatus(id: string) {
    return await this.client.fineTuning.jobs.retrieve(id);
  }
  // private helper
  // ✅ Used when user provides a dataset API URL
  async prepareFile(params: CreateFineTuneParams): Promise<string> {
    try {
      if (!params.dataset_api) {
        throw new Error(
          "dataset_api is required to prepare the file from API."
        );
      }
      const response = await fetch(params.dataset_api, {
        headers: {
          "Content-Type": "application/json",
          // request bearer token
          ...(params.api_options?.headers ?? {}),
        },
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch dataset from API: ${response.statusText}`
        );
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const filePath = join(
        tmpdir(),
        `fine-tune-${Date.now()}-${params.suffix}.jsonl`
      );
      await writeFile(filePath, buffer);

      await this.validateFile(filePath); // Ensure valid JSONL

      return filePath;
    } catch (error: any) {
      throw new Error(
        `Failed to prepare the dataset from API: ${error.message}`
      );
    }
  }
}
