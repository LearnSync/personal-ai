export const globalMessageRegistry: Record<number, string> = {
  0: "Hello {0}, welcome!",
  1: "The operation was {0}.",
  2: "Error: {0} occurred.",
};

export function getMessageFromRegistry(
  index: number,
  fallback: string | null
): string {
  const message = globalMessageRegistry[index];
  if (typeof message !== "string") {
    if (typeof fallback === "string") {
      return fallback;
    }
    throw new Error(`Missing localization message for index: ${index}`);
  }
  return message;
}
