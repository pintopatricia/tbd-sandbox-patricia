import { FETCH_MAIN_MARKETS_UPDATES_SUCCESS, NETWORK__SBK_MARKETS_SUCCESS } from "../../../actions/catalogue";
import { FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS } from "../../../actions/sportsbook-markets";
import sportsbookMarketsReducer from "./sportsbook-markets-reducer";

jest.mock("../create-entity-reducer");

const marketMock = {
  urn: "ppb:sbkMarket:1.166528788",
  sportevent: "ppb:event:22334455",
  name: "SBK Market 1",
  marketId: "1.166528788",
  runners: [
    {
      urn: "ppb:sbkRunner:1.166528788/19",
      selectionId: 19,
      name: "Some other Team A",
      handicap: 0,
    },
    {
      urn: "ppb:sbkRunner:1.166528788/20",
      selectionId: 20,
      name: "Some other Team B",
      handicap: 0,
    },
    {
      urn: "ppb:sbkRunner:1.166528788/21",
      selectionId: 21,
      name: "Some other Team C",
      handicap: 0,
    },
  ],
};

const stateMock = {
  "ppb:sbkMarket:1.166528788": marketMock,
};

describe('"sportsbookmarkets" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = sportsbookMarketsReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_MAIN_MARKETS_UPDATES_SUCCESS"', () => {
    it('must return the new state with "sportsbookmarkets"', () => {
      const action = {
        type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
        payload: {
          data: {
            SportsbookMarket: [marketMock],
          },
        },
      };
      const state = sportsbookMarketsReducer(undefined, action);
      expect(state).toEqual(stateMock);
    });

    it("must return the new state with 'sportsbookmarkets'' with empty runners", () => {
      const action = {
        type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
        payload: {
          data: {
            SportsbookMarket: [
              {
                urn: "ppb:sbkMarket:1.166528788",
                sportevent: "ppb:event:22334455",
                name: "SBK Market 1",
                marketId: "1.166528788",
                runners: [],
              },
            ],
          },
        },
      };
      const state = sportsbookMarketsReducer(undefined, action);
      expect(state).toEqual({
        "ppb:sbkMarket:1.166528788": {
          urn: "ppb:sbkMarket:1.166528788",
          sportevent: "ppb:event:22334455",
          name: "SBK Market 1",
          marketId: "1.166528788",
          runners: [],
        },
      });
    });

    it('should order sbk runners to "12X"', () => {
      const action = {
        type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
        payload: {
          data: {
            SportsbookMarket: [
              {
                urn: "ppb:sbkMarket:1.166528788",
                sportevent: "ppb:event:22334455",
                name: "SBK Market 1",
                marketId: "1.166528788",
                runners: [
                  {
                    urn: "ppb:sbkRunner:1.166528788/19",
                    selectionId: 19,
                    name: "Some other Team A",
                    handicap: 0,
                    resultType: "HOME",
                  },
                  {
                    urn: "ppb:sbkRunner:1.166528788/20",
                    selectionId: 19,
                    name: "Some other Team A",
                    handicap: 0,
                    resultType: "DRAW",
                  },
                  {
                    urn: "ppb:sbkRunner:1.166528788/21",
                    selectionId: 19,
                    name: "Some other Team A",
                    handicap: 0,
                    resultType: "AWAY",
                  },
                ],
              },
            ],
          },
        },
      };
      const state = sportsbookMarketsReducer(undefined, action);
      expect(state["ppb:sbkMarket:1.166528788"].runners).toEqual([
        {
          urn: "ppb:sbkRunner:1.166528788/19",
          selectionId: 19,
          name: "Some other Team A",
          handicap: 0,
          resultType: "HOME",
        },
        {
          urn: "ppb:sbkRunner:1.166528788/20",
          selectionId: 19,
          name: "Some other Team A",
          handicap: 0,
          resultType: "DRAW",
        },
        {
          urn: "ppb:sbkRunner:1.166528788/21",
          selectionId: 19,
          name: "Some other Team A",
          handicap: 0,
          resultType: "AWAY",
        },
      ]);
    });

    it("should merge the previous state with the new one", () => {
      const previousState = {
        "ppb:sbkMarket:1.166528788": {
          urn: "ppb:sbkMarket:1.166528788",
          sportevent: "ppb:event:22334455",
          guaranteedPriceAvailable: true,
          prevProperty: "need merge",
          name: "SBK Market 1",
          marketId: "1.166528788",
          runners: [
            {
              urn: "ppb:sbkRunner:1.166528788/19",
              selectionId: 19,
              name: "Some other Team A",
              handicap: 0,
            },
          ],
        },
      };
      const action = {
        type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
        payload: {
          data: {
            SportsbookMarket: [marketMock],
          },
        },
      };
      const state = sportsbookMarketsReducer(previousState, action);
      expect(state).toEqual({
        "ppb:sbkMarket:1.166528788": {
          urn: "ppb:sbkMarket:1.166528788",
          sportevent: "ppb:event:22334455",
          guaranteedPriceAvailable: true,
          prevProperty: "need merge",
          name: "SBK Market 1",
          marketId: "1.166528788",
          runners: [
            {
              urn: "ppb:sbkRunner:1.166528788/19",
              selectionId: 19,
              name: "Some other Team A",
              handicap: 0,
            },
            {
              handicap: 0,
              name: "Some other Team B",
              selectionId: 20,
              urn: "ppb:sbkRunner:1.166528788/20",
            },
            {
              handicap: 0,
              name: "Some other Team C",
              selectionId: 21,
              urn: "ppb:sbkRunner:1.166528788/21",
            },
          ],
        },
      });
    });
  });

  describe('when action type is "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS"', () => {
    describe("and marketUrn is not available", () => {
      it("throw a `Market URN is required` Error", () => {
        const action = {
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
          payload: {
            markets: [
              {
                status: "CLOSED",
              },
            ],
            runnerDetails: {},
          },
        };

        expect(() => {
          sportsbookMarketsReducer(stateMock, action);
        }).toThrow("Market URN is required");
      });
    });

    describe("and runnerDetails is not available", () => {
      it("should return sportsbook market with updated status", () => {
        const action = {
          type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
          payload: {
            markets: [
              {
                urn: "ppb:sbkMarket:1.166528788",
                status: "CLOSED",
              },
            ],
            runnerDetails: {},
          },
        };
        const state = sportsbookMarketsReducer(stateMock, action);
        expect(state).toEqual({
          "ppb:sbkMarket:1.166528788": {
            urn: "ppb:sbkMarket:1.166528788",
            sportevent: "ppb:event:22334455",
            name: "SBK Market 1",
            marketId: "1.166528788",
            status: "CLOSED",
            runners: [
              {
                urn: "ppb:sbkRunner:1.166528788/19",
                selectionId: 19,
                name: "Some other Team A",
                handicap: 0,
              },
              {
                urn: "ppb:sbkRunner:1.166528788/20",
                selectionId: 20,
                name: "Some other Team B",
                handicap: 0,
              },
              {
                urn: "ppb:sbkRunner:1.166528788/21",
                selectionId: 21,
                name: "Some other Team C",
                handicap: 0,
              },
            ],
          },
        });
      });
    });

    describe("and runnerDetails is available", () => {
      describe("when handicaps have changed", () => {
        it("should return sportsbook market with updated status and runners with live handicaps", () => {
          const action = {
            type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
            payload: {
              markets: [
                {
                  urn: "ppb:sbkMarket:1.166528788",
                  status: "OPEN",
                },
              ],
              runnerDetails: {
                "ppb:sbkMarket:1.166528788": [
                  {
                    selectionId: 19,
                    handicap: 5.5,
                  },
                  {
                    selectionId: 20,
                    handicap: 5.5,
                  },
                  {
                    selectionId: 2111111111111,
                    handicap: 5.5,
                  },
                ],
              },
            },
          };
          const state = sportsbookMarketsReducer(stateMock, action);
          expect(state).toEqual({
            "ppb:sbkMarket:1.166528788": {
              urn: "ppb:sbkMarket:1.166528788",
              sportevent: "ppb:event:22334455",
              name: "SBK Market 1",
              marketId: "1.166528788",
              status: "OPEN",
              runners: [
                {
                  urn: "ppb:sbkRunner:1.166528788/19",
                  selectionId: 19,
                  name: "Some other Team A",
                  handicap: 5.5,
                },
                {
                  urn: "ppb:sbkRunner:1.166528788/20",
                  selectionId: 20,
                  name: "Some other Team B",
                  handicap: 5.5,
                },
                {
                  urn: "ppb:sbkRunner:1.166528788/21",
                  selectionId: 21,
                  name: "Some other Team C",
                  handicap: 0,
                },
              ],
            },
          });
        });
      });

      describe("when handicaps haven't changed", () => {
        it("should return sportsbook market with updated status and the runners that already exist in the state", () => {
          const action = {
            type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
            payload: {
              markets: [
                {
                  urn: "ppb:sbkMarket:1.166528788",
                  status: "CLOSED",
                },
              ],
              runnerDetails: {
                "ppb:sbkMarket:1.166528788": [
                  {
                    selectionId: 19,
                    handicap: 0,
                  },
                  {
                    selectionId: 20,
                    handicap: 0,
                  },
                  {
                    selectionId: 2111111111111,
                    handicap: 0,
                  },
                ],
              },
            },
          };
          const state = sportsbookMarketsReducer(stateMock, action);
          expect(state).toEqual({
            "ppb:sbkMarket:1.166528788": {
              urn: "ppb:sbkMarket:1.166528788",
              sportevent: "ppb:event:22334455",
              name: "SBK Market 1",
              marketId: "1.166528788",
              status: "CLOSED",
              runners: stateMock["ppb:sbkMarket:1.166528788"].runners,
            },
          });
        });
      });
    });
  });

  describe("when action type is NETWORK__SBK_MARKETS_SUCCESS", () => {
    it("must return the new state with market data", () => {
      const action = {
        type: NETWORK__SBK_MARKETS_SUCCESS,
        payload: {
          data: {
            SportsbookMarket: [
              {
                urn: "ppb:sbkMarket:1.166528788",
                sportevent: "ppb:event:22334455",
                name: "SBK Market 1",
                marketId: "1.166528788",
                runners: [
                  {
                    urn: "ppb:sbkRunner:1.166528788/19",
                    selectionId: 19,
                    name: "Some other Team A",
                    handicap: 0,
                    resultType: "HOME",
                  },
                  {
                    urn: "ppb:sbkRunner:1.166528788/20",
                    selectionId: 19,
                    name: "Some other Team A",
                    handicap: 0,
                    resultType: "DRAW",
                  },
                  {
                    urn: "ppb:sbkRunner:1.166528788/21",
                    selectionId: 19,
                    name: "Some other Team A",
                    handicap: 0,
                    resultType: "AWAY",
                  },
                ],
              },
            ],
          },
        },
      };
      const state = sportsbookMarketsReducer(undefined, action);
      expect(state).toEqual({
        "ppb:sbkMarket:1.166528788": {
          marketId: "1.166528788",
          name: "SBK Market 1",
          runners: [
            {
              handicap: 0,
              name: "Some other Team A",
              resultType: "HOME",
              selectionId: 19,
              urn: "ppb:sbkRunner:1.166528788/19",
            },
            {
              handicap: 0,
              name: "Some other Team A",
              resultType: "DRAW",
              selectionId: 19,
              urn: "ppb:sbkRunner:1.166528788/20",
            },
            {
              handicap: 0,
              name: "Some other Team A",
              resultType: "AWAY",
              selectionId: 19,
              urn: "ppb:sbkRunner:1.166528788/21",
            },
          ],
          sportevent: "ppb:event:22334455",
          urn: "ppb:sbkMarket:1.166528788",
        },
      });
    });
  });
});
