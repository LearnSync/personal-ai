import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TextGeneratorOptions = {
  interval: number; // Time in ms between each character
  onUpdate: (text: string) => void; // Callback to update the generated text
  onComplete?: () => void; // Optional callback when generation is complete
};

export function generateText(text: string, options: TextGeneratorOptions) {
  const { interval, onUpdate, onComplete } = options;
  let currentText = "";
  let currentIndex = 0;

  const intervalId = setInterval(() => {
    currentText += text[currentIndex];
    onUpdate(currentText);

    currentIndex++;

    if (currentIndex === text.length) {
      clearInterval(intervalId);
      if (onComplete) onComplete();
    }
  }, interval);
}
