import {
  getRaceRunnerDetails,
  isRaceHierarchy,
  getMarketRunnersByDisplayRunners,
} from "@ppb/tbd-store/helpers/markets";
import { getSportsbookBettingState } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getSportsbookMarket,
  getSportsbookMarketRunners,
} from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  createRunnersForSportsbookMarketSelector,
  makeMapStateToProps,
  mapDispatchToProps,
} from "./map-to-props-factory";
import { formatHandicap, formatRunnerName } from "../../formatters/runner-formatters";
import {
  extractFootballPlayerRunnerContext,
  getPlayerStatValue,
} from "../FootballRunner/helpers/FootballRunnerHelpers";

const getRaceWithRunnersByURN = jest.fn(() => ({ race: {}, raceRunners: {} }));

const getRunnersStatus = jest.fn(() => [
  {
    urn: "sbkRunner:12345/1",
    market: "ppb:sbkMarket:12345",
    selectionId: 12345,
    status: "ACTIVE",
  },
  {
    urn: "sbkRunner:12345/2",
    market: "ppb:sbkMarket:12345",
    selectionId: 54321,
    status: "ACTIVE",
  },
]);

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createRaceWithRunnersByURNSelector: () => getRaceWithRunnersByURN,
  createFootballFixtureByURNSelector: jest.fn(() => jest.fn()),
  createFootballPlayerFixtureContextByURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../../formatters/runner-formatters", () => ({
  formatRunnerName: jest.fn((key) => key),
  formatHandicap: jest.fn(() => ""),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  getPreferences: () => ({
    sportsbookOddsDisplay: "DECIMAL",
  }),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookBettingState: jest.fn(() => ({
    legs: {
      validLeg: "foo",
    },
    isBonusSelected: "isBonusSelected",
  })),
}));

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(() => {}),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/tbd-store/helpers/markets", () => ({
  getRaceRunnerDetails: jest.fn(() => {}),
  isRaceHierarchy: jest.fn(() => false),
  getMarketRunnersByDisplayRunners: jest.fn(() => [
    {
      handicap: 0,
      name: "Team A",
      selectionId: 12345,
      urn: "sbkRunner:12345/1",
    },
    {
      handicap: 0,
      name: "Team B",
      selectionId: 54321,
      urn: "sbkRunner:12345/2",
    },
    {
      handicap: 0,
      name: "Non Runner",
      selectionId: 123456789,
      urn: "sbkRunner:12345/3",
    },
  ]),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookRunnersByMarketURNSelector: () => getRunnersStatus,
  getSportsbookMarket: jest.fn(() => {}),
  getSportsbookMarketRunners: jest.fn(() => [
    {
      handicap: 0,
      name: "Non Runner",
      selectionId: 123456789,
      urn: "sbkRunner:12345/3",
    },
    {
      handicap: 0,
      name: "Team B",
      selectionId: 54321,
      urn: "sbkRunner:12345/2",
    },
    {
      handicap: 0,
      name: "Team A",
      selectionId: 12345,
      urn: "sbkRunner:12345/1",
    },
  ]),
  isLegInState: jest.fn().mockReturnValue(false),
}));

jest.mock("@ppb/tbd-store/state/application-state-selectors", () => ({
  createGetRunnerViewTitlesFromRunnerViewLinksSelector: jest.fn(() => () => ({
    "ppb:tbd:view:runner:6": "Additional Information",
  })),
}));

jest.mock("../FootballRunner/helpers/FootballRunnerHelpers", () => ({
  extractFootballPlayerRunnerContext: jest.fn(() => ({
    jerseys: null,
    playerHomeAwayMap: null,
    playerStats: null,
  })),
  getPlayerStatValue: jest.fn(() => undefined),
  getRunnerJersey: jest.fn(() => ({ jerseyUrl: undefined, useFallbackJersey: false })),
  STAT_LABEL_I18N_KEY: { TOTAL_YELLOW_RED_CARDS: "I18N.IN_LINE_STATS_TOTAL_CARDS" },
}));

const marketUrn = "ppb:sbkMarket:12345";

describe("createRunnersForSportsbookMarketSelector", () => {
  beforeEach(jest.clearAllMocks);

  describe("when is called one time", () => {
    it("should return a new object with the market runners", () => {
      formatOdds.mockReturnValueOnce("9").mockReturnValueOnce("2.88");
      getRunnersStatus.mockReturnValueOnce([
        {
          urn: "sbkRunner:12345/1",
          market: "ppb:sbkMarket:12345",
          selectionId: 12345,
        },
        {
          urn: "sbkRunner:12345/2",
          market: "ppb:sbkMarket:12345",
          selectionId: 54321,
        },
      ]);
      const getRunnersForSportsbookMarket = createRunnersForSportsbookMarketSelector();
      const runners = getRunnersForSportsbookMarket(
        { entities: { races: {} } },
        { urn: marketUrn, displayRunnersUrns: [] },
      );

      expect(runners).toStrictEqual([
        {
          name: "Team A",
          handicap: 0,
          handicapLabel: "",
          urn: "sbkRunner:12345/1",
        },
        {
          name: "Team B",
          handicap: 0,
          handicapLabel: "",
          urn: "sbkRunner:12345/2",
        },
        {
          handicap: 0,
          handicapLabel: "",
          name: "Non Runner",
          urn: "sbkRunner:12345/3",
        },
      ]);
    });
  });

  describe("when is called two times without any runner updates", () => {
    it("should return the same object in the second call", () => {
      const getRunnersForSportsbookMarket = createRunnersForSportsbookMarketSelector();
      const theState = { entities: { races: {} } };
      const runners = getRunnersForSportsbookMarket(theState, marketUrn);
      const runners2 = getRunnersForSportsbookMarket(theState, marketUrn);

      expect(runners === runners2).toBe(true);
    });
  });

  describe("when is called two times and is added a new runner to the market", () => {
    let runners;
    let runners2;
    beforeEach(() => {
      formatOdds
        // old state
        .mockReturnValueOnce("9")
        .mockReturnValueOnce("2.88")
        // new state
        .mockReturnValueOnce("9")
        .mockReturnValueOnce("2.88")
        .mockReturnValueOnce("15");
      getRunnersStatus.mockReturnValue([
        {
          urn: "sbkRunner:12345/1",
          market: "ppb:sbkMarket:12345",
          selectionId: 12345,
          odds: {
            decimal: 9,
            fractional: {
              numerator: 8,
              denominator: 1,
            },
          },
          status: "ACTIVE",
        },
        {
          urn: "sbkRunner:12345/2",
          market: "ppb:sbkMarket:12345",
          selectionId: 54321,
          odds: {
            decimal: 2.88,
            fractional: {
              numerator: 15,
              denominator: 8,
            },
          },
          status: "ACTIVE",
        },
        {
          urn: "sbkRunner:12345/3",
          market: "ppb:sbkMarket:12345",
          selectionId: 32451,
          odds: {
            decimal: 15,
            fractional: {
              numerator: 14,
              denominator: 1,
            },
          },
          status: "ACTIVE",
        },
      ]);
      getSportsbookMarketRunners
        .mockReturnValueOnce([
          {
            handicap: 0,
            name: "Team B",
            selectionId: 54321,
            urn: "sbkRunner:12345/2",
            status: "ACTIVE",
          },
          {
            handicap: 0,
            name: "Team A",
            selectionId: 12345,
            urn: "sbkRunner:12345/1",
            status: "ACTIVE",
          },
        ])
        .mockReturnValueOnce([
          {
            handicap: 0,
            name: "Team B",
            selectionId: 54321,
            urn: "sbkRunner:12345/2",
            status: "ACTIVE",
          },
          {
            handicap: 0,
            name: "Team A",
            selectionId: 12345,
            urn: "sbkRunner:12345/1",
            status: "ACTIVE",
          },
          {
            handicap: 0,
            name: "Team C",
            selectionId: 32451,
            urn: "sbkRunner:12345/3",
            status: "ACTIVE",
          },
        ]);
      getMarketRunnersByDisplayRunners
        .mockReturnValueOnce([
          {
            handicap: 0,
            name: "Team A",
            selectionId: 12345,
            urn: "sbkRunner:12345/1",
            status: "ACTIVE",
          },
          {
            handicap: 0,
            name: "Team B",
            selectionId: 54321,
            urn: "sbkRunner:12345/2",
            status: "ACTIVE",
          },
        ])
        .mockReturnValueOnce([
          {
            handicap: 0,
            name: "Team A",
            selectionId: 12345,
            urn: "sbkRunner:12345/1",
            status: "ACTIVE",
          },
          {
            handicap: 0,
            name: "Team B",
            selectionId: 54321,
            urn: "sbkRunner:12345/2",
            status: "ACTIVE",
          },
          {
            handicap: 0,
            name: "Team C",
            selectionId: 32451,
            urn: "sbkRunner:12345/3",
            status: "ACTIVE",
          },
        ]);
      const getRunnersForSportsbookMarket = createRunnersForSportsbookMarketSelector();

      runners = getRunnersForSportsbookMarket({ entities: { races: {} } }, marketUrn);
      runners2 = getRunnersForSportsbookMarket({ entities: { races: {} } }, marketUrn);
    });

    it("shouldn't return the same object in the second call", () => {
      expect(runners === runners2).toBe(false);
    });

    it("should return the market runners with the new one", () => {
      expect(runners2).toStrictEqual([
        {
          name: "Team A",
          handicap: 0,
          handicapLabel: "",
          urn: "sbkRunner:12345/1",
        },
        {
          name: "Team B",
          handicap: 0,
          handicapLabel: "",
          urn: "sbkRunner:12345/2",
        },
        {
          name: "Team C",
          handicap: 0,
          handicapLabel: "",
          urn: "sbkRunner:12345/3",
        },
      ]);
    });
  });

  describe("when is called two times and a price changes", () => {
    let runners;
    let runners2;
    beforeEach(() => {
      formatOdds
        // old state
        .mockReturnValueOnce("9")
        .mockReturnValueOnce("2.88")
        // new state
        .mockReturnValueOnce("9")
        .mockReturnValueOnce("2.2");
      getRunnersStatus
        .mockReturnValueOnce([
          {
            urn: "sbkRunner:12345/1",
            market: "ppb:sbkMarket:12345",
            selectionId: 12345,
            odds: {
              decimal: 9,
              fractional: {
                numerator: 8,
                denominator: 1,
              },
            },
            status: "ACTIVE",
          },
          {
            urn: "sbkRunner:12345/2",
            market: "ppb:sbkMarket:12345",
            selectionId: 54321,
            odds: {
              decimal: 2.88,
              fractional: {
                numerator: 15,
                denominator: 8,
              },
            },
            status: "ACTIVE",
          },
        ])
        .mockReturnValueOnce([
          {
            urn: "sbkRunner:12345/1",
            market: "ppb:sbkMarket:12345",
            selectionId: 12345,
            odds: {
              decimal: 9,
              fractional: {
                numerator: 8,
                denominator: 1,
              },
            },
            status: "ACTIVE",
          },
          {
            urn: "sbkRunner:12345/2",
            market: "ppb:sbkMarket:12345",
            selectionId: 54321,
            odds: {
              decimal: 2.2,
              fractional: {
                numerator: 15,
                denominator: 8,
              },
            },
            status: "ACTIVE",
          },
        ]);
      getSportsbookMarketRunners
        .mockReturnValueOnce([
          {
            handicap: 0,
            name: "Team A",
            selectionId: 12345,
            urn: "sbkRunner:12345/1",
          },
          {
            handicap: 0,
            name: "Team B",
            selectionId: 54321,
            urn: "sbkRunner:12345/2",
          },
        ])
        .mockReturnValueOnce([
          {
            handicap: 0,
            name: "Team A",
            selectionId: 12345,
            urn: "sbkRunner:12345/1",
          },
          {
            handicap: 0,
            name: "Team B",
            selectionId: 54321,
            urn: "sbkRunner:12345/2",
          },
        ]);
      const getRunnersForSportsbookMarket = createRunnersForSportsbookMarketSelector();

      runners = getRunnersForSportsbookMarket({ entities: { races: {} } }, marketUrn);
      runners2 = getRunnersForSportsbookMarket({ entities: { races: {} } }, marketUrn);
    });

    it("shouldn't return the same object in the second call", () => {
      expect(runners === runners2).toBe(false);
    });
  });

  describe("when runner is a race runner", () => {
    function setupRaceRunner({ runnerHasOdds = true } = {}) {
      getRaceWithRunnersByURN.mockReturnValue({
        race: {
          urn: "raceURN",
          meeting: "meetingURN",
          name: "raceName",
          runners: [],
        },
        raceRunners: {},
      });
      formatOdds.mockReturnValue("2.88");
      getRunnersStatus.mockReturnValue([
        {
          urn: "sbkRunner:12345/1",
          market: "ppb:sbkMarket:12345",
          selectionId: 12345,
          odds: {
            decimal: 2.88,
            fractional: {
              numerator: 15,
              denominator: 8,
            },
          },
          status: "ACTIVE",
        },
        {
          urn: "sbkRunner:12345/2",
          market: "ppb:sbkMarket:12345",
          selectionId: 54321,
          odds: runnerHasOdds
            ? {
                decimal: 2.88,
                fractional: {
                  numerator: 15,
                  denominator: 8,
                },
              }
            : undefined,
          status: "ACTIVE",
        },
        {
          urn: "sbkRunner:12345/3",
          market: "ppb:sbkMarket:12345",
          selectionId: 123456789,
          status: "REMOVED",
          odds: {
            decimal: 2.88,
            fractional: {
              numerator: 15,
              denominator: 8,
            },
          },
        },
      ]);
      getRaceRunnerDetails
        .mockReturnValueOnce({
          isRaceRunner: true,
          horseName: "Horse Name",
          jockeyName: "jockey Name",
          trainerName: "trainer Name",
          saddleCloth: 8,
          silk: "silk url",
          draw: 88,
        })
        .mockReturnValueOnce({
          isRaceRunner: true,
          horseName: "Horse Name 2",
          jockeyName: "jockey Name 2",
          trainerName: "trainer Name 2",
          saddleCloth: 9,
          silk: "silk url 2",
          draw: 99,
        });

      return createRunnersForSportsbookMarketSelector();
    }

    it("should return race properties", () => {
      const getRunnersForSportsbookMarket = setupRaceRunner();
      const runners = getRunnersForSportsbookMarket(
        { entities: { races: {} } },
        { urn: marketUrn, raceUrn: "raceUrn" },
      );
      expect(runners).toStrictEqual([
        expect.objectContaining({
          handicap: 0,
          handicapLabel: "",
          name: "Team A",
          urn: "sbkRunner:12345/1",
        }),
        expect.objectContaining({
          handicap: 0,
          handicapLabel: "",
          name: "Team B",
          urn: "sbkRunner:12345/2",
        }),
        expect.objectContaining({
          handicap: 0,
          handicapLabel: "",
          name: "Non Runner",
          urn: "sbkRunner:12345/3",
        }),
      ]);
    });
  });

  describe("when market is MOVING_HANDICAP", () => {
    describe("and the inline is true", () => {
      it("should return runner names without handicaps", () => {
        // Make the mock return `(+5.5)` for the first call and (-5.5) for the second call
        formatHandicap.mockReturnValueOnce("(+5.5)").mockReturnValueOnce("(-5.5)");

        getMarketRunnersByDisplayRunners.mockReturnValueOnce([
          {
            handicap: 5.5,
            name: "Team A",
            selectionId: 12345,
            urn: "sbkRunner:12345/1",
          },
          {
            handicap: -5.5,
            name: "Team B",
            selectionId: 54321,
            urn: "sbkRunner:12345/2",
          },
        ]);

        const getRunnersForSportsbookMarket = createRunnersForSportsbookMarketSelector();

        const runners = getRunnersForSportsbookMarket(
          { entities: { races: {} } },
          { urn: marketUrn, displayRunnersUrns: [], inline: true },
        );

        expect(formatRunnerName).not.toHaveBeenCalled();

        expect(formatHandicap).toHaveBeenCalledTimes(2);
        expect(formatHandicap).toHaveBeenNthCalledWith(1, 5.5, false);
        expect(formatHandicap).toHaveBeenNthCalledWith(2, -5.5, false);

        expect(runners[0].name).toEqual("Team A");
        expect(runners[1].name).toEqual("Team B");

        expect(runners[0].handicapLabel).toEqual("(+5.5)");
        expect(runners[1].handicapLabel).toEqual("(-5.5)");
      });
    });
  });
});

describe("makeMapStateToProps", () => {
  let mapStateToProps;

  const runner = {
    name: "Jasmine Paolini",
    urn: "ppb:sbkRunner:924.204298740/8944356",
    market: "ppb:sbkMarket:924.204298740",
    selectionId: 8944356,
    status: "ACTIVE",
    odds: {
      decimal: 1.11,
      fractional: {
        numerator: 1,
        denominator: 9,
      },
    },
  };

  beforeEach(() => {
    const runners = [
      {
        urn: "runner:1",
      },
      {
        urn: "runner:2",
      },
      {
        urn: "runner:3",
      },
      {
        urn: "runner:4",
      },
      {
        urn: "runner:5",
      },
      {
        urn: "runner:6",
      },
    ];
    getSportsbookMarket.mockReturnValue({
      marketId: "924.204298740",
      status: "OPEN",
      marketType: "MATCH_ODDS",
      [marketUrn]: {
        runners,
      },
    });
    getSportsbookMarketRunners.mockReturnValue(runners);
  });

  describe("when numberOfRunners is passed as 3", () => {
    let result;
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should slice the runners to only 3", () => {
      mapStateToProps = makeMapStateToProps();
      result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          numberOfRunnersToDisplay: 3,
        },
      );
      expect(result.runners.length).toEqual(3);
    });
  });

  describe("when displayRunners is not provided", () => {
    let result;
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should not slice the runners, returning the entire set", () => {
      getMarketRunnersByDisplayRunners.mockReturnValueOnce([
        {
          urn: "runner:1",
        },
        {
          urn: "runner:2",
        },
        {
          urn: "runner:3",
        },
        {
          urn: "runner:4",
        },
        {
          urn: "runner:5",
        },
        {
          urn: "runner:6",
        },
      ]);
      mapStateToProps = makeMapStateToProps();
      result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          displayRunnersUrns: [],
        },
      );

      expect(result.runners.length).toEqual(6);
    });
  });

  describe("when the market is inplay", () => {
    describe("and is a racing market", () => {
      it("shouldn't return EachWay terms in infoBlurbs", () => {
        isRaceHierarchy.mockReturnValueOnce(true);
        getSportsbookMarket.mockReturnValueOnce({
          marketId: "924.204298740",
          status: "OPEN",
          guaranteedPriceAvailable: true,
          eachWayAvailable: true,
          eachWayPlaceFraction: {
            numerator: 1,
            denominator: 3,
          },
          eachWayPlaces: 2,
          inplay: true,
          marketType: "MATCH_ODDS",
          hierarchy: { race: "" },
        });
        getSportsbookMarketRunners.mockReturnValueOnce([]);
        getMarketRunnersByDisplayRunners.mockReturnValueOnce([]);
        mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(
          { entities: { races: {} } },
          { urn: "ppb:sbkMarket:924.204298740", cardUrn: "cardUrn", displayRunnersUrns: [] },
        );

        expect(getSportsbookBettingState).toHaveBeenCalledWith({ entities: { races: {} } });

        expect(result).toEqual({
          cardUrn: "cardUrn",
          marketId: "924.204298740",
          status: "OPEN",
          guaranteedPriceAvailable: false,
          runners: [],
          isBonusSelected: "isBonusSelected",
          i18n: {
            suspended: "I18N.MARKET.SUSPENDED",
            closed: "I18N.MARKET.CLOSED",
            bog: "I18N.LABELS.BOG_ON_SINGLES",
            nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
            azSwitcher: "I18N.ALPHABETICAL_SORTING_SWITCHER",
          },
          infoBlurbs: [],
          marketUrn: undefined,
          runnerViewsTitles: undefined,
          isShowMoreAvailable: undefined,
          isItemsListCollapsed: undefined,
          numberOfItemsToDisplay: undefined,
        });
      });
    });

    describe("and is not a racing market", () => {
      it("should include EachWay terms in infoBlurbs", () => {
        isRaceHierarchy.mockReturnValueOnce(false);
        getSportsbookMarket.mockReturnValueOnce({
          marketId: "924.204298740",
          status: "OPEN",
          guaranteedPriceAvailable: true,
          eachWayAvailable: true,
          eachWayPlaceFraction: {
            numerator: 1,
            denominator: 3,
          },
          eachWayPlaces: 2,
          inplay: true,
          marketType: "MATCH_ODDS",
        });
        getSportsbookMarketRunners.mockReturnValueOnce([]);
        getMarketRunnersByDisplayRunners.mockReturnValueOnce([]);
        mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(
          { entities: { races: {} } },
          { urn: "ppb:sbkMarket:924.204298740", cardUrn: "cardUrn", displayRunnersUrns: [] },
        );

        expect(getSportsbookBettingState).toHaveBeenCalledWith({ entities: { races: {} } });

        expect(result).toEqual({
          cardUrn: "cardUrn",
          marketId: "924.204298740",
          status: "OPEN",
          guaranteedPriceAvailable: false,
          runners: [],
          isBonusSelected: "isBonusSelected",
          i18n: {
            suspended: "I18N.MARKET.SUSPENDED",
            closed: "I18N.MARKET.CLOSED",
            bog: "I18N.LABELS.BOG_ON_SINGLES",
            nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
            azSwitcher: "I18N.ALPHABETICAL_SORTING_SWITCHER",
          },
          infoBlurbs: [
            {
              title: "I18N.LABELS.EW_TERMS",
              signposting: "MARKET_RULES",
            },
          ],
          marketUrn: undefined,
          runnerViewsTitles: undefined,
          isShowMoreAvailable: undefined,
          isItemsListCollapsed: undefined,
          numberOfItemsToDisplay: undefined,
        });
      });
    });
  });

  describe("when the market is not inplay", () => {
    it("should include EachWay terms in infoBlurbs if the props are defined", () => {
      getSportsbookMarket.mockReturnValueOnce({
        marketId: "924.204298740",
        status: "OPEN",
        guaranteedPriceAvailable: true,
        eachWayAvailable: true,
        eachWayPlaceFraction: {
          numerator: 1,
          denominator: 3,
        },
        eachWayPlaces: 2,
        inplay: false,
        marketType: "MATCH_ODDS",
      });
      getSportsbookMarketRunners.mockReturnValueOnce([]);
      getMarketRunnersByDisplayRunners.mockReturnValueOnce([]);

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        { entities: { races: {} } },
        { urn: "ppb:sbkMarket:924.204298740", cardUrn: "cardUrn", displayRunnersUrns: [] },
      );

      expect(getSportsbookBettingState).toHaveBeenCalledWith({ entities: { races: {} } });

      expect(result).toEqual({
        cardUrn: "cardUrn",
        marketId: "924.204298740",
        status: "OPEN",
        guaranteedPriceAvailable: true,
        runners: [],
        isBonusSelected: "isBonusSelected",
        i18n: {
          suspended: "I18N.MARKET.SUSPENDED",
          closed: "I18N.MARKET.CLOSED",
          bog: "I18N.LABELS.BOG_ON_SINGLES",
          nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
          azSwitcher: "I18N.ALPHABETICAL_SORTING_SWITCHER",
        },
        infoBlurbs: [
          {
            title: "I18N.LABELS.EW_TERMS",
            signposting: "MARKET_RULES",
          },
        ],
        marketUrn: undefined,
        runnerViewsTitles: undefined,
        isShowMoreAvailable: undefined,
        isItemsListCollapsed: undefined,
        numberOfItemsToDisplay: undefined,
      });
    });

    it("should return the Bog and EachWay Label accordingly if the props are not defined", () => {
      formatOdds.mockReturnValueOnce("1.11");
      getSportsbookMarket.mockReturnValueOnce({
        marketId: "924.204298740",
        status: "OPEN",
        guaranteedPriceAvailable: undefined,
        eachWayAvailable: undefined,
        inplay: false,
        marketType: "MATCH_ODDS",
        [marketUrn]: {
          runners: [],
        },
      });
      getSportsbookMarketRunners.mockReturnValueOnce([]);
      getMarketRunnersByDisplayRunners.mockReturnValueOnce([]);

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        { entities: { races: {} } },
        { urn: "ppb:sbkMarket:924.204298740", cardUrn: "cardUrn" },
      );

      expect(getSportsbookBettingState).toHaveBeenCalledWith({ entities: { races: {} } });

      expect(result).toEqual({
        cardUrn: "cardUrn",
        marketId: "924.204298740",
        status: "OPEN",
        guaranteedPriceAvailable: false,
        runners: [],
        isBonusSelected: "isBonusSelected",
        runnerViewsTitles: undefined,
        i18n: {
          suspended: "I18N.MARKET.SUSPENDED",
          closed: "I18N.MARKET.CLOSED",
          bog: "I18N.LABELS.BOG_ON_SINGLES",
          nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
          azSwitcher: "I18N.ALPHABETICAL_SORTING_SWITCHER",
        },
        infoBlurbs: [],
        marketUrn: undefined,
        isShowMoreAvailable: undefined,
        isItemsListCollapsed: undefined,
        numberOfItemsToDisplay: undefined,
      });
    });
  });

  it("should return a model with marketId and market view model", () => {
    formatOdds.mockReturnValueOnce("1.11");
    getRaceWithRunnersByURN.mockReturnValue({ race: undefined, raceRunners: undefined });
    getRunnersStatus.mockReturnValueOnce([runner]);
    getSportsbookMarket.mockReturnValueOnce({
      urn: "ppb:sbkMarket:924.204298740",
      marketId: "924.204298740",
      status: "OPEN",
      marketType: "MATCH_ODDS",
      inplay: false,
      [marketUrn]: {
        runners: [
          {
            urn: "ppb:sbkRunner:924.204298740/8944356",
            selectionId: 8944356,
            marketId: "924.204298740",
            name: "Jasmine Paolini",
            handicap: 0,
            handicapLabel: "",
          },
        ],
      },
    });
    getSportsbookMarketRunners.mockReturnValueOnce([runner]);
    getMarketRunnersByDisplayRunners.mockReturnValueOnce([
      {
        urn: "ppb:sbkRunner:924.204298740/8944356",
        selectionId: 8944356,
        marketId: "924.204298740",
        name: "Jasmine Paolini",
        handicap: 0,
        handicapLabel: "",
      },
    ]);
    mapStateToProps = makeMapStateToProps();
    const result = mapStateToProps(
      { entities: { races: {} } },
      { urn: "ppb:sbkMarket:924.204298740", cardUrn: "cardUrn" },
    );

    expect(getSportsbookBettingState).toHaveBeenCalledWith({ entities: { races: {} } });

    expect(result).toEqual({
      cardUrn: "cardUrn",
      marketUrn: "ppb:sbkMarket:924.204298740",
      marketId: "924.204298740",
      status: "OPEN",
      runnerViewsTitles: undefined,
      runners: [
        {
          urn: "ppb:sbkRunner:924.204298740/8944356",
          name: "Jasmine Paolini",
          handicap: 0,
          handicapLabel: "",
          jerseyUrl: undefined,
          useFallbackJersey: false,
        },
      ],
      isBonusSelected: "isBonusSelected",
      guaranteedPriceAvailable: false,
      i18n: {
        suspended: "I18N.MARKET.SUSPENDED",
        closed: "I18N.MARKET.CLOSED",
        bog: "I18N.LABELS.BOG_ON_SINGLES",
        nonRunnerTitle: "I18N.NON_RUNNER.TITLE",
        azSwitcher: "I18N.ALPHABETICAL_SORTING_SWITCHER",
      },
      infoBlurbs: [],
      isShowMoreAvailable: undefined,
      isItemsListCollapsed: undefined,
      numberOfItemsToDisplay: undefined,
    });
  });

  it("should return view model with runnerViewsTitles", () => {
    mapStateToProps = makeMapStateToProps();

    const runnerViewLinks = {
      "runner:6": {
        runnerUrn: "runner:6",
        viewUrl: "Not Implemented",
        viewUrn: "ppb:tbd:view:runner:6",
      },
    };
    const result = mapStateToProps(
      {
        entities: { races: {} },
        layouts: { views: { runner: {} } },
      },
      { urn: "ppb:sbkMarket:924.204298740", runnerViewLinks },
    );

    expect(result.runnerViewsTitles).toEqual({
      "ppb:tbd:view:runner:6": "Additional Information",
    });
  });

  describe("and when the props isShowMoreAvailable and isItemsListCollapsed are defined", () => {
    it("should pass down those props to the component", () => {
      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          isShowMoreAvailable: true,
          isItemsListCollapsed: false,
        },
      );

      expect(result.isShowMoreAvailable).toEqual(true);
      expect(result.isItemsListCollapsed).toEqual(false);
    });
  });

  describe("when infoBlurbs and marketPromo are provided", () => {
    it("should pass down those props to the component", () => {
      mapStateToProps = makeMapStateToProps();
      const marketPromo = { title: "Promo Title", description: "Promo Description" };
      const infoBlurbs = [
        { title: "Info Blurb 1", description: "Info Description 1" },
        { title: "Info Blurb 2", description: "Info Description 2" },
      ];

      getSportsbookMarket.mockReturnValueOnce({
        urn: "ppb:sbkMarket:924.204298740",
        marketId: "924.204298740",
        status: "OPEN",
      });

      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          marketPromo,
          infoBlurbs,
          displayRunnersUrns: [],
        },
      );

      expect(result).toEqual(
        expect.objectContaining({
          cardUrn: "cardUrn",
          marketId: "924.204298740",
          status: "OPEN",
          runners: expect.any(Array),
        }),
      );
    });
  });

  describe("when onLinkClick and onMarketPromoClick are provided", () => {
    it("should accept the callback props without errors", () => {
      mapStateToProps = makeMapStateToProps();
      const onMarketPromoClick = jest.fn();
      const onLinkClick = jest.fn();

      getSportsbookMarket.mockReturnValueOnce({
        urn: "ppb:sbkMarket:924.204298740",
        marketId: "924.204298740",
        status: "OPEN",
      });

      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          onMarketPromoClick,
          onLinkClick,
          displayRunnersUrns: [],
        },
      );

      expect(result).toEqual(
        expect.objectContaining({
          cardUrn: "cardUrn",
          marketId: "924.204298740",
          status: "OPEN",
          runners: expect.any(Array),
        }),
      );
    });
  });

  describe("when isUppercase, show90MinBlurb, and visible are provided", () => {
    it("should accept the boolean props without errors", () => {
      mapStateToProps = makeMapStateToProps();

      getSportsbookMarket.mockReturnValueOnce({
        urn: "ppb:sbkMarket:924.204298740",
        marketId: "924.204298740",
        status: "OPEN",
      });

      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          isUppercase: true,
          show90MinBlurb: true,
          visible: true,
          displayRunnersUrns: [],
        },
      );

      expect(result).toEqual(
        expect.objectContaining({
          cardUrn: "cardUrn",
          marketId: "924.204298740",
          status: "OPEN",
          runners: expect.any(Array),
        }),
      );
    });
  });

  describe("when isRunnerExpandable and eventViewLink are provided", () => {
    it("should accept these props without errors", () => {
      mapStateToProps = makeMapStateToProps();
      const eventViewLink = {
        viewUrl: "/event/123",
        viewUrn: "ppb:tbd:view:event:123",
      };

      getSportsbookMarket.mockReturnValueOnce({
        urn: "ppb:sbkMarket:924.204298740",
        marketId: "924.204298740",
        status: "OPEN",
      });

      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          isRunnerExpandable: true,
          eventViewLink,
          displayRunnersUrns: [],
        },
      );

      expect(result).toEqual(
        expect.objectContaining({
          cardUrn: "cardUrn",
          marketId: "924.204298740",
          status: "OPEN",
          runners: expect.any(Array),
        }),
      );
    });
  });

  describe("when template is set to COUPON", () => {
    it("should accept the COUPON template value without errors", () => {
      mapStateToProps = makeMapStateToProps();

      getSportsbookMarket.mockReturnValueOnce({
        urn: "ppb:sbkMarket:924.204298740",
        marketId: "924.204298740",
        status: "OPEN",
      });

      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          template: "COUPON",
          displayRunnersUrns: [],
        },
      );

      expect(result).toEqual(
        expect.objectContaining({
          cardUrn: "cardUrn",
          marketId: "924.204298740",
          status: "OPEN",
          runners: expect.any(Array),
        }),
      );
    });
  });

  describe("when the market has EachWay terms and info blurbs", () => {
    it("should combine EachWay terms with info blurbs when both are present", () => {
      getSportsbookMarket.mockReturnValueOnce({
        marketId: "924.204298740",
        status: "OPEN",
        eachWayAvailable: true,
        eachWayPlaceFraction: {
          numerator: 1,
          denominator: 3,
        },
        eachWayPlaces: 2,
        inplay: false,
      });

      const infoBlurbs = [
        { title: "Info Blurb 1", signposting: "MARKET_RULES" },
        { title: "Info Blurb 2", signposting: "MARKET_RULES" },
      ];

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          infoBlurbs,
          displayRunnersUrns: [],
        },
      );

      expect(result.infoBlurbs).toEqual([
        {
          title: "I18N.LABELS.EW_TERMS",
          signposting: "MARKET_RULES",
        },
        ...infoBlurbs,
      ]);
    });

    it("should only include info blurbs when no EachWay terms are present", () => {
      getSportsbookMarket.mockReturnValueOnce({
        marketId: "924.204298740",
        status: "OPEN",
        eachWayAvailable: false,
        inplay: false,
      });

      const infoBlurbs = [
        { title: "Info Blurb 1", signposting: "MARKET_RULES" },
        { title: "Info Blurb 2", signposting: "MARKET_RULES" },
      ];

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          infoBlurbs,
          displayRunnersUrns: [],
        },
      );

      expect(result.infoBlurbs).toEqual(infoBlurbs);
    });

    it("should only include EachWay terms when no info blurbs are present", () => {
      getSportsbookMarket.mockReturnValueOnce({
        marketId: "924.204298740",
        status: "OPEN",
        eachWayAvailable: true,
        eachWayPlaceFraction: {
          numerator: 1,
          denominator: 3,
        },
        eachWayPlaces: 2,
        inplay: false,
      });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          displayRunnersUrns: [],
        },
      );

      expect(result.infoBlurbs).toEqual([
        {
          title: "I18N.LABELS.EW_TERMS",
          signposting: "MARKET_RULES",
        },
      ]);
    });

    it("should return empty array when neither EachWay terms nor info blurbs are present", () => {
      getSportsbookMarket.mockReturnValueOnce({
        marketId: "924.204298740",
        status: "OPEN",
        eachWayAvailable: false,
        inplay: false,
      });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        { entities: { races: {} } },
        {
          urn: "ppb:sbkMarket:924.204298740",
          cardUrn: "cardUrn",
          displayRunnersUrns: [],
        },
      );

      expect(result.infoBlurbs).toEqual([]);
    });
  });

  describe("when stat data is available", () => {
    const statCardUrn = "statCardUrn";
    const runner1Urn = "ppb:sbkRunner:stat:1";
    const runner2Urn = "ppb:sbkRunner:stat:2";

    const makeStatState = (cardOverrides = {}) => ({
      entities: {
        races: {},
        throttles: {},
        footballfixtures: {},
        footballplayerfixturecontexts: {},
      },
      layouts: {
        cards: {
          markets: {
            [statCardUrn]: {
              stat: "TOTAL_GOALS",
              displayRunners: {
                sportsbook: {
                  runners: [
                    { urn: runner1Urn, participantId: "player1" },
                    { urn: runner2Urn, participantId: "player2" },
                  ],
                },
              },
              ...cardOverrides,
            },
          },
        },
      },
    });

    beforeEach(() => {
      jest.clearAllMocks();
      getSportsbookMarket.mockReturnValue({ marketId: "924.204298740", status: "OPEN" });
      getMarketRunnersByDisplayRunners.mockReturnValue([
        { urn: runner1Urn, name: "Player One", handicap: 0, handicapLabel: "" },
        { urn: runner2Urn, name: "Player Two", handicap: 0, handicapLabel: "" },
      ]);
      getPlayerStatValue.mockReturnValue(undefined);
    });

    it("should not set statValue or statLabel when playerStats is null", () => {
      extractFootballPlayerRunnerContext.mockReturnValue({
        jerseys: null,
        playerHomeAwayMap: null,
        playerStats: null,
      });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(makeStatState(), {
        urn: "ppb:sbkMarket:924.204298740",
        cardUrn: statCardUrn,
        displayRunnersUrns: [],
      });

      expect(result.runners[0].statValue).toBeUndefined();
      expect(result.runners[0].statLabel).toBeUndefined();
    });

    it("should not set statValue or call getPlayerStatValue when runner has no participantId", () => {
      extractFootballPlayerRunnerContext.mockReturnValue({
        jerseys: null,
        playerHomeAwayMap: null,
        playerStats: { player1: { matchesPlayed: 10 } },
      });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(
        makeStatState({
          displayRunners: { sportsbook: { runners: [{ urn: runner1Urn }] } },
        }),
        { urn: "ppb:sbkMarket:924.204298740", cardUrn: statCardUrn, displayRunnersUrns: [] },
      );

      expect(result.runners[0].statValue).toBeUndefined();
      expect(getPlayerStatValue).not.toHaveBeenCalled();
    });

    it("should set statValue on runner from getPlayerStatValue", () => {
      extractFootballPlayerRunnerContext.mockReturnValue({
        jerseys: null,
        playerHomeAwayMap: null,
        playerStats: { player1: { matchesPlayed: 10, totals: { goals: 5 } } },
      });
      getPlayerStatValue.mockReturnValue({ value: "0.5" });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(makeStatState(), {
        urn: "ppb:sbkMarket:924.204298740",
        cardUrn: statCardUrn,
        displayRunnersUrns: [],
      });

      expect(result.runners[0].statValue).toBe("0.5");
      expect(result.runners[0].statValueInterpolation).toBeUndefined();
      expect(getPlayerStatValue).toHaveBeenCalledWith({ matchesPlayed: 10, totals: { goals: 5 } }, "TOTAL_GOALS");
    });

    it("should set statValueInterpolation when getPlayerStatValue returns interpolation data", () => {
      extractFootballPlayerRunnerContext.mockReturnValue({
        jerseys: null,
        playerHomeAwayMap: null,
        playerStats: { player1: { matchesPlayed: 10 } },
      });
      getPlayerStatValue.mockReturnValue({
        value: "I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES",
        interpolation: { cards: 5, matches: 10 },
      });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(makeStatState(), {
        urn: "ppb:sbkMarket:924.204298740",
        cardUrn: statCardUrn,
        displayRunnersUrns: [],
      });

      expect(result.runners[0].statValue).toBe("I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES");
      expect(result.runners[0].statValueInterpolation).toEqual({ cards: 5, matches: 10 });
    });

    it("should set statLabel from STAT_LABEL_I18N_KEY when the stat has a mapping", () => {
      extractFootballPlayerRunnerContext.mockReturnValue({
        jerseys: null,
        playerHomeAwayMap: null,
        playerStats: { player1: { matchesPlayed: 10 } },
      });
      getPlayerStatValue.mockReturnValue({ value: "3" });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(makeStatState({ stat: "TOTAL_YELLOW_RED_CARDS" }), {
        urn: "ppb:sbkMarket:924.204298740",
        cardUrn: statCardUrn,
        displayRunnersUrns: [],
      });

      expect(result.runners[0].statLabel).toBe("I18N.IN_LINE_STATS_TOTAL_CARDS");
    });

    it("should set statLabel to undefined when the stat has no STAT_LABEL_I18N_KEY mapping", () => {
      extractFootballPlayerRunnerContext.mockReturnValue({
        jerseys: null,
        playerHomeAwayMap: null,
        playerStats: { player1: { matchesPlayed: 10 } },
      });
      getPlayerStatValue.mockReturnValue({ value: "0.5" });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(makeStatState({ stat: "TOTAL_GOALS" }), {
        urn: "ppb:sbkMarket:924.204298740",
        cardUrn: statCardUrn,
        displayRunnersUrns: [],
      });

      expect(result.runners[0].statLabel).toBeUndefined();
    });

    it("should not set statLabel or statValue when cardStat is absent", () => {
      extractFootballPlayerRunnerContext.mockReturnValue({
        jerseys: null,
        playerHomeAwayMap: null,
        playerStats: { player1: { matchesPlayed: 10 } },
      });

      mapStateToProps = makeMapStateToProps();
      const result = mapStateToProps(makeStatState({ stat: undefined }), {
        urn: "ppb:sbkMarket:924.204298740",
        cardUrn: statCardUrn,
        displayRunnersUrns: [],
      });

      expect(result.runners[0].statLabel).toBeUndefined();
      expect(result.runners[0].statValue).toBeUndefined();
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchMarketUpdatesSubscribe", () => {
    it("should return the correct action creator", () => {
      const { dispatchMarketUpdatesSubscribe } = mapDispatchToProps;

      expect(dispatchMarketUpdatesSubscribe("marketId")).toEqual({
        payload: { marketId: "marketId" },
        type: "SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
      });
    });
  });

  describe("dispatchMarketUpdatesUnsubscribe", () => {
    it("should return the correct action creator", () => {
      const { dispatchMarketUpdatesUnsubscribe } = mapDispatchToProps;

      expect(dispatchMarketUpdatesUnsubscribe("marketId")).toEqual({
        payload: { marketId: "marketId" },
        type: "UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
      });
    });
  });

  describe("dispatchAzSwitchClick", () => {
    it("should return action creator with the expected label and isToggleOn status at true", () => {
      const { dispatchAzSwitchClick } = mapDispatchToProps;

      expect(dispatchAzSwitchClick("some label", true)).toEqual({
        payload: { label: "some label", isToggleOn: true },
        type: "UI/AZ_SWITCH_CLICK",
      });
    });

    it("should return action creator with the expected label and isToggleOn status at false", () => {
      const { dispatchAzSwitchClick } = mapDispatchToProps;

      expect(dispatchAzSwitchClick("some label", false)).toEqual({
        payload: { label: "some label", isToggleOn: false },
        type: "UI/AZ_SWITCH_CLICK",
      });
    });
  });
});
