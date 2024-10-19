import { IdGenerator, defaultIdGenerator } from "../idGenerator";

describe("IdGenerator", () => {
  describe("generateNextId", () => {
    it("should generate the next ID with the specified prefix", () => {
      const generator = new IdGenerator("item#");

      expect(generator.generateNextId()).toBe("item#1");
      expect(generator.generateNextId()).toBe("item#2");
      expect(generator.generateNextId()).toBe("item#3");
    });

    it("should generate unique IDs when called multiple times", () => {
      const generator = new IdGenerator("user#");

      const id1 = generator.generateNextId();
      const id2 = generator.generateNextId();

      expect(id1).not.toEqual(id2);
    });

    it("should reset the ID counter when a new instance is created", () => {
      const generator1 = new IdGenerator("order#");
      generator1.generateNextId(); // "order#1"
      generator1.generateNextId(); // "order#2"

      const generator2 = new IdGenerator("order#");
      expect(generator2.generateNextId()).toBe("order#1"); // New instance starts from 1
    });
  });
});

describe("defaultIdGenerator", () => {
  it('should use the default "id#" prefix', () => {
    expect(defaultIdGenerator.generateNextId()).toBe("id#1");
    expect(defaultIdGenerator.generateNextId()).toBe("id#2");
  });
});
