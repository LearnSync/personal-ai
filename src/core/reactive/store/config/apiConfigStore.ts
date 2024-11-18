import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { IGeneralAiProvider } from "@/core/types/aiProvider";
import { IApiConfig } from "@/core/types/apiConfig";
import { EAiProvider } from "@/core/types/enum";
import { storage } from "..";

// Default max tokens
const DEFAULT_MAX_TOKENS = "2048";

// Store interface
interface ApiConfigState extends IApiConfig {
  // Getters
  getConfig: (type: EAiProvider) => IGeneralAiProvider[];

  // Actions
  setConfig: (config: IApiConfig) => void;
  addConfig: (type: EAiProvider, provider: IGeneralAiProvider) => void;
  updateProvider: (
    type: EAiProvider,
    index: number,
    updatedProvider: Partial<IGeneralAiProvider>,
  ) => void;
  deleteProvider: (type: EAiProvider, index: number) => void;
  setModel: (model: EAiProvider) => void;
  setVariant: (variant: string) => void;
}

export const useApiConfigStore = create<ApiConfigState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        anthropicConfigs: [],
        geminiConfigs: [],
        openaiConfigs: [],
        ollamaConfigs: [],
        localConfigs: [],
        model: null,
        variant: "",

        // Getters
        getConfig: (type) => {
          const {
            anthropicConfigs,
            geminiConfigs,
            openaiConfigs,
            ollamaConfigs,
            localConfigs,
          } = get();
          switch (type) {
            case EAiProvider.ANTHROPIC:
              return anthropicConfigs;
            case EAiProvider.GEMINI:
              return geminiConfigs;
            case EAiProvider.OPENAI:
              return openaiConfigs;
            case EAiProvider.OLLAMA:
              return ollamaConfigs;
            case EAiProvider.LOCAL:
              return localConfigs;
            default:
              throw new Error(`Invalid config type: ${type}`);
          }
        },

        // Actions
        setConfig: (config) =>
          set(() => ({
            anthropicConfigs: addDefaultTokens(config.anthropicConfigs),
            geminiConfigs: addDefaultTokens(config.geminiConfigs),
            openaiConfigs: addDefaultTokens(config.openaiConfigs),
            ollamaConfigs: addDefaultTokens(config.ollamaConfigs),
            localConfigs: addDefaultTokens(config.localConfigs),
            model: config.model ?? EAiProvider.LOCAL,
            variant: config.variant ?? "",
          })),

        addConfig: (type, provider) => {
          set((state) => {
            if (state.hasOwnProperty(type)) {
              const currentConfigs = state.getConfig(type);

              if (!currentConfigs) {
                throw new Error(`Invalid config type: ${type}`);
              }
              return {
                [type]: [...currentConfigs, provider],
              };
            } else {
              return state;
            }
          });
        },

        updateProvider: (type, index, updatedProvider) =>
          set((state) => {
            const providers = state.getConfig(type);

            if (!providers || !providers[index]) {
              throw new Error(
                `Invalid provider index: ${index} for type: ${type}`,
              );
            }
            const updatedProviders = [...providers];
            updatedProviders[index] = {
              ...providers[index],
              ...updatedProvider,
            };
            return { [type]: updatedProviders };
          }),

        deleteProvider: (type, index) =>
          set((state) => {
            const providers = state.getConfig(type);
            if (!providers || !providers[index]) {
              throw new Error(
                `Invalid provider index: ${index} for type: ${type}`,
              );
            }
            const updatedProviders = providers.filter((_, i) => i !== index);
            return { [type]: updatedProviders };
          }),

        setModel: (model) => set(() => ({ model })),
        setVariant: (variant) => set(() => ({ variant })),
      })),
      {
        name: "api-config-store",
        partialize: (state) => ({
          anthropicConfigs: state.anthropicConfigs,
          geminiConfigs: state.geminiConfigs,
          openaiConfigs: state.openaiConfigs,
          ollamaConfigs: state.ollamaConfigs,
          localConfigs: state.localConfigs,
          model: state.model,
          variant: state.variant,
        }),
        storage: storage,
      },
    ),
    { name: "ApiConfigStore" },
  ),
);

// Utility function to add default tokens
function addDefaultTokens(
  providers?: IGeneralAiProvider[],
): IGeneralAiProvider[] {
  return (
    providers?.map((provider) => ({
      ...provider,
      maxTokens: provider?.maxTokens || DEFAULT_MAX_TOKENS,
    })) ?? []
  );
}
