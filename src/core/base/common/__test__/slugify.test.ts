import Slugify from "../slugify";

describe("Slugify", () => {
  it("should return an empty string for empty input", () => {
    expect(Slugify.slugify("")).toBe("");
  });

  it("should lowercase and trim the string", () => {
    expect(Slugify.slugify("  Test String  ")).toBe("test-string");
  });

  it("should remove accents and special characters", () => {
    expect(Slugify.slugify("Crème brûlée")).toBe("creme-brulee");
  });

  it("should replace spaces, underscores, and # with dashes", () => {
    expect(Slugify.slugify("Hello #World_")).toBe("hello-world");
  });

  it("should remove leading and trailing dashes", () => {
    expect(Slugify.slugify("-Hello World-")).toBe("hello-world");
  });

  it("should replace multiple periods with a single period", () => {
    expect(Slugify.slugify("test....file")).toBe("test.file");
  });

  it("should remove emojis", () => {
    expect(Slugify.slugify("Hello 😀 World 🌍")).toBe("hello-world");
  });

  it("should retain trailing dashes when forDisplayingInput is true", () => {
    expect(Slugify.slugify("test-", true)).toBe("test-");
  });

  it("should remove trailing dashes when forDisplayingInput is false", () => {
    expect(Slugify.slugify("test-", false)).toBe("test");
  });

  it("should replace consecutive dashes with a single dash", () => {
    expect(Slugify.slugify("hello---world")).toBe("hello-world");
  });

  it("should handle a complex string with special characters, spaces, and periods", () => {
    expect(Slugify.slugify(" Hello, World!!!.... #")).toBe("hello-world-");
  });
});

describe("De Slugify", () => {
  it("should convert slug back to readable text", () => {
    expect(Slugify.deslugify("important-chat")).toBe("important chat");
  });

  it("should handle multiple dashes and convert them to spaces", () => {
    expect(Slugify.deslugify("this-is-a-test")).toBe("this is a test");
  });

  it("should trim extra spaces from the result", () => {
    expect(Slugify.deslugify("-extra-spaces-")).toBe("extra spaces");
  });

  it("should return an empty string if input is empty", () => {
    expect(Slugify.deslugify("")).toBe("");
  });
});
