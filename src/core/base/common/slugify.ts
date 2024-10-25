/**
 * Utility class for generating slugs from strings.
 * Handles conversion to URL-friendly formats and customization for user input.
 */
class Slugify {
  /**
   * Convert a given string into a slug format.
   * @param {string} str - The input string to be slugified.
   * @param {boolean} [forDisplayingInput=false] - If true, retains trailing dashes for user input display.
   * @returns {string} - The slugified version of the input string.
   */
  public static slugify(
    str: string,
    forDisplayingInput: boolean = false
  ): string {
    if (!str) return "";

    let slug = str
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from both sides
      .normalize("NFD") // Normalize to decomposed form for handling accents
      .replace(/\p{Diacritic}/gu, "") // Remove any diacritics (accents) from characters
      .replace(/[^.\p{L}\p{N}\p{Zs}\p{Emoji}]+/gu, "-") // Replace any non-alphanumeric characters (including Unicode and except "." period) with a dash
      .replace(/[\s_#]+/g, "-") // Replace whitespace, # and underscores with a single dash
      .replace(/^-+/, "") // Remove dashes from start
      .replace(/\.{2,}/g, ".") // Replace consecutive periods with a single period
      .replace(/^\.+/, "") // Remove periods from the start
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ""
      ) // Removes emojis
      .replace(/\s+/g, " ")
      .replace(/-+/g, "-"); // Replace consecutive dashes with a single dash

    return forDisplayingInput
      ? slug
      : slug.replace(/-+$/, "").replace(/\.*$/, ""); // Remove trailing dashes/periods if not for display
  }

  /**
   * Convert a slug back into a readable string.
   * @param {string} slug - The slug to be deslugified.
   * @returns {string} - The deslugified string with spaces.
   */
  public static deslugify(slug: string): string {
    if (!slug) return "";

    // Replace dashes with spaces and trim any extra whitespace
    return slug.replace(/-/g, " ").trim();
  }
}

export default Slugify;
