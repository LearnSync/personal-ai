import { useEffect, useState } from "react";

/**
 * Custom hook to listen for keydown events in React.
 * @param targetKeys - An array of keys to listen for, or `null` to listen for all keys.
 * @param onKeyDown - Optional callback triggered when one of the target keys is pressed.
 */
export const useKeyDown = (
  targetKeys: string[] | null = null,
  onKeyDown?: (key: string, event: KeyboardEvent) => void,
) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      // If targetKeys is null, listen to all keys. Otherwise, check if the key is in targetKeys.
      if (!targetKeys || targetKeys.includes(key)) {
        setPressedKey(key);

        // Trigger callback if provided
        if (onKeyDown) {
          onKeyDown(key, event);
        }
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null); // Clear pressedKey when the key is released
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [targetKeys, onKeyDown]);

  return { pressedKey };
};
