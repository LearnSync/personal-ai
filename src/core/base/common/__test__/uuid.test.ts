import { isValidUUID, generateUUID } from "../uuid";

describe("UUID Utilities", () => {
  describe("isValidUUID", () => {
    it("should return true for valid UUIDs", () => {
      const validUUIDs = [
        "123e4567-e89b-12d3-a456-426614174000",
        "550e8400-e29b-41d4-a716-446655440000",
        "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "9b2a7b30-9b22-4fa2-9c73-8394d39d2b0a",
      ];

      validUUIDs.forEach((uuid) => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it("should return false for invalid UUIDs", () => {
      const invalidUUIDs = [
        "123e4567-e89b-12d3-a456-42661417400Z", // Invalid character
        "123e4567-e89b-12d3-a456-42661417400", // Too short
        "550e8400-e29b-41d4-a716-4466554400000", // Too long
        "invalid-uuid-string", // Completely invalid
        "550e8400e29b41d4a716446655440000", // No dashes
      ];

      invalidUUIDs.forEach((uuid) => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });
  });

  describe("generateUUID", () => {
    it("should generate a valid UUID", () => {
      const uuid = generateUUID();
      expect(isValidUUID(uuid)).toBe(true);
    });

    it("should generate different UUIDs each time", () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();

      expect(uuid1).not.toEqual(uuid2);
    });

    it("should generate a UUID of correct length and format", () => {
      const uuid = generateUUID();

      // UUID length is 36 characters including 4 hyphens
      expect(uuid.length).toBe(36);

      // Check format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it("should generate a version 4 UUID", () => {
      const uuid = generateUUID();

      // The version 4 UUID should have '4' as the 13th character
      expect(uuid[14]).toBe("4");
    });

    it("should generate a UUID with valid variant bits", () => {
      const uuid = generateUUID();

      // The variant bits (first character of the 4th segment) should be one of 8, 9, A, or B
      const variantChar = uuid[19].toLowerCase();
      expect(["8", "9", "a", "b"]).toContain(variantChar);
    });
  });
});
