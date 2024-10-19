import { ActivityBar } from "./components/activity-bar";
import { Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <main className="flex items-center w-screen h-screen overflow-hidden bg-background-1">
          {/* Activity Bar */}
          <div className="h-screen border-2 w-14 bg-background-2">
            <ActivityBar />
          </div>

          {/* Primary Side Bar */}
          <div className="w-64 h-screen overflow-y-auto bg-secondary">
            <Sidebar />
          </div>

          {/* Workbench | Main Body */}

          {/* Secondary Side Bar */}
        </main>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
