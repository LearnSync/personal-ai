import { cn } from "@/lib/utils";
import * as React from "react";
import LLMResponse from "./llm-response";
import UserMessage from "./user-message";
import { ILlmMessage } from "@/core/types";

interface ConversationProps {
  response: string;
  messages: ILlmMessage[];
}

export const Conversation: React.FC<ConversationProps> = React.memo(
  ({ response = "", messages = [] }) => {
    console.log("State Chat History form Conversation: ", messages);

    return (
      <main
        className={cn(
          "flex flex-col w-full h-full gap-5 p-6 overflow-y-auto justify-end"
        )}
      >
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === "user" ? (
              <UserMessage message={message.content} />
            ) : message.role === "assistant" && response ? (
              <LLMResponse
                message={
                  index === messages.length - 1 ? response : message.content
                }
              />
            ) : (
              ""
            )}
          </div>
        ))}
      </main>
    );
  }
);

export default React.memo(Conversation);
