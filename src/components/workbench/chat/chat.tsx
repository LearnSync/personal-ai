import localforage from "localforage";
import { Archive, Pen, Star } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePlatformContext } from "@/context/platform.context";
import { ILlmMessage } from "@/core/types";
import { EAiProvider } from "@/core/types/enum";
import { useToast } from "@/hooks/use-toast";
import useAvailableModels from "@/hooks/useAvailableModels";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { AutoResizingInput } from "../_components";
import { Conversation } from "../_components/conversation";
import EmptyWorkspace from "./empty-workspace";

export const Chat = () => {
  const [messages, setMessages] = React.useState<ILlmMessage[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    undefined
  );
  const [aiResponseText, setAiResponseText] = React.useState<string>("");

  // ----- Context
  const {
    sessionManager,
    activeExtensionTab,
    activeWorkbenchTab,
    startChatSession,
  } = usePlatformContext();

  // ----- Hooks
  const { toast } = useToast();
  const { models } = useAvailableModels();

  // ----- React Query
  const chatMutation = useMutation({
    mutationKey: ["chat_with_llm", activeWorkbenchTab?.id],
    mutationFn: async ({
      sessionId,
      value,
    }: {
      sessionId: string;
      value: string;
    }) => {
      await sessionManager.sendMessageToLLM({
        tabId: String(sessionId),
        message: value,
        onText: (text) => {
          setAiResponseText(text);
        },
        onFinalMessage: () => {
          const chatHistory = sessionManager.getChatSession(sessionId);

          if (chatHistory) {
            setMessages(chatHistory.messages);
          }
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error,
          });
        },
      });
    },
  });

  // ----- Memoisation
  const activeChatSessionOnCurrentTab = React.useMemo(() => {
    const activeTab = sessionManager.getActiveTab();
    if (!activeTab) return null;
    return sessionManager.getChatSession(activeTab.id);
  }, [activeExtensionTab]);

  const handleChatWithLLM = React.useCallback(
    async (value: string, sessionId: string) => {
      await chatMutation.mutateAsync({
        sessionId,
        value,
      });
    },
    [activeWorkbenchTab, sessionManager, toast]
  );

  const handleConverSation = async (value: string) => {
    if (!selectedValue) {
      toast({
        title: "Info",
        description: "Starting the conversation with the last used model.",
      });
    }

    if (!activeWorkbenchTab) {
      const sessionStatus = startChatSession(EAiProvider.LOCAL);
      if (sessionStatus) {
        handleChatWithLLM(value, sessionStatus.tab.id);
      }
    } else {
      const sessionId =
        activeWorkbenchTab.id ?? sessionManager.getActiveTab()?.id;
      handleChatWithLLM(value, sessionId);
    }
  };

  // ----- Side Effects
  React.useEffect(() => {
    (async function () {
      const lastUsedModel: string | null = await localforage.getItem(
        "lastUsedModel"
      );

      if (lastUsedModel) {
        setSelectedValue(lastUsedModel);
      }
    })();
  }, []);

  return (
    <section className="relative h-full">
      {activeWorkbenchTab && activeExtensionTab.id && (
        <div className="sticky top-0 left-0 flex items-center justify-between w-full pr-5 bg-background-1 h-fit">
          <Select
            value={selectedValue && selectedValue}
            onValueChange={async (value) => {
              setSelectedValue(value);

              /**
               * Setting the last use model to the indexed db
               */
              await localforage.setItem("lastUsedModel", value);
            }}
          >
            <SelectTrigger className="h-8 w-[150px] focus:ring-0 bg-background-2 shadow-inner shadow-background-1/40">
              <SelectValue
                className={cn("")}
                placeholder={
                  activeChatSessionOnCurrentTab?.aiProvider ?? (
                    <div>Not Selected</div>
                  )
                }
              />
            </SelectTrigger>
            <SelectContent>
              {models?.map((opt) => (
                <SelectItem value={opt.label}>
                  <div
                    className={cn("flex items-center space-x-2", opt.className)}
                  >
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                </SelectItem>
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
                <Button variant={"ghost"} size={"icon"}>
                  <Star className="w-5 h-5" />
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
          {activeWorkbenchTab && activeExtensionTab.id ? (
            <div className="flex flex-col w-full h-full pb-4">
              <Conversation response={aiResponseText} messages={messages} />
            </div>
          ) : (
            <EmptyWorkspace />
          )}
        </div>
      </div>

      <div className="sticky bottom-0 z-50 w-full lg:w-[85%] mx-auto bg-background-1">
        <div className="pb-5">
          <AutoResizingInput onEnter={handleConverSation} />
        </div>
      </div>
    </section>
  );
};

export default React.memo(Chat);
