import { type IGeneralAiProvider } from "./aiProvider";

export interface IApiConfigAiProvider {
  anthropicConfigs: IGeneralAiProvider[];
  geminiConfigs: IGeneralAiProvider[];
  openaiConfigs: IGeneralAiProvider[];
  ollamaConfigs: IGeneralAiProvider[];
  localConfigs: IGeneralAiProvider[];
  embeddingConfigs: IGeneralAiProvider[];
}

export interface IApiConfig extends IApiConfigAiProvider {
  model: EAiProvider;
  variant: string;
}
