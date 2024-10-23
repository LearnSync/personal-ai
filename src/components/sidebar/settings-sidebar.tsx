import { cn } from "@/lib/utils";
import React from "react";

interface SettingsSidebarProps {
  className?: string;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={cn("", className)} {...props}>
      SettingsSidebar
    </div>
  );
};

export default SettingsSidebar;
