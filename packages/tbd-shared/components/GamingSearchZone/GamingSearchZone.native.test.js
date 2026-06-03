import { render } from "@testing-library/react-native";
import { GamingSearchContainer } from "./snowflakes/GamingSearchContainer/GamingSearchContainer.native";
import GamingSearchZone from "./GamingSearchZone.native";

jest.mock("./snowflakes/GamingSearchContainer/GamingSearchContainer.native", () => ({
  GamingSearchContainer: jest.fn(() => <mocked-search-view />),
}));
jest.mock("../GamingCardGroup/", () => jest.fn(() => <connected-card-group-mock />));
jest.mock("../GamingCardGroup/GamingCardGroup.native", () => jest.fn(() => <card-group-mock />));
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native", () =>
  jest.fn(() => <swimlane-card-group-placeholder-mock />),
);

jest.mock("../GameCard/", () => jest.fn(() => <connected-game-card-mock />));
jest.mock("../GameCard/GameCard.native", () => jest.fn(() => <game-card-mock />));
jest.mock("../GameCard/GameCardPlaceholder.native", () => jest.fn(() => <game-card-placeholder-mock />));
jest.mock("../CardGroup/CardGroupPlaceholders.native", () => jest.fn(() => <default-placeholder-mock />));

jest.mock("../FlatList.native", () => ({
  FlatList: jest.fn(() => <flatlist-mock />),
}));

const defaultProps = {
  urn: "ppb:tbd:view:browse:gaming",
  recommendedGames: { urn: "ppb:tbd:game:recommended" },
  inputSearchTerm: "search term",
  numberOfResults: 0,
  shouldHandleOnBlur: false,
  searchPlaceholder: "Search...",
  cancel: "Cancel",
  outOfIdeasLabel: "Out of ideas? Try one of our recommended games:",
  noResultsLabel: "No results found",
  numberOfResultsLabel: "Results",
  results: [],
  dispatchGamingSearchInputChangeAction: jest.fn(),
  dispatchGamingSearchInputChangeClearAction: jest.fn(),
  dispatchGamingSearchBarFocusAction: jest.fn(),
  dispatchGamingSearchCancelAction: jest.fn(),
  dispatchGamingSearchClearResultsAction: jest.fn(),
};

const renderGamingSearchZone = (props = {}) => render(<GamingSearchZone {...defaultProps} {...props} />);

describe("GamingSearchZone component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize GamingSearchContainer with correct props", () => {
    renderGamingSearchZone();

    expect(GamingSearchContainer).toHaveBeenCalledWith(
      expect.objectContaining({
        inputSearchTerm: defaultProps.inputSearchTerm,
        numberOfResults: defaultProps.numberOfResults,
        shouldHandleOnBlur: defaultProps.shouldHandleOnBlur,
        translations: {
          i18n: {
            searchPlaceholder: defaultProps.searchPlaceholder,
            cancel: defaultProps.cancel,
            outOfIdeasLabel: defaultProps.outOfIdeasLabel,
            noResultsLabel: defaultProps.noResultsLabel,
            numberOfResultsLabel: defaultProps.numberOfResultsLabel,
          },
        },
      }),
      undefined,
    );
  });

  it("should call dispatchGamingSearchBarFocusAction when search bar is focused", () => {
    renderGamingSearchZone();

    const { onFocusSearchBar } = GamingSearchContainer.mock.calls[0][0];
    onFocusSearchBar();
    expect(defaultProps.dispatchGamingSearchBarFocusAction).toHaveBeenCalledTimes(1);
  });

  it("should call dispatchGamingSearchCancelAction when cancel is triggered", () => {
    renderGamingSearchZone();

    const { onCancel } = GamingSearchContainer.mock.calls[0][0];
    onCancel("search term");
    expect(defaultProps.dispatchGamingSearchCancelAction).toHaveBeenCalledWith("search term", defaultProps.urn);
  });

  describe("when changing search input", () => {
    it("should call dispatchGamingSearchInputChangeAction with correct input", () => {
      renderGamingSearchZone();

      const { onChange } = GamingSearchContainer.mock.calls[0][0];
      onChange("new search term");
      expect(defaultProps.dispatchGamingSearchInputChangeAction).toHaveBeenCalledWith(
        "new search term",
        defaultProps.urn,
      );
    });

    it("should call dispatchGamingSearchInputChangeClearAction when input length is less than 3", () => {
      renderGamingSearchZone();

      const { onChange } = GamingSearchContainer.mock.calls[0][0];
      onChange("te");
      expect(defaultProps.dispatchGamingSearchInputChangeClearAction).toHaveBeenCalledWith(defaultProps.urn);
    });

    it("should not call dispatchGamingSearchInputChangeClearAction when input length is 3 or more", () => {
      renderGamingSearchZone();

      const { onChange } = GamingSearchContainer.mock.calls[0][0];
      onChange("text");
      expect(defaultProps.dispatchGamingSearchInputChangeClearAction).not.toHaveBeenCalled();
    });
  });

  it("should call dispatchGamingSearchClearResultsAction when clearing results", () => {
    renderGamingSearchZone();

    const { cleanResults } = GamingSearchContainer.mock.calls[0][0];
    cleanResults("search term");
    expect(defaultProps.dispatchGamingSearchClearResultsAction).toHaveBeenCalledWith("search term", defaultProps.urn);
  });
});
