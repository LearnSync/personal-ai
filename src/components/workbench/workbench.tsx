import { Route, Routes } from "react-router-dom";

import { ScrollArea } from "../ui/scroll-area";
import { Chat } from "./chat";
import { Settings } from "./settings";
import ImportantChat from "./important-chat/important-chat";

export const Workbench = () => {
  return (
    <main className="h-full">
      <ScrollArea className="flex-grow h-full">
        <Routes>
          <Route path="/*" element={<Chat />} />
          <Route path="/c/:sessionId" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/important-chat/:tag" element={<ImportantChat />} />
        </Routes>
      </ScrollArea>
    </main>
  );
};

export default Workbench;
