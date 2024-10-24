import { cn } from "@/lib/utils";
import React from "react";

interface LLMResponseProps {
  message?: string;
  className?: string;
}

export const LLMResponse: React.FC<LLMResponseProps> = React.memo(
  ({ message, ...rest }) => {
    if (!message) return null;

    return (
      <div className={cn("bg-transparent")} {...rest}>
        {message}
      </div>
    );
  }
);

export default LLMResponse;
