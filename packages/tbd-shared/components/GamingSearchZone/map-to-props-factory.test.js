import { makeMapStateToProps } from "./map-to-props-factory";

const mockRecommendedGames = {
  typename: "GamingCardGroup",
  urn: "ppb:tbd:gaming:masterConfigElement:curated/0",
  title: "Recommended Games",
  gameTileSize: "MEDIUM",
  displayMode: "SCROLLABLE",
  defaultLayout: "CARD_LIST",
  layouts: ["CARD_LIST"],
  cardGroupType: "DEFAULT",
  items: [
    { typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/strike-bonanza-jpk-sbp" },
    { typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/gold-cash-fw-mw-sip" },
    { typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/7s-deluxe-jpk-sbp" },
    { typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/deal-or-no-deal-whats-in-your-box-scratch-sbp" },
    { typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/crown-gems-sbp" },
  ],
};

const mockState = {
  layouts: {
    cardgroups: {
      gamingcardgroups: {
        "ppb:tbd:gaming:masterConfigElement:curated/0": mockRecommendedGames,
      },
    },
    searchzones: {
      "ppb:tbd:gaming:masterConfigElement:search/0": {
        urn: "ppb:tbd:gaming:masterConfigElement:search/0",
        typename: "SearchZone",
        items: [
          {
            typename: "SearchBarCard",
            urn: "ppb:tbd:card:searchBar:search|id-1728555240213-0.47821188509085055",
          },
          {
            typename: "GamingCardGroup",
            urn: "ppb:tbd:gaming:masterConfigElement:curated/0",
          },
        ],
      },
    },
  },
  entities: {
    throttles: {
      PIN_GAMING_SEARCH: { isActive: true },
      SCROLL_FOR_SEARCH_BAR: { isActive: true },
    },
  },
  router: {
    isRefresinh: false,
  },
};

const mockGamingSearchInterface = {
  results: ["game1", "game2"], // Mocked games
  inputSearchTerm: "search",
  gamesRetrieved: true,
  totalCount: 50,
  hasNextPage: true,
  isLoadingMore: false,
};

const getGamingSearchInterface = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/gaming-search/gaming-search-selectors", () => ({
  createGamingSearchInterfaceSelector: jest.fn(() => getGamingSearchInterface),
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/CardGroup.types", () => ({
  createCardGroupByURNSelector: jest.fn(() => jest.fn().mockReturnValue(mockRecommendedGames)),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

describe("makeMapStateToProps", () => {
  const mapStateToProps = makeMapStateToProps();
  beforeEach(() => {
    jest.clearAllMocks();
    getGamingSearchInterface.mockReturnValue(mockGamingSearchInterface);
  });

  it("should map state to props correctly", () => {
    const props = { urn: "ppb:tbd:gaming:masterConfigElement:search/0" };

    const result = mapStateToProps(mockState, props);

    expect(getGamingSearchInterface).toHaveBeenCalledWith(mockState, props.urn);

    expect(result).toEqual({
      results: mockGamingSearchInterface.results,
      numberOfResults: mockGamingSearchInterface.results.length,
      totalCount: 50,
      isLoadingMore: false,
      inputSearchTerm: mockGamingSearchInterface.inputSearchTerm,
      searchHistoryLabel: "I18N.SEARCH.HISTORY.LABEL",
      searchPlaceholder: "I18N.SEARCH.GAMING_INPUT_PLACEHOLDER",
      cancel: "I18N.SEARCH.CANCEL",
      numberOfResultsLabel: "I18N.SEARCH.GAMING.RESULTS",
      noResultsLabel: undefined,
      outOfIdeasLabel: "I18N.SEARCH.GAMING.OUT_OF_IDEAS",
      recommendedGames: mockRecommendedGames,
      pinGamingSearch: true,
      scrollForSearchBar: true,
      shouldHandleOnBlur: false,
      isRefreshing: undefined,
      shouldDisplaySearchHistory: undefined,
    });
  });

  it("should set scrollForSearchBar to false when throttle is not active", () => {
    const state = {
      ...mockState,
      entities: {
        throttles: { PIN_GAMING_SEARCH: { isActive: true } }, // no SCROLL_FOR_SEARCH_BAR key
      },
    };

    const result = mapStateToProps(state, { urn: "ppb:tbd:gaming:masterConfigElement:search/0" });

    expect(result.scrollForSearchBar).toBe(false);
  });

  it("should handle case with no search results", () => {
    getGamingSearchInterface.mockReturnValue({
      results: [],
      inputSearchTerm: "search",
      gamesRetrieved: true,
      totalCount: 0,
      hasNextPage: false,
      isLoadingMore: false,
    });

    const result = mapStateToProps(mockState, { urn: "ppb:tbd:gaming:masterConfigElement:search/0" });

    expect(result.numberOfResults).toBe(0);
    expect(result.totalCount).toBe(0);
    expect(result.isLoadingMore).toBe(false);
    expect(result.noResultsLabel).toBe("I18N.SEARCH.GAMING.NO_RESULTS");
  });

  it("should map the input search term correctly", () => {
    getGamingSearchInterface.mockReturnValue({
      results: ["game1"],
      inputSearchTerm: "test search",
      gamesRetrieved: true,
      totalCount: 1,
      hasNextPage: false,
      isLoadingMore: false,
    });

    const result = mapStateToProps(mockState, { urn: "ppb:tbd:gaming:masterConfigElement:search/0" });

    expect(result.inputSearchTerm).toBe("test search");
    expect(result.totalCount).toBe(1);
  });

  it("should handle case when games have not been retrieved", () => {
    getGamingSearchInterface.mockReturnValue({
      results: ["game1"],
      inputSearchTerm: "search",
      gamesRetrieved: false,
      totalCount: 0,
      hasNextPage: false,
      isLoadingMore: false,
    });

    const result = mapStateToProps(mockState, { urn: "ppb:tbd:gaming:masterConfigElement:search/0" });

    expect(result.results).toEqual(["game1"]); // Ensure results are still returned
    expect(result.numberOfResults).toBe(1);
  });

  it("should handle case with no recommended games", () => {
    const stateWithoutRecommendedGames = {
      ...mockState,
      layouts: {
        ...mockState.layouts,
        cardgroups: {
          gamingcardgroups: {},
        },
      },
    };

    const result = mapStateToProps(stateWithoutRecommendedGames, {
      urn: "ppb:tbd:gaming:masterConfigElement:search/0",
    });

    expect(result.recommendedGames).toBeNull();
  });

  it("should return the expected structure", () => {
    const result = mapStateToProps(mockState, { urn: "ppb:tbd:gaming:masterConfigElement:search/0" });

    expect(result).toHaveProperty("results");
    expect(result).toHaveProperty("numberOfResults");
    expect(result).toHaveProperty("totalCount");
    expect(result).toHaveProperty("isLoadingMore");
    expect(result).toHaveProperty("inputSearchTerm");
    expect(result).toHaveProperty("recommendedGames");
    expect(result).toHaveProperty("shouldHandleOnBlur");
    expect(result).toHaveProperty("searchPlaceholder");
    expect(result).toHaveProperty("cancel");
    expect(result).toHaveProperty("numberOfResultsLabel");
    expect(result).toHaveProperty("noResultsLabel");
    expect(result).toHaveProperty("outOfIdeasLabel");
  });

  it("should handle pagination state - isLoadingMore true", () => {
    getGamingSearchInterface.mockReturnValue({
      results: ["game1", "game2"],
      inputSearchTerm: "search",
      gamesRetrieved: true,
      totalCount: 100,
      hasNextPage: true,
      isLoadingMore: true,
    });

    const result = mapStateToProps(mockState, { urn: "ppb:tbd:gaming:masterConfigElement:search/0" });

    expect(result.isLoadingMore).toBe(true);
    expect(result.totalCount).toBe(100);
    expect(result.numberOfResults).toBe(2);
  });

  it("should handle pagination state - no more pages", () => {
    getGamingSearchInterface.mockReturnValue({
      results: ["game1", "game2"],
      inputSearchTerm: "search",
      gamesRetrieved: true,
      totalCount: 2,
      hasNextPage: false,
      isLoadingMore: false,
    });

    const result = mapStateToProps(mockState, { urn: "ppb:tbd:gaming:masterConfigElement:search/0" });

    expect(result.isLoadingMore).toBe(false);
    expect(result.totalCount).toBe(2);
    expect(result.numberOfResults).toBe(2);
  });
});

describe("mapDispatchToProps", () => {
  const {
    dispatchGamingSearchInputChangeAction,
    dispatchGamingSearchInputChangeClearAction,
    dispatchGamingSearchClearResultsAction,
    dispatchGamingSearchCancelAction,
    dispatchPebbleSearchHistoryClickAction,
    dispatchGamingSearchBarFocusAction,
    dispatchFetchMoreGamingSearchResults,
  } = require("./map-to-props-factory").mapDispatchToProps;

  it("should create dispatchFetchMoreGamingSearchResults action", () => {
    const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
    const action = dispatchFetchMoreGamingSearchResults(urn);

    expect(action).toEqual({
      type: "UI__GAMING__FETCH_MORE_SEARCH_RESULTS",
      payload: { urn },
    });
  });

  it("should create dispatchGamingSearchInputChangeAction", () => {
    const text = "jackpot";
    const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
    const action = dispatchGamingSearchInputChangeAction(text, urn);

    expect(action).toEqual({
      type: "UI__GAMIN__SEARCH_INPUT_CHANGE",
      payload: { text, urn },
    });
  });

  it("should create dispatchGamingSearchInputChangeClearAction", () => {
    const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
    const action = dispatchGamingSearchInputChangeClearAction(urn);

    expect(action).toEqual({
      type: "UI__GAMING__SEARCH_INPUT_CHANGE_CLEAR",
      payload: { urn },
    });
  });

  it("should create dispatchGamingSearchClearResultsAction", () => {
    const text = "jackpot";
    const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
    const action = dispatchGamingSearchClearResultsAction(text, urn);

    expect(action).toEqual({
      type: "UI__GAMING__CLEAR_SEARCH_RESULTS",
      payload: { text, urn },
    });
  });

  it("should create dispatchGamingSearchCancelAction", () => {
    const text = "jackpot";
    const urn = "ppb:tbd:gaming:masterConfigElement:search/0";
    const action = dispatchGamingSearchCancelAction(text, urn);

    expect(action).toEqual({
      type: "UI__GAMING__SEARCH_CANCEL_CLICK",
      payload: { text, urn },
    });
  });

  it("should create dispatchPebbleSearchHistoryClickAction", () => {
    const text = "jackpot";
    const action = dispatchPebbleSearchHistoryClickAction(text);

    expect(action).toEqual({
      type: "UI__GAMING__SEARCH_HISTORY_PEBBLE_CLICK",
      payload: { text },
    });
  });

  it("should create dispatchGamingSearchBarFocusAction", () => {
    const action = dispatchGamingSearchBarFocusAction();

    expect(action).toEqual({
      type: "UI__GAMING__SEARCH_BAR_INPUT_FOCUS",
    });
  });
});
