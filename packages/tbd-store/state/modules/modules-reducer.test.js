import { MODULES__EXC_BETTING_LOADED, MODULES__SBK_BETTING_LOADED } from "../../actions/modules";
import modulesReducer from "./modules-reducer";

describe('"modules" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the default state", () => {
      const state = modulesReducer({ sbkBetting: false, excBetting: false }, {});
      expect(state).toEqual({ sbkBetting: false, excBetting: false });
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = modulesReducer(undefined, {});
      expect(state).toEqual({ sbkBetting: false, excBetting: false });
    });
  });

  describe("when action type is MODULES__SBK_BETTING_LOADED", () => {
    it("must return the new state with betting true", () => {
      const action = {
        type: MODULES__SBK_BETTING_LOADED,
      };

      const state = modulesReducer({ sbkBetting: false, excBetting: false }, action);
      expect(state).toEqual({ sbkBetting: true, excBetting: false });
    });
  });

  describe("when action type is MODULES__EXC_BETTING_LOADED", () => {
    it("must return the new state with betting true", () => {
      const action = {
        type: MODULES__EXC_BETTING_LOADED,
      };

      const state = modulesReducer({ sbkBetting: false, excBetting: false }, action);
      expect(state).toEqual({ sbkBetting: false, excBetting: true });
    });
  });
});
