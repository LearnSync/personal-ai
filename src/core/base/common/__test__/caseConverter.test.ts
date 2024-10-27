import { CaseConverter } from "../caseConverter";

describe("CaseConverter", () => {
  describe("snakeCaseToTitleCase", () => {
    it("converts snake_case to Title Case", () => {
      expect(CaseConverter.snakeCaseToTitleCase("hello_world")).toBe(
        "Hello World"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.snakeCaseToTitleCase("hello")).toBe("Hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.snakeCaseToTitleCase("")).toBe("");
    });

    it("handles multiple underscores", () => {
      expect(CaseConverter.snakeCaseToTitleCase("hello___world")).toBe(
        "Hello   World"
      );
    });
  });

  describe("titleCaseToSnakeCase", () => {
    it("converts Title Case to snake_case", () => {
      expect(CaseConverter.titleCaseToSnakeCase("Hello World")).toBe(
        "hello_world"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.titleCaseToSnakeCase("Hello")).toBe("hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.titleCaseToSnakeCase("")).toBe("");
    });

    it("handles multiple spaces", () => {
      expect(CaseConverter.titleCaseToSnakeCase("Hello   World")).toBe(
        "hello_world"
      );
    });
  });

  describe("kebabCaseToCamelCase", () => {
    it("converts kebab-case to camelCase", () => {
      expect(CaseConverter.kebabCaseToCamelCase("hello-world")).toBe(
        "helloWorld"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.kebabCaseToCamelCase("hello")).toBe("hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.kebabCaseToCamelCase("")).toBe("");
    });

    it("handles multiple hyphens", () => {
      expect(CaseConverter.kebabCaseToCamelCase("hello--world")).toBe(
        "helloWorld"
      );
    });
  });

  describe("camelCaseToKebabCase", () => {
    it("converts camelCase to kebab-case", () => {
      expect(CaseConverter.camelCaseToKebabCase("helloWorld")).toBe(
        "hello-world"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.camelCaseToKebabCase("hello")).toBe("hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.camelCaseToKebabCase("")).toBe("");
    });
  });

  describe("camelCaseToSnakeCase", () => {
    it("converts camelCase to snake_case", () => {
      expect(CaseConverter.camelCaseToSnakeCase("helloWorld")).toBe(
        "hello_world"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.camelCaseToSnakeCase("hello")).toBe("hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.camelCaseToSnakeCase("")).toBe("");
    });
  });

  describe("snakeCaseToCamelCase", () => {
    it("converts snake_case to camelCase", () => {
      expect(CaseConverter.snakeCaseToCamelCase("hello_world")).toBe(
        "helloWorld"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.snakeCaseToCamelCase("hello")).toBe("hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.snakeCaseToCamelCase("")).toBe("");
    });
  });

  describe("pascalCaseToSnakeCase", () => {
    it("converts PascalCase to snake_case", () => {
      expect(CaseConverter.pascalCaseToSnakeCase("HelloWorld")).toBe(
        "hello_world"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.pascalCaseToSnakeCase("Hello")).toBe("hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.pascalCaseToSnakeCase("")).toBe("");
    });
  });

  describe("snakeCaseToPascalCase", () => {
    it("converts snake_case to PascalCase", () => {
      expect(CaseConverter.snakeCaseToPascalCase("hello_world")).toBe(
        "HelloWorld"
      );
    });

    it("handles single-word input", () => {
      expect(CaseConverter.snakeCaseToPascalCase("hello")).toBe("Hello");
    });

    it("handles empty string", () => {
      expect(CaseConverter.snakeCaseToPascalCase("")).toBe("");
    });
  });
});
