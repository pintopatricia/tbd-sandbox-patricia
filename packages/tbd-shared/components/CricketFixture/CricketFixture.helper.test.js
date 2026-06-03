import { MatchStatus, ScoreStyle } from "@ppb/the-wall-common/types";
import { formatCouponViewScoreData, isCricketFixtureEqual } from "./CricketFixture.helper";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Cricket Fixture Helper", () => {
  describe("formatCouponViewScoreData", () => {
    describe("when match status is END", () => {
      it("should return final game score and style correctly for coupon view", () => {
        expect(
          formatCouponViewScoreData({ scoreData: 0, teamATotalRuns: 200, teamBTotalRuns: 150 }, MatchStatus.END),
        ).toStrictEqual([
          {
            teamA: 200,
            teamB: 150,
            style: ScoreStyle.FINISHED,
          },
        ]);
      });
    });

    describe("when match status is not END", () => {
      describe("if game is in first inning", () => {
        it("should return game score for coupon view", () => {
          expect(
            formatCouponViewScoreData(
              {
                scoreData: [{ home: 250, away: 150, style: ScoreStyle.IN_PLAY }],
                teamATotalRuns: 200,
                teamBTotalRuns: 150,
              },
              MatchStatus.IN_PLAY,
            ),
          ).toStrictEqual([
            {
              home: 250,
              away: 150,
              style: ScoreStyle.IN_PLAY,
            },
          ]);
        });
      });
      describe("if game is in second inning", () => {
        it("should return game score for coupon view", () => {
          expect(
            formatCouponViewScoreData(
              {
                scoreData: [
                  { home: 100, away: 100, style: ScoreStyle.FINISHED },
                  { home: 250, away: 150, style: ScoreStyle.IN_PLAY },
                ],
                teamATotalRuns: 350,
                teamBTotalRuns: 250,
              },
              MatchStatus.IN_PLAY,
            ),
          ).toStrictEqual([
            {
              home: 100,
              away: 100,
              style: ScoreStyle.FINISHED,
            },
            {
              home: 250,
              away: 150,
              style: ScoreStyle.IN_PLAY,
            },
          ]);
        });
      });
    });
  });

  describe("isCricketFixtureEqual", () => {
    const BASE_PREVIOUS_PROPS = {
      competition: "Dummy Competition",
      date: "2000-06-11 21:00:00",
      matchStatus: MatchStatus.IN_PLAY,
      showBottomSeparator: false,
      sporteventURN: "Dummy Sport Urn",
      time: "Dummy Time",
      urn: "Dummy Urn",
      viewMode: "COUPON",
      teamA: {
        name: "Australia",
      },
      teamB: {
        name: "India",
      },
      teamServing: "HOME",
      cricketScoreData: {
        scoreData: [
          {
            home: 130,
            away: 255,
            style: ScoreStyle.IN_PLAY,
          },
        ],
      },
    };

    describe("when competition name changes", () => {
      it("should return false", () => {
        expect(
          isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, competition: "Cricket Open" }),
        ).toEqual(false);
      });
    });

    describe("when date changes", () => {
      it("should return false", () => {
        expect(
          isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, date: "2000-06-11 21:10:00" }),
        ).toEqual(false);
      });
    });

    describe("when match status changes", () => {
      it("should return false", () => {
        expect(isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, matchStatus: "END" })).toEqual(
          false,
        );
      });
    });

    describe("when showBottomSeparator changes", () => {
      it("should return false", () => {
        expect(
          isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, showBottomSeparator: true }),
        ).toEqual(false);
      });
    });

    describe("when time changes", () => {
      it("should return false", () => {
        expect(
          isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, time: "Not So Dummy Time" }),
        ).toEqual(false);
      });
    });

    describe("when viewMode changes", () => {
      it("should return false", () => {
        expect(isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, viewMode: "DEFAULT" })).toEqual(
          false,
        );
      });
    });

    describe("when teamServing changes", () => {
      it("should return false", () => {
        expect(isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, teamServing: "AWAY" })).toEqual(
          false,
        );
      });
    });

    describe("when teamA name changes", () => {
      it("should return false", () => {
        expect(
          isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, teamA: { name: "Other Team" } }),
        ).toEqual(false);
      });
    });

    describe("when teamB name changes", () => {
      it("should return false", () => {
        expect(
          isCricketFixtureEqual(BASE_PREVIOUS_PROPS, { ...BASE_PREVIOUS_PROPS, teamB: { name: "And Another Team" } }),
        ).toEqual(false);
      });
    });

    describe("when cricketScoreData changes", () => {
      it("should return false", () => {
        expect(
          isCricketFixtureEqual(BASE_PREVIOUS_PROPS, {
            ...BASE_PREVIOUS_PROPS,
            cricketScoreData: { teamATotalRuns: 200, teamBTotalRuns: 255, style: ScoreStyle.IN_PLAY },
          }),
        ).toEqual(false);
      });
    });
  });
});
