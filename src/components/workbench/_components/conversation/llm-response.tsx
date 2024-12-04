import * as React from "react";

import { MarkdownRender } from "@/components/general-components/markdown.component";
import { getIconByIconKey } from "@/constants";
import { EAiProvider } from "@/core/types/enum";
import { cn } from "@/lib/utils";

interface LLMResponseProps {
  model: string;
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
          "rounded-full max-w-10 max-h-10 min-w-10 min-h-10 bg-white/20 flex items-center justify-center",
          message ? "" : "p-4 mt-auto"
        )}
      >
        {getIconByIconKey({
          key: model as EAiProvider,
          className: cn("w-8 h-8"),
        })}
      </div>

      <div className="overflow-hidden ">
        <MarkdownRender content={message} />
      </div>
    </div>
  );
};

export default LLMResponse;
