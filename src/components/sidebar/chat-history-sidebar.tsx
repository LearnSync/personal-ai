import { cn } from "@/lib/utils";
import React from "react";
import SidebarItem from "./sidebar-item";
import { Separator } from "../ui/separator";
import { Archive, FileClock, Star } from "lucide-react";

interface ChatHistorySidebarProps {
  className?: string;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = (props) => {
  return (
    <div className={cn("px-2", props.className)} {...props}>
      <SidebarItem
        label="Chat History"
        icon={<FileClock className="w-6 h-6" />}
        id="chat_history"
        displayOption={false}
        className="my-2 bg-muted/40"
      />
      <SidebarItem
        label="Bookmarked Chats"
        icon={<Star className="w-6 h-6" />}
        id="bookmarked_chats"
        displayOption={false}
        className="my-2 bg-muted/40"
      />
      <SidebarItem
        icon={<Archive className="w-6 h-6" />}
        label="Archived Chats"
        id="archived_chats"
        displayOption={false}
        className="my-2 bg-muted/40"
      />
    </div>
  );
};

export default ChatHistorySidebar;
