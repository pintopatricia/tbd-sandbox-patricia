import { render, act, waitFor } from "@testing-library/react-native";
import { PebbleList, SearchBar } from "@ppb/the-wall-native";
import { SearchResultsList } from "@ppb/the-wall-native/components/SearchResultsList/SearchResultsList";
import SportsBrowse from "./SportsBrowse.native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.native";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.native";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("../Card", () =>
  jest.fn(({ children, ...props }) => <card-connected-component {...props}>{children}</card-connected-component>),
);

jest.mock("../Card/Card.native", () => jest.fn(() => <card-native-mock />));

jest.mock("@ppb/the-wall-native", () => ({
  PebbleList: jest.fn(() => <pebble-list-mock />),
  SearchBar: jest.fn(() => <search-bar-mock></search-bar-mock>),
}));

jest.mock("@ppb/the-wall-native/components/SearchResultsList/SearchResultsList", () => ({
  SearchResultsList: jest.fn(() => <search-results-list-mock></search-results-list-mock>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

jest.mock("../../helpers/search-history-helper.native", () => ({
  getSportsSearchHistory: jest.fn(() => ["age", "bonanza"]),
  updateSportsSearchHistory: jest.fn(() => {}),
}));

jest.mock("../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(),
}));

jest.mock("../SearchBarHistory/SearchBarHistory.native", () => ({
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

const sportsFiltersMock = [
  { id: "1", text: "Football" },
  { id: "7", text: "Horse Racing" },
];

function renderSportsBrowse({
  urn = "ppb:tbd:view:browse:sports",
  items = mockItems,
  searchResults,
  query = "som",
  inputSearchTerm = "",
  searchPlaceholder = "I18N.SEARCH.INPUT_PLACEHOLDER",
  sportFilters = [],
  cancel = "I18N.SEARCH.CANCEL",
  didYouMeanLabel = "I18N.SEARCH.DID_YOU_MEAN",
  noResultsLabel = "I18N.SEARCH.YOUR_SEARCH",
  numberOfResultsLabel = "I18N.SEARCH.RESULTS",
  searchHistoryLabel = "I18N.SEARCH.HISTORY.LABEL",
  dispatchSearchInputChangeAction = jest.fn(),
  dispatchSearchInputChangeClearAction = jest.fn(),
  dispatchSearchClearResultsAction = jest.fn(),
  dispatchSearchLinkClick = jest.fn(),
  dispatchSearchCancelAction = jest.fn(),
  dispatchSearchBarFocusAction = jest.fn(),
  dispatchSportsFilterClickAction = jest.fn(),
  dispatchHistoryClickAction = jest.fn(),
  historyVariant = "control",
  filterVariant = "control",
} = {}) {
  useExperimentVariant.mockImplementation((experimentId) => {
    if (experimentId === "exp-search-history") return historyVariant;
    if (experimentId === "exp-search-filter") return filterVariant;
  });

  const { rerender } = render(
    <SportsBrowse
      urn={urn}
      items={items}
      searchResults={searchResults}
      query={query}
      inputSearchTerm={inputSearchTerm}
      searchPlaceholder={searchPlaceholder}
      searchHistoryLabel={searchHistoryLabel}
      sportFilters={sportFilters}
      cancel={cancel}
      didYouMeanLabel={didYouMeanLabel}
      noResultsLabel={noResultsLabel}
      numberOfResultsLabel={numberOfResultsLabel}
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

  describe("when initializing the component and history experiment is not enabled", () => {
    it("should not render SearchBarHistory component or call getSportsSearchHistory", () => {
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        inputSearchTerm: "",
      });

      expect(SearchBarHistory).not.toHaveBeenCalled();
      expect(getSportsSearchHistory).not.toHaveBeenCalled();
    });
  });

  describe("when initializing the component without results", () => {
    it("should initialize SearchBar and ConnectedCard components with the correct props", () => {
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        inputSearchTerm: "",
      });

      expect(SearchBar).toHaveBeenCalledWith(
        {
          placeholderLabel: "I18N.SEARCH.INPUT_PLACEHOLDER",
          cancelLabel: "I18N.SEARCH.CANCEL",
          inputSearchTerm: "",
          onCancel: expect.any(Function),
          onClean: expect.any(Function),
          onChange: expect.any(Function),
          onFocusChange: expect.any(Function),
          onInputClick: expect.any(Function),
        },
        undefined,
      );

      expect(SearchBar).toHaveBeenCalledTimes(1);

      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
          component: Card,
          typename: "QuickLinksCard",
          visible: true,
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
        query: "query",
        inputSearchTerm: "search term",
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
    });

    it("should initialize SearchBar and SearchResultsList components with the correct props", () => {
      renderSportsBrowse({
        searchResults: mockSearchResults,
        query: "query",
        searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
        cancel: "I18N.SEARCH.CANCEL",
        numberOfResultsLabel: "I18N.SEARCH.RESULTS",
        didYouMeanLabel: "I18N.SEARCH.DID_YOU_MEAN",
        noResultsLabel: "I18N.SEARCH.YOUR_SEARCH",
        inputSearchTerm: "search term",
      });

      expect(SearchBar).toHaveBeenCalledWith(
        {
          placeholderLabel: "I18N.SEARCH.INPUT_PLACEHOLDER",
          cancelLabel: "I18N.SEARCH.CANCEL",
          inputSearchTerm: "search term",
          onCancel: expect.any(Function),
          onClean: expect.any(Function),
          onChange: expect.any(Function),
          onFocusChange: expect.any(Function),
          onInputClick: expect.any(Function),
        },
        undefined,
      );

      expect(SearchBar).toHaveBeenCalledTimes(1);

      expect(SearchResultsList).toHaveBeenCalledWith(
        {
          i18n: {
            didYouMeanLabel: "I18N.SEARCH.DID_YOU_MEAN",
            numberOfResultsLabel: "I18N.SEARCH.RESULTS",
            noResultsLabel: "I18N.SEARCH.YOUR_SEARCH",
          },
          results: mockSearchResults,
          onResultClick: expect.any(Function),
        },
        undefined,
      );

      expect(SearchBar).toHaveBeenCalledTimes(1);
    });
  });

  describe("when initializing the component with sport filters", () => {
    it("should render PebbleList with the correct props", () => {
      renderSportsBrowse({
        searchResults: mockSearchResults,
        query: "query",
        inputSearchTerm: "search term",
        sportFilters: sportsFiltersMock,
        filterVariant: "search-filter",
      });

      expect(PebbleList).toHaveBeenCalledWith(
        {
          items: sportsFiltersMock,
          defaultSelectedPebble: "ALL",
          onPebblePress: expect.any(Function),
          selectedPebble: "ALL",
        },
        undefined,
      );
    });
  });

  describe("when select a sport filter", () => {
    it("should filter search results based on the selected sport", () => {
      renderSportsBrowse({
        searchResults: mockSearchResults,
        query: "query",
        inputSearchTerm: "search term",
        sportFilters: sportsFiltersMock,
        filterVariant: "search-filter",
      });

      expect(PebbleList).toHaveBeenCalledWith(
        {
          items: sportsFiltersMock,
          defaultSelectedPebble: "ALL",
          onPebblePress: expect.any(Function),
          selectedPebble: "ALL",
        },
        undefined,
      );
      expect(SearchResultsList.mock.calls[0][0].results).toEqual(mockSearchResults);

      const { onPebblePress } = PebbleList.mock.calls[0][0];

      act(() => {
        onPebblePress("1");
      });

      expect(SearchResultsList.mock.calls[1][0].results).toEqual([mockSearchResults[0], mockSearchResults[1]]);
    });
  });

  describe("when a result is pressed", () => {
    it("should dispatch UI__SEARCH_LINK_CLICK action", () => {
      const spySearchLinkClick = jest.fn();
      const spyHistoryClick = jest.fn();

      renderSportsBrowse({
        searchResults: mockSearchResults,
        query: "query",
        inputSearchTerm: "Hel",
        dispatchSearchLinkClick: spySearchLinkClick,
        dispatchHistoryClickAction: spyHistoryClick,
      });
      const { onResultClick } = SearchResultsList.mock.calls[0][0];
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };

      onResultClick(viewLinkMock, 1, "name");
      expect(spySearchLinkClick).toHaveBeenCalledWith("query", viewLinkMock, 1, "name", mockSearchResults.length);
      expect(spyHistoryClick).not.toHaveBeenCalled();
      expect(updateSportsSearchHistory).not.toHaveBeenCalled();
    });
  });

  describe("when search bar is focused", () => {
    it("should dispatch UI__SEARCH_BAR_FOCUS action", () => {
      const spySearchBarFocusAction = jest.fn();
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        dispatchSearchBarFocusAction: spySearchBarFocusAction,
      });

      act(() => {
        const { onInputClick } = SearchBar.mock.calls[0][0];
        onInputClick();
      });

      expect(spySearchBarFocusAction).toHaveBeenCalled();
    });
  });

  describe("when cancel is called", () => {
    it("should dispatch UI__SEARCH_CANCEL_CLICK action", () => {
      const spySearchCancelAction = jest.fn();
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        dispatchSearchCancelAction: spySearchCancelAction,
      });
      const { onCancel } = SearchBar.mock.calls[0][0];
      onCancel("searchTerm");
      expect(spySearchCancelAction).toHaveBeenCalledWith("searchTerm", "ppb:tbd:view:browse:sports");
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
          dispatchSearchInputChangeAction: spySearchInputChangeAction,
        });

        act(() => {
          const { onChange } = SearchBar.mock.calls[0][0];
          onChange("text");
        });

        expect(spySearchInputChangeAction).toHaveBeenCalledWith("text", "ppb:tbd:view:browse:sports");
      });

      it("should dispatch UI__CLEAR_SEARCH_RESULTS action", () => {
        const spySearchInputChangeClearAction = jest.fn();
        renderSportsBrowse({
          searchResults: [],
          query: "query",
          inputSearchTerm: "search term",
          dispatchSearchInputChangeClearAction: spySearchInputChangeClearAction,
        });
        act(() => {
          const { onChange } = SearchBar.mock.calls[0][0];
          onChange("text");
        });
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
          dispatchSearchInputChangeAction: spySearchInputChangeAction,
        });
        act(() => {
          const { onChange } = SearchBar.mock.calls[0][0];
          onChange("te");
        });
        expect(spySearchInputChangeAction).toHaveBeenCalledWith("te", "ppb:tbd:view:browse:sports");
      });

      it("should dispatch UI__SEARCH_INPUT_CHANGE_CLEAR action", () => {
        const spySearchInputChangeClearAction = jest.fn();
        renderSportsBrowse({
          searchResults: [],
          query: "query",
          inputSearchTerm: "search term",
          dispatchSearchInputChangeClearAction: spySearchInputChangeClearAction,
        });
        act(() => {
          const { onChange } = SearchBar.mock.calls[0][0];
          onChange("te");
        });
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
          dispatchSearchClearResultsAction: spySearchClearResultsAction,
        });

        act(() => {
          const { onClean } = SearchBar.mock.calls[0][0];
          onClean("");
        });

        expect(spySearchClearResultsAction).toHaveBeenCalledWith("", "ppb:tbd:view:browse:sports");
      });
    });

    describe("sports filters", () => {
      it("should render the search result list with the filters", () => {
        renderSportsBrowse({
          searchResults: mockSearchResults,
          query: "query",
          inputSearchTerm: "por",
          sportFilters: sportsFiltersMock,
          filterVariant: "search-filter",
        });

        expect(SearchResultsList).toHaveBeenCalledWith(
          {
            i18n: {
              didYouMeanLabel: "I18N.SEARCH.DID_YOU_MEAN",
              numberOfResultsLabel: "I18N.SEARCH.RESULTS",
              noResultsLabel: "I18N.SEARCH.YOUR_SEARCH",
            },
            results: mockSearchResults,
            onResultClick: expect.any(Function),
          },
          undefined,
        );
      });
      it("should render the search result list filtered by the selected sport", () => {
        const dispatchSportsFilterClickAction = jest.fn();
        renderSportsBrowse({
          searchResults: mockSearchResults,
          query: "query",
          inputSearchTerm: "por",
          sportFilters: sportsFiltersMock,
          dispatchSportsFilterClickAction,
          filterVariant: "search-filter",
        });

        expect(PebbleList).toHaveBeenCalledTimes(1);

        const { onPebblePress } = PebbleList.mock.calls[0][0];

        act(() => {
          onPebblePress("1");
        });

        expect(SearchResultsList).toHaveBeenNthCalledWith(
          2,
          {
            i18n: {
              didYouMeanLabel: "I18N.SEARCH.DID_YOU_MEAN",
              numberOfResultsLabel: undefined,
              noResultsLabel: "I18N.SEARCH.YOUR_SEARCH",
            },
            results: [mockSearchResults[0], mockSearchResults[1]],
            onResultClick: expect.any(Function),
          },
          undefined,
        );
      });
    });

    it("should show only one selected peble", () => {
      renderSportsBrowse({
        inputSearchTerm: "foot",
        searchResults: mockSearchResults,
        query: "foot",
        sportFilters: [sportsFiltersMock[0]],
        filterVariant: "search-filter",
      });

      expect(PebbleList).toHaveBeenCalledTimes(1);

      const { items, selectedPebble } = PebbleList.mock.calls[0][0];
      expect(items).toHaveLength(1);
      expect(selectedPebble).toBe(sportsFiltersMock[0].id);
    });
  });
  describe("when search history experiment is enabled", () => {
    it("when search bar is focused it should show search history", async () => {
      renderSportsBrowse({ searchResults: [], query: "query", inputSearchTerm: "", historyVariant: "search-history" });

      act(() => {
        const [{ onFocusChange }] = SearchBar.mock.calls[0];
        onFocusChange(true);
      });

      await waitFor(() =>
        expect(SearchBarHistory).toHaveBeenCalledWith(
          expect.objectContaining({
            searchHistory: ["age", "bonanza"],
            historyLabel: "I18N.SEARCH.HISTORY.LABEL",
          }),
          undefined,
        ),
      );
    });
    it("and a result is pressed it should update search history", () => {
      renderSportsBrowse({
        searchResults: mockSearchResults,
        inputSearchTerm: "Hel",
        historyVariant: "search-history",
      });

      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      act(() => {
        const [{ onResultClick }] = SearchResultsList.mock.calls[0];
        onResultClick(viewLinkMock, 1, "name");
      });

      expect(updateSportsSearchHistory).toHaveBeenCalledWith("Hel");
    });
    it("and a history item is pressed it should call dispatchHistoryClickAction and update search history", async () => {
      const dispatchHistoryClickAction = jest.fn();
      renderSportsBrowse({
        searchResults: [],
        query: "query",
        inputSearchTerm: "He",
        dispatchHistoryClickAction: dispatchHistoryClickAction,
        historyVariant: "search-history",
      });

      act(() => {
        const [{ onFocusChange }] = SearchBar.mock.calls[0];
        onFocusChange(true);
      });

      await waitFor(() => expect(SearchBarHistory).toHaveBeenCalled());

      act(() => {
        const [{ onHistoryClick }] = SearchBarHistory.mock.calls[0];
        onHistoryClick("He");
      });

      expect(dispatchHistoryClickAction).toHaveBeenCalledWith("He");
      expect(updateSportsSearchHistory).toHaveBeenCalledWith("He");
    });
  });
});
