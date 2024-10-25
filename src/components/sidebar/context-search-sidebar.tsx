import React from "react";
import SearchBox from "../general-components/search-box";
import { cn } from "@/lib/utils";

interface ContextSearchSidebarProps {
  //Props
}

const ContextSearchSidebar: React.FC<ContextSearchSidebarProps> = (props) => {
  return (
    <div className={cn("px-2")}>
      <div className="mt-2">
        <SearchBox
          className={cn("bg-background-1 px-3 max-h-fit")}
          showIcon={false}
        />
      </div>

      {/* Context Search Response  */}
      <div></div>
    </div>
  );
};

export default ContextSearchSidebar;
