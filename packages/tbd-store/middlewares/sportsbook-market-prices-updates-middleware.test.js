import SportsbookMarketPricesObservable from "./sportsbook-market-prices-observable";
import { sportsbookMarketPricesMiddleware } from "./sportsbook-market-prices-updates-middleware";

const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => ({
  entities: {
    sportsbookmarkets: {
      markets: [],
      runners: [],
    },
  },
}));
const nextSpy = jest.fn();

const subscribeSpy = jest.fn(() => "");
const addMarketSpy = jest.fn(() => {});
const removeMarketSpy = jest.fn(() => {});
const resetMarketsSpy = jest.fn(() => {});

jest.mock("./sportsbook-market-prices-observable", () => ({
  getInstance: jest.fn(() => ({
    subscribe: jest.fn(() => ""),
  })),
}));

async function setup() {
  SportsbookMarketPricesObservable.getInstance.mockReturnValue({
    subscribe: subscribeSpy,
    addMarket: addMarketSpy,
    removeMarket: removeMarketSpy,
    resetMarkets: resetMarketsSpy,
  });
}

describe("Sportsbook Market Prices Updates middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch a FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS action when the sportsbookMarketPricesObservable is notified", async () => {
    setup();

    getStateSpy.mockReturnValue({
      entities: {
        sportsbookmarkets: {
          "urn:market1": {
            urn: "urn:market1",
            runners: [
              {
                urn: "urn:runner1",
              },
            ],
          },
        },
      },
    });

    await sportsbookMarketPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
      type: "",
      payload: {},
    });

    const callback = subscribeSpy.mock.calls[0][0];

    callback({
      updates: {
        markets: [{ urn: "urn:market1", runners: [] }],
        runners: [{ urn: "urn:runner2", market: "urn:market1", selectionId: 1, status: "ACTIVE" }],
      },
    });

    expect(subscribeSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS",
      payload: {
        markets: [
          {
            runners: [],
            urn: "urn:market1",
          },
        ],
        runners: [
          {
            market: "urn:market1",
            selectionId: 1,
            status: "ACTIVE",
            urn: "urn:runner2",
          },
          {
            market: "urn:market1",
            selectionId: undefined,
            status: "REMOVED",
            urn: "urn:runner1",
          },
        ],
      },
    });
  });

  describe("and action type is 'SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES'", () => {
    it("should add the new subscription to the sportsbookMarketPricesObservable", async () => {
      setup();

      await sportsbookMarketPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
        payload: {
          marketId: "market1",
          subscriberId: "subscriber1",
          isRacing: false,
        },
      });

      expect(addMarketSpy).toHaveBeenCalledWith({
        marketId: "market1",
        subscriberId: "subscriber1",
        isRacing: false,
      });
    });
  });

  describe("and action type is 'UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES'", () => {
    it("should remove the subscription to the sportsbookMarketPricesObservable", async () => {
      setup();

      await sportsbookMarketPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES",
        payload: {
          marketId: "market1",
          subscriberId: "subscriber1",
        },
      });
      expect(removeMarketSpy).toHaveBeenCalledWith("market1", "subscriber1");
    });
  });

  describe("and action type is 'PUSH'", () => {
    it("should remove all subscriptions except for 'sportsbook-betting-saga'", async () => {
      setup();

      await sportsbookMarketPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "Router/push",
      });
      expect(resetMarketsSpy).toHaveBeenCalledWith(["sportsbook-betting-saga", "sbcs"]);
    });
  });

  describe("and action type is 'UI__SWITCH_PRODUCT_PREFERENCE'", () => {
    it("should remove all subscriptions", async () => {
      setup();

      await sportsbookMarketPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "UI/SWITCH_PRODUCT_PREFERENCE",
      });
      expect(resetMarketsSpy).toHaveBeenCalled();
    });
  });
});
