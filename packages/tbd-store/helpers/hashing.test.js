import { hashObjectFnv1a } from "./hashing";

describe("hashObjectFnv1a", () => {
  it("should return the same hash for the same object", () => {
    const hash1 = hashObjectFnv1a({ a: 1, b: 2 });
    const hash2 = hashObjectFnv1a({ a: 1, b: 2 });

    expect(hash1).toEqual(hash2);
  });

  it("should return the same hash for the same object with different properties order", () => {
    const hash1 = hashObjectFnv1a({ a: 1, b: 2 });
    const hash2 = hashObjectFnv1a({ b: 2, a: 1 });

    expect(hash1).toEqual(hash2);
  });

  it("should not return the same hash for different objects", () => {
    const hash1 = hashObjectFnv1a({ a: 1, b: 2 });
    const hash2 = hashObjectFnv1a({ a: 1, b: 3 });

    expect(hash1).not.toEqual(hash2);
  });

  it("should not return the same hash for different big objects", () => {
    const hash1 = hashObjectFnv1a({ a: "aaaaaa", b: "bbbbbb", c: { d: "dddddd", e: "eeeeee", f: { g: "gggggg" } } });
    const hash2 = hashObjectFnv1a({ a: "aaaaaa", b: "bbbbbb", c: { d: "dddddd", e: "eeeeee", f: { g: "ggggg1" } } });

    expect(hash1).not.toEqual(hash2);
  });
});
