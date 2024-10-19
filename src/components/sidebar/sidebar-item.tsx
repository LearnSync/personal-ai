import { cn } from "@/lib/utils";
import React from "react";

interface SidebarItemProps {
  className?: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  className,
  ...rest
}) => {
  return (
    <div className={cn("", className)} {...rest}>
      SidebarItem
    </div>
  );
};

export default SidebarItem;
