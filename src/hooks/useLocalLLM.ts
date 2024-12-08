import * as React from "react";

import { Command } from "@tauri-apps/plugin-shell";

interface IModel {
  id: string;
  title: string;
  size: string;
  modifier: string;
  details?: string;
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

interface ILoading {
  isLoading: boolean;
  modelInstalling?: boolean;
  modelUninstalling?: boolean;
  modelInfoLoading?: boolean;
}

interface IModelInstallUninstall {
  action: "uninstall" | "install";
  message?: string;
  error?: string;
}

interface UseLocalLLMResponse extends IOllamaInfo, ILoading {
  error: string | null;
  modelInstallUninstall: IModelInstallUninstall | null;
  fetchModelDetails: (model: string) => Promise<void>;
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

const initialLoading: Readonly<ILoading> = {
  isLoading: false,
  modelInfoLoading: false,
};

// --- Utility Function
const parseModelsList = (modelsList: string): IModel[] => {
  const rows = modelsList.trim().split("\n").slice(1);
  const regex = /^(\S+)\s+(\S+)\s+([\d.]+\s\S+)\s+(.+)$/;

  return rows
    .map((row) => {
      const match = row.match(regex);
      if (!match) return null;
      const [, title, id, size, modifier] = match;
      return { title, id, size, modifier };
    })
    .filter((model): model is IModel => model !== null);
};

const decodeString = (str: string): string => {
  if (!str) return str;

  return str.replace(/\u001b\[[0-9;?]*[A-Za-z]/g, " ").trim();
};

export const useLocalLLM = ({
  dependencies = [],
}: UseLocalLLMProps): UseLocalLLMResponse => {
  const [loading, setLoading] = React.useState<ILoading>({
    ...initialLoading,
  });
  const [modelInstallUninstall, setModelInstallUninstall] =
    React.useState<IModelInstallUninstall | null>(null);
  const [ollamaInfo, setOllamaInfo] = React.useState<IOllamaInfo>({
    ...initialOllamaInfo,
  });
  const [error, setError] = React.useState<string | null>(null);

  // --- Fetch Ollama Info
  const fetchOllamaInfo = React.useCallback(async () => {
    setLoading((prev) => ({
      ...prev,
      isLoading: true,
    }));
    try {
      // ----- Fetch Version
      const versionCommand = await Command.create("ollama", [
        "--version",
      ]).execute();

      if (versionCommand.code !== 0) {
        const error = "Failed to fetch Ollama version:" + versionCommand.stderr;
        console.error(error);
        setError(error);
        return;
      }

      const versionMessage = versionCommand.stdout.trim();
      const version = versionMessage.split(/\s+/).pop() ?? "";

      // ----- Fetch Models
      const modelsCommand = await Command.create("ollama", ["list"]).execute();

      if (modelsCommand.code !== 0) {
        const error =
          "Failed to fetch available models:" + modelsCommand.stderr;
        console.error(error);
        setError(error);
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
      if (error instanceof Error) {
        const errorMessage =
          "Error fetching Ollama information:" + error.message;
        console.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [setOllamaInfo, setLoading]);

  // --- Fetch Model Details
  const fetchModelDetails = React.useCallback(
    async (model: string) => {
      if (!model) return;

      try {
        const modelInfo = await Command.create("ollama", [
          "show",
          model,
        ]).execute();

        if (modelInfo.code === 0) {
          const info = modelInfo.stdout;
          setOllamaInfo((prev) => ({
            ...prev,
            availableModels: prev.availableModels.map((m) =>
              m.title === model ? { ...m, details: info } : m
            ),
          }));
        } else {
          const errorMessage = modelInfo.stderr;
          console.error("Error fetching model details: ", errorMessage);
          setError(errorMessage);
        }
      } catch (error) {
        if (error instanceof Error) {
          const errorMessage = "Error fetching model details: " + error.message;
          console.error(errorMessage);
          setError(errorMessage);
        }
      }
    },
    [setOllamaInfo]
  );

  /**
   * Install New Model
   */
  const installNewModel = React.useCallback(
    async (model: string) => {
      setLoading((prev) => ({
        ...prev,
        modelInstalling: true,
      }));
      try {
        const command = Command.create("ollama", ["pull", model]);

        command.stdout.on("data", (data) => {
          const filteredString = decodeString(data);

          setModelInstallUninstall((prev) => ({
            ...prev,
            action: "install",
            message: filteredString,
          }));
        });

        command.stderr.on("data", (data) => {
          const filteredString = decodeString(data);

          setModelInstallUninstall((prev) => ({
            ...prev,
            action: "install",
            message: filteredString,
          }));
        });

        command.on("error", (error) => {
          console.error(`Error: ${error}`);
          setModelInstallUninstall((prev) => ({
            ...prev,
            action: "install",
            error: error,
          }));
        });

        command.on("close", (code) => {
          console.info(`Command close with code: ${JSON.stringify(code)}`);
        });

        // --- Execute the command
        await command.spawn();
      } catch (error) {
        const errorMessage = "Error installing model:";
        console.error(errorMessage, error);
        if (error instanceof Error) {
          setError(`${errorMessage}: ${error.message}`);
        }
      } finally {
        await fetchOllamaInfo();

        setLoading((prev) => ({
          ...prev,
          modelInstalling: false,
        }));
      }
    },
    [fetchOllamaInfo, setLoading]
  );

  /**
   * Uninstall Model
   */
  const uninstallModel = React.useCallback(
    async (model: string) => {
      setLoading((prev) => ({
        ...prev,
        modelUninstalling: true,
      }));
      try {
        const command = Command.create("ollama", ["rm", model]);

        command.stdout.on("data", (data) => {
          setModelInstallUninstall((prev) => ({
            ...prev,
            action: "uninstall",
            message: data,
          }));
        });

        command.on("error", (error) => {
          console.error(`Error: ${error}`);
          setModelInstallUninstall((prev) => ({
            ...prev,
            action: "uninstall",
            error: error,
          }));
        });

        command.on("close", (code) => {
          console.info(`Command close with code: ${JSON.stringify(code)}`);
        });

        // --- Execute the command
        await command.spawn();
      } catch (error) {
        console.error("Error uninstalling model:", error);
      } finally {
        await fetchOllamaInfo();

        setLoading((prev) => ({
          ...prev,
          modelUninstalling: false,
        }));
      }
    },
    [fetchOllamaInfo, setLoading]
  );

  // --- Effect
  React.useEffect(() => {
    fetchOllamaInfo();
  }, [fetchOllamaInfo, ...dependencies]);

  return {
    ...ollamaInfo,
    ...loading,
    error,
    modelInstallUninstall,
    installNewModel,
    uninstallModel,
    fetchModelDetails,
  };
};
