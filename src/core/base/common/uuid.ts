/**
 * Regular expression to validate if a string is a valid UUID (version 4).
 * A UUID is a 128-bit number used to uniquely identify information.
 * The pattern checks the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Checks if the provided value is a valid UUID.
 *
 * @param value - The string to be checked.
 * @returns true if the value matches the UUID pattern, false otherwise.
 */
export function isValidUUID(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/**
 * Declares the `crypto` object with optional methods for random number generation.
 * `crypto.getRandomValues` fills typed arrays with cryptographically strong random values.
 * `crypto.randomUUID` generates a random UUID.
 */
declare const crypto:
  | undefined
  | {
      getRandomValues?(data: Uint8Array): Uint8Array;
      randomUUID?(): string;
    };

/**
 * Generates a UUID (version 4).
 * - If `crypto.randomUUID` is available, it uses it for secure UUID generation.
 * - Otherwise, it falls back to a custom implementation using `crypto.getRandomValues` or manually generated random values.
 *
 * @returns A valid UUID string.
 */
export const generateUUID = (function (): () => string {
  // Use `randomUUID` if available
  if (typeof crypto === "object" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID.bind(crypto);
  }

  // Fallback: Use `getRandomValues` if available
  let getRandomValues: (array: Uint8Array) => Uint8Array;
  if (
    typeof crypto === "object" &&
    typeof crypto.getRandomValues === "function"
  ) {
    getRandomValues = crypto.getRandomValues.bind(crypto);
  } else {
    // Fallback for environments without `crypto`
    getRandomValues = function (array: Uint8Array): Uint8Array {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256); // Generate random byte
      }
      return array;
    };
  }

  // Prepare hex lookup table for quick conversion from byte to hex string
  const hexLookup: string[] = Array.from({ length: 256 }, (_, i) =>
    i.toString(16).padStart(2, "0")
  );

  // Create a buffer to hold 16 random bytes (128 bits)
  const randomBytes = new Uint8Array(16);

  /**
   * Generates a UUID (version 4) by manually setting version bits and random values.
   *
   * @returns A valid UUID string in the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.
   */
  return function generateUUID(): string {
    // Fill randomBytes with random values
    getRandomValues(randomBytes);

    // Set UUID version and variant bits (version 4)
    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Set version to 4
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Set variant to RFC4122

    // Convert bytes to UUID string format
    return [
      hexLookup[randomBytes[0]],
      hexLookup[randomBytes[1]],
      hexLookup[randomBytes[2]],
      hexLookup[randomBytes[3]],
      "-",
      hexLookup[randomBytes[4]],
      hexLookup[randomBytes[5]],
      "-",
      hexLookup[randomBytes[6]],
      hexLookup[randomBytes[7]],
      "-",
      hexLookup[randomBytes[8]],
      hexLookup[randomBytes[9]],
      "-",
      hexLookup[randomBytes[10]],
      hexLookup[randomBytes[11]],
      hexLookup[randomBytes[12]],
      hexLookup[randomBytes[13]],
      hexLookup[randomBytes[14]],
      hexLookup[randomBytes[15]],
    ].join("");
  };
})();
