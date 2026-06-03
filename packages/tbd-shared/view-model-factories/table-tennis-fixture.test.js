import { MatchStatus, TeamSide, ScoreStyle } from "@ppb/the-wall-common/types";
import { SportsbookMarketStatus } from "@ppb/the-wall-common/constants";
import { getOpponentsNames, getAmericanFormatScoreData } from "@ppb/tbd-store/helpers/fixture";

import { formatDateWithToday, formatTime } from "../helpers/dates";
import { createTableTennisScoreboardByURNSelector } from "./table-tennis-fixture";

jest.mock("@ppb/tbd-store/helpers/fixture", () => ({
  getOpponentsNames: jest.fn(),
  getAmericanFormatScoreData: jest.fn(({ isAmericanFormat, ...props }) => props),
}));

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "21:00"),
}));

const URN = "ppb:fixture:31214887";

const TABLE_TENNIS_FIXTURE_NO_CURRENTSET = {
  urn: URN,
  typename: "TableTennisFixture",
};

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
  currentSet: undefined,
  setsWon: undefined,
};

const SPORT_EVENT = { name: "Nam Ching v Able Hon Friends", openDate: "2000-02-11 21:00:00" };

const CURRENT_SET = {
  currentServer: TeamSide.HOME,
  number: 2,
  score: {
    away: 4,
    home: 3,
  },
};

const SETS_WON = {
  away: 1,
  home: 0,
};

const PREVIOUS_SETS = [
  {
    currentServer: null,
    number: 1,
    score: {
      away: 9,
      home: 11,
    },
  },
];

const TABLE_TENNIS_FIXTURE = {
  typename: "TableTennisFixture",
  urn: URN,
  isAmericanFormat: false,
  runnerNames: { home: "home", away: "away" },
  currentSet: CURRENT_SET,
  setsWon: SETS_WON,
  previousSets: PREVIOUS_SETS,
};

const SCORE_DATA_DEFAULT = [
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
  { teamA: "-", teamB: "-", style: ScoreStyle.EMPTY },
];

describe("createTableTennisScoreboardByURNSelector", () => {
  beforeEach(jest.clearAllMocks);

  describe("getDateInformation", () => {
    describe("when there is no openDate information", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE,
          sportEvent: { ...SPORT_EVENT, openDate: "" },
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({ date: undefined, dateTime: undefined, time: undefined }),
        );
      });
    });

    describe("when there is openDate information", () => {
      describe("and the event is happening today", () => {
        beforeEach(() => {
          formatDateWithToday.mockReturnValue("I18N.DATE.TODAY");
        });

        it("should return object with the correct sportevent date information", () => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: TABLE_TENNIS_FIXTURE,
            sportEvent: SPORT_EVENT,
          });

          expect(tableTennisFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });
      });

      describe("call functions", () => {
        beforeEach(() => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();

          getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: TABLE_TENNIS_FIXTURE,
            sportEvent: SPORT_EVENT,
          });
        });

        it("should call formatDateWithToday", () => {
          expect(formatDateWithToday).toHaveBeenCalledTimes(1);
          expect(formatDateWithToday).toHaveBeenCalledWith(new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
        });

        it("should call formatTime", () => {
          expect(formatTime).toHaveBeenNthCalledWith(1, new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
        });
      });

      describe("and the event is NOT happening today", () => {
        beforeEach(() => {
          formatDateWithToday.mockReturnValue("formatDate");
        });

        it("should return object with the correct sportevent date information", () => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: TABLE_TENNIS_FIXTURE,
            sportEvent: SPORT_EVENT,
          });

          expect(tableTennisFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "formatDate",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });
      });

      describe("call formating functions", () => {
        beforeEach(() => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: TABLE_TENNIS_FIXTURE,
            sportEvent: SPORT_EVENT,
          });
        });

        it("should call formatDateWithToday", () => {
          expect(formatDateWithToday).toHaveBeenCalledTimes(1);
          expect(formatDateWithToday).toHaveBeenCalledWith(new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
        });

        it("should call formatTime", () => {
          expect(formatTime).toHaveBeenNthCalledWith(1, new Date("2000-02-11T21:00:00.000Z"), "locale", "timezone");
        });
      });
    });
  });

  describe("getMatchState", () => {
    describe("when exchange/sportsbook market is open and is in play", () => {
      it("should return match status as IN PLAY", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE,
          sportEvent: SPORT_EVENT,
          marketStatus: SportsbookMarketStatus.OPEN,
          inplay: true,
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: MatchStatus.IN_PLAY,
          }),
        );
      });

      describe("when exchange/sportsbook market is open and is not in play", () => {
        it("should return match status as PRE MATCH", () => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: TABLE_TENNIS_FIXTURE,
            sportEvent: SPORT_EVENT,
            marketStatus: SportsbookMarketStatus.OPEN,
            inplay: false,
          });

          expect(tableTennisFixtureViewModel).toEqual(
            expect.objectContaining({
              matchStatus: MatchStatus.PRE_MATCH,
            }),
          );
        });
      });

      describe("when exchange/sportsbook market is closed", () => {
        it("should return match status as END", () => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: TABLE_TENNIS_FIXTURE,
            sportEvent: SPORT_EVENT,
            marketStatus: SportsbookMarketStatus.CLOSED,
            inplay: true,
          });

          expect(tableTennisFixtureViewModel).toEqual(
            expect.objectContaining({
              matchStatus: MatchStatus.END,
            }),
          );
        });

        describe("when current set is defined", () => {
          it("should return match status as IN PLAY", () => {
            const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
            const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
              userDetails: USER_DETAILS,
              fixture: TABLE_TENNIS_FIXTURE,
              sportEvent: SPORT_EVENT,
              inplay: true,
            });

            expect(tableTennisFixtureViewModel).toEqual(
              expect.objectContaining({
                matchStatus: MatchStatus.IN_PLAY,
              }),
            );
          });

          describe("when current set is not defined", () => {
            it("should return match status as in PRE MATCH", () => {
              const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
              const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
                userDetails: USER_DETAILS,
                fixture: TABLE_TENNIS_FIXTURE_NO_CURRENTSET,
                sportEvent: SPORT_EVENT,
                inplay: true,
              });

              expect(tableTennisFixtureViewModel).toEqual(
                expect.objectContaining({
                  matchStatus: MatchStatus.PRE_MATCH,
                }),
              );
            });
          });
        });
      });
    });

    describe("when exchange/sportsbook market is not defined", () => {
      describe("when does not have previous sets", () => {
        it("should return match status as PRE_MATCH", () => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: {},
            sportEvent: SPORT_EVENT,
            marketStatus: undefined,
          });

          expect(tableTennisFixtureViewModel).toEqual(
            expect.objectContaining({
              matchStatus: MatchStatus.PRE_MATCH,
            }),
          );
        });
      });

      describe("when has previous sets", () => {
        it("should return match status as END", () => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: TABLE_TENNIS_FIXTURE,
            sportEvent: SPORT_EVENT,
            marketStatus: undefined,
          });

          expect(tableTennisFixtureViewModel).toEqual(
            expect.objectContaining({
              matchStatus: MatchStatus.END,
            }),
          );
        });
      });
    });
  });

  describe("formatScoreBoardData", () => {
    describe("when there is no won set or previous sets", () => {
      it("should return default table tennis score", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE_NO_CURRENTSET,
          sportEvent: SPORT_EVENT,
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: SCORE_DATA_DEFAULT,
          }),
        );
      });
    });

    describe("when current set data is available", () => {
      it("should fulfill return the default table tennis score", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE_NO_CURRENTSET,
          sportEvent: { ...SPORT_EVENT, currentSet: { number: 21 } },
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: SCORE_DATA_DEFAULT,
          }),
        );
      });
    });

    describe("when sets won are available", () => {
      it("should fulfill return the default table tennis score", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE_NO_CURRENTSET,
          sportEvent: { ...SPORT_EVENT, setsWon: { home: 21, away: 35 } },
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: SCORE_DATA_DEFAULT,
          }),
        );
      });
    });

    describe("when game is in END status", () => {
      it("should only return the final score", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE,
          sportEvent: SPORT_EVENT,
          inplay: false,
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: [{ teamA: 0, teamB: 1, style: ScoreStyle.FINISHED }],
          }),
        );
      });

      describe("and previousSets is unavailable", () => {
        it("should only return the final score", () => {
          const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
          const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
            userDetails: USER_DETAILS,
            fixture: {
              ...TABLE_TENNIS_FIXTURE,
              previousSets: undefined,
            },
            sportEvent: SPORT_EVENT,
            inplay: false,
          });

          expect(tableTennisFixtureViewModel).toEqual(
            expect.objectContaining({
              scoreData: [{ teamA: 0, teamB: 1, style: ScoreStyle.FINISHED }],
            }),
          );
        });
      });
    });

    describe("when previousSets data is available", () => {
      it("show the score data filled accordingly", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE,
          sportEvent: SPORT_EVENT,
          inplay: true,
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            scoreData: [
              { teamA: 0, teamB: 1, style: "DEFAULT" },
              { teamA: 11, teamB: 9, style: "FINISHED" },
              { teamA: 3, teamB: 4, style: "IN_PLAY" },
              { teamA: "-", teamB: "-", style: "EMPTY" },
              { teamA: "-", teamB: "-", style: "EMPTY" },
              { teamA: "-", teamB: "-", style: "EMPTY" },
            ],
          }),
        );
      });
    });

    describe("when isAmericanFormat is true", () => {
      it("should return inverted score information", () => {
        getAmericanFormatScoreData.mockReturnValue({ teamA: "teamB score", teamB: "teamA score" });

        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const { scoreData } = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: { ...TABLE_TENNIS_FIXTURE, isAmericanFormat: true },
          sportEvent: SPORT_EVENT,
          inplay: true,
        });

        expect(scoreData).toEqual([
          { style: "DEFAULT", teamA: "teamB score", teamB: "teamA score" },
          { style: "FINISHED", teamA: "teamB score", teamB: "teamA score" },
          { style: "IN_PLAY", teamA: "teamB score", teamB: "teamA score" },
          { style: "EMPTY", teamA: "-", teamB: "-" },
          { style: "EMPTY", teamA: "-", teamB: "-" },
          { style: "EMPTY", teamA: "-", teamB: "-" },
        ]);
      });
    });
  });

  describe("teams", () => {
    describe("when there are opponentsNames", () => {
      it("should return the teams with the correct names", () => {
        getOpponentsNames.mockReturnValueOnce({ teamA: "Team 1", teamB: "Team 2" });

        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE,
          sportEvent: { ...SPORT_EVENT, openDate: "" },
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            teamA: { name: "Team 1" },
            teamB: { name: "Team 2" },
          }),
        );
      });
    });

    describe("when there are no opponentsNames", () => {
      it("should return the teams with empty object", () => {
        const getTableTennisFixtureViewModel = createTableTennisScoreboardByURNSelector();
        const tableTennisFixtureViewModel = getTableTennisFixtureViewModel({
          userDetails: USER_DETAILS,
          fixture: TABLE_TENNIS_FIXTURE,
          sportEvent: { ...SPORT_EVENT, openDate: "" },
        });

        expect(tableTennisFixtureViewModel).toEqual(
          expect.objectContaining({
            teamA: {},
            teamB: {},
          }),
        );
      });
    });
  });
});
