import { generateLegId, generateRunnerId, LEG_TYPES } from "@ppb/betslip-core";
import { BUSINESS, APPLICATION } from "./AnalyticsDimensions";
import {
  getPlaceSportsbookBetClickEvent,
  getAutoConfirmSportsbookBetClickEvent,
  getSportsbookSuccessPlaceBetsEvent,
  getSportsbookSuccessPlaceSelectionsEvent,
  getSbkIncrementStakeEvent,
  getSportsbookAddSelectionToBetslip,
  getSportsbookFailedPlaceBetEvent,
  getBetslipBetBuilderAddSelections,
  getBetslipBetBuilderRemoveSelections,
  getBetslipSportsbookLoginToPlaceBetClickEvent,
} from "./sbk-betting";
import {
  getBettingResolvers,
  getSportsbookRunnerTree,
  getSportsbookMarketTree,
} from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSbkDisplayTransactionalError, isSingleLike } from "../../helpers/sportsbook-betting";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { getBetslipCard } from "../../state/betslip/betslip-card-selectors";
import { createBettableCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { getRunnerUniqueTaggingId } from "../../helpers/betting";
import { getVirtualMarketByRunnerURN } from "../../state/entities/virtual-market/virtual-market-selectors";
import { getVirtualRunnerByURN } from "../../state/entities/virtual-runner/virtual-runner-selectors";
import { getVirtualSportByURN } from "../../state/entities/virtual-sport/virtual-sport-selectors";
import { getVirtualEventByURN } from "../../state/entities/virtual-event/virtual-event-selectors";

jest.mock("@ppb/betslip-core");
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
}));
jest.mock("../../state/entities/sportsbook-runners/sportsbook-runner-selectors");
jest.mock("../../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getSportsbookRunnerTree: jest.fn(),
  getSportsbookMarketTree: jest.fn(),
  getBettingResolvers: jest.fn().mockReturnValue({
    getMetadata: jest.fn(),
  }),
  getMarketRunnerIdAssociation: jest.fn().mockReturnValue({ marketId: 1, selectionId: 123 }),
}));
jest.mock("../../helpers/sportsbook-betting");
jest.mock("../../state/entities/virtual-market/virtual-market-selectors", () => ({
  getVirtualMarketByRunnerURN: jest.fn(),
}));
jest.mock("../../state/entities/virtual-runner/virtual-runner-selectors", () => ({
  getVirtualRunnerByURN: jest.fn(),
}));
jest.mock("../../state/entities/virtual-sport/virtual-sport-selectors", () => ({
  getVirtualSportByURN: jest.fn(),
}));
jest.mock("../../state/entities/virtual-event/virtual-event-selectors", () => ({
  getVirtualEventByURN: jest.fn(),
}));
jest.mock("../../state/entities/competitions/competition-selectors");
jest.mock("../../state/entities/sport-events/sport-event-selectors");
jest.mock("../../state/entities/entities-selectors");
jest.mock("../../state/layout/views/event-view/event-view-selectors");
jest.mock("../../state/betslip/betslip-card-selectors");
jest.mock("../../state/layout/cards/cards-selectors", () => {
  const getPopularMultiplesBetBuilderCardByURN = jest.fn(() => ({
    popularbettingopportunity: "popularbettingopportunityUrn",
    title: "popular multiples title",
  }));
  return {
    createBettableCardByURNSelector: jest.fn(),
    createCardByURNSelector: jest.fn(() => getPopularMultiplesBetBuilderCardByURN),
  };
});
jest.mock("../../state/entities/user-details/user-details-selectors");
jest.mock("../../state/entities/user-preferences/user-preferences-selectors");
jest.mock("../../state/layout/layout-selectors", () => ({
  createCardParentTitlesByURNSelector: jest.fn(() =>
    jest.fn().mockReturnValue({
      groupTitle: "groupTitle",
      tabTitle: "tabTitle",
    }),
  ),
  createViewTypeSelector: jest.fn(() => jest.fn().mockReturnValue("someViewType")),
}));
jest.mock("../../state/application-state-selectors", () => ({
  createGetSwimlaneUrnByCardUrnSelector: jest.fn(jest.fn),
}));

jest.mock("../../state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(),
}));
jest.mock("../../state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(),
}));
jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn().mockReturnValue("17:00"),
}));

jest.mock("../../helpers/betting", () => ({
  getRunnerUniqueTaggingId: jest.fn(() => {}),
}));

Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

beforeEach(jest.clearAllMocks);

const metadata = {
  cardGroupTitle: "In-Play",
  tabName: "Acca Builder",
  horizontalPosition: 1,
  verticalPosition: 2,
};

describe("Sportsbook betting GTM resolvers", () => {
  describe("getPlaceSportsbookBetClickEvent", () => {
    it("should return event payload", () => {
      const event = getPlaceSportsbookBetClickEvent();
      expect(event).toEqual({
        event: "ga_event",
        action: "submitted bet",
        category: "betting",
        label: "place bet",
        cd3: "betslip",
        cd11: "back",
      });
    });
  });

  describe("getSportsbookSuccessPlaceBetsEvent", () => {
    const APP_STATE = { some: "state" };

    function setup({ report, isSingleBet = true, betType = "SINGLE" } = {}) {
      getUserDetails.mockReturnValue({ currencyCode: "EUR" });
      isSingleLike.mockReturnValue(isSingleBet);

      const DEFAULT_REPORT = {
        result: {
          combinations: {
            combination1: {
              betReceiptId: "some bet receipt id 1",
              betId: 123,
              betType,
            },
            combination2: {
              betReceiptId: "some bet receipt id 2",
              betId: 124,
              betType,
            },
          },
        },
      };

      return getSportsbookSuccessPlaceBetsEvent(APP_STATE, { report: report || DEFAULT_REPORT });
    }

    describe("when bet type is SINGLE", () => {
      it("should send BET_TYPE_GROUP as single", () => {
        const events = setup({ betType: "SINGLE", isSingleBet: true });
        expect(events[0][BUSINESS.BET_TYPE_GROUP]).toBe("single");
      });
    });

    describe("when bet type is not SINGLE", () => {
      it("should send BET_TYPE_GROUP as multiple", () => {
        const events = setup({ betType: "DOUBLE", isSingleBet: false });
        expect(events[0][BUSINESS.BET_TYPE_GROUP]).toBe("multiple");
      });
    });

    it("should send CONFIRM_BETS_INDICATOR as no", () => {
      const events = setup({});
      expect(events[0][BUSINESS.CONFIRM_BETS_INDICATOR]).toBe("no");
    });

    it("should call user details with app state", () => {
      setup();

      expect(getUserDetails).toHaveBeenCalledWith(APP_STATE);
      expect(getUserDetails).toHaveBeenCalledTimes(1);
    });

    it("should return the correct events payload", () => {
      const events = setup();

      expect(events).toEqual([
        {
          event: "ga_event",
          action: "placed bet",
          category: "betting",
          label: "placed bet",
          [APPLICATION.MODULE]: "betslip",
          [BUSINESS.CURRENCY_CODE]: "EUR",
          [BUSINESS.BET_ID]: "123",
          [BUSINESS.BET_RECEIPT]: "some bet receipt id 1",
          [BUSINESS.BET_TYPE_GROUP]: "single",
          [BUSINESS.BET_TYPE]: "SINGLE",
          [BUSINESS.CONFIRM_BETS_INDICATOR]: "no",
          [BUSINESS.ACCEPT_ODDS_INDICATOR]: "no",
          [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
        },
        {
          event: "ga_event",
          action: "placed bet",
          category: "betting",
          label: "placed bet",
          [APPLICATION.MODULE]: "betslip",
          [BUSINESS.CURRENCY_CODE]: "EUR",
          [BUSINESS.BET_ID]: "124",
          [BUSINESS.BET_RECEIPT]: "some bet receipt id 2",
          [BUSINESS.BET_TYPE_GROUP]: "single",
          [BUSINESS.BET_TYPE]: "SINGLE",
          [BUSINESS.CONFIRM_BETS_INDICATOR]: "no",
          [BUSINESS.ACCEPT_ODDS_INDICATOR]: "no",
          [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
        },
      ]);
    });
  });

  describe("getSportsbookSuccessPlaceSelectionsEvent", () => {
    const APP_STATE = {
      entities: {
        competitions: "competitions",
        sportevents: "sportevents",
      },
    };

    const REPORT = {
      metadata: {
        runner1: {
          runnerUrn: "runner:urn:1",
          guaranteedPriceAvailable: true,
          bettingGroup: "REAL",
        },
        runner2: {
          runnerUrn: "runner:urn:2",
          guaranteedPriceAvailable: false,
          bettingGroup: "REAL",
        },
      },
      result: {
        combinations: {
          combination1: {
            betReceiptId: "some bet receipt id 1",
            betId: 123,
            legs: ["leg1", "leg2"],
            totalStake: 1,
          },
          combination2: {
            betReceiptId: "some bet receipt id 2",
            betId: 124,
            legs: ["leg3"],
            isPriceBoosted: true,
            totalStake: 2,
          },
        },
        legs: {
          leg1: {
            displayOdds: {
              decimalOdds: 11,
            },
            runners: ["runner1"],
          },
          leg2: {
            displayOdds: {
              decimalOdds: 22,
            },
            runners: ["runner2"],
          },
          leg3: {
            displayOdds: {
              decimalOdds: 33,
            },
            runners: ["runner1"],
          },
        },
      },
    };

    const VIRTUAL_REPORT = {
      metadata: {
        runner1: {
          runnerUrn: "runner:urn:1",
          guaranteedPriceAvailable: true,
          bettingGroup: "VIRTUAL",
        },
        runner2: {
          runnerUrn: "runner:urn:2",
          guaranteedPriceAvailable: false,
          bettingGroup: "VIRTUAL",
        },
      },
      result: {
        combinations: {
          combination1: {
            betReceiptId: "some bet receipt id 1",
            betId: 123,
            legs: ["leg1", "leg2"],
            totalStake: 1,
          },
          combination2: {
            betReceiptId: "some bet receipt id 2",
            betId: 124,
            legs: ["leg3"],
            isPriceBoosted: true,
            totalStake: 2,
          },
        },
        legs: {
          leg1: {
            displayOdds: {
              decimalOdds: 11,
            },
            runners: ["runner1"],
          },
          leg2: {
            displayOdds: {
              decimalOdds: 22,
            },
            runners: ["runner2"],
          },
          leg3: {
            displayOdds: {
              decimalOdds: 33,
            },
            runners: ["runner1"],
          },
        },
      },
    };

    const MARKET_TREE = {
      marketRunner: { name: "Porto" },
      market: {
        hierarchy: { competition: "competition:urn", sportevent: "ppb:event:2" },
        marketId: 1,
        name: "Match Odds",
        inplay: false,
      },
      sport: { sportId: 4, name: "football" },
    };

    const RUNNER_TREE = {
      runner: { selectionId: 123 },
      ...MARKET_TREE,
    };

    function setup() {
      getUserDetails.mockReturnValue({ currencyCode: "EUR" });
      getSportsbookRunnerTree.mockReturnValue(RUNNER_TREE);
      getSportsbookMarketTree.mockReturnValue(MARKET_TREE);
      getCompetitionByURN.mockReturnValue({ competitionId: 3, name: "Primeira Liga" });
      getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
      getRunnerUniqueTaggingId.mockReturnValue("uniqueId");
      getVirtualMarketByRunnerURN.mockReturnValue({
        name: "virtual market name",
        marketId: 123,
      });
      getVirtualRunnerByURN.mockReturnValue({
        selectionId: 123456,
        name: "some virtual runner",
      });
      getVirtualEventByURN.mockReturnValue({
        name: "some virtual event",
        eventId: 1337,
      });
      getVirtualSportByURN.mockReturnValue({
        name: {
          translationKey: "some virtual sport name",
        },
        sportId: 9999,
      });
    }

    it("should call user details with app state", () => {
      setup();
      getSportsbookSuccessPlaceSelectionsEvent(APP_STATE, { report: REPORT });

      expect(getUserDetails).toHaveBeenCalledWith(APP_STATE);
      expect(getUserDetails).toHaveBeenCalledTimes(1);
    });

    describe("with missing data", () => {
      describe("when runner tree is null", () => {
        it("should return an empty array", () => {
          setup();
          getSportsbookRunnerTree.mockReturnValue(null);

          const events = getSportsbookSuccessPlaceSelectionsEvent(APP_STATE, { report: REPORT });

          expect(getSportsbookRunnerTree.mock.calls[0]).toMatchObject([APP_STATE, "runner:urn:1"]);
          expect(getSportsbookRunnerTree.mock.calls[1]).toMatchObject([APP_STATE, "runner:urn:2"]);
          expect(getSportsbookRunnerTree.mock.calls[2]).toMatchObject([APP_STATE, "runner:urn:1"]);
          expect(getSportsbookRunnerTree).toHaveBeenCalledTimes(3);
          expect(events).toMatchObject([]);
        });
      });

      describe("without competition id", () => {
        it("should return an empty array", () => {
          setup();
          getCompetitionByURN.mockReturnValue({});

          const events = getSportsbookSuccessPlaceSelectionsEvent(APP_STATE, { report: REPORT });

          expect(getCompetitionByURN).toHaveBeenCalledWith("competitions", "competition:urn");
          expect(events).toMatchObject([]);
        });
      });
    });

    describe("with data available", () => {
      it("should return the correct events payload", () => {
        setup();
        const events = getSportsbookSuccessPlaceSelectionsEvent(APP_STATE, { report: REPORT });

        expect(events).toEqual([
          {
            event: "ga_event",
            action: "placed bet",
            category: "betting",
            label: "selection",
            [APPLICATION.MODULE]: "betslip",
            [BUSINESS.CURRENCY_CODE]: "EUR",
            [BUSINESS.BET_DIRECTION]: "back",
            [BUSINESS.BET_ID]: "123",
            [BUSINESS.BET_RECEIPT]: "some bet receipt id 1",
            [BUSINESS.BET_RESPONSE]: "matched",
            [BUSINESS.EACHWAY_INDICATOR]: "no",
            [BUSINESS.PRICE_AT_BET]: 11,
            [BUSINESS.STAKE_AMOUNT]: 1,
            [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
            [BUSINESS.EW_EDGE_INDICATOR]: "no",
            [BUSINESS.PRICE_BOOST_INDICATOR]: "no",
            [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: "yes",
            [BUSINESS.COMPETITION_NAME]: "Primeira Liga",
            [BUSINESS.EVENT_NAME]: "Sporting vs Porto",
            [BUSINESS.MARKET_NAME]: "Match Odds",
            [BUSINESS.IN_PLAY_INDICATOR]: "no",
            [BUSINESS.EVENT_ID]: 2,
            [BUSINESS.MARKET_ID]: 1,
            [BUSINESS.SELECTION_ID]: 123,
            [BUSINESS.COMPETITION_ID]: 3,
            [BUSINESS.ANTEPOST_FLAG]: "no",
            [BUSINESS.SELECTION_NAME]: "Porto",
            [BUSINESS.SPORT_ID]: 4,
            [BUSINESS.SPORT_NAME]: "football",
            [BUSINESS.SELECTION_UNIQUE_ID]: "uniqueId",
          },
          {
            event: "ga_event",
            action: "placed bet",
            category: "betting",
            label: "selection",
            [APPLICATION.MODULE]: "betslip",
            [BUSINESS.CURRENCY_CODE]: "EUR",
            [BUSINESS.BET_DIRECTION]: "back",
            [BUSINESS.BET_ID]: "123",
            [BUSINESS.BET_RECEIPT]: "some bet receipt id 1",
            [BUSINESS.BET_RESPONSE]: "matched",
            [BUSINESS.EACHWAY_INDICATOR]: "no",
            [BUSINESS.PRICE_AT_BET]: 22,
            [BUSINESS.STAKE_AMOUNT]: 1,
            [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
            [BUSINESS.EW_EDGE_INDICATOR]: "no",
            [BUSINESS.PRICE_BOOST_INDICATOR]: "no",
            [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: "no",
            [BUSINESS.COMPETITION_NAME]: "Primeira Liga",
            [BUSINESS.EVENT_NAME]: "Sporting vs Porto",
            [BUSINESS.MARKET_NAME]: "Match Odds",
            [BUSINESS.IN_PLAY_INDICATOR]: "no",
            [BUSINESS.EVENT_ID]: 2,
            [BUSINESS.MARKET_ID]: 1,
            [BUSINESS.SELECTION_ID]: 123,
            [BUSINESS.COMPETITION_ID]: 3,
            [BUSINESS.ANTEPOST_FLAG]: "no",
            [BUSINESS.SELECTION_NAME]: "Porto",
            [BUSINESS.SPORT_ID]: 4,
            [BUSINESS.SPORT_NAME]: "football",
            [BUSINESS.SELECTION_UNIQUE_ID]: "uniqueId",
          },
          {
            event: "ga_event",
            action: "placed bet",
            category: "betting",
            label: "selection",
            [APPLICATION.MODULE]: "betslip",
            [BUSINESS.CURRENCY_CODE]: "EUR",
            [BUSINESS.BET_DIRECTION]: "back",
            [BUSINESS.BET_ID]: "124",
            [BUSINESS.BET_RECEIPT]: "some bet receipt id 2",
            [BUSINESS.BET_RESPONSE]: "matched",
            [BUSINESS.EACHWAY_INDICATOR]: "no",
            [BUSINESS.PRICE_AT_BET]: 33,
            [BUSINESS.STAKE_AMOUNT]: 2,
            [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
            [BUSINESS.EW_EDGE_INDICATOR]: "no",
            [BUSINESS.PRICE_BOOST_INDICATOR]: "yes",
            [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: "yes",
            [BUSINESS.COMPETITION_NAME]: "Primeira Liga",
            [BUSINESS.EVENT_NAME]: "Sporting vs Porto",
            [BUSINESS.MARKET_NAME]: "Match Odds",
            [BUSINESS.IN_PLAY_INDICATOR]: "no",
            [BUSINESS.EVENT_ID]: 2,
            [BUSINESS.MARKET_ID]: 1,
            [BUSINESS.SELECTION_ID]: 123,
            [BUSINESS.COMPETITION_ID]: 3,
            [BUSINESS.ANTEPOST_FLAG]: "no",
            [BUSINESS.SELECTION_NAME]: "Porto",
            [BUSINESS.SPORT_ID]: 4,
            [BUSINESS.SPORT_NAME]: "football",
            [BUSINESS.SELECTION_UNIQUE_ID]: "uniqueId",
          },
        ]);
      });

      describe("when is a virtual market", () => {
        it("should return the correct events payload", () => {
          setup();
          const events = getSportsbookSuccessPlaceSelectionsEvent(APP_STATE, { report: VIRTUAL_REPORT });

          expect(events).toEqual([
            {
              event: "ga_event",
              action: "placed bet",
              category: "betting",
              label: "selection",
              [APPLICATION.MODULE]: "betslip",
              [BUSINESS.CURRENCY_CODE]: "EUR",
              [BUSINESS.BET_DIRECTION]: "back",
              [BUSINESS.BET_ID]: "123",
              [BUSINESS.BET_RECEIPT]: "some bet receipt id 1",
              [BUSINESS.BET_RESPONSE]: "matched",
              [BUSINESS.EACHWAY_INDICATOR]: "no",
              [BUSINESS.PRICE_AT_BET]: 11,
              [BUSINESS.STAKE_AMOUNT]: 1,
              [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
              [BUSINESS.EW_EDGE_INDICATOR]: "no",
              [BUSINESS.PRICE_BOOST_INDICATOR]: "no",
              [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: "yes",
              [BUSINESS.COMPETITION_NAME]: "some virtual event",
              [BUSINESS.EVENT_NAME]: "some virtual event",
              [BUSINESS.MARKET_NAME]: "virtual market name",
              [BUSINESS.IN_PLAY_INDICATOR]: "no",
              [BUSINESS.EVENT_ID]: 1337,
              [BUSINESS.MARKET_ID]: 123,
              [BUSINESS.SELECTION_ID]: 123456,
              [BUSINESS.COMPETITION_ID]: 1337,
              [BUSINESS.ANTEPOST_FLAG]: "no",
              [BUSINESS.SELECTION_NAME]: "some virtual runner",
              [BUSINESS.SPORT_ID]: 9999,
              [BUSINESS.SPORT_NAME]: "virtual:some virtual sport name",
              [BUSINESS.SELECTION_UNIQUE_ID]: "uniqueId",
            },
            {
              event: "ga_event",
              action: "placed bet",
              category: "betting",
              label: "selection",
              [APPLICATION.MODULE]: "betslip",
              [BUSINESS.CURRENCY_CODE]: "EUR",
              [BUSINESS.BET_DIRECTION]: "back",
              [BUSINESS.BET_ID]: "123",
              [BUSINESS.BET_RECEIPT]: "some bet receipt id 1",
              [BUSINESS.BET_RESPONSE]: "matched",
              [BUSINESS.EACHWAY_INDICATOR]: "no",
              [BUSINESS.PRICE_AT_BET]: 22,
              [BUSINESS.STAKE_AMOUNT]: 1,
              [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
              [BUSINESS.EW_EDGE_INDICATOR]: "no",
              [BUSINESS.PRICE_BOOST_INDICATOR]: "no",
              [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: "no",
              [BUSINESS.COMPETITION_NAME]: "some virtual event",
              [BUSINESS.EVENT_NAME]: "some virtual event",
              [BUSINESS.MARKET_NAME]: "virtual market name",
              [BUSINESS.IN_PLAY_INDICATOR]: "no",
              [BUSINESS.EVENT_ID]: 1337,
              [BUSINESS.MARKET_ID]: 123,
              [BUSINESS.SELECTION_ID]: 123456,
              [BUSINESS.COMPETITION_ID]: 1337,
              [BUSINESS.ANTEPOST_FLAG]: "no",
              [BUSINESS.SELECTION_NAME]: "some virtual runner",
              [BUSINESS.SPORT_ID]: 9999,
              [BUSINESS.SPORT_NAME]: "virtual:some virtual sport name",
              [BUSINESS.SELECTION_UNIQUE_ID]: "uniqueId",
            },
            {
              event: "ga_event",
              action: "placed bet",
              category: "betting",
              label: "selection",
              [APPLICATION.MODULE]: "betslip",
              [BUSINESS.CURRENCY_CODE]: "EUR",
              [BUSINESS.BET_DIRECTION]: "back",
              [BUSINESS.BET_ID]: "124",
              [BUSINESS.BET_RECEIPT]: "some bet receipt id 2",
              [BUSINESS.BET_RESPONSE]: "matched",
              [BUSINESS.EACHWAY_INDICATOR]: "no",
              [BUSINESS.PRICE_AT_BET]: 33,
              [BUSINESS.STAKE_AMOUNT]: 2,
              [BUSINESS.ACCA_EDGE_INDICATOR]: "no",
              [BUSINESS.EW_EDGE_INDICATOR]: "no",
              [BUSINESS.PRICE_BOOST_INDICATOR]: "yes",
              [BUSINESS.BEST_ODDS_GUARANTEED_INDICATOR]: "yes",
              [BUSINESS.COMPETITION_NAME]: "some virtual event",
              [BUSINESS.EVENT_NAME]: "some virtual event",
              [BUSINESS.MARKET_NAME]: "virtual market name",
              [BUSINESS.IN_PLAY_INDICATOR]: "no",
              [BUSINESS.EVENT_ID]: 1337,
              [BUSINESS.MARKET_ID]: 123,
              [BUSINESS.SELECTION_ID]: 123456,
              [BUSINESS.COMPETITION_ID]: 1337,
              [BUSINESS.ANTEPOST_FLAG]: "no",
              [BUSINESS.SELECTION_NAME]: "some virtual runner",
              [BUSINESS.SPORT_ID]: 9999,
              [BUSINESS.SPORT_NAME]: "virtual:some virtual sport name",
              [BUSINESS.SELECTION_UNIQUE_ID]: "uniqueId",
            },
          ]);
        });
      });
    });
  });

  describe("getSportsbookFailedPlaceBetEvent", () => {
    it("should call getSbkDisplayTransactionalError", () => {
      getSportsbookFailedPlaceBetEvent("failureGroup");

      expect(getSbkDisplayTransactionalError).toHaveBeenCalledWith("failureGroup");
      expect(getSbkDisplayTransactionalError).toHaveBeenCalledTimes(1);
    });

    describe("when getSbkDisplayTransactionalError returns null", () => {
      it("should return null", () => {
        getSbkDisplayTransactionalError.mockReturnValue(null);
        const event = getSportsbookFailedPlaceBetEvent();

        expect(event).toBeNull();
      });
    });

    describe("when getSbkDisplayTransactionalError returns error", () => {
      it("should return event", () => {
        getSbkDisplayTransactionalError.mockReturnValue("ERROR_CODE");
        const event = getSportsbookFailedPlaceBetEvent();

        expect(event).toEqual({
          action: "placed bet - error",
          category: "betting",
          cd11: "back",
          cd3: "betslip",
          cd99: "ERROR_CODE",
          event: "ga_event",
          label: "ERROR_CODE",
        });
      });
    });
  });

  describe("getSbkIncrementStakeEvent", () => {
    describe("and currencySymbol exists", () => {
      it("should return event payload label with symbol", () => {
        expect(getSbkIncrementStakeEvent("5", "€")).toEqual({
          event: "ga_event",
          action: "selected",
          category: "betting",
          label: "+€5 quick stake",
          [APPLICATION.MODULE]: "betslip",
        });
      });
    });

    describe("and currencySymbol is undefined", () => {
      it("should return event payload label without symbol", () => {
        expect(getSbkIncrementStakeEvent("10", undefined)).toEqual({
          event: "ga_event",
          action: "selected",
          category: "betting",
          label: "+10 quick stake",
          [APPLICATION.MODULE]: "betslip",
        });
      });
    });
  });

  describe("getBetslipSportsbookRemoveSelectionEvent", () => {
    const getBettingRunnerMetadataMock = jest.fn();
    let mockedModule;

    beforeAll(() => {
      jest.resetModules();

      jest.doMock("../../state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
        getBettingResolvers: jest.fn().mockReturnValue({
          getMetadata: getBettingRunnerMetadataMock,
        }),
      }));

      jest.doMock("../../state/betslip/betslip-card-selectors", () => ({
        getBetslipCard: jest.fn(() => ({
          taggingMetadata: {
            selections: {
              "runner:urn:1": {
                id: "runner:urn:1",
                timestamp: 1622138467422,
              },
            },
          },
        })),
      }));

      mockedModule = require("./sbk-betting");
    });

    function setup(sbkBettingState, legId, runnerUrn) {
      const state = {
        betting: {
          sportsbookBetting: sbkBettingState,
        },
      };

      getBetslipCard.mockReturnValue({
        taggingMetadata: {
          selections: {
            "runner:urn:1": {
              id: "runner:urn:1",
            },
          },
        },
      });

      return {
        mockedState: state,
        event: mockedModule.getBetslipSportsbookRemoveSelectionEvent(state, { legId, runnerUrn }),
      };
    }

    describe("when the runner being removed does not belong to the tagging metadata selections", () => {
      it("should return null", () => {
        const { event } = setup({ legs: {} }, undefined, "runner:urn:2");

        expect(event).toEqual(null);
      });
    });

    describe("when the selection being removed does not belong to a leg or is not being replaced", () => {
      it("should return null", () => {
        const { event } = setup({ legs: {} });

        expect(event).toEqual(null);
      });
    });

    describe("when there is no metadata for the core runner", () => {
      function setupMocks() {
        getBettingRunnerMetadataMock.mockReturnValue({});
      }

      it("should return null", () => {
        setupMocks();

        const { event } = setup({ legs: { "LEG:1": { runners: [] } } });

        expect(event).toEqual(null);
      });
    });

    describe("when there is all data for the selection being removed", () => {
      const sbkBettingState = {
        legs: {
          "LEG:1": { runners: ["betslip-core:runner-id-1"] },
          "LEG:2": { runners: ["betslip-core:runner-id-2"] },
        },
      };

      function setupMocks() {
        getBettingRunnerMetadataMock.mockReturnValue({
          "betslip-core:runner-id-1": { sportName: "Sport Name #1" },
          "betslip-core:runner-id-2": { sportName: "Sport Name #2" },
        });
      }

      describe("and when I have a legId", () => {
        it("should return the event with the provided legId", () => {
          setupMocks();

          const { event } = setup(sbkBettingState, "LEG:2");

          expect(event).toEqual({
            event: "ga_event",
            action: "removed selection",
            category: "betting",
            label: "sport name #2",
            [APPLICATION.MODULE]: "betslip",
            [BUSINESS.BET_DIRECTION]: "back",
          });
        });
      });

      describe("and when I do not have a legId", () => {
        it("should return the event with the first leg", () => {
          setupMocks();

          const { event } = setup(sbkBettingState);

          expect(event).toEqual({
            event: "ga_event",
            action: "removed selection",
            category: "betting",
            label: "sport name #1",
            [APPLICATION.MODULE]: "betslip",
            [BUSINESS.BET_DIRECTION]: "back",
          });
        });
      });
    });
  });

  describe("getSportsbookAddSelectionToBetslip", () => {
    const appState = {
      betting: {
        sportsbookBetting: {
          legs: {
            legId1: "some leg",
          },
        },
      },
      entities: {
        competitions: "competitions",
        sportevents: "sportevents",
      },
      layouts: {
        views: "views",
      },
      router: {
        currentUrn: "view:urn",
      },
    };

    const baseActionPayload = {
      urn: "runner:urn",
      odds: { decimal: 2.1 },
      cardUrn: "card:urn",
      uniqueId: "uniqueId",
      betOriginURL: "https://www.betfair.com/",
    };

    const realAction = {
      payload: {
        ...baseActionPayload,
        group: "REAL",
      },
    };
    const virtualAction = {
      payload: {
        ...baseActionPayload,
        group: "VIRTUAL",
      },
    };

    const market = {
      sport: "sport:urn",
      hierarchy: {
        sportevent: "sportevent:urn",
        competition: "competition:urn",
      },
    };

    const racingMarket = {
      sport: "sport:urn",
      hierarchy: {
        race: "race:urn",
        meeting: "meeting:urn",
      },
    };

    const defaultRunnerTree = {
      runner: {
        market: { urn: "market:urn" },
        selectionId: 123,
      },
      marketRunner: { selectionId: 123, name: "Porto" },
      market: { ...market, marketId: 1, name: "Match Odds", inplay: false },
      sport: { sportId: 4, name: "football" },
    };

    const racingRunnerTree = {
      runner: { market: "market:urn", selectionId: 123 },
      marketRunner: { selectionId: 123, name: "Porto" },
      market: { ...racingMarket, marketId: 1, name: "Match Odds", inplay: false },
      sport: { sportId: 7, name: "horse racing" },
    };

    const getBettableCardByURN = jest.fn();
    const getRaceByURN = jest
      .fn()
      .mockReturnValue({ raceId: "raceId", name: "Race Name", startTime: "2020-07-01T16:00:00.000Z" });
    const getMeetingByURN = jest
      .fn()
      .mockReturnValue({ meetingId: "meetingId", entityName: "Meeting Name", venue: "Newcastle" });
    const getViewTypeSelector = jest.fn().mockReturnValue("EVENT");

    const setup = ({ runnerTree = defaultRunnerTree } = {}) => {
      const getMarketRunnerIdAssociationMock = jest.fn().mockReturnValue({ marketId: 1, selectionId: 123 });

      getBettingResolvers.mockReturnValue({
        getMarketRunnerIdAssociation: getMarketRunnerIdAssociationMock,
      });
      generateRunnerId.mockReturnValue("runner:tuple");
      generateLegId.mockReturnValue("legId2");
      getSportsbookRunnerTree.mockReturnValue(runnerTree);
      getCompetitionByURN.mockReturnValue({ competitionId: 3, name: "Primeira Liga" });
      getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
      getViewbyURN.mockReturnValue({ typename: "EventView" });
      createBettableCardByURNSelector.mockImplementation(() => getBettableCardByURN);
      createRaceByURNSelector.mockReturnValue(getRaceByURN);
      createMeetingByURNSelector.mockReturnValue(getMeetingByURN);
      getBettableCardByURN.mockReturnValue({ title: "Match Odds" });
      createViewTypeSelector.mockImplementation(() => getViewTypeSelector);
      getVirtualMarketByRunnerURN.mockReturnValue({
        name: "virtual market name",
        marketId: 123,
      });
      getVirtualRunnerByURN.mockReturnValue({
        selectionId: 123456,
        name: "some virtual runner",
      });
      getVirtualEventByURN.mockReturnValue({
        name: "some virtual event",
        eventId: 1337,
      });
      getVirtualSportByURN.mockReturnValue({
        name: {
          translationKey: "some virtual sport name",
        },
        sportId: 9999,
      });
    };

    beforeEach(jest.clearAllMocks);

    describe("with missing data", () => {
      describe("when there's no association between runner and market", () => {
        it("should return null", () => {
          setup();

          const getMarketRunnerIdAssociationMock = jest.fn().mockReturnValue(null);

          getBettingResolvers.mockReturnValue({
            getMarketRunnerIdAssociation: getMarketRunnerIdAssociationMock,
          });

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(getMarketRunnerIdAssociationMock).toHaveBeenCalledWith(appState.entities, "runner:urn");
          expect(getMarketRunnerIdAssociationMock).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("when leg already exists", () => {
        it("should return null", () => {
          setup();
          generateLegId.mockReturnValue("legId1");

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(generateRunnerId).toHaveBeenCalledWith({ marketId: 1, selectionId: 123 });
          expect(generateRunnerId).toHaveBeenCalledTimes(1);
          expect(generateLegId).toHaveBeenCalledWith(LEG_TYPES.SIMPLE_SELECTION, ["runner:tuple"]);
          expect(generateLegId).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("when runner tree is null", () => {
        it("should return null", () => {
          setup();
          getSportsbookRunnerTree.mockReturnValue(null, metadata);

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(getSportsbookRunnerTree).toHaveBeenCalledWith(appState, "runner:urn");
          expect(getSportsbookRunnerTree).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("without current view", () => {
        it("should return null", () => {
          setup();

          const result = getSportsbookAddSelectionToBetslip(
            { ...appState, router: { currentUrn: null } },
            realAction,
            metadata,
          );

          expect(result).toBeNull();
        });
      });

      describe("without view", () => {
        it("should return null", () => {
          setup();
          getViewbyURN.mockReturnValue(null);

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(getViewbyURN).toHaveBeenCalledWith("views", "view:urn");
          expect(getViewbyURN).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("without card", () => {
        it("should return null", () => {
          setup();
          getBettableCardByURN.mockReturnValue(null);

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(getBettableCardByURN).toHaveBeenCalledWith(appState.layouts.cards, "card:urn");
          expect(getBettableCardByURN).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("without competition id", () => {
        it("should return null", () => {
          setup();
          getCompetitionByURN.mockReturnValue({});

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(result).toBeNull();
        });
      });

      describe("without event id", () => {
        it("should return null", () => {
          setup();
          getSportEventByURN.mockReturnValue({});

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(result).toBeNull();
        });
      });
    });

    describe("with data available", () => {
      describe("inplay", () => {
        it("should return 'yes' if it's inplay", () => {
          setup({
            runnerTree: { ...defaultRunnerTree, market: { ...market, marketId: 1, name: "Match Odds", inplay: true } },
          });

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(result.cd79).toBe("yes");
        });

        it("should return 'no' if it's NOT inplay", () => {
          setup({
            runnerTree: {
              ...defaultRunnerTree,
              market: { ...market, marketId: 1, name: "Match Odds", inplay: false },
            },
          });

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(result.cd79).toBe("no");
        });
      });

      describe("when I have card position info", () => {
        it("should return the correct gtm data", () => {
          setup();

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(result).toEqual({
            event: "ga_event",
            category: "betting",
            action: "added selection",
            label: "football",
            cd3: "EVENT - primary swimlane - In-Play - Match Odds - Acca Builder",
            cd5: "football",
            cd6: "Primeira Liga",
            cd7: "Sporting vs Porto",
            cd8: "Match Odds",
            cd11: "back",
            cd14: 4,
            cd42: 1,
            cd43: 1,
            cd67: 2,
            cd79: "no",
            cd84: 2,
            cd85: "https://www.betfair.com/",
            cd101: 1,
            cd102: 123,
            cd112: 2.1,
            cd129: 3,
            cd130: "uniqueId",
            cd131: "no",
            cd132: "Porto",
          });
        });
      });

      describe("when I do not have card position info", () => {
        it("should return the correct gtm data with card position dimensions as null", () => {
          setup();
          const result = getSportsbookAddSelectionToBetslip(appState, realAction, {
            cardGroupTitle: metadata.cardGroupTitle,
            tabName: metadata.tabName,
          });

          expect(result).toEqual({
            event: "ga_event",
            category: "betting",
            action: "added selection",
            label: "football",
            cd3: "EVENT - primary swimlane - In-Play - Match Odds - Acca Builder",
            cd5: "football",
            cd6: "Primeira Liga",
            cd7: "Sporting vs Porto",
            cd8: "Match Odds",
            cd11: "back",
            cd14: 4,
            cd42: null,
            cd43: null,
            cd67: null,
            cd79: "no",
            cd84: 2,
            cd85: "https://www.betfair.com/",
            cd101: 1,
            cd102: 123,
            cd112: 2.1,
            cd129: 3,
            cd130: "uniqueId",
            cd131: "no",
            cd132: "Porto",
          });
        });
      });
    });

    describe("if it is a racing market", () => {
      describe("with missing data", () => {
        describe("when the race doesn't exist", () => {
          it("should return null", () => {
            setup({ runnerTree: racingRunnerTree });
            createRaceByURNSelector.mockReturnValue(jest.fn().mockReturnValue(null));

            const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

            expect(result).toBeNull();
          });
        });
        describe("when the meeting doesn't exist", () => {
          it("should return null", () => {
            setup({ runnerTree: racingRunnerTree });
            createMeetingByURNSelector.mockReturnValue(jest.fn().mockReturnValue(null));

            const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

            expect(result).toBeNull();
          });
        });
      });

      describe("with data available", () => {
        it("should return the correct gtm data along with swimlane title", () => {
          setup({ runnerTree: racingRunnerTree });

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, {
            cardGroupTitle: "cardGroupTitle",
            horizontalPosition: 1,
            verticalPosition: 2,
          });

          expect(result).toEqual({
            event: "ga_event",
            category: "betting",
            action: "added selection",
            label: "horse racing",
            cd3: `EVENT - primary swimlane - cardGroupTitle - Match Odds - null`,
            cd5: "horse racing",
            cd6: "Meeting Name",
            cd7: "17:00 Newcastle",
            cd8: "Match Odds",
            cd11: "back",
            cd14: 7,
            cd42: 1,
            cd43: 1,
            cd67: 2,
            cd79: "no",
            cd84: "raceId",
            cd85: "https://www.betfair.com/",
            cd101: 1,
            cd102: 123,
            cd112: 2.1,
            cd129: "meetingId",
            cd130: "uniqueId",
            cd131: "no",
            cd132: "Porto",
          });
        });

        it("should return secondary swimlane when the clicked card is HighlightedSelectionCard", () => {
          setup({ runnerTree: racingRunnerTree });
          getBettableCardByURN.mockReturnValue({ typename: "HighlightedSelectionCard" });

          const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

          expect(result).toEqual({
            event: "ga_event",
            category: "betting",
            action: "added selection",
            label: "horse racing",
            cd3: "EVENT - secondary swimlane - In-Play - Match Odds - Acca Builder",
            cd5: "horse racing",
            cd6: "Meeting Name",
            cd7: "17:00 Newcastle",
            cd8: "Match Odds",
            cd11: "back",
            cd14: 7,
            cd42: 1,
            cd43: 1,
            cd67: 2,
            cd79: "no",
            cd84: "raceId",
            cd85: "https://www.betfair.com/",
            cd101: 1,
            cd102: 123,
            cd112: 2.1,
            cd129: "meetingId",
            cd130: "uniqueId",
            cd131: "no",
            cd132: "Porto",
          });
        });
      });
    });

    describe("if it is an oddsboost racing market", () => {
      it("should return the correct gtm data", () => {
        setup({
          runnerTree: {
            ...defaultRunnerTree,
            market: { ...defaultRunnerTree.market, isOddsboostMarketType: true, hierarchy: { sportevent: "eventURN" } },
            sport: { sportId: 7, name: "horse racing" },
          },
        });

        const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

        expect(result).toEqual({
          event: "ga_event",
          category: "betting",
          action: "added selection",
          label: "horse racing",
          cd3: "EVENT - primary swimlane - In-Play - Match Odds - Acca Builder",
          cd5: "horse racing",
          cd6: null,
          cd7: "Sporting vs Porto",
          cd8: "Match Odds",
          cd11: "back",
          cd14: 7,
          cd42: 1,
          cd43: 1,
          cd67: 2,
          cd79: "no",
          cd84: 2,
          cd85: "https://www.betfair.com/",
          cd101: 1,
          cd102: 123,
          cd112: 2.1,
          cd129: null,
          cd130: "uniqueId",
          cd131: "no",
          cd132: "Porto",
        });
      });
    });

    describe("if it is a virtual market", () => {
      it("should return the correct gtm data", () => {
        setup({
          runnerTree: {
            ...defaultRunnerTree,
            market: { ...defaultRunnerTree.market, isOddsboostMarketType: true, hierarchy: { sportevent: "eventURN" } },
            sport: { sportId: 7, name: "horse racing" },
          },
        });

        const result = getSportsbookAddSelectionToBetslip(appState, virtualAction, metadata);

        expect(result).toEqual({
          event: "ga_event",
          category: "betting",
          action: "added selection",
          label: "virtual:some virtual sport name",
          cd3: "EVENT - primary swimlane - In-Play - virtual market name - Acca Builder",
          cd5: "virtual:some virtual sport name",
          cd6: "some virtual event",
          cd7: "some virtual event",
          cd8: "virtual market name",
          cd11: "back",
          cd14: 9999,
          cd42: 1,
          cd43: 1,
          cd67: 2,
          cd79: "no",
          cd84: 1337,
          cd85: "https://www.betfair.com/",
          cd101: 123,
          cd102: 123456,
          cd112: 2.1,
          cd129: 1337,
          cd130: "uniqueId",
          cd131: "no",
          cd132: "some virtual runner",
        });
      });
    });

    describe("when the card is MatchStatSelectionCard", () => {
      beforeEach(() => {
        setup();
        getBettableCardByURN.mockReturnValue({ typename: "MatchStatSelectionCard" });
      });

      it("should set the label to 'obp'", () => {
        const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

        expect(result.label).toBe("obp");
      });

      it("should set the module correctly", () => {
        const result = getSportsbookAddSelectionToBetslip(appState, realAction, metadata);

        expect(result.cd3).toBe("EVENT - primary swimlane - In-Play - obp");
      });
    });
  });

  describe("getAutoConfirmSportsbookBetClickEvent", () => {
    it("should return the correct GTM data", () => {
      expect(getAutoConfirmSportsbookBetClickEvent()).toEqual({
        event: "ga_event",
        category: "betting",
        action: "auto confirmed bet",
        label: "place bet",
        cd3: "betslip",
        cd11: "back",
      });
    });
  });

  describe("getBetslipBetBuilderAddSelections", () => {
    const appState = {
      betting: {
        sportsbookBetting: {
          legs: {
            legId1: "some leg",
          },
        },
      },
      entities: {
        competitions: "competitions",
        sportevents: "sportevents",
      },
      layouts: {
        views: "views",
        cards: "cards",
      },
      router: {
        currentUrn: "ppb:tbd:view:event:123",
      },
    };

    const action = {
      payload: {
        selection: { runnerUrn: "runner:urn", marketUrn: "market:urn" },
        odds: { decimal: 2.1 },
        cardUrn: "card:urn",
        betOriginURL: "origin/url",
      },
    };

    const market = {
      sport: "sport:urn",
      runners: [{ urn: "runner:urn", selectionId: 123 }],
      hierarchy: {
        sportevent: "sportevent:urn",
        competition: "competition:urn",
      },
    };

    const defaultMarketTree = {
      marketRunner: { selectionId: 123, name: "Porto" },
      market: { ...market, marketId: 1, name: "Match Odds" },
      sport: { sportId: 4, name: "football" },
    };

    const getViewTypeSelector = jest.fn().mockReturnValue("EVENT");

    const setup = ({ marketTree = defaultMarketTree } = {}) => {
      generateRunnerId.mockReturnValue("runner:tuple");
      getSportsbookMarketTree.mockReturnValue(marketTree);
      getCompetitionByURN.mockReturnValue({ competitionId: 3, name: "Primeira Liga" });
      getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
      createViewTypeSelector.mockImplementation(() => getViewTypeSelector);
    };

    beforeEach(jest.clearAllMocks);

    describe("with missing data", () => {
      describe("when runner tree is null", () => {
        it("should return null", () => {
          setup();
          getSportsbookRunnerTree.mockReturnValue(null, metadata);
          getSportsbookMarketTree.mockReturnValue(null, metadata);

          const result = getBetslipBetBuilderAddSelections(appState, action, metadata, "");

          expect(getSportsbookRunnerTree).toHaveBeenCalledWith(appState, "market:urn");
          expect(getSportsbookRunnerTree).toHaveBeenCalledTimes(1);
          expect(getSportsbookMarketTree).toHaveBeenCalledWith(appState, "market:urn", "runner:urn");
          expect(getSportsbookMarketTree).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("without competition id", () => {
        it("should return null", () => {
          setup();
          getCompetitionByURN.mockReturnValue({});

          const result = getBetslipBetBuilderAddSelections(appState, action, metadata, "");

          expect(result).toBeNull();
        });
      });

      describe("without event id", () => {
        it("should return null", () => {
          setup();
          getSportEventByURN.mockReturnValue({});

          const result = getBetslipBetBuilderAddSelections(appState, action, metadata, "");

          expect(result).toBeNull();
        });
      });
    });

    describe("with data available", () => {
      describe("inplay", () => {
        it("should return 'yes' if it's inplay", () => {
          setup({
            marketTree: {
              ...defaultMarketTree,
              market: {
                ...market,
                marketId: 1,
                name: "Match Odds",
                inplay: true,
              },
            },
          });

          const result = getBetslipBetBuilderAddSelections(appState, action, metadata, "");

          expect(result.cd79).toBe("yes");
        });

        it("should return 'no' if it's NOT inplay", () => {
          setup({
            marketTree: {
              ...defaultMarketTree,
              market: { ...market, marketId: 1, name: "Match Odds", inplay: false },
            },
          });

          const result = getBetslipBetBuilderAddSelections(appState, action, metadata, "");

          expect(result.cd79).toBe("no");
        });
      });

      describe("when I have card position info", () => {
        it("should return the correct gtm data", () => {
          setup();

          const result = getBetslipBetBuilderAddSelections(appState, action, metadata, "uniqueId");

          expect(result).toEqual({
            event: "ga_event",
            category: "betting",
            action: "added selection",
            label: "football",
            cd3: "EVENT - primary swimlane - In-Play | popular multiples title - Match Odds - Acca Builder",
            cd5: "football",
            cd6: "Primeira Liga",
            cd7: "Sporting vs Porto",
            cd8: "Match Odds",
            cd11: "back",
            cd14: 4,
            cd42: 1,
            cd43: 1,
            cd51: "betslip",
            cd67: 2,
            cd79: "no",
            cd84: 2,
            cd85: "https://www.betfair.com/betting",
            cd101: 1,
            cd102: 123,
            cd112: 2.1,
            cd129: 3,
            cd130: "uniqueId",
            cd131: "no",
            cd132: "Porto",
            cd133: null,
            cd134: null,
            cd135: null,
          });
        });
      });

      describe("when I do not have card position info", () => {
        it("should return the correct gtm data with card position dimensions as null", () => {
          setup();

          const result = getBetslipBetBuilderAddSelections(
            appState,
            action,
            { cardGroupTitle: "In-Play", tabName: "Acca Builder" },
            "uniqueId",
          );

          expect(result).toEqual({
            event: "ga_event",
            category: "betting",
            action: "added selection",
            label: "football",
            cd3: "EVENT - primary swimlane - In-Play | popular multiples title - Match Odds - Acca Builder",
            cd5: "football",
            cd6: "Primeira Liga",
            cd7: "Sporting vs Porto",
            cd8: "Match Odds",
            cd11: "back",
            cd14: 4,
            cd42: null,
            cd43: null,
            cd51: "betslip",
            cd67: null,
            cd79: "no",
            cd84: 2,
            cd85: "https://www.betfair.com/betting",
            cd101: 1,
            cd102: 123,
            cd112: 2.1,
            cd129: 3,
            cd130: "uniqueId",
            cd131: "no",
            cd132: "Porto",
            cd133: null,
            cd134: null,
            cd135: null,
          });
        });
      });
    });
  });

  describe("getBetslipBetBuilderRemoveSelections", () => {
    const appState = {
      betting: {
        sportsbookBetting: {
          legs: {
            legId1: "some leg",
          },
        },
      },
      entities: {
        competitions: "competitions",
        sportevents: "sportevents",
      },
      layouts: {
        views: "views",
        cards: "cards",
      },
      router: {
        currentUrn: "ppb:tbd:view:event:123",
      },
    };

    const action = {
      payload: {
        selection: { runnerUrn: "runner:urn", marketUrn: "market:urn" },
      },
    };

    const market = {
      sport: "sport:urn",
      hierarchy: {
        sportevent: "sportevent:urn",
        competition: "competition:urn",
      },
    };

    const defaultMarketTree = {
      marketRunner: { selectionId: 123, name: "Porto" },
      market: { ...market, marketId: 1, name: "Match Odds", inplay: false },
      sport: { sportId: 4, name: "football" },
    };

    const getViewTypeSelector = jest.fn().mockReturnValue("EVENT");

    const setup = ({ marketTree = defaultMarketTree } = {}) => {
      getSportsbookMarketTree.mockReturnValue(marketTree);
      getSportEventByURN.mockReturnValue({ eventId: 2, name: "Sporting vs Porto" });
      createViewTypeSelector.mockImplementation(() => getViewTypeSelector);
    };

    beforeEach(jest.clearAllMocks);

    describe("with missing data", () => {
      describe("when runner tree is null", () => {
        it("should return null", () => {
          setup();
          getSportsbookMarketTree.mockReturnValue(null, metadata);
          const result = getBetslipBetBuilderRemoveSelections(appState, metadata, action);

          expect(getSportsbookMarketTree).toHaveBeenCalledWith(appState, "market:urn", "runner:urn");
          expect(getSportsbookMarketTree).toHaveBeenCalledTimes(1);
          expect(result).toBeNull();
        });
      });

      describe("without event name", () => {
        it("should return null", () => {
          setup({
            marketTree: {
              ...defaultMarketTree,
              market: {
                ...market,
                isOddsboostMarketType: true,
                hierarchy: { sportevent: "eventURN" },
              },
            },
          });
          getSportEventByURN.mockReturnValue({});

          const result = getBetslipBetBuilderRemoveSelections(appState, metadata, action);

          expect(result).toBeNull();
        });
      });
    });

    describe("with data available", () => {
      it("should return the correct gtm data", () => {
        setup({
          marketTree: {
            ...defaultMarketTree,
            market: {
              ...market,
              isOddsboostMarketType: true,
              hierarchy: { sportevent: "eventURN" },
            },
          },
        });

        const result = getBetslipBetBuilderRemoveSelections(appState, metadata, action);

        expect(result).toEqual({
          event: "ga_event",
          category: "betting",
          action: "removed all selections",
          label: "football",
          cd3: "Acca Builder - In-Play | popular multiples title - Sporting vs Porto",
        });
      });
    });
  });

  describe("getBetslipSportsbookLoginToPlaceBetClickEvent", () => {
    it("should return the correct GTM data", () => {
      expect(getBetslipSportsbookLoginToPlaceBetClickEvent()).toEqual({
        event: "ga_event",
        category: "betting",
        action: "submitted bet",
        label: "login & place bet",
        cd3: "betslip",
        cd11: "back",
        cd99: null,
      });
    });
  });
});
