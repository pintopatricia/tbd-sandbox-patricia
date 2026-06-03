import failedCardUrnsReducer from "./failed-card-urns-reducer";

describe("failedCardUrnsReducer", () => {
  describe("when action is not handled", () => {
    it("should return the initial state", () => {
      expect(failedCardUrnsReducer(undefined, {})).toEqual([]);
    });

    it("should return current state unchanged", () => {
      expect(failedCardUrnsReducer(["urn:1"], {})).toEqual(["urn:1"]);
    });
  });

  describe('when action type is "DELETE_VIEW_ITEMS"', () => {
    it("should accumulate new URNs", () => {
      const action = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["urn:1", "urn:2"],
      };

      expect(failedCardUrnsReducer([], action)).toEqual(["urn:1", "urn:2"]);
    });

    it("should deduplicate URNs already in state", () => {
      const action = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["urn:1", "urn:3"],
      };

      expect(failedCardUrnsReducer(["urn:1", "urn:2"], action)).toEqual(["urn:1", "urn:2", "urn:3"]);
    });

    it("should return same reference when no new URNs are added", () => {
      const state = ["urn:1"];
      const action = {
        type: "DELETE_VIEW_ITEMS",
        payload: ["urn:1"],
      };

      expect(failedCardUrnsReducer(state, action)).toBe(state);
    });
  });

  describe('when action type is "DELETE_LAYOUT"', () => {
    it("should reset to empty array", () => {
      const action = { type: "DELETE_LAYOUT" };

      expect(failedCardUrnsReducer(["urn:1", "urn:2"], action)).toEqual([]);
    });
  });
});
