import { getClockExtraMinutes } from "./clock-extra-minutes";

describe("getClockExtraMinutes", () => {
  describe("when period is null", () => {
    it("should return the given minute + 1", () => {
      const result = getClockExtraMinutes(10, null, "INPLAY_FIRST_HALF");
      expect(result).toBe("11");
    });
  });

  describe("when periodStatus is null", () => {
    it("should return the given minute + 1", () => {
      const result = getClockExtraMinutes(10, "REGULAR", null);
      expect(result).toBe("11");
    });
  });

  describe("when periodStatus is neither INPLAY_FIRST_HALF or INPLAY_SECOND_HALF", () => {
    it("should return the given minute + 1", () => {
      const result = getClockExtraMinutes(10, "REGULAR", "END");
      expect(result).toBe("11");
    });
  });

  describe("when minute is less than the correspondent period's end minute", () => {
    it("should return the given minute + 1", () => {
      const result = getClockExtraMinutes(43, "REGULAR", "INPLAY_FIRST_HALF");
      expect(result).toBe("44");
    });
  });

  describe("when minute is greater than the correspondent period's end minute", () => {
    it("should return the period's end minute + the extra minutes", () => {
      const result = getClockExtraMinutes(47, "REGULAR", "INPLAY_FIRST_HALF");
      expect(result).toBe("45\u00A0+3");
    });
  });
});
