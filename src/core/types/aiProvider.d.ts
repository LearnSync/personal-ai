import * as React from "react";

export interface IAiModel {
  id: string;
  icon: React.ReactNode;
  label: string;
  model: string;
  variants: string[];
  action: () => void;
  className?: string;
}

export interface IGeneralAiProvider {
  apikey: string;
  model: EAiProvider;
  variant: string | null;
  maxTokens?: string;
}
