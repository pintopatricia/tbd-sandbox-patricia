import exchangeMarketsReducer from "./exchange-markets-reducer";

const marketMock = {
  urn: "ppb:excMarket:1.166528788",
  sportevent: "ppb:event:22334455",
  name: "EXC Market 1",
  totalMatched: 6,
  runners: [
    {
      urn: "ppb:excRunner:1.166528788/19/0",
      selection: 19,
      marketId: "1.166528788",
      name: "Some other Team A",
      handicap: 0,
    },
  ],
};

const stateMock = {
  "ppb:excMarket:1.166528788": marketMock,
};

describe('"exchangemarkets" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = exchangeMarketsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "exchangemarkets"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { ExchangeMarket: [marketMock] },
        },
      };
      const state = exchangeMarketsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });

    it("must merge the market states", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: { ExchangeMarket: [marketMock] },
        },
      };
      const state = exchangeMarketsReducer(
        {
          "ppb:excMarket:1.166528788": {
            someProp: "someProp",
          },
        },
        action,
      );
      expect(state).toEqual({
        "ppb:excMarket:1.166528788": {
          someProp: "someProp",
          ...stateMock["ppb:excMarket:1.166528788"],
        },
      });
    });
  });

  describe('when action type is "FETCH_MAIN_MARKETS_UPDATES_SUCCESS"', () => {
    it('must return the new state with "exchangemarkets"', () => {
      const action = {
        type: "FETCH_MAIN_MARKETS_UPDATES_SUCCESS",
        payload: {
          data: { ExchangeMarket: [marketMock] },
        },
      };
      const state = exchangeMarketsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });

    it("must merge the market states", () => {
      const action = {
        type: "FETCH_MAIN_MARKETS_UPDATES_SUCCESS",
        payload: {
          data: { ExchangeMarket: [marketMock] },
        },
      };
      const state = exchangeMarketsReducer(
        {
          "ppb:excMarket:1.166528788": {
            someProp: "someProp",
          },
        },
        action,
      );
      expect(state).toEqual({
        "ppb:excMarket:1.166528788": {
          someProp: "someProp",
          ...stateMock["ppb:excMarket:1.166528788"],
        },
      });
    });
  });

  describe('when action type is "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS"', () => {
    it("should update exchange market with market status", () => {
      const action = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.166528788",
              status: "SUSPENDED",
            },
          ],
        },
      };
      const state = exchangeMarketsReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:excMarket:1.166528788": {
          urn: "ppb:excMarket:1.166528788",
          sportevent: "ppb:event:22334455",
          name: "EXC Market 1",
          totalMatched: 6,
          status: "SUSPENDED",
          runners: [
            {
              urn: "ppb:excRunner:1.166528788/19/0",
              selection: 19,
              marketId: "1.166528788",
              name: "Some other Team A",
              handicap: 0,
            },
          ],
        },
      });
    });
  });
});
