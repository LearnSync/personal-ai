import { MessageSquareDot } from "lucide-react";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";

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
        <ReactMarkdown
          children={message}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  // @ts-ignore-next-line
                  style={oneDark}
                  className={cn(
                    "border border-muted-foreground shadow-inner overflow-x-auto"
                  )}
                  {...rest}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        />
      </div>
    </div>
  );
};

export default LLMResponse;
