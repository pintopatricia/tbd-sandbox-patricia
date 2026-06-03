import {
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
} from "../../actions/app-context";
import bootReducer from "./boot-slice";

describe("bootReducer", () => {
  describe("when state is not defined", () => {
    it("should set all props to default values", () => {
      const action = { type: "invalid" };
      const state = bootReducer(undefined, action);

      expect(state).toStrictEqual({
        allowLoadFromStorage: true,
        canUsePhoenixExchange: false,
        devTools: false,
      });
    });
  });

  describe("when the action is invalid", () => {
    const currentState = { allowLoadFromStorage: true, devTools: false };
    const action = { type: "invalid" };

    it("should return the current state", () => {
      const state = bootReducer(currentState, action);
      expect(state).toStrictEqual(currentState);
    });
  });

  describe("when it receives a NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING action", () => {
    it("should set failed to 'blocked'", () => {
      const currentState = { allowLoadFromStorage: true, devTools: false };
      const action = { type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING };

      const state = bootReducer(currentState, action);

      expect(state).toStrictEqual({
        allowLoadFromStorage: true,
        devTools: false,
        failed: "blocked",
      });
    });
  });

  describe("when it receives a NETWORK__FETCH_APP_CONTEXT_FAILURE action", () => {
    it("should set failed to 'failed'", () => {
      const currentState = { allowLoadFromStorage: true, devTools: false };
      const action = { type: NETWORK__FETCH_APP_CONTEXT_FAILURE };

      const state = bootReducer(currentState, action);

      expect(state).toStrictEqual({
        allowLoadFromStorage: true,
        devTools: false,
        failed: "failed",
      });
    });
  });

  describe("when it receives a NETWORK__FETCH_APP_CONTEXT_SUCCESS action", () => {
    const buildAction = (canUsePhoenixExchange) => ({
      type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
      payload: { initialState: { boot: { canUsePhoenixExchange } } },
    });

    it("should clear the failed state", () => {
      const currentState = {
        allowLoadFromStorage: true,
        devTools: false,
        failed: "failed",
      };

      const state = bootReducer(currentState, buildAction(false));

      expect(state).toStrictEqual({
        allowLoadFromStorage: true,
        devTools: false,
        failed: undefined,
        canUsePhoenixExchange: false,
      });
    });

    it("should clear the blocked state", () => {
      const currentState = {
        allowLoadFromStorage: true,
        devTools: false,
        failed: "blocked",
      };

      const state = bootReducer(currentState, buildAction(false));

      expect(state).toStrictEqual({
        allowLoadFromStorage: true,
        devTools: false,
        failed: undefined,
        canUsePhoenixExchange: false,
      });
    });

    it("should set canUsePhoenixExchange to true when payload contains true", () => {
      const currentState = { allowLoadFromStorage: true, devTools: false };

      const state = bootReducer(currentState, buildAction(true));

      expect(state.canUsePhoenixExchange).toBe(true);
    });

    it("should set canUsePhoenixExchange to false when payload contains false", () => {
      const currentState = { allowLoadFromStorage: true, devTools: false };

      const state = bootReducer(currentState, buildAction(false));

      expect(state.canUsePhoenixExchange).toBe(false);
    });

    it("should set canUsePhoenixExchange to false when boot is absent from payload", () => {
      const currentState = { allowLoadFromStorage: true, devTools: false };
      const action = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: { initialState: {} },
      };

      const state = bootReducer(currentState, action);

      expect(state.canUsePhoenixExchange).toBe(false);
    });
  });
});
