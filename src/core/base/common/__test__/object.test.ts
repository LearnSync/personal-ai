import { isEmpty } from "../object";

describe("Object", () => {
  it("should return `true` when we pass an empty object", () => {
    expect(isEmpty({})).toBe(true);
  });
  it("should return `false` when we pass an object with properties", () => {
    expect(isEmpty({ name: "John" })).toBe(false);
  });
});
