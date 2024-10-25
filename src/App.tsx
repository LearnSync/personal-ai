import { ChevronLeft, ChevronRight, PanelLeftOpen } from "lucide-react";
import * as React from "react";

import { ActivityBar } from "./components/activity-bar";
import { TopHeader } from "./components/header";
import TabItem from "./components/header/tab-item";
import { SecondarySidebar, Sidebar } from "./components/sidebar";
import {
  chatGptIcon,
  claudeAIIcon,
  geminiIcon,
  ollamaIcon,
} from "./components/sidebar/sidebar-icon";
import { ThemeProvider } from "./components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { TooltipProvider } from "./components/ui/tooltip";
import { Workbench } from "./components/workbench";
import { usePlatformContext } from "./context/platform.context";
import { generateUUID } from "./core";
import { cn } from "./lib/utils";
import { useStore } from "./store";

function App() {
  const [hideSecondarySideBar, setHideSecondarySideBar] = React.useState(true);

  // Store
  const { showSideBar, setShowSideBar } = useStore();

  // Context
  const { tabSessionManager, activeExtensionTab, chatSessionManager } =
    usePlatformContext();

  /**
   * Memoised the Response
   */

  const activeChatSessionOnCurrentTab = React.useMemo(() => {
    return chatSessionManager.getChatSession(activeExtensionTab.id);
  }, [activeExtensionTab]);

  const startNewChatWithAvailableModels = React.useMemo(() => {
    // Except Default Options
    return [
      {
        id: generateUUID(),
        icon: ollamaIcon({ className: "w-4 h-4" }),
        label: "Llama",
        model: "llama",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#2f96dc] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: chatGptIcon({ className: "w-5 h-5 fill-white" }),
        label: "OpenAI",
        model: "openai",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#10a37f] to-white text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: geminiIcon({ className: "w-5 h-5 fill-white" }),
        label: "Gemini",
        model: "gemini",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-[#8b6ac2] to-[#2f96dc] text-transparent bg-clip-text",
      },
      {
        id: generateUUID(),
        icon: claudeAIIcon({ className: "w-5 h-5" }),
        label: "Claude AI",
        model: "anthroic",
        action: () => console.log("Start New Chat"),
        className:
          "bg-gradient-to-r from-white to-[#cc9b7a] text-transparent bg-clip-text",
      },
    ];
  }, []);

  console.log("Tab session manager", tabSessionManager); // TODO: PENDING

  return (
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <main className="relative flex items-center justify-between w-screen h-screen overflow-hidden bg-background-1">
          {/* Activity Bar */}
          <div className="h-screen border-2 min-w-14 bg-background-2">
            <ActivityBar />
          </div>

          {/* Primary Side Bar */}
          {showSideBar && activeExtensionTab.displaySidebar && (
            <div className={cn("min-w-64 max-w-64 h-screen bg-background-2")}>
              <Sidebar />
            </div>
          )}

          <div className="flex flex-col w-screen h-screen">
            {/* Top Header */}
            <TopHeader
              className={cn(
                "w-full h-10 min-h-10 max-h-10 bg-background-2 flex items-center border border-background-1"
              )}
            >
              {/* Display Show SideBar toggle button */}
              {!showSideBar && activeExtensionTab.displaySidebar && (
                <div className="flex items-center justify-center p-2 border-r-2 cursor-pointer h-fit min-h-8 min-w-8 hover:bg-white/10">
                  <button onClick={() => setShowSideBar(!showSideBar)}>
                    <PanelLeftOpen className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Change the model */}
              <div className="p-1">
                <Select>
                  <SelectTrigger className="h-8 w-[150px] focus:ring-0 bg-background-1">
                    <SelectValue
                      className=""
                      placeholder={
                        activeChatSessionOnCurrentTab?.aiProvider ?? (
                          <div>None</div>
                        )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {startNewChatWithAvailableModels?.map((opt) => (
                      <SelectItem value={opt.label}>
                        <div
                          className={cn(
                            "flex items-center space-x-2",
                            opt.className
                          )}
                        >
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* There Will be Different Chat Tabs For Multiple Chat Windows */}
              <div className="flex items-center ml-1 space-x-1">
                {tabSessionManager.getTabs()?.map((tab) => (
                  <TabItem
                    key={tab.id}
                    id={tab.id}
                    label={tab.label}
                    isLocked={tab.isLocked}
                  />
                ))}
              </div>
            </TopHeader>

            {/* Main Body / Workbench */}
            <div className="min-w-[calc(100%-32.5rem)] flex-1 p-1 bg-background-1 overflow-hidden">
              <Workbench />
            </div>
          </div>

          {/* Secondary Side Bar */}
          <div
            className={cn(
              "relative h-screen bg-background-2",
              hideSecondarySideBar ? "w-0" : "min-w-52"
            )}
          >
            {hideSecondarySideBar && <SecondarySidebar />}
            <div
              className={cn("absolute z-50 -translate-y-1/2 top-1/2 -left-8")}
            >
              <button
                className={cn(
                  "p-1 py-3 cursor-pointer hover:bg-white/10 rounded-md"
                )}
              >
                {hideSecondarySideBar ? (
                  <ChevronLeft
                    className="w-6 h-6"
                    onClick={() => setHideSecondarySideBar((prev) => !prev)}
                  />
                ) : (
                  <ChevronRight
                    className="w-6 h-6"
                    onClick={() => setHideSecondarySideBar((prev) => !prev)}
                  />
                )}
              </button>
            </div>
          </div>
        </main>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
