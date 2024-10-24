import {
  Blocks,
  FileClock,
  FileStack,
  MessageCircle,
  Search,
  Settings,
} from "lucide-react";

import { generateUUID, Platform } from "@/core";

export interface IDefaultExtensionItems {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortCut?: {
    key: Platform; // i.e. "window";
    modifiers: string[]; // i.e. ["ctrl", "shift"];
  }[];
  hasMore?: boolean;
  displaySidebar?: boolean;
  position?: "default" | "bottom";
}

export const DEFAULT_EXTENSIONS_ITEMS: Readonly<IDefaultExtensionItems>[] = [
  {
    id: generateUUID(),
    icon: <MessageCircle className="w-full h-full" />,
    label: "Chat",
    shortCut: [
      {
        key: Platform.Windows,
        modifiers: ["ctrl", "shift", "c"],
      },
      {
        key: Platform.Mac,
        modifiers: ["cmd", "shift", "c"],
      },
      {
        key: Platform.Linux,
        modifiers: ["ctrl", "shift", "c"],
      },
    ],
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <Search className="w-full h-full" />,
    label: "Context Search",
    shortCut: [
      {
        key: Platform.Windows,
        modifiers: ["ctrl", "shift", "f"],
      },
      {
        key: Platform.Mac,
        modifiers: ["cmd", "shift", "f"],
      },
      {
        key: Platform.Linux,
        modifiers: ["ctrl", "shift", "f"],
      },
    ],
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <FileStack className="w-full h-full" />,
    label: "Important Chat",
    shortCut: [
      {
        key: Platform.Windows,
        modifiers: ["ctrl", "shift", "i"],
      },
      {
        key: Platform.Mac,
        modifiers: ["cmd", "shift", "i"],
      },
      {
        key: Platform.Linux,
        modifiers: ["ctrl", "shift", "i"],
      },
    ],
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <Blocks className="w-full h-full" />,
    label: "Extensions",
    shortCut: [
      {
        key: Platform.Windows,
        modifiers: ["ctrl", "shift", "x"],
      },
      {
        key: Platform.Mac,
        modifiers: ["cmd", "shift", "x"],
      },
      {
        key: Platform.Linux,
        modifiers: ["ctrl", "shift", "x"],
      },
    ],
    displaySidebar: true,
    hasMore: false,
  },
  {
    id: generateUUID(),
    icon: <Settings className="w-full h-full" />,
    label: "Settings",
    shortCut: [
      {
        key: Platform.Windows,
        modifiers: ["ctrl", "shift", "s"],
      },
      {
        key: Platform.Mac,
        modifiers: ["cmd", "shift", "s"],
      },
      {
        key: Platform.Linux,
        modifiers: ["ctrl", "shift", "s"],
      },
    ],
    displaySidebar: false,
    hasMore: false,
    position: "bottom",
  },
];
