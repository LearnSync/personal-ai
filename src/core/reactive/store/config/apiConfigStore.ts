import { create } from "zustand";

import { IGeneralAiProvider } from "@/core/types/aiProvider";
import { IApiConfig } from "@/core/types/apiConfig";
import { EAiProvider } from "@/core/types/enum";

// ----- Default max tokens
const DEFAULT_MAX_TOKENS = "2048";

// ----- Store
interface ApiConfigState {
  // ----- States
  anthropicConfigs: IGeneralAiProvider[];
  geminiConfigs: IGeneralAiProvider[];
  openaiConfigs: IGeneralAiProvider[];
  ollamaConfigs: IGeneralAiProvider[];
  localConfigs: boolean | null;
  model: EAiProvider | null;
  variant: string | null;

  // ----- Actions
  setConfig: (config: IApiConfig) => void;
  addConfig: (type: keyof IApiConfig, provider: IGeneralAiProvider) => void;
  updateProvider: (
    type: keyof IApiConfig,
    index: number,
    updatedProvider: Partial<IGeneralAiProvider>
  ) => void;
  deleteProvider: (type: keyof IApiConfig, index: number) => void;
  setLocalConfig: (isEnabled: boolean) => void;
  setModel: (model: EAiProvider) => void;
  setVariant: (variant: string) => void;
}

export const useApiConfigStore = create<ApiConfigState>()((set) => ({
  // Initial State
  anthropicConfigs: [],
  geminiConfigs: [],
  openaiConfigs: [],
  ollamaConfigs: [],
  localConfigs: null,
  model: null,
  variant: null,

  // ----- Actions
  setConfig: (config) =>
    set(() => ({
      anthropicConfigs: addDefaultTokens(config.anthropicConfigs),
      geminiConfigs: addDefaultTokens(config.geminiConfigs),
      openaiConfigs: addDefaultTokens(config.openaiConfigs),
      ollamaConfigs: addDefaultTokens(config.ollamaConfigs),
      localConfigs: config.localConfigs ?? null,
      model: config.model ?? EAiProvider.LOCAL,
      variant: config.variant ?? "",
    })),

  addConfig: (type, provider) => {
    set((state) => ({
      [type]: [...(state[type] as IGeneralAiProvider[]), provider],
    }));
  },

  updateProvider: (type, index, updatedProvider) => {
    set((state) => {
      const providers = [...(state[type] as IGeneralAiProvider[])];
      if (providers[index]) {
        providers[index] = { ...providers[index], ...updatedProvider };
      }
      return { [type]: providers };
    });
  },

  deleteProvider: (type, index) => {
    set((state) => {
      const providers = [...(state[type] as IGeneralAiProvider[])];
      providers.splice(index, 1);
      return { [type]: providers };
    });
  },

  setLocalConfig: (isEnabled) => {
    set(() => ({
      localConfigs: isEnabled,
    }));
  },

  setModel: (model) => {
    set(() => ({
      model,
    }));
  },

  setVariant: (variant) => {
    set(() => ({
      variant,
    }));
  },
}));

function addDefaultTokens(
  providers?: IGeneralAiProvider[]
): IGeneralAiProvider[] {
  return (
    providers?.map((provider) => ({
      ...provider,
      maxTokens: provider?.maxTokens || DEFAULT_MAX_TOKENS,
    })) ?? []
  );
}
