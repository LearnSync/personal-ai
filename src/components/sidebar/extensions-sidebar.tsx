import { cn } from "@/lib/utils";
import SearchBox from "../general-components/search-box";

const ExtensionsSidebar = () => {
  return (
    <div className={cn("px-2")}>
      <div className="mt-2">
        <SearchBox
          className={cn("bg-background-1 px-3 max-h-fit")}
          showIcon={false}
        />
      </div>

      {/* Extensions  */}
      <div className="mt-3">
        <div className="p-2 text-center text-black bg-yellow-300 rounded-md">
          Coming Soon....
        </div>
      </div>
    </div>
  );
};

export default ExtensionsSidebar;
