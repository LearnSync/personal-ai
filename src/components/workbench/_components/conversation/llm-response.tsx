import * as React from "react";

import { MessageSquareDot } from "lucide-react";
import { MarkdownRender } from "@/components/general-components/markdown.component";
import {
  chatGptIcon,
  claudeAIIcon,
  geminiIcon,
  ollamaIcon,
} from "@/components/sidebar";
import { cn } from "@/lib/utils";

interface LLMResponseProps {
  model?: string;
  message?: string;
  className?: string;
}

export const LLMResponse: React.FC<LLMResponseProps> = ({
  model,
  message,
  className,
  ...props
}) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "flex p-5 rounded-xl space-x-4 mb-16 bg-transparent",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "rounded-full max-w-10 max-h-10 min-w-10 min-h-10 bg-white/20",
          message ? "" : "p-4 mt-auto"
        )}
      >
        {model?.toLowerCase() === "llama" ? (
          ollamaIcon({ className: "w-10 h-10" })
        ) : model?.toLowerCase() === "openai" ? (
          chatGptIcon({ className: "w-10 h-10" })
        ) : model?.toLowerCase() === "gemini" ? (
          geminiIcon({ className: "w-10 h-10" })
        ) : model?.toLowerCase() === "anthropic" ? (
          claudeAIIcon({ className: "w-10 h-10" })
        ) : (
          <MessageSquareDot className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      <div className="overflow-hidden ">
        <MarkdownRender content={message} />
      </div>
    </div>
  );
};

export default LLMResponse;
