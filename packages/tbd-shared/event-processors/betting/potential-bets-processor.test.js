import subscribeEvent, { once } from "../../event-broker/event-subscriber";
import register from "./potential-bets-processor";
import { addLotteriesBetToBetslip } from "./resolvers/lotteries-bets-resolver";
import { addMonterosaSelectionsToBetslip } from "./resolvers/monterosa-bets-resolver";
import {
  addBettingOpportunityToBetslip,
  addChatbotSelectionsToBetslip,
  dispatchMarketSportsbookBetButtonClickAction,
  getPopularSelectionsCardBetButtonAdder,
  getPopularSelectionsSwipeRightAdder,
  getSingleBetButtonAdder,
  getSingleSelectionPromoAdder,
  getUpsellSelectionAdder,
  openBetslip,
  mapSportsbookOdds,
  prefetchSportsbookMarket,
  prefetchBatchSportsbookMarkets,
  potentialBetResolver,
} from "./resolvers/potential-bet-resolver";

jest.mock("../../event-broker/event-subscriber", () => {
  const subscribe = jest.fn();
  const once = jest.fn();

  return Object.assign(subscribe, {
    __esModule: true,
    default: subscribe,
    once,
  });
});

jest.mock("./resolvers/potential-bet-resolver", () => ({
  addBettingOpportunityToBetslip: jest.fn(),
  addChatbotSelectionsToBetslip: jest.fn(),
  dispatchMarketSportsbookBetButtonClickAction: jest.fn(),
  getPopularSelectionsCardBetButtonAdder: jest.fn(() => jest.fn()),
  getPopularSelectionsSwipeRightAdder: jest.fn(() => jest.fn()),
  getSingleBetButtonAdder: jest.fn(() => jest.fn()),
  getSingleSelectionPromoAdder: jest.fn(() => jest.fn()),
  getUpsellSelectionAdder: jest.fn(() => jest.fn()),
  openBetslip: jest.fn(),
  mapSportsbookOdds: jest.fn((odds) => (odds ? { decimal: odds.decimal, fractional: undefined } : undefined)),
  prefetchSportsbookMarket: jest.fn(),
  prefetchBatchSportsbookMarkets: jest.fn(),
  potentialBetResolver: jest.fn(),
}));

jest.mock("./resolvers/lotteries-bets-resolver", () => ({
  addLotteriesBetToBetslip: jest.fn(),
}));

jest.mock("./resolvers/monterosa-bets-resolver", () => ({
  addMonterosaSelectionsToBetslip: jest.fn(),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  parseURN: jest.fn((urn) => ({ urn })),
  sportsbookMarketCodec: {
    decode: jest.fn((marketUrn) => `market-id-for-${marketUrn}`),
  },
  sportsbookRunnerCodec: {
    extract: jest.fn(({ urn }) => ({ selectionId: Number(urn.split(":").pop()) })),
  },
}));

describe("potential-bets-processor", () => {
  describe("register", () => {
    const getSubscriptionCallback = (eventType) => {
      const subscription = subscribeEvent.mock.calls.find(([registeredEventType]) => registeredEventType === eventType);

      return subscription?.[1];
    };

    beforeEach(() => {
      jest.clearAllMocks();

      register();
    });

    describe("when event is @@UI/SELECTION_PROMO_CARD_PROMO_TAP", () => {
      it("should call getSingleAdder and register once callback", () => {
        const mockAddSingle = jest.fn();
        getSingleSelectionPromoAdder.mockReturnValue(mockAddSingle);

        const callback = getSubscriptionCallback("@@UI/SELECTION_PROMO_CARD_PROMO_TAP");

        callback({
          urn: "ppb:card:1",
          marketUrn: "ppb:market:1",
          runnerUrn: "ppb:runner:1",
          odds: 1.0,
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/SELECTION_PROMO_CARD_PROMO_TAP", expect.any(Function));
        expect(getSingleSelectionPromoAdder).toHaveBeenCalledWith("ppb:card:1", "ppb:market:1", "ppb:runner:1", 1.0);
        expect(once).toHaveBeenCalledWith("@@NETWORK/SBK_MARKETS_SUCCESS", expect.any(Function));

        const onceCallback = once.mock.calls[0][1];
        onceCallback();
        expect(mockAddSingle).toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/PRICE_BOOST_MULTIPLE_PROMO_CARD_PROMO_TAP", () => {
      it("should call addBettingOpportunityToBetslip", () => {
        const callback = getSubscriptionCallback("@@UI/PRICE_BOOST_MULTIPLE_PROMO_CARD_PROMO_TAP");

        callback({
          urn: "ppb:market:1",
          selections: [
            { marketUrn: "ppb:market:1", runnerUrn: "ppb:runner:1" },
            { marketUrn: "ppb:market:2", runnerUrn: "ppb:runner:2" },
          ],
          bettingOpportunityId: "1",
          bettingOpportunityType: "BOOSTED_BETS",
        });

        expect(subscribeEvent).toHaveBeenCalledWith(
          "@@UI/PRICE_BOOST_MULTIPLE_PROMO_CARD_PROMO_TAP",
          expect.any(Function),
        );
        expect(addBettingOpportunityToBetslip).toHaveBeenCalledWith(
          "ppb:market:1",
          [
            { marketUrn: "ppb:market:1", runnerUrn: "ppb:runner:1" },
            { marketUrn: "ppb:market:2", runnerUrn: "ppb:runner:2" },
          ],
          "1",
          "BOOSTED_BETS",
        );
      });
    });

    describe("when event is @@BETSLIP/ADD_LOTTERIES_TO_BETSLIP", () => {
      it("should call addLotteriesBetToBetslip", () => {
        const callback = getSubscriptionCallback("@@BETSLIP/ADD_LOTTERIES_TO_BETSLIP");

        callback({
          cardUrn: "ppb:card:lotto:1",
          runners: [{ selectionId: 1, runnerURN: "ppb:runner:1" }],
          markets: [{ urn: "ppb:market:1" }],
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@BETSLIP/ADD_LOTTERIES_TO_BETSLIP", expect.any(Function));
        expect(addLotteriesBetToBetslip).toHaveBeenCalledWith(
          "ppb:card:lotto:1",
          [{ urn: "ppb:market:1" }],
          ["ppb:runner:1"],
          [1],
        );
      });
    });

    describe("when event is @@BETSLIP/SBK_RUNNER_ADDED", () => {
      it("should call potentialBetResolver", () => {
        const callback = getSubscriptionCallback("@@BETSLIP/SBK_RUNNER_ADDED");

        callback({
          marketId: "1",
          selectionId: 1,
          status: "ADDED",
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@BETSLIP/SBK_RUNNER_ADDED", expect.any(Function));
        expect(potentialBetResolver).toHaveBeenCalledWith("1", 1, "ADDED");
      });
    });

    describe("when event is @@BETSLIP/SBK_RUNNER_REMOVED", () => {
      it("should call potentialBetResolver", () => {
        const callback = getSubscriptionCallback("@@BETSLIP/SBK_RUNNER_REMOVED");

        callback({
          marketId: "1",
          selectionId: 1,
          status: "REMOVED",
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@BETSLIP/SBK_RUNNER_REMOVED", expect.any(Function));
        expect(potentialBetResolver).toHaveBeenCalledWith("1", 1, "REMOVED");
      });
    });

    describe("when event is @@UI/SPORTSBOOK_BET_BUTTON_TAP", () => {
      it("subscribes the sportsbook bet button tap and delegates to the betslip handler", () => {
        const addSingleToBetslip = jest.fn();
        getSingleBetButtonAdder.mockReturnValue(addSingleToBetslip);

        const callback = getSubscriptionCallback("@@UI/SPORTSBOOK_BET_BUTTON_TAP");

        callback({
          urn: "ppb:runner:1",
          odds: 1.0,
          status: "open",
        });

        expect(getSingleBetButtonAdder).toHaveBeenCalledWith("ppb:runner:1", 1.0, "open");
        expect(addSingleToBetslip).toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/SPORTSBOOK_BET_BUTTON_VISIBILITY_CHANGED", () => {
      it("subscribes the visibility change event and prefetches visible markets", () => {
        const callback = getSubscriptionCallback("@@UI/SPORTSBOOK_BET_BUTTON_VISIBILITY_CHANGED");

        callback({
          visible: true,
          marketUrn: "ppb:market:1",
        });

        expect(prefetchSportsbookMarket).toHaveBeenCalledWith("ppb:market:1");
      });

      it("does not prefetch hidden markets", () => {
        const callback = getSubscriptionCallback("@@UI/SPORTSBOOK_BET_BUTTON_VISIBILITY_CHANGED");

        callback({
          visible: false,
          marketUrn: "ppb:market:1",
        });

        expect(prefetchSportsbookMarket).not.toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/SPORTSBOOK_CHATBOT_SINGLE_BET_SUGGESTION_TAP", () => {
      it("forwards chatbot-card attribution via dispatchMarketSportsbookBetButtonClickAction", () => {
        const callback = getSubscriptionCallback("@@UI/SPORTSBOOK_CHATBOT_SINGLE_BET_SUGGESTION_TAP");

        callback({
          runnerUrn: "ppb:runner:1",
          cardUrn: "ppb:card:chatbot:1",
          odds: { decimal: 2.5, fractional: null },
          metadata: { horizontalPosition: 3 },
        });

        expect(subscribeEvent).toHaveBeenCalledWith(
          "@@UI/SPORTSBOOK_CHATBOT_SINGLE_BET_SUGGESTION_TAP",
          expect.any(Function),
        );
        expect(mapSportsbookOdds).toHaveBeenCalledWith({ decimal: 2.5, fractional: null });
        expect(dispatchMarketSportsbookBetButtonClickAction).toHaveBeenCalledWith(
          "ppb:runner:1",
          "ppb:card:chatbot:1",
          { decimal: 2.5, fractional: undefined },
          {
            cardUrn: "ppb:card:chatbot:1",
            typename: "SportsbookChatbotCard",
            title: "bets you can explore",
            horizontalPosition: 3,
          },
        );
      });
    });

    describe("when event is @@UI/SPORTSBOOK_CHATBOT_MULTIPLE_BET_SUGGESTION_TAP", () => {
      it("calls potentialBetResolver for each selection and dispatches chatbot selections to betslip", () => {
        const callback = getSubscriptionCallback("@@UI/SPORTSBOOK_CHATBOT_MULTIPLE_BET_SUGGESTION_TAP");

        const selections = [
          { marketUrn: "ppb:market:1", runnerUrn: "ppb:runner:1" },
          { marketUrn: "ppb:market:2", runnerUrn: "ppb:runner:2" },
        ];
        const odds = { decimal: 2.5, fractional: null };

        callback({
          selections,
          odds,
          cardUrn: "ppb:card:chatbot:1",
          metadata: { horizontalPosition: 3 },
        });

        expect(subscribeEvent).toHaveBeenCalledWith(
          "@@UI/SPORTSBOOK_CHATBOT_MULTIPLE_BET_SUGGESTION_TAP",
          expect.any(Function),
        );
        expect(potentialBetResolver).toHaveBeenCalledTimes(2);
        expect(potentialBetResolver).toHaveBeenNthCalledWith(1, "market-id-for-ppb:market:1", 1, "ADDED");
        expect(potentialBetResolver).toHaveBeenNthCalledWith(2, "market-id-for-ppb:market:2", 2, "ADDED");
        expect(addChatbotSelectionsToBetslip).toHaveBeenCalledWith(selections, "ppb:card:chatbot:1", odds, 3);
      });
    });

    describe("when event is @@UI/POPULAR_SELECTIONS_VISIBILITY_CHANGED", () => {
      it("prefetches the market when visible", () => {
        const callback = getSubscriptionCallback("@@UI/POPULAR_SELECTIONS_VISIBILITY_CHANGED");

        callback({ visible: true, marketUrn: "ppb:market:1" });

        expect(prefetchSportsbookMarket).toHaveBeenCalledWith("ppb:market:1");
      });

      it("does not prefetch when not visible", () => {
        const callback = getSubscriptionCallback("@@UI/POPULAR_SELECTIONS_VISIBILITY_CHANGED");

        callback({ visible: false, marketUrn: "ppb:market:1" });

        expect(prefetchSportsbookMarket).not.toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/POPULAR_SELECTIONS_BET_BUTTON_TAP", () => {
      it("calls getPopularSelectionsCardBetButtonAdder and invokes the returned function", () => {
        const addPopularSelectionBet = jest.fn();
        getPopularSelectionsCardBetButtonAdder.mockReturnValue(addPopularSelectionBet);

        const callback = getSubscriptionCallback("@@UI/POPULAR_SELECTIONS_BET_BUTTON_TAP");

        callback({
          runnerUrn: "ppb:runner:1",
          odds: { decimal: 2.5 },
          cardMetadata: { typename: "PopularSelectionsCard", title: "Popular Selections", cardUrn: "ppb:card:1" },
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/POPULAR_SELECTIONS_BET_BUTTON_TAP", expect.any(Function));
        expect(getPopularSelectionsCardBetButtonAdder).toHaveBeenCalledWith(
          "ppb:runner:1",
          { decimal: 2.5 },
          { typename: "PopularSelectionsCard", title: "Popular Selections", cardUrn: "ppb:card:1" },
        );
        expect(addPopularSelectionBet).toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/POPULAR_SELECTIONS_SWIPE_RIGHT", () => {
      it("calls getPopularSelectionsSwipeRightAdder and invokes the returned function", () => {
        const addSwipeSelection = jest.fn();
        getPopularSelectionsSwipeRightAdder.mockReturnValue(addSwipeSelection);

        const callback = getSubscriptionCallback("@@UI/POPULAR_SELECTIONS_SWIPE_RIGHT");

        callback({
          runnerUrn: "ppb:runner:1",
          cardUrn: "ppb:card:1",
          odds: { decimal: 2.5 },
          status: "active",
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/POPULAR_SELECTIONS_SWIPE_RIGHT", expect.any(Function));
        expect(getPopularSelectionsSwipeRightAdder).toHaveBeenCalledWith(
          "ppb:runner:1",
          { decimal: 2.5 },
          "ppb:card:1",
          "active",
        );
        expect(addSwipeSelection).toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/POPULAR_SELECTIONS_CARD_VISIBILITY_CHANGED", () => {
      it("prefetches the market when visible", () => {
        const callback = getSubscriptionCallback("@@UI/POPULAR_SELECTIONS_CARD_VISIBILITY_CHANGED");

        callback({ visible: true, urn: "ppb:market:1" });

        expect(prefetchSportsbookMarket).toHaveBeenCalledWith("ppb:market:1");
      });

      it("does not prefetch when not visible", () => {
        const callback = getSubscriptionCallback("@@UI/POPULAR_SELECTIONS_CARD_VISIBILITY_CHANGED");

        callback({ visible: false, urn: "ppb:market:1" });

        expect(prefetchSportsbookMarket).not.toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/POPULAR_SELECTIONS_GO_TO_BETSLIP_TAP", () => {
      it("calls openBetslip", () => {
        const callback = getSubscriptionCallback("@@UI/POPULAR_SELECTIONS_GO_TO_BETSLIP_TAP");

        callback({ cardUrn: "ppb:card:1" });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/POPULAR_SELECTIONS_GO_TO_BETSLIP_TAP", expect.any(Function));
        expect(openBetslip).toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/UPSELL_SUGGESTIONS_ITEM_CLICK", () => {
      it("should call getUpsellSelectionAdder", () => {
        const toggleSelection = jest.fn();
        getUpsellSelectionAdder.mockReturnValue(toggleSelection);

        const callback = getSubscriptionCallback("@@UI/UPSELL_SUGGESTIONS_ITEM_CLICK");

        callback({
          marketUrn: "ppb:market:1",
          runnerUrn: "ppb:runner:1",
          odds: { decimal: 2.5 },
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/UPSELL_SUGGESTIONS_ITEM_CLICK", expect.any(Function));
        expect(getUpsellSelectionAdder).toHaveBeenCalledWith("ppb:runner:1", { decimal: 2.5 }, "ppb:market:1");
        expect(toggleSelection).toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/PENALTY_TAKERS_CARD_RUNNER_TAP", () => {
      it("subscribes the penalty takers card runner tap and delegates to the betslip handler", () => {
        const addSingleToBetslip = jest.fn();
        getSingleBetButtonAdder.mockReturnValue(addSingleToBetslip);

        const callback = getSubscriptionCallback("@@UI/PENALTY_TAKERS_CARD_RUNNER_TAP");

        callback({
          runnerURN: "ppb:runner:1",
          odds: 1.0,
          status: "open",
          cardUrn: "CARD_URN",
        });

        expect(getSingleBetButtonAdder).toHaveBeenCalledWith("ppb:runner:1", 1.0, "open", "CARD_URN");
        expect(addSingleToBetslip).toHaveBeenCalled();
      });
    });

    describe("when event is @@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED", () => {
      it("subscribe the visibility change event and prefetches the penalty takers card markets when visible", () => {
        const callback = getSubscriptionCallback("@@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED");

        callback({
          visible: true,
          marketUrns: ["ppb:market:1", "ppb:market:2"],
        });

        expect(prefetchBatchSportsbookMarkets).toHaveBeenCalledWith(["ppb:market:1", "ppb:market:2"]);
      });

      it("does not prefetch markets when card is not visible", () => {
        const callback = getSubscriptionCallback("@@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED");

        callback({
          visible: false,
          marketUrns: ["ppb:market:1", "ppb:market:2"],
        });

        expect(prefetchSportsbookMarket).not.toHaveBeenCalled();
      });
    });

    describe("when event is @@BETSLIP/ADD_MONTEROSA_TO_BETSLIP", () => {
      it("should call addMonterosaSelectionsToBetslip", () => {
        const callback = getSubscriptionCallback("@@BETSLIP/ADD_MONTEROSA_TO_BETSLIP");

        callback({
          cardUrn: "ppb:tbd:card:monterosaContent:1",
          selections: [
            {
              marketId: "926.100",
              selectionId: 1,
            },
          ],
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@BETSLIP/ADD_MONTEROSA_TO_BETSLIP", expect.any(Function));
        expect(addMonterosaSelectionsToBetslip).toHaveBeenCalledWith("ppb:tbd:card:monterosaContent:1", [
          {
            marketId: "926.100",
            selectionId: 1,
          },
        ]);
      });
    });
  });
});
