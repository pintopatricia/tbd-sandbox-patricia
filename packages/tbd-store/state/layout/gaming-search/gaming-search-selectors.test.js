import {
  getGamingSearchInputTerm,
  getGamingSearchInterfaceResult,
  getGamingSearchRetrieved,
  createGamingSearchInterfaceSelector,
  getGamingSearchGamePositionByURN,
  getGamingSearchHasNextPage,
  getGamingSearchTotalCount,
  getGamingSearchIsLoadingMore,
} from "./gaming-search-selectors";

describe("gamingSearchSelectors", () => {
  describe("getGamingSearchInputTerm", () => {
    it("should return the input search term for a given URN", () => {
      const state = {
        "urn:test:1": {
          inputSearchTerm: "slots",
        },
      };
      const searchTerm = getGamingSearchInputTerm(state, "urn:test:1");
      expect(searchTerm).toBe("slots");
    });

    it("should return an empty string if the URN is not present in state", () => {
      const state = {};
      const searchTerm = getGamingSearchInputTerm(state, "urn:nonexistent");
      expect(searchTerm).toBe("");
    });
  });

  describe("getGamingSearchInterfaceResult", () => {
    it("should return the search result items for a given URN", () => {
      const mockResult = [
        { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:1", url: "https://example.com/game1" },
        { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:2", url: "https://example.com/game2" },
      ];

      const state = {
        "urn:test:1": {
          result: mockResult,
        },
      };
      const result = getGamingSearchInterfaceResult(state, "urn:test:1");
      expect(result).toEqual(mockResult);
    });

    it("should return an empty array if there are no results for the given URN", () => {
      const state = {
        gamingSearch: {},
      };
      const result = getGamingSearchInterfaceResult(state, "urn:nonexistent");
      expect(result).toEqual([]);
    });
  });

  describe("getGamingSearchRetrieved", () => {
    it("should return true if games have been retrieved for the given URN", () => {
      const state = {
        "urn:test:1": {
          gamesRetrieved: true,
        },
      };
      const retrieved = getGamingSearchRetrieved(state, "urn:test:1");
      expect(retrieved).toBe(true);
    });

    it("should return false if games have not been retrieved for the given URN", () => {
      const state = {
        gamingSearch: {
          "urn:test:1": {
            gamesRetrieved: false,
          },
        },
      };
      const retrieved = getGamingSearchRetrieved(state, "urn:test:1");
      expect(retrieved).toBe(false);
    });

    it("should return false if the URN is not present in state", () => {
      const state = {
        gamingSearch: {},
      };
      const retrieved = getGamingSearchRetrieved(state, "urn:nonexistent");
      expect(retrieved).toBe(false);
    });
  });

  describe("createGamingSearchInterfaceSelector", () => {
    it("should return the formatted gaming search state for a given URN", () => {
      const mockResult = [{ type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:1", url: "https://example.com/game1" }];

      const state = {
        layouts: {
          gamingSearch: {
            "urn:test:1": {
              inputSearchTerm: "test search",
              result: mockResult,
              gamesRetrieved: true,
              hasNextPage: true,
              endCursor: "cursor123",
              totalCount: 50,
              isLoadingMore: false,
            },
          },
        },
      };

      const selector = createGamingSearchInterfaceSelector();
      const selectedState = selector(state, "urn:test:1");

      expect(selectedState).toEqual({
        results: mockResult,
        inputSearchTerm: "test search",
        gamesRetrieved: true,
        hasNextPage: true,
        totalCount: 50,
        isLoadingMore: false,
      });
    });

    it("should return default values if the given URN is not present in the state", () => {
      const state = {
        layouts: {
          gamingSearch: {},
        },
      };

      const selector = createGamingSearchInterfaceSelector();
      const selectedState = selector(state, "urn:nonexistent");

      expect(selectedState).toEqual({
        results: [],
        inputSearchTerm: "",
        gamesRetrieved: false,
        hasNextPage: false,
        totalCount: 0,
        isLoadingMore: false,
      });
    });
  });

  describe("getGamingSearchGamePositionByURN", () => {
    it("should return the correct position of the game URN in the search results", () => {
      const state = {
        "urn:test:1": {
          result: [
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:1", url: "https://example.com/game1" },
            { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:2", url: "https://example.com/game2" },
          ],
        },
      };
      const position = getGamingSearchGamePositionByURN(state, "urn:test:1", "urn:game:2");
      expect(position).toBe(1);
    });

    it("should return -1 if the game URN is not found in the search results", () => {
      const state = {
        "urn:test:1": {
          result: [{ type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:1", url: "https://example.com/game1" }],
        },
      };
      const position = getGamingSearchGamePositionByURN(state, "urn:test:1", "urn:game:2");
      expect(position).toBe(-1);
    });

    it("should return -1 if the URN is not present in the state", () => {
      const state = {
        gamingSearch: {},
      };
      const position = getGamingSearchGamePositionByURN(state, "urn:nonexistent", "urn:game:1");
      expect(position).toBe(-1);
    });
  });

  describe("Pagination selectors", () => {
    describe("getGamingSearchHasNextPage", () => {
      it("should return true when hasNextPage is true", () => {
        const state = {
          "urn:test:1": {
            hasNextPage: true,
          },
        };
        const hasNextPage = getGamingSearchHasNextPage(state, "urn:test:1");
        expect(hasNextPage).toBe(true);
      });

      it("should return false when hasNextPage is false", () => {
        const state = {
          "urn:test:1": {
            hasNextPage: false,
          },
        };
        const hasNextPage = getGamingSearchHasNextPage(state, "urn:test:1");
        expect(hasNextPage).toBe(false);
      });

      it("should return false when URN does not exist in state", () => {
        const state = {};
        const hasNextPage = getGamingSearchHasNextPage(state, "urn:nonexistent");
        expect(hasNextPage).toBe(false);
      });
    });

    describe("getGamingSearchTotalCount", () => {
      it("should return the total count when available", () => {
        const state = {
          "urn:test:1": {
            totalCount: 150,
          },
        };
        const totalCount = getGamingSearchTotalCount(state, "urn:test:1");
        expect(totalCount).toBe(150);
      });

      it("should return 0 when totalCount is not set", () => {
        const state = {
          "urn:test:1": {},
        };
        const totalCount = getGamingSearchTotalCount(state, "urn:test:1");
        expect(totalCount).toBe(0);
      });

      it("should return 0 when URN does not exist in state", () => {
        const state = {};
        const totalCount = getGamingSearchTotalCount(state, "urn:nonexistent");
        expect(totalCount).toBe(0);
      });
    });

    describe("getGamingSearchIsLoadingMore", () => {
      it("should return true when isLoadingMore is true", () => {
        const state = {
          "urn:test:1": {
            isLoadingMore: true,
          },
        };
        const isLoadingMore = getGamingSearchIsLoadingMore(state, "urn:test:1");
        expect(isLoadingMore).toBe(true);
      });

      it("should return false when isLoadingMore is false", () => {
        const state = {
          "urn:test:1": {
            isLoadingMore: false,
          },
        };
        const isLoadingMore = getGamingSearchIsLoadingMore(state, "urn:test:1");
        expect(isLoadingMore).toBe(false);
      });

      it("should return false when URN does not exist in state", () => {
        const state = {};
        const isLoadingMore = getGamingSearchIsLoadingMore(state, "urn:nonexistent");
        expect(isLoadingMore).toBe(false);
      });
    });

    describe("createGamingSearchInterfaceSelector with pagination", () => {
      it("should include pagination fields in the selector result", () => {
        const mockResult = [
          { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:1" },
          { type: "GAMING_SEARCH_RESULT_ITEM", urn: "urn:game:2" },
        ];

        const state = {
          layouts: {
            gamingSearch: {
              "urn:test:1": {
                inputSearchTerm: "jackpot",
                result: mockResult,
                gamesRetrieved: true,
                hasNextPage: true,
                endCursor: "cursor123",
                totalCount: 50,
                isLoadingMore: false,
              },
            },
          },
        };

        const selector = createGamingSearchInterfaceSelector();
        const selectedState = selector(state, "urn:test:1");

        expect(selectedState).toEqual({
          results: mockResult,
          inputSearchTerm: "jackpot",
          gamesRetrieved: true,
          totalCount: 50,
          hasNextPage: true,
          isLoadingMore: false,
        });
      });

      it("should return default pagination values when not present in state", () => {
        const state = {
          layouts: {
            gamingSearch: {
              "urn:test:1": {
                inputSearchTerm: "test",
                result: [],
                gamesRetrieved: false,
              },
            },
          },
        };

        const selector = createGamingSearchInterfaceSelector();
        const selectedState = selector(state, "urn:test:1");

        expect(selectedState).toMatchObject({
          totalCount: 0,
          hasNextPage: false,
          isLoadingMore: false,
        });
      });
    });
  });
});
