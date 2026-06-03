import SportsbookMarketPricesObservable from "@ppb/tbd-store/middlewares/sportsbook-market-prices-observable";
import subscribeEvent from "../../event-broker/event-subscriber";
import register from "./sportsbook-market-live-data-processor";
import { updateRunnerLiveData, runnerLiveDataResolver } from "./resolvers/runner-live-data-resolver";
import { updateMarketLiveData } from "./resolvers/sportsbook-market-live-data-resolver";

jest.mock("@ppb/tbd-store/middlewares/sportsbook-market-prices-observable", () => ({
  getInstance: jest.fn().mockReturnValue({
    subscribe: jest.fn(),
    addMarket: jest.fn(),
    removeMarket: jest.fn(),
  }),
}));

jest.mock("../../event-broker/event-subscriber", () => jest.fn());

jest.mock("./resolvers/sportsbook-market-live-data-resolver", () => ({
  updateMarketLiveData: jest.fn(),
}));

jest.mock("./resolvers/runner-live-data-resolver", () => ({
  runnerLiveDataResolver: jest.fn(),
  updateRunnerLiveData: jest.fn(),
}));

describe("sportsbook-market-live-data-processor", () => {
  describe("register", () => {
    let sportsbookMarketPricesObservable;
    beforeEach(() => {
      sportsbookMarketPricesObservable = SportsbookMarketPricesObservable.getInstance();
      jest.clearAllMocks();

      register();
    });

    describe("when there is a sportsbook market price update", () => {
      describe("when the update is for markets", () => {
        beforeEach(() => {
          const response = {
            updates: {
              markets: [
                {
                  urn: "someMarketUrn",
                },
              ],
            },
          };
          sportsbookMarketPricesObservable.subscribe.mock.calls[0][0](response);
        });
        it("should subscribe to sportsbookMarketPricesObservable and call updateMarketLiveData", () => {
          expect(updateMarketLiveData).toHaveBeenCalledWith({ markets: [{ urn: "someMarketUrn" }] });
        });
      });

      describe("when the update is for runners", () => {
        beforeEach(() => {
          const response = {
            updates: {
              runners: [
                {
                  market: "someMarketUrn",
                  selectionId: 1,
                },
              ],
            },
          };
          sportsbookMarketPricesObservable.subscribe.mock.calls[0][0](response);
        });
        it("should subscribe to sportsbookMarketPricesObservable and call updateRunnerLiveData", () => {
          expect(updateRunnerLiveData).toHaveBeenCalledWith({ runners: [{ market: "someMarketUrn", selectionId: 1 }] });
        });
      });
    });

    describe("when events are Lotto events", () => {
      describe("@@UI/LOTTO_CARD_MOUNTED", () => {
        it("should call addMarket from observable", () => {
          const callback = subscribeEvent.mock.calls[0][1];
          const marketId = "930.193146686";

          callback({
            cardUrn: "ppb:card:lotto:1",
            marketsIds: [marketId],
          });

          expect(subscribeEvent).toHaveBeenCalledWith("@@UI/LOTTO_CARD_MOUNTED", expect.any(Function));
          expect(sportsbookMarketPricesObservable.addMarket).toHaveBeenCalledTimes(1);
          expect(sportsbookMarketPricesObservable.addMarket).toHaveBeenCalledWith({
            isRacing: false,
            marketId,
            subscriberId: "ppb:card:lotto:1",
          });
        });
      });

      describe("@@UI/LOTTO_CARD_UNMOUNTED", () => {
        it("should call removeMarket from observable", () => {
          const callback = subscribeEvent.mock.calls[1][1];
          const marketId = "930.193146686";

          callback({
            cardUrn: "ppb:card:lotto:1",
            marketsIds: [marketId],
          });

          expect(subscribeEvent).toHaveBeenCalledWith("@@UI/LOTTO_CARD_UNMOUNTED", expect.any(Function));
          expect(sportsbookMarketPricesObservable.removeMarket).toHaveBeenCalledTimes(1);
          expect(sportsbookMarketPricesObservable.removeMarket).toHaveBeenCalledWith(marketId, "ppb:card:lotto:1");
        });
      });
    });

    describe("when event is @@UI/SELECTION_PROMO_CARD_VISIBILITY_CHANGED", () => {
      it("should call runnerLiveDataResolver", () => {
        const callback = subscribeEvent.mock.calls[2][1];

        callback({
          visible: true,
          marketUrn: "ppb:market:1",
          isRaceMarket: true,
          refId: ":ref1:",
        });

        expect(subscribeEvent).toHaveBeenCalledWith(
          "@@UI/SELECTION_PROMO_CARD_VISIBILITY_CHANGED",
          expect.any(Function),
        );
        expect(runnerLiveDataResolver).toHaveBeenCalledWith(true, "ppb:market:1", true, ":ref1:");
      });
    });

    describe("when event is @@UI/SPORTSBOOK_BET_BUTTON_VISIBILITY_CHANGED", () => {
      it("should call runnerLiveDataResolver", () => {
        const callback = subscribeEvent.mock.calls[3][1];

        callback({
          visible: false,
          marketUrn: "ppb:market:1",
          isRaceMarket: false,
          refId: ":ref2:",
        });

        expect(subscribeEvent).toHaveBeenCalledWith(
          "@@UI/SPORTSBOOK_BET_BUTTON_VISIBILITY_CHANGED",
          expect.any(Function),
        );
        expect(runnerLiveDataResolver).toHaveBeenCalledWith(false, "ppb:market:1", false, ":ref2:");
      });
    });

    describe("when event is @@UI/POPULAR_SELECTIONS_VISIBILITY_CHANGED", () => {
      it("should call runnerLiveDataResolver", () => {
        const callback = subscribeEvent.mock.calls[4][1];

        callback({
          visible: true,
          marketUrn: "ppb:market:1",
          refId: ":ref2:",
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/POPULAR_SELECTIONS_VISIBILITY_CHANGED", expect.any(Function));
        expect(runnerLiveDataResolver).toHaveBeenCalledWith(true, "ppb:market:1", false, ":ref2:");
      });
    });

    describe("when event is @@UI/UPSELL_SUGGESTIONS_VISIBILITY_CHANGE", () => {
      it("should call runnerLiveDataResolver for each marketUrn", () => {
        const callback = subscribeEvent.mock.calls[5][1];

        callback({
          visible: true,
          marketUrns: ["ppb:market:1", "ppb:market:2"],
          refId: ":ref2:",
        });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/UPSELL_SUGGESTIONS_VISIBILITY_CHANGE", expect.any(Function));
        expect(runnerLiveDataResolver).toHaveBeenCalledTimes(2);
        expect(runnerLiveDataResolver).toHaveBeenCalledWith(true, "ppb:market:1", false, ":ref2:");
        expect(runnerLiveDataResolver).toHaveBeenCalledWith(true, "ppb:market:2", false, ":ref2:");
      });

      it("should call runnerLiveDataResolver with visible false when hidden", () => {
        const callback = subscribeEvent.mock.calls[5][1];

        callback({
          visible: false,
          marketUrns: ["ppb:market:1"],
          refId: ":ref3:",
        });

        expect(runnerLiveDataResolver).toHaveBeenCalledWith(false, "ppb:market:1", false, ":ref3:");
      });
    });

    describe("when event is @@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED", () => {
      it("should call runnerLiveDataResolver for each marketUrn in the payload", () => {
        const callback = subscribeEvent.mock.calls[6][1];

        callback({
          visible: true,
          marketUrns: ["ppb:market:1", "ppb:market:2"],
          subscriberId: ":ref3:",
        });

        expect(subscribeEvent).toHaveBeenCalledWith(
          "@@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED",
          expect.any(Function),
        );
        expect(runnerLiveDataResolver).toHaveBeenNthCalledWith(1, true, "ppb:market:1", false, ":ref3:");
        expect(runnerLiveDataResolver).toHaveBeenNthCalledWith(2, true, "ppb:market:2", false, ":ref3:");
      });
    });
  });
});
