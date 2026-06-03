import searchBarReducer from "./search-bar-state-reducer";

describe("Search bar state reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state when action type is not met", () => {
      const state = searchBarReducer(undefined, { type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS" });
      expect(state).toEqual({
        search: {
          defaultURN: {
            inputSearchTerm: "",
            result: {
              items: [],
              pageSize: 0,
              query: "",
              startIndex: 0,
            },
          },
        },
      });
    });

    it("must return a new state when action type is UI__SEARCH_BAR_INPUT_CHANGE", () => {
      const action = {
        type: "UI__SEARCH_BAR_INPUT_CHANGE",
        payload: {
          urn: "defaultURN",
          text: "football",
        },
      };
      const state = searchBarReducer(undefined, action);
      expect(state).toEqual({
        search: {
          defaultURN: {
            inputSearchTerm: "football",
            result: {
              items: [],
              pageSize: 0,
              query: "",
              startIndex: 0,
            },
          },
        },
      });
    });

    it("must return a new state when action type is NETWORK__FETCH_SEARCH_RESULTS_SUCCESS", () => {
      const result = {
        pageSize: 2,
        query: "query",
        items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
        startIndex: 3,
      };
      const action = {
        type: "NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS",
        payload: { results: result, urn: "defaultURN" },
      };
      const state = searchBarReducer(undefined, action);
      expect(state).toEqual({
        search: {
          defaultURN: {
            inputSearchTerm: "",
            result: {
              items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
              pageSize: 2,
              query: "query",
              startIndex: 3,
            },
          },
        },
      });
    });
    it("must return the initial state when action type is UI__CLEAR_SEARCH_RESULTS", () => {
      const action = {
        type: "UI__SEARCH_BAR_INPUT_CHANGE_CLEAR",
        payload: { urn: "defaultURN" },
      };
      const state = searchBarReducer(undefined, action);
      expect(state).toEqual({
        search: {
          defaultURN: {
            inputSearchTerm: "",
            result: {
              items: [],
              pageSize: 0,
              query: "",
              startIndex: 0,
            },
          },
        },
      });
    });
  });
});
