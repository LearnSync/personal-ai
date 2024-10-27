/************************************************************************************************************
 * Author: LPS-AI
 * Date: 27 Oct 2024
 * Description: Utility class providing static methods for converting strings between different cases.
 *              Includes conversions for snake_case, kebab-case, camelCase, PascalCase, and lowercase.
 * Version: v0.0.1
 **********************************************************************************************************/

export class CaseConverter {
  /**
   * Converts a snake_case string to Title Case.
   *
   * @param input The input string in snake_case format.
   * @returns The converted string in Title Case format.
   * If the input is empty or consists solely of underscores, an empty string is returned.
   */
  public static snakeCaseToTitleCase(input: string): string {
    if (!input) return "";

    return input
      .split("_")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Converts a Title Case string to snake_case.
   *
   * @param input The input string in Title Case format.
   * @returns The converted string in snake_case format.
   * If the input is empty or consists solely of spaces, an empty string is returned.
   */
  public static titleCaseToSnakeCase(input: string): string {
    if (!input) return "";

    return input
      .trim()
      .split(/\s+/)
      .map((word) => word.toLowerCase())
      .join("_");
  }

  /**
   * Converts a kebab-case string to camelCase.
   *
   * @param input The input string in kebab-case format.
   * @returns The converted string in camelCase format.
   * If the input is empty or consists solely of hyphens, an empty string is returned.
   */
  public static kebabCaseToCamelCase(input: string): string {
    if (!input) return "";

    return input
      .split("-")
      .filter(Boolean)
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word[0].toUpperCase() + word.slice(1).toLowerCase()
      )
      .join("");
  }

  /**
   * Converts a camelCase string to kebab-case.
   *
   * @param input The input string in camelCase format.
   * @returns The converted string in kebab-case format.
   * If the input is empty, an empty string is returned.
   */
  public static camelCaseToKebabCase(input: string): string {
    if (!input) return "";

    return input.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  }

  /**
   * Converts a camelCase string to snake_case.
   *
   * @param input The input string in camelCase format.
   * @returns The converted string in snake_case format.
   * If the input is empty, an empty string is returned.
   */
  public static camelCaseToSnakeCase(input: string): string {
    if (!input) return "";

    return input.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
  }

  /**
   * Converts a snake_case string to camelCase.
   *
   * @param input The input string in snake_case format.
   * @returns The converted string in camelCase format.
   * If the input is empty, an empty string is returned.
   */
  public static snakeCaseToCamelCase(input: string): string {
    if (!input) return "";

    return input
      .split("_")
      .filter(Boolean)
      .map((word, index) =>
        index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1)
      )
      .join("");
  }

  /**
   * Converts a PascalCase string to snake_case.
   *
   * @param input The input string in PascalCase format.
   * @returns The converted string in snake_case format.
   * If the input is empty, an empty string is returned.
   */
  public static pascalCaseToSnakeCase(input: string): string {
    if (!input) return "";

    return input.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
  }

  /**
   * Converts a snake_case string to PascalCase.
   *
   * @param input The input string in snake_case format.
   * @returns The converted string in PascalCase format.
   * If the input is empty, an empty string is returned.
   */
  public static snakeCaseToPascalCase(input: string): string {
    if (!input) return "";

    return input
      .split("_")
      .filter(Boolean)
      .map((word, index) =>
        index === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.slice(1)
      )
      .join("");
  }
}
