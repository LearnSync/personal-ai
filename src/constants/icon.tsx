import {
  Blocks,
  Code,
  FileCode2Icon,
  FileStack,
  Laptop,
  MessageCircle,
  Search,
  Settings,
} from "lucide-react";
import * as React from "react";

import { generateUUID } from "@/core";
import { EAiProvider, EXTENSION_KEY } from "@/core/types/enum";
import { cn } from "@/lib/utils";

interface IIconProps {
  className?: string;
}

export const ChatGptIcon: React.FC<IIconProps> = ({ className }) => {
  return (
    <svg
      className={cn("", className)}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 512 512"
    >
      <rect fill="#10A37F" width="512" height="512" rx="104.187" ry="105.042" />
      <path
        fill="#fff"
        fillRule="nonzero"
        d="M378.68 230.011a71.432 71.432 0 003.654-22.541 71.383 71.383 0 00-9.783-36.064c-12.871-22.404-36.747-36.236-62.587-36.236a72.31 72.31 0 00-15.145 1.604 71.362 71.362 0 00-53.37-23.991h-.453l-.17.001c-31.297 0-59.052 20.195-68.673 49.967a71.372 71.372 0 00-47.709 34.618 72.224 72.224 0 00-9.755 36.226 72.204 72.204 0 0018.628 48.395 71.395 71.395 0 00-3.655 22.541 71.388 71.388 0 009.783 36.064 72.187 72.187 0 0077.728 34.631 71.375 71.375 0 0053.374 23.992H271l.184-.001c31.314 0 59.06-20.196 68.681-49.995a71.384 71.384 0 0047.71-34.619 72.107 72.107 0 009.736-36.194 72.201 72.201 0 00-18.628-48.394l-.003-.004zM271.018 380.492h-.074a53.576 53.576 0 01-34.287-12.423 44.928 44.928 0 001.694-.96l57.032-32.943a9.278 9.278 0 004.688-8.06v-80.459l24.106 13.919a.859.859 0 01.469.661v66.586c-.033 29.604-24.022 53.619-53.628 53.679zm-115.329-49.257a53.563 53.563 0 01-7.196-26.798c0-3.069.268-6.146.79-9.17.424.254 1.164.706 1.695 1.011l57.032 32.943a9.289 9.289 0 009.37-.002l69.63-40.205v27.839l.001.048a.864.864 0 01-.345.691l-57.654 33.288a53.791 53.791 0 01-26.817 7.17 53.746 53.746 0 01-46.506-26.818v.003zm-15.004-124.506a53.5 53.5 0 0127.941-23.534c0 .491-.028 1.361-.028 1.965v65.887l-.001.054a9.27 9.27 0 004.681 8.053l69.63 40.199-24.105 13.919a.864.864 0 01-.813.074l-57.66-33.316a53.746 53.746 0 01-26.805-46.5 53.787 53.787 0 017.163-26.798l-.003-.003zm198.055 46.089l-69.63-40.204 24.106-13.914a.863.863 0 01.813-.074l57.659 33.288a53.71 53.71 0 0126.835 46.491c0 22.489-14.033 42.612-35.133 50.379v-67.857c.003-.025.003-.051.003-.076a9.265 9.265 0 00-4.653-8.033zm23.993-36.111a81.919 81.919 0 00-1.694-1.01l-57.032-32.944a9.31 9.31 0 00-4.684-1.266 9.31 9.31 0 00-4.684 1.266l-69.631 40.205v-27.839l-.001-.048c0-.272.129-.528.346-.691l57.654-33.26a53.696 53.696 0 0126.816-7.177c29.644 0 53.684 24.04 53.684 53.684a53.91 53.91 0 01-.774 9.077v.003zm-150.831 49.618l-24.111-13.919a.859.859 0 01-.469-.661v-66.587c.013-29.628 24.053-53.648 53.684-53.648a53.719 53.719 0 0134.349 12.426c-.434.237-1.191.655-1.694.96l-57.032 32.943a9.272 9.272 0 00-4.687 8.057v.053l-.04 80.376zm13.095-28.233l31.012-17.912 31.012 17.9v35.812l-31.012 17.901-31.012-17.901v-35.8z"
      />
    </svg>
  );
};

export const GeminiIcon: React.FC<IIconProps> = ({ className }) => {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className={cn(className)}
    >
      <path
        d="M16 8.016A8.522 8.522 0 008.016 16h-.032A8.521 8.521 0 000 8.016v-.032A8.521 8.521 0 007.984 0h.032A8.522 8.522 0 0016 7.984v.032z"
        fill="url(#prefix__paint0_radial_980_20147)"
      />
      <defs>
        <radialGradient
          id="prefix__paint0_radial_980_20147"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
        >
          <stop offset=".067" stopColor="#9168C0" />
          <stop offset=".343" stopColor="#5684D1" />
          <stop offset=".672" stopColor="#1BA1E3" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export const ClaudeAIIcon: React.FC<IIconProps> = ({ className }) => {
  return (
    <svg
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      imageRendering="optimizeQuality"
      fillRule="evenodd"
      clipRule="evenodd"
      viewBox="0 0 512 512"
    >
      <rect fill="#CC9B7A" width="512" height="512" rx="104.187" ry="105.042" />
      <path
        fill="#1F1F1E"
        fillRule="nonzero"
        d="M318.663 149.787h-43.368l78.952 212.423 43.368.004-78.952-212.427zm-125.326 0l-78.952 212.427h44.255l15.932-44.608 82.846-.004 16.107 44.612h44.255l-79.126-212.427h-45.317zm-4.251 128.341l26.91-74.701 27.083 74.701h-53.993z"
      />
    </svg>
  );
};

export const OllamaIcon: React.FC<IIconProps> = ({ className }) => {
  return (
    <div className="flex items-center justify-center">
      <img
        src={"/llama.svg"}
        width={"40"}
        height={"40"}
        className={cn("bg-white p-1 rounded-full", className)}
      />
    </div>
  );
};

export const LocalLLMIcon: React.FC<IIconProps> = ({ className }) => {
  return <Laptop className={cn("", className)} />;
};

export const TickIcon: React.FC<IIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="100"
      height="100"
      viewBox="0 0 48 48"
      className={cn("", className)}
    >
      <path
        fill="#d8edd8"
        d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
      ></path>
      <path
        fill="hsl(142.1 76.2% 36.3%)"
        d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
      ></path>
    </svg>
  );
};

export const NotificationDotIcon: React.FC<IIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={cn("lucide lucide-bell-dot", className)}
    >
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665" />
      <circle cx="18" cy="8" r="3" />
    </svg>
  );
};

export function getIconByIconKey({
  key,
  className,
}: {
  key: EAiProvider;
  className?: string;
}): React.ReactNode {
  switch (key) {
    case EAiProvider.ANTHROPIC:
      return <ClaudeAIIcon className={cn("", className)} />;
    case EAiProvider.GEMINI:
      return <GeminiIcon className={cn("", className)} />;
    case EAiProvider.GREPTILE:
      return <div>Greptile</div>;
    case EAiProvider.OLLAMA:
      return <OllamaIcon className={cn("", className)} />;
    case EAiProvider.OPENAI:
      return <ChatGptIcon className={cn("", className)} />;
    default:
      return (
        <LocalLLMIcon className={cn("text-muted-foreground", className)} />
      );
  }
}

export function createOption({
  label,
  iconKey,
  iconClassName,
  className,
}: {
  label: string;
  iconKey: EAiProvider;
  iconClassName: string;
  className: string;
}) {
  return {
    id: generateUUID(),
    icon: getIconByIconKey({ key: iconKey, className: iconClassName }),
    label: label,
    action: () => console.log(`Start New Chat with ${label}`),
    className: `${className} text-transparent bg-clip-text`,
  };
}

export function getIconByKey(key: string | undefined): React.ReactNode {
  if (!key) return <MessageCircle className="w-full h-full" />;

  switch (key) {
    case EXTENSION_KEY.CHAT_WITH_PDF:
      return <FileCode2Icon className="w-full h-full" />;
    case EXTENSION_KEY.CODE:
      return <Code className="w-full h-full" />;
    case EXTENSION_KEY.CONTEXT_SEARCH:
      return <Search className="w-full h-full" />;
    case EXTENSION_KEY.IMPORTANT_CHAT:
      return <FileStack className="w-full h-full" />;
    case EXTENSION_KEY.SETTINGS:
      return <Settings className="w-full h-full" />;
    case EXTENSION_KEY.EXTENSION:
      return <Blocks className="w-full h-full" />;
    default:
      return <MessageCircle className="w-full h-full" />;
  }
}

export function getTextColorByItemKey(key: EAiProvider): string {
  let classes = "text-transparent bg-clip-text";
  switch (key) {
    case EAiProvider.ANTHROPIC:
      classes += "bg-gradient-to-r from-white to-[#cc9b7a]";
      return classes;
    case EAiProvider.OLLAMA:
      classes += "bg-gradient-to-r from-[#2f96dc] to-white";
      return classes;
    case EAiProvider.GEMINI:
      classes += "bg-gradient-to-r from-[#8b6ac2] to-[#2f96dc]";
      return classes;
    case EAiProvider.OPENAI:
      classes += "bg-gradient-to-r from-[#10a37f] to-white";
      return classes;
    case EAiProvider.LOCAL:
      classes += "bg-muted-foreground";
      return classes;
    default:
      classes += "bg-muted-foreground";
      return classes;
  }
}
