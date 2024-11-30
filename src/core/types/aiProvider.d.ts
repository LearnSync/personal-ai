import * as React from "react";
import { EAiProvider } from "./enum";

export interface IAiModel {
  id: string;
  label: string;
  model: EAiProvider;
  variants: string[];
  action: () => void;
  className?: string;
}

export interface IGeneralAiProvider {
  apikey: string;
  model: EAiProvider;
  variant: string;
  maxTokens?: string;
}
