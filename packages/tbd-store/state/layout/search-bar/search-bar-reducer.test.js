import searchBarReducer from "./search-bar-reducer";

const stateMock = {
  results: [],
  search: {
    inputSearchTerm: "",
    result: {
      items: [],
      pageSize: 0,
      query: "",
      startIndex: 0,
    },
  },
};

describe("search bar reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = searchBarReducer(undefined, {});
      expect(state).toEqual({
        results: [],
        search: {
          inputSearchTerm: "",
          result: {
            items: [],
            pageSize: 0,
            query: "",
            startIndex: 0,
          },
        },
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS but have URN defined"', () => {
    it("must return the new state with updated results", () => {
      const result = {
        pageSize: 2,
        query: "query",
        items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
        startIndex: 3,
      };
      const action = {
        type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS",
        payload: { results: result, urn: "ppb:test" },
      };
      const state = searchBarReducer(stateMock, action);

      expect(state).toEqual({
        ...stateMock,
      });
    });
  });

  describe('when action type is "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS"', () => {
    it("must return the new state with updated results", () => {
      const result = {
        pageSize: 2,
        query: "query",
        items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
        startIndex: 3,
      };
      const action = {
        type: "NETWORK__FETCH_SEARCH_RESULTS_SUCCESS",
        payload: { results: result },
      };
      const state = searchBarReducer(stateMock, action);

      expect(state).toEqual({
        ...stateMock,
        search: { result, inputSearchTerm: "" },
      });
    });
  });

  describe('when action type is "UI__CLEAR_SEARCH_RESULTS but have URN defined"', () => {
    it("must return the new state with clean results", () => {
      const action = {
        type: "UI__CLEAR_SEARCH_RESULTS",
        payload: { urn: "ppb:test" },
      };
      const state = searchBarReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__CLEAR_SEARCH_RESULTS"', () => {
    it("must return the new state with clean results", () => {
      const mockState = {
        results: [],
        search: {
          result: {
            pageSize: 2,
            query: "query",
            items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
            startIndex: 3,
          },
        },
      };
      const action = {
        type: "UI__CLEAR_SEARCH_RESULTS",
        payload: {},
      };
      const state = searchBarReducer(mockState, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE_CLEAR but have URN defined"', () => {
    it("must return the new state with clean results", () => {
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE_CLEAR",
        payload: { urn: "ppb:test" },
      };
      const state = searchBarReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE_CLEAR"', () => {
    it("must return the new state with clean results", () => {
      const mockState = {
        results: [],
        search: {
          result: {
            pageSize: 2,
            query: "query",
            items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
            startIndex: 3,
          },
          inputSearchTerm: "search term",
        },
      };
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE_CLEAR",
        payload: {},
      };
      const state = searchBarReducer(mockState, action);
      expect(state).toEqual({
        results: [],
        search: {
          inputSearchTerm: "search term",
          result: {
            items: [],
            pageSize: 0,
            query: "",
            startIndex: 0,
          },
        },
      });
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE but have URN defined"', () => {
    it("must return the new state with the payload new inputSearchTerm", () => {
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE",
        payload: { text: "new search term", urn: "ppb:test" },
      };
      const state = searchBarReducer(stateMock, action);

      expect(state).toEqual(stateMock);
    });
  });

  describe('when action type is "UI__SEARCH_INPUT_CHANGE"', () => {
    it("must return the new state with the payload new inputSearchTerm", () => {
      const mockState = {
        results: [],
        search: {
          inputSearchTerm: "old search term",
          result: {
            pageSize: 2,
            query: "query",
            items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
            startIndex: 3,
          },
        },
      };
      const action = {
        type: "UI__SEARCH_INPUT_CHANGE",
        payload: { text: "new search term" },
      };
      const state = searchBarReducer(mockState, action);

      expect(state).toEqual({
        results: [],
        search: {
          inputSearchTerm: "new search term",
          result: {
            pageSize: 2,
            query: "query",
            items: [{ urn: "urn", name: "name", date: new Date("2020-01-01"), competition: "competition" }],
            startIndex: 3,
          },
        },
      });
    });
  });

  describe('when action type is "UI__SEARCH_BAR_LINK_CLICK"', () => {
    it("must return the new state with clean results", () => {
      const action = {
        type: "UI__SEARCH_BAR_LINK_CLICK",
        payload: {},
      };
      const state = searchBarReducer(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });
});
