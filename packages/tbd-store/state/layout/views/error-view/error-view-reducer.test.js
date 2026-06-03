import errorViewReducer from "./error-view-reducer";
import { ERROR_VIEW__ADD } from "../../../../actions/error";

const INITIAL_STATE = {};
const ERROR_VIEW_URN = "ppb:tbd:view:error";

const STATE_MOCK = {
  [ERROR_VIEW_URN]: {
    urn: ERROR_VIEW_URN,
    errorType: "error-type",
    helpCenterUrl: "url",
  },
};

const UPDATE_MOCK = {
  [ERROR_VIEW_URN]: {
    urn: ERROR_VIEW_URN,
    errorType: "error-type-2",
    helpCenterUrl: "url-2",
  },
};

describe("error view reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = errorViewReducer(INITIAL_STATE, "someAction");

      expect(state).toStrictEqual(INITIAL_STATE);
    });
  });

  describe("when action type is 'ERROR_VIEW__ADD'", () => {
    const ACTION = {
      type: ERROR_VIEW__ADD,
      payload: STATE_MOCK[ERROR_VIEW_URN],
    };

    const UPDATE_ACTION = {
      type: ERROR_VIEW__ADD,
      payload: UPDATE_MOCK[ERROR_VIEW_URN],
    };

    const state = errorViewReducer(INITIAL_STATE, ACTION);

    it("should return the new state", () => {
      expect(state).toStrictEqual(STATE_MOCK);
    });

    it("should return the updated state", () => {
      const updatedState = errorViewReducer(state, UPDATE_ACTION);

      expect(updatedState).toStrictEqual({
        [ERROR_VIEW_URN]: {
          urn: ERROR_VIEW_URN,
          errorType: "error-type-2",
          helpCenterUrl: "url-2",
        },
      });
    });
  });

  describe("when action type is 'ERROR_VIEW/ADD' and the payload is empty", () => {
    const ACTION = {
      type: ERROR_VIEW__ADD,
      payload: {},
    };

    it("should return the initial state", () => {
      const state = errorViewReducer(INITIAL_STATE, ACTION);

      expect(state).toStrictEqual(INITIAL_STATE);
    });
  });

  describe("when action type is unknown", () => {
    const ACTION = {
      type: "UNKNOWN_ACTION",
      payload: {
        layouts: { views: {} },
      },
    };

    it("should return the initial state", () => {
      const state = errorViewReducer(undefined, ACTION);

      expect(state).toStrictEqual(INITIAL_STATE);
    });
  });
});
