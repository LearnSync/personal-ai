export const LANGUAGE_DEFAULT = "en";

let _isWeb = false;
let _isWindows = false;
let _isMac = false;
let _isLinux = false;
let _isNative = false;
let _language: string = LANGUAGE_DEFAULT;
let _userAgent: string | undefined = undefined;
let _locale: string | undefined = undefined;

export interface IProcessEnvironment {
  [key: string]: string | undefined;
}

export interface INodeProcess {
  platform: string;
  arch: string;
  env: IProcessEnvironment;
  version?: {
    node?: string;
    chrome?: string;
  };
  type?: string;
  cwd: () => string;
}

declare const process: INodeProcess | undefined;

// const $globalThis: any = typeof globalThis !== "undefined" ? globalThis : {};

// Try to access Node process if available
let nodeProcess: INodeProcess | undefined =
  typeof process !== "undefined" && typeof process.version?.node === "string"
    ? process
    : undefined;

interface INavigator {
  userAgent: string;
  maxTouchPoints?: number;
  language: string;
}

declare const navigator: INavigator | undefined;

// Detect Native Environment (Node.js)
if (typeof nodeProcess === "object") {
  _isWindows = nodeProcess.platform === "win32";
  _isMac = nodeProcess.platform === "darwin";
  _isLinux = nodeProcess.platform === "linux";
  _isNative = true;
  _language = nodeProcess.env.LANG?.split(".")[0] || LANGUAGE_DEFAULT;
}

// Detect Web Environment (Browser)
else if (typeof navigator === "object") {
  _userAgent = navigator.userAgent;
  _isWindows = _userAgent.toLowerCase().indexOf("windows") >= 0;
  _isMac = _userAgent.toLowerCase().indexOf("mac") >= 0;
  _isLinux = _userAgent.toLowerCase().indexOf("linux") >= 0;
  _locale = navigator?.language?.toLowerCase(); // TODO: Getting Undefined
  _language = _locale || LANGUAGE_DEFAULT;
  _isWeb = true;
}

// Unknown environment fallback
else {
  console.error("Unable to resolve platform.");
}

export const enum Platform {
  Web,
  Mac,
  Linux,
  Windows,
}

export type PlatformName = "Web" | "Windows" | "Mac" | "Linux";

export function PlatformToString(platform: Platform): PlatformName {
  switch (platform) {
    case Platform.Web:
      return "Web";
    case Platform.Mac:
      return "Mac";
    case Platform.Linux:
      return "Linux";
    case Platform.Windows:
      return "Windows";
  }
}

// Determine platform
let _platform: Platform = Platform.Web;

if (_isMac) {
  _platform = Platform.Mac;
} else if (_isWindows) {
  _platform = Platform.Windows;
} else if (_isLinux) {
  _platform = Platform.Linux;
}

// Operating system enum
export const enum OperatingSystem {
  Windows = 1,
  Mac = 2,
  Linux = 3,
}

export const OS = _isMac
  ? OperatingSystem.Mac
  : _isWindows
  ? OperatingSystem.Windows
  : OperatingSystem.Linux;

export const isWindows = _isWindows;
export const isMac = _isMac;
export const isLinux = _isLinux;
export const isNative = _isNative;
export const isWeb = _isWeb;
export const language = _language;
export const platform = _platform;
export const userAgent = _userAgent;

// Browser detection
export const isChrome = !!(_userAgent && _userAgent.indexOf("Chrome") >= 0);
export const isFirefox = !!(_userAgent && _userAgent.indexOf("Firefox") >= 0);
export const isSafari = !!(
  !isChrome &&
  _userAgent &&
  _userAgent.indexOf("Safari") >= 0
);
export const isEdge = !!(_userAgent && _userAgent.indexOf("Edg/") >= 0);
