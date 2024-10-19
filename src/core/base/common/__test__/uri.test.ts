import { URI, isUriComponents, uriToFsPath } from "../uri";

describe("URI Class", () => {
  it("should parse a valid URI and extract components", () => {
    const uri = URI.parse(
      "http://example.com:8042/over/there?name=ferret#nose"
    );

    expect(uri.scheme).toBe("http");
    expect(uri.authority).toBe("example.com:8042");
    expect(uri.path).toBe("/over/there");
    expect(uri.query).toBe("name=ferret");
    expect(uri.fragment).toBe("nose");
  });

  it("should validate that an object is a URI instance", () => {
    const uri = URI.parse("https://example.com");

    expect(URI.isUri(uri)).toBe(true);
    expect(URI.isUri({})).toBe(false); // Invalid object
  });
});

describe("isUriComponents Function", () => {
  it("should return true for valid IUriComponents objects", () => {
    const uriComponents = {
      scheme: "http",
      authority: "example.com",
      path: "/path",
      query: "query",
      fragment: "fragment",
    };

    expect(isUriComponents(uriComponents)).toBe(true);
  });

  it("should return false for invalid objects", () => {
    expect(isUriComponents({})).toBe(false);
    expect(isUriComponents({ scheme: 123 })).toBe(false); // Invalid scheme
  });
});

describe("uriToFsPath Function", () => {
  it("should convert a file URI to a filesystem path (Windows)", () => {
    const uri = URI.parse("file:///C:/path/to/file");

    const fsPath = uriToFsPath(uri, false);
    expect(fsPath).toBe("c:/path/to/file");
  });

  it("should convert a file URI to a filesystem path (UNC)", () => {
    const uri = URI.parse("file://server/share/folder");

    const fsPath = uriToFsPath(uri, false);
    expect(fsPath).toBe("//server/share/folder");
  });
});
