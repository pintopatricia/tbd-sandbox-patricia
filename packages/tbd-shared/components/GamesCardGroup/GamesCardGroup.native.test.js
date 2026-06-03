import { render } from "@testing-library/react-native";
import ConnectedGameCard from "../GameCard";
import GameCard from "../GameCard/GameCard.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";
import { GamingCategoryLink } from "./snowflakes/GamingCategoryLink/GamingCategoryLink.native";
import GamesCardGroup from "./GamesCardGroup.native";
import selectors from "./GamesCardGroup.native.selectors";
import styles from "./GamesCardGroup.native.styles";

jest.useFakeTimers();

jest.mock("../GameCard/", () => jest.fn(() => <connected-game-card-mock />));
jest.mock("../GameCard/GameCard.native", () => jest.fn(() => <game-card-mock />));
jest.mock("../GameCard/GameCardPlaceholder.native", () => jest.fn(() => <game-card-placeholder-mock />));
jest.mock("./snowflakes/GamingCategoryLink/GamingCategoryLink.native", () => ({
  GamingCategoryLink: jest.fn(() => <gaming-category-link-mock />),
}));

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => ({
    current: mockLazyLoading,
  })),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const mockNavigate = jest.fn();
jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: { "spacing-3": 12, "spacing-4": 16 },
  heights: {},
  tokens: {
    CardGroupPadding: {
      paddingLeft: 12,
      paddingRight: 12,
    },
    CardGroupHorizontalGap: {
      gap: 8,
    },
    CardGroupStackingVerticalGap: {
      gap: 12,
    },
    GameTileRoundContainerSizing: 100,
    SwimlaneHorizontalGapPrimary: {
      gap: 12,
    },
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderGamesCardGroup(
  title = "fakeTitle",
  items = [],
  layout = "CARD_LIST",
  cardGroupUrn = "fakeCardGroupURN",
  gamingCategoryLink = {
    viewLink: "fakeViewLink",
    cardIcon: "fakeIcon",
    label: "fakeLabel",
    buttonText: "fakeButtonText",
  },
) {
  return render(
    <GamesCardGroup
      title={title}
      items={items}
      layout={layout}
      cardGroupUrn={cardGroupUrn}
      totalItems={items?.length}
      gamingCategoryLink={gamingCategoryLink}
    />,
  );
}

describe("Connected GameList", () => {
  beforeEach(jest.clearAllMocks);
  let groupHeader;
  let groupHeaderText;
  let cardsGrid;
  let cardContainer;
  let categoryLink;

  it("should not render games card group if there are no items", () => {
    const { queryByTestId } = renderGamesCardGroup();
    expect(queryByTestId(selectors.GAMES_CARD_GROUP)).toBeNull();
    expect(ConnectedGameCard).not.toHaveBeenCalled();
  });

  describe("segmented card group", () => {
    beforeEach(() => {
      const { getByTestId, getAllByTestId } = renderGamesCardGroup(
        "fakeTitle",
        [{ urn: "fakeGame" }, { urn: "fakeGame1" }, { urn: "fakeGame2" }],
        "CARD_LIST",
        "fakeCardGroupURN",
      );
      groupHeader = getByTestId(selectors.GAMES_CARD_GROUP_HEADER);
      groupHeaderText = getByTestId(selectors.GAMES_CARD_GROUP_HEADER_TEXT);
      cardsGrid = getByTestId(selectors.GAMES_CARD_GROUP_GRID);
      cardContainer = getAllByTestId(selectors.GAMES_CARD_GROUP_GAME_CONTAINER);
      categoryLink = getByTestId(selectors.GAMES_CARD_GROUP_CATEGORY_LINK);
    });

    it("should render the group header with the correct styles", () => {
      expect(groupHeaderText).toHaveStyle(styles.segmentedTitle);
      expect(groupHeaderText).toHaveTextContent("fakeTitle");
    });

    it("should render the cards grid with the correct styles", () => {
      expect(cardsGrid).toHaveStyle(styles.segmentedGamesCardsContainers);
      expect(cardContainer).toHaveLength(3);
      expect(cardContainer[0]).not.toHaveStyle(styles.twoColumns);
      expect(cardContainer[0]).not.toHaveStyle(styles.fourColumns);
      expect(cardContainer[1]).not.toHaveStyle(styles.twoColumns);
      expect(cardContainer[1]).not.toHaveStyle(styles.fourColumns);
      expect(cardContainer[2]).not.toHaveStyle(styles.twoColumns);
      expect(cardContainer[2]).not.toHaveStyle(styles.fourColumns);
    });

    it("should render the GamesCard with the correct props", () => {
      expect(ConnectedGameCard).toHaveBeenCalledTimes(3);
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: "fakeGame",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: "fakeGame1",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        3,
        {
          urn: "fakeGame2",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });

    it("should render the games category link card with the correct styles", () => {
      expect(categoryLink).toHaveStyle([styles.segmentedGameContainer, styles.gamingCategoryLink]);
      expect(GamingCategoryLink).toHaveBeenCalledWith(
        {
          viewLink: "fakeViewLink",
          cardIcon: "fakeIcon",
          label: "fakeLabel",
          buttonText: "fakeButtonText",
          gamingZoneTitle: "fakeTitle",
          onClick: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("grid two columns", () => {
    beforeEach(() => {
      const { getByTestId, getAllByTestId } = renderGamesCardGroup(
        "fakeTitle",
        [{ urn: "fakeGame" }, { urn: "fakeGame1" }, { urn: "fakeGame2" }],
        "GRID_TWO_COLUMNS",
        "fakeCardGroupURN",
      );
      groupHeader = getByTestId(selectors.GAMES_CARD_GROUP_HEADER);
      groupHeaderText = getByTestId(selectors.GAMES_CARD_GROUP_HEADER_TEXT);
      cardsGrid = getByTestId(selectors.GAMES_CARD_GROUP_GRID);
      cardContainer = getAllByTestId(selectors.GAMES_CARD_GROUP_GAME_CONTAINER, { includeHiddenElements: true });
    });

    it("should render the group header with the correct styles", () => {
      expect(groupHeader).toHaveStyle(styles.cardGroupHeader);
      expect(groupHeaderText).toHaveStyle(styles.title);
      expect(groupHeaderText).toHaveTextContent("fakeTitle");
    });

    it("should render first card as hero tile when total number of items is odd", () => {
      expect(cardsGrid).toHaveStyle([styles.gamesGrid]);
      expect(cardContainer).toHaveLength(4);
      expect(cardContainer[0]).toHaveStyle([styles.twoColumns, styles.twoColumnsHeroTile]);
      expect(cardContainer[1]).toHaveStyle([styles.twoColumnsHiddenTile]);
      expect(cardContainer[2]).toHaveStyle(styles.twoColumns);
      expect(cardContainer[3]).toHaveStyle(styles.twoColumns);
    });

    it("should render all the cards having the same size when total number of items is even", () => {
      const { getAllByTestId } = renderGamesCardGroup(
        "fakeTitle",
        [{ urn: "fakeGame" }, { urn: "fakeGame1" }, { urn: "fakeGame2" }, { urn: "fakeGame3" }],
        "GRID_TWO_COLUMNS",
        "fakeCardGroupURN",
      );
      cardContainer = getAllByTestId(selectors.GAMES_CARD_GROUP_GAME_CONTAINER);

      expect(cardContainer).toHaveLength(4);
      expect(cardContainer[0]).toHaveStyle(styles.twoColumns);
      expect(cardContainer[1]).toHaveStyle(styles.twoColumns);
      expect(cardContainer[2]).toHaveStyle(styles.twoColumns);
      expect(cardContainer[3]).toHaveStyle(styles.twoColumns);
    });

    it("should render the GamesCard with the correct props", () => {
      expect(ConnectedGameCard).toHaveBeenCalledTimes(4);
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: "fakeGame",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: "",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        3,
        {
          urn: "fakeGame1",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        4,
        {
          urn: "fakeGame2",
          isRoundGameTile: false,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });
  });

  describe("grid four columns", () => {
    beforeEach(() => {
      const { getByTestId, getAllByTestId } = renderGamesCardGroup(
        "fakeTitle",
        [{ urn: "fakeGame" }, { urn: "fakeGame1" }],
        "GRID_FOUR_COLUMNS",
        "fakeCardGroupURN",
      );
      groupHeader = getByTestId(selectors.GAMES_CARD_GROUP_HEADER);
      groupHeaderText = getByTestId(selectors.GAMES_CARD_GROUP_HEADER_TEXT);
      cardsGrid = getByTestId(selectors.GAMES_CARD_GROUP_GRID);
      cardContainer = getAllByTestId(selectors.GAMES_CARD_GROUP_GAME_CONTAINER);
    });

    it("should render first card as hero tile when total number of items is odd", () => {
      expect(cardsGrid).toHaveStyle([styles.gamesGrid]);
      expect(cardContainer).toHaveLength(2);
      expect(cardContainer[0]).toHaveStyle([styles.fourColumns]);
    });

    it("should render the GamesCard with the correct props", () => {
      expect(ConnectedGameCard).toHaveBeenCalledTimes(2);
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        1,
        {
          urn: "fakeGame",
          isRoundGameTile: true,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
      expect(ConnectedGameCard).toHaveBeenNthCalledWith(
        2,
        {
          urn: "fakeGame1",
          isRoundGameTile: true,
          component: GameCard,
          placeholder: GameCardPlaceholder,
          visible: false,
        },
        undefined,
      );
    });
  });
});
