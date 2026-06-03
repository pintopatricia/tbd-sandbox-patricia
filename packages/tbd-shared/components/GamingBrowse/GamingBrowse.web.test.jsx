import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { codecs } from "@ppb/tbd-urn-codecs";
import GamingBrowse from "./GamingBrowse.web";
import { GamingSearchContainer } from "../GamingSearchZone/snowflakes/GamingSearchContainer/GamingSearchContainer.web";

jest.mock("../GamingSearchZone/snowflakes/GamingSearchContainer/GamingSearchContainer.web", () => ({
  GamingSearchContainer: jest.fn(() => <gaming-search-container-mock />),
}));
jest.mock("../GamesCardGroup/snowflakes/GameTileContainer/GameTileContainer.web", () => ({
  GameTileContainer: jest.fn((props) => <game-tile-container-mock {...props} />),
}));

jest.mock("./DefaultGamingBrowse/DefaultGamingBrowse.web", () =>
  jest.fn((props) => <default-gaming-browse {...props} />),
);
jest.mock("../GameCard/GameCard.web", () => jest.fn((props) => <connected-game-card-mock {...props} />));
jest.mock("../GamesCardGroup/GamesCardGroup.web", () => jest.fn((props) => <game-card-mock {...props} />));
jest.mock("../GamingCardGroup", () => jest.fn((props) => <connected-card-group-mock {...props} />));
jest.mock("../GamingCardGroup/GamingCardGroup.web", () => jest.fn((props) => <card-group-mock {...props} />));

jest.mock("../../config/endpoints", () => ({
  ENDPOINTS: {
    GAME_LAUNCHER: "http://localhost/betting/launcher/",
  },
}));

const defaultContainersMock = {
  urn: codecs.card.gaming.game.encode("1"),
  typename: "ViewZone1",
};
const recommendedGamesMock = {
  urn: codecs.card.gaming.game.encode("2"),
  typename: "ViewZone2",
};

const mockOneSearchResult = [
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
];

const mockSearchResults = [mockOneSearchResult[0], mockOneSearchResult[0]];

function renderGamingBrowse(propsOverrides) {
  const props = {
    urn: "ppb:tbd:view:browse:gaming",
    query: "som",
    shouldHandleOnBlur: false,
    searchPlaceholder: "I18N.SEARCH.INPUT_PLACEHOLDER",
    cancel: "I18N.SEARCH.CANCEL",
    outOfIdeasLabel: "Out of ideas? Try one of our recommended games:",
    noResultsLabel: "I18N.SEARCH.YOUR_SEARCH",
    numberOfResultsLabel: "I18N.SEARCH.RESULTS",
    inputSearchTerm: "search term",
    defaultContainers: defaultContainersMock,
    recommendedGames: recommendedGamesMock,
    results: [],
    numberOfResults: 0,
    dispatchSearchInputChangeAction: jest.fn(),
    dispatchSearchInputChangeClearAction: jest.fn(),
    dispatchSearchClearResultsAction: jest.fn(),
    dispatchSearchCancelAction: jest.fn(),
    dispatchSearchBarFocusAction: jest.fn(),
    ...propsOverrides,
  };

  const { rerender } = render(<GamingBrowse {...props} />);
  return { rerender };
}

describe("GamingBrowse component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should initialize GamingSearchContainer component with the correct props", () => {
      renderGamingBrowse();

      expect(GamingSearchContainer).toHaveBeenCalledTimes(1);
      expect(GamingSearchContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          cleanResults: expect.any(Function),
          containers: expect.objectContaining({
            default: expect.anything(),
            recommendedGames: expect.anything(),
            searchResults: null,
          }),
          inputSearchTerm: "search term",
          numberOfResults: 0,
          onCancel: expect.any(Function),
          onChange: expect.any(Function),
          onFocusSearchBar: expect.any(Function),
          shouldHandleOnBlur: false,
          translations: expect.objectContaining({
            i18n: expect.objectContaining({
              cancel: expect.any(String),
              noResultsLabel: expect.any(String),
              numberOfResultsLabel: expect.any(String),
              outOfIdeasLabel: expect.any(String),
              searchPlaceholder: expect.any(String),
            }),
          }),
        }),
        undefined,
      );
    });
  });

  describe("when initializing the component with results", () => {
    it("should initialize GamingSearchContainer component with the correct props for one result", () => {
      renderGamingBrowse({
        results: mockOneSearchResult,
        numberOfResults: 1,
      });

      expect(GamingSearchContainer).toHaveBeenCalledTimes(1);
      expect(GamingSearchContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOfResults: 1,
          containers: expect.objectContaining({
            default: expect.anything(),
            recommendedGames: expect.anything(),
            searchResults: expect.anything(),
          }),
        }),
        undefined,
      );
    });

    it("should initialize GamingSearchContainer component with the correct props for multiple results", () => {
      renderGamingBrowse({
        results: mockSearchResults,
        numberOfResults: 2,
      });

      expect(GamingSearchContainer).toHaveBeenCalledTimes(1);
      expect(GamingSearchContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          numberOfResults: 2,
          containers: expect.objectContaining({
            default: expect.anything(),
            recommendedGames: expect.anything(),
            searchResults: expect.anything(),
          }),
        }),
        undefined,
      );
    });
  });

  describe("when search bar is focused", () => {
    it("should dispatch UI__SEARCH_BAR_FOCUS action", () => {
      const spy = jest.fn();
      renderGamingBrowse({ dispatchSearchBarFocusAction: spy });
      const { onFocusSearchBar } = GamingSearchContainer.mock.calls[0][0];
      onFocusSearchBar();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("when cancel is called", () => {
    it("should dispatch UI__SEARCH_CANCEL_CLICK action", () => {
      const spy = jest.fn();
      renderGamingBrowse({ dispatchSearchCancelAction: spy });
      const { onCancel } = GamingSearchContainer.mock.calls[0][0];
      onCancel("searchTerm");
      expect(spy).toHaveBeenCalledWith("searchTerm", "ppb:tbd:view:browse:gaming");
    });
  });

  describe("when search changes", () => {
    describe("and text has 3 or more chars", () => {
      it("should dispatch UI__SEARCH_INPUT_CHANGE action", () => {
        const spy = jest.fn();
        renderGamingBrowse({ dispatchSearchInputChangeAction: spy });
        const { onChange } = GamingSearchContainer.mock.calls[0][0];
        onChange("text");
        expect(spy).toHaveBeenCalledWith("text", "ppb:tbd:view:browse:gaming");
      });

      it("should not dispatch UI__SEARCH_INPUT_CHANGE_CLEAR action", () => {
        const spy = jest.fn();
        renderGamingBrowse({ dispatchSearchInputChangeClearAction: spy });
        const { onChange } = GamingSearchContainer.mock.calls[0][0];
        onChange("text");
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("and text has 2 or less chars", () => {
      it("should dispatch UI__SEARCH_INPUT_CHANGE action", () => {
        const spy = jest.fn();
        renderGamingBrowse({ dispatchSearchInputChangeAction: spy });
        const { onChange } = GamingSearchContainer.mock.calls[0][0];
        onChange("te");
        expect(spy).toHaveBeenCalledWith("te", "ppb:tbd:view:browse:gaming");
      });

      it("should dispatch UI__SEARCH_INPUT_CHANGE_CLEAR action", () => {
        const spy = jest.fn();
        renderGamingBrowse({ dispatchSearchInputChangeClearAction: spy });
        const { onChange } = GamingSearchContainer.mock.calls[0][0];
        onChange("te");
        expect(spy).toHaveBeenCalled();
      });
    });

    describe("when clean results is called", () => {
      it("should dispatch UI__CLEAR_SEARCH_RESULTS action", () => {
        const spy = jest.fn();
        renderGamingBrowse({ dispatchSearchClearResultsAction: spy });
        const { cleanResults } = GamingSearchContainer.mock.calls[0][0];
        cleanResults("");
        expect(spy).toHaveBeenCalledWith("", "ppb:tbd:view:browse:gaming");
      });
    });
  });
});
