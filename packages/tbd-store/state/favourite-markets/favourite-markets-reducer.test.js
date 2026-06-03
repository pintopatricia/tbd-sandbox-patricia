import {
  SET_FAVOURITE_MARKET_MUTATION_FAILURE,
  SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
  SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
  UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE,
} from "../../actions/favourite-markets";

import favouriteMarketsReducer from "./favourite-markets-reducer";

const INITIAL_STATE_MOCK = {
  tooltipClosedCounter: 0,
  isMutationInProgress: false,
};

describe("favouriteMarketsReducer", () => {
  describe("when action type is not met by the reducer", () => {
    const action = { type: "UNKNOWN_ACTION" };

    it("must return the initial state when state is undefined", () => {
      expect(favouriteMarketsReducer(undefined, {})).toEqual({
        tooltipClosedCounter: 0,
        isTooltipClosed: false,
        isMutationInProgress: false,
      });
    });

    it("must return the current state when action type is unknown", () => {
      expect(favouriteMarketsReducer(INITIAL_STATE_MOCK, action)).toBe(INITIAL_STATE_MOCK);
    });
  });

  describe("when action type is 'UI/FAVOURITE_MARKETS_TOOLTIP_CLOSE'", () => {
    const action = { type: UI__FAVOURITE_MARKETS_TOOLTIP_CLOSE };

    it("should increment counter and set tooltip as closed", () => {
      expect(favouriteMarketsReducer(INITIAL_STATE_MOCK, action)).toEqual({
        tooltipClosedCounter: INITIAL_STATE_MOCK.tooltipClosedCounter + 1,
        isTooltipClosed: true,
        isMutationInProgress: false,
      });
    });

    it("should increment tooltipClosedCounter on repeated tooltip closed actions and keep isTooltipClosed true", () => {
      const state1 = favouriteMarketsReducer(INITIAL_STATE_MOCK, action);

      expect(state1.tooltipClosedCounter).toBe(INITIAL_STATE_MOCK.tooltipClosedCounter + 1);
      expect(state1.isTooltipClosed).toBe(true);

      const state2 = favouriteMarketsReducer(state1, action);

      expect(state2.tooltipClosedCounter).toBe(state1.tooltipClosedCounter + 1);
      expect(state2.isTooltipClosed).toBe(true);
    });
  });

  describe("when action type is 'SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS'", () => {
    const action = { type: SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS };

    it("should set isMutationInProgress to true", () => {
      expect(favouriteMarketsReducer(INITIAL_STATE_MOCK, action).isMutationInProgress).toBe(true);
    });
  });

  describe("when action type is 'SET_FAVOURITE_MARKET_MUTATION_SUCCESS'", () => {
    const action = { type: SET_FAVOURITE_MARKET_MUTATION_SUCCESS };

    it("should set isMutationInProgress to false", () => {
      expect(favouriteMarketsReducer(INITIAL_STATE_MOCK, action).isMutationInProgress).toBe(false);
    });
  });

  describe("when action type is 'SET_FAVOURITE_MARKET_MUTATION_FAILURE'", () => {
    const action = { type: SET_FAVOURITE_MARKET_MUTATION_FAILURE };

    it("should set isMutationInProgress to false", () => {
      expect(favouriteMarketsReducer(INITIAL_STATE_MOCK, action).isMutationInProgress).toBe(false);
    });
  });
});
