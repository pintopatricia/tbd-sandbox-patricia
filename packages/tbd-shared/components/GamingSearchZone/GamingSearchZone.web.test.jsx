import { Suspense } from "react";
import * as React from "react";
import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { SearchBar, Overlay } from "@ppb/the-wall-web";
import { Provider } from "react-redux";
import { GamingSearchContainer } from "./snowflakes/GamingSearchContainer/GamingSearchContainer.web";
import GamingSearchZone from "./GamingSearchZone.web";
import { useScrollForSearchBar } from "../../hooks/useScrollForSearchBar.web";

jest.mock("./snowflakes/GamingSearchContainer/GamingSearchContainer.web", () => ({
  GamingSearchContainer: jest.fn(({ onChange, onCancel, cleanResults }) => (
    <div>
      <input data-testid="search-input" onChange={(e) => onChange(e.target.value)} />
      <button data-testid="cancel-button" onClick={() => onCancel("search term")}>
        Cancel
      </button>
      <button data-testid="clean-button" onClick={() => cleanResults("search term")}>
        Clear
      </button>
    </div>
  )),
}));

jest.mock("@ppb/the-wall-web", () => ({
  SearchBar: jest.fn(() => <div>Mocked SearchBarContainer</div>),
  Overlay: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: ({ name }) => <svg>{name}</svg>,
}));

jest.mock("../../hooks/useScrollForSearchBar.web", () => ({
  useScrollForSearchBar: jest.fn(),
}));

jest.mock("../../hooks/useInfiniteScroll.web", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    scrollViewRef: { current: null },
  })),
}));

jest.mock("react-native", () => ({
  Platform: { OS: "web" },
}));

const fakeStore = {
  getState: () => ({
    layouts: { cardgroups: { gamingcardgroups: [] } },
    entities: { throttles: { PIN_GAMING_SEARCH: { isActive: true } } },
  }),
  subscribe: () => () => {},
  dispatch: jest.fn(),
};

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

const defaultProps = {
  urn: "ppb:tbd:view:browse:gaming",
  recommendedGames: { urn: "ppb:tbd:game:recommended" },
  inputSearchTerm: "search term",
  numberOfResults: 0,
  totalCount: 0,
  isLoadingMore: false,
  shouldHandleOnBlur: false,
  searchPlaceholder: "Search...",
  cancel: "Cancel",
  outOfIdeasLabel: "Out of ideas? Try one of our recommended games:",
  noResultsLabel: "No results found",
  numberOfResultsLabel: "Results",
  results: [],
  pinGamingSearch: true,
  scrollForSearchBar: true,
  useScrollForSearchBar: true,
  dispatchGamingSearchInputChangeAction: jest.fn(),
  dispatchGamingSearchInputChangeClearAction: jest.fn(),
  dispatchGamingSearchBarFocusAction: jest.fn(),
  dispatchGamingSearchCancelAction: jest.fn(),
  dispatchGamingSearchClearResultsAction: jest.fn(),
  dispatchPebbleSearchHistoryClickAction: jest.fn(),
  dispatchFetchMoreGamingSearchResults: jest.fn(),
};

const renderGamingSearchZone = () =>
  render(
    <Provider store={fakeStore}>
      <Suspense fallback={<div>Loading...</div>}>
        <GamingSearchZone {...defaultProps} />
      </Suspense>
    </Provider>,
  );

describe("GamingSearchZone component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 600,
    });
    jest.clearAllMocks();
    useScrollForSearchBar.mockReturnValue(true);
  });

  it("should initialize SearchBarContainer with correct props", () => {
    const setStateMock = jest.fn();
    React.useState.mockImplementation(() => [false, setStateMock]);
    renderGamingSearchZone();

    expect(SearchBar).toHaveBeenCalledWith(
      expect.objectContaining({
        inputSearchTerm: defaultProps.inputSearchTerm,
        onCancel: expect.any(Function),
        onChange: expect.any(Function),
        onClean: expect.any(Function),
        onFocusChange: expect.any(Function),
        onInputClick: expect.any(Function),
        shouldHandleOnBlur: defaultProps.shouldHandleOnBlur,
        isGamingZone: true,
        placeholderLabel: defaultProps.searchPlaceholder,
        cancelLabel: defaultProps.cancel,
      }),
      undefined,
    );
  });

  it("should display SearchBarContainer for desktop", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1100,
    });

    const setStateMock = jest.fn();
    React.useState.mockImplementation(() => [false, setStateMock]);
    renderGamingSearchZone();

    expect(SearchBar).toHaveBeenCalledTimes(1);
  });

  it("should call useScrollForSearchBar with the scrollForSearchBar prop", () => {
    React.useState.mockImplementation(() => [false, jest.fn()]);
    renderGamingSearchZone();
    expect(useScrollForSearchBar).toHaveBeenCalledWith(true);
  });

  it("should display overlay when search bar is focused", () => {
    React.useState.mockImplementation(() => [true, jest.fn()]);
    renderGamingSearchZone();
    expect(Overlay).toHaveBeenCalledTimes(1);
  });

  it("should call dispatchGamingSearchCancelAction when cancel is triggered", () => {
    React.useState.mockImplementation(() => [true, jest.fn()]);
    renderGamingSearchZone();

    expect(GamingSearchContainer).toHaveBeenCalled();
    const { onCancel } = GamingSearchContainer.mock.calls[0][0];
    onCancel("search term");

    expect(defaultProps.dispatchGamingSearchCancelAction).toHaveBeenCalledWith("search term", defaultProps.urn);
  });

  describe("when changing search input", () => {
    it("should call dispatchGamingSearchInputChangeAction with correct input", () => {
      React.useState.mockImplementation(() => [true, jest.fn()]);
      renderGamingSearchZone();

      const { onChange } = GamingSearchContainer.mock.calls[0][0];
      onChange("new search term");

      expect(defaultProps.dispatchGamingSearchInputChangeAction).toHaveBeenCalledWith(
        "new search term",
        defaultProps.urn,
      );
    });

    it("should call dispatchGamingSearchInputChangeClearAction when input length is less than 3", () => {
      React.useState.mockImplementation(() => [true, jest.fn()]);
      renderGamingSearchZone();

      const { onChange } = GamingSearchContainer.mock.calls[0][0];
      onChange("te");

      expect(defaultProps.dispatchGamingSearchInputChangeClearAction).toHaveBeenCalledWith(defaultProps.urn);
    });

    it("should call dispatchPebbleSearchHistoryClickAction when search history pebbles are clicked", () => {
      React.useState.mockImplementation(() => [true, jest.fn()]);
      renderGamingSearchZone();

      const { onSearchHistoryPebbleClick } = GamingSearchContainer.mock.calls[0][0];
      const searchText = "chelsea";
      onSearchHistoryPebbleClick(searchText);

      expect(defaultProps.dispatchPebbleSearchHistoryClickAction).toHaveBeenCalledWith(searchText);
    });

    it("should not call dispatchGamingSearchInputChangeClearAction when input length is 3 or more", () => {
      React.useState.mockImplementation(() => [true, jest.fn()]);
      renderGamingSearchZone();

      const { onChange } = GamingSearchContainer.mock.calls[0][0];
      onChange("text");

      expect(defaultProps.dispatchGamingSearchInputChangeClearAction).not.toHaveBeenCalled();
    });
  });

  it("should call dispatchGamingSearchClearResultsAction when clearing results", () => {
    React.useState.mockImplementation(() => [true, jest.fn()]);
    renderGamingSearchZone();

    const { cleanResults } = GamingSearchContainer.mock.calls[0][0];
    cleanResults("search term");

    expect(defaultProps.dispatchGamingSearchClearResultsAction).toHaveBeenCalledWith("search term", defaultProps.urn);
  });

  describe("Pagination and infinite scroll", () => {
    let useInfiniteScroll;

    beforeEach(() => {
      useInfiniteScroll = require("../../hooks/useInfiniteScroll.web").default;
      useInfiniteScroll.mockReturnValue({
        scrollViewRef: { current: null },
      });
    });

    it("should call useInfiniteScroll hook with fetchMoreSearchResults callback", () => {
      React.useState.mockImplementation(() => [true, jest.fn()]);
      renderGamingSearchZone();

      expect(useInfiniteScroll).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should call dispatchFetchMoreGamingSearchResults when fetchMoreSearchResults is triggered", () => {
      React.useState.mockImplementation(() => [true, jest.fn()]);
      renderGamingSearchZone();

      const fetchMoreCallback = useInfiniteScroll.mock.calls[0][0];

      fetchMoreCallback();

      expect(defaultProps.dispatchFetchMoreGamingSearchResults).toHaveBeenCalledWith(defaultProps.urn);
    });

    it("should not call dispatchFetchMoreGamingSearchResults when isLoadingMore is true", () => {
      const propsWithLoading = {
        ...defaultProps,
        isLoadingMore: true,
      };

      React.useState.mockImplementation(() => [true, jest.fn()]);
      render(
        <Provider store={fakeStore}>
          <Suspense fallback={<div>Loading...</div>}>
            <GamingSearchZone {...propsWithLoading} />
          </Suspense>
        </Provider>,
      );

      const fetchMoreCallback = useInfiniteScroll.mock.calls[0][0];

      fetchMoreCallback();

      expect(propsWithLoading.dispatchFetchMoreGamingSearchResults).not.toHaveBeenCalled();
    });

    it("should pass scrollViewRef to renderContainers when there are results", () => {
      const mockScrollViewRef = { current: document.createElement("div") };
      useInfiniteScroll.mockReturnValue({
        scrollViewRef: mockScrollViewRef,
      });

      const propsWithResults = {
        ...defaultProps,
        results: [{ urn: "game1" }, { urn: "game2" }],
        numberOfResults: 2,
      };

      React.useState.mockImplementation(() => [true, jest.fn()]);
      render(
        <Provider store={fakeStore}>
          <Suspense fallback={<div>Loading...</div>}>
            <GamingSearchZone {...propsWithResults} />
          </Suspense>
        </Provider>,
      );

      expect(GamingSearchContainer).toHaveBeenCalled();
    });

    it("should render with isLoadingMore state", () => {
      const propsWithLoading = {
        ...defaultProps,
        results: [{ urn: "game1" }, { urn: "game2" }],
        numberOfResults: 2,
        isLoadingMore: true,
      };

      React.useState.mockImplementation(() => [true, jest.fn()]);
      render(
        <Provider store={fakeStore}>
          <Suspense fallback={<div>Loading...</div>}>
            <GamingSearchZone {...propsWithLoading} />
          </Suspense>
        </Provider>,
      );

      expect(GamingSearchContainer).toHaveBeenCalled();
    });

    it("should render without loading state when isLoadingMore is false", () => {
      const propsWithoutLoading = {
        ...defaultProps,
        results: [{ urn: "game1" }, { urn: "game2" }],
        numberOfResults: 2,
        isLoadingMore: false,
      };

      React.useState.mockImplementation(() => [true, jest.fn()]);
      render(
        <Provider store={fakeStore}>
          <Suspense fallback={<div>Loading...</div>}>
            <GamingSearchZone {...propsWithoutLoading} />
          </Suspense>
        </Provider>,
      );

      expect(GamingSearchContainer).toHaveBeenCalled();
    });

    it("should render component with totalCount prop", () => {
      const propsWithTotalCount = {
        ...defaultProps,
        totalCount: 100,
        numberOfResults: 10,
        results: Array(10).fill({ urn: "game" }),
      };

      React.useState.mockImplementation(() => [true, jest.fn()]);
      render(
        <Provider store={fakeStore}>
          <Suspense fallback={<div>Loading...</div>}>
            <GamingSearchZone {...propsWithTotalCount} />
          </Suspense>
        </Provider>,
      );

      const containerProps = GamingSearchContainer.mock.calls[0][0];
      expect(containerProps.numberOfResults).toBe(10);
    });
  });
});
