import { getAmericanFormatScoreData, getOpponentsNames } from "./fixture";

describe("helpers - fixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("getOpponentsNames", () => {
    describe("when there are runnerNames", () => {
      describe("and it is 'American' format", () => {
        it("should return teamB with @", () => {
          const result = getOpponentsNames({
            isAmericanFormat: true,
            runnerNames: {
              home: "teamA team",
              away: "teamB team",
            },
          });
          expect(result).toEqual({
            teamA: "teamB team",
            teamB: "@ teamA team",
          });
        });
      });
      describe("and it is not 'American' format", () => {
        it("should return teamB without @", () => {
          const result = getOpponentsNames({
            isAmericanFormat: false,
            runnerNames: {
              home: "teamA team",
              away: "teamB team",
            },
          });
          expect(result).toEqual({
            teamA: "teamA team",
            teamB: "teamB team",
          });
        });
      });
    });

    describe("when there are no runnerNames", () => {
      it("should return null", () => {
        const result = getOpponentsNames({});
        expect(result).toEqual(null);
      });
    });
  });

  describe("getAmericanFormatScoreData", () => {
    describe("when teamA is defined", () => {
      describe("when teamB is defined", () => {
        describe("when isAmericanFormat is true", () => {
          it("should return inverted teams", () => {
            const scoreData = getAmericanFormatScoreData({ teamA: "Team A", teamB: "Team B", isAmericanFormat: true });
            expect(scoreData).toEqual({ teamA: "Team B", teamB: "Team A" });
          });
        });

        describe("when isAmericanFormat is false", () => {
          it("should return uninverted teams", () => {
            const scoreData = getAmericanFormatScoreData({ teamA: "Team A", teamB: "Team B", isAmericanFormat: false });
            expect(scoreData).toEqual({ teamA: "Team A", teamB: "Team B" });
          });
        });
      });

      describe("when teamB is not defined", () => {
        describe("when isAmericanFormat is true", () => {
          it("should return teamA team as teamB team", () => {
            const scoreData = getAmericanFormatScoreData({ teamA: "Team A", isAmericanFormat: true });
            expect(scoreData).toEqual({ teamB: "Team A" });
          });
        });

        describe("when isAmericanFormat is false", () => {
          it("should return uninverted teamA team", () => {
            const scoreData = getAmericanFormatScoreData({ teamA: "Team A", isAmericanFormat: false });
            expect(scoreData).toEqual({ teamA: "Team A" });
          });
        });
      });
    });

    describe("when teamA is not defined", () => {
      describe("when teamB is defined", () => {
        describe("when isAmericanFormat is true", () => {
          it("should return teamB team as teamA team", () => {
            const scoreData = getAmericanFormatScoreData({ teamB: "Team B", isAmericanFormat: true });
            expect(scoreData).toEqual({ teamA: "Team B" });
          });
        });

        describe("when isAmericanFormat is false", () => {
          it("should return uninverted teamB team", () => {
            const scoreData = getAmericanFormatScoreData({ teamB: "Team B", isAmericanFormat: false });
            expect(scoreData).toEqual({ teamB: "Team B" });
          });
        });
      });
      describe("when teamB is not defined", () => {
        it("should return an empty object", () => {
          const scoreData = getAmericanFormatScoreData({ isAmericanFormat: true });
          expect(scoreData).toEqual({});
        });
      });
    });
  });
});
