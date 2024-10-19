import { formatMessage } from "../message";

describe("Format Message", () => {
  it("should return the message as is when there are no arguments", () => {
    const result = formatMessage("Hello world", []);
    expect(result).toBe("Hello world");
  });

  it("should replace placeholders with provided arguments", () => {
    const result = formatMessage("Hello {0}, you have {1} new messages", [
      "John",
      3,
    ]);
    expect(result).toBe("Hello John, you have 3 new messages");
  });

  it("should leave placeholders untouched if arguments are missing", () => {
    const result = formatMessage("Hello {0}, you have {1} new messages", [
      "John",
    ]);
    expect(result).toBe("Hello John, you have  new messages");
  });

  it("should replace placeholders with empty strings if null or undefined is passed", () => {
    const result = formatMessage("Hello {0}, you have {1} new messages", [
      "John",
      null,
    ]);
    expect(result).toBe("Hello John, you have  new messages");
  });
});
