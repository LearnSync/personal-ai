import * as React from "react";

import { ILlmMessage } from "@/core/types";
import { cn } from "@/lib/utils";
import localforage from "localforage";
import { Ellipsis } from "lucide-react";
import LLMResponse from "./llm-response";
import UserMessage from "./user-message";

interface ConversationProps {
  isLoading: boolean;
  messages: ILlmMessage[];
}

export const Conversation: React.FC<ConversationProps> = ({
  isLoading = false,
  messages = [],
}) => {
  const [lastUsedModel, setLastUsedModel] = React.useState<string>("");

  // Effect
  React.useEffect(() => {
    (async function () {
      const lastUsedModelFromIndexDB = (await localforage.getItem(
        "lastUsedModel"
      )) as string;

      if (lastUsedModelFromIndexDB) {
        setLastUsedModel(() => lastUsedModelFromIndexDB);
      }
    })();
  }, []);

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
          ) : message.role === "assistant" ? (
            <LLMResponse model={lastUsedModel} message={message.content} />
          ) : (
            ""
          )}
        </div>
      ))}

      {/* Loading */}
      {isLoading && (
        <div className="flex w-full">
          <Ellipsis className="w-8 h-8 animate-pulse" />
        </div>
      )}
    </main>
  );
};
Conversation.displayName = "Conversation";

export default Conversation;
