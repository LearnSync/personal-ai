import * as React from "react";

import { useSessionManager } from "@/core/reactive/hooks/useSessionManager";
import { useKeyDown } from "@/hooks/useKeyDown";

interface IPlatformContextProps {
  // ----- Sessions Managers
  sessionManager: ReturnType<typeof useSessionManager>;
}

const PlatformContext = React.createContext<IPlatformContextProps | undefined>(
  undefined
);

export const PlatformProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // --- Hooks
  const sessionManager = useSessionManager();

  // TODO:(@SOUMITRA-SAHA) Listning the KeyDowns at the Root
  const { pressedKey } = useKeyDown(["a", "b", "c"], (key) => {
    console.log("Key pressed: ", key);
  });

  return (
    <PlatformContext.Provider
      value={{
        sessionManager,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatformContext = () => {
  const context = React.useContext(PlatformContext);
  if (!context) {
    throw new Error(
      "usePlatformContext must be used within a PlatformProvider"
    );
  }
  return context;
};
