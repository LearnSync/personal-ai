import { Archive, Pencil, Plus, Trash2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { generateUUID } from "@/core";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  chatGptIcon,
  claudeAIIcon,
  geminiIcon,
  ollamaIcon,
} from "./sidebar-icon";

interface DefaultSidebarProps {
  className?: string;
}

const DefaultSidebar: React.FC<DefaultSidebarProps> = ({
  className,
  ...props
}) => {
  const startNewChatOptions = React.useMemo(() => {
    // The Default AI Model
    return [
      {
        id: generateUUID(),
        icon: <Plus className="w-5 h-5" />,
        label: "Start New Chat",
        action: () => console.log("Start New Chat"),
        className: "",
      },
    ];
  }, []);

  const startNewChatWithAvailableModels = React.useMemo(() => {
    // Except Default Options
    return [
      {
        id: generateUUID(),
        icon: ollamaIcon({ className: "w-4 h-4" }),
        label: "Start New Chat with  Llama",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#2f96dc] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: chatGptIcon({ className: "w-5 h-5 fill-white" }),
        label: "Start New Chat with OpenAI",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#10a37f] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: geminiIcon({ className: "w-5 h-5 fill-white" }),
        label: "Start New Chat with Gemini",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#8b6ac2] to-[#2f96dc] text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: claudeAIIcon({ className: "w-5 h-5" }),
        label: "Start New Chat with Claude AI",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-white to-[#cc9b7a] text-transparent bg-clip-text",
      },
    ];
  }, []);

  return (
    <div className={cn("w-full h-screen", className)} {...props}>
      <div className="flex items-center justify-center w-full h-[4rem] py-4">
        <Popover>
          <PopoverTrigger className="flex items-center justify-center">
            <Button>
              <Plus className="w-6 h-6" />
              <span>Start New Chat</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "border select-none border-muted-foreground/40 bg-muted p-2 rounded-2xl w-80"
            )}
          >
            {startNewChatOptions?.map((opt) => (
              <Button
                variant={"ghost"}
                className={cn(
                  "w-full hover:bg-muted-foreground/20 justify-start items-center overflow-hidden",
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

            {startNewChatWithAvailableModels?.map((opt) => (
              <Button
                variant={"ghost"}
                className={cn(
                  "w-full hover:bg-muted-foreground/20 justify-start items-center overflow-hidden",
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

      {/* Chat History */}
      <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
        <div className="w-full">
          {new Array(10).fill(Math.random()).map(() => (
            <div className="px-4 pb-4 border-b">
              <p className="capitalize font-[600] text-sm text-muted-foreground py-3 pb-2">
                today
              </p>
              <SidebarItem
                id={generateUUID()}
                label="Chat 1"
                onClick={() => {
                  console.log("Clicked Chat 1!");
                }}
                options={[
                  {
                    id: generateUUID(),
                    label: "Rename",
                    icon: <Pencil className="w-5 h-5" />,
                    action: () => console.log("Rename"),
                  },
                  {
                    id: generateUUID(),
                    label: "Archive",
                    icon: <Archive className="w-5 h-5" />,
                    action: () => console.log("Archive"),
                  },
                  {
                    id: generateUUID(),
                    label: "Delete",
                    icon: <Trash2 className="w-5 h-5" />,
                    action: () => console.log("Delete"),
                    className: "text-red-500 hover:text-red-500",
                  },
                ]}
              />
              <SidebarItem
                id={generateUUID()}
                label="Chat 2"
                onClick={() => {
                  console.log("Clicked Chat 2!");
                }}
                options={[
                  {
                    id: generateUUID(),
                    label: "Rename",
                    icon: <Pencil className="w-5 h-5" />,
                    action: () => console.log("Rename"),
                  },
                  {
                    id: generateUUID(),
                    label: "Archive",
                    icon: <Archive className="w-5 h-5" />,
                    action: () => console.log("Archive"),
                  },
                  {
                    id: generateUUID(),
                    label: "Delete",
                    icon: <Trash2 className="w-5 h-5" />,
                    action: () => console.log("Delete"),
                    className: "text-red-500 hover:text-red-500",
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DefaultSidebar;
