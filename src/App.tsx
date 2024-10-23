import { ChevronLeft, ChevronRight, PanelLeftOpen } from "lucide-react";
import * as React from "react";

import { ActivityBar } from "./components/activity-bar";
import { TopHeader } from "./components/header";
import TabItem from "./components/header/tab-item";
import { SecondarySidebar, Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Workbench } from "./components/workbench";
import {
  PlatformProvider,
  usePlatformContext,
} from "./context/platform.context";
import { cn } from "./lib/utils";
import { useStore } from "./store";

function App() {
  const [hideSecondarySideBar, setHideSecondarySideBar] = React.useState(true);

  // Store
  const { showSideBar, setShowSideBar } = useStore();

  // Context
  const { tabSessionManager } = usePlatformContext();

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
          {showSideBar && (
            <div className={cn("min-w-64 h-screen bg-background-2")}>
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
              {!showSideBar && (
                <div className="flex items-center justify-center p-2 border-r-2 cursor-pointer h-fit min-h-8 min-w-8 hover:bg-white/10">
                  <button onClick={() => setShowSideBar(!showSideBar)}>
                    <PanelLeftOpen className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
              )}

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
