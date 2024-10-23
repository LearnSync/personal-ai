import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { PlatformProvider } from "./context/platform.context";
import "./core/base/common/platform";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PlatformProvider>
      <App />
    </PlatformProvider>
  </React.StrictMode>
);
