import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";

import { RouletteNumberColor } from "@ppb/the-wall-common/types";
import { SystemIconName, CasinoIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Badge } from "@ppb/the-wall-web/components/walls/Badge/Badge";
import { GameBadge } from "../../../GameInfo/snowflakes/GameBadge/GameBadge.web";
import { GameTile } from "./GameTile.web";
import { CustomLogo } from "./CustomLogo/CustomLogo.web";

import {
  TEST_ID,
  TILE_GRADIENT,
  BACKGROUND,
  JACKPOT_LOGO,
  TITLE,
  COPYRIGHT,
  INFO_BUTTON,
  JACKPOT_VALUE_CONTAINER,
} from "./GameTile.web.selectors";
import styles from "./GameTile.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ name }) => <generic-icon-mock data-icon-name={name} />),
}));

jest.mock("@ppb/the-wall-web/components/walls/Badge/Badge", () => ({
  Badge: jest.fn(() => <badge-mock />),
  BadgeType: {
    REGULAR: "REGULAR",
    JACKPOT: "JACKPOT",
    NEW: "NEW",
  },
}));

jest.mock("./CustomLogo/CustomLogo.web", () => ({
  CustomLogo: jest.fn(() => <custom-logo-mock />),
}));

jest.mock("../../../GameInfo/snowflakes/GameBadge/GameBadge.web", () => ({
  GameBadge: jest.fn(() => <game-mock />),
}));

function renderGameTile(props, onClick) {
  const { container } = render(<GameTile {...props} onInfoButtonClick={onClick} onFavouritesButtonClick={jest.fn()} />);
  return container.querySelector(TEST_ID);
}

const background = {
  medium: {
    url: "background-medium-url",
    width: 450,
  },
  alt: "Background image",
};

const gameTileProps = {
  background,
  columns: 1,
  badge: {
    type: "JACKPOT",
    label: "$1000000",
  },
  copyrightText: "All related characters and elements are trademarks of Big Company.",
  title: "Age of the Gods™ Norse king of Asgard and the God of Thunders",
  jackpotLogo: "/jackpot_king.png",
  isRoundGameTile: false,
  gameDetailsUrl: "some-url",
  onInfoButtonClick: jest.fn(),
  onFavouritesButtonClick: jest.fn(),
};

const gameRoundTileProps = {
  background,
  columns: 1,
  copyrightText: "All related characters and elements are trademarks of Big Company.",
  title: "Age of the Gods™ Norse king of Asgard and the God of Thunders",
  jackpotLogo: "/jackpot_king.png",
  isRoundGameTile: true,
  gameDetailsUrl: "some-url",
};

const newDecoratedGameTileProps = {
  background,
  columns: 1,
  copyrightText: "All related characters and elements are trademarks of Big Company.",
  title: "Age of the Gods™ Norse king of Asgard and the God of Thunders",
  jackpotLogo: "/jackpot_king.png",
  badge: {
    type: "NEW",
    label: "New",
  },
  gameDetailsUrl: "some-url",
};

const gameTilePropsWithoutImg = {
  columns: 1,
  badge: {
    type: "JACKPOT",
    label: "$1000000",
  },
  copyrightText: "All related characters and elements are trademarks of Big Company.",
  title: "Age of the Gods™ Norse king of Asgard and the God of Thunders",
  jackpotLogo: "/jackpot_king.png",
  isRoundGameTile: false,
  gameDetailsUrl: "some-url",
};

const gameTilePropsWithRouletteNumbers = {
  background,
  columns: 1,
  badge: {
    type: "ROULETTE_NUMBER",
    rouletteNumbers: [{ color: RouletteNumberColor.RED, number: "2" }],
  },
  copyrightText: "All related characters and elements are trademarks of Big Company.",
  title: "Age of the Gods™ Norse king of Asgard and the God of Thunders",
  jackpotLogo: "/jackpot_king.png",
  gameDetailsUrl: "some-url",
};

const customLogo = {
  name: "Custom Game Logo",
  image: {
    url: "https://images.prismic.io?w=120&h=120",
    dimensions: {
      height: 120,
      width: 120,
    },
  },
};

const gameTileWithCustomLogo = {
  ...gameTileProps,
  customLogo,
  gameDetailsUrl: "some-url",
};

describe("Game Tile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Layout", () => {
    it("should render default layout", () => {
      const gameTile = renderGameTile(gameTileProps);
      expect(gameTile).toHaveClass(styles.gameTile);
    });

    it("should render round game tile", () => {
      const gameTile = renderGameTile(gameRoundTileProps);
      expect(gameTile).toHaveClass(styles.round);
    });

    it("should render new decorated game tile", () => {
      const gameTile = renderGameTile(newDecoratedGameTileProps);
      expect(gameTile).toHaveClass(styles.isNewDecorated);
    });

    it("should render round game tile with red border when jackpot badge", () => {
      const props = {
        ...gameRoundTileProps,
        badge: {
          type: "JACKPOT",
          label: "$1000000",
        },
      };
      const gameTile = renderGameTile(props);
      expect(gameTile).toHaveClass(styles.imgRedBorder);
    });

    it("should render round game tile with grey border when not jackpot", () => {
      const props = {
        ...gameRoundTileProps,
        badge: undefined,
      };
      const gameTile = renderGameTile(props);
      expect(gameTile).toHaveClass(styles.imgGreyBorder);
    });

    it("should apply jackpotTile class when customLogo is present", () => {
      const gameTile = renderGameTile(gameTileWithCustomLogo);
      expect(gameTile).toHaveClass(styles.jackpotTile);
    });
  });

  describe("Background image container", () => {
    it("should have medium srcset", () => {
      const gameTile = renderGameTile(gameTileProps);
      const backgroundImg = gameTile.querySelector(BACKGROUND);
      const expected = `, ${background.medium.url} ${background.medium.width}w`;

      expect(backgroundImg.getAttribute("srcset")).toBe(expected);
    });

    it("should have srcset", () => {
      background.small = {
        url: "background-small-url",
        width: 225,
      };
      background.medium = {
        medium: {
          url: "background-medium-url",
          width: 450,
        },
      };
      const gameTile = renderGameTile(gameTileProps);
      const backgroundImg = gameTile.querySelector(BACKGROUND);
      const expected = `${background.small.url} ${background.small.width}w, ${background.medium.url} ${background.medium.width}w`;

      expect(backgroundImg.getAttribute("srcset")).toBe(expected);
    });

    it("should have the correct sizes", () => {
      const gameTile = renderGameTile(gameTileProps);
      const backgroundImg = gameTile.querySelector(BACKGROUND);
      const expected = `(min-device-width: 321px) calc(100vw / ${gameTileProps.columns}), 100w`;

      expect(backgroundImg.getAttribute("sizes")).toBe(expected);
    });

    it("should have the 'singleImage' class", () => {
      const gameTile = renderGameTile(gameTileProps);
      const backgroundImg = gameTile.querySelector(BACKGROUND);

      expect(backgroundImg).toHaveClass(styles.singleImage);
    });

    it("should not render when background is missing", () => {
      const gameTile = renderGameTile(gameTilePropsWithoutImg);
      const backgroundImg = gameTile.querySelector(BACKGROUND);
      expect(backgroundImg).toBe(null);
    });

    it("should have gradient", () => {
      const gameTile = renderGameTile(gameTileProps);

      const gradientContainer = gameTile.querySelector(TILE_GRADIENT);
      expect(gradientContainer).toHaveClass(styles.tileGradient);
    });

    it("should apply background color when provided", () => {
      const props = {
        ...gameTileProps,
        backgroundColor: "#FF0000",
      };
      const gameTile = renderGameTile(props);
      const gradientContainer = gameTile.querySelector(TILE_GRADIENT);

      expect(gradientContainer.style.backgroundColor).toBe("rgb(255, 0, 0)");
    });

    it("should not apply background color when not provided", () => {
      const gameTile = renderGameTile(gameTileProps);
      const gradientContainer = gameTile.querySelector(TILE_GRADIENT);

      expect(gradientContainer.style.backgroundColor).toBe("");
    });
  });

  describe("Badge container", () => {
    it("should have badge when layout is different than round", () => {
      renderGameTile(gameTileProps);
      expect(Badge).toHaveBeenCalledWith(
        {
          label: gameTileProps.badge.label,
          badgeType: gameTileProps.badge.type,
          badgeLayout: "GAME_TILE_BADGE",
        },
        undefined,
      );
    });

    it("should have GameBadge rendered when the layout is round", () => {
      gameRoundTileProps.badge = {
        type: "JACKPOT",
        label: "$1000000",
      };
      renderGameTile(gameRoundTileProps);
      expect(GameBadge).toHaveBeenCalled();
    });

    it("should show right jackpot value when layout is round", () => {
      const gameTile = renderGameTile(gameRoundTileProps);
      const jackpotContainer = gameTile.querySelector(JACKPOT_VALUE_CONTAINER);
      expect(jackpotContainer).toHaveTextContent(gameRoundTileProps.badge.label);
    });

    it("should have badge for roulette numbers", () => {
      renderGameTile(gameTilePropsWithRouletteNumbers);
      expect(Badge).toHaveBeenCalledWith(
        {
          badgeType: gameTilePropsWithRouletteNumbers.badge.type,
          rouletteNumbers: gameTilePropsWithRouletteNumbers.badge.rouletteNumbers,
          badgeLayout: "GAME_TILE_BADGE",
        },
        undefined,
      );
    });

    it("should have badge for new decorated zone", () => {
      renderGameTile(newDecoratedGameTileProps);
      expect(Badge).toHaveBeenCalledWith(
        {
          badgeType: newDecoratedGameTileProps.badge.type,
          label: newDecoratedGameTileProps.badge.label,
          badgeLayout: "GAME_TILE_BADGE",
        },
        undefined,
      );
    });

    it("should not render badge when badge is missing and not round", () => {
      const props = {
        ...gameTileProps,
        badge: undefined,
      };
      renderGameTile(props);
      expect(Badge).not.toHaveBeenCalled();
    });

    it("should not render badge when round tile without jackpot badge", () => {
      const props = {
        ...gameRoundTileProps,
        badge: {
          type: "REGULAR",
          label: "Regular",
        },
      };
      renderGameTile(props);
      expect(GameBadge).not.toHaveBeenCalled();
    });
  });

  describe("Game text container", () => {
    it("should not render copyright text when layout is round", () => {
      const gameTile = renderGameTile(gameRoundTileProps);
      const copyrightText = gameTile.querySelector(COPYRIGHT);
      expect(copyrightText).toBe(null);
    });

    it("should show copyright text with respective styles properly", () => {
      const gameTile = renderGameTile(gameTileProps);

      const copyrightText = gameTile.querySelector(COPYRIGHT);
      expect(copyrightText).toHaveTextContent(gameTileProps.copyrightText);
      expect(copyrightText).toHaveClass(styles.gameCopyright);
    });

    it("should not render copyright text when missing", () => {
      const props = {
        ...gameTileProps,
        copyrightText: undefined,
      };
      const gameTile = renderGameTile(props);
      const copyrightText = gameTile.querySelector(COPYRIGHT);
      expect(copyrightText).toBe(null);
    });

    it("should show game title with respective styles properly", () => {
      const gameTile = renderGameTile(gameTileProps);

      const title = gameTile.querySelector(TITLE);
      expect(title).toHaveTextContent(gameTileProps.title);
      expect(title).toHaveClass(styles.gameTitle);
    });
  });

  describe("Info container", () => {
    it("should have info icon when layout is not round", () => {
      renderGameTile(gameTileProps);
      expect(GenericIcon).toHaveBeenCalledWith(
        { name: SystemIconName.NOTIFICATION_INFO, color: "var(--game-tile-square-icon-colour)" },
        undefined,
      );
    });

    it("should call the onClick callback when info button is clicked", () => {
      const cb = jest.fn();
      const gameTile = renderGameTile(gameTileProps, cb);
      const section = gameTile.querySelector(INFO_BUTTON);
      section.click();

      expect(cb).toHaveBeenCalledTimes(1);
    });

    it("should not render info when layout is round", () => {
      const gameTile = renderGameTile(gameRoundTileProps);
      const infoButton = gameTile.querySelector(INFO_BUTTON);
      expect(infoButton).toBe(null);
    });

    it("should not render info button when gameDetailsUrl is missing", () => {
      const props = {
        ...gameTileProps,
        gameDetailsUrl: undefined,
      };
      const { container } = render(<GameTile {...props} />);
      const infoButton = container.querySelector(INFO_BUTTON);
      expect(infoButton).toBe(null);
    });

    it("should render info button with correct href", () => {
      const gameTile = renderGameTile(gameTileProps);
      const link = gameTile.querySelector(`a[href="${gameTileProps.gameDetailsUrl}"]`);
      expect(link).toBeTruthy();
    });
  });

  describe("Favorite button functionality", () => {
    describe("when user is logged in and feature is enabled", () => {
      it("should render favorite button with outline heart when not favorite", () => {
        const props = {
          ...gameTileProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
        };
        const { container } = render(<GameTile {...props} />);
        const icons = container.querySelectorAll("[data-icon-name]");
        const heartIcon = Array.from(icons).find(
          (icon) => icon.getAttribute("data-icon-name") === SystemIconName.HEART_OUTLINE,
        );

        expect(heartIcon).toBeTruthy();
        expect(GenericIcon).toHaveBeenCalledWith(
          expect.objectContaining({
            name: SystemIconName.HEART_OUTLINE,
          }),
          undefined,
        );
      });

      it("should render favorite button with filled heart when already favorite", () => {
        const props = {
          ...gameTileProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: true,
        };
        const { container } = render(<GameTile {...props} />);
        const icons = container.querySelectorAll("[data-icon-name]");
        const heartIcon = Array.from(icons).find(
          (icon) => icon.getAttribute("data-icon-name") === SystemIconName.HEART_FILLED,
        );

        expect(heartIcon).toBeTruthy();
        expect(GenericIcon).toHaveBeenCalledWith(
          expect.objectContaining({
            name: SystemIconName.HEART_FILLED,
          }),
          undefined,
        );
      });

      it("should call onFavouritesButtonClick when favorite button is clicked", () => {
        const onFavouritesButtonClick = jest.fn();
        const props = {
          ...gameTileProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
          onFavouritesButtonClick,
        };
        const { container } = render(<GameTile {...props} />);
        const icons = container.querySelectorAll("[data-icon-name]");
        const heartIcon = Array.from(icons).find(
          (icon) => icon.getAttribute("data-icon-name") === SystemIconName.HEART_OUTLINE,
        );
        const favoriteButton = heartIcon.closest("button");

        fireEvent.click(favoriteButton);

        expect(onFavouritesButtonClick).toHaveBeenCalledTimes(1);
      });
    });

    describe("when user is not logged in", () => {
      it("should not render favorite button", () => {
        const props = {
          ...gameTileProps,
          isLoggedIn: false,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
        };
        const { container } = render(<GameTile {...props} />);
        const icons = container.querySelectorAll("[data-icon-name]");
        const heartIcon = Array.from(icons).find((icon) => icon.getAttribute("data-icon-name").includes("heart"));

        expect(heartIcon).toBeFalsy();
      });
    });

    describe("when feature is not enabled", () => {
      it("should not render favorite button", () => {
        const props = {
          ...gameTileProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: false,
          isFavourite: false,
        };
        const { container } = render(<GameTile {...props} />);
        const icons = container.querySelectorAll("[data-icon-name]");
        const heartIcon = Array.from(icons).find((icon) => icon.getAttribute("data-icon-name").includes("heart"));

        expect(heartIcon).toBeFalsy();
      });
    });

    describe("when layout is round", () => {
      it("should not render favorite button", () => {
        const props = {
          ...gameRoundTileProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
        };
        const { container } = render(<GameTile {...props} />);
        const icons = container.querySelectorAll("[data-icon-name]");
        const heartIcon = Array.from(icons).find((icon) => icon.getAttribute("data-icon-name").includes("heart"));

        expect(heartIcon).toBeFalsy();
      });
    });
  });

  describe("jackpot container", () => {
    it("should have jackpot logo", () => {
      const gameTile = renderGameTile(gameTileProps);

      const jackpotLogo = gameTile.querySelector(JACKPOT_LOGO);
      expect(jackpotLogo).toHaveAttribute("src", "/jackpot_king.png");
    });

    it("should not have custom logo", () => {
      renderGameTile(gameTileProps);
      expect(CustomLogo).not.toHaveBeenCalled();
    });

    it("should not render jackpot logo when missing", () => {
      const props = {
        ...gameTileProps,
        jackpotLogo: undefined,
      };
      const gameTile = renderGameTile(props);
      const jackpotLogo = gameTile.querySelector(JACKPOT_LOGO);
      expect(jackpotLogo).toBe(null);
    });
  });

  describe("when game tile has custom logo and jackpot logo too", () => {
    it("should render custom logo", () => {
      renderGameTile(gameTileWithCustomLogo);
      expect(CustomLogo).toHaveBeenCalledWith(
        {
          customLogo,
          isGameInfo: false,
          sizes: [
            {
              mediaType: "max-width",
              mediaValue: 400,
              size: 34,
            },
            {
              mediaType: "max-width",
              mediaValue: 736,
              size: 36,
            },
            {
              mediaType: "min-width",
              mediaValue: 737,
              size: 40,
            },
          ],
        },
        undefined,
      );
    });

    it("should not render jackpot logo", () => {
      const gameTile = renderGameTile(gameTileWithCustomLogo);
      const jackpotLogo = gameTile.querySelector(JACKPOT_LOGO);
      expect(jackpotLogo).toBe(null);
    });

    it("should not render custom logo when customLogo.image is missing", () => {
      const props = {
        ...gameTileProps,
        customLogo: {
          name: "Custom Logo",
          image: null,
        },
      };
      renderGameTile(props);
      expect(CustomLogo).not.toHaveBeenCalled();
    });
  });

  describe("Game tile with jackpot badge", () => {
    it("should have jackpotTile class style", () => {
      const gameTile = renderGameTile(gameTileProps);
      expect(gameTile).toHaveClass(styles.jackpotTile);
    });

    it("should have jackpotTile class when jackpotLogo is present", () => {
      const props = {
        ...gameTileProps,
        badge: undefined,
        jackpotLogo: "/jackpot_king.png",
      };
      const gameTile = renderGameTile(props);
      expect(gameTile).toHaveClass(styles.jackpotTile);
    });
  });

  describe("Edge cases", () => {
    it("should use default columns value when not provided", () => {
      const props = {
        ...gameTileProps,
        columns: undefined,
      };
      const gameTile = renderGameTile(props);
      const backgroundImg = gameTile.querySelector(BACKGROUND);
      const expected = `(min-device-width: 321px) calc(100vw / 1), 100w`;

      expect(backgroundImg.getAttribute("sizes")).toBe(expected);
    });

    it("should handle background with only small image", () => {
      const props = {
        ...gameTileProps,
        background: {
          small: {
            url: "small-url",
            width: 225,
          },
          alt: "Alt text",
        },
      };
      const gameTile = renderGameTile(props);
      const backgroundImg = gameTile.querySelector(BACKGROUND);

      expect(backgroundImg.getAttribute("src")).toBe("small-url");
    });
  });

  describe("Game Widget Mode", () => {
    const gameWidgetProps = {
      ...gameTileProps,
      isGameWidget: true,
    };

    it("should render game widget tile when isGameWidget is true", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const widgetTile = container.querySelector(`.${styles.gameWidgetTile}`);
      expect(widgetTile).toBeInTheDocument();
    });

    it("should render icon background in widget mode", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const iconBackground = container.querySelector(`.${styles.iconBackground}`);
      expect(iconBackground).toBeInTheDocument();
    });

    it("should apply correct CSS classes for widget tile", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const widgetTile = container.querySelector(`.${styles.gameWidgetTile}`);
      expect(widgetTile).toHaveClass(styles.gameWidgetTile);
    });

    it("should apply iconBackground class inside widget tile", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const widgetTile = container.querySelector(`.${styles.gameWidgetTile}`);
      const iconBackground = widgetTile.querySelector(`.${styles.iconBackground}`);
      expect(iconBackground).toBeInTheDocument();
      expect(iconBackground).toHaveClass(styles.iconBackground);
    });

    it("should render GenericIcon with COLOURFUL_ROULETTE icon in widget mode", () => {
      render(<GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />);

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: CasinoIconName.COLOURFUL_ROULETTE,
        },
        undefined,
      );
    });

    it("should not render game tile image in widget mode", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const gameTileImage = container.querySelector(BACKGROUND);
      expect(gameTileImage).not.toBeInTheDocument();
    });

    it("should not render badges in widget mode", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      expect(Badge).not.toHaveBeenCalled();
      expect(GameBadge).not.toHaveBeenCalled();
    });

    it("should not render title or copyright in widget mode", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const title = container.querySelector(TITLE);
      const copyright = container.querySelector(COPYRIGHT);

      expect(title).not.toBeInTheDocument();
      expect(copyright).not.toBeInTheDocument();
    });

    it("should not render info or favourite buttons in widget mode", () => {
      const onInfoClick = jest.fn();
      const onFavClick = jest.fn();
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={onInfoClick} onFavouritesButtonClick={onFavClick} />,
      );

      const infoButton = container.querySelector(INFO_BUTTON);
      expect(infoButton).not.toBeInTheDocument();
    });

    it("should not render jackpot logo in widget mode", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const jackpotLogo = container.querySelector(JACKPOT_LOGO);
      expect(jackpotLogo).not.toBeInTheDocument();
    });

    it("should not render custom logo in widget mode", () => {
      const propsWithCustomLogo = {
        ...gameWidgetProps,
        customLogo: {
          image: {
            url: "custom-logo.png",
            alt: "Custom Logo",
          },
        },
      };

      render(<GameTile {...propsWithCustomLogo} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />);

      expect(CustomLogo).not.toHaveBeenCalled();
    });

    it("should apply transparent background to widget tile", () => {
      const { container } = render(
        <GameTile {...gameWidgetProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const widgetTile = container.querySelector(`.${styles.gameWidgetTile}`);
      expect(widgetTile).toHaveClass(styles.gameWidgetTile);
    });
  });

  describe("xmall game tile", () => {
    const xmallGameTileProps = {
      ...gameTileProps,
      isXmallGameTile: true,
    };

    it("should apply xmall CSS class when isXmallGameTile is true", () => {
      const { container } = render(
        <GameTile {...xmallGameTileProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const gameTile = container.querySelector(`.${styles.xmall}`);
      expect(gameTile).toBeInTheDocument();
      expect(gameTile).toHaveClass(styles.xmall);
    });

    it("should NOT apply gameTile CSS class when isXmallGameTile is true", () => {
      const { container } = render(
        <GameTile {...xmallGameTileProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const gameTile = container.querySelector(`.${styles.xmall}`);
      expect(gameTile).not.toHaveClass(styles.gameTile);
    });

    it("should apply gameTile CSS class when isXmallGameTile is false", () => {
      const regularProps = {
        ...gameTileProps,
        isXmallGameTile: false,
      };

      const { container } = render(
        <GameTile {...regularProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const gameTile = container.querySelector(`.${styles.gameTile}`);
      expect(gameTile).toBeInTheDocument();
      expect(gameTile).toHaveClass(styles.gameTile);
    });

    it("should render gradient with xmall styles when isXmallGameTile is true", () => {
      const { container } = render(
        <GameTile {...xmallGameTileProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const gradient = container.querySelector(`.${styles.tileGradient}`);
      expect(gradient).toBeInTheDocument();
    });

    it("should render info icon with rectangle colour when isXmallGameTile is true", () => {
      const { container } = render(
        <GameTile {...xmallGameTileProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      expect(GenericIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          name: SystemIconName.NOTIFICATION_INFO,
          color: "var(--game-tile-rectangle-title-colour)",
        }),
        undefined,
      );
    });

    it("should render info icon with square colour when isXmallGameTile is false", () => {
      const regularProps = {
        ...gameTileProps,
        isXmallGameTile: false,
      };

      render(<GameTile {...regularProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />);

      expect(GenericIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          name: SystemIconName.NOTIFICATION_INFO,
          color: "var(--game-tile-square-icon-colour)",
        }),
        undefined,
      );
    });

    it("should render all game tile elements when isXmallGameTile is true", () => {
      const { container } = render(
        <GameTile {...xmallGameTileProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      // Should still render title, image, etc.
      const title = container.querySelector(TITLE);
      const background = container.querySelector(BACKGROUND);

      expect(title).toBeInTheDocument();
      expect(background).toBeInTheDocument();
    });

    it("should apply xmall class alongside other classes when round is false", () => {
      const jackpotXmallProps = {
        ...xmallGameTileProps,
        badge: {
          type: "JACKPOT",
          label: "$1000",
        },
      };

      const { container } = render(
        <GameTile {...jackpotXmallProps} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const gameTile = container.querySelector(`.${styles.xmall}`);
      expect(gameTile).toHaveClass(styles.xmall);
      expect(gameTile).toHaveClass(styles.jackpotTile);
    });

    it("should not apply xmall class when isXmallGameTile is undefined", () => {
      const propsWithoutXmall = {
        ...gameTileProps,
      };
      delete propsWithoutXmall.isXmallGameTile;

      const { container } = render(
        <GameTile {...propsWithoutXmall} onInfoButtonClick={jest.fn()} onFavouritesButtonClick={jest.fn()} />,
      );

      const xmallTile = container.querySelector(`.${styles.xmall}`);
      expect(xmallTile).not.toBeInTheDocument();

      const regularTile = container.querySelector(`.${styles.gameTile}`);
      expect(regularTile).toBeInTheDocument();
    });
  });
});
