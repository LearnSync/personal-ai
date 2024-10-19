import { localize, localizeWithOriginal } from "../localize";

describe("Localize Function", () => {
  it("should localize a message by index from the registry", () => {
    const result = localize(0, "Hello fallback", "John");
    expect(result).toBe("Hello John, welcome!");
  });

  it("should fallback to the provided message if index is not found", () => {
    const result = localize(99, "Hello fallback", "John");
    expect(result).toBe("Hello fallback");
  });

  it("should format the message with multiple arguments", () => {
    const result = localize(
      "greeting",
      "Hello {0}, welcome to {1}",
      "Alice",
      "Wonderland"
    );
    expect(result).toBe("Hello Alice, welcome to Wonderland");
  });

  it("should return the message as is when no formatting args are passed", () => {
    const result = localize("simpleMessage", "Simple message with no args");
    expect(result).toBe("Simple message with no args");
  });
});

describe("Localize With Original Function", () => {
  it("should return both localized and original messages when index is found", () => {
    const result = localizeWithOriginal(0, "Original {0}", "John");
    expect(result.value).toBe("Hello John, welcome!");
    expect(result.original).toBe("Original John");
  });

  it("should return both fallback and original messages when index is not found", () => {
    const result = localizeWithOriginal(99, "Fallback {0}", "John");
    expect(result.value).toBe("Fallback John");
    expect(result.original).toBe("Fallback John");
  });

  it("should return formatted original message when no index is provided", () => {
    const result = localizeWithOriginal(
      "greeting",
      "Hello {0}, welcome to {1}",
      "Alice",
      "Wonderland"
    );
    expect(result.value).toBe("Hello Alice, welcome to Wonderland");
    expect(result.original).toBe("Hello Alice, welcome to Wonderland");
  });

  it("should return localized message same as original when no formatting args are passed", () => {
    const result = localizeWithOriginal(
      "simpleMessage",
      "Simple message with no args"
    );
    expect(result.value).toBe("Simple message with no args");
    expect(result.original).toBe("Simple message with no args");
  });
});
