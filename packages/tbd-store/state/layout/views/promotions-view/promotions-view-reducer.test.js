import { PUSH } from "../../../../actions/router";
import promotionsViewReducer from "./promotions-view-reducer";

const INITIAL_STATE = {};
const PROMOTIONS_VIEW_URN = "ppb:tbd:view:promotions:gaming-123";

const STATE_MOCK = {
  [PROMOTIONS_VIEW_URN]: {
    urn: PROMOTIONS_VIEW_URN,
    items: [{ urn: "ppb:tbd:cardgroup:swimlane:1" }, { urn: "ppb:tbd:cardgroup:swimlane:2" }],
  },
};

const UPDATE_MOCK = {
  urn: PROMOTIONS_VIEW_URN,
  items: [{ urn: "ppb:tbd:cardgroup:swimlane:3" }],
};

const FETCH_CATALOGUE_SUCCESS_ACTIONS = "FETCH_CATALOGUE_SUCCESS";

describe("promotions view reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = promotionsViewReducer(INITIAL_STATE, "someAction");

      expect(state).toStrictEqual(INITIAL_STATE);
    });
  });

  describe("when action type is 'FETCH_CATALOGUE_SUCCESS'", () => {
    const ACTION = {
      type: FETCH_CATALOGUE_SUCCESS_ACTIONS,
      payload: {
        data: { PromotionsView: [STATE_MOCK[PROMOTIONS_VIEW_URN]] },
      },
    };

    const UPDATE_ACTION = {
      type: FETCH_CATALOGUE_SUCCESS_ACTIONS,
      payload: {
        data: { PromotionsView: [UPDATE_MOCK] },
      },
    };

    const state = promotionsViewReducer(INITIAL_STATE, ACTION);

    it("should return the new state", () => {
      expect(state).toStrictEqual(STATE_MOCK);
    });

    it("should return the updated state", () => {
      const updatedState = promotionsViewReducer(state, UPDATE_ACTION);

      expect(updatedState).toStrictEqual({
        [PROMOTIONS_VIEW_URN]: {
          urn: PROMOTIONS_VIEW_URN,
          items: [
            { urn: "ppb:tbd:cardgroup:swimlane:1" },
            { urn: "ppb:tbd:cardgroup:swimlane:2" },
            { urn: "ppb:tbd:cardgroup:swimlane:3" },
          ],
        },
      });
    });
  });

  describe("when action type is 'FETCH_CATALOGUE_SUCCESS' and the payload is incomplete", () => {
    const ACTION = {
      type: FETCH_CATALOGUE_SUCCESS_ACTIONS,
      payload: {
        data: {},
      },
    };

    it("should return the initial state", () => {
      const state = promotionsViewReducer(INITIAL_STATE, ACTION);

      expect(state).toStrictEqual(INITIAL_STATE);
    });
  });

  describe("when action type is 'PUSH'", () => {
    const ACTION = {
      type: PUSH,
      payload: {
        layouts: { views: {} },
      },
    };

    it("should return the initial state", () => {
      const state = promotionsViewReducer(undefined, ACTION);

      expect(state).toStrictEqual(INITIAL_STATE);
    });
  });

  describe('when action type is "DELETE_VIEW_ITEMS"', () => {
    it("should remove those URNS from list items", () => {
      const ACTION = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["ppb:tbd:cardgroup:swimlane:1"],
      };

      const state = promotionsViewReducer(STATE_MOCK, ACTION);

      expect(state["ppb:tbd:view:promotions:gaming-123"].items).toEqual([{ urn: "ppb:tbd:cardgroup:swimlane:2" }]);
    });
  });
});
