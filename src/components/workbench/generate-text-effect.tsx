import { generateText } from "@/core";
import { cn } from "@/lib/utils";
import React from "react";

interface GenerateTextEffectProps {
  /**
   * The text to be generated character by character. If fullText is provided,
   * this will be ignored.
   */
  text?: string;

  /**
   * The full sentence to be generated character by character. Overrides the text prop if provided.
   */
  fullText?: string;

  /**
   * Optional custom class name for styling.
   */
  className?: string;

  /**
   * Optional custom class name for cursor styling.
   */
  cursorClassName?: string;

  /**
   * Optional interval in milliseconds for text generation.
   * Defaults to 50ms if not provided.
   */
  interval?: number;
}

export const GenerateTextEffect: React.FC<GenerateTextEffectProps> = ({
  text = "Loading",
  fullText,
  className,
  cursorClassName,
  interval = 50, // Default interval if not specified
  ...rest
}) => {
  const [generatedText, setGeneratedText] = React.useState<string>("");
  const [isBlinking, setIsBlinking] = React.useState<boolean>(true);

  React.useEffect(() => {
    const contentToGenerate = fullText || text;

    generateText(contentToGenerate, {
      interval,
      onUpdate: (currentText) => {
        setGeneratedText(currentText);
      },
      onComplete: () => {
        setIsBlinking(false);
      },
    });
  }, [fullText, text, interval]);

  return (
    <div className={cn("generate-text-effect", className)} {...rest}>
      {generatedText}
      {isBlinking && (
        <span className={cn("blinking-cursor", cursorClassName)}>|</span>
      )}{" "}
      {/* Blinking cursor effect */}
    </div>
  );
};

export default GenerateTextEffect;
