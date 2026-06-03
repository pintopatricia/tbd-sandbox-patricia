import { ScoreStyle } from "@ppb/the-wall-common/types";
import { BasketballPeriod } from "@ppb/tbd-store/state/entities/basketball-fixture/BasketballFixture";
import { createBasketballFixtureViewModel } from "./basketball-fixture";
import { formatDateWithToday, formatTime } from "../helpers/dates";

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "21:00"),
}));

const SPORT_EVENT = { name: "Nam Ching v Able Hon Friends", openDate: "2000-02-11 21:00:00" };

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

const SCORE_DATA_DEFAULT = [
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
];

const CLOCK_END = {
  period: BasketballPeriod.END,
};

beforeEach(jest.clearAllMocks);

describe("createBasketballFixtureViewModel", () => {
  describe("getDateInformation", () => {
    describe("when there is no openDate information on the sportevent", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: { ...SPORT_EVENT, openDate: undefined },
        });

        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({ date: undefined, dateTime: undefined, time: undefined }),
        );
      });
    });

    describe("where there is an openDate on the sportevent", () => {
      describe("and the event is happening today", () => {
        beforeEach(() => {
          formatDateWithToday.mockReturnValue("I18N.DATE.TODAY");
        });

        it("should return the correct sportevent date information", () => {
          const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
          const basketballFixtureViewModel = getBasketballFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(basketballFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
            getBasketballFixtureViewModel({
              userDetails: USER_DETAILS,
              sportEvent: SPORT_EVENT,
            });
          });

          it("should call formatDateWithToday", () => {
            expect(formatDateWithToday).toHaveBeenCalledTimes(1);
            expect(formatDateWithToday).toHaveBeenCalledWith(
              new Date("2000-02-11T21:00:00.000Z"),
              "locale",
              "timezone",
            );
          });

          it("should call formatTime", () => {
            expect(formatTime).toHaveBeenNthCalledWith(1, new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
          });
        });
      });

      describe("and the event is not happening today", () => {
        beforeEach(() => {
          formatDateWithToday.mockReturnValue("formatDate");
        });

        it("should return the correct sportevent date information", () => {
          const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
          const basketballFixtureViewModel = getBasketballFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
          });

          expect(basketballFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "formatDate",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
            getBasketballFixtureViewModel({
              userDetails: USER_DETAILS,
              sportEvent: SPORT_EVENT,
            });
          });

          it("should call formatDateWithToday", () => {
            expect(formatDateWithToday).toHaveBeenCalledTimes(1);
            expect(formatDateWithToday).toHaveBeenCalledWith(
              new Date("2000-02-11T21:00:00.000Z"),
              "locale",
              "timezone",
            );
          });

          it("should call formatTime", () => {
            expect(formatTime).toHaveBeenNthCalledWith(1, new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
          });
        });
      });
    });
  });

  describe("getMatchState", () => {
    const PRE_MATCH = "PRE_MATCH";
    const IN_PLAY = "IN_PLAY";
    const END = "END";

    describe.each([
      [undefined, PRE_MATCH],
      ["UNKNOWN_PERIOD", PRE_MATCH],
      ["PERIOD_1", IN_PLAY],
      ["END_PERIOD_1", IN_PLAY],
      ["PERIOD_2", IN_PLAY],
      ["END_PERIOD_2", IN_PLAY],
      ["PERIOD_3", IN_PLAY],
      ["END_PERIOD_3", IN_PLAY],
      ["PERIOD_4", IN_PLAY],
      ["END_PERIOD_4", IN_PLAY],
      ["OVERTIME", IN_PLAY],
      ["END_OVERTIME", IN_PLAY],
      ["END", END],
      ["ANY_OTHER_STATUS", END],
    ])("when period status is %s", (periodStatus, mappedStatus) => {
      it(`should map to ${mappedStatus}`, async () => {
        const CLOCK_PERIOD_VALUE = { period: periodStatus };

        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          clock: CLOCK_PERIOD_VALUE,
        });

        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: mappedStatus,
          }),
        );
      });
    });
  });
});

describe("getPrefixLabel", () => {
  const CLOCK = { period: "END", segment: "Q1", timeRemaining: 0 };

  describe("when no clock information is provided", () => {
    it("should return an empty string", () => {
      const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
      const basketballFixtureViewModel = getBasketballFixtureViewModel({
        userDetails: USER_DETAILS,
        sportEvent: SPORT_EVENT,
        clock: undefined,
      });
      expect(basketballFixtureViewModel).toEqual(
        expect.objectContaining({
          prefixLabel: "",
        }),
      );
    });

    describe("and matchStatus is END", () => {
      it("should return an empty string", () => {
        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          clock: CLOCK,
        });
        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({
            prefixLabel: "",
          }),
        );
      });
    });

    describe("and matchStatus is not END", () => {
      describe("and there is no segment", () => {
        it("should return an empty string", () => {
          const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
          const basketballFixtureViewModel = getBasketballFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            clock: { ...CLOCK, segment: undefined },
          });
          expect(basketballFixtureViewModel).toEqual(
            expect.objectContaining({
              prefixLabel: "",
            }),
          );
        });
      });

      describe("and there is a segment", () => {
        describe("bu timeRemaining is not present", () => {
          it("should return an empty string", () => {
            const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
            const basketballFixtureViewModel = getBasketballFixtureViewModel({
              userDetails: USER_DETAILS,
              sportEvent: SPORT_EVENT,
              clock: { ...CLOCK, timeRemaining: undefined },
            });
            expect(basketballFixtureViewModel).toEqual(
              expect.objectContaining({
                prefixLabel: "",
              }),
            );
          });
        });
      });

      it("should return an the segment if exists", () => {
        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          clock: { ...CLOCK, period: "PERIOD_1" },
        });

        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({
            prefixLabel: "Q1",
          }),
        );
      });
    });
  });

  describe("formatScoreBoardData", () => {
    describe("when there is no periodScores or score data", () => {
      it("should return default basketball data score", () => {
        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
        });

        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: SCORE_DATA_DEFAULT,
          }),
        );
      });
    });

    describe("when score data is available", () => {
      it("should fulfill return the default basketball score", () => {
        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          score: { home: 16, away: 32 },
          periodScores: undefined,
        });

        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: SCORE_DATA_DEFAULT,
          }),
        );
      });
    });

    describe("when no periodScore is available", () => {
      it("should return default basketball data score", () => {
        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          score: undefined,
          periodScores: [],
        });

        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: SCORE_DATA_DEFAULT,
          }),
        );
      });
    });

    describe("when game is in END status", () => {
      it("should only return the final score", () => {
        const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
        const basketballFixtureViewModel = getBasketballFixtureViewModel({
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          clock: CLOCK_END,
          score: {
            home: 123,
            away: 90,
          },
          periodScores: [
            {
              score: {},
              period: "PERIOD_1",
              segment: "Q1",
            },
          ],
        });

        expect(basketballFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: [{ teamA: 123, teamB: 90, style: ScoreStyle.FINISHED }],
          }),
        );
      });

      describe("when there is periodScores data available", () => {
        it("fulfill the data object with scores set to zero when empty score", () => {
          const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
          const basketballFixtureViewModel = getBasketballFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            clock: { period: BasketballPeriod.PERIOD_1 },
            score: {},
            periodScores: [
              {
                score: {},
                period: "PERIOD_1",
                segment: "Q1",
              },
            ],
          });

          expect(basketballFixtureViewModel).toEqual(
            expect.objectContaining({
              scoreData: [
                { teamA: 0, teamB: 0, style: ScoreStyle.IN_PLAY },
                { teamA: 0, teamB: 0, style: ScoreStyle.DEFAULT },
                { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
                { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
                { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
              ],
            }),
          );
        });

        it("fulfill the data object with scores and styles", () => {
          const getBasketballFixtureViewModel = createBasketballFixtureViewModel();
          const basketballFixtureViewModel = getBasketballFixtureViewModel({
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            clock: { period: BasketballPeriod.PERIOD_2 },
            score: {
              home: 16,
              away: 32,
            },
            periodScores: [
              {
                score: { home: 11, away: 22 },
                period: "PERIOD_1",
                segment: "Q1",
              },
              {
                score: { home: 5, away: 10 },
                period: "PERIOD_2",
                segment: "Q2",
              },
            ],
          });

          expect(basketballFixtureViewModel).toEqual(
            expect.objectContaining({
              scoreData: [
                { teamA: 16, teamB: 32, style: ScoreStyle.IN_PLAY },
                { teamA: 11, teamB: 22, style: ScoreStyle.FINISHED },
                { teamA: 5, teamB: 10, style: ScoreStyle.DEFAULT },
                { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
                { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
              ],
            }),
          );
        });
      });
    });
  });
});
