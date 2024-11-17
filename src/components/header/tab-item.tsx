import { Lock, MessageCircle, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useSessionManager } from "@/core/reactive/hooks/useSessionManager";
import { useSessionManagerStore } from "@/core/reactive/store/sessionManager/sessionManagerStore";
import { getIconByKey } from "@/constants";

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

  // ----- Hooks
  const { onTabClose, onTabClick } = useSessionManager();

  // ----- Store
  const sessionManager = useSessionManagerStore();

  const handleTabLock = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      isLocked ? sessionManager.unlockTab(id) : onTabClose(id);
    },
    [sessionManager]
  );

  return (
    <Button
      size={"sm"}
      variant={
        sessionManager.activeTab &&
        sessionManager.activeTab.tab &&
        sessionManager.activeTab.tab.id === id
          ? "secondary"
          : "ghost"
      }
      onClick={() => onTabClick(id)}
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
          return !isLocked && sessionManager.lockTab(id);
        }}
      >
        {isHovered ? (
          <Lock />
        ) : sessionManager.activeTab && sessionManager.getTab(id)?.extension ? (
          getIconByKey(sessionManager.getTab(id)?.extension?.identificationKey)
        ) : (
          <MessageCircle />
        )}
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
