import { BETTING__OBB_STATE_UPDATE, BETTING__OBB_PLACE_FAILED_UPDATE } from "../../../actions/betting";
import obbBettingStateReducer from "./obb-betting-reducer";

const INITIAL_STATE = {
  potentialBets: {},
  legs: {},
  totalStake: null,
  totalPotentialReturns: null,
  maxPayoutLimits: { error: null, warning: null },
  validations: { betslip: [], potentialBets: {} },
  failures: { betslip: null, potentialBets: {}, legs: {} },
};

describe("ObbBettingStateReducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = obbBettingStateReducer(INITIAL_STATE, {});

      expect(state).toEqual(INITIAL_STATE);
    });

    it("should return the initial state when currentState is null", () => {
      const state = obbBettingStateReducer(null, {});

      expect(state).toEqual(INITIAL_STATE);
    });
  });

  describe("when BETTING__OBB_STATE_UPDATE action type is received", () => {
    it("should set the state as the new state", () => {
      const action = {
        type: BETTING__OBB_STATE_UPDATE,
        payload: {
          state: "New State",
        },
      };

      const state = obbBettingStateReducer(INITIAL_STATE, action);

      expect(state).toEqual("New State");
    });
  });

  describe("when BETTING__OBB_PLACE_FAILED_UPDATE action type is received", () => {
    it("should set the state as the new state", () => {
      const action = {
        type: BETTING__OBB_PLACE_FAILED_UPDATE,
        payload: {
          state: "New State",
        },
      };

      const state = obbBettingStateReducer(INITIAL_STATE, action);

      expect(state).toEqual("New State");
    });
  });
});
