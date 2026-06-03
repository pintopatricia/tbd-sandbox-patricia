import throttlesReducer from "./throttles-reducer";
import { NETWORK__FETCH_APP_CONTEXT_SUCCESS } from "../../../actions/app-context";
import { SET_THROTTLES, RESET_THROTTLES } from "../../../actions/settings-page";

describe("throttlesReducer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = throttlesReducer({}, {});

      expect(state).toEqual({});
    });
  });
  describe("when the action is NETWORK__FETCH_APP_CONTEXT_SUCCESS", () => {
    it("should merge the payload maintaining overriden throttles", () => {
      const action = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          initialState: {
            entities: {
              throttles: {
                THROTTLE: { isActive: false },
                THROTTLE_2: { isActive: true },
              },
            },
          },
        },
      };

      const state = throttlesReducer(
        {
          THROTTLE: { isActive: true, isOverriden: true },
        },
        action,
      );

      expect(state).toEqual({
        THROTTLE: { isActive: true, isOverriden: true },
        THROTTLE_2: { isActive: true },
      });
    });

    it("should return the state object unchanged", () => {
      const action = {
        type: NETWORK__FETCH_APP_CONTEXT_SUCCESS,
        payload: {
          initialState: null,
        },
      };

      const oldState = {
        THROTTLE: { isActive: true, isOverriden: true },
      };

      const state = throttlesReducer(oldState, action);

      expect(state).toEqual({
        THROTTLE: { isActive: true, isOverriden: true },
      });
      expect(state).toBe(oldState);
    });
  });

  describe("when the action is SET_THROTTLES", () => {
    it("should merge the payload with the state", () => {
      const action = {
        type: SET_THROTTLES,
        payload: {
          value: {
            BOXEVER: { isActive: true, isOverriden: true },
            BFF_APP_CONTEXT: { isActive: true, isOverriden: true },
          },
        },
      };

      const state = throttlesReducer(
        {
          BOXEVER: { isActive: false, isOverriden: true },
          BOXEVER_PREFERENCES: { isActive: false, isOverriden: true },
        },
        action,
      );

      expect(state).toEqual({
        BOXEVER: { isActive: true, isOverriden: true },
        BOXEVER_PREFERENCES: { isActive: false, isOverriden: true },
        BFF_APP_CONTEXT: { isActive: true, isOverriden: true },
      });
    });
  });
  describe("when the action is RESET_THROTTLES", () => {
    it("should return empty object", () => {
      const action = {
        type: RESET_THROTTLES,
      };

      const state = throttlesReducer(
        {
          BOXEVER: { isActive: false, isOverriden: true },
          BOXEVER_PREFERENCES: { isActive: false, isOverriden: true },
        },
        action,
      );

      expect(state).toEqual({});
    });
  });
});
