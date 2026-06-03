import BettingOpportunityPricesObservable from "./betting-opportunity-prices-observable";
import SportsbookMarketPricesObservable from "./sportsbook-market-prices-observable";
import { fetchCombinations } from "../services/sportsbook-imply-bets-service";

const subscribeMock = jest.fn();

jest.mock("../services/sportsbook-imply-bets-service", () => ({
  fetchCombinations: jest.fn(),
}));

jest.mock("./sportsbook-market-prices-observable", () => {
  const addMarketMock = jest.fn();
  const removeMarketMock = jest.fn();

  return {
    getInstance: jest.fn(() => ({
      subscribe: (...args) => subscribeMock(...args),
      addMarket: addMarketMock,
      removeMarket: removeMarketMock,
    })),
  };
});

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 5000),
}));

global.Date.now = jest.fn(() => 1000);

describe("BettingOpportunityPricesObservable", () => {
  let observable;

  beforeAll(() => {
    jest.clearAllMocks();
    observable = BettingOpportunityPricesObservable.getInstance();
  });

  describe("getInstance", () => {
    describe("when initializing the Observable", () => {
      it("should subscribe 'SportsbookMarketPricesObservable' for market prices updates", () => {
        observable.addBettingOpportunity({
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345 }],
          subscriberId: "mockSubscriberId",
        });

        expect(subscribeMock).toHaveBeenCalled();
        observable.isOutdated = false;

        const callback = subscribeMock.mock.calls[0][0];

        callback({
          updates: {
            markets: [{ urn: "urn:market1" }],
            runners: [
              {
                urn: "ppb:sbkRunner:924.1111/12345",
                market: "ppb:sbkMarket:924.1111",
                selectionId: 12345,
                odd: { decimal: 1.2 },
              },
            ],
          },
        });

        expect(observable.isOutdated).toBe(true);
      });
    });
  });

  describe("addBettingOpportunity", () => {
    describe("when adding a betting opportunity that didn't exist in the pool before", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.addBettingOpportunity({
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345 }],
          subscriberId: "mockSubscriberId",
        });
      });

      it("should not need any action to be provided", () => {
        expect(observable.POOL.get("ppb:tbd:popular:12345")).toEqual({
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345, odds: 0 }],
          consumers: new Set(["mockSubscriberId"]),
          count: 1,
        });
      });

      it("should add market subscriptions to SportsbookMarketPricesObservable", () => {
        const sportsbookMarketPricesObservable = SportsbookMarketPricesObservable.getInstance();

        expect(sportsbookMarketPricesObservable.addMarket).toHaveBeenCalledWith({
          isRacing: false,
          marketId: "9.1111",
          subscriberId: "betting-opportunity-prices-observable",
        });
      });
    });

    describe("when adding the same betting opportunity to the pool multiple times", () => {
      beforeEach(() => {
        observable.resetBettingOpportunities();

        const bettingOpportunity = {
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345 }],
          subscriberId: "mockSubscriberId1",
        };

        observable.addBettingOpportunity(bettingOpportunity);
        observable.addBettingOpportunity({
          ...bettingOpportunity,
          subscriberId: "mockSubscriberId2",
        });
      });

      it("should not need any action to be provided", () => {
        expect(observable.POOL.get("ppb:tbd:popular:12345")).toEqual({
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345 }],
          count: 1,
          consumers: new Set(["mockSubscriberId1", "mockSubscriberId2"]),
        });
      });
    });
  });

  describe("tick", () => {
    beforeEach(() => {
      Date.now.mockReturnValue(1000);
    });
    beforeAll(() => {
      const bettingOpportunity = {
        bettingOpportunityUrn: "ppb:tbd:popular:12345",
        bettingOpportunityType: "BOOSTED_BETS",
        bettingOpportunityId: "12345",
        selections: [{ marketId: "9.1111", selectionId: 12345 }],
        subscriberId: "mockSubscriberId1",
      };

      observable.restart = jest.fn();
      observable.resetBettingOpportunities();
      observable.addBettingOpportunity(bettingOpportunity);
    });

    describe("when triggering a tick", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        observable.notify = jest.fn();
        observable.tick();
      });

      it("should call fetchCombinations and notify", () => {
        expect(fetchCombinations).toHaveBeenCalledWith(
          {
            betLegs: [
              {
                betRunners: [{ runner: { marketId: "9.1111", selectionId: 12345 } }],
                combinationGroup: undefined,
                combinationGroupId: "12345",
                isBoostedLeg: true,
                legType: "SIMPLE_SELECTION",
              },
            ],
            pricePolicy: "SUGGESTED",
            scope: "MULTIPLES",
          },
          { betLegsLimit: 25, combinationsGroupLimit: 5 },
        );
        expect(observable.notify).toHaveBeenCalled();
      });

      it("should not call fetchCombinations if the betting opportunity is not outdated", () => {
        jest.clearAllMocks();
        Date.now.mockReturnValue(6001);
        observable.isOutdated = false;
        observable.tick();

        expect(fetchCombinations).not.toHaveBeenCalled();

        Date.now.mockReturnValue(11000);
        observable.isOutdated = true;
        observable.tick();

        // Confirm that non stale opportunities do not get updated
        expect(fetchCombinations).not.toHaveBeenCalled();

        Date.now.mockReturnValue(11001);
        observable.isOutdated = true;
        observable.tick();

        // Confirm that stale opportunities get updated
        expect(fetchCombinations).toHaveBeenCalledWith(
          {
            betLegs: [
              {
                betRunners: [{ runner: { marketId: "9.1111", selectionId: 12345 } }],
                combinationGroup: undefined,
                combinationGroupId: "12345",
                isBoostedLeg: true,
                legType: "SIMPLE_SELECTION",
              },
            ],
            pricePolicy: "SUGGESTED",
            scope: "MULTIPLES",
          },
          { betLegsLimit: 25, combinationsGroupLimit: 5 },
        );
      });
    });

    describe("when the request fails", () => {
      beforeAll(() => {
        jest.clearAllMocks();

        const bettingOpportunity = {
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345 }],
          subscriberId: "mockSubscriberId1",
        };

        observable.resetBettingOpportunities();
        observable.addBettingOpportunity(bettingOpportunity);

        fetchCombinations.mockImplementation(() => {
          throw new Error("http request failed");
        });

        Date.now.mockReturnValue(6001);
        observable.notify = jest.fn();
        observable.isOutdated = true;
        observable.tick();
      });

      it("should notify about the error", () => {
        expect(observable.notify).toHaveBeenCalledWith({ error: "http request failed" });
      });
    });
  });

  describe("request", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      observable.reset();
      fetchCombinations.mockReturnValue({
        markets: [],
        runners: [],
      });
    });

    describe("when odds are different", () => {
      it("should flag as outdated", () => {});
    });

    describe("when there are duplicated betting opportunities", () => {
      beforeEach(() => {
        const bettingOpportunity = {
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345 }],
          subscriberId: "mockSubscriberId1",
        };

        observable.addBettingOpportunity(bettingOpportunity);
        observable.addBettingOpportunity(bettingOpportunity);

        observable.request();
      });

      it("should call fetchCombinations without duplicated betting opportunities", () => {
        expect(fetchCombinations).toHaveBeenCalledWith(
          {
            betLegs: [
              {
                betRunners: [{ runner: { marketId: "9.1111", selectionId: 12345 } }],
                combinationGroup: undefined,
                combinationGroupId: "12345",
                isBoostedLeg: true,
                legType: "SIMPLE_SELECTION",
              },
            ],
            pricePolicy: "SUGGESTED",
            scope: "MULTIPLES",
          },
          { betLegsLimit: 25, combinationsGroupLimit: 5 },
        );
      });
    });
  });

  describe("resetBettingOpportunities", () => {
    describe("when there are betting opportunities in the pool", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.addBettingOpportunity({
          bettingOpportunityUrn: "ppb:tbd:popular:12345",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "12345",
          selections: [{ marketId: "9.1111", selectionId: 12345 }],
          subscriberId: "mockSubscriberId",
        });

        observable.resetBettingOpportunities();
      });

      it("should reset the betting opportunity with the 'mockSubscriberId' subscriberId", () => {
        expect(observable.POOL.get("ppb:tbd:popular:12345")).toEqual(undefined);
      });
    });
  });
});
