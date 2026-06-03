import exchangeOrdersReducer from "./exchange-orders-reducer";

const stateMock = {
  "ppb:excMarket:1.166528788": {
    market: "1.166528788",
    orders: [],
    settledProfit: 155,
  },
};

describe('"exchangeorders" reducer', () => {
  describe("when state is undefined", () => {
    it("must return the initial state", () => {
      const state = exchangeOrdersReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe("when action type is not met by the reducer", () => {
    it("must return the same state", () => {
      const state = exchangeOrdersReducer({ state: "state" }, {});

      expect(state).toEqual({ state: "state" });
    });
  });

  describe('when action type is "FETCH_EXC_OPEN_BETS_SUCCESS"', () => {
    it('must return the new state with "exchangeorders"', () => {
      const action = {
        type: "FETCH_EXC_OPEN_BETS_SUCCESS",
        payload: {
          markets: stateMock,
        },
      };
      const state = exchangeOrdersReducer(undefined, action);

      expect(state).toEqual(stateMock);
    });
  });
});
