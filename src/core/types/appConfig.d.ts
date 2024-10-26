import { EAiProvider } from "./enum";

export interface IApiConfig {
  anthropic?: {
    apikey: string;
    model: string;
    maxTokens: string;
  };
  openai?: {
    apikey: string;
    model: string;
    maxTokens: string;
  };
  greptile?: {
    apikey: string;
    githubPAT: string;
    repoinfo: {
      remote: string;
      repository: string;
      branch: string;
    };
  };
  ollama?: {
    endpoint: string;
    model: string;
    maxTokens: string;
  };
  whichApi: EAiProvider;
}
