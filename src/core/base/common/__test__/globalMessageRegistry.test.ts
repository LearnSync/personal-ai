import { getMessageFromRegistry } from "../globalMessageRegistry";

describe("Global Message Registry", () => {
  it("should return the correct message from the registry", () => {
    const message = getMessageFromRegistry(0, "fallback");
    expect(message).toBe("Hello {0}, welcome!");
  });

  it("should return the fallback message if the index does not exist", () => {
    const fallbackMessage = "Fallback message";
    const message = getMessageFromRegistry(99, fallbackMessage);
    expect(message).toBe(fallbackMessage);
  });

  it("should throw an error if the message is missing and no fallback is provided", () => {
    expect(() => getMessageFromRegistry(99, null)).toThrow(
      "Missing localization message for index: 99"
    );
  });
});
