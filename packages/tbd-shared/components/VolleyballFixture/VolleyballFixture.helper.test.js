import { getStatusLabel, formatCouponScoreBoardData, isEqualFixture } from "./VolleyballFixture.helper";

jest.mock("@ppb/the-wall-common/types", () => ({
  ScoreStyle: {
    BORDER: "BORDER",
    BORDER_EMPTY: "BORDER_EMPTY",
    GREEN_BACKGROUND: "GREEN_BACKGROUND",
    GREY_BACKGROUND: "GREY_BACKGROUND",
    YELLOW_BACKGROUND: "YELLOW_BACKGROUND",
    IN_PLAY: "IN_PLAY",
    FINISHED: "FINISHED",
  },
  MatchStatus: {
    PRE_MATCH: "PRE_MATCH",
    IN_PLAY: "IN_PLAY",
    NO_EXTRA_TIME: "NO_EXTRA_TIME",
    END: "END",
  },
  ScoreboardViewMode: {
    DEFAULT: "DEFAULT",
    SMALL: "SMALL",
    COUPON: "COUPON",
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getStatusLabel", () => {
  describe("when there is no currentSet information available", () => {
    it("should return 'Set 1' as default", () => {
      expect(getStatusLabel(undefined)).toEqual("Set 1");
    });
  });

  describe("when currentSet exists but has no number", () => {
    it("should return 'Set 1' as default", () => {
      expect(getStatusLabel({ number: null })).toEqual("Set 1");
    });
  });

  describe.each([
    [{ number: 1 }, "Set 1"],
    [{ number: 2 }, "Set 2"],
    [{ number: 3 }, "Set 3"],
    [{ number: 4 }, "Set 4"],
    [{ number: 5 }, "Set 5"],
  ])("when currentSet number is %s", (currentSet, expectedLabel) => {
    it(`should return '${expectedLabel}'`, () => {
      expect(getStatusLabel(currentSet)).toEqual(expectedLabel);
    });
  });
});

describe("formatCouponScoreBoardData", () => {
  const SCORE_DATA = [
    { teamA: "3", teamB: "2", style: "FINISHED" },
    { teamA: "25", teamB: "20", style: "FINISHED" },
    { teamA: "22", teamB: "25", style: "FINISHED" },
    { teamA: "25", teamB: "18", style: "FINISHED" },
    { teamA: "15", teamB: "12", style: "IN_PLAY" },
  ];

  describe("when viewMode is not COUPON", () => {
    it("should return all score data", () => {
      expect(formatCouponScoreBoardData(SCORE_DATA, "DEFAULT")).toEqual(SCORE_DATA);
    });
  });

  describe("when viewMode is COUPON", () => {
    describe("and match status is END", () => {
      it("should return only the first score (total)", () => {
        const result = formatCouponScoreBoardData(SCORE_DATA, "COUPON", undefined, "END");
        expect(result).toEqual([SCORE_DATA[0]]);
      });
    });

    describe("and match status is IN_PLAY", () => {
      describe("with currentSet defined", () => {
        it("should return total score and current set score", () => {
          const currentSet = { number: 4 };
          const result = formatCouponScoreBoardData(SCORE_DATA, "COUPON", currentSet, "IN_PLAY");
          expect(result).toEqual([SCORE_DATA[0], SCORE_DATA[4]]);
        });
      });

      describe("with currentSet undefined", () => {
        it("should return all score data", () => {
          const result = formatCouponScoreBoardData(SCORE_DATA, "COUPON", undefined, "IN_PLAY");
          expect(result).toEqual(SCORE_DATA);
        });
      });

      describe("with currentSet number null but IN_PLAY style present", () => {
        it("should use IN_PLAY index as fallback", () => {
          const currentSet = { number: null };
          const result = formatCouponScoreBoardData(SCORE_DATA, "COUPON", currentSet, "IN_PLAY");
          expect(result).toEqual([SCORE_DATA[0], SCORE_DATA[4]]);
        });
      });
    });

    describe("and match status is PRE_MATCH", () => {
      it("should return all score data", () => {
        const result = formatCouponScoreBoardData(SCORE_DATA, "COUPON", undefined, "PRE_MATCH");
        expect(result).toEqual(SCORE_DATA);
      });
    });
  });
});

describe("isEqualFixture", () => {
  const BASE_PROPS = {
    competition: "Volleyball League",
    event: "Team A vs Team B",
    currentSet: { number: 3, score: { home: 15, away: 12 } },
    date: "2024-01-06",
    dateTime: new Date("2024-01-06T20:00:00"),
    matchStatus: "IN_PLAY",
    scoreData: [
      { teamA: "2", teamB: "1", style: "FINISHED" },
      { teamA: "15", teamB: "12", style: "IN_PLAY" },
    ],
    teamServing: "HOME",
    teamA: { name: "Team A" },
    teamB: { name: "Team B" },
    time: "20:00",
    labels: { inplay: "In Play" },
  };

  describe("when all props are equal", () => {
    it("should return true", () => {
      expect(isEqualFixture(BASE_PROPS, BASE_PROPS)).toEqual(true);
    });
  });

  describe("when props are different", () => {
    it("should return false when competition changes", () => {
      const nextProps = { ...BASE_PROPS, competition: "Different League" };
      expect(isEqualFixture(BASE_PROPS, nextProps)).toEqual(false);
    });

    it("should return false when currentSet changes", () => {
      const nextProps = { ...BASE_PROPS, currentSet: { number: 4, score: { home: 10, away: 8 } } };
      expect(isEqualFixture(BASE_PROPS, nextProps)).toEqual(false);
    });

    it("should return false when scoreData changes", () => {
      const nextProps = {
        ...BASE_PROPS,
        scoreData: [
          { teamA: "2", teamB: "1", style: "FINISHED" },
          { teamA: "20", teamB: "18", style: "IN_PLAY" },
        ],
      };
      expect(isEqualFixture(BASE_PROPS, nextProps)).toEqual(false);
    });

    it("should return false when teamServing changes", () => {
      const nextProps = { ...BASE_PROPS, teamServing: "AWAY" };
      expect(isEqualFixture(BASE_PROPS, nextProps)).toEqual(false);
    });

    it("should return false when matchStatus changes", () => {
      const nextProps = { ...BASE_PROPS, matchStatus: "END" };
      expect(isEqualFixture(BASE_PROPS, nextProps)).toEqual(false);
    });
  });
});
