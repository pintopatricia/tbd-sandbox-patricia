import sportsbookBettingStateReducer from "./sportsbook-betting-reducer";
import { BETTING__SBK_STATE_UPDATE, BETTING__SBK_PLACE_FAILED_UPDATE } from "../../../actions/betting";

describe("sportsbookBettingStateReducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = sportsbookBettingStateReducer("Initial State", {});

      expect(state).toEqual("Initial State");
    });
  });

  describe("when BETTING__SBK_STATE_UPDATE action type is received", () => {
    it("should set the payload as the new state", () => {
      const action = {
        type: BETTING__SBK_STATE_UPDATE,
        payload: {
          state: "New State",
        },
      };

      const state = sportsbookBettingStateReducer("Initial State", action);

      expect(state).toEqual("New State");
    });
  });

  describe("when BETTING__SBK_PLACE_FAILED_UPDATE action type is received", () => {
    it("should set the payload as the new state", () => {
      const action = {
        type: BETTING__SBK_PLACE_FAILED_UPDATE,
        payload: {
          state: "New State",
        },
      };

      const state = sportsbookBettingStateReducer("Initial State", action);

      expect(state).toEqual("New State");
    });
  });
});
