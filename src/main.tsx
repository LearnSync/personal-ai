import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { PlatformProvider } from "./context/platform.context";
import "./core/base/common/platform";
import "./index.css";

/**
 * Create a client
 */
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="local-first-ui-theme">
        <PlatformProvider>
          <Router>
            <App />
          </Router>
          <Toaster />
        </PlatformProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
