import { Lock, MessageCircle, X } from "lucide-react";
import * as React from "react";

import { usePlatformContext } from "@/context/platform.context";
import { Button } from "../ui/button";

interface TabItemProps {
  id: string;
  label: string;
  isLocked: boolean;
  className?: string;
}

const TabItem: React.FC<TabItemProps> = ({
  id,
  label,
  isLocked,
  className,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const { sessionManager } = usePlatformContext();

  const handleTabLock = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      isLocked ? sessionManager.unlockTab(id) : sessionManager.removeTab(id);
    },
    [sessionManager.getActiveTab()]
  );

  return (
    <Button
      size={"sm"}
      variant={sessionManager.getActiveTab()?.id === id ? "secondary" : "ghost"}
      onClick={() => sessionManager.setActiveTab(id)}
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
        {isHovered ? <Lock /> : <MessageCircle />}
      </button>

      {/* Label */}
      <span className="flex-grow">{label}</span>

      {/* Lock/Unlock button */}
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

export default TabItem;
