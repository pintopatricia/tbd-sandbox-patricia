import { FallbackIconType } from "@ppb/the-wall-common/types";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { getSilkFallbackType } from "../../helpers/race";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

const getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN = jest.fn();
const getSportsbookMarketByURN = jest.fn();
const getSportByURN = jest.fn();
const getHorsePastPerformances = jest.fn();
const getThrottle = jest.fn().mockReturnValue({ isActive: false });

const userDetails = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

const getUserDetails = jest.fn(() => userDetails);

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: () => getThrottle,
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURNSelector: () =>
    getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN,
  createEntityByURNSelector: jest
    .fn()
    .mockImplementationOnce(() => getSportsbookMarketByURN)
    .mockImplementationOnce(() => getSportByURN),
}));

jest.mock("../../view-model-factories/horse-past-performances", () => ({
  createHorsePastPerformancesViewModel: () => getHorsePastPerformances,
}));
jest.mock("../../helpers/race", () => ({
  getSilkFallbackType: jest.fn(),
}));

const stateMock = {
  entities: {
    sportsbookmarkets: {},
    sportsbookrunners: {},
  },
};

const pastPerformances = [
  { course: "course 1", pos: "3" },
  { course: "course 2", pos: "7" },
  { course: "course 3", pos: "1" },
];

const horseRacingRunneri18nLabels = {
  age: "I18N.RACE_RUNNER.AGE",
  bred: "I18N.RACE_RUNNER.BRED",
  comment: "I18N.RACE_RUNNER.RUNNER_COMMENT",
  course: "I18N.RECENT_RACES.COURSE",
  date: "I18N.RECENT_RACES.DATE",
  distance: "I18N.RECENT_RACES.DISTANCE",
  equipment: "I18N.RACE_RUNNER.EQUIPMENT",
  going: "I18N.RECENT_RACES.GOING",
  graph: "I18N.MARKET_GRAPHS.GRAPH",
  officialRating: "I18N.RACE_RUNNER.OFFICIAL_RATING_ABBREVIATED",
  pedigree: "I18N.RACE_RUNNER.PEDIGREE",
  position: "I18N.RECENT_RACES.POS",
  type: "I18N.RECENT_RACES.TYPE",
  weight: "I18N.RACE_RUNNER.WEIGHT",
  jockey: "I18N.RACE_RUNNER.JOCKEY",
  trainer: "I18N.RACE_RUNNER.TRAINER",
  form: "I",
};

const sbkMarketMock = {
  urn: "ppb:sbkmarket:123",
  status: "OPEN",
  inplay: false,
  name: "fake sbk market",
  isOddsboostMarketType: false,
  hierarchy: {
    race: {},
    meeting: {},
  },
};
const sbkRunner = {
  urn: "valid:runner",
  status: "ACTIVE",
  name: "fake runner",
  handicap: 1,
};

const mapStateToProps = makeMapStateToProps();

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);
  describe("when there is no runner information", () => {
    it("should return empty", () => {
      getSportsbookMarketByURN.mockReturnValue(undefined);
      getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN.mockReturnValue(undefined);

      expect(mapStateToProps(stateMock, { market: { urn: "market" }, runner: { urn: "urn" } })).toEqual({});
    });
  });

  describe("when there's a runner and a market", () => {
    describe("and it is a HR market", () => {
      describe("when it is inplay", () => {
        it("should identify the market as an inplay HR market", () => {
          getSportsbookMarketByURN.mockReturnValue({
            ...sbkMarketMock,
            inplay: true,
          });
          getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN.mockReturnValue(sbkRunner);
          getHorsePastPerformances.mockReturnValue(pastPerformances);

          expect(mapStateToProps(stateMock, { market: { urn: "market" }, runner: { urn: "urn" } })).toEqual({
            marketName: "fake sbk market",
            marketStatus: "OPEN",
            isOddsboostMarketType: false,
            nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
            isMarketInplay: true,
            hasDefaultSilk: false,
            horsePastPerformances: [
              {
                course: "course 1",
                pos: "3",
              },
              {
                course: "course 2",
                pos: "7",
              },
              {
                course: "course 3",
                pos: "1",
              },
            ],
            horseRacingRunneri18nLabels,
            isRaceMarket: true,
            runner: {
              handicap: 1,
              name: "fake runner (+1)",
              status: "ACTIVE",
              urn: "valid:runner",
            },
            runnerViewLink: undefined,
            showTrapIcon: false,
          });

          expect(getUserDetails).toHaveBeenCalledWith(stateMock);
        });

        describe("and it is a oddsboost market type", () => {
          it("should return oddsboost market type as true", () => {
            getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN.mockReturnValue(sbkRunner);
            getHorsePastPerformances.mockReturnValue(pastPerformances);
            getSportsbookMarketByURN.mockReturnValue({
              ...sbkMarketMock,
              inplay: true,
              isOddsboostMarketType: true,
            });

            expect(mapStateToProps(stateMock, { market: { urn: "market" }, runner: { urn: "urn" } })).toEqual({
              marketName: "fake sbk market",
              marketStatus: "OPEN",
              nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
              isMarketInplay: true,
              isOddsboostMarketType: true,
              hasDefaultSilk: false,
              horsePastPerformances: [
                {
                  course: "course 1",
                  pos: "3",
                },
                {
                  course: "course 2",
                  pos: "7",
                },
                {
                  course: "course 3",
                  pos: "1",
                },
              ],
              horseRacingRunneri18nLabels,
              isRaceMarket: true,
              runner: {
                handicap: 1,
                name: "fake runner (+1)",
                status: "ACTIVE",
                urn: "valid:runner",
              },
              runnerViewLink: undefined,
              showTrapIcon: false,
            });

            expect(getUserDetails).toHaveBeenCalledWith(stateMock);
          });
        });

        describe("and there's rich content for the given horserace runner", () => {
          it("should return the rich content for the runner", () => {
            getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN.mockReturnValue({
              ...sbkRunner,
              selectionId: 12345,
              richContent: {
                horseRaceRunner: {
                  urn: "pp:racerunner:123",
                  details: {
                    jockeyName: "CEJAY GRAHAM",
                    trainerName: "PADDY CUNNINGHAM",
                  },
                  horse: {
                    damName: "ELEVATED CITY (USA)",
                    sireName: "CUNNINGHAM PARTY (AUS)",
                    pastPerformances,
                  },
                },
              },
            });
            getSportByURN.mockReturnValue({
              sportId: 7,
            });
            getSportsbookMarketByURN.mockReturnValue({
              ...sbkMarketMock,
              inplay: true,
            });

            expect(
              mapStateToProps(
                {
                  ...stateMock,
                  entities: {
                    ...stateMock.entities,
                    sports: {
                      hr: {
                        urn: "hr",
                        sportId: 7,
                      },
                    },
                  },
                },
                { market: { urn: "market", sport: "hr" }, runner: { urn: "urn" } },
              ),
            ).toEqual({
              isMarketInplay: true,
              isOddsboostMarketType: false,
              isRaceMarket: true,
              hasDefaultSilk: false,
              marketName: "fake sbk market",
              marketStatus: "OPEN",
              nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
              horsePastPerformances: [
                {
                  course: "course 1",
                  pos: "3",
                },
                {
                  course: "course 2",
                  pos: "7",
                },
                {
                  course: "course 3",
                  pos: "1",
                },
              ],
              horseRacingRunneri18nLabels,
              runner: {
                urn: "valid:runner",
                name: "fake runner (+1)",
                status: "ACTIVE",
                handicapLabel: undefined,
                resultType: undefined,
                selectionId: 12345,

                raceRunnerDetails: {
                  type: "HORSE",
                  raceRunner: {
                    urn: "pp:racerunner:123",
                    details: {
                      jockeyName: "Cejay Graham",
                      trainerName: "Paddy Cunningham",
                    },
                    horse: {
                      damName: "Elevated City (USA)",
                      sireName: "Cunningham Party (AUS)",
                      pastPerformances,
                    },
                  },
                },
                handicap: 1,
              },
              runnerViewLink: undefined,
              showTrapIcon: false,
            });
          });
        });
      });

      describe("when the fallback silk type is HorseRacing", () => {
        it("should return hasDefaultSilk as true", () => {
          getSportsbookMarketByURN.mockReturnValue({
            ...sbkMarketMock,
            sport: "sport:urn",
            inplay: true,
          });
          getSportByURN.mockReturnValue({
            sportId: 7,
          });
          getSilkFallbackType.mockReturnValue(FallbackIconType.HorseRacing);
          getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN.mockReturnValue(sbkRunner);
          getHorsePastPerformances.mockReturnValue(pastPerformances);

          expect(mapStateToProps(stateMock, { market: { urn: "market" }, runner: { urn: "urn" } })).toEqual(
            expect.objectContaining({ hasDefaultSilk: true }),
          );

          expect(getUserDetails).toHaveBeenCalledWith(stateMock);
        });
      });
      describe("and it has handicap", () => {
        it("should return runner name with handicap", () => {
          getSportsbookMarketByURN.mockReturnValue({
            ...sbkMarketMock,
            sport: "sport:urn",
            inplay: true,
          });
          getSportByURN.mockReturnValue({
            sportId: 8,
          });
          getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN.mockReturnValue(sbkRunner);

          expect(mapStateToProps(stateMock, { market: { urn: "market" }, runner: { urn: "urn" } })).toEqual(
            expect.objectContaining({
              marketName: "fake sbk market",
              nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
              marketStatus: "OPEN",
              runner: {
                urn: "valid:runner",
                handicap: 1,
                name: "fake runner (+1)",
                status: "ACTIVE",
              },
              runnerViewLink: undefined,
            }),
          );
        });
      });
    });
    describe("when it is a Greyound Market", () => {
      describe("and there's rich content for the given greyhoundracerunner", () => {
        it("should return the rich content for the runner", () => {
          getHorsePastPerformances.mockReturnValue([]);
          getSBKRunnerWithRichContentAndStatusByMarketAndRunnnerURN.mockReturnValue({
            ...sbkRunner,
            selectionId: 12345,
            richContent: {
              greyhoundRaceRunner: {
                urn: "pp:racerunner:123",
                trap: 5,
                meetingCountry: "GB",
              },
            },
          });
          getSportByURN.mockReturnValue({
            sportId: 4339,
          });
          getSportsbookMarketByURN.mockReturnValue({
            ...sbkMarketMock,
            sport: "sport:urn",
            inplay: true,
          });
          getThrottle.mockReturnValue({ isActive: true });
          getSilkFallbackType.mockReturnValue(false);

          expect(
            mapStateToProps(
              {
                ...stateMock,
                entities: {
                  ...stateMock.entities,
                  sports: {
                    ghr: {
                      urn: "ghr",
                      sportId: 4339,
                    },
                  },
                },
              },
              { market: { urn: "market", sport: "ghr" }, runner: { urn: "urn" } },
            ),
          ).toEqual({
            isMarketInplay: true,
            isOddsboostMarketType: false,
            isRaceMarket: true,
            hasDefaultSilk: false,
            marketName: "fake sbk market",
            marketStatus: "OPEN",
            nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
            horseRacingRunneri18nLabels,
            horsePastPerformances: [],
            runner: {
              urn: "valid:runner",
              name: "fake runner (+1)",
              status: "ACTIVE",
              handicapLabel: undefined,
              resultType: undefined,
              selectionId: 12345,

              raceRunnerDetails: {
                type: "GREYHOUND",
                raceRunner: {
                  urn: "pp:racerunner:123",
                  trap: 5,
                  meetingCountry: "GB",
                },
              },
              handicap: 1,
            },
            runnerViewLink: undefined,
            showTrapIcon: true,
          });
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchFetchCatalogue", () => {
    it("should return the correct action creator", () => {
      const { dispatchFetchCatalogue } = mapDispatchToProps;

      expect(dispatchFetchCatalogue("urn")).toEqual({
        payload: { urn: "urn" },
        type: "FETCH_CATALOGUE",
      });
    });
  });

  describe("dispatchToggleRunnerInfo", () => {
    it("should return the correct action creator", () => {
      const { dispatchToggleRunnerInfo } = mapDispatchToProps;

      expect(dispatchToggleRunnerInfo("marketName", "runnerName", false)).toEqual({
        payload: {
          isOpening: false,
          marketName: "marketName",
          runnerName: "runnerName",
        },
        type: "UI__TOGGLE_RUNNER_INFO",
      });
    });
  });

  describe("dispatchDeleteView", () => {
    it("should return the correct action creator", () => {
      const { dispatchDeleteView } = mapDispatchToProps;

      expect(dispatchDeleteView("urn")).toEqual({
        payload: "urn",
        type: "DELETE_VIEW",
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("should return the correct action creator", () => {
      const { dispatchPushAction } = mapDispatchToProps;

      expect(dispatchPushAction({ viewUrn: "viewUrn", viewUrl: "viewUrl" })).toEqual({
        payload: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
        type: PUSH,
      });
    });
  });

  describe("dispatchToggleRecentRaces", () => {
    it("should return the correct action creator", () => {
      const { dispatchToggleRecentRaces } = mapDispatchToProps;

      expect(dispatchToggleRecentRaces("runnerName", "cardUrn", true)).toEqual({
        payload: {
          runnerName: "runnerName",
          cardUrn: "cardUrn",
          isClosed: true,
        },
        type: "UI__RECENT_RACE_TOGGLE",
      });
    });
  });

  describe("dispatchNavigateToView", () => {
    it("should return the correct action creator", () => {
      const { dispatchNavigateToView } = mapDispatchToProps;

      expect(dispatchNavigateToView("viewUrl", "cardUrn", "runnerName")).toEqual({
        payload: {
          url: "viewUrl",
          cardURN: "cardUrn",
          label: "runnerName",
          module: "primary swimlane",
        },
        type: "UI__NAVIGATE_TO_VIEW",
      });
    });
  });

  describe("dispatchToggleRaceReplays", () => {
    it("should return the correct action creator", () => {
      const { dispatchToggleRaceReplays } = mapDispatchToProps;

      expect(dispatchToggleRaceReplays("runnerName", true, "cardUrn")).toEqual({
        payload: {
          selection: "runnerName",
          isClosed: true,
          cardUrn: "cardUrn",
        },
        type: "UI__RACE_REPLAYS_TOGGLE",
      });
    });
  });

  describe("dispatchRaceReplaysMediaPlayerLoaded", () => {
    it("should return the correct action creator", () => {
      const { dispatchRaceReplaysMediaPlayerLoaded } = mapDispatchToProps;

      expect(dispatchRaceReplaysMediaPlayerLoaded("marketUrn")).toEqual({
        payload: {
          marketUrn: "marketUrn",
        },
        type: "UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED",
      });
    });
  });
});
