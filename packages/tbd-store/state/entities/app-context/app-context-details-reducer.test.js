import appContextDetailsReducer from "./app-context-details-reducer";
import {
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_SUCCESS,
} from "../../../actions/app-context";

describe("appContextDetailsReducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("should must return the initial state", () => {
      const oldState = {};
      const state = appContextDetailsReducer(oldState, { type: "UNKNOWN_ACTION" });

      expect(state).toEqual({});
      expect(state).toBe(oldState);
    });
  });

  describe("when the action is NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING", () => {
    it("should update the state with the payload", () => {
      const action = {
        type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
        payload: {
          details: {
            isBlockedTerritory: true,
          },
        },
      };

      const state = appContextDetailsReducer({}, action);

      expect(state).toEqual({ isBlockedTerritory: true });
    });
  });

  describe("when the action is NETWORK__FETCH_APP_CONTEXT_FAILURE", () => {
    it("should set failed to true", () => {
      const action = {
        type: NETWORK__FETCH_APP_CONTEXT_FAILURE,
      };

      const state = appContextDetailsReducer({ isBlockedTerritory: false, failed: false }, action);

      expect(state).toEqual({ isBlockedTerritory: false, failed: true });
    });
  });

  describe("when the action is NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE", () => {
    it("should set failed to true", () => {
      const action = {
        type: NETWORK__FETCH_APP_CONTEXT_AUTH_FAILURE,
      };

      const state = appContextDetailsReducer({ isBlockedTerritory: false, failed: false }, action);

      expect(state).toEqual({ isBlockedTerritory: false, failed: true });
    });
  });

  describe("when the action is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    it("should set failed to false", () => {
      const action = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
      };

      const state = appContextDetailsReducer({ isBlockedTerritory: false, failed: true }, action);

      expect(state).toEqual({ isBlockedTerritory: false, failed: false });
    });
  });
});
