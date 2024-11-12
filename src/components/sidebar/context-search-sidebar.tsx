import { cn } from "@/lib/utils";
import SearchBox from "../general-components/search-box";

const ContextSearchSidebar = () => {
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
