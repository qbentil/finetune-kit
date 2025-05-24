export type Provider = "openai" | "custom";
type DatasetSource =
  | {
      dataset_api: string;
      dataset_url?: never;
      api_options?: {
        headers?: Record<string, string>;
        timeout?: number;
      };
    }
  | { dataset_url: string; dataset_api?: never };

export type CreateFineTuneParams = DatasetSource & {
  provider: Provider;
  apiKey: string;
  suffix: string;
  data_size: number;
  base_model: string;
};

export interface ProviderAdapter {
  createFineTune(params: CreateFineTuneParams): Promise<any>;
  getStatus?(id: string): Promise<any>;
  getFineTuneJob?(id: string): Promise<any>;
  listFineTuneJobs?(): Promise<any>;
  deleteFineTuneJob?(id: string): Promise<any>;
  prepareFile?(params: CreateFineTuneParams): Promise<string>;
}

export interface ProviderAdapterConfig {
  apiKey: string;
  [key: string]: any;
}
