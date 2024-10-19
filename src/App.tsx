import { ActivityBar } from "./components/activity-bar";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <main className="w-screen h-screen overflow-hidden bg-background-1">
          {/* Activity Bar */}
          <div className="w-16 h-screen bg-background-2">
            <ActivityBar />
          </div>

          {/* Primary Side Bar */}
          <div></div>

          {/* Workbench | Main Body */}

          {/* Secondary Side Bar */}
        </main>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
