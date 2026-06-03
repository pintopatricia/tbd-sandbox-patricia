import {
  getSearchBarInterfaceInputSearchTerm,
  createSearchBarStateInterfaceSelector,
  getSearchBarInterfaceSearchResult,
} from "./search-bar-state-selectors";

describe("search-bar-state-selectors", () => {
  describe("getBrowseInterfaceInputSearchTerm", () => {
    it("should return the search term", () => {
      const state = {
        search: {
          searchUrn: {
            inputSearchTerm: "football",
          },
        },
      };
      const searchTerm = getSearchBarInterfaceInputSearchTerm(state, "searchUrn");
      expect(searchTerm).toBe("football");
    });
  });
  describe("getSearchBarInterfaceSearchResult", () => {
    it("should return the search result", () => {
      const state = {
        search: {
          searchUrn: {
            result: {
              query: "searchResult",
              pageSize: 10,
              startIndex: 1,
              items: [],
            },
          },
        },
      };
      const result = getSearchBarInterfaceSearchResult(state, "searchUrn");
      expect(result).toMatchObject({
        query: "searchResult",
        pageSize: 10,
        startIndex: 1,
        items: [],
      });
    });
    it("should not return search result if not present", () => {
      const state = {
        search: {
          searchUrn: {},
        },
      };
      const result = getSearchBarInterfaceSearchResult(state, "searchUrn");
      expect(result).toBe(undefined);
    });
  });
  describe("createSearchBarStateInterfaceSelector", () => {
    it("should return the search result", () => {
      const state = {
        layouts: {
          searchBarState: {
            search: {
              searchUrn: {
                result: {
                  query: "searchResult",
                  pageSize: 10,
                  startIndex: 1,
                  items: [],
                },
                inputSearchTerm: "football",
              },
            },
          },
        },
      };
      const result = createSearchBarStateInterfaceSelector()(state, "searchUrn");
      expect(result).toMatchObject({
        query: "searchResult",
        formattedResults: [],
        didYouMean: undefined,
        inputSearchTerm: "football",
      });
    });
  });
});
