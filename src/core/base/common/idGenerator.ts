/**
 * A class responsible for generating unique incremental IDs with a specified prefix.
 */
export class IdGenerator {
  private prefix: string;
  private lastId: number;

  /**
   * Creates an instance of `IdGenerator`.
   *
   * @param prefix - The prefix to be prepended to the generated IDs.
   */
  constructor(prefix: string) {
    this.prefix = prefix;
    this.lastId = 0;
  }

  /**
   * Generates the next ID by incrementing the internal counter and appending it to the prefix.
   *
   * @returns A unique ID string consisting of the prefix and an incremented number.
   *
   * @example
   * const generator = new IdGenerator("item#");
   * console.log(generator.nextId()); // Outputs: "item#1"
   * console.log(generator.nextId()); // Outputs: "item#2"
   */
  public generateNextId(): string {
    return `${this.prefix}${++this.lastId}`;
  }
}

/**
 * A default instance of `IdGenerator` with a predefined prefix of "id#".
 * This can be used when no custom prefix is needed.
 */
export const defaultIdGenerator = new IdGenerator("id#");
