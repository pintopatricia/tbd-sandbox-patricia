import { render, act } from "@testing-library/react";
import { PebbleList, Styled } from "@ppb/the-wall-web";
import "jest-dom/extend-expect";
import { SearchBar } from "@ppb/the-wall-web/components/walls/SearchBar/SearchBar";
import styles from "./GamingSearchContainer.web.css";
import { getGamingSearchHistory } from "../../../../helpers/search-history-helper.web";

import { GamingSearchContainer } from "./GamingSearchContainer.web";
import {
  SEARCH_RESULTS_CONTAINER,
  RECOMMENDED_GAMES_CONTAINER,
  NO_RESULTS_LABEL,
  OUT_OF_IDEAS_LABEL,
  SEARCH_HISTORY,
} from "./GamingSearchContainer.web.selectors";

jest.mock("@ppb/the-wall-web/components/walls/SearchBar/SearchBar", () => ({
  SearchBar: jest.fn(() => <search-bar-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Styled: jest.fn((props) => <styled-title {...props} />),
  PebbleList: jest.fn(() => <pebble-list-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("../../../../helpers/search-history-helper.web", () => ({
  getGamingSearchHistory: jest.fn(() => []),
}));

const callbacks = {
  onCancel: jest.fn(() => {}),
  onChange: jest.fn(() => {}),
  onFocusSearchBar: jest.fn(() => {}),
  cleanResults: jest.fn(() => {}),
  onSearchHistoryPebbleClick: jest.fn(() => {}),
};

const mocki18n = {
  i18n: {
    searchPlaceholder: "search",
    cancel: "cancel",
    outOfIdeasLabel: "out of ideas",
    noResultsLabel: "no results label",
    numberOfResultsLabel: "3 results",
  },
};

const containersMock = {
  recommendedGames: <div>recommended games view</div>,
  searchResults: <div>search results view</div>,
};

function renderGamingSearchContainer(
  inputSearchTerm,
  numberOfResults,
  i18n = mocki18n,
  shouldHandleOnBlur = false,
  isGamingZone = false,
  shouldDisplaySearchHistory = false,
) {
  return render(
    <GamingSearchContainer
      containers={containersMock}
      translations={i18n}
      inputSearchTerm={inputSearchTerm}
      numberOfResults={numberOfResults}
      onCancel={callbacks.onCancel}
      onChange={callbacks.onChange}
      onFocusSearchBar={callbacks.onFocusSearchBar}
      cleanResults={callbacks.cleanResults}
      shouldHandleOnBlur={shouldHandleOnBlur}
      isGamingZone={isGamingZone}
      shouldDisplaySearchHistory={shouldDisplaySearchHistory}
      onSearchHistoryPebbleClick={callbacks.onSearchHistoryPebbleClick}
    />,
  );
}

describe("GamingSearchContainer", () => {
  beforeEach(jest.clearAllMocks);
  describe("searchbar, search results and recommended games container", () => {
    it("should render the search bar", () => {
      renderGamingSearchContainer();

      expect(SearchBar).toHaveBeenCalledTimes(1);
      expect(SearchBar).toHaveBeenCalledWith(
        expect.objectContaining({
          cancelLabel: "cancel",
          onCancel: expect.any(Function),
          onChange: expect.any(Function),
          onClean: expect.any(Function),
          onFocusChange: expect.any(Function),
          onInputClick: expect.any(Function),
          placeholderLabel: "search",
          inputSearchTerm: "",
          shouldHandleOnBlur: false,
        }),
        undefined,
      );
    });

    describe("class assignments", () => {
      it("should not apply searchBar class when in gaming zone", () => {
        const { container } = renderGamingSearchContainer("Gaming search container 1", 0, mocki18n, false, true);
        const searchBar = container.querySelector(`.${styles.searchBar}`);
        expect(searchBar).not.toBeInTheDocument();
      });

      it("should not apply searchResultsContainer class when in gaming zone", () => {
        const { container } = renderGamingSearchContainer("Gaming search container 2", 3, mocki18n, false, true);
        const searchResultsContainer = container.querySelector(`.${styles.searchResultsContainer}`);
        expect(searchResultsContainer).not.toBeInTheDocument();
      });

      it("should apply the correct searchResultsContainer class when not in gaming zone", () => {
        const { container } = renderGamingSearchContainer("Gaming search container 3", 3, mocki18n, false, false);
        const searchResultsContainer = container.querySelector(`.${styles.searchResultsContainer}`);
        expect(searchResultsContainer).toBeInTheDocument();
      });
    });

    describe("when number of results is zero and input search text is empty", () => {
      it("should not render the search results, recommended games", () => {
        const { container } = renderGamingSearchContainer("");
        const searchResultsContainer = container.querySelector(SEARCH_RESULTS_CONTAINER);
        const recommendedGamesContainer = container.querySelector(RECOMMENDED_GAMES_CONTAINER);
        expect(searchResultsContainer).toBeNull();
        expect(recommendedGamesContainer).toBeNull();
      });
    });

    describe("when number of results exist and input search text has more than 2 characters", () => {
      it("should render search results and recommended games container", () => {
        const { container } = renderGamingSearchContainer("por", 2);
        const searchResultsContainer = container.querySelector(SEARCH_RESULTS_CONTAINER);
        const recommendedGamesContainer = container.querySelector(RECOMMENDED_GAMES_CONTAINER);
        expect(searchResultsContainer).not.toBeNull();
        expect(recommendedGamesContainer).toBeNull();
      });
    });

    describe("search history pebbles", () => {
      it("should  render the search history pebbles if  history exists", () => {
        getGamingSearchHistory.mockReturnValueOnce(["age", "deal"]);
        const { container } = renderGamingSearchContainer("", 0, mocki18n, false, true, true);
        const searchResultsContainer = container.querySelector(SEARCH_HISTORY);
        expect(searchResultsContainer).not.toBeNull();
        expect(getGamingSearchHistory).toHaveBeenCalled();
      });
      it("should not render the search history pebbles if no history exists", () => {
        getGamingSearchHistory.mockReturnValueOnce([]);
        const { container } = renderGamingSearchContainer("", 0, mocki18n, false, true, true);
        const searchResultsContainer = container.querySelector(SEARCH_HISTORY);
        expect(searchResultsContainer).toBeNull();
      });
      it("should not render the search history pebbles if shouldDisplaySearchHistory is false", () => {
        getGamingSearchHistory.mockReturnValueOnce(["age", "deal"]);
        const { container } = renderGamingSearchContainer("", 0, mocki18n, false, true, false);
        const searchResultsContainer = container.querySelector(SEARCH_HISTORY);
        expect(searchResultsContainer).toBeNull();
      });

      it("should call handlePebbleClick when a pebble is clicked", () => {
        getGamingSearchHistory.mockReturnValueOnce(["deal", "bet"]);
        renderGamingSearchContainer("", 0, mocki18n, false, true, true);

        const { onPebbleClick } = PebbleList.mock.calls[0][0];
        act(() => onPebbleClick("1"));

        expect(callbacks.onChange).toHaveBeenCalledWith("bet");
        expect(callbacks.onSearchHistoryPebbleClick).toHaveBeenCalledWith("bet");
      });
    });
  });

  describe("when results clean is called", () => {
    beforeEach(() => {
      renderGamingSearchContainer();

      const { onClean } = SearchBar.mock.calls[0][0];
      onClean();
    });

    it("should call cleanResults callback", () => {
      expect(callbacks.cleanResults).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handle change is called", () => {
    beforeEach(() => {
      renderGamingSearchContainer();

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
      renderGamingSearchContainer();

      const { onCancel } = SearchBar.mock.calls[0][0];
      act(() => onCancel("searchedTerm"));
    });

    it("should call onCancel callback", () => {
      expect(callbacks.onCancel).toHaveBeenCalledWith("searchedTerm");
    });
  });

  describe("when handle input click is called", () => {
    beforeEach(() => {
      renderGamingSearchContainer();

      const { onInputClick } = SearchBar.mock.calls[0][0];
      act(() => onInputClick());
    });

    it("should call onInputClick callback", () => {
      expect(callbacks.onFocusSearchBar).toHaveBeenCalled();
    });
  });

  describe("when loses focus on input", () => {
    beforeEach(() => {
      renderGamingSearchContainer();

      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => onFocusChange(false));
    });

    it("should not render search result list", () => {
      const { container } = renderGamingSearchContainer();
      const searchResultsContainer = container.querySelector(SEARCH_RESULTS_CONTAINER);
      expect(searchResultsContainer).toBeNull();
    });

    it("should not render recommended games container", () => {
      const { container } = renderGamingSearchContainer();
      const recommendedGamesContainer = container.querySelector(RECOMMENDED_GAMES_CONTAINER);
      expect(recommendedGamesContainer).toBeNull();
    });
  });

  describe("labels", () => {
    it("should render the no results label with the correct text", () => {
      const { container } = renderGamingSearchContainer("foo", 0, {
        i18n: {
          searchPlaceholder: "search",
          cancel: "cancel",
          noResultsLabel: "no results",
        },
      });

      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => onFocusChange(true));

      const noResultsLabel = container.querySelector(NO_RESULTS_LABEL);
      expect(noResultsLabel).toHaveTextContent("no results");
    });

    it("should render the out of ideas label with the correct text", () => {
      const { container } = renderGamingSearchContainer("por", 0, {
        i18n: {
          searchPlaceholder: "search",
          cancel: "cancel",
          outOfIdeasLabel: "out of ideas",
        },
      });
      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => onFocusChange(true));
      const outOfIdeasLabel = container.querySelector(OUT_OF_IDEAS_LABEL);
      expect(outOfIdeasLabel).toHaveTextContent("out of ideas");
    });

    it("should render the number of results label with the correct text", () => {
      renderGamingSearchContainer("por", 2, {
        i18n: {
          searchPlaceholder: "search",
          cancel: "cancel",
          numberOfResultsLabel: "2 results",
        },
      });
      expect(Styled).toHaveBeenCalledWith(
        { translation: "2 results", styles: { highlighted: "typography-h180" } },
        undefined,
      );
    });
  });
});
