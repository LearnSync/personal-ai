import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import { PlatformProvider } from "./context/platform.context";
import "./core/base/common/platform";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PlatformProvider>
      <Router>
        <App />
      </Router>
    </PlatformProvider>
  </React.StrictMode>
);
