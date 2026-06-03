import "jest-dom/extend-expect";
import { act, render } from "@testing-library/react";
import { SportsSearchContainer } from "./snowflakes/SportsSearchContainer/SportsSearchContainer.web";
import SportsBrowse from "./SportsBrowse.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.web";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.web";

jest.mock("../Card", () => jest.fn(({ children, ...props }) => <card-component {...props}>{children}</card-component>));

jest.mock("./snowflakes/SportsSearchContainer/SportsSearchContainer.web", () => ({
  SportsSearchContainer: jest.fn(() => <sports-search-container-mock></sports-search-container-mock>),
}));

jest.mock("../../helpers/search-history-helper.web", () => ({
  getSportsSearchHistory: jest.fn(() => ["age", "bonanza"]),
  updateSportsSearchHistory: jest.fn(() => {}),
}));

jest.mock("../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(() => "control"),
}));

jest.mock("../SearchBarHistory/SearchBarHistory.web", () => ({
  SearchBarHistory: jest.fn(() => <mock-search-bar-history />),
}));

const mockItems = [{ urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse", typename: "QuickLinksCard" }];

const mockSearchResults = [
  {
    context: "Dutch Eerste Divisie - Jan 24, 19:00",
    viewLink: {
      viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
      viewUrn: "ppb:tbd:view:event:29662647",
    },
    name: "Helmond Sport v Den Bosch",
    sportId: "1",
    sportName: "Football",
  },
  {
    context: "Dutch Eerste Divisie - Fev 24, 19:00",
    viewLink: {
      viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662646",
      viewUrn: "ppb:tbd:view:event:29662646",
    },
    name: "Helmond Sport v Den Bosch",
    sportId: "1",
    sportName: "Football",
  },
  {
    context: "Dutch Eerste Divisie - I18N.DATE.TODAY, 15:15",
    viewLink: {
      viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662645",
      viewUrn: "ppb:tbd:view:event:29662645",
    },
    name: "Helmond Sport v Den Bosch",
    sportId: "7",
    sportName: "Horse Racing",
  },
];

const mockSearchFormattedResults = [
  {
    context: "Dutch Eerste Divisie - Jan 24, 19:00",
    viewLink: {
      viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662647",
      viewUrn: "ppb:tbd:view:event:29662647",
    },
    name: "<b>Hel</b>mond Sport v Den Bosch",
    sportId: "1",
    sportName: "Football",
  },
  {
    context: "Dutch Eerste Divisie - Fev 24, 19:00",
    viewLink: {
      viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662646",
      viewUrn: "ppb:tbd:view:event:29662646",
    },
    name: "<b>Hel</b>mond Sport v Den Bosch",
    sportId: "1",
    sportName: "Football",
  },
  {
    context: "Dutch Eerste Divisie - I18N.DATE.TODAY, 15:15",
    viewLink: {
      viewUrl: "football/dutch-eerste-divise/helmond-sport-v-den-bosch/e-29662645",
      viewUrn: "ppb:tbd:view:event:29662645",
    },
    name: "<b>Hel</b>mond Sport v Den Bosch",
    sportId: "7",
    sportName: "Horse Racing",
  },
];

function renderSportsBrowse({
  urn = "ppb:tbd:view:browse:sports",
  items = mockItems,
  searchResults = [],
  query = "som",
  inputSearchTerm = "",
  searchPlaceholder = "I18N.SEARCH.INPUT_PLACEHOLDER",
  cancel = "I18N.SEARCH.CANCEL",
  didYouMeanLabel = "I18N.SEARCH.DID_YOU_MEAN",
  numberOfResultsLabel = "I18N.SEARCH.RESULTS",
  noResultsLabel = "I18N.SEARCH.YOUR_SEARCH",
  searchHistoryLabel = "I18N.SEARCH.HISTORY.LABEL",
  shouldHandleOnBlur = true,
  sportFilters = [],
  isDesktop = false,
  dispatchPushAction = jest.fn(),
  dispatchSearchInputChangeAction = jest.fn(),
  dispatchSearchInputChangeClearAction = jest.fn(),
  dispatchSearchClearResultsAction = jest.fn(),
  dispatchSearchLinkClick = jest.fn(),
  dispatchSearchCancelAction = jest.fn(),
  dispatchSearchBarFocusAction = jest.fn(),
  dispatchSportsFilterClickAction = jest.fn(),
  dispatchHistoryClickAction = jest.fn(),
}) {
  const { rerender } = render(
    <SportsBrowse
      urn={urn}
      items={items}
      searchResults={searchResults}
      query={query}
      searchPlaceholder={searchPlaceholder}
      cancel={cancel}
      didYouMeanLabel={didYouMeanLabel}
      noResultsLabel={noResultsLabel}
      numberOfResultsLabel={numberOfResultsLabel}
      searchHistoryLabel={searchHistoryLabel}
      inputSearchTerm={inputSearchTerm}
      shouldHandleOnBlur={shouldHandleOnBlur}
      sportFilters={sportFilters}
      isDesktop={isDesktop}
      dispatchPushAction={dispatchPushAction}
      dispatchSearchInputChangeAction={dispatchSearchInputChangeAction}
      dispatchSearchInputChangeClearAction={dispatchSearchInputChangeClearAction}
      dispatchSearchClearResultsAction={dispatchSearchClearResultsAction}
      dispatchSearchLinkClick={dispatchSearchLinkClick}
      dispatchSearchCancelAction={dispatchSearchCancelAction}
      dispatchSearchBarFocusAction={dispatchSearchBarFocusAction}
      dispatchSportsFilterClickAction={dispatchSportsFilterClickAction}
      dispatchHistoryClickAction={dispatchHistoryClickAction}
    />,
  );

  return { rerender };
}

describe("SportsBrowse component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should initialize SportsSearchContainer and ConnectedCard components with the correct props", () => {
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        inputSearchTerm: "",
      });

      expect(SportsSearchContainer).toHaveBeenCalledWith(
        {
          translations: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
              didYouMeanLabel: "I18N.SEARCH.DID_YOU_MEAN",
              noResultsLabel: "I18N.SEARCH.YOUR_SEARCH",
              numberOfResultsLabel: "I18N.SEARCH.RESULTS",
            },
          },
          shouldHandleOnBlur: true,
          onResultClick: expect.any(Function),
          onCancel: expect.any(Function),
          onChange: expect.any(Function),
          onFocusSearchBar: expect.any(Function),
          onFilterResults: expect.any(Function),
          cleanResults: expect.any(Function),
          inputSearchTerm: "",
          searchResults: [],
          sportFilters: [],
          showSearchResults: false,
          onInputFocus: expect.any(Function),
          isDesktop: false,
        },
        undefined,
      );
      expect(SportsSearchContainer).toHaveBeenCalledTimes(1);

      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
          component: Card,
          typename: "QuickLinksCard",
        },
        undefined,
      );
      expect(ConnectedCard).toHaveBeenCalledTimes(1);
    });
  });

  describe("when initializing the component with results", () => {
    it("should not render ConnectedCard", () => {
      renderSportsBrowse({
        searchResults: mockSearchResults,
        query: "hel",
        inputSearchTerm: "search term",
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
    });

    it("should initialize SportsSearchContainer component with the correct props", () => {
      renderSportsBrowse({
        searchResults: mockSearchResults,
        query: "hel",
        searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
        cancel: "I18N.SEARCH.CANCEL",
        numberOfResultsLabel: "I18N.SEARCH.RESULTS",
        didYouMeanLabel: null,
        noResultsLabel: null,
        inputSearchTerm: "search term",
      });

      expect(SportsSearchContainer).toHaveBeenCalledWith(
        {
          translations: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
              numberOfResultsLabel: "I18N.SEARCH.RESULTS",
              didYouMeanLabel: null,
              noResultsLabel: null,
            },
          },
          shouldHandleOnBlur: true,
          onResultClick: expect.any(Function),
          onCancel: expect.any(Function),
          onChange: expect.any(Function),
          onFocusSearchBar: expect.any(Function),
          onFilterResults: expect.any(Function),
          cleanResults: expect.any(Function),
          inputSearchTerm: "search term",
          searchResults: mockSearchFormattedResults,
          sportFilters: [],
          showSearchResults: true,
          onInputFocus: expect.any(Function),
          isDesktop: false,
        },
        undefined,
      );
      expect(SportsSearchContainer).toHaveBeenCalledTimes(1);
    });
  });

  describe("when initializing the component without results", () => {
    it("should render ConnectedCard", () => {
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        inputSearchTerm: "",
      });
      expect(ConnectedCard).toHaveBeenCalled();
    });

    it("should SportsSearchContainer component with the correct props", () => {
      renderSportsBrowse({
        searchResults: [],
        sportFilters: [],
        query: "query",
        searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
        cancel: "I18N.SEARCH.CANCEL",
        numberOfResultsLabel: "I18N.SEARCH.RESULTS",
        searchHistoryLabel: "I18N.SEARCH.HISTORY.LABEL",
        didYouMeanLabel: null,
        noResultsLabel: null,
        inputSearchTerm: "",
      });

      expect(SportsSearchContainer).toHaveBeenCalledWith(
        {
          translations: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
              numberOfResultsLabel: "I18N.SEARCH.RESULTS",
              didYouMeanLabel: null,
              noResultsLabel: null,
            },
          },
          shouldHandleOnBlur: true,
          onResultClick: expect.any(Function),
          onCancel: expect.any(Function),
          onChange: expect.any(Function),
          onFocusSearchBar: expect.any(Function),
          cleanResults: expect.any(Function),
          onFilterResults: expect.any(Function),
          inputSearchTerm: "",
          searchResults: [],
          sportFilters: [],
          showSearchResults: false,
          onInputFocus: expect.any(Function),
          isDesktop: false,
        },
        undefined,
      );
    });
  });

  describe("when search changes", () => {
    describe("and text has 3 or more chars", () => {
      it("should dispatch UI__SEARCH_INPUT_CHANGE action", () => {
        const spySearchInputChangeAction = jest.fn();
        renderSportsBrowse({
          searchResults: [],
          query: "query",
          inputSearchTerm: "search term",
          sportsTabContentI18n: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
            },
          },
          dispatchSearchInputChangeAction: spySearchInputChangeAction,
        });

        const { onChange } = SportsSearchContainer.mock.calls[0][0];
        act(() => onChange("text"));
        expect(spySearchInputChangeAction).toHaveBeenCalledWith("text", "ppb:tbd:view:browse:sports");
      });
      it("should dispatch UI__CLEAR_SEARCH_RESULTS action", () => {
        const spySearchInputChangeClearAction = jest.fn();
        renderSportsBrowse({
          searchResults: [],
          query: "query",
          inputSearchTerm: "search term",
          sportsTabContentI18n: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
            },
          },
          dispatchSearchInputChangeClearAction: spySearchInputChangeClearAction,
        });
        const { onChange } = SportsSearchContainer.mock.calls[0][0];
        act(() => onChange("text"));
        expect(spySearchInputChangeClearAction).not.toHaveBeenCalled();
      });
    });

    describe("and text has 2 or less chars", () => {
      it("should dispatch UI__SEARCH_INPUT_CHANGE action", () => {
        const spySearchInputChangeAction = jest.fn();
        renderSportsBrowse({
          searchResults: [],
          query: "query",
          inputSearchTerm: "search term",
          sportsTabContentI18n: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
            },
          },
          dispatchSearchInputChangeAction: spySearchInputChangeAction,
        });
        const { onChange } = SportsSearchContainer.mock.calls[0][0];
        act(() => onChange("te"));
        expect(spySearchInputChangeAction).toHaveBeenCalledWith("te", "ppb:tbd:view:browse:sports");
      });
      it("should dispatch UI__SEARCH_INPUT_CHANGE_CLEAR action", () => {
        const spySearchInputChangeClearAction = jest.fn();
        renderSportsBrowse({
          searchResults: [],
          query: "query",
          inputSearchTerm: "search term",
          sportsTabContentI18n: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
            },
          },
          dispatchSearchInputChangeClearAction: spySearchInputChangeClearAction,
        });
        const { onChange } = SportsSearchContainer.mock.calls[0][0];
        act(() => onChange("te"));
        expect(spySearchInputChangeClearAction).toHaveBeenCalled();
      });
    });

    describe("when clean results is called", () => {
      it("should dispatch UI__CLEAR_SEARCH_RESULTS action", () => {
        const spySearchClearResultsAction = jest.fn();
        renderSportsBrowse({
          searchResults: [],
          query: "query",
          inputSearchTerm: "search term",
          sportsTabContentI18n: {
            i18n: {
              searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
              cancel: "I18N.SEARCH.CANCEL",
            },
          },
          dispatchSearchClearResultsAction: spySearchClearResultsAction,
        });
        const { cleanResults } = SportsSearchContainer.mock.calls[0][0];

        act(() => {
          cleanResults("");
        });
        expect(spySearchClearResultsAction).toHaveBeenCalledWith("", "ppb:tbd:view:browse:sports");
      });
    });
  });

  describe("when cleaning results", () => {
    it("should dispatch UI__SEARCH_CANCEL_CLICK action", () => {
      const spyCleanAction = jest.fn();
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        sportsTabContentI18n: {
          i18n: {
            searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
            cancel: "I18N.SEARCH.CANCEL",
          },
        },
        dispatchSearchClearResultsAction: spyCleanAction,
      });
      const { cleanResults } = SportsSearchContainer.mock.calls[0][0];
      act(() => cleanResults("searchTerm"));
      expect(spyCleanAction).toHaveBeenCalledWith("searchTerm", "ppb:tbd:view:browse:sports");
    });
  });

  describe("when a result is clicked", () => {
    it("should dispatch UI__SEARCH_LINK_CLICK action", () => {
      const spySearchLinkClick = jest.fn();
      const spyPushAction = jest.fn();
      renderSportsBrowse({
        searchResults: mockSearchResults,
        query: "query",
        sportsTabContentI18n: {
          i18n: {
            searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
            cancel: "I18N.SEARCH.CANCEL",
          },
        },
        dispatchPushAction: spyPushAction,
        dispatchSearchLinkClick: spySearchLinkClick,
      });
      const { onResultClick } = SportsSearchContainer.mock.calls[0][0];
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };

      act(() => onResultClick(viewLinkMock, 1, "itemName"));
      expect(spyPushAction).toHaveBeenCalledWith(viewLinkMock);
      expect(spySearchLinkClick).toHaveBeenCalledWith(
        "query",
        viewLinkMock,
        1,
        "itemName",
        mockSearchResults.length,
        false,
      );
    });
  });

  describe("when search bar is focused", () => {
    it("should dispatch UI__SEARCH_BAR_FOCUS action", () => {
      const spySearchBarFocusAction = jest.fn();
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        sportsTabContentI18n: {
          i18n: {
            searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
            cancel: "I18N.SEARCH.CANCEL",
          },
        },
        dispatchSearchBarFocusAction: spySearchBarFocusAction,
      });
      const { onFocusSearchBar } = SportsSearchContainer.mock.calls[0][0];
      act(() => onFocusSearchBar());
      expect(spySearchBarFocusAction).toHaveBeenCalled();
    });
  });

  describe("when search history experiment is enabled", () => {
    it("should not show history when search is not focused", () => {
      useExperimentVariant.mockReturnValueOnce("search-history");
      renderSportsBrowse({ inputSearchTerm: "po" });

      expect(SportsSearchContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          showSearchResults: false,
        }),
        undefined,
      );

      expect(SearchBarHistory).not.toHaveBeenCalled();
    });
    it("should not show history when search is focused, but there is no history", () => {
      getSportsSearchHistory.mockReturnValueOnce([]);
      useExperimentVariant.mockReturnValueOnce("search-history");
      renderSportsBrowse({ inputSearchTerm: "se" });

      act(() => {
        const [{ onFocusSearchBar }] = SportsSearchContainer.mock.calls[0];
        onFocusSearchBar();
      });

      expect(SearchBarHistory).not.toHaveBeenCalled();
    });
    it("should render SearchBarHistory component with correct props when search is focused and input is not valid", async () => {
      useExperimentVariant.mockReturnValueOnce("search-history");
      renderSportsBrowse({ inputSearchTerm: "po" });

      act(() => {
        const [{ onFocusSearchBar }] = SportsSearchContainer.mock.calls[0];
        onFocusSearchBar();
      });

      expect(SearchBarHistory).toHaveBeenCalledWith(
        {
          historyLabel: "I18N.SEARCH.HISTORY.LABEL",
          searchHistory: ["age", "bonanza"],
          onHistoryClick: expect.any(Function),
        },
        undefined,
      );
    });
    it("should not show search history when input is valid", () => {
      useExperimentVariant.mockReturnValueOnce("search-history");
      renderSportsBrowse({ inputSearchTerm: "por" });

      act(() => {
        const [{ onFocusSearchBar }] = SportsSearchContainer.mock.calls[0];
        onFocusSearchBar();
      });

      expect(SearchBarHistory).not.toHaveBeenCalled();
      expect(SportsSearchContainer).toHaveBeenCalledWith(
        expect.objectContaining({ showSearchResults: true }),
        undefined,
      );
    });
    it("should dispatch UI__SEARCH_HISTORY_CLICK and update search history when a history item is clicked", async () => {
      const spyHistoryClickAction = jest.fn();
      useExperimentVariant.mockReturnValue("search-history");
      renderSportsBrowse({ dispatchHistoryClickAction: spyHistoryClickAction });

      act(() => {
        const [{ onFocusSearchBar }] = SportsSearchContainer.mock.calls[0];
        onFocusSearchBar();
      });

      act(() => {
        const [{ onHistoryClick }] = SearchBarHistory.mock.calls[0];
        onHistoryClick("search term");
      });

      expect(spyHistoryClickAction).toHaveBeenCalledWith("search term");
      expect(updateSportsSearchHistory).toHaveBeenCalledWith("search term");
    });
  });
});
