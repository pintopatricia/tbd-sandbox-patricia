import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SearchBar } from "@ppb/the-wall-web/components/walls/SearchBar/SearchBar";
import { SearchResultsList } from "@ppb/the-wall-web/components/rooms/SearchResultsList/SearchResultsList";
import SearchBarCard from "./SearchBarCard.web";
import { PebbleList } from "@ppb/the-wall-web";
import { SHOW_ALL_SPORTS_FILTER_ID } from "./constants";
import { useExperimentVariant } from "../../experimentation/hooks/useExperimentVariant";
import { SearchBarHistory } from "../SearchBarHistory/SearchBarHistory.web";
import { getSportsSearchHistory, updateSportsSearchHistory } from "../../helpers/search-history-helper.web";

jest.mock("@ppb/the-wall-web/components/walls/SearchBar/SearchBar", () => ({
  SearchBar: jest.fn(() => <search-bar-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  PebbleList: jest.fn(() => <pebble-list-mock />),
}));

jest.mock("@ppb/the-wall-web/components/rooms/SearchResultsList/SearchResultsList", () => ({
  SearchResultsList: jest.fn(() => <search-results-list-mock />),
}));

jest.mock("../../helpers/search-history-helper.web", () => ({
  getSportsSearchHistory: jest.fn(() => ["age", "bonanza"]),
  updateSportsSearchHistory: jest.fn(() => {}),
}));

jest.mock("../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(),
}));

jest.mock("../SearchBarHistory/SearchBarHistory.web", () => ({
  SearchBarHistory: jest.fn(() => <test-element>SearchBarHistory</test-element>),
}));

const mocki18n = {
  i18n: {
    didYouMeanLabel: undefined,
    noResultsLabel: undefined,
    numberOfResultsLabel: undefined,
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
  inputSearchTerm = "",
  query = "",
  title,
  sportFilters = [],
  searchResults = [],
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
      urn="urn"
      title={title}
      translations={mocki18n}
      sportFilters={sportFilters}
      inputSearchTerm={inputSearchTerm}
      searchResults={searchResults}
      query={query}
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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("render", () => {
    it("should render appropriate title, SearchBar and not SearchResultsList if the searchbar is not focus or no valid input search term", () => {
      const { getByText } = renderSearchBarCard({ title: "Search" });

      expect(getByText("Search")).toBeInTheDocument();
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
      act(() => onChange("football"));
      expect(dispatchSearchInputChangeActionSpy).toHaveBeenCalledWith("football", "urn");
    });
  });

  describe("when input has focus", () => {
    it("should call SearchResultsList on render", () => {
      renderSearchBarCard();

      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => onFocusChange(true));
      expect(SearchResultsList).toHaveBeenCalledTimes(1);
    });
    it("should call dispatchSearchBarFocusAction callback", () => {
      const dispatchSearchBarFocusActionSpy = jest.fn();
      renderSearchBarCard({ dispatchSearchBarFocusAction: dispatchSearchBarFocusActionSpy });

      const { onInputClick } = SearchBar.mock.calls[0][0];
      act(() => onInputClick());
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
      act(() => onCancel());
      expect(dispatchSearchBarCancelActionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("when searchresultslist is clicked", () => {
    it("should call respective callbacks", () => {
      const dispatchSearchResultsLinkClickSpy = jest.fn();
      const dispatchPushActionSpy = jest.fn();
      renderSearchBarCard({
        dispatchSearchResultsLinkClick: dispatchSearchResultsLinkClickSpy,
        dispatchPushAction: dispatchPushActionSpy,
        inputSearchTerm: "foot",
      });

      const { onResultClick } = SearchResultsList.mock.calls[0][0];
      act(() => onResultClick());
      expect(dispatchSearchResultsLinkClickSpy).toHaveBeenCalledTimes(1);
      expect(dispatchPushActionSpy).toHaveBeenCalledTimes(1);
      expect(updateSportsSearchHistory).not.toHaveBeenCalled();
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
          i18n: mocki18n.i18n,
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
          onPebbleClick: expect.any(Function),
          selectedPebble: SHOW_ALL_SPORTS_FILTER_ID,
        },
        undefined,
      );
    });

    it("should filter the results with the correct filter id", () => {
      renderSearchBarCard({
        inputSearchTerm: "foot",
        searchResults: mockSearchResults,
        query: "foot",
        sportFilters: sportsFiltersMock,
        filterVariant: "search-filter",
      });

      expect(SearchResultsList.mock.calls[0][0].results).toEqual(mockSearchResults);

      const { onPebbleClick } = PebbleList.mock.calls[0][0];
      act(() => onPebbleClick(sportsFiltersMock[0].id));

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

      act(() => PebbleList.mock.calls[0][0].onPebbleClick(sportsFiltersMock[0].id));

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

      expect(SearchBarHistory).toHaveBeenCalledWith(
        expect.objectContaining({
          searchHistory: ["age", "bonanza"],
        }),
        undefined,
      );
    });
    it("should not render search history if term is valid", () => {
      renderSearchBarCard({ inputSearchTerm: "foot", historyVariant: "search-history" });

      expect(SearchBarHistory).not.toHaveBeenCalled();
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
    it("should call dispatchHistoryClickAction, and move the term to the top of the search history when a history item is clicked", () => {
      const historyTerm = "He";
      const dispatchHistoryClickAction = jest.fn();
      renderSearchBarCard({
        dispatchHistoryClickAction,
        historyVariant: "search-history",
      });

      act(() => {
        const [{ onFocusChange }] = SearchBar.mock.calls[0];
        onFocusChange(true);
      });

      act(() => {
        const [{ onHistoryClick }] = SearchBarHistory.mock.calls[0];
        onHistoryClick(historyTerm);
      });

      expect(dispatchHistoryClickAction).toHaveBeenCalledWith(historyTerm);
      expect(updateSportsSearchHistory).toHaveBeenCalledWith(historyTerm);
    });
  });
});
