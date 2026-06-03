import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SearchBar } from "@ppb/the-wall-web/components/walls/SearchBar/SearchBar";
import { SearchResultsList } from "@ppb/the-wall-web/components/rooms/SearchResultsList/SearchResultsList";

import { SportsSearchContainer } from "./SportsSearchContainer.web";
import { PebbleList } from "@ppb/the-wall-web";
import { SHOW_ALL_SPORTS_FILTER_ID } from "../../../SearchBarCard/constants";

jest.mock("@ppb/the-wall-web/components/walls/SearchBar/SearchBar", () => ({
  SearchBar: jest.fn(() => <search-bar-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  PebbleList: jest.fn(() => <pebble-list-mock />),
}));

jest.mock("@ppb/the-wall-web/components/rooms/SearchResultsList/SearchResultsList", () => ({
  SearchResultsList: jest.fn(() => <search-results-list-mock />),
}));

jest.mock("../../../../experimentation/hooks/useExperimentVariant", () => ({
  useExperimentVariant: jest.fn(() => "search-filter"),
}));

const callbacks = {
  onTabSwitch: jest.fn(() => {}),
  onCancel: jest.fn(() => {}),
  cleanResults: jest.fn(() => {}),
  onChange: jest.fn(() => {}),
  onResultClick: jest.fn(() => {}),
  onFocusSearchBar: jest.fn(() => {}),
  onInputFocus: jest.fn(() => {}),
  onFilterResults: jest.fn(() => {}),
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

const mocki18n = {
  i18n: {
    searchPlaceholder: "search",
    cancel: "cancel",
  },
};

function renderSportsSearchContainer({
  inputSearchTerm,
  searchResults,
  sportFilters,
  showSearchResults,
  shouldHandleOnBlur = true,
  isDesktop = false,
}) {
  return render(
    <SportsSearchContainer
      translations={mocki18n}
      onCancel={callbacks.onCancel}
      onChange={callbacks.onChange}
      cleanResults={callbacks.cleanResults}
      sportFilters={sportFilters}
      inputSearchTerm={inputSearchTerm}
      searchResults={searchResults}
      showSearchResults={showSearchResults}
      onFocusSearchBar={callbacks.onFocusSearchBar}
      shouldHandleOnBlur={shouldHandleOnBlur}
      onInputFocus={callbacks.onInputFocus}
      isDesktop={isDesktop}
      onFilterResults={callbacks.onFilterResults}
    />,
  );
}

describe("SportsSearchContainer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("searchbar, quick links and search results", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should not render the results list when showSearchResults is not true", () => {
      renderSportsSearchContainer({});

      expect(SearchResultsList).not.toHaveBeenCalled();
    });

    it("should render the search bar", () => {
      renderSportsSearchContainer({});

      expect(SearchBar).toHaveBeenCalledTimes(1);
      expect(SearchBar).toHaveBeenCalledWith(
        {
          cancelLabel: "cancel",
          onCancel: expect.any(Function),
          onChange: expect.any(Function),
          onClean: expect.any(Function),
          onFocusChange: expect.any(Function),
          onInputClick: expect.any(Function),
          placeholderLabel: "search",
          inputSearchTerm: "",
          shouldHandleOnBlur: true,
          isDesktop: false,
        },
        undefined,
      );
    });

    it("should render the search result list when showSearchResults is true", () => {
      renderSportsSearchContainer({
        inputSearchTerm: "por",
        searchResults: [mockSearchResults[0]],
        showSearchResults: true,
      });

      expect(SearchResultsList).toHaveBeenCalledTimes(1);
      expect(SearchResultsList).toHaveBeenCalledWith(
        {
          i18n: mocki18n.i18n,
          results: [mockSearchResults[0]],
          onResultClick: undefined,
        },
        undefined,
      );
    });
  });

  describe("when results clean is called", () => {
    beforeEach(() => {
      renderSportsSearchContainer({});

      const { onClean } = SearchBar.mock.calls[0][0];
      onClean();
    });

    it("should call cleanResults callback", () => {
      expect(callbacks.cleanResults).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handle change is called", () => {
    beforeEach(() => {
      renderSportsSearchContainer({});

      const { onChange } = SearchBar.mock.calls[0][0];
      act(() => onChange("teste"));
    });

    it("should call onChange callback", () => {
      expect(callbacks.onChange).toHaveBeenCalledTimes(1);
      expect(callbacks.onChange).toHaveBeenCalledWith("teste");
    });
  });

  describe("when handle cancel is called", () => {
    beforeEach(() => {
      renderSportsSearchContainer({});

      const { onCancel } = SearchBar.mock.calls[0][0];
      act(() => onCancel("searchedTerm"));
    });

    it("should call onCancel callback", () => {
      expect(callbacks.onCancel).toHaveBeenCalledWith("searchedTerm");
    });
  });

  describe("when handle input click is called", () => {
    beforeEach(() => {
      renderSportsSearchContainer({});

      const { onInputClick } = SearchBar.mock.calls[0][0];
      act(() => onInputClick());
    });

    it("should call onInputClick callback", () => {
      expect(callbacks.onFocusSearchBar).toHaveBeenCalled();
    });
  });

  describe("when focus input", () => {
    beforeEach(() => {
      renderSportsSearchContainer({});

      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => onFocusChange(true));
    });

    it("should call onInputClick callback", () => {
      expect(callbacks.onInputFocus).toHaveBeenCalledWith(true);
    });
  });

  describe("when input search term has 2 char", () => {
    it("should not render search results list", () => {
      renderSportsSearchContainer("po");
      expect(SearchResultsList).not.toHaveBeenCalled();
    });
  });

  describe("when loses focus on input", () => {
    beforeEach(() => {
      renderSportsSearchContainer({});

      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => onFocusChange(false));
    });

    it("should not render search result list", () => {
      expect(SearchResultsList).not.toHaveBeenCalled();
    });
  });

  describe("sports filters", () => {
    it("should render the search result list with the filters", () => {
      renderSportsSearchContainer({
        inputSearchTerm: "por",
        searchResults: mockSearchResults,
        showSearchResults: true,
        sportFilters: sportsFiltersMock,
      });

      expect(SearchResultsList).toHaveBeenCalledTimes(1);
      expect(SearchResultsList).toHaveBeenCalledWith(
        {
          i18n: mocki18n.i18n,
          results: mockSearchResults,
          onResultClick: undefined,
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
      renderSportsSearchContainer({
        inputSearchTerm: "por",
        searchResults: mockSearchResults,
        showSearchResults: true,
        sportFilters: sportsFiltersMock,
      });

      expect(SearchResultsList.mock.calls[0][0].results).toEqual(mockSearchResults);

      const { onPebbleClick } = PebbleList.mock.calls[0][0];
      act(() => onPebbleClick(sportsFiltersMock[0].id));

      expect(SearchResultsList.mock.calls[1][0].results).toEqual([mockSearchResults[0], mockSearchResults[1]]);
    });

    it("should filter the results with the 'show all' filter when input changes", () => {
      renderSportsSearchContainer({
        inputSearchTerm: "por",
        searchResults: mockSearchResults,
        showSearchResults: true,
        sportFilters: sportsFiltersMock,
      });

      expect(PebbleList).toHaveBeenCalledTimes(1);

      act(() => PebbleList.mock.calls[0][0].onPebbleClick(sportsFiltersMock[0].id));

      expect(SearchResultsList.mock.calls[1][0].results).toEqual([mockSearchResults[0], mockSearchResults[1]]);

      const { onChange } = SearchBar.mock.calls[0][0];
      act(() => onChange("port"));

      expect(SearchResultsList.mock.calls[2][0].results).toEqual(mockSearchResults);
    });

    it("should show only one selected peble", () => {
      renderSportsSearchContainer({
        inputSearchTerm: "foot",
        searchResults: mockSearchResults,
        query: "foot",
        sportFilters: [sportsFiltersMock[0]],
      });

      expect(PebbleList).toHaveBeenCalledTimes(1);

      const { items, selectedPebble } = PebbleList.mock.calls[0][0];
      expect(items).toHaveLength(1);
      expect(selectedPebble).toBe(sportsFiltersMock[0].id);
    });
  });
});
