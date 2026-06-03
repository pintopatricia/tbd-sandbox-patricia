import { act, render, waitFor } from "@testing-library/react-native";
import { SearchResultsList } from "@ppb/the-wall-native/components/SearchResultsList/SearchResultsList";
import { SearchBar, PebbleList } from "@ppb/the-wall-native";
import SearchBarCard from "./SearchBarCard.native";
import { SHOW_ALL_SPORTS_FILTER_ID } from "./constants";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.native";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("@ppb/the-wall-native/components/SearchResultsList/SearchResultsList", () => ({
  SearchResultsList: jest.fn(() => <test-element>SearchResultsList</test-element>),
}));

jest.mock("@ppb/the-wall-native", () => ({
  SearchBar: jest.fn(() => <test-element>SearchBar</test-element>),
  Text: jest.requireActual("react-native").Text,
  PebbleList: jest.fn(() => <test-element>PebbleList</test-element>),
}));

jest.mock("../../helpers/search-history-helper.native", () => ({
  getSportsSearchHistory: jest.fn().mockResolvedValue(["age", "bonanza"]),
  updateSportsSearchHistory: jest.fn(() => {}),
}));

jest.mock("../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(),
}));

jest.mock("../SearchBarHistory/SearchBarHistory.native", () => ({
  SearchBarHistory: jest.fn(() => <test-element>SearchBarHistory</test-element>),
}));

const mocki18n = {
  i18n: {
    didYouMeanLabel: "Did you mean?",
    noResultsLabel: "No results found",
    numberOfResultsLabel: "Number of results",
    searchHistoryLabel: "Search history",
    searchPlaceholder: "Search...",
    cancel: "Cancel",
  },
};

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

function renderSearchBarCard({
  searchResults = [],
  inputSearchTerm = "",
  sportFilters = [],
  title,
  didYouMeanLabel = mocki18n.i18n.didYouMeanLabel,
  numberOfResultsLabel = mocki18n.i18n.numberOfResultsLabel,
  noResultsLabel = mocki18n.i18n.noResultsLabel,
  searchPlaceholder = mocki18n.i18n.searchPlaceholder,
  searchHistoryLabel = mocki18n.i18n.searchHistoryLabel,
  cancel = mocki18n.i18n.cancel,
  dispatchSearchInputChangeAction = jest.fn(() => {}),
  dispatchSearchBarFocusAction = jest.fn(() => {}),
  dispatchSearchInputChangeClearAction = jest.fn(() => {}),
  dispatchSearchResultsLinkClick = jest.fn(() => {}),
  dispatchPushAction = jest.fn(() => {}),
  dispatchSearchBarCancelAction = jest.fn(() => {}),
  dispatchSportsFilterClickAction = jest.fn(() => {}),
  dispatchHistoryClickAction = jest.fn(() => {}),
  historyVariant = "control",
  filterVariant = "control",
} = {}) {
  useExperimentVariant.mockImplementation((experimentId) => {
    if (experimentId === "exp-search-history") return historyVariant;
    if (experimentId === "exp-search-filter") return filterVariant;
  });
  return render(
    <SearchBarCard
      searchResults={searchResults}
      urn="urn"
      title={title}
      cancel={cancel}
      searchHistoryLabel={searchHistoryLabel}
      didYouMeanLabel={didYouMeanLabel}
      numberOfResultsLabel={numberOfResultsLabel}
      noResultsLabel={noResultsLabel}
      searchPlaceholder={searchPlaceholder}
      sportFilters={sportFilters}
      inputSearchTerm={inputSearchTerm}
      dispatchSearchInputChangeAction={dispatchSearchInputChangeAction}
      dispatchSearchBarFocusAction={dispatchSearchBarFocusAction}
      dispatchSearchInputChangeClearAction={dispatchSearchInputChangeClearAction}
      dispatchSearchResultsLinkClick={dispatchSearchResultsLinkClick}
      dispatchSearchBarCancelAction={dispatchSearchBarCancelAction}
      dispatchPushAction={dispatchPushAction}
      dispatchSportsFilterClickAction={dispatchSportsFilterClickAction}
      dispatchHistoryClickAction={dispatchHistoryClickAction}
    />,
  );
}

describe("SearchBarCard", () => {
  beforeEach(jest.clearAllMocks);
  describe("render", () => {
    it("should render appropriate title, SearchBar and not SearchResultsList if the searchbar is not focus or no valid input search term", () => {
      const { getByText } = renderSearchBarCard({ title: "Search" });

      expect(getByText("Search")).toBeTruthy();
      expect(SearchBar).toHaveBeenCalledTimes(1);
      expect(SearchResultsList).not.toHaveBeenCalled();
    });

    it("should render SearchResultsList if valid input search term present", () => {
      renderSearchBarCard({ inputSearchTerm: "foot" });

      expect(SearchResultsList).toHaveBeenCalledTimes(1);
    });
    it("should not call getSportsSearchHistory or searchHistory if search history experiment is not enabled", () => {
      renderSearchBarCard();

      expect(getSportsSearchHistory).not.toHaveBeenCalled();
      expect(SearchBarHistory).not.toHaveBeenCalled();
    });
  });
  describe("when handle change is called", () => {
    it("should call dispatchSearchInputChangeAction callback", () => {
      const dispatchSearchInputChangeActionSpy = jest.fn();
      renderSearchBarCard({ dispatchSearchInputChangeAction: dispatchSearchInputChangeActionSpy });

      const { onChange } = SearchBar.mock.calls[0][0];
      onChange("football");
      expect(dispatchSearchInputChangeActionSpy).toHaveBeenCalledWith("football", "urn");
    });
  });

  describe("when input has focus", () => {
    it("should call SearchResultsList on render", () => {
      renderSearchBarCard();

      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => {
        onFocusChange(true);
      });
      expect(SearchResultsList).toHaveBeenCalledTimes(1);
    });
    it("should call dispatchSearchBarFocusAction callback", () => {
      const dispatchSearchBarFocusActionSpy = jest.fn();
      renderSearchBarCard({ dispatchSearchBarFocusAction: dispatchSearchBarFocusActionSpy });

      const { onInputClick } = SearchBar.mock.calls[0][0];
      onInputClick();
      expect(dispatchSearchBarFocusActionSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("when results clean is called", () => {
    it("should call cleanResults callback", () => {
      const dispatchSearchInputChangeClearActionSpy = jest.fn();
      renderSearchBarCard({ dispatchSearchInputChangeClearAction: dispatchSearchInputChangeClearActionSpy });

      const { onClean } = SearchBar.mock.calls[0][0];
      onClean();
      expect(dispatchSearchInputChangeClearActionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handle cancel is called", () => {
    it("should call onCancel callback", () => {
      const dispatchSearchBarCancelActionSpy = jest.fn();
      renderSearchBarCard({ dispatchSearchBarCancelAction: dispatchSearchBarCancelActionSpy });

      const { onCancel } = SearchBar.mock.calls[0][0];
      onCancel();
      expect(dispatchSearchBarCancelActionSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("when a result is pressed", () => {
    it("should dispatch UI__SEARCH_LINK_CLICK action and not update search history if experiment is not enabled", () => {
      const dispatchSearchResultsLinkClickSpy = jest.fn();
      const dispatchHistoryClickAction = jest.fn();

      renderSearchBarCard({
        searchResults: mockSearchResults,
        inputSearchTerm: "Foot",
        dispatchSearchResultsLinkClick: dispatchSearchResultsLinkClickSpy,
        dispatchHistoryClickAction: dispatchHistoryClickAction,
      });
      const { onResultClick } = SearchResultsList.mock.calls[0][0];
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      onResultClick(viewLinkMock, 1, "name");
      expect(dispatchSearchResultsLinkClickSpy).toHaveBeenCalledTimes(1);
      expect(updateSportsSearchHistory).not.toHaveBeenCalled();
      expect(dispatchHistoryClickAction).not.toHaveBeenCalled();
    });
  });

  describe("sports filters", () => {
    it("should render the search result list with the filters", () => {
      renderSearchBarCard({
        inputSearchTerm: "foot",
        sportFilters: sportsFiltersMock,
        searchResults: mockSearchResults,
        filterVariant: "search-filter",
      });

      expect(SearchResultsList).toHaveBeenCalledTimes(1);
      expect(SearchResultsList).toHaveBeenCalledWith(
        {
          i18n: {
            didYouMeanLabel: "Did you mean?",
            noResultsLabel: "No results found",
            numberOfResultsLabel: "Number of results",
          },
          results: mockSearchResults,
          onResultClick: expect.any(Function),
        },
        undefined,
      );
      expect(PebbleList).toHaveBeenCalledTimes(1);
      expect(PebbleList).toHaveBeenCalledWith(
        {
          items: sportsFiltersMock,
          defaultSelectedPebble: SHOW_ALL_SPORTS_FILTER_ID,
          onPebblePress: expect.any(Function),
          selectedPebble: SHOW_ALL_SPORTS_FILTER_ID,
        },
        undefined,
      );
    });

    it("should filter the results with the correct filter id", () => {
      renderSearchBarCard({
        inputSearchTerm: "foot",
        searchResults: mockSearchResults,
        sportFilters: sportsFiltersMock,
        filterVariant: "search-filter",
      });

      expect(SearchResultsList.mock.calls[0][0].results).toEqual(mockSearchResults);

      const { onPebblePress } = PebbleList.mock.calls[0][0];
      act(() => onPebblePress(sportsFiltersMock[0].id));

      expect(SearchResultsList.mock.calls[1][0].results).toEqual([mockSearchResults[0], mockSearchResults[1]]);
    });

    it("should filter the results with the 'show all' filter when input changes", () => {
      renderSearchBarCard({
        inputSearchTerm: "foot",
        searchResults: mockSearchResults,
        query: "foot",
        sportFilters: sportsFiltersMock,
        filterVariant: "search-filter",
      });

      expect(PebbleList).toHaveBeenCalledTimes(1);

      act(() => PebbleList.mock.calls[0][0].onPebblePress(sportsFiltersMock[0].id));

      expect(SearchResultsList.mock.calls[1][0].results).toEqual([mockSearchResults[0], mockSearchResults[1]]);

      const { onChange } = SearchBar.mock.calls[0][0];
      act(() => onChange("port"));

      expect(SearchResultsList.mock.calls[2][0].results).toEqual(mockSearchResults);
    });

    it("should show only one selected peble", () => {
      renderSearchBarCard({
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

  describe("search history", () => {
    it("should render search history if input is focused and no valid search term", async () => {
      renderSearchBarCard({ inputSearchTerm: "", historyVariant: "search-history" });

      act(() => {
        const [{ onFocusChange }] = SearchBar.mock.calls[0];
        onFocusChange(true);
      });

      await waitFor(() =>
        expect(SearchBarHistory).toHaveBeenCalledWith(
          {
            searchHistory: ["age", "bonanza"],
            historyLabel: "Search history",
            onHistoryClick: expect.any(Function),
          },
          undefined,
        ),
      );
    });
    it("should not render search history if term is valid", async () => {
      renderSearchBarCard({ inputSearchTerm: "foot", historyVariant: "search-history" });

      act(() => {
        const [{ onFocusChange }] = SearchBar.mock.calls[0];
        onFocusChange(true);
      });

      await waitFor(() => expect(SearchBarHistory).not.toHaveBeenCalled());
    });
    it("should update search history when a result is clicked", () => {
      renderSearchBarCard({
        searchResults: mockSearchResults,
        inputSearchTerm: "foot",
        historyVariant: "search-history",
      });

      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      act(() => {
        const [{ onResultClick }] = SearchResultsList.mock.calls[0];
        onResultClick(viewLinkMock, 1, "name");
      });

      expect(updateSportsSearchHistory).toHaveBeenCalledWith("foot");
    });
    it("should call dispatchHistoryClickAction and update term to the top of the history when a history item is clicked", async () => {
      const dispatchHistoryClickAction = jest.fn();
      renderSearchBarCard({ inputSearchTerm: "", dispatchHistoryClickAction, historyVariant: "search-history" });

      act(() => {
        const [{ onFocusChange }] = SearchBar.mock.calls[0];
        onFocusChange(true);
      });

      await waitFor(() => expect(SearchBarHistory).toHaveBeenCalled());

      act(() => {
        const [{ onHistoryClick }] = SearchBarHistory.mock.calls[0];
        onHistoryClick("foot");
      });

      expect(dispatchHistoryClickAction).toHaveBeenCalledWith("foot");
      expect(updateSportsSearchHistory).toHaveBeenCalledWith("foot");
    });
  });
});
