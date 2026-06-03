import { isPredictsMessage } from "./Predicts.helpers";
import { PredictsMessageType } from "./Predicts.types";

describe("isPredictsMessage", () => {
  it("should return true for a valid Ready message", () => {
    expect(isPredictsMessage({ type: PredictsMessageType.Ready })).toBe(true);
  });

  it("should return true for a valid Exit message", () => {
    expect(isPredictsMessage({ type: PredictsMessageType.Exit })).toBe(true);
  });

  it("should return false for a message with an unknown type", () => {
    expect(isPredictsMessage({ type: "SOMETHING_ELSE" })).toBe(false);
  });

  it("should return false for an object without a type property", () => {
    expect(isPredictsMessage({ payload: "data" })).toBe(false);
  });

  it("should return false for null", () => {
    expect(isPredictsMessage(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isPredictsMessage(undefined)).toBe(false);
  });

  it("should return false for a primitive", () => {
    expect(isPredictsMessage("PREDICTS_READY")).toBe(false);
    expect(isPredictsMessage(42)).toBe(false);
  });
});
