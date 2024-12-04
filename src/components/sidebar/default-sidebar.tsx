import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  Bookmark,
  MessageCircleDashed,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { endpoint } from "@/config/endpoint";
import { createOption } from "@/constants";
import { generateUUID } from "@/core";
import { useApiConfigStore } from "@/core/reactive/store/config/apiConfigStore";
import { useSessionManagerStore } from "@/core/reactive/store/sessionManager/sessionManagerStore";
import { EAiProvider, SIDEBAR_ITEM_OPTION } from "@/core/types/enum";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarItem } from "./sidebar-item";
import { useChatData } from "@/hooks/useChatData";
import { ISidebarOption } from "@/core/types";
import { useSessionManager } from "@/core/reactive/hooks/useSessionManager";

interface DefaultSidebarProps {
  className?: string;
}

interface ChatResponse {
  success: boolean;
  data: any[];
  message: string;
  nextPage: number;
  totalPage: number;
}

const DefaultSidebar: React.FC<DefaultSidebarProps> = ({
  className,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  // ----- Store
  const { createTab } = useSessionManagerStore();
  const { geminiConfigs, ollamaConfigs, anthropicConfigs, openaiConfigs } =
    useApiConfigStore();
  const { activeTab } = useSessionManagerStore();

  // ----- Hooks
  const { toast } = useToast();
  const { queries, results } = useChatData();
  const { onTabClick } = useSessionManager();

  // ----- Memoization
  const startNewChatOptions = React.useMemo(() => {
    return [
      {
        id: generateUUID(),
        label: `Start New Chat with Local`,
        className: "",
        icon: <Plus className="w-5 h-5" />,
        action: () => handleCreateTab("Chat with Local"),
      },
      {
        id: generateUUID(),
        className: "",
        label: `Start Temporary Chat`,
        icon: <MessageCircleDashed className="w-5 h-5" />,
        action: () => handleCreateTab("Quick Chat"),
      },
    ];
  }, []);

  const startNewChatWithAvailableModels = React.useMemo(() => {
    const options = [];

    if (openaiConfigs.length > 0) {
      options.push(
        createOption({
          label: `Start New Chat with Open AI`,
          iconKey: EAiProvider.OPENAI,
          iconClassName: "",
          className: "bg-gradient-to-r from-[#10a37f] to-white",
        })
      );
    }
    if (geminiConfigs.length > 0) {
      options.push(
        createOption({
          label: "Start New Chat with Gemini",
          iconKey: EAiProvider.GEMINI,
          iconClassName: "",
          className: "bg-gradient-to-r from-[#8b6ac2] to-[#2f96dc]",
        })
      );
    }
    if (anthropicConfigs.length > 0) {
      options.push(
        createOption({
          label: "Start New Chat with Claude AI",
          iconKey: EAiProvider.ANTHROPIC,
          iconClassName: "",
          className: "bg-gradient-to-r from-white to-[#cc9b7a]",
        })
      );
    }
    if (ollamaConfigs.length > 0) {
      options.push(
        createOption({
          label: "Start New Chat with Llama",
          iconKey: EAiProvider.OLLAMA,
          iconClassName: "",
          className: "bg-gradient-to-r from-[#2f96dc] to-white",
        })
      );
    }

    return options;
  }, [geminiConfigs, ollamaConfigs, anthropicConfigs, openaiConfigs]);

  const chatOptions = React.useMemo<ISidebarOption[]>(
    () => [
      {
        id: generateUUID(),
        label: "Rename",
        actionIdentifier: SIDEBAR_ITEM_OPTION.RENAME,
        icon: <Pencil className="w-5 h-5" />,
      },
      {
        id: generateUUID(),
        label: "Bookmark",
        actionIdentifier: SIDEBAR_ITEM_OPTION.BOOKMARK,
        icon: <Bookmark className="w-5 h-5" />,
      },
      {
        id: generateUUID(),
        label: "Archive",
        actionIdentifier: SIDEBAR_ITEM_OPTION.ARCHIVED,
        icon: <Archive className="w-5 h-5" />,
      },
      {
        id: generateUUID(),
        label: "Delete",
        actionIdentifier: SIDEBAR_ITEM_OPTION.DELETE,
        icon: <Trash2 className="w-5 h-5" />,
        className: "text-red-500 hover:text-red-500",
      },
    ],
    []
  );

  // ---- Functions
  const handleCreateTab = (label: string) => {
    const response = createTab(label);
    if (response) setOpen(false);
    else {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <div className={cn("w-full h-screen", className)} {...props}>
      <div className="flex items-center justify-center w-full h-[4rem] py-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button onClick={() => setOpen(!open)}>
              <Plus className="w-6 h-6" />
              <span>Start New Chat</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-2 border border-muted-foreground/40 bg-muted rounded-2xl w-80">
            {startNewChatOptions.map((opt) => (
              <Button
                variant="ghost"
                className={cn(
                  "w-full hover:bg-muted-foreground/20 justify-start items-center",
                  opt.className
                )}
                key={opt.id}
                onClick={opt.action}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </Button>
            ))}
            <Separator className="my-2 bg-muted-foreground/40" />
            {startNewChatWithAvailableModels.map((opt) => (
              <Button
                variant="ghost"
                className={cn(
                  "w-full hover:bg-muted-foreground/20 justify-start items-center",
                  opt.className
                )}
                key={opt.id}
                onClick={opt.action}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </Button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <Separator />
      <ScrollArea className="flex-1 h-[calc(100vh-4rem)] w-full">
        <div className="flex flex-col items-center w-full mx-auto">
          {results?.map((result, idx) => {
            const data = result?.data?.data;
            if (!data || (Array.isArray(data) && data.length === 0))
              return null;

            return (
              <div className="w-full pb-4" key={queries[idx].key}>
                <p className="capitalize font-[600] text-xs text-muted-foreground py-3 px-4 pb-2">
                  {queries[idx].key.replace(/-/g, " ")}
                </p>

                <div className="flex flex-col items-center w-full mx-auto">
                  {result.isSuccess &&
                    result?.data?.data?.map((chat: any, i: number) => (
                      <SidebarItem
                        id={chat?.session_id ?? generateUUID()}
                        key={i}
                        chat={chat}
                        label={chat?.session_name}
                        onClick={() => onTabClick(chat?.session_id)}
                        options={chatOptions}
                        className={cn("w-[95%]")}
                        suffixComponent={
                          <div className="flex items-center gap-1">
                            <span>
                              <Archive
                                className={cn(
                                  chat?.archived
                                    ? "fill-secondary-foreground text-secondary"
                                    : "hidden"
                                )}
                              />
                            </span>
                            <span>
                              <Star
                                className={cn(
                                  chat?.favorite
                                    ? "fill-primary text-primary"
                                    : "hidden"
                                )}
                              />
                            </span>
                          </div>
                        }
                      />
                    ))}
                </div>

                {result.isError && (
                  <p className="text-red-500">
                    Failed to load {queries[idx].key} chats.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default React.memo(DefaultSidebar);
