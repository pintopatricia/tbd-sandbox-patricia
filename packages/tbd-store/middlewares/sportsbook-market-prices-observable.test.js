import sportsbookService from "../services/sportsbook-market-service";
import SportsbookMarketPricesObservable from "./sportsbook-market-prices-observable";

jest.mock("../services/sportsbook-market-service", () => ({
  getPrices: jest.fn(),
}));

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 5000),
}));

describe("SportsbookMarketPricesObservable", () => {
  let observable;

  beforeAll(() => {
    jest.clearAllMocks();

    observable = SportsbookMarketPricesObservable.getInstance();
  });

  describe("addMarket", () => {
    describe("when adding a market that didn't exist in the pool before", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.addMarket({
          marketId: "mockMarketId",
          subscriberId: "mockSubscriberId",
          isRacing: false,
        });
      });

      it("should not need any action to be provided", () => {
        expect(observable.POOL.get("mockMarketId")).toEqual({
          marketId: "mockMarketId",
          isRacing: false,
          consumers: new Set(["mockSubscriberId"]),
          count: 1,
        });
      });
    });

    describe("when adding the same market to the pool multiple times", () => {
      beforeEach(() => {
        const market = {
          marketId: "mockMarketId1",
          subscriberId: "mockSubscriberId1",
          isRacing: false,
        };
        observable.addMarket(market);
        observable.addMarket({
          ...market,
          subscriberId: "mockSubscriberId2",
        });
      });

      it("should not need any action to be provided", () => {
        expect(observable.POOL.get("mockMarketId1")).toEqual({
          marketId: "mockMarketId1",
          isRacing: false,
          count: 1,
          consumers: new Set(["mockSubscriberId1", "mockSubscriberId2"]),
        });
      });
    });
  });

  describe("tick", () => {
    beforeAll(() => {
      jest.clearAllMocks();

      observable.reset();

      const market = {
        marketId: "mockMarketId1",
        subscriberId: "mockSubscriberId1",
        isRacing: false,
      };

      observable.restart = jest.fn();
      observable.addMarket(market);
    });

    describe("when triggering a tick", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.notify = jest.fn();
        observable.tick();
      });

      it("should call getPrices", () => {
        expect(sportsbookService.getPrices).toHaveBeenCalledWith(["mockMarketId1"], 1);
      });
      it("should call 'notify'", () => {
        expect(observable.notify).toHaveBeenCalled();
      });
    });

    describe("when there's a market which is racing", () => {
      beforeAll(() => {
        jest.clearAllMocks();

        const market = {
          marketId: "mockMarketId2",
          subscriberId: "mockSubscriberId2",
          isRacing: true,
        };

        observable.addMarket(market);
        observable.tick();
      });

      it("should call 'getPrices' with priceHistory set to 3", () => {
        expect(sportsbookService.getPrices).toHaveBeenCalledWith(["mockMarketId1", "mockMarketId2"], 3);
      });
    });

    describe("when the request fails", () => {
      beforeAll(() => {
        jest.clearAllMocks();

        sportsbookService.getPrices.mockImplementation(() => {
          throw new Error("http request failed");
        });
        observable.notify = jest.fn();
        observable.tick();
      });

      it("should call 'getInterval' with racing as true", () => {
        expect(observable.notify).toHaveBeenCalledWith({ error: "http request failed" });
      });
    });
  });

  describe("request", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      observable.reset();
      sportsbookService.getPrices.mockReturnValue({
        markets: [],
        runners: [],
      });
    });

    describe("when there are markets with the 'isRacing' flag", () => {
      beforeEach(() => {
        observable.addMarket({
          marketId: "mockMarketId1",
          subscriberId: "mockSubscriberId1",
          isRacing: true,
        });

        observable.request();
      });

      it("should call 'getPrices' with the 'isRacing' flag set to true", () => {
        expect(sportsbookService.getPrices).toHaveBeenCalledWith(["mockMarketId1"], 3);
      });
    });

    describe("when there are duplicated marketIds", () => {
      beforeEach(() => {
        const market = {
          marketId: "mockMarketId1",
          subscriberId: "mockSubscriberId1",
          isRacing: true,
        };

        observable.addMarket(market);
        observable.addMarket(market);

        observable.request();
      });

      it("should call 'getPrices' without duplicated marketIds", () => {
        expect(sportsbookService.getPrices).toHaveBeenCalledWith(["mockMarketId1"], 3);
      });
    });

    describe("when there are markets with the 'isRacing' flag set to true", () => {
      beforeEach(() => {
        observable.addMarket({
          marketId: "mockMarketId",
          subscriberId: "mockSubscriberId",
          isRacing: true,
        });

        observable.addMarket({
          marketId: "mockMarketId2",
          subscriberId: "mockSubscriberId2",
          isRacing: false,
        });

        observable.request();
      });

      it("should call 'getPrices' with the 'isRacing' flag as true", () => {
        expect(sportsbookService.getPrices).toHaveBeenCalledWith(["mockMarketId", "mockMarketId2"], 3);
      });
    });
  });

  describe("resetMarkets", () => {
    describe("when there are markets in the pool", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.addMarket({
          marketId: "mockMarketId",
          subscriberId: "mockSubscriberId",
          isRacing: false,
        });

        observable.addMarket({
          marketId: "mockMarketId",
          subscriberId: "mockSubscriberId2",
          isRacing: false,
        });

        observable.resetMarkets();
      });

      it("should reset the market with the 'mockSubscriberId2' subscriberId", () => {
        expect(observable.POOL.get("mockMarketId2")).toEqual(undefined);
      });

      describe("when there are exclusions", () => {
        describe("when only the exclusion is the consumer", () => {
          beforeEach(() => {
            jest.clearAllMocks();

            observable.addMarket({
              marketId: "mockMarketId",
              subscriberId: "mockSubscriberId2",
              isRacing: false,
            });

            observable.addMarket({
              marketId: "mockMarketId2",
              subscriberId: "mockSubscriberId2",
              isRacing: false,
            });
            observable.resetMarkets(["mockSubscriberId2"]);
          });

          it("should keep the markets with the 'mockSubscriberId2' subscriberId", () => {
            expect(observable.POOL.get("mockMarketId2")).toBeDefined();
            expect(observable.POOL.get("mockMarketId")).toBeDefined();
          });
        });

        describe("when others besides the exclusion is a consumer", () => {
          beforeEach(() => {
            jest.clearAllMocks();

            observable.addMarket({
              marketId: "mockMarketId",
              subscriberId: "mockSubscriberId2",
              isRacing: false,
            });

            observable.addMarket({
              marketId: "mockMarketId",
              subscriberId: "mockSubscriberId",
              isRacing: false,
            });
            observable.resetMarkets(["mockSubscriberId2"]);
          });

          it("should keep the market with the 'mockSubscriberId2' subscriberId", () => {
            expect(observable.POOL.get("mockMarketId")).toBeDefined();
          });

          it("should clean the consumers of the 'mockMarketId' market", () => {
            expect(observable.POOL.get("mockMarketId")).toEqual(
              expect.objectContaining({
                consumers: new Set(["mockSubscriberId"]),
              }),
            );
          });
        });
      });
    });
  });
});
