import { Route, Routes } from "react-router-dom";

import TestingPage from "@/screen/test.ui";
import { Chat } from "./chat";
import ImportantChat from "./important-chat/important-chat";
import { Settings } from "./settings";

export const Workbench = () => {
  return (
    <main className="flex-1 h-full">
      <Routes>
        <Route element={<TestingPage />} path="/test" />
        <Route path="/*" element={<Chat />} />
        <Route path="/c/:sessionId" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/important-chat/:tag" element={<ImportantChat />} />
      </Routes>
    </main>
  );
};

export default Workbench;
