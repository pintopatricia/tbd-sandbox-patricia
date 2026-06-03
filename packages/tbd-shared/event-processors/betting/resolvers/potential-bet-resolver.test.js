import { UI__CLOSED_SBK_CLICK, UI__SUSPENDED_SBK_CLICK } from "@ppb/tbd-store/actions/sportsbook-markets";
import { getStore } from "@ppb/tbd-store/create-store";
import {
  addBettingOpportunityToBetslip,
  addChatbotSelectionsToBetslip,
  dispatchMarketSportsbookBetButtonClickAction,
  getPopularSelectionsCardBetButtonAdder,
  getSingleBetButtonAdder,
  getSingleSelectionPromoAdder,
  getUpsellSelectionAdder,
  mapSportsbookOdds,
  prefetchBatchSportsbookMarkets,
  prefetchSportsbookMarket,
  potentialBetResolver,
} from "./potential-bet-resolver";
import { getApolloClient } from "../../../apollo-client/client";
import { SportsbookRunnerLiveDataPotentialBetUpdateFragment } from "./SportsbookRunnerLiveData.graphql";

jest.mock("../../../apollo-client/client", () => {
  const writeFragment = jest.fn();

  return {
    getApolloClient: jest.fn(() => ({
      cache: {
        writeFragment,
      },
    })),
  };
});

jest.mock("@ppb/tbd-urn-codecs", () => ({
  sportsbookRunnerCodec: {
    encode: jest.fn((marketId, selectionId) => ({ referenceId: `${marketId}/${selectionId}` })),
  },
  sbkRunnerLiveDataCodec: {
    encode: jest.fn((referenceId) => ({ uid: `ppb:tbd:sbkRunnerLiveData:${referenceId}` })),
  },
}));

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({
    entities: {
      sportsbookmarkets: {},
      sportsbookrunners: {},
    },
  }));

  return {
    getStore: jest.fn(() => ({
      dispatch,
      getState,
    })),
  };
});

Object.defineProperty(window, "location", {
  configurable: true,
  value: {
    href: "https://www.betfair.com/betting",
  },
});

describe("potential-bet-resolver", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getStore().getState.mockReturnValue({
      entities: {
        sportsbookmarkets: {},
        sportsbookrunners: {},
      },
    });
  });

  describe("getSingleSelectionPromoAdder", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should dispatch the correct actions", () => {
      const addSingleToBetslip = getSingleSelectionPromoAdder("ppb:card:1", "ppb:market:1", "ppb:runner:1", {
        decimal: 1.2,
      });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        payload: {
          group: "REAL",
          urns: ["ppb:market:1"],
        },
        type: "BETTING/SBK_MARKETS_REQUEST",
      });

      addSingleToBetslip();

      jest.runAllTimers();

      expect(getStore().dispatch).toHaveBeenCalledWith({
        payload: { product: "Sportsbook" },
        type: "UI/BETSLIP_OPEN",
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "UI/BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION",
        payload: { urn: "ppb:runner:1" },
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "UI/BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION",
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "UI/MARKET_SBK_BET_BUTTON_CLICK",
        payload: {
          odds: { decimal: 1.2 },
          urn: "ppb:runner:1",
          uniqueId: "",
          group: "REAL",
          cardUrn: "ppb:card:1",
          betOriginURL: "https://www.betfair.com/betting",
        },
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "BETTING/REMOVE_ALL_POTENTIAL_BETS_ACTION",
      });
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "BETTING/SBK_TOGGLE_LEG_ACTION",
        payload: {
          urn: "ppb:runner:1",
          odds: { decimal: 1.2 },
          group: "REAL",
        },
      });
    });

    it("should not dispatch any actions if odds are null", () => {
      const addSingleToBetslip = getSingleSelectionPromoAdder("ppb:card:1", "ppb:market:1", "ppb:runner:1", null);

      addSingleToBetslip();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("getSingleBetButtonAdder", () => {
    it("dispatches the standard sportsbook single-add flow", () => {
      const addSingleToBetslip = getSingleBetButtonAdder("ppb:runner:1", { decimal: 1.2 }, "open");

      addSingleToBetslip();

      expect(getStore().dispatch).toHaveBeenNthCalledWith(1, {
        payload: { product: "Sportsbook" },
        type: "UI/BETSLIP_OPEN",
      });
      expect(getStore().dispatch).toHaveBeenNthCalledWith(2, {
        type: "UI/BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION",
        payload: { urn: "ppb:runner:1" },
      });
      expect(getStore().dispatch).toHaveBeenNthCalledWith(3, {
        type: "UI/BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION",
      });
      expect(getStore().dispatch).toHaveBeenNthCalledWith(4, {
        type: "BETTING/REMOVE_ALL_POTENTIAL_BETS_ACTION",
      });
      expect(getStore().dispatch).toHaveBeenNthCalledWith(5, {
        type: "BETTING/SBK_TOGGLE_LEG_ACTION",
        payload: {
          urn: "ppb:runner:1",
          odds: { decimal: 1.2 },
          group: "REAL",
        },
      });
    });

    it("dispatches the closed action instead of adding to betslip", () => {
      const addSingleToBetslip = getSingleBetButtonAdder("ppb:runner:1", { decimal: 1.2 }, "closed");

      addSingleToBetslip();

      expect(getStore().dispatch).toHaveBeenCalledTimes(1);
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: UI__CLOSED_SBK_CLICK,
      });
    });

    it("dispatches the suspended action instead of adding to betslip", () => {
      const addSingleToBetslip = getSingleBetButtonAdder("ppb:runner:1", { decimal: 1.2 }, "suspended");

      addSingleToBetslip();

      expect(getStore().dispatch).toHaveBeenCalledTimes(1);
      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: UI__SUSPENDED_SBK_CLICK,
      });
    });

    it("returns a noop when odds are missing", () => {
      const addSingleToBetslip = getSingleBetButtonAdder("ppb:runner:1", null, "open");

      addSingleToBetslip();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("returns a noop when the runner urn is missing", () => {
      const addSingleToBetslip = getSingleBetButtonAdder("", { decimal: 1.2 }, "open");

      addSingleToBetslip();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("getUpsellSelectionAdder", () => {
    it("dispatches toggle leg and collapse actions when called", () => {
      const toggleSelection = getUpsellSelectionAdder("ppb:runner:1", { decimal: 1.5 });

      toggleSelection();

      expect(getStore().dispatch).toHaveBeenCalledTimes(2);
      expect(getStore().dispatch).toHaveBeenNthCalledWith(1, {
        type: "BETTING/SBK_TOGGLE_LEG_ACTION",
        payload: {
          urn: "ppb:runner:1",
          odds: { decimal: 1.5 },
          group: "REAL",
        },
      });
      expect(getStore().dispatch).toHaveBeenNthCalledWith(2, {
        type: "BETSLIP/SET_COLLAPSE_ACTION",
        payload: {
          collapse: false,
        },
      });
    });

    it("converts null fractional to undefined before dispatching", () => {
      const toggleSelection = getUpsellSelectionAdder("ppb:runner:1", { decimal: 2.0, fractional: null });

      toggleSelection();

      expect(getStore().dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "BETTING/SBK_TOGGLE_LEG_ACTION",
          payload: expect.objectContaining({
            odds: { decimal: 2.0, fractional: undefined },
          }),
        }),
      );
    });

    it("prefetches sportsbook market when marketUrn is provided", () => {
      getUpsellSelectionAdder("ppb:runner:1", { decimal: 1.5 }, "ppb:market:1");

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "BETTING/SBK_MARKETS_REQUEST",
        payload: {
          urns: ["ppb:market:1"],
          group: "REAL",
        },
      });
    });

    it("does not prefetch when marketUrn is not provided", () => {
      getUpsellSelectionAdder("ppb:runner:1", { decimal: 1.5 });

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("returns a noop when odds are null", () => {
      const toggleSelection = getUpsellSelectionAdder("ppb:runner:1", null);

      toggleSelection();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("returns a noop when runnerUrn is empty", () => {
      const toggleSelection = getUpsellSelectionAdder("", { decimal: 1.5 });

      toggleSelection();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("potentialBetResolver", () => {
    it("should set isPotentialBet to true when state is ADDED", () => {
      potentialBetResolver("926.123456", 1, "ADDED");

      expect(getApolloClient().cache.writeFragment).toHaveBeenCalledWith({
        fragment: SportsbookRunnerLiveDataPotentialBetUpdateFragment,
        data: {
          __typename: "SportsbookRunnerLiveData",
          urn: "ppb:tbd:sbkRunnerLiveData:926.123456/1",
          isPotentialBet: true,
        },
      });
    });

    it("should set isPotentialBet to false when state is REMOVED", () => {
      potentialBetResolver("926.123456", 1, "REMOVED");

      expect(getApolloClient().cache.writeFragment).toHaveBeenCalledWith({
        fragment: SportsbookRunnerLiveDataPotentialBetUpdateFragment,
        data: {
          __typename: "SportsbookRunnerLiveData",
          urn: "ppb:tbd:sbkRunnerLiveData:926.123456/1",
          isPotentialBet: false,
        },
      });
    });
  });

  describe("prefetchSportsbookMarket", () => {
    it("requests the market when it is not hydrated", () => {
      prefetchSportsbookMarket("ppb:market:1");

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "BETTING/SBK_MARKETS_REQUEST",
        payload: {
          urns: ["ppb:market:1"],
          group: "REAL",
        },
      });
    });

    it("does not request the market when all runner data is already in state", () => {
      getStore().getState.mockReturnValue({
        entities: {
          sportsbookmarkets: {
            "ppb:market:1": {
              runners: [{ urn: "ppb:runner:1" }, { urn: "ppb:runner:2" }],
            },
          },
          sportsbookrunners: {
            "ppb:runner:1": { urn: "ppb:runner:1" },
            "ppb:runner:2": { urn: "ppb:runner:2" },
          },
        },
      });

      prefetchSportsbookMarket("ppb:market:1");

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("does not dispatch when marketUrn is an empty string", () => {
      prefetchSportsbookMarket("");

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("prefetchBatchSportsbookMarkets", () => {
    it("requests the markets when they are not hydrated", () => {
      prefetchBatchSportsbookMarkets(["ppb:market:1", "ppb:market:2"]);

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "BETTING/SBK_MARKETS_REQUEST",
        payload: {
          urns: ["ppb:market:1", "ppb:market:2"],
          group: "REAL",
        },
      });
    });

    it("does not request the market when all runner data is already in state", () => {
      getStore().getState.mockReturnValue({
        entities: {
          sportsbookmarkets: {
            "ppb:market:1": {
              runners: [{ urn: "ppb:runner:1" }, { urn: "ppb:runner:2" }],
            },
            "ppb:market:2": {
              runners: [{ urn: "ppb:runner:3" }, { urn: "ppb:runner:4" }],
            },
          },
          sportsbookrunners: {
            "ppb:runner:1": { urn: "ppb:runner:1" },
            "ppb:runner:2": { urn: "ppb:runner:2" },
            "ppb:runner:3": { urn: "ppb:runner:3" },
            "ppb:runner:4": { urn: "ppb:runner:4" },
          },
        },
      });

      prefetchBatchSportsbookMarkets(["ppb:market:1", "ppb:market:2"]);

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("does not dispatch when marketUrns is an empty array", () => {
      prefetchBatchSportsbookMarkets([]);

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("dispatchMarketSportsbookBetButtonClickAction", () => {
    it("dispatches UI__MARKET_SBK_BET_BUTTON_CLICK when odds are provided", () => {
      dispatchMarketSportsbookBetButtonClickAction("ppb:runner:1", "ppb:card:1", { decimal: 2.5 });

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "UI/MARKET_SBK_BET_BUTTON_CLICK",
        payload: {
          odds: { decimal: 2.5 },
          urn: "ppb:runner:1",
          uniqueId: "",
          group: "REAL",
          cardUrn: "ppb:card:1",
          betOriginURL: "https://www.betfair.com/betting",
        },
      });
    });

    it("does nothing when odds are not provided", () => {
      dispatchMarketSportsbookBetButtonClickAction("ppb:runner:1", "ppb:card:1", undefined);

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("getPopularSelectionsCardBetButtonAdder", () => {
    it("dispatches UI__MARKET_SBK_BET_BUTTON_CLICK when the returned function is called", () => {
      const cardMetadata = { cardUrn: "ppb:card:1", typename: "PopularSelectionsCard" };
      const addBet = getPopularSelectionsCardBetButtonAdder("ppb:runner:1", { decimal: 3.0 }, cardMetadata);

      addBet();

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "UI/MARKET_SBK_BET_BUTTON_CLICK",
        payload: {
          odds: { decimal: 3.0 },
          urn: "ppb:runner:1",
          uniqueId: "",
          group: "REAL",
          cardUrn: "ppb:card:1",
          betOriginURL: "https://www.betfair.com/betting",
          cardMetadata,
        },
      });
    });

    it("strips null fractional odds before dispatching", () => {
      const addBet = getPopularSelectionsCardBetButtonAdder(
        "ppb:runner:1",
        { decimal: 3.0, fractional: null },
        { cardUrn: "ppb:card:1", typename: "PopularSelectionsCard" },
      );

      addBet();

      expect(getStore().dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ odds: { decimal: 3.0, fractional: undefined } }),
        }),
      );
    });

    it("returns a noop when odds are falsy", () => {
      const addBet = getPopularSelectionsCardBetButtonAdder("ppb:runner:1", null, {
        cardUrn: "ppb:card:1",
        typename: "PopularSelectionsCard",
      });

      addBet();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("returns a noop when runnerUrn is empty", () => {
      const addBet = getPopularSelectionsCardBetButtonAdder(
        "",
        { decimal: 3.0 },
        { cardUrn: "ppb:card:1", typename: "PopularSelectionsCard" },
      );

      addBet();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("returns a noop when cardUrn is empty", () => {
      const addBet = getPopularSelectionsCardBetButtonAdder(
        "ppb:runner:1",
        { decimal: 3.0 },
        { cardUrn: "", typename: "PopularSelectionsCard" },
      );

      addBet();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });

    it("returns a noop when cardUrn is undefined", () => {
      const addBet = getPopularSelectionsCardBetButtonAdder(
        "ppb:runner:1",
        { decimal: 3.0 },
        { typename: "PopularSelectionsCard" },
      );

      addBet();

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("addBettingOpportunityToBetslip", () => {
    it("dispatches BETTING__SBK_ADD_SELECTIONS with the correct payload", () => {
      const selections = [
        { marketUrn: "ppb:market:1", runnerUrn: "ppb:runner:1" },
        { marketUrn: "ppb:market:2", runnerUrn: "ppb:runner:2" },
      ];

      addBettingOpportunityToBetslip("ppb:card:1", selections, "opp-123", "BOOSTED_BETS");

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "BETTING/SBK_ADD_SELECTIONS",
        payload: {
          selections,
          group: "REAL",
          bettingOpportunityId: "opp-123",
          bettingOpportunityType: "BOOSTED_BETS",
          cardUrn: "ppb:card:1",
        },
      });
    });

    it("passes undefined for bettingOpportunityType when null is provided", () => {
      addBettingOpportunityToBetslip("ppb:card:1", [], "opp-123", null);

      expect(getStore().dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ bettingOpportunityType: undefined }),
        }),
      );
    });
  });

  describe("addChatbotSelectionsToBetslip", () => {
    const selections = [
      { marketUrn: "ppb:tbd:market:926.123456", runnerUrn: "ppb:tbd:sportsbookRunner:926.123456/1" },
      { marketUrn: "ppb:tbd:market:926.123456", runnerUrn: "ppb:tbd:sportsbookRunner:926.123456/2" },
    ];

    it("dispatches BETTING__SBK_ADD_SELECTIONS with chatbot cardMetadata and mapped odds", () => {
      addChatbotSelectionsToBetslip(selections, "ppb:card:chatbot:1", { decimal: 2.5, fractional: null }, 3);

      expect(getStore().dispatch).toHaveBeenCalledWith({
        type: "BETTING/SBK_ADD_SELECTIONS",
        payload: {
          selections,
          group: "REAL",
          cardUrn: "ppb:card:chatbot:1",
          cardMetadata: {
            typename: "SportsbookChatbotCard",
            title: "bets you can explore",
            horizontalPosition: 3,
          },
          odds: { decimal: 2.5, fractional: undefined },
        },
      });
    });

    it("passes undefined horizontalPosition when not provided", () => {
      addChatbotSelectionsToBetslip(selections, "ppb:card:chatbot:1", { decimal: 2.5 });

      expect(getStore().dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            cardMetadata: expect.objectContaining({ horizontalPosition: undefined }),
          }),
        }),
      );
    });

    it("passes undefined odds when null is provided", () => {
      addChatbotSelectionsToBetslip(selections, "ppb:card:chatbot:1", null, 0);

      expect(getStore().dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ odds: undefined }),
        }),
      );
    });

    it("does not dispatch when the selections array is empty", () => {
      addChatbotSelectionsToBetslip([], "ppb:card:chatbot:1", { decimal: 2.5 }, 1);

      expect(getStore().dispatch).not.toHaveBeenCalled();
    });
  });

  describe("mapSportsbookOdds", () => {
    it("returns undefined when odds are null", () => {
      expect(mapSportsbookOdds(null)).toBeUndefined();
    });

    it("converts null fractional to undefined while preserving decimal", () => {
      expect(mapSportsbookOdds({ decimal: 2.5, fractional: null })).toEqual({
        decimal: 2.5,
        fractional: undefined,
      });
    });

    it("preserves a populated fractional value as-is", () => {
      expect(mapSportsbookOdds({ decimal: 4.0, fractional: { numerator: 3, denominator: 1 } })).toEqual({
        decimal: 4.0,
        fractional: { numerator: 3, denominator: 1 },
      });
    });
  });

  describe("getSingleBetButtonAdder — odds mapping", () => {
    it("preserves fractional odds when they are provided", () => {
      const addSingleToBetslip = getSingleBetButtonAdder(
        "ppb:runner:1",
        { decimal: 4.0, fractional: { numerator: 3, denominator: 1 } },
        "open",
      );

      addSingleToBetslip();

      expect(getStore().dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "BETTING/SBK_TOGGLE_LEG_ACTION",
          payload: expect.objectContaining({
            odds: { decimal: 4.0, fractional: { numerator: 3, denominator: 1 } },
          }),
        }),
      );
    });

    it("converts null fractional to undefined before dispatching", () => {
      const addSingleToBetslip = getSingleBetButtonAdder("ppb:runner:1", { decimal: 2.0, fractional: null }, "open");

      addSingleToBetslip();

      expect(getStore().dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "BETTING/SBK_TOGGLE_LEG_ACTION",
          payload: expect.objectContaining({
            odds: { decimal: 2.0, fractional: undefined },
          }),
        }),
      );
    });
  });
});
