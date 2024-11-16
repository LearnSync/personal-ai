import { Lock, MessageCircle, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useTabSessionStore } from "@/core/reactive/store/sessionManager/tabSessionManager";

interface TabItemProps {
  id: string;
  label: string;
  isLocked: boolean;
  className?: string;
}

export const TabItem: React.FC<TabItemProps> = ({
  id,
  label,
  isLocked,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const tabSessionManager = useTabSessionStore();

  const handleTabLock = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      isLocked
        ? tabSessionManager.unlockTab(id)
        : tabSessionManager.removeTab(id);
    },
    [tabSessionManager]
  );

  return (
    <Button
      size={"sm"}
      variant={tabSessionManager.activeTab?.id === id ? "secondary" : "ghost"}
      onClick={() => tabSessionManager.setActiveTab(id)}
      {...props}
    >
      {/* Icon */}
      <button
        className="flex items-center text-muted-foreground"
        onMouseEnter={() => !isLocked && setIsHovered((prev) => !prev)}
        onMouseLeave={() => !isLocked && setIsHovered((prev) => !prev)}
        onClick={(e) => {
          e.stopPropagation();
          setIsHovered(false);
          return !isLocked && tabSessionManager.lockTab(id);
        }}
      >
        {isHovered ? <Lock /> : <MessageCircle />}
      </button>

      {/* Label */}
      <span className="flex-grow">{label}</span>

      {/* (Lock/Unlock) button */}
      <button
        className="p-1 ml-2 rounded text-muted-foreground hover:bg-white/20"
        onClick={handleTabLock}
        aria-label={isLocked ? "Unlock Tab" : "Lock Tab"}
      >
        {isLocked ? <Lock className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </button>
    </Button>
  );
};
TabItem.displayName = "TabItem";

export default TabItem;
