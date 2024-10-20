import { cn } from "@/lib/utils";
import * as React from "react";
import LLMResponse from "./llm-response";
import UserMessage from "./user-message";

export interface Message {
  type: "user" | "llm";
  text: string;
}

interface ConversationProps {
  messages?: Message[];
}

export const Conversation: React.FC<ConversationProps> = React.memo(
  ({ messages = [] }) => {
    const [messageHistory] = React.useState<Message[]>(messages);

    return (
      <main
        className={cn(
          "flex flex-col w-full h-full gap-5 p-6 overflow-y-auto justify-end"
        )}
      >
        {messageHistory.map((message, index) => (
          <div key={index}>
            {message.type === "user" ? (
              <UserMessage message={message.text} />
            ) : (
              <LLMResponse message={message.text} />
            )}
          </div>
        ))}
      </main>
    );
  }
);

export default Conversation;
