import { formatRunnerName, formatHandicap, formatHorseInfo } from "./runner-formatters";

describe("formatRunnerName", () => {
  describe("when handicap is inexistent", () => {
    it("should return the original name", () => {
      expect(formatRunnerName("Runner Name")).toEqual("Runner Name");
    });
  });

  describe("when handicap is zero", () => {
    it("should return the original name", () => {
      expect(formatRunnerName("Runner Name", 0)).toEqual("Runner Name");
    });
  });

  describe("when withSeparator is positive", () => {
    describe("and the handicap is positive", () => {
      it("should return the original name appended with the handicap with the correct signal", () => {
        expect(formatRunnerName("Runner Name", 5.5)).toEqual("Runner Name (+5.5)");
      });
    });

    describe("and the handicap is negative", () => {
      it("should return the original name appended with the handicap with the correct signal", () => {
        expect(formatRunnerName("Runner Name", -5.5)).toEqual("Runner Name (-5.5)");
      });
    });
  });

  describe("when withSeparator is false", () => {
    describe("and the handicap is positive", () => {
      it("should return the original name appended with the handicap with the correct signal", () => {
        expect(formatRunnerName("Runner Name", 5.5, false)).toEqual("Runner Name +5.5");
      });
    });

    describe("and the handicap is negative", () => {
      it("should return the original name appended with the handicap with the correct signal", () => {
        expect(formatRunnerName("Runner Name", -5.5, false)).toEqual("Runner Name -5.5");
      });
    });
  });
});

describe("formatHorseInfo", () => {
  describe("when horseInfo is not defined", () => {
    it("should return undefined", () => {
      expect(formatHorseInfo(undefined)).toEqual(undefined);
    });
  });

  describe("when horseInfo is  defined", () => {
    it("should return the formatted horseIngo", () => {
      expect(formatHorseInfo("ELEVATED CITY (USA)")).toEqual("Elevated City (USA)");
    });
  });
});

describe("formatHandicap", () => {
  describe("when handicap is inexistent", () => {
    it("should return the original name", () => {
      expect(formatHandicap()).toEqual("");
    });
  });
});
