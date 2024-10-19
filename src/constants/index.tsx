import {
  Blocks,
  FileClock,
  MessageCircle,
  Search,
  Settings,
} from "lucide-react";

import { Platform } from "@/core";

export interface IDefaultExtensionItems {
  icon: React.ReactNode;
  label: string;
  shortCut?: {
    key: Platform; // i.e. "window";
    modifiers: string[]; // i.e. ["ctrl", "shift"];
  }[];
  hasMore?: boolean;
}

export const DEFAULT_EXTENSIONS_ITEMS: IDefaultExtensionItems[] = [
  {
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
    hasMore: false,
  },
  {
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
    hasMore: false,
  },
  {
    icon: <FileClock className="w-full h-full" />,
    label: "Chat History",
    shortCut: [
      {
        key: Platform.Windows,
        modifiers: ["ctrl", "shift", "h"],
      },
      {
        key: Platform.Mac,
        modifiers: ["cmd", "shift", "h"],
      },
      {
        key: Platform.Linux,
        modifiers: ["ctrl", "shift", "h"],
      },
    ],
    hasMore: false,
  },
  {
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
    hasMore: false,
  },
];

export const SETTINGS: IDefaultExtensionItems = {
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
  hasMore: false,
};
