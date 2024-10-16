import * as React from "react";

import { generateText } from "@/lib/utils";
import { AutoResizingInput } from "./auto-resizing-input";

export const AppBody = () => {
  const [generatedText, setGeneratedText] = React.useState("");
  const [isBlinking, setIsBlinking] = React.useState(true);

  React.useEffect(() => {
    const fullText = "Start your conversation";
    generateText(fullText, {
      interval: 50,
      onUpdate: (text) => {
        setGeneratedText(text);
      },
      onComplete: () => {
        setIsBlinking(false);
      },
    });
  }, []);

  return (
    <main className="container flex flex-col items-center justify-between w-full h-screen mx-auto max-w-7xl">
      <h1 className="mt-32 text-3xl font-semibold tracking-wide capitalize">
        {generatedText}
        {isBlinking && <span className="blinking-cursor">|</span>}
      </h1>

      <div className="w-[70%] mx-auto my-8">
        <AutoResizingInput />
      </div>
    </main>
  );
};
