import {
  chatGptIcon,
  claudeAIIcon,
  geminiIcon,
  ollamaIcon,
} from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { MessageSquareDot } from "lucide-react";
import * as React from "react";

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
      className={cn("bg-transparent flex items-center space-x-4", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full w-fit h-fit bg-white/20",
          message ? "" : "p-4 "
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

      <div>{message}</div>
    </div>
  );
};

export default LLMResponse;
