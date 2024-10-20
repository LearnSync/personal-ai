type TextGeneratorOptions = {
  /**
   * Time in milliseconds between each character being generated.
   * @type {number}
   */
  interval: number;

  /**
   * Callback to be called every time the text is updated.
   * @param text The current generated text.
   */
  onUpdate: (text: string) => void;

  /**
   * Optional callback to be called when the text generation is complete.
   */
  onComplete?: () => void;
};

/**
 * Generates text character by character at a given interval, invoking the
 * onUpdate callback with the current state of the generated text and
 * optionally invoking the onComplete callback once the generation is finished.
 *
 * @param {string} text - The text to be generated character by character.
 * @param {TextGeneratorOptions} options - Configuration options including interval, onUpdate, and optional onComplete.
 * @throws {Error} If the interval is not a positive number or if onUpdate is not provided.
 *
 * @example
 * generateText("Hello, world!", {
 *   interval: 100,
 *   onUpdate: (text) => console.log(text),
 *   onComplete: () => console.log("Generation complete!")
 * });
 */
export const generateText = (
  text: string,
  options: TextGeneratorOptions
): void => {
  const { interval, onUpdate, onComplete } = options;

  if (interval <= 0) {
    throw new Error("Interval must be a positive number.");
  }

  if (typeof onUpdate !== "function") {
    throw new Error("onUpdate callback must be a function.");
  }

  let currentText = "";
  let currentIndex = 0;

  const intervalId = setInterval(() => {
    currentText += text[currentIndex];
    onUpdate(currentText);

    currentIndex++;

    if (currentIndex === text.length) {
      clearInterval(intervalId);

      if (onComplete) {
        onComplete();
      }
    }
  }, interval);
};
