export interface IApiConfig {
  anthropicConfigs?: IGeneralAiProvider[];
  geminiConfigs?: IGeneralAiProvider[];
  openaiConfigs?: IGeneralAiProvider[];
  ollamaConfigs?: IGeneralAiProvider[];
  localConfigs?: boolean;
  model: EAiProvider;
  variant: string;
}
