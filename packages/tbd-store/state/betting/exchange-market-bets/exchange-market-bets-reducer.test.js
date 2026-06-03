import exchangeMarketBetsReducer from "./exchange-market-bets-reducer";

const stateMock = {
  "ppb:marketBet:1.173614905": {
    urn: "ppb:marketBet:1.173614905",
    id: "1.173614905",
    description: "Match Odds",
    numOfOrders: 4,
    numOfUnmatched: 0,
  },
};

describe("`exchangeMarketBets` reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the current state", () => {
      const state = exchangeMarketBetsReducer(stateMock, {});
      expect(state).toEqual(stateMock);
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = exchangeMarketBetsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "exchangeMarketBets"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            MarketBet: [
              {
                urn: "ppb:marketBet:1.173614906",
                id: "1.173614906",
                description: "Over/Under 2.5",
                numOfOrders: 0,
                numOfUnmatched: 1,
              },
            ],
          },
        },
      };
      const state = exchangeMarketBetsReducer(stateMock, action);
      expect(state).toEqual({
        "ppb:marketBet:1.173614905": {
          urn: "ppb:marketBet:1.173614905",
          id: "1.173614905",
          description: "Match Odds",
          numOfOrders: 4,
          numOfUnmatched: 0,
        },
        "ppb:marketBet:1.173614906": {
          urn: "ppb:marketBet:1.173614906",
          id: "1.173614906",
          description: "Over/Under 2.5",
          numOfOrders: 0,
          numOfUnmatched: 1,
        },
      });
    });
  });
});
