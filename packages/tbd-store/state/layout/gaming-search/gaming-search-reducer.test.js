import gamingSearchReducer from "./gaming-search-reducer";
import {
  UI__GAMING__CLEAR_SEARCH_RESULTS,
  NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
  UI__GAMING__SEARCH_INPUT_CHANGE,
  UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR,
  NETWORK__APPEND_GAMING_SEARCH_RESULTS,
  NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST,
} from "../../../actions/gaming-search";

import { BOTTOM_BAR_PUSH } from "../../../actions";

const INITIAL_STATE = {
  defaultURN: {
    inputSearchTerm: "",
    result: [],
    gamesRetrieved: false,
    hasNextPage: false,
    endCursor: null,
    totalCount: 0,
    isLoadingMore: false,
  },
};

const customState = {
  "urn:test:search": {
    inputSearchTerm: "test term",
    result: [],
    gamesRetrieved: false,
  },
};

const fetchSuccessAction = {
  type: NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
  payload: {
    urn: "urn:test:search",
    gamingSearchResults: [
      { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1", url: "url2" },
      { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2", url: "url2" },
    ],
    inputSearchTerm: "test",
    hasNextPage: false,
    endCursor: null,
    totalCount: 2,
  },
};

const searchInputChangeAction = {
  type: UI__GAMING__SEARCH_INPUT_CHANGE,
  payload: {
    urn: "urn:test:search",
    text: "new search term",
  },
};

const clearSearchResultsAction = {
  type: UI__GAMING__CLEAR_SEARCH_RESULTS,
  payload: { urn: "urn:test:search" },
};

const searchInputChangeClearAction = {
  type: UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR,
  payload: { urn: "urn:test:search" },
};

describe("GamingSearch reducer", () => {
  it("should return the initial state when an unknown action is provided", () => {
    const state = gamingSearchReducer(undefined, {});
    expect(state).toEqual(INITIAL_STATE);
  });

  describe('when action type is "NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS"', () => {
    it("should add fetched results to the state for the given URN", () => {
      const state = gamingSearchReducer(undefined, fetchSuccessAction);
      expect(state).toEqual({
        defaultURN: {
          inputSearchTerm: "",
          result: [],
          gamesRetrieved: false,
          hasNextPage: false,
          endCursor: null,
          totalCount: 0,
          isLoadingMore: false,
        },
        "urn:test:search": {
          inputSearchTerm: "test",
          result: [
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1", url: "url2" },
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2", url: "url2" },
          ],
          gamesRetrieved: true,
          hasNextPage: false,
          endCursor: null,
          totalCount: 2,
          isLoadingMore: false,
        },
      });
    });
  });

  describe('when action type is "UI__GAMING__SEARCH_INPUT_CHANGE"', () => {
    it("should update the inputSearchTerm for the given URN", () => {
      const state = gamingSearchReducer(customState, searchInputChangeAction);
      expect(state["urn:test:search"].inputSearchTerm).toEqual("new search term");
    });

    it("should update the inputSearchTerm for the defaultURN if no URN is provided", () => {
      const action = { type: UI__GAMING__SEARCH_INPUT_CHANGE, payload: { text: "default search term" } };
      const state = gamingSearchReducer(undefined, action);
      expect(state.defaultURN.inputSearchTerm).toEqual("default search term");
    });
  });

  describe('when action type is "UI__GAMING__CLEAR_SEARCH_RESULTS" or "UI__GAMING__SEARCH_CANCEL_CLICK"', () => {
    it("should reset the state for the given URN", () => {
      const state = gamingSearchReducer(customState, clearSearchResultsAction);
      expect(state["urn:test:search"]).toEqual({
        inputSearchTerm: "",
        result: [],
        gamesRetrieved: false,
        hasNextPage: false,
        endCursor: null,
        totalCount: 0,
        isLoadingMore: false,
      });
    });

    it("should not modify state if no URN is provided", () => {
      const action = { type: UI__GAMING__CLEAR_SEARCH_RESULTS, payload: {} };
      const state = gamingSearchReducer(customState, action);
      expect(state).toEqual(customState);
    });
  });

  describe('when action type is "UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR"', () => {
    it("should clear inputSearchTerm and results for the given URN", () => {
      const state = gamingSearchReducer(customState, searchInputChangeClearAction);
      expect(state["urn:test:search"]).toEqual({
        inputSearchTerm: "test term",
        result: [],
        gamesRetrieved: false,
        hasNextPage: false,
        endCursor: null,
        totalCount: 0,
        isLoadingMore: false,
      });
    });
  });

  describe('when action type is "BOTTOM_BAR_PUSH" or "PUSH"', () => {
    it("should reset gamingSearch state to the initial state", () => {
      const action = { type: BOTTOM_BAR_PUSH };
      const state = gamingSearchReducer(customState, action);
      expect(state).toEqual(INITIAL_STATE);
    });
  });

  describe("pagination", () => {
    describe('when action type is "NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS" with pagination data', () => {
      it("should store pagination metadata (hasNextPage, endCursor, totalCount)", () => {
        const action = {
          type: NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
          payload: {
            urn: "urn:test:search",
            gamingSearchResults: [
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1" },
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2" },
            ],
            inputSearchTerm: "jackpot",
            hasNextPage: true,
            endCursor: "cursor123",
            totalCount: 50,
          },
        };

        const state = gamingSearchReducer(undefined, action);

        expect(state["urn:test:search"]).toEqual({
          inputSearchTerm: "jackpot",
          result: [
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1" },
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2" },
          ],
          gamesRetrieved: true,
          hasNextPage: true,
          endCursor: "cursor123",
          totalCount: 50,
          isLoadingMore: false,
        });
      });

      it("should handle hasNextPage false on initial fetch", () => {
        const action = {
          type: NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
          payload: {
            urn: "urn:test:search",
            gamingSearchResults: [{ type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1" }],
            inputSearchTerm: "rare",
            hasNextPage: false,
            endCursor: null,
            totalCount: 1,
          },
        };

        const state = gamingSearchReducer(undefined, action);

        expect(state["urn:test:search"]).toMatchObject({
          hasNextPage: false,
          endCursor: null,
          totalCount: 1,
        });
      });
    });

    describe('when action type is "NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST"', () => {
      it("should set isLoadingMore to true", () => {
        const existingState = {
          "urn:test:search": {
            inputSearchTerm: "jackpot",
            result: [
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1" },
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2" },
            ],
            gamesRetrieved: true,
            hasNextPage: true,
            endCursor: "cursor123",
            totalCount: 50,
            isLoadingMore: false,
          },
        };

        const action = {
          type: NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST,
          payload: {
            urn: "urn:test:search",
          },
        };

        const state = gamingSearchReducer(existingState, action);

        expect(state["urn:test:search"].isLoadingMore).toBe(true);
      });
    });

    describe('when action type is "NETWORK__APPEND_GAMING_SEARCH_RESULTS"', () => {
      it("should append new results to existing results", () => {
        const existingState = {
          "urn:test:search": {
            inputSearchTerm: "jackpot",
            result: [
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1" },
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2" },
            ],
            gamesRetrieved: true,
            hasNextPage: true,
            endCursor: "cursor123",
            totalCount: 50,
            isLoadingMore: true,
          },
        };

        const action = {
          type: NETWORK__APPEND_GAMING_SEARCH_RESULTS,
          payload: {
            urn: "urn:test:search",
            gamingSearchResults: [
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn3" },
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn4" },
            ],
            hasNextPage: true,
            endCursor: "cursor456",
          },
        };

        const state = gamingSearchReducer(existingState, action);

        expect(state["urn:test:search"]).toEqual({
          inputSearchTerm: "jackpot",
          result: [
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1" },
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2" },
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn3" },
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn4" },
          ],
          gamesRetrieved: true,
          hasNextPage: true,
          endCursor: "cursor456",
          totalCount: 50,
          isLoadingMore: false,
        });
      });

      it("should update hasNextPage to false when reaching the end", () => {
        const existingState = {
          "urn:test:search": {
            inputSearchTerm: "jackpot",
            result: [
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn1" },
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn2" },
            ],
            gamesRetrieved: true,
            hasNextPage: true,
            endCursor: "cursor123",
            totalCount: 4,
            isLoadingMore: true,
          },
        };

        const action = {
          type: NETWORK__APPEND_GAMING_SEARCH_RESULTS,
          payload: {
            urn: "urn:test:search",
            gamingSearchResults: [
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn3" },
              { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn4" },
            ],
            hasNextPage: false,
            endCursor: null,
          },
        };

        const state = gamingSearchReducer(existingState, action);

        expect(state["urn:test:search"]).toMatchObject({
          hasNextPage: false,
          endCursor: null,
          isLoadingMore: false,
        });
      });
    });
  });
});
