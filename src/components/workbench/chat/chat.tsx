import { Archive, Pen, Star } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getIconByIconKey } from "@/constants";
import { useChat } from "@/core/reactive/hooks/useChat";
import { useApiConfigStore } from "@/core/reactive/store/config/apiConfigStore";
import { useSessionManagerStore } from "@/core/reactive/store/sessionManager/sessionManagerStore";
import { IGeneralAiProvider } from "@/core/types/aiProvider";
import { EAiProvider } from "@/core/types/enum";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { AutoResizingInput } from "../_components";
import { Conversation } from "../_components/conversation";
import { EmptyWorkspace } from "./empty-workspace";

export const Chat = React.memo(() => {
  // ----- Store
  const { activeTab, createTab } = useSessionManagerStore();
  const { model, variant, setModel, setVariant } = useApiConfigStore();
  const { geminiConfigs, ollamaConfigs, anthropicConfigs, openaiConfigs } =
    useApiConfigStore();

  // ----- Hooks
  const { toast } = useToast();
  const chat = useChat();

  const availableModels: IGeneralAiProvider[] = React.useMemo(
    () => [
      ...geminiConfigs,
      ...ollamaConfigs,
      ...anthropicConfigs,
      ...openaiConfigs,
    ],
    [geminiConfigs, ollamaConfigs, anthropicConfigs, openaiConfigs]
  );

  console.log("Chat: ", chat);

  // ----- Handlers
  const handleModelChange = async (value: string) => {
    const selectedItem = JSON.parse(value) as {
      model: EAiProvider;
      variant: string;
    };

    const getModel = (model: string) => {
      switch (model) {
        case EAiProvider.LOCAL:
          return EAiProvider.LOCAL;
        case EAiProvider.OLLAMA:
          return EAiProvider.OLLAMA;
        case EAiProvider.ANTHROPIC:
          return EAiProvider.ANTHROPIC;
        case EAiProvider.GEMINI:
          return EAiProvider.GEMINI;
        case EAiProvider.GREPTILE:
          return EAiProvider.GREPTILE;
        case EAiProvider.OPENAI:
          return EAiProvider.OPENAI;
        default:
          return EAiProvider.LOCAL;
      }
    };

    if (selectedItem) {
      setModel(getModel(selectedItem.model));
      setVariant(selectedItem.variant);
    }
  };

  const handleConverSation = async (value: string) => {
    if (!model) {
      toast({
        title: "Info",
        description: "Starting the conversation with the last used model.",
      });
    }

    if (!activeTab) {
      // First create a new tab
      createTab(`Chat with ${model}`);

      if (value) {
        chat.sendMessage({
          content: value,
        });
      }
    } else {
      if (!chat) {
        toast({
          title: "Error",
          description: "Failed to create a new chat. Please try again.",
        });
        return;
      }

      if (chat && value) {
        chat.sendMessage({
          content: value,
        });
      }
    }
  };

  return (
    <section className="relative h-full">
      <ScrollArea className="relative flex-1 w-full h-full">
        {activeTab && activeTab.tab.id && (
          <div className="sticky top-0 left-0 flex items-center justify-between w-full pr-5 bg-background-1 h-fit">
            <Select
              value={JSON.stringify({ model, variant })}
              onValueChange={handleModelChange}
            >
              <SelectTrigger className="h-8 w-[150px] focus:ring-0 bg-background-2 shadow-inner shadow-background-1/40 text-xs">
                <SelectValue placeholder={"Not Selected"} />
              </SelectTrigger>
              <SelectContent>
                {availableModels
                  ?.reduce((unique: IGeneralAiProvider[], model) => {
                    const exists = unique.some(
                      (item) => item.variant === model.variant
                    );
                    if (!exists) unique.push(model);
                    return unique;
                  }, [])
                  ?.map((opt) => (
                    <SelectGroup key={opt.model}>
                      <SelectLabel className={cn("text-white")}>
                        {opt.model}
                      </SelectLabel>
                      <SelectItem
                        value={JSON.stringify({
                          model: opt.model,
                          variant: opt.variant,
                        })}
                      >
                        <div className={cn("flex items-center space-x-2")}>
                          <span>
                            {getIconByIconKey({
                              key: opt.model,
                              className: "w-4 h-4",
                            })}
                          </span>
                          <span className={cn("flex items-center space-x-1")}>
                            <span>{opt.model}</span>
                            {opt.variant && <span>({opt.variant})</span>}
                          </span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  ))}
              </SelectContent>
            </Select>

            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <Pen className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="border select-none border-muted-foreground/40"
                >
                  <span>Rename</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Star
                      className={cn(
                        "w-5 h-5",
                        chat.favorite ? "fill-primary" : "fill-transparent"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="border select-none border-muted-foreground/40"
                >
                  <span>Bookmark</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <Archive className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="border select-none border-muted-foreground/40"
                >
                  <span>Archive</span>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        <div className="container h-full mx-auto max-w-7xl">
          <div className="lg:w-[85%] mx-auto ">
            {activeTab && activeTab.tab && chat && chat.messages?.length > 0 ? (
              <div className="flex flex-col w-full h-full pb-4">
                <Conversation
                  isLoading={chat.isLoading}
                  messages={chat.messages}
                />
              </div>
            ) : (
              <EmptyWorkspace />
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 z-50 w-full lg:w-[85%] mx-auto bg-background-1">
        <div className="pb-5">
          <AutoResizingInput
            isGenerating={chat.isLoading}
            success={!chat.isLoading}
            onEnter={handleConverSation}
            onAbort={chat.abort}
          />
        </div>
      </div>
    </section>
  );
});
Chat.displayName = "Chat";

export default Chat;
