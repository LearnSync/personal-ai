import { Route, Routes } from "react-router-dom";

import { ScrollArea } from "../ui/scroll-area";
import { Chat } from "./chat";
import { Settings } from "./settings";

export const Workbench = () => {
  return (
    <main className="container h-full mx-auto max-w-7xl">
      <ScrollArea className="flex-grow h-full">
        <Routes>
          <Route path="/*" element={<Chat />} />
          <Route path="/c/:sessionId" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </ScrollArea>
    </main>
  );
};

export default Workbench;
