import { ExchangeMarketStatus } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { MatchStatus, ScoreStyle, TeamSide } from "@ppb/the-wall-common/types";
import { getOpponentsNames, getAmericanFormatScoreData } from "@ppb/tbd-store/helpers/fixture";

import { formatDateWithToday, formatTime } from "../helpers/dates";

import { createCricketFixtureViewModel } from "./cricket-fixture";

jest.mock("@ppb/tbd-store/helpers/fixture", () => ({
  getOpponentsNames: jest.fn(),
  getAmericanFormatScoreData: jest.fn(({ isAmericanFormat, ...props }) => props),
}));

jest.mock("../helpers/dates", () => ({
  formatDateWithToday: jest.fn(),
  formatTime: jest.fn(() => "21:00"),
}));

const USER_DETAILS = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

const SCORE_DATA_ZERO_RUNS = [
  {
    runs: 0,
    wickets: 0,
    inningNumber: 1,
  },
];

const SCORE_DATA_1_INNING = [
  {
    runs: 350,
    wickets: 0,
    inningNumber: 1,
  },
];

const SCORE_DATA_2_INNINGS = [
  {
    runs: 290,
    wickets: 6,
    inningNumber: 1,
  },
  {
    runs: 54,
    wickets: 2,
    inningNumber: 2,
  },
];

const CRICKET_FIXTURE_DEFAULT = {
  score: {},
  currentTeamBatting: undefined,
  currentTime: undefined,
  isAmericanFormat: false,
  runnerNames: { home: "home", away: "away" },
};

const CRICKET_FIXTURE_IN_PLAY_1 = {
  ...CRICKET_FIXTURE_DEFAULT,
  score: { home: SCORE_DATA_ZERO_RUNS, away: SCORE_DATA_1_INNING },
  currentTeamBatting: TeamSide.AWAY,
  currentTime: { inning: 1 },
};

const CRICKET_FIXTURE_IN_PLAY_2 = {
  ...CRICKET_FIXTURE_DEFAULT,
  score: { home: SCORE_DATA_2_INNINGS, away: SCORE_DATA_1_INNING },
  currentTeamBatting: TeamSide.HOME,
  currentTime: { inning: 2 },
};

const CRICKET_FIXTURE_IN_PLAY_3 = {
  ...CRICKET_FIXTURE_DEFAULT,
  score: { home: SCORE_DATA_1_INNING, away: SCORE_DATA_2_INNINGS },
  currentTeamBatting: TeamSide.AWAY,
  currentTime: { inning: 2 },
};

const CRICKET_FIXTURE_FULL_TIME = {
  ...CRICKET_FIXTURE_DEFAULT,
  score: { home: SCORE_DATA_1_INNING, away: SCORE_DATA_2_INNINGS },
};

const SPORT_EVENT = { name: "Team 1 v Team 2", openDate: "2000-02-11 21:00:00" };
const MARKET = { status: ExchangeMarketStatus.Open, inplay: true };

beforeEach(jest.clearAllMocks);

describe("createCricketFixtureViewModel", () => {
  describe("getDateInformation", () => {
    describe("when there is no openDate information on the sportevent", () => {
      it("should return date, dateTime and time as undefined", () => {
        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const cricketFixtureViewModel = getCricketFixtureViewModel({
          fixture: CRICKET_FIXTURE_DEFAULT,
          userDetails: USER_DETAILS,
          marketStatus: MARKET.status,
          marketInplay: MARKET.inplay,
          sportEvent: { ...SPORT_EVENT, openDate: undefined },
        });

        expect(cricketFixtureViewModel).toEqual(
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
          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: CRICKET_FIXTURE_DEFAULT,
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "I18N.DATE.TODAY",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getCricketFixtureViewModel = createCricketFixtureViewModel();
            getCricketFixtureViewModel({
              fixture: CRICKET_FIXTURE_DEFAULT,
              userDetails: USER_DETAILS,
              sportEvent: SPORT_EVENT,
              marketStatus: MARKET.status,
              marketInplay: MARKET.inplay,
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
          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: CRICKET_FIXTURE_DEFAULT,
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              date: "formatDate",
              dateTime: new Date("2000-02-11T21:00:00.000Z"),
              time: "21:00",
            }),
          );
        });

        describe("call functions", () => {
          beforeEach(() => {
            const getCricketFixtureViewModel = createCricketFixtureViewModel();
            getCricketFixtureViewModel({
              fixture: CRICKET_FIXTURE_DEFAULT,
              userDetails: USER_DETAILS,
              sportEvent: SPORT_EVENT,
              marketStatus: MARKET.status,
              marketInplay: MARKET.inplay,
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

  describe("formatCricketScoreData", () => {
    describe("when game is in play and home team has zero runs", () => {
      it("should return the correct score information", () => {
        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const cricketFixtureViewModel = getCricketFixtureViewModel({
          fixture: CRICKET_FIXTURE_IN_PLAY_1,
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          marketStatus: MARKET.status,
          marketInplay: MARKET.inplay,
        });

        expect(cricketFixtureViewModel).toEqual(
          expect.objectContaining({
            cricketScoreData: {
              teamATotalRuns: 0,
              teamBTotalRuns: 350,
              scoreData: [
                {
                  teamB: "350/0",
                  teamA: "-",
                  style: ScoreStyle.IN_PLAY,
                },
              ],
            },
          }),
        );
      });
    });

    describe("when game is in play and both teams have runs different than zero", () => {
      describe("and home team is batting first", () => {
        it("should return the correct score information", () => {
          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: CRICKET_FIXTURE_IN_PLAY_2,
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              cricketScoreData: {
                teamATotalRuns: 344,
                teamBTotalRuns: 350,
                scoreData: [
                  {
                    teamB: "350",
                    teamA: "290",
                    style: ScoreStyle.FINISHED,
                  },
                  {
                    teamB: "-",
                    teamA: "54/2",
                    style: ScoreStyle.IN_PLAY,
                  },
                ],
              },
            }),
          );
        });
      });
      describe("and away team is batting first", () => {
        it("should return the correct score information", () => {
          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: CRICKET_FIXTURE_IN_PLAY_3,
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              cricketScoreData: {
                teamATotalRuns: 350,
                teamBTotalRuns: 344,
                scoreData: [
                  {
                    teamB: "290",
                    teamA: "350",
                    style: ScoreStyle.FINISHED,
                  },
                  {
                    teamB: "54/2",
                    teamA: "-",
                    style: ScoreStyle.IN_PLAY,
                  },
                ],
              },
            }),
          );
        });
      });
    });

    describe("when game ends", () => {
      it("should return the correct score information", () => {
        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const cricketFixtureViewModel = getCricketFixtureViewModel({
          fixture: CRICKET_FIXTURE_FULL_TIME,
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          marketStatus: ExchangeMarketStatus.Closed,
          marketInplay: false,
        });

        expect(cricketFixtureViewModel).toEqual(
          expect.objectContaining({
            cricketScoreData: {
              teamATotalRuns: 350,
              teamBTotalRuns: 344,
              scoreData: [
                {
                  teamB: "290",
                  teamA: "350",
                  style: ScoreStyle.FINISHED,
                },
                {
                  teamB: "54",
                  teamA: "-",
                  style: ScoreStyle.FINISHED,
                },
              ],
            },
          }),
        );
      });
    });

    describe("when isAmericanFormat is true", () => {
      it("should return inverted score information", () => {
        getAmericanFormatScoreData.mockReturnValue({ teamA: "teamB score", teamB: "teamA score" });

        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const { cricketScoreData } = getCricketFixtureViewModel({
          fixture: { ...CRICKET_FIXTURE_IN_PLAY_1, isAmericanFormat: true },
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          marketStatus: MARKET.status,
          marketInplay: MARKET.inplay,
        });

        expect(cricketScoreData).toEqual({
          teamATotalRuns: 350,
          teamBTotalRuns: 0,
          scoreData: [{ teamA: "teamB score", teamB: "teamA score", style: ScoreStyle.IN_PLAY }],
        });
      });
    });
  });

  describe("getMatchState", () => {
    describe("when exchange market is closed", () => {
      it("should return match state as END", () => {
        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const cricketFixtureViewModel = getCricketFixtureViewModel({
          fixture: CRICKET_FIXTURE_FULL_TIME,
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          marketStatus: ExchangeMarketStatus.Closed,
          marketInplay: false,
        });

        expect(cricketFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: MatchStatus.END,
          }),
        );
      });
    });

    describe("when sportsbook market is closed", () => {
      it("should return match state as END", () => {
        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const cricketFixtureViewModel = getCricketFixtureViewModel({
          fixture: CRICKET_FIXTURE_FULL_TIME,
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          marketStatus: ExchangeMarketStatus.Closed,
          marketInplay: false,
        });

        expect(cricketFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: MatchStatus.END,
          }),
        );
      });
    });

    describe("when market is not in play and status is not closed and does not have score", () => {
      it("should return match state as PRE_MATCH", () => {
        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const cricketFixtureViewModel = getCricketFixtureViewModel({
          fixture: { ...CRICKET_FIXTURE_FULL_TIME, score: undefined },
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          marketStatus: ExchangeMarketStatus.Open,
          marketInplay: false,
        });

        expect(cricketFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: MatchStatus.PRE_MATCH,
          }),
        );
      });
    });

    describe("when match is not in play and status is not closed and have score", () => {
      it("should return match state as INPLAY", () => {
        const getCricketFixtureViewModel = createCricketFixtureViewModel();
        const cricketFixtureViewModel = getCricketFixtureViewModel({
          fixture: {
            ...CRICKET_FIXTURE_FULL_TIME,
            score: { away: [{ runs: 100, wickets: 2 }], home: [{ runs: 20, wickets: 0 }] },
          },
          userDetails: USER_DETAILS,
          sportEvent: SPORT_EVENT,
          marketStatus: ExchangeMarketStatus.Open,
          marketInplay: false,
        });

        expect(cricketFixtureViewModel).toEqual(
          expect.objectContaining({
            matchStatus: MatchStatus.IN_PLAY,
          }),
        );
      });
    });
  });

  describe("other props", () => {
    describe("teamServing", () => {
      describe("when the match status is INPLAY", () => {
        it("should return the team serving on the fixture", () => {
          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: { ...CRICKET_FIXTURE_DEFAULT, currentTeamBatting: TeamSide.HOME },
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              teamServing: TeamSide.HOME,
            }),
          );
        });
      });

      describe("when the match status is not INPLAY", () => {
        it("should return the team serving as undefined", () => {
          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: { ...CRICKET_FIXTURE_DEFAULT, score: undefined },
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              teamServing: undefined,
            }),
          );
        });
      });
    });

    describe("teams", () => {
      describe("when there are opponentsNames", () => {
        it("should return the teams with the correct names", () => {
          getOpponentsNames.mockReturnValueOnce({ teamA: "Team 1", teamB: "Team 2" });

          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: CRICKET_FIXTURE_DEFAULT,
            userDetails: USER_DETAILS,
            sportEvent: SPORT_EVENT,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              teamA: { name: "Team 1" },
              teamB: { name: "Team 2" },
            }),
          );
        });
      });

      describe("when there are no opponentsNames", () => {
        it("should return the teams with empty object", () => {
          const getCricketFixtureViewModel = createCricketFixtureViewModel();
          const cricketFixtureViewModel = getCricketFixtureViewModel({
            fixture: CRICKET_FIXTURE_DEFAULT,
            userDetails: USER_DETAILS,
            sportEvent: undefined,
            marketStatus: MARKET.status,
            marketInplay: MARKET.inplay,
          });

          expect(cricketFixtureViewModel).toEqual(
            expect.objectContaining({
              teamA: {},
              teamB: {},
            }),
          );
        });
      });
    });
  });
});
