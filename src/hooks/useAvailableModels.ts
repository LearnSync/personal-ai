import * as React from "react";

import {
  chatGptIcon,
  claudeAIIcon,
  geminiIcon,
  ollamaIcon,
} from "@/components/sidebar";
import { AI_MODEL_VARIANTS } from "@/constants";
import { generateUUID } from "@/core";
import { IAiModel } from "@/core/types/aiProvider";
import { EAiProvider } from "@/core/types/enum";

export const useAvailableModels = () => {
  const models = React.useMemo<IAiModel[]>(() => {
    return [
      {
        id: generateUUID(),
        icon: ollamaIcon({ className: "w-4 h-4" }),
        label: "Llama",
        model: EAiProvider.OLLAMA,
        variants: AI_MODEL_VARIANTS.LLAMA,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#2f96dc] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: chatGptIcon({ className: "w-5 h-5 fill-white" }),
        label: "OpenAI",
        model: EAiProvider.OPENAI,
        variants: AI_MODEL_VARIANTS.OPENAI,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#10a37f] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: geminiIcon({ className: "w-5 h-5 fill-white" }),
        label: "Gemini",
        model: EAiProvider.GEMINI,
        variants: AI_MODEL_VARIANTS.GEMINI,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#8b6ac2] to-[#2f96dc] text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: claudeAIIcon({ className: "w-5 h-5" }),
        label: "Claude AI",
        model: EAiProvider.ANTHROPIC,
        variants: AI_MODEL_VARIANTS.ANTHROPIC,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-white to-[#cc9b7a] text-transparent bg-clip-text",
      },
    ];
  }, []);

  return {
    models,
  };
};

export default useAvailableModels;
