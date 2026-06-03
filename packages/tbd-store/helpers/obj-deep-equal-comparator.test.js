import { areObjectsDeepEqual } from "./obj-deep-equal-comparator";

describe("areObjectsDeepEqual", () => {
  it("should return true for deeply equal objects", () => {
    const obj1 = { a: 1, b: { c: 2, d: 3 }, e: ["a", "b"] };
    const obj2 = { e: ["a", "b"], b: { d: 3, c: 2 }, a: 1 };

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(true);
  });

  it("should return false for objects with different keys and values", () => {
    const obj1 = { a: 1, b: { c: 2, d: 3, e: 5, f: ["a", "b"] } };
    const obj2 = { a: 1, b: { c: 2, d: 4, f: "string" } };

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(false);
  });

  it("should return true for empty objects", () => {
    const obj1 = {};
    const obj2 = {};

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(true);
  });

  it("should return false for different Sets", () => {
    const obj1 = new Set([{ a: 1 }, { b: 2 }]);
    const obj2 = new Set([{ b: 2 }, { c: 3 }]);

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(false);
  });

  it("should return true for equal Sets", () => {
    const obj1 = new Set([{ a: 1 }, { b: 2 }]);
    const obj2 = new Set([{ b: 2 }, { a: 1 }]);

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(true);
  });

  it("should return false for different arrays", () => {
    const obj1 = [1, 2, 3, { a: 4 }];
    const obj2 = [1, 2, 4, { b: 1 }];

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(false);
  });

  it("should return true for equal arrays", () => {
    const obj1 = [1, 2, 3];
    const obj2 = [1, 2, 3];

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(true);
  });

  it("should return false for different Maps", () => {
    const obj1 = new Map([
      ["key1", "value1"],
      ["key2", "value2"],
    ]);
    const obj2 = new Map([
      ["key1", "value1"],
      ["key3", "value3"],
    ]);

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(false);
  });

  it("should return true for equal Maps", () => {
    const obj1 = new Map([
      ["key1", "value1"],
      ["key2", "value2"],
    ]);
    const obj2 = new Map([
      ["key2", "value2"],
      ["key1", "value1"],
    ]);

    expect(areObjectsDeepEqual(obj1, obj2)).toBe(true);
  });
});
