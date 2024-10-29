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
  className,
  cursorClassName,
  interval = 50,
  ...rest
}) => {
  const [generatedText, setGeneratedText] = React.useState<string>("");
  const [isBlinking, setIsBlinking] = React.useState<boolean>(true);

  React.useEffect(() => {
    const contentToGenerate = text;

    generateText(contentToGenerate, {
      interval,
      onUpdate: (currentText) => {
        setGeneratedText(currentText);
      },
      onComplete: () => {
        setIsBlinking(false);
      },
    });
  }, [text, interval]);

  return (
    <div className={cn("generate-text-effect", className)} {...rest}>
      {generatedText}
      {isBlinking && (
        <span className={cn("blinking-cursor", cursorClassName)}>|</span>
      )}
    </div>
  );
};

export default GenerateTextEffect;
