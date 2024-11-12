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
import { EAiProvider } from "@/core/types/enum";
import { useToast } from "@/hooks/use-toast";
import useAvailableModels from "@/hooks/useAvailableModels";
import useChat from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { AutoResizingInput } from "../_components";
import { Conversation } from "../_components/conversation";
import { EmptyWorkspace } from "./empty-workspace";

export const Chat = React.memo(() => {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    undefined
  );

  // ----- Context
  const { sessionManager, activityExtensionManager } = usePlatformContext();

  // ----- Hooks
  const { toast } = useToast();
  const { models } = useAvailableModels();
  const chat = useChat();

  // ----- Memoisation
  const activeChatSessionOnCurrentTab = React.useMemo(() => {
    const activeTab = sessionManager.activeTab;
    if (!activeTab) return null;
    return sessionManager.getChatSessionById(activeTab.id);
  }, [activityExtensionManager]);

  const handleConverSation = async (value: string) => {
    if (!selectedValue) {
      toast({
        title: "Info",
        description: "Starting the conversation with the last used model.",
      });
    }

    if (!sessionManager.tabs) {
      const sessionStatus = sessionManager.startChatSession(
        EAiProvider.LOCAL,
        "llama3.2"
      );
      if (sessionStatus) {
        chat.sendMessageToLLM(value, sessionStatus.tab.id);
      }
    } else {
      const sessionId = sessionManager.activeTab?.id;
      if (sessionId) chat.sendMessageToLLM(value, sessionId);
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
      {sessionManager.tabs && activityExtensionManager.activeExtension?.id && (
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
                  activeChatSessionOnCurrentTab?.model ?? (
                    <div>Not Selected</div>
                  )
                }
              />
            </SelectTrigger>
            <SelectContent>
              {models?.map((opt) => (
                <SelectItem key={opt.id} value={opt.label}>
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
          {chat.messages.length > 0 ? (
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

      <div className="sticky bottom-0 z-50 w-full lg:w-[85%] mx-auto bg-background-1">
        <div className="pb-5">
          <AutoResizingInput
            isGenerating={chat.isGenerating}
            success={chat.success}
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
