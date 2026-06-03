import { render } from "@testing-library/react-native";
import { BadgeLayout, BadgeType } from "@ppb/the-wall-common/types/GameTile/Badge.types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { Badge } from "@ppb/the-wall-native/components/GameTile/Badge/Badge";
import { GameBadge } from "../../../GameInfo/snowflakes/GameBadge/GameBadge.native";
import { GameTile } from "./GameTile.native";
import styles from "./GameTile.native.styles";
import selectors from "./GameTile.native.selectors";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    GameTileJackpotBorder: {},
    GameTileRoundBorderRadius: {},
    GameTileSquarePadding: {},
    GameTileRectangleWidthSizing: 140,
    GameTileRectangleHeightSizing: 80,
    GameTileRectangleVerticalGap: { gap: 4 },
    GameTileRectangleTitleColour: "#18181a",
    GameTileSquareHorizontalGap: { gap: 4 },
  },
}));

jest.mock("@ppb/the-wall-native/components/GameTile/Badge/Badge", () => ({
  Badge: jest.fn(() => <badge-mock />),
}));

jest.mock("../../../GameInfo/snowflakes/GameBadge/GameBadge.native", () => ({
  GameBadge: jest.fn(() => <game-badge-mock />),
}));

jest.mock("@ppb/the-wall-native/components/TBDImage/TBDImage", () => ({
  TBDImage: jest.fn((props) => <tbd-image-mock {...props} />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderGameTile(props) {
  return render(<GameTile {...props} />);
}

function getGameTile(props) {
  const { getByTestId } = renderGameTile(props);
  return getByTestId(selectors.GAME_TILE);
}

function getGameTileImage(props) {
  const { getByTestId } = renderGameTile(props);
  return getByTestId(selectors.GAME_TILE_IMAGE);
}

function getGameTileImageContent(props) {
  const { getByTestId } = renderGameTile(props);
  return getByTestId(selectors.GAME_TILE_IMAGE_CONTENT);
}

function getGameTileJackpotLogo(props) {
  const { queryByTestId } = renderGameTile(props);
  return queryByTestId(selectors.GAME_TILE_JACKPOT_LOGO);
}

function getRoundedGameTileBadgeContainer(props) {
  const { queryByTestId } = renderGameTile(props);
  return queryByTestId(selectors.ROUNDED_GAME_TILE_CONTAINER);
}

function getRoundedTileBadgeLabel(props) {
  const { queryByTestId } = renderGameTile(props);
  return queryByTestId(selectors.ROUNDED_GAME_TILE_BADGE_LABEL);
}

const gameTileProps = {
  copyrightText: "All related characters and elements are trademarks of Big Company.",
  title: "Age of the Gods™ Norse king of Asgard and the God of Thunders",
  backgroundColor: "#aaabba",
};

const roundGameTileProps = { ...gameTileProps, isRoundGameTile: true };

const shortBadgeLabel = {
  badge: {
    type: "JACKPOT",
    label: "1.000.000 $",
  },
};

const buildRoundedGameTileProps = (badge = shortBadgeLabel) => ({
  ...gameTileProps,
  isRoundGameTile: true,
  ...badge,
});

describe("Game Tile", () => {
  beforeEach(jest.clearAllMocks);
  let gameTileInfoContainer;
  let gameTileCopyright;
  let gameTileInfoButton;
  let roundedGameTile;

  describe("Game text container", () => {
    beforeEach(() => {
      const { getByTestId } = renderGameTile(gameTileProps);
      gameTileInfoContainer = getByTestId(selectors.GAME_TILE_INFO_CONTAINER);
      gameTileCopyright = getByTestId(selectors.GAME_TILE_COPYRIGHT);
      gameTileInfoButton = getByTestId(selectors.GAME_TILE_INFO);
    });

    it("should render the game tile info container with proper styles", () => {
      expect(gameTileInfoContainer).toHaveStyle(styles.gameInfoContainer);
    });

    it("should render copyright text with proper style", () => {
      expect(gameTileCopyright).toHaveStyle(styles.copyRightText);
      expect(gameTileCopyright).toHaveStyle(tokens.GameTileSupportingTextTypography);
    });

    it("should display info button with proper styles", () => {
      expect(gameTileInfoButton).toHaveStyle({
        width: tokens.GameTileIconSizing,
        height: tokens.GameTileIconSizing,
      });
    });
  });

  describe("Border Color", () => {
    it("should render the game tile without border", () => {
      const gameTile = getGameTile(gameTileProps);
      expect(gameTile).toHaveStyle(styles.gameTile);
    });

    describe("when the badge type is JACKPOT", () => {
      it("should render the game tile with without border when there is no badge label value", () => {
        const gameTile = getGameTile({ ...gameTileProps, badge: { type: BadgeType.JACKPOT } });
        expect(gameTile).toHaveStyle(styles.gameTile);
      });

      it("should render the game tile with red border", () => {
        const gameTileImage = getGameTileImage({
          ...gameTileProps,
          badge: { type: BadgeType.JACKPOT, label: "$420.340" },
        });
        expect(gameTileImage).toHaveStyle(styles.backgroundImage);
      });
    });
  });

  describe("Badge Container", () => {
    describe("when there are no badge props", () => {
      it("should not render Badge or GameBadge icon", () => {
        renderGameTile(gameTileProps);
        expect(Badge).not.toHaveBeenCalled();
        expect(GameBadge).not.toHaveBeenCalled();
      });
    });

    describe("when game tile is round", () => {
      it("should not render Badge or GameBadge Icon", () => {
        renderGameTile({ ...roundGameTileProps, badge: { type: BadgeType.REGULAR } });
        expect(Badge).not.toHaveBeenCalled();
        expect(GameBadge).not.toHaveBeenCalled();
      });

      describe("when badge type is JACKPOT", () => {
        it("should render GameBadge icon", () => {
          renderGameTile({ ...roundGameTileProps, badge: { type: BadgeType.JACKPOT, label: "Jackpot" } });
          expect(GameBadge).toHaveBeenCalled();
        });
      });
    });

    describe("when game tile is not round", () => {
      it("should not render GameBadge icon", () => {
        renderGameTile({ ...gameTileProps, badge: { type: BadgeType.REGULAR } });
        expect(GameBadge).not.toHaveBeenCalled();
      });

      it("should render Badge component using the correct props", () => {
        renderGameTile({ ...gameTileProps, badge: { type: BadgeType.REGULAR, label: "New" } });
        expect(Badge).toHaveBeenCalledWith(
          {
            label: "New",
            badgeType: BadgeType.REGULAR,
            badgeLayout: BadgeLayout.GAME_TILE_BADGE,
            rouletteNumbers: undefined,
            testID: selectors.GAME_TILE_BADGE,
          },
          undefined,
        );
      });

      it("should render roulette numbers without badge label", () => {
        const rouletteNumbers = [
          { color: "red", number: "2" },
          { color: "green", number: "0" },
          { color: "black", number: "4" },
        ];
        renderGameTile({
          ...gameTileProps,
          badge: {
            type: BadgeType.ROULETTE_NUMBERS,
            rouletteNumbers,
          },
        });
        expect(Badge).toHaveBeenCalledWith(
          {
            label: undefined,
            badgeType: BadgeType.ROULETTE_NUMBERS,
            badgeLayout: BadgeLayout.GAME_TILE_BADGE,
            rouletteNumbers,
            testID: selectors.GAME_TILE_BADGE,
          },
          undefined,
        );
      });
    });
  });

  describe("Background Image", () => {
    it("should render the game tile without background image", () => {
      const gameTileImage = getGameTileImage(gameTileProps);
      expect(gameTileImage).toHaveProp("source", []);
    });

    it("should render the game tile without background image", () => {
      const background = { small: { url: "small image url", height: 250 } };
      const gameTileImage = getGameTileImage({ ...gameTileProps, background });
      expect(gameTileImage).toHaveProp("source", []);
    });

    it("should render the game tile with small background image", () => {
      const background = { small: { url: "small image url", height: 250, width: 250 } };
      const gameTileImage = getGameTileImage({ ...gameTileProps, background });
      expect(gameTileImage).toHaveProp("source", [{ height: 250, uri: "small image url", width: 250 }]);
    });

    it("should render the game tile with medium background image", () => {
      const background = { medium: { url: "medium image url", height: 450, width: 450 } };
      const gameTileImage = getGameTileImage({ ...gameTileProps, background });
      expect(gameTileImage).toHaveProp("source", [{ height: 450, uri: "medium image url", width: 450 }]);
    });

    it("should render the game tile large background image", () => {
      const background = { large: { url: "large image url", height: 900, width: 900 } };
      const gameTileImage = getGameTileImage({ ...gameTileProps, background });
      expect(gameTileImage).toHaveProp("source", [{ height: 900, uri: "large image url", width: 900 }]);
    });

    it("should render game tile content for square tiles", () => {
      const gameTileImageContent = getGameTileImageContent({ ...gameTileProps, isRoundGameTile: false });
      expect(gameTileImageContent).toHaveStyle(styles.roundedImageContent);
    });

    it("should render game tile content for rounded tiles", () => {
      const gameTileImageContent = getGameTileImageContent({ ...gameTileProps, isRoundGameTile: true });
      expect(gameTileImageContent).toHaveStyle(styles.roundedImageContent);
    });
  });

  describe("Jackpot Logo", () => {
    it("should render the game tile without jackpot logo", () => {
      const gameTileJackpotLogo = getGameTileJackpotLogo(gameTileProps);
      expect(gameTileJackpotLogo).toBeNull();
    });
    it("should render the game tile with jackpot logo", () => {
      const jackpotLogo = "./img/Jackpot_king.png";
      const gameTileJackpotLogo = getGameTileJackpotLogo({ ...gameTileProps, jackpotLogo });
      expect(gameTileJackpotLogo).toHaveProp("source", "./img/Jackpot_king.png");
    });
  });

  describe("Rounded Game Tile", () => {
    it("should display rounded game tile container", () => {
      const roundedGameTileBadgeContainer = getRoundedGameTileBadgeContainer(buildRoundedGameTileProps());
      expect(roundedGameTileBadgeContainer).toBeTruthy();
    });
    it("should have rounded game tile style applied", () => {
      const { getByTestId } = renderGameTile(buildRoundedGameTileProps());
      roundedGameTile = getByTestId(selectors.GAME_TILE_IMAGE);
      expect(roundedGameTile).toHaveStyle(styles.roundedImageStyle);
    });
    it("should render short jackpot value with style applied", () => {
      const roundedGameTileBadgeLabel = getRoundedTileBadgeLabel(buildRoundedGameTileProps());
      expect(roundedGameTileBadgeLabel).toHaveStyle(styles.roundedGameTileBadgeText);
    });
  });

  describe("Game Widget Tile", () => {
    const gameWidgetProps = {
      ...gameTileProps,
      isGameWidget: true,
    };

    it("should render game widget tile when isGameWidget is true", () => {
      const { getByTestId } = renderGameTile(gameWidgetProps);
      const widgetTile = getByTestId(selectors.GAME_WIDGET_TILE);
      expect(widgetTile).toBeTruthy();
    });

    it("should render icon background in widget mode", () => {
      const { getByTestId } = renderGameTile(gameWidgetProps);
      const iconBackground = getByTestId(selectors.GAME_WIDGET_ICON_BACKGROUND);
      expect(iconBackground).toBeTruthy();
    });

    it("should render the game widget tile with shadow", () => {
      const { getByTestId } = renderGameTile(gameWidgetProps);
      const gameWidgetTileShadow = getByTestId(selectors.GAME_WIDGET_TILE_SHADOW);
      expect(gameWidgetTileShadow).toBeTruthy();
    });

    it("should render the game widget tile with correct styles", () => {
      const { getByTestId } = renderGameTile(gameWidgetProps);
      const gameWidgetTile = getByTestId(selectors.GAME_WIDGET_TILE);
      expect(gameWidgetTile).toHaveStyle(styles.gameWidgetTile);
    });

    it("should render icon background with correct styles", () => {
      const { getByTestId } = renderGameTile(gameWidgetProps);
      const iconBackground = getByTestId(selectors.GAME_WIDGET_ICON_BACKGROUND);
      expect(iconBackground).toHaveStyle(styles.iconBackground);
    });

    it("should render GenericIcon in widget mode", () => {
      const { GenericIcon } = require("@ppb/the-wall-icons/GenericIcon/GenericIcon");
      renderGameTile(gameWidgetProps);
      expect(GenericIcon).toHaveBeenCalled();
    });

    it("should not render game tile image in widget mode", () => {
      const { queryByTestId } = renderGameTile(gameWidgetProps);
      const gameTileImage = queryByTestId(selectors.GAME_TILE_IMAGE);
      expect(gameTileImage).toBeNull();
    });

    it("should not render badges in widget mode", () => {
      renderGameTile(gameWidgetProps);
      expect(Badge).not.toHaveBeenCalled();
      expect(GameBadge).not.toHaveBeenCalled();
    });

    it("should not render title in widget mode", () => {
      const { queryByTestId } = renderGameTile(gameWidgetProps);
      const title = queryByTestId(selectors.GAME_TILE_TITLE);
      expect(title).toBeNull();
    });

    it("should not render copyright in widget mode", () => {
      const { queryByTestId } = renderGameTile(gameWidgetProps);
      const copyright = queryByTestId(selectors.GAME_TILE_COPYRIGHT);
      expect(copyright).toBeNull();
    });

    it("should not render info button in widget mode", () => {
      const { queryByTestId } = renderGameTile(gameWidgetProps);
      const infoButton = queryByTestId(selectors.GAME_TILE_INFO);
      expect(infoButton).toBeNull();
    });

    it("should not render jackpot logo in widget mode", () => {
      const { queryByTestId } = renderGameTile(gameWidgetProps);
      const jackpotLogo = queryByTestId(selectors.GAME_TILE_JACKPOT_LOGO);
      expect(jackpotLogo).toBeNull();
    });
  });

  describe("XMall Game Tile", () => {
    const xmallGameTileProps = {
      ...gameTileProps,
      isXmallGameTile: true,
    };

    it("should render xmall game tile when isXmallGameTile is true", () => {
      const { getByTestId } = renderGameTile(xmallGameTileProps);
      const gameTile = getByTestId(selectors.GAME_TILE);
      expect(gameTile).toHaveStyle(styles.xmallGameTile);
    });

    it("should render game tile image with xmall background style", () => {
      const { getByTestId } = renderGameTile(xmallGameTileProps);
      const gameTileImage = getByTestId(selectors.GAME_TILE_IMAGE);
      expect(gameTileImage).toHaveStyle({
        width: tokens.GameTileRectangleWidthSizing,
        height: tokens.GameTileRectangleHeightSizing,
      });
    });

    it("should render game tile image content", () => {
      const { getByTestId } = renderGameTile(xmallGameTileProps);
      const gameTileImageContent = getByTestId(selectors.GAME_TILE_IMAGE_CONTENT);
      expect(gameTileImageContent).toHaveStyle(styles.xmallImageContent);
    });

    it("should render title with xmall style", () => {
      const { getByTestId } = renderGameTile(xmallGameTileProps);
      const title = getByTestId(selectors.GAME_TILE_TITLE);
      expect(title).toHaveStyle(styles.xmallTitle);
    });

    it("should render info button with xmall style", () => {
      const { getByTestId } = renderGameTile(xmallGameTileProps);
      const infoButton = getByTestId(selectors.GAME_TILE_INFO);
      expect(infoButton).toHaveStyle(styles.xmallInfoButton);
    });

    it("should render info container with xmall style", () => {
      const { getByTestId } = renderGameTile(xmallGameTileProps);
      const infoContainer = getByTestId(selectors.GAME_TILE_INFO_CONTAINER);
      expect(infoContainer).toHaveStyle(styles.xmallGameInfoContainer);
    });

    it("should not render copyright text in xmall mode", () => {
      const { queryByTestId } = renderGameTile(xmallGameTileProps);
      const copyright = queryByTestId(selectors.GAME_TILE_COPYRIGHT);
      expect(copyright).toBeNull();
    });

    describe("Border Color", () => {
      it("should render xmall tile with default image style when no badge", () => {
        const { getByTestId } = renderGameTile(xmallGameTileProps);
        const gameTileImage = getByTestId(selectors.GAME_TILE_IMAGE);
        // ImageStyle prop is not directly testable, but we can verify the component renders
        expect(gameTileImage).toBeTruthy();
        expect(gameTileImage).toHaveStyle({
          width: tokens.GameTileRectangleWidthSizing,
          height: tokens.GameTileRectangleHeightSizing,
        });
      });

      it("should render xmall tile with default image style when badge type is not JACKPOT", () => {
        const { getByTestId } = renderGameTile({
          ...xmallGameTileProps,
          badge: { type: BadgeType.REGULAR, label: "New" },
        });
        const gameTileImage = getByTestId(selectors.GAME_TILE_IMAGE);
        expect(gameTileImage).toBeTruthy();
        expect(gameTileImage).toHaveStyle({
          width: tokens.GameTileRectangleWidthSizing,
          height: tokens.GameTileRectangleHeightSizing,
        });
      });

      it("should render xmall tile with default image style when badge type is JACKPOT but no label", () => {
        const { getByTestId } = renderGameTile({
          ...xmallGameTileProps,
          badge: { type: BadgeType.JACKPOT },
        });
        const gameTileImage = getByTestId(selectors.GAME_TILE_IMAGE);
        expect(gameTileImage).toBeTruthy();
        expect(gameTileImage).toHaveStyle({
          width: tokens.GameTileRectangleWidthSizing,
          height: tokens.GameTileRectangleHeightSizing,
        });
      });

      it("should render xmall tile with jackpot border style when badge type is JACKPOT with label", () => {
        const { getByTestId } = renderGameTile({
          ...xmallGameTileProps,
          badge: { type: BadgeType.JACKPOT, label: "$420.340" },
        });
        const gameTileImage = getByTestId(selectors.GAME_TILE_IMAGE);
        expect(gameTileImage).toBeTruthy();
        expect(gameTileImage).toHaveStyle({
          width: tokens.GameTileRectangleWidthSizing,
          height: tokens.GameTileRectangleHeightSizing,
        });
      });
    });

    describe("Badge Container", () => {
      it("should not render Badge when there is no badge prop", () => {
        renderGameTile(xmallGameTileProps);
        expect(Badge).not.toHaveBeenCalled();
      });

      it("should render Badge component with correct props", () => {
        renderGameTile({
          ...xmallGameTileProps,
          badge: { type: BadgeType.REGULAR, label: "New" },
        });
        expect(Badge).toHaveBeenCalledWith(
          {
            label: "New",
            badgeType: BadgeType.REGULAR,
            badgeLayout: BadgeLayout.GAME_TILE_BADGE,
            rouletteNumbers: undefined,
            testID: selectors.GAME_TILE_BADGE,
          },
          undefined,
        );
      });

      it("should render Badge for JACKPOT type", () => {
        renderGameTile({
          ...xmallGameTileProps,
          badge: { type: BadgeType.JACKPOT, label: "$1,000,000" },
        });
        expect(Badge).toHaveBeenCalledWith(
          {
            label: "$1,000,000",
            badgeType: BadgeType.JACKPOT,
            badgeLayout: BadgeLayout.GAME_TILE_BADGE,
            rouletteNumbers: undefined,
            testID: selectors.GAME_TILE_BADGE,
          },
          undefined,
        );
      });

      it("should not render GameBadge in xmall mode", () => {
        renderGameTile({
          ...xmallGameTileProps,
          badge: { type: BadgeType.JACKPOT, label: "Jackpot" },
        });
        expect(GameBadge).not.toHaveBeenCalled();
      });
    });

    describe("Jackpot Logo", () => {
      it("should not render jackpot logo when not provided", () => {
        const { queryByTestId } = renderGameTile(xmallGameTileProps);
        const jackpotLogo = queryByTestId(selectors.GAME_TILE_JACKPOT_LOGO);
        expect(jackpotLogo).toBeNull();
      });

      it("should render jackpot logo when provided", () => {
        const jackpotLogo = "./img/Jackpot_king.png";
        const { queryByTestId } = renderGameTile({ ...xmallGameTileProps, jackpotLogo });
        const jackpotLogoElement = queryByTestId(selectors.GAME_TILE_JACKPOT_LOGO);
        expect(jackpotLogoElement).toHaveProp("source", "./img/Jackpot_king.png");
      });

      it("should render jackpot logo container with xmall style", () => {
        const jackpotLogo = "./img/Jackpot_king.png";
        const { queryByTestId } = renderGameTile({ ...xmallGameTileProps, jackpotLogo });
        const jackpotLogoContainer = queryByTestId(selectors.GAME_TILE_JACKPOT_LOGO_CONTAINER);
        expect(jackpotLogoContainer).toHaveStyle(styles.xmallJackpotLogoContainer);
      });
    });

    describe("Background Image", () => {
      it("should render xmall tile with background image", () => {
        const background = { small: { url: "small image url", height: 250, width: 250 } };
        const { getByTestId } = renderGameTile({ ...xmallGameTileProps, background });
        const gameTileImage = getByTestId(selectors.GAME_TILE_IMAGE);
        expect(gameTileImage).toHaveProp("source", [{ height: 250, uri: "small image url", width: 250 }]);
      });
    });
  });
});
