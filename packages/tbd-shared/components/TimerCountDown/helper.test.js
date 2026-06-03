import { timeFormatter, isValidNumber } from "./helper";

describe("Helper Functions", () => {
  describe("timeFormatter", () => {
    it("formats single-digit numbers correctly", () => {
      expect(timeFormatter(5)).toEqual([0, 5]);
    });

    it("formats double-digit numbers correctly", () => {
      expect(timeFormatter(12)).toEqual([1, 2]);
    });
  });

  describe("isValidNumber", () => {
    it("returns true for defined numbers", () => {
      expect(isValidNumber(5)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
    });

    it("returns false for undefined", () => {
      expect(isValidNumber(undefined)).toBe(false);
    });
  });
});
