import SportsbookMarketPricesObservable from "@ppb/tbd-store/middlewares/sportsbook-market-prices-observable";
import { runnerLiveDataResolver, updateRunnerLiveData } from "./runner-live-data-resolver";
import { getApolloClient } from "../../../apollo-client/client";

jest.mock("@ppb/tbd-store/middlewares/sportsbook-market-prices-observable", () => ({
  getInstance: jest.fn().mockReturnValue({
    subscribe: jest.fn(),
    addMarket: jest.fn(),
    removeMarket: jest.fn(),
  }),
}));

jest.mock("../../../apollo-client/client", () => {
  const modify = jest.fn();

  return {
    getApolloClient: jest.fn(() => ({
      cache: {
        modify,
        identify: jest.fn(() => "SportsbookRunnerLiveData:ppb:runner:1"),
      },
    })),
  };
});

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();
  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting",
  },
});

describe("runner-live-data-resolver", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("runnerLiveDataResolver", () => {
    it("should add market to sportsbookMarketPricesObservable", () => {
      const poller = SportsbookMarketPricesObservable.getInstance();

      runnerLiveDataResolver(true, "ppb:market:1", true, ":ref1:");

      expect(poller.addMarket).toHaveBeenCalledWith({
        marketId: "1",
        subscriberId: ":ref1:",
        isRacing: true,
      });
    });

    it("should remove market to sportsbookMarketPricesObservable", () => {
      const poller = SportsbookMarketPricesObservable.getInstance();

      runnerLiveDataResolver(false, "ppb:market:1", true, ":ref1:");

      expect(poller.removeMarket).toHaveBeenCalledWith("1", ":ref1:");
    });
  });

  describe("updateRunnerLiveData", () => {
    const setup = ({ payload }) => {
      updateRunnerLiveData(payload);
    };

    describe("when the payload is empty", () => {
      it("should not call cache.modify", () => {
        setup({ payload: { runners: [] } });
        expect(getApolloClient().cache.modify).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has something new", () => {
      it("should call cache.modify with every fields", () => {
        const payload = {
          runners: [{ market: "ppb:market:1", selectionId: 1, trueOdds: { decimal: 1.2 } }],
        };

        setup({ payload });

        expect(getApolloClient().cache.modify).toHaveBeenCalledWith({
          fields: {
            displayOdds: expect.any(Function),
            odds: expect.any(Function),
            previousOdds: expect.any(Function),
            runnerStatus: expect.any(Function),
          },
          id: "SportsbookRunnerLiveData:ppb:runner:1",
        });
      });
    });

    describe("when is an update on odds field", () => {
      it("should update the odds field in cache", () => {
        const decimalOdds = { decimal: 1.2 };
        const fractionalOdds = { numerator: 1, denominator: 1 };
        const odds = { ...decimalOdds, fractional: fractionalOdds };

        const payload = {
          runners: [{ market: "ppb:market:1", selectionId: 1, trueOdds: { ...odds } }],
        };

        setup({ payload });

        const mockCacheModify = getApolloClient().cache.modify;
        const oddsModifier = mockCacheModify.mock.calls[0][0].fields.odds;
        const cachedValue = {
          odds: {
            decimal: 1,
            fractional: fractionalOdds,
          },
        };
        const result = oddsModifier(cachedValue);

        expect(result).toEqual({
          ...odds,
        });
      });
    });

    describe("when is an update on display odds field", () => {
      it("should update the display odds field in cache", () => {
        const decimalOdds = { decimal: 1.2 };
        const fractionalOdds = { numerator: 1, denominator: 1 };
        const odds = { ...decimalOdds, fractional: fractionalOdds };

        const payload = {
          runners: [{ market: "ppb:market:1", selectionId: 1, odds: { ...odds } }],
        };

        setup({ payload });

        const mockCacheModify = getApolloClient().cache.modify;
        const displayOddsModifier = mockCacheModify.mock.calls[0][0].fields.displayOdds;
        const cachedValue = {
          displayOdds: {
            decimal: 1,
            fractional: fractionalOdds,
          },
        };
        const result = displayOddsModifier(cachedValue);

        expect(result).toEqual({
          ...odds,
        });
      });
    });

    describe("when is an update on previous odds field", () => {
      it("should update the previous odds field in cache", () => {
        const fractionalOdds = { numerator: 1, denominator: 1 };

        const trueOdds = { decimal: 1.2, fractional: fractionalOdds };

        const previousOdds = { decimal: { decimal: 0.2 }, fractional: fractionalOdds };

        const payload = {
          runners: [{ market: "ppb:market:1", selectionId: 1, trueOdds, previousOdds: [{ ...previousOdds }] }],
        };

        setup({ payload });

        const mockCacheModify = getApolloClient().cache.modify;
        const previousOddsModifier = mockCacheModify.mock.calls[0][0].fields.previousOdds;
        const cachedValue = {
          previousOdds: [
            {
              decimal: 1,
              fractional: fractionalOdds,
            },
          ],
        };
        const result = previousOddsModifier(cachedValue);

        expect(result).toEqual([
          {
            odds: trueOdds,
            displayOdds: previousOdds,
          },
        ]);
      });
    });

    describe("when is an update on runner status", () => {
      it("should update the runnerStatus field in cache", () => {
        const payload = {
          runners: [{ market: "ppb:market:1", selectionId: 1, status: "SUSPENDED" }],
        };

        setup({ payload });

        const mockCacheModify = getApolloClient().cache.modify;
        const runnerStatusModifier = mockCacheModify.mock.calls[0][0].fields.runnerStatus;
        const result = runnerStatusModifier("ACTIVE");

        expect(result).toEqual("SUSPENDED");
      });
    });
  });
});
