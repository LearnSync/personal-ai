import * as React from "react";

import { AI_MODEL_VARIANTS } from "@/constants";
import { generateUUID } from "@/core";
import { IAiModel } from "@/core/types/aiProvider";
import { EAiProvider } from "@/core/types/enum";

export const useAvailableModels = () => {
  const models = React.useMemo<IAiModel[]>(() => {
    return [
      {
        id: generateUUID(),
        label: "Local",
        model: EAiProvider.LOCAL,
        variants: AI_MODEL_VARIANTS.OLLAMA,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#2f96dc] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        label: "Llama",
        model: EAiProvider.OLLAMA,
        variants: AI_MODEL_VARIANTS.OLLAMA,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#2f96dc] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        label: "OpenAI",
        model: EAiProvider.OPENAI,
        variants: AI_MODEL_VARIANTS.OPENAI,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#10a37f] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        label: "Gemini",
        model: EAiProvider.GEMINI,
        variants: AI_MODEL_VARIANTS.GEMINI,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#8b6ac2] to-[#2f96dc] text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        label: "Claude AI",
        model: EAiProvider.ANTHROPIC,
        variants: AI_MODEL_VARIANTS.ANTHROPIC,
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-white to-[#cc9b7a] text-transparent bg-clip-text",
      },
    ];
  }, []);

  // Effects
  // TODO: Update @SOUMITRO-SAHA
  React.useEffect(() => {}, []);

  return {
    models,
  };
};

export default useAvailableModels;
