import { FETCH_CATALOGUE_SUCCESS, NETWORK__SBK_MARKETS_SUCCESS } from "../../../actions/catalogue";
import { FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS } from "../../../actions/sportsbook-markets";
import { reduceEntities } from "../create-entity-reducer";
import bettingOpportunitiesReducer from "./popular-betting-opportunities-reducer";

jest.mock("../create-entity-reducer", () => ({
  reduceEntities: jest.fn((state) => state),
}));

const stateMock = {
  "ppb:bo:12345": {
    typename: "BettingOpportunity",
    urn: "ppb:bo:12345",
    count: 5,
    selections: [{ marketUrn: "ppb:sbkMarket:12345", runnerUrn: "ppb:sbkRunner:12345" }],
  },
  "ppb:bo:12346": {
    typename: "BettingOpportunity",
    urn: "ppb:bo:12346",
    count: 5,
    selections: [{ marketUrn: "ppb:sbkMarket:123456", runnerUrn: "ppb:sbkRunner:123456" }],
  },
};

describe('"bettingopportunities" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = bettingOpportunitiesReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe.each([NETWORK__SBK_MARKETS_SUCCESS, FETCH_CATALOGUE_SUCCESS])("when action type is %s", (type) => {
    it("should call entity reducer", () => {
      const action = {
        type,
        payload: {
          data: {},
        },
      };

      bettingOpportunitiesReducer(stateMock, action);

      expect(reduceEntities).toHaveBeenCalledWith(stateMock, action.payload, "PopularBettingOpportunity");
    });
  });

  describe("FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS", () => {
    describe("when we have Pretty Display Odds", () => {
      it("should update prices of betting opportunities", () => {
        const action = {
          type: FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS,
          payload: {
            result: {
              betCombinations: [
                {
                  winAvgOdds: {
                    decimalDisplayOdds: { decimalOdds: 1000 },
                    prettyDisplayOdds: {
                      decimalOdds: { decimalOdds: 1337 },
                      fractionalOdds: { numerator: 10, denominator: 1 },
                    },
                    americanDisplayOdds: { americanOddsInt: 130 },
                  },
                  originalWinAvgOdds: { decimalDisplayOdds: { decimalOdds: 20 } },
                  combinationGroup: 1,
                },
                {
                  winAvgOdds: {
                    prettyDisplayOdds: {
                      decimalOdds: { decimalOdds: 1100 },
                      fractionalOdds: { numerator: 11, denominator: 1 },
                    },
                    americanDisplayOdds: { americanOddsInt: 130 },
                  },
                  originalWinAvgOdds: { decimalDisplayOdds: { decimalOdds: 21 } },
                  combinationGroupId: "bo-12346",
                },
              ],
            },
            combinationGroups: {
              1: "ppb:bo:12345",
              "bo-12346": "ppb:bo:12346",
            },
          },
        };

        const state = bettingOpportunitiesReducer(stateMock, action);

        expect(state).toEqual({
          "ppb:bo:12345": {
            ...stateMock["ppb:bo:12345"],
            odds: {
              decimal: 1337,
              fractional: {
                denominator: 1,
                numerator: 10,
              },
              american: 130,
            },
            originalOdds: {
              decimal: 20,
            },
          },
          "ppb:bo:12346": {
            ...stateMock["ppb:bo:12346"],
            odds: {
              decimal: 1100,
              fractional: {
                denominator: 1,
                numerator: 11,
              },
              american: 130,
            },
            originalOdds: {
              decimal: 21,
            },
          },
        });
      });
    });

    describe("when we don't have Pretty Display Odds", () => {
      it("should update prices of betting opportunities with fallback odds", () => {
        const action = {
          type: FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS,
          payload: {
            result: {
              betCombinations: [
                {
                  winAvgOdds: {
                    decimalDisplayOdds: { decimalOdds: 1000 },
                    fractionalDisplayOdds: { numerator: 10, denominator: 1 },
                    americanDisplayOdds: { americanOddsInt: -100 },
                  },
                  originalWinAvgOdds: {
                    decimalDisplayOdds: { decimalOdds: 20 },
                    fractionalDisplayOdds: { numerator: 20, denominator: 1 },
                    americanDisplayOdds: { americanOddsInt: -100 },
                  },
                  combinationGroup: 1,
                },
              ],
            },
            combinationGroups: {
              1: "ppb:bo:12345",
            },
          },
        };

        const state = bettingOpportunitiesReducer(stateMock, action);

        expect(state).toEqual(
          expect.objectContaining({
            "ppb:bo:12345": {
              ...stateMock["ppb:bo:12345"],
              odds: {
                decimal: 1000,
                fractional: {
                  denominator: 1,
                  numerator: 10,
                },
                american: -100,
              },
              originalOdds: {
                decimal: 20,
                fractional: {
                  numerator: 20,
                  denominator: 1,
                },
                american: -100,
              },
            },
          }),
        );
      });
    });

    describe("when betting opportunity has both Pretty Display Odds and decimal & fractional", () => {
      it("should use the Pretty Display Odds", () => {
        const action = {
          type: FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS,
          payload: {
            result: {
              betCombinations: [
                {
                  winAvgOdds: {
                    prettyDisplayOdds: {
                      decimalOdds: {
                        decimalOdds: 1200,
                      },
                      fractionalOdds: {
                        numerator: 12,
                        denominator: 1,
                      },
                    },
                    decimalDisplayOdds: { decimalOdds: 1000 },
                    fractionalDisplayOdds: { numerator: 10, denominator: 1 },
                    americanDisplayOdds: { americanOddsInt: 120 },
                  },
                  originalWinAvgOdds: {
                    decimalDisplayOdds: { decimalOdds: 10 },
                    fractionalDisplayOdds: { numerator: 10, denominator: 1 },
                    americanDisplayOdds: { americanOddsInt: 120 },
                  },
                  combinationGroupId: "bo-12346",
                },
              ],
            },
            combinationGroups: {
              "bo-12346": "ppb:bo:12346",
            },
          },
        };

        const state = bettingOpportunitiesReducer(stateMock, action);

        expect(state).toEqual(
          expect.objectContaining({
            "ppb:bo:12346": {
              ...stateMock["ppb:bo:12346"],
              odds: {
                decimal: 1200,
                fractional: {
                  denominator: 1,
                  numerator: 12,
                },
                american: 120,
              },
              originalOdds: {
                decimal: 10,
                fractional: {
                  numerator: 10,
                  denominator: 1,
                },
                american: 120,
              },
            },
          }),
        );
      });
    });

    it("should ignore updates if id's do not match", () => {
      const action = {
        type: FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS,
        payload: {
          result: {
            betCombinations: [
              {
                winAvgOdds: { decimalDisplayOdds: { decimalOdds: 1000 } },
                combinationGroup: 0,
              },
            ],
          },
          combinationGroups: ["ppb:bo:55555"],
        },
      };

      const state = bettingOpportunitiesReducer(stateMock, action);

      expect(state).toEqual(stateMock);
    });
  });
});
