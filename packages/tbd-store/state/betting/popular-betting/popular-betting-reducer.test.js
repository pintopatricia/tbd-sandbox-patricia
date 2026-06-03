import popularBettingReducer from "./popular-betting-reducer";

const stateMock = {
  "bo-123": {
    selections: [
      {
        marketUrn: "market-123",
        runnerUrn: "runner-123",
      },
    ],
    bettingOpportunityType: "POPULAR",
    bettingOpportunityId: "bo-123",
  },
};

describe('"popularBetting" reducer', () => {
  describe("when state is undefined", () => {
    it("must return the initial state", () => {
      const state = popularBettingReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe("when action type is not met by the reducer", () => {
    it("must return the same state", () => {
      const state = popularBettingReducer({ state: "state" }, {});

      expect(state).toEqual({ state: "state" });
    });
  });

  describe('when action type is "BETTING/SBK_ADD_SELECTIONS"', () => {
    it('must return the new state with "popularBetting"', () => {
      const action = {
        type: "BETTING/SBK_ADD_SELECTIONS",
        payload: {
          selections: [
            {
              marketUrn: "market-123",
              runnerUrn: "runner-123",
            },
          ],
          bettingOpportunityId: "bo-123",
          bettingOpportunityType: "POPULAR",
        },
      };
      const state = popularBettingReducer(undefined, action);

      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "NETWORK/PLACE_SBK_BET_SUCCESS"', () => {
    it("must return the initial state", () => {
      const action = {
        type: "NETWORK/PLACE_SBK_BET_SUCCESS",
        payload: {},
      };
      const state = popularBettingReducer(undefined, action);

      expect(state).toEqual({});
    });
  });

  describe('when action type is "BETTING/SBK_CLEAR_ACTION"', () => {
    it("must return the initial state", () => {
      const action = {
        type: "BETTING/SBK_CLEAR_ACTION",
        payload: {},
      };
      const state = popularBettingReducer(undefined, action);

      expect(state).toEqual({});
    });
  });
});
