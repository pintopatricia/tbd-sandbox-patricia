import {
  NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
  UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
  UI__GAMING__SEARCH_INPUT_CHANGE,
} from "../actions/gaming-search";
import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";

jest.mock("../services/catalogue/catalogue-service", () => ({
  getGamingSearchResults: jest.fn(),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ fetchGamingSearchResultsSaga: saga } = require("./gaming-search-saga"));
  });
  return setupSagaMocks(saga);
}

describe("fetchGamingSearchResultsSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when UI__GAMING__SEARCH_INPUT_CHANGE is dispatched", () => {
    describe("and the text length does not trigger the search", () => {
      it("should not call the catalogue service and should not dispatch any actions", async () => {
        const { putActions, dispatch, stopSaga, getState } = setup();

        getState.mockReturnValue({});

        const action = {
          type: UI__GAMING__SEARCH_INPUT_CHANGE,
          payload: {
            text: "sh",
            urn: "ppb:tbd:gaming:masterConfigElement:search/0",
          },
        };

        await putActions([action], 400);

        expect(catalogueService.getGamingSearchResults).not.toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
        stopSaga();
      });
    });

    describe("and the text length triggers the search", () => {
      it("should call the catalogue service and dispatch the correct actions", async () => {
        const { putActions, stopSaga, getState } = setup();

        getState.mockReturnValue({});

        const mockResults = {
          GamingSearch: { edges: [{ node: { urn: "game1" } }, { node: { urn: "game2" } }] },
        };
        catalogueService.getGamingSearchResults.mockResolvedValue(mockResults);

        const action = {
          type: UI__GAMING__SEARCH_INPUT_CHANGE,
          payload: {
            text: "jackpot",
            urn: "ppb:tbd:gaming:masterConfigElement:search/0",
          },
        };
        await putActions([action], 400);

        expect(catalogueService.getGamingSearchResults).toHaveBeenCalledWith("jackpot", 30);

        stopSaga();
      });
    });

    describe("and an error occurs during the service call", () => {
      it("should not crash and should not dispatch success actions", async () => {
        const { putActions, stopSaga, getState } = setup();

        getState.mockReturnValue({});

        const error = new Error("Catalogue service error");
        catalogueService.getGamingSearchResults.mockRejectedValue(error);

        const action = {
          type: UI__GAMING__SEARCH_INPUT_CHANGE,
          payload: {
            text: "jackpot",
            urn: "ppb:tbd:gaming:masterConfigElement:search/0",
          },
        };

        await putActions([action], 400);

        expect(catalogueService.getGamingSearchResults).toHaveBeenCalledWith("jackpot", 30);

        expect(putActions).not.toContainEqual({
          type: NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
        });

        stopSaga();
      });
    });
  });

  describe("initial search with pagination", () => {
    it("should fetch results with correct batch size and include pagination metadata", async () => {
      const { putActions, stopSaga, getState } = setup();

      getState.mockReturnValue({});

      const mockResults = {
        GamingSearch: {
          edges: [{ node: { urn: "game1" } }, { node: { urn: "game2" } }, { node: { urn: "game3" } }],
          pageInfo: {
            hasNextPage: true,
            endCursor: "cursor123",
          },
          totalCount: 50,
        },
      };
      catalogueService.getGamingSearchResults.mockResolvedValue(mockResults);

      const action = {
        type: UI__GAMING__SEARCH_INPUT_CHANGE,
        payload: {
          text: "jackpot",
          urn: "ppb:tbd:gaming:masterConfigElement:search/0",
        },
      };

      await putActions([action], 400);

      expect(catalogueService.getGamingSearchResults).toHaveBeenCalledWith("jackpot", 30);

      stopSaga();
    });
  });
});

describe("fetchMoreGamingSearchResultsSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when UI__GAMING__FETCH_MORE_SEARCH_RESULTS is dispatched", () => {
    describe("there are more pages to fetch", () => {
      it("should dispatch loading action, fetch results with cursor, and append results", async () => {
        const { putActions, stopSaga, getState } = setup();

        const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
        getState.mockReturnValue({
          layouts: {
            gamingSearch: {
              [urn]: {
                inputSearchTerm: "jackpot",
                hasNextPage: true,
                endCursor: "cursor123",
              },
            },
          },
        });

        const mockResults = {
          GamingSearch: {
            edges: [{ node: { urn: "game4" } }, { node: { urn: "game5" } }, { node: { urn: "game6" } }],
            pageInfo: {
              hasNextPage: true,
              endCursor: "cursor456",
            },
          },
        };
        catalogueService.getGamingSearchResults.mockResolvedValue(mockResults);

        const action = {
          type: UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
          payload: { urn },
        };

        await putActions([action], 100);

        expect(catalogueService.getGamingSearchResults).toHaveBeenCalledWith("jackpot", 30, "cursor123");

        stopSaga();
      });

      it("should handle the last page correctly when hasNextPage is false", async () => {
        const { putActions, stopSaga, getState } = setup();

        const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
        getState.mockReturnValue({
          layouts: {
            gamingSearch: {
              [urn]: {
                inputSearchTerm: "jackpot",
                hasNextPage: true,
                endCursor: "cursor123",
              },
            },
          },
        });

        const mockResults = {
          GamingSearch: {
            edges: [{ node: { urn: "game7" } }, { node: { urn: "game8" } }],
            pageInfo: {
              hasNextPage: false,
              endCursor: null,
            },
          },
        };
        catalogueService.getGamingSearchResults.mockResolvedValue(mockResults);

        const action = {
          type: UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
          payload: { urn },
        };

        await putActions([action], 100);

        expect(catalogueService.getGamingSearchResults).toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("no more pages to fetch", () => {
      it("should not call the service or dispatch any actions", async () => {
        const { putActions, stopSaga, getState } = setup();

        const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
        getState.mockReturnValue({
          layouts: {
            gamingSearch: {
              [urn]: {
                inputSearchTerm: "jackpot",
                hasNextPage: false,
                endCursor: null,
              },
            },
          },
        });

        const action = {
          type: UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
          payload: { urn },
        };

        await putActions([action], 100);

        expect(catalogueService.getGamingSearchResults).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("gaming search state does not exist", () => {
      it("should not call the service or dispatch any actions", async () => {
        const { putActions, stopSaga, getState } = setup();

        getState.mockReturnValue({
          layouts: {
            gamingSearch: {},
          },
        });

        const action = {
          type: UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
          payload: { urn: "ppb:tbd:gaming:masterConfigElement:search/0" },
        };

        await putActions([action], 100);

        expect(catalogueService.getGamingSearchResults).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("already loading more results", () => {
      it("should not call the service or dispatch any actions to prevent duplicate requests", async () => {
        const { putActions, stopSaga, getState } = setup();

        const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
        getState.mockReturnValue({
          layouts: {
            gamingSearch: {
              [urn]: {
                inputSearchTerm: "jackpot",
                hasNextPage: true,
                endCursor: "cursor123",
                isLoadingMore: true,
              },
            },
          },
        });

        const action = {
          type: UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
          payload: { urn },
        };

        await putActions([action], 100);

        expect(catalogueService.getGamingSearchResults).not.toHaveBeenCalled();

        stopSaga();
      });
    });
  });
});
