import { createGamingBrowseInterfaceSearchSelector } from "@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors";
import {
  UI__SEARCH_INPUT_CHANGE,
  UI__SEARCH_INPUT_CHANGE_CLEAR,
  UI__CLEAR_SEARCH_RESULTS,
  UI__SEARCH_CANCEL_CLICK,
  UI__SEARCH_BAR_FOCUS,
  UI__FETCH_MORE_SEARCH_RESULTS,
} from "@ppb/tbd-store/actions/browse";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const STATE = {
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:gaming": {
          items: [
            { urn: "ppb:tbd:view:zone:multifunctionalModule:test-zone", typename: "SwimlaneCardGroup" },
            { urn: "ppb:tbd:card:group:recommendedGames:1", typename: "SwimlaneCardGroup" },
          ],
          search: {
            isOpen: true,
            result: {
              items: [],
              query: "Port",
            },
            inputSearchTerm: "search term",
          },
        },
      },
    },
  },
};

const STATE_WITH_ONE_RESULT = {
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:gaming": {
          items: [
            { urn: "ppb:tbd:view:zone:multifunctionalModule:test-zone", typename: "SwimlaneCardGroup" },
            { urn: "ppb:tbd:card:group:recommendedGames:1", typename: "SwimlaneCardGroup" },
          ],
          search: {
            isOpen: true,
            result: {
              items: [
                {
                  url: "",
                  urn: "ppb:tbd:card:game:football-carnival-cptn",
                  name: "Football Carnival",
                  type: "GAME_SEARCH_RESULT_ITEM",
                  launchId: "football-carnival-cptn",
                  rgsCodeMobile: "gtsfc",
                  provider: "Playtech - NGM",
                  mainProduct: "casino",
                  jackpotLogo: "None",
                  copyrightText: null,
                  backgroundColor: null,
                  rtp: "91.32%",
                },
              ],
              query: "Port",
            },
            inputSearchTerm: "search term",
          },
        },
      },
    },
  },
};
const GAMING_BROWSE_URN = "ppb:tbd:view:browse:gaming";

const getBrowseInterfaceSearch = jest.fn();
const getFullCardsForSearch = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/views/browse-view/browse-view-selectors", () => ({
  createGamingBrowseInterfaceSearchSelector: jest.fn(() => getBrowseInterfaceSearch),
  getBrowseInterfaceOpenState: jest.fn().mockReturnValue(true),
  createFullCardsForSearch: jest.fn(() => getFullCardsForSearch),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create selector for browser view", () => {
    // Act
    makeMapStateToProps();

    // Assert
    expect(createGamingBrowseInterfaceSearchSelector).toHaveBeenCalledTimes(1);
    expect(createGamingBrowseInterfaceSearchSelector).toHaveBeenCalledWith();
  });

  describe("when it has results", () => {
    const mapStateToProps = makeMapStateToProps();

    it("should return a model with search interface", () => {
      getBrowseInterfaceSearch.mockReturnValue({
        query: "Tiki",
      });

      getFullCardsForSearch.mockReturnValue([
        {
          type: "GAME_SEARCH_RESULT_ITEM",
          urn: "ppb:tbd:card:gaming:game:uid/tiki-fruits-art",
          name: "Tiki Fruits",
        },
      ]);

      mapStateToProps(STATE, { urn: GAMING_BROWSE_URN });

      // Assert
      expect(getBrowseInterfaceSearch).toHaveBeenCalledWith(STATE, GAMING_BROWSE_URN);
      expect(getBrowseInterfaceSearch).toHaveBeenCalledTimes(1);
      expect(getFullCardsForSearch).toHaveBeenCalledTimes(1);
    });

    it("should not add numberOfResults, outOfIdeasLabel, noResultsLabel if the lenght of query is less than 3", () => {
      getBrowseInterfaceSearch.mockReturnValue({
        query: "Sp",
        inputSearchTerm: "search term",
      });

      const result = mapStateToProps(STATE_WITH_ONE_RESULT, { urn: GAMING_BROWSE_URN });

      expect(result).toStrictEqual(
        expect.objectContaining({
          cancel: "I18N.SEARCH.CANCEL",
          outOfIdeasLabel: "I18N.SEARCH.OUT_OF_IDEAS",
          noResultsLabel: undefined,
          numberOfResultsLabel: undefined,
          searchPlaceholder: "I18N.SEARCH.GAMING_INPUT_PLACEHOLDER",
        }),
      );
    });

    it("should add noResults label if the value of numberOfResults is zero", () => {
      // Arrange
      getBrowseInterfaceSearch.mockReturnValue({
        query: "foot",
        inputSearchTerm: "foot",
      });

      getFullCardsForSearch.mockReturnValue([]);

      // Act
      const results = mapStateToProps(STATE, { urn: GAMING_BROWSE_URN });

      expect(results).toEqual(
        expect.objectContaining({
          cancel: "I18N.SEARCH.CANCEL",
          outOfIdeasLabel: "I18N.SEARCH.OUT_OF_IDEAS",
          noResultsLabel: "I18N.SEARCH.NO_RESULTS",
          numberOfResultsLabel: "I18N.SEARCH.RESULTS",
          searchPlaceholder: "I18N.SEARCH.GAMING_INPUT_PLACEHOLDER",
        }),
      );
    });

    it("should create the results labels correctly when query is not greater than the search input limit", () => {
      // Arrange
      getBrowseInterfaceSearch.mockReturnValue({
        query: "te",
        inputSearchTerm: "search term",
      });

      // Act
      const results = mapStateToProps(STATE, { urn: GAMING_BROWSE_URN });

      expect(results).toEqual(
        expect.objectContaining({
          cancel: "I18N.SEARCH.CANCEL",
          outOfIdeasLabel: "I18N.SEARCH.OUT_OF_IDEAS",
          noResultsLabel: undefined,
          numberOfResultsLabel: undefined,
          searchPlaceholder: "I18N.SEARCH.GAMING_INPUT_PLACEHOLDER",
        }),
      );
    });

    it("should initialize Browse component with the correct props", () => {
      getBrowseInterfaceSearch.mockReturnValue({
        didYouMean: "aaaa",
        query: "Tiki",
        inputSearchTerm: "search term",
      });

      getFullCardsForSearch.mockReturnValue([
        {
          type: "GAME_SEARCH_RESULT_ITEM",
          urn: "ppb:tbd:card:gaming:game:uid/tiki-fruits-art",
          name: "Tiki Fruits",
        },
      ]);

      const result = mapStateToProps(STATE, { urn: GAMING_BROWSE_URN });
      expect(result).toStrictEqual({
        inputSearchTerm: "search term",
        numberOfResults: 1,
        query: "Tiki",
        results: [
          {
            type: "GAME_SEARCH_RESULT_ITEM",
            urn: "ppb:tbd:card:gaming:game:uid/tiki-fruits-art",
            name: "Tiki Fruits",
          },
        ],
        cancel: "I18N.SEARCH.CANCEL",
        outOfIdeasLabel: "I18N.SEARCH.OUT_OF_IDEAS",
        noResultsLabel: undefined,
        numberOfResultsLabel: "I18N.SEARCH.RESULTS",
        searchPlaceholder: "I18N.SEARCH.GAMING_INPUT_PLACEHOLDER",
        defaultContainers: {
          urn: "ppb:tbd:view:zone:multifunctionalModule:test-zone",
          typename: "SwimlaneCardGroup",
        },
        recommendedGames: { urn: "ppb:tbd:card:group:recommendedGames:1", typename: "SwimlaneCardGroup" },
        shouldHandleOnBlur: false,
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchSearchInputChangeAction", () => {
    it("should dispatch search input change action", () => {
      const { dispatchSearchInputChangeAction } = mapDispatchToProps;

      expect(dispatchSearchInputChangeAction("text")).toEqual({
        payload: { text: "text" },
        type: UI__SEARCH_INPUT_CHANGE,
      });
    });
  });

  describe("dispatchSearchInputChangeClearAction", () => {
    it("should dispatch search input change clear action", () => {
      const { dispatchSearchInputChangeClearAction } = mapDispatchToProps;

      expect(dispatchSearchInputChangeClearAction(GAMING_BROWSE_URN)).toEqual({
        type: UI__SEARCH_INPUT_CHANGE_CLEAR,
        payload: { urn: GAMING_BROWSE_URN },
      });
    });
  });

  describe("dispatchSearchClearResultsAction", () => {
    it("should dispatch search clear results action", () => {
      const { dispatchSearchClearResultsAction } = mapDispatchToProps;

      expect(dispatchSearchClearResultsAction("text", GAMING_BROWSE_URN)).toEqual({
        payload: { text: "text", urn: GAMING_BROWSE_URN },
        type: UI__CLEAR_SEARCH_RESULTS,
      });
    });
  });

  describe("dispatchSearchCancelAction", () => {
    it("should dispatch search cancel action", () => {
      const { dispatchSearchCancelAction } = mapDispatchToProps;

      expect(dispatchSearchCancelAction("text", GAMING_BROWSE_URN)).toEqual({
        payload: { text: "text", urn: GAMING_BROWSE_URN },
        type: UI__SEARCH_CANCEL_CLICK,
      });
    });
  });

  describe("dispatchSearchBarFocusAction", () => {
    it("should dispatch searchbar focus action", () => {
      const { dispatchSearchBarFocusAction } = mapDispatchToProps;

      expect(dispatchSearchBarFocusAction()).toEqual({
        type: UI__SEARCH_BAR_FOCUS,
      });
    });
  });

  describe("dispatchFetchMoreSearchResults", () => {
    it("should dispatch dispatchFetchMoreSearchResults to load more games", () => {
      const { dispatchFetchMoreSearchResults } = mapDispatchToProps;

      expect(dispatchFetchMoreSearchResults(GAMING_BROWSE_URN)).toEqual({
        payload: { urn: GAMING_BROWSE_URN },
        type: UI__FETCH_MORE_SEARCH_RESULTS,
      });
    });
  });
});
