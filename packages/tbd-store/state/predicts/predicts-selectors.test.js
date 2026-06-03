import { getIsPredictsOpen } from "./predicts-selectors";

describe("getIsPredictsOpen", () => {
  it("should return true when isOpen is true", () => {
    const state = { predicts: { isOpen: true } };
    expect(getIsPredictsOpen(state)).toBe(true);
  });

  it("should return false when isOpen is false", () => {
    const state = { predicts: { isOpen: false } };
    expect(getIsPredictsOpen(state)).toBe(false);
  });
});
