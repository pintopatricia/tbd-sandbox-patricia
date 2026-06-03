import exchangeBettingReducer from "./exchange-betting-reducer";
import { BETTING__EXC_STATE_UPDATE } from "../../../actions/betting";

describe("exchangeBettingReducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = exchangeBettingReducer(undefined, {});

      expect(state).toEqual({});
    });
  });

  describe("when 'BETTING/EXC_STATE_UPDATE' action type is received", () => {
    it("should update the store with the new state", () => {
      const action = {
        type: BETTING__EXC_STATE_UPDATE,
        payload: {
          state: { bettingState: "New betting state" },
        },
      };

      const state = exchangeBettingReducer({}, action);

      expect(state).toEqual({ bettingState: "New betting state" });
    });
  });
});
