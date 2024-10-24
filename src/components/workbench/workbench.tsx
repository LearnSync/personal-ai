import { usePlatformContext } from "@/context/platform.context";
import { IExtension } from "@/core/platform/extensions";
import { ScrollArea } from "../ui/scroll-area";
import { Chat } from "./chat";
import { Settings } from "./settings";

export const Workbench = () => {
  const { activeExtensionTab } = usePlatformContext();

  const renderActiveWorkbench = (activeExtensionTab: IExtension) => {
    switch (activeExtensionTab.label) {
      case "Settings":
        return <Settings />;
      default:
        return <Chat />;
    }
  };

  return (
    <main className="container h-full mx-auto max-w-7xl">
      <ScrollArea className="flex-grow h-full">
        {renderActiveWorkbench(activeExtensionTab)}
      </ScrollArea>
    </main>
  );
};

export default Workbench;
