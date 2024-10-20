import { ActivityBar } from "./components/activity-bar";
import { SecondarySidebar, Sidebar } from "./components/sidebar";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import { Workbench } from "./components/workbench";

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <main className="flex items-center justify-between w-screen h-screen overflow-hidden bg-background-1">
          {/* Activity Bar */}
          <div className="h-screen border-2 w-14 bg-background-2">
            <ActivityBar />
          </div>

          {/* Primary Side Bar */}
          <div className="w-64 h-screen overflow-y-auto bg-background-2">
            <Sidebar />
          </div>

          {/* Workbench | Main Body */}
          <div className="w-[calc(100%-32.5rem)] bg-background-1">
            <Workbench />
          </div>

          {/* Secondary Side Bar */}
          <div className="h-screen overflow-y-auto w-52 bg-background-2">
            <SecondarySidebar />
          </div>
        </main>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
