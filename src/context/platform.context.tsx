import * as React from "react";

import { useSessionManager } from "@/core/reactive/hooks/useSessionManager";

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
  const sessionManager = useSessionManager();

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
