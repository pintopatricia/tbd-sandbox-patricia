import { FlatList } from "react-native";
import { render, act } from "@testing-library/react-native";
import { SearchBar } from "@ppb/the-wall-native/components/SearchBar/SearchBar";
import { codecs } from "@ppb/tbd-urn-codecs";
import GamingBrowse from "./GamingBrowse.native";
import selectors from "./GamingBrowse.native.selectors";

import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";
import ConnectedDefaultGamingBrowse from "./DefaultGamingBrowse";
import DefaultGamingBrowse from "./DefaultGamingBrowse/DefaultGamingBrowse.native";

jest.useFakeTimers();

jest.mock("@ppb/tbd-store/state/layout/views/browse-view/BrowseInterface.types", () => ({
  GameSearchResultItem: { name: "", type: "", urn: "" },
  SearchResultItemType: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  withStyle: jest.fn(() => "some-placeholder"),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-native/components/SearchBar/SearchBar", () => ({
  SearchBar: jest.fn(() => <search-bar-mock></search-bar-mock>),
}));

jest.mock("../GamingCardGroup/", () => jest.fn(() => <connected-card-group-mock />));
jest.mock("../GamingCardGroup/GamingCardGroup.native", () => jest.fn(() => <card-group-mock />));
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native", () =>
  jest.fn(() => <swimlane-card-group-placeholder-mock />),
);

jest.mock("../GameCard/", () => jest.fn(() => <connected-game-card-mock />));
jest.mock("../GameCard/GameCard.native", () => jest.fn(() => <game-card-mock />));
jest.mock("../GameCard/GameCardPlaceholder.native", () => jest.fn(() => <game-card-placeholder-mock />));

jest.mock("./DefaultGamingBrowse/", () => jest.fn(() => <connected-default-gaming-browse-mock />));
jest.mock("./DefaultGamingBrowse/DefaultGamingBrowse.native", () => jest.fn(() => <default-gaming-browse-mock />));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native/helpers/flatlist-props", () => ({
  FLAT_LIST_DEFAULTS: {
    initialNumToRender: undefined,
    windowSize: undefined,
    maxToRenderPerBatch: undefined,
    removeClippedSubviews: undefined,
  },
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const defaultContainersMock = {
  urn: codecs.card.gaming.game.encode("1"),
  typename: "ViewZone1",
};
const recommendedGamesMock = {
  urn: codecs.card.gaming.game.encode("2"),
  typename: "ViewZone2",
};

const mockOneSearchResult = [{ urn: "ppb:tbd:card:game:game1" }];
const mockSearchResults = [
  { urn: "ppb:tbd:card:game:game1" },
  { urn: "ppb:tbd:card:game:game2" },
  { urn: "ppb:tbd:card:game:game3" },
  { urn: "ppb:tbd:card:game:game4" },
];

const dispatchFetchMoreSearchResultsSpy = jest.fn();
const dispatchSearchBarFocusActionSpy = jest.fn();

function renderGamingBrowse({
  urn = "ppb:tbd:view:browse:gaming",
  inputSearchTerm,
  numberOfResults = 0,
  shouldHandleOnBlur = false,
  searchPlaceholder = "I18N.SEARCH.INPUT_PLACEHOLDER",
  cancel = "I18N.SEARCH.CANCEL",
  outOfIdeasLabel = "Out of ideas? Try one of our recommended games:",
  noResultsLabel = "I18N.SEARCH.YOUR_SEARCH",
  numberOfResultsLabel = "I18N.SEARCH.RESULTS",
  defaultContainers = defaultContainersMock,
  recommendedGames = recommendedGamesMock,
  results,
  dispatchSearchInputChangeAction = jest.fn(),
  dispatchSearchInputChangeClearAction = jest.fn(),
  dispatchSearchClearResultsAction = jest.fn(),
  dispatchSearchCancelAction = jest.fn(),
  dispatchSearchBarFocusAction = dispatchSearchBarFocusActionSpy,
  dispatchFetchMoreSearchResults = dispatchFetchMoreSearchResultsSpy,
}) {
  return render(
    <GamingBrowse
      urn={urn}
      inputSearchTerm={inputSearchTerm}
      numberOfResults={numberOfResults}
      shouldHandleOnBlur={shouldHandleOnBlur}
      searchPlaceholder={searchPlaceholder}
      cancel={cancel}
      outOfIdeasLabel={outOfIdeasLabel}
      noResultsLabel={noResultsLabel}
      numberOfResultsLabel={numberOfResultsLabel}
      defaultContainers={defaultContainers}
      recommendedGames={recommendedGames}
      results={results}
      dispatchSearchInputChangeAction={dispatchSearchInputChangeAction}
      dispatchSearchInputChangeClearAction={dispatchSearchInputChangeClearAction}
      dispatchSearchClearResultsAction={dispatchSearchClearResultsAction}
      dispatchSearchCancelAction={dispatchSearchCancelAction}
      dispatchSearchBarFocusAction={dispatchSearchBarFocusAction}
      dispatchFetchMoreSearchResults={dispatchFetchMoreSearchResults}
    />,
  );
}

describe("GamingBrowse component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component without results", () => {
    it("should initialize SearchBar and ConnectedCard components with the correct props", () => {
      renderGamingBrowse({
        results: [],
        numberOfResults: 0,
        inputSearchTerm: "",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });

      expect(SearchBar).toHaveBeenCalledTimes(1);
      expect(SearchBar).toHaveBeenCalledWith(
        {
          placeholderLabel: "I18N.SEARCH.INPUT_PLACEHOLDER",
          cancelLabel: "I18N.SEARCH.CANCEL",
          inputSearchTerm: "",
          onCancel: expect.any(Function),
          onChange: expect.any(Function),
          onClean: expect.any(Function),
          onFocusChange: expect.any(Function),
          onInputClick: expect.any(Function),
          shouldHandleOnBlur: false,
        },
        undefined,
      );

      expect(ConnectedDefaultGamingBrowse).toHaveBeenCalledTimes(1);
      expect(ConnectedDefaultGamingBrowse).toHaveBeenCalledWith(
        {
          urn: defaultContainersMock.urn,
          component: DefaultGamingBrowse,
          typename: defaultContainersMock.typename,
        },
        undefined,
      );
    });
    it("should not show Out of Idea label", () => {
      const { queryByTestId } = renderGamingBrowse({
        results: [],
        numberOfResults: 0,
        inputSearchTerm: "",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });

      const outOfIdeasLabel = queryByTestId(selectors.OUT_OF_IDEAS_LABEL);
      expect(outOfIdeasLabel).toBeNull();
    });
    it("should not show No Results label", () => {
      const { queryByTestId } = renderGamingBrowse({
        results: [],
        numberOfResults: 0,
        inputSearchTerm: "",
        noResultsLabel: null,
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });

      const noResultsLabel = queryByTestId(selectors.NO_RESULTS_LABEL);
      expect(noResultsLabel).toBeNull();
    });

    it("should not trigger the 'dispatchFetchMoreSearchResultsSpy'", () => {
      renderGamingBrowse({
        results: [],
        numberOfResults: 0,
        inputSearchTerm: "",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });
      expect(dispatchFetchMoreSearchResultsSpy).not.toHaveBeenCalled();
    });
  });

  describe("when initializing the component with results", () => {
    it("should initialize GamingSearchContainer component with the correct props for one result", () => {
      const { getAllByTestId } = renderGamingBrowse({
        results: mockOneSearchResult,
        numberOfResults: 1,
        inputSearchTerm: "one",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });

      const items = getAllByTestId(selectors.RESULT_ITEM);

      expect(ConnectedDefaultGamingBrowse).not.toHaveBeenCalled();

      expect(items).toHaveLength(2);
      expect(ConnectedGameCard).toHaveBeenCalledTimes(1);
      expect(ConnectedGameCard).toHaveBeenCalledWith(
        {
          urn: mockOneSearchResult[0].urn,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });
    it("should initialize GamingSearchContainer component with the correct props for multiple results", () => {
      const { getAllByTestId } = renderGamingBrowse({
        results: mockSearchResults,
        numberOfResults: 2,
        inputSearchTerm: "four",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });

      const items = getAllByTestId(selectors.RESULT_ITEM);

      expect(ConnectedDefaultGamingBrowse).not.toHaveBeenCalled();

      expect(items).toHaveLength(4);
      expect(ConnectedGameCard).toHaveBeenCalledTimes(4);
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: mockSearchResults[0].urn,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: mockSearchResults[1].urn,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });
    it("should render the results within a container with keyboardShouldPersistTaps attribute equal to 'handled'", () => {
      const { queryByTestId } = renderGamingBrowse({
        results: mockSearchResults,
        numberOfResults: 2,
        inputSearchTerm: "four",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });
      const itemsContainer = queryByTestId(selectors.GAMING_BROWSE_SEARCH_RESULTS);
      expect(itemsContainer.props.keyboardShouldPersistTaps).toEqual("handled");
    });

    describe("and when onEndReached is triggered", () => {
      it("should trigger the 'dispatchFetchMoreSearchResultsSpy'", () => {
        const { UNSAFE_getByType } = renderGamingBrowse({
          results: mockSearchResults,
          numberOfResults: 2,
          inputSearchTerm: "four",
          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
        });

        const flatList = UNSAFE_getByType(FlatList);
        flatList.props.onEndReached();

        expect(dispatchFetchMoreSearchResultsSpy).toHaveBeenCalledWith("ppb:tbd:view:browse:gaming");
      });
    });

    describe("when handle input click is called", () => {
      it("should trigger the 'dispatchSearchBarFocusActionSpy'", () => {
        renderGamingBrowse({
          results: mockSearchResults,
          numberOfResults: 2,
          inputSearchTerm: "four",
          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
        });

        const { onInputClick } = SearchBar.mock.calls[0][0];
        act(() => onInputClick());

        expect(dispatchSearchBarFocusActionSpy).toHaveBeenCalled();
      });
    });
  });

  describe("when cancel is called", () => {
    it("should dispatch UI__SEARCH_CANCEL_CLICK action", () => {
      const spySearchCancelAction = jest.fn();
      renderGamingBrowse({
        results: [],
        numberOfResults: 0,
        inputSearchTerm: "search keyword",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
        dispatchSearchCancelAction: spySearchCancelAction,
      });
      const { onCancel } = SearchBar.mock.calls[0][0];
      act(() => onCancel("searchTerm"));
      expect(spySearchCancelAction).toHaveBeenCalledWith("searchTerm", "ppb:tbd:view:browse:gaming");
    });

    it("should re-render SearchBar with empty inputSearchTerm after cancel", () => {
      renderGamingBrowse({
        results: [],
        numberOfResults: 0,
        inputSearchTerm: "search keyword",
        defaultContainers: defaultContainersMock,
        recommendedGames: recommendedGamesMock,
      });
      const { onCancel } = SearchBar.mock.calls[0][0];
      act(() => onCancel("search keyword"));

      const lastCall = SearchBar.mock.calls[SearchBar.mock.calls.length - 1][0];
      expect(lastCall.inputSearchTerm).toBe("");
    });
  });

  describe("when search changes", () => {
    describe("and text has 3 or more chars", () => {
      it("should dispatch UI__SEARCH_INPUT_CHANGE action", () => {
        const spySearchInputChangeAction = jest.fn();
        renderGamingBrowse({
          results: [],
          numberOfResults: 0,
          inputSearchTerm: "search term",

          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
          dispatchSearchInputChangeAction: spySearchInputChangeAction,
        });

        act(() => {
          const { onChange } = SearchBar.mock.calls[0][0];
          onChange("text");
        });
        expect(spySearchInputChangeAction).toHaveBeenCalledWith("text", "ppb:tbd:view:browse:gaming");
      });

      it("should re-render SearchBar with updated inputSearchTerm after onChange", () => {
        renderGamingBrowse({
          results: [],
          numberOfResults: 0,
          inputSearchTerm: "",
          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
        });

        act(() => {
          const { onChange } = SearchBar.mock.calls[0][0];
          onChange("football");
        });
        jest.runAllTimers();

        const lastCall = SearchBar.mock.calls[SearchBar.mock.calls.length - 1][0];
        expect(lastCall.inputSearchTerm).toBe("football");
      });
      it("should dispatch UI__CLEAR_SEARCH_RESULTS action", () => {
        const spySearchInputChangeClearAction = jest.fn();
        renderGamingBrowse({
          results: [],
          numberOfResults: 0,
          inputSearchTerm: "search term",

          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
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
        renderGamingBrowse({
          results: [],
          numberOfResults: 0,
          inputSearchTerm: "search term",

          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
          dispatchSearchInputChangeAction: spySearchInputChangeAction,
        });
        act(() => {
          const { onChange } = SearchBar.mock.calls[0][0];
          onChange("te");
        });
        expect(spySearchInputChangeAction).toHaveBeenCalledWith("te", "ppb:tbd:view:browse:gaming");
      });
      it("should dispatch UI__SEARCH_INPUT_CHANGE_CLEAR action", () => {
        const spySearchInputChangeClearAction = jest.fn();
        renderGamingBrowse({
          results: [],
          numberOfResults: 0,
          inputSearchTerm: "search term",

          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
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
        renderGamingBrowse({
          results: [],
          numberOfResults: 0,
          inputSearchTerm: "search term",

          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
          dispatchSearchClearResultsAction: spySearchClearResultsAction,
        });
        const { onClean } = SearchBar.mock.calls[0][0];
        act(() => onClean(""));
        expect(spySearchClearResultsAction).toHaveBeenCalledWith("", "ppb:tbd:view:browse:gaming");
      });

      it("should re-render SearchBar with empty inputSearchTerm after clean", () => {
        renderGamingBrowse({
          results: [],
          numberOfResults: 0,
          inputSearchTerm: "search term",
          defaultContainers: defaultContainersMock,
          recommendedGames: recommendedGamesMock,
        });
        const { onClean } = SearchBar.mock.calls[0][0];
        act(() => onClean(""));

        const lastCall = SearchBar.mock.calls[SearchBar.mock.calls.length - 1][0];
        expect(lastCall.inputSearchTerm).toBe("");
      });
    });
  });
});
