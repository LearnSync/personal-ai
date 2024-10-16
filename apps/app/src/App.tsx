import { ExtensionSidebar } from "@/components/extensions-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppBody } from "./components/body";

function App() {
  return (
    <main>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <ResizablePanelGroup
            direction="horizontal"
            className="h-screen overflow-hidden"
          >
            <ResizablePanel
              defaultSize={4}
              minSize={4}
              maxSize={4}
              className="h-screen max-w-16 dark:bg-background-2"
            >
              <ExtensionSidebar />
            </ResizablePanel>

            <ResizablePanel
              defaultSize={96}
              className="h-screen bg-background-1"
            >
              <AppBody />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </ThemeProvider>
    </main>
  );
}

export default App;
