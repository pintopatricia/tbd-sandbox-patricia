import exchangeRunnersReducer from "./exchange-runners-reducer";

const stateMock = {
  "ppb:excRunner:1.166528790/20/0": {},
  "ppb:excRunner:1.166528788/19/0": {
    urn: "ppb:excRunner:1.166528788/19/0",
    market: "1.166528788",
    selectionId: 19,
    back: [{ odd: 1, liquidity: 7 }],
    lay: [{ odd: 1.8, liquidity: 60 }],
  },
};

describe('"exchangerunners" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = exchangeRunnersReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS"', () => {
    it("must return an updated state with exchange runners", () => {
      const action = {
        type: "FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS",
        payload: {
          markets: [
            {
              urn: "ppb:excMarket:1.166528788",
              status: "OPEN",
            },
          ],
          runners: [
            {
              urn: "ppb:excRunner:1.166528788/19/0",
              market: "1.166528788",
              selectionId: 19,
              back: [{ odd: 1, liquidity: 7 }],
              lay: [{ odd: 1.8, liquidity: 60 }],
            },
          ],
        },
      };

      const state = exchangeRunnersReducer(stateMock, action);

      expect(state).toEqual({
        "ppb:excRunner:1.166528790/20/0": {},
        "ppb:excRunner:1.166528788/19/0": {
          urn: "ppb:excRunner:1.166528788/19/0",
          market: "1.166528788",
          selectionId: 19,
          back: [{ odd: 1, marketDepth: 0, liquidity: 7 }, { marketDepth: 1 }, { marketDepth: 2 }],
          lay: [{ odd: 1.8, marketDepth: 0, liquidity: 60 }, { marketDepth: 1 }, { marketDepth: 2 }],
        },
      });
    });
  });
});
