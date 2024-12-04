import { Command } from "@tauri-apps/plugin-shell";
import * as React from "react";

// Model and Interface Definitions
interface IModel {
  id: string;
  title: string;
  size: string;
  modifier: string;
}

interface IOllamaInfo {
  isAvailable: boolean;
  version: string;
  updateAvailable: boolean;
  availableModels: IModel[];
}

interface UseLocalLLMProps {
  dependencies?: string[];
}

interface UseLocalLLMResponse extends IOllamaInfo {
  isLoading: boolean;
  installNewModel: (model: string) => Promise<void>;
  uninstallModel: (model: string) => Promise<void>;
}

// --- Initial State
const initialOllamaInfo: Readonly<IOllamaInfo> = {
  isAvailable: false,
  version: "",
  updateAvailable: false,
  availableModels: [],
};

// --- Utility Function
const parseModelsList = (modelsList: string): IModel[] => {
  const rows = modelsList.trim().split("\n").slice(1); // Remove header row
  const regex = /^(\S+)\s+(\S+)\s+([\d.]+\s\S+)\s+(.+)$/;

  return rows
    .map((row) => {
      const match = row.match(regex);
      if (!match) return null;
      const [, title, id, size, modifier] = match;
      return { title, id, size, modifier };
    })
    .filter((model): model is IModel => model !== null); // Filter out invalid rows
};

export const useLocalLLM = ({
  dependencies = [],
}: UseLocalLLMProps): UseLocalLLMResponse => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [ollamaInfo, setOllamaInfo] = React.useState<IOllamaInfo>({
    ...initialOllamaInfo,
  });

  // --- Fetch
  const fetchOllamaInfo = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // ----- Fetch Version
      const versionCommand = await Command.create("ollama", [
        "--version",
      ]).execute();

      if (versionCommand.code !== 0) {
        console.error("Failed to fetch Ollama version:", versionCommand.stderr);
        return;
      }

      const versionMessage = versionCommand.stdout.trim();
      const version = versionMessage.split(/\s+/).pop() ?? "";

      // ----- Fetch Models
      const modelsCommand = await Command.create("ollama", ["list"]).execute();

      if (modelsCommand.code !== 0) {
        console.error(
          "Failed to fetch available models:",
          modelsCommand.stderr
        );
        return;
      }

      const modelsList = modelsCommand.stdout;
      const models = parseModelsList(modelsList);

      // ----- Update State
      setOllamaInfo({
        isAvailable: true,
        version,
        updateAvailable: false,
        availableModels: models,
      });
    } catch (error) {
      console.error("Error fetching Ollama information:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Install New Model
  const installNewModel = React.useCallback(
    async (model: string) => {
      setIsLoading(true);
      try {
        const installCommand = await Command.create("ollama", [
          "pull",
          model,
        ]).execute();

        if (installCommand.code !== 0) {
          console.error("Failed to install model:", installCommand.stderr);
          return;
        }

        console.log(`Model "${model}" installed successfully!`);
        await fetchOllamaInfo();
      } catch (error) {
        console.error("Error installing model:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOllamaInfo]
  );

  const uninstallModel = React.useCallback(
    async (model: string) => {
      setIsLoading(true);
      try {
        const uninstallCommand = await Command.create("ollama", [
          "rm",
          model,
        ]).execute();

        if (uninstallCommand.code !== 0) {
          console.error("Failed to uninstall model:", uninstallCommand.stderr);
          return;
        }

        console.log(`Model "${model}" uninstalled successfully!`);
        await fetchOllamaInfo();
      } catch (error) {
        console.error("Error uninstalling model:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOllamaInfo]
  );

  // --- Effect
  React.useEffect(() => {
    fetchOllamaInfo();
  }, [fetchOllamaInfo, ...dependencies]);

  return { ...ollamaInfo, isLoading, installNewModel, uninstallModel };
};
