import { Styled } from "@ppb/the-wall-native";
import { View, Text } from "react-native";
import { render, act, fireEvent } from "@testing-library/react-native";
import { SearchBar } from "@ppb/the-wall-native/components/SearchBar/SearchBar";
import { typography } from "@ppb/the-wall-common/base-theme";
import { GamingSearchContainer } from "./GamingSearchContainer.native";
import {
  GAMING_SEARCH_CONTAINER,
  SEARCH_RESULTS_CONTAINER,
  RECOMMENDED_GAMES_CONTAINER,
  NO_RESULTS_TEXT,
  NUMBER_OF_RESULTS_TEXT,
  OUT_OF_IDEAS_TEXT,
  SEARCH_HISTORY_CONTAINER,
  PRESSABLE_CONTAINER,
} from "./GamingSearchContainer.native.selectors";

jest.mock("@ppb/the-wall-native/components/SearchBar/SearchBar", () => ({
  SearchBar: jest.fn(() => <search-bar-mock />),
}));
jest.mock("@ppb/the-wall-native", () => ({
  Styled: jest.fn((props) => <styled-title {...props} />),
  Text: jest.requireActual("react-native").Text,
  PebbleList: jest.fn((props) => <pebble-list-mock {...props} />),
}));

jest.mock("../../../../helpers/search-history-helper.native", () => ({
  getGamingSearchHistory: jest.fn(() => ["age", "bonanza"]),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useIsFocused: jest.fn(),
  useFocusEffect: (callback) => {
    const React = require("react");
    React.useEffect(callback, []);
  },
}));

jest.mock("@ppb/the-wall-native/helpers/ScrollContext", () => ({
  useScrollOffsetContext: () => 0,
}));

jest.mock("@gorhom/portal", () => ({
  Portal: ({ children }) => children,
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
    searchHistoryLabel: "search history",
  },
};

const containersMock = {
  default: (
    <View>
      <Text>default view</Text>
    </View>
  ),
  recommendedGames: (
    <View>
      <Text>recommended games view</Text>
    </View>
  ),
  searchResults: (
    <View>
      <Text>search results view</Text>
    </View>
  ),
};

const defaultProps = {
  containers: containersMock,
  translations: mocki18n,
  inputSearchTerm: "",
  numberOfResults: undefined,
  onCancel: callbacks.onCancel,
  onChange: callbacks.onChange,
  onFocusSearchBar: callbacks.onFocusSearchBar,
  cleanResults: callbacks.cleanResults,
  shouldHandleOnBlur: false,
  shouldDisplaySearchHistory: false,
  onSearchHistoryPebbleClick: callbacks.onSearchHistoryPebbleClick,
  pinGamingSearch: true,
};

function renderGamingSearchContainer(props) {
  return render(<GamingSearchContainer {...props} />);
}

function getGamingSearchView(props) {
  const { queryByTestId } = renderGamingSearchContainer(props);
  return queryByTestId(GAMING_SEARCH_CONTAINER);
}

function getSearchResultsView(props) {
  const { queryByTestId } = renderGamingSearchContainer(props);
  return queryByTestId(SEARCH_RESULTS_CONTAINER);
}
function getRecommendedGamesView(props) {
  const { queryByTestId } = renderGamingSearchContainer(props);
  return queryByTestId(RECOMMENDED_GAMES_CONTAINER);
}

function getNumberOfResultsText(props) {
  const { queryByTestId } = renderGamingSearchContainer(props);
  return queryByTestId(NUMBER_OF_RESULTS_TEXT);
}

describe("GamingSearchContainer", () => {
  jest.useFakeTimers();
  beforeEach(jest.clearAllMocks);
  describe("searchbar, search results, default container and recommended games container", () => {
    it("should render the search bar", () => {
      renderGamingSearchContainer(defaultProps);

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
          shouldHandleOnBlur: false,
        },
        undefined,
      );
    });
    describe("when number of results is zero and input search text is empty", () => {
      it("should not render the search results, recommended games", () => {
        const searchResultsView = getSearchResultsView(defaultProps);
        const recommendedGamesView = getRecommendedGamesView(defaultProps);

        expect(searchResultsView).toBeNull();
        expect(recommendedGamesView).toBeNull();
      });
    });

    describe("when number of results exist and input search text has more than 2 characters", () => {
      it("should not render the default view, but render search results and recommended games container", async () => {
        const { queryByTestId } = renderGamingSearchContainer({
          ...defaultProps,
          inputSearchTerm: "asd",
          numberOfResults: 2,
        });

        const pressable = queryByTestId(PRESSABLE_CONTAINER);
        await act(async () => {
          fireEvent.press(pressable);
        });

        const searchResultsView = queryByTestId(SEARCH_RESULTS_CONTAINER);

        const recommendedGamesView = getRecommendedGamesView(defaultProps);

        expect(searchResultsView).not.toBeNull();
        expect(recommendedGamesView).toBeNull();
      });
    });
  });

  describe("when results clean is called", () => {
    beforeEach(() => {
      renderGamingSearchContainer(defaultProps);

      const { onClean } = SearchBar.mock.calls[0][0];
      onClean();
    });

    it("should call cleanResults callback", () => {
      expect(callbacks.cleanResults).toHaveBeenCalledTimes(1);
    });
  });

  describe("when handle change is called", () => {
    beforeEach(() => {
      renderGamingSearchContainer(defaultProps);

      const { onChange } = SearchBar.mock.calls[0][0];
      act(() => onChange("test"));
    });

    it("should call onChange callback", () => {
      expect(callbacks.onChange).toHaveBeenCalledTimes(1);
      expect(callbacks.onChange).toHaveBeenCalledWith("test");
    });
  });

  describe("when handle cancel is called", () => {
    beforeEach(() => {
      renderGamingSearchContainer(defaultProps);

      const { onCancel } = SearchBar.mock.calls[0][0];
      act(() => onCancel("searchedTerm"));
    });

    it("should call onCancel callback", () => {
      expect(callbacks.onCancel).toHaveBeenCalledWith("searchedTerm");
    });
  });

  describe("when handle input click is called", () => {
    beforeEach(() => {
      renderGamingSearchContainer(defaultProps);

      const { onInputClick } = SearchBar.mock.calls[0][0];
      act(() => onInputClick());
    });

    it("should call onInputClick callback", () => {
      expect(callbacks.onFocusSearchBar).toHaveBeenCalled();
    });
  });

  describe("when loses focus on input", () => {
    beforeEach(() => {
      renderGamingSearchContainer(defaultProps);

      const { onFocusChange } = SearchBar.mock.calls[0][0];
      act(() => onFocusChange(false));
    });

    it("should render default content", () => {
      const gamingSearchView = getGamingSearchView(defaultProps);
      expect(gamingSearchView).not.toBeNull();
    });

    it("should not render search result list", () => {
      const searchResultsView = getSearchResultsView(defaultProps);
      expect(searchResultsView).toBeNull();
    });

    it("should not render recommended games container", () => {
      const recommendedGamesView = getRecommendedGamesView(defaultProps);
      expect(recommendedGamesView).toBeNull();
    });
  });

  describe("labels", () => {
    it("should render the no results label with the correct text", async () => {
      const { queryByTestId } = renderGamingSearchContainer({
        ...defaultProps,
        inputSearchTerm: "asd",
        numberOfResults: 0,
        translations: {
          i18n: {
            searchPlaceholder: "search",
            cancel: "cancel",
            noResultsLabel: "no results",
          },
        },
      });

      const pressable = queryByTestId(PRESSABLE_CONTAINER);
      await act(async () => {
        fireEvent.press(pressable);
      });

      const noResultsText = queryByTestId(NO_RESULTS_TEXT);
      expect(noResultsText).toHaveTextContent("no results");
    });

    it("should render the out of ideas label with the correct text", async () => {
      const { queryByTestId } = renderGamingSearchContainer({
        ...defaultProps,
        inputSearchTerm: "asd",
        numberOfResults: 0,
        translations: {
          i18n: {
            searchPlaceholder: "search",
            cancel: "cancel",
            outOfIdeasLabel: "out of ideas",
          },
        },
      });
      const { onFocusChange } = SearchBar.mock.calls[0][0];
      await act(() => onFocusChange(true));
      const outOfIdeasText = queryByTestId(OUT_OF_IDEAS_TEXT);
      expect(outOfIdeasText).toHaveTextContent("out of ideas");
    });

    it("should render the number of results label with the correct text", async () => {
      getNumberOfResultsText({
        ...defaultProps,
        inputSearchTerm: "asd",
        numberOfResults: 2,
        translations: {
          i18n: {
            searchPlaceholder: "search",
            cancel: "cancel",
            numberOfResultsLabel: "2 results",
          },
        },
      });
      const { onFocusChange } = SearchBar.mock.calls[0][0];
      await act(() => onFocusChange(true));

      expect(Styled).toHaveBeenCalledWith(
        { styles: { highlighted: typography["typography-h280"] }, translation: "2 results" },
        undefined,
      );
    });
  });

  describe("pebbles", () => {
    it("should render the search history pebbles if search bar is focused and shouldDisplaySearchHistory prop is true", async () => {
      const { queryByTestId } = renderGamingSearchContainer({ ...defaultProps, shouldDisplaySearchHistory: true });
      const { onFocusChange } = SearchBar.mock.calls[0][0];
      await act(() => onFocusChange(true));
      const searchHistoryView = queryByTestId(SEARCH_HISTORY_CONTAINER);

      expect(searchHistoryView).not.toBeNull();
    });

    it("should not render the history pebbles if search bar is not focused and shouldDisplaySearchHistory prop is true", async () => {
      const { queryByTestId } = renderGamingSearchContainer({ ...defaultProps, shouldDisplaySearchHistory: true });
      const { onFocusChange } = SearchBar.mock.calls[0][0];
      await act(() => onFocusChange(false));
      const searchHistoryView = queryByTestId(SEARCH_HISTORY_CONTAINER);

      expect(searchHistoryView).toBeNull();
    });

    it("should not render the history pebbles if shouldDisplaySearchHistory prop is false", async () => {
      const { queryByTestId } = renderGamingSearchContainer({ ...defaultProps, shouldDisplaySearchHistory: false });
      const searchHistoryView = queryByTestId(SEARCH_HISTORY_CONTAINER);

      expect(searchHistoryView).toBeNull();
    });
  });
});
