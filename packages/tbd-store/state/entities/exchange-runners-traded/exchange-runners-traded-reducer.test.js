import exchangeRunnersTradedReducer from "./exchange-runners-traded-reducer";

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

describe('"exchangerunnerstraded" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = exchangeRunnersTradedReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_MARKET_GRAPH_SUCCESS"', () => {
    it("must return an updated state with exchange runners and their traded info", () => {
      const action = {
        type: "FETCH_MARKET_GRAPH_SUCCESS",
        payload: {
          urn: "ppb:excRunner:1.166528788/19/0",
          back: [{ odd: 1, liquidity: 7 }],
          lay: [{ odd: 1.8, liquidity: 60 }],
          traded: [{ odd: 2, liquidity: 60 }],
        },
      };

      const state = exchangeRunnersTradedReducer(stateMock, action);

      expect(state).toEqual({
        "ppb:excRunner:1.166528790/20/0": {},
        "ppb:excRunner:1.166528788/19/0": {
          urn: "ppb:excRunner:1.166528788/19/0",
          market: "1.166528788",
          selectionId: 19,
          back: [{ odd: 1, liquidity: 7 }],
          lay: [{ odd: 1.8, liquidity: 60 }],
          traded: [{ odd: 2, liquidity: 60 }],
        },
      });
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it("must return an updated state with exchange runners and their traded info", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            RunnerMarketGraph: [
              {
                urn: "ppb:excRunner:1.166528788/19/0",
                back: [{ odd: 1, liquidity: 7 }],
                lay: [{ odd: 1.8, liquidity: 60 }],
                traded: [{ odd: 2, liquidity: 60 }],
              },
            ],
          },
        },
      };

      const state = exchangeRunnersTradedReducer(stateMock, action);

      expect(state).toEqual({
        "ppb:excRunner:1.166528790/20/0": {},
        "ppb:excRunner:1.166528788/19/0": {
          urn: "ppb:excRunner:1.166528788/19/0",
          market: "1.166528788",
          selectionId: 19,
          back: [{ odd: 1, liquidity: 7 }],
          lay: [{ odd: 1.8, liquidity: 60 }],
          traded: [{ odd: 2, liquidity: 60 }],
        },
      });
    });
  });
});
