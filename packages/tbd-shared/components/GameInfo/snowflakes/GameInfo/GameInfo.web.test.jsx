import { render, fireEvent } from "@testing-library/react";
import { RichTextType } from "@ppb/the-wall-common/types";
import { GameInfo } from "./GameInfo.web";

jest.mock("@ppb/the-wall-web", () => ({
  RichTextComponent: jest.fn(() => <rich-text-mock />),
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
  PrimaryButton: ({ label, onTap }) => <button onClick={onTap}>{label}</button>,
  SecondaryButton: ({ label, onTap }) => <button onClick={onTap}>{label}</button>,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: ({ name }) => <span data-testid="generic-icon" data-icon-name={name} />,
}));

jest.mock("./components/Pill/Pill.web", () => ({
  Pill: ({ label }) => <div data-testid="pill">{label}</div>,
}));

jest.mock("./components/GameInfoCarousel/GameInfoCarousel.web", () => ({
  GameInfoCarousel: jest.fn(() => <div data-testid="carousel-mock" />),
}));

jest.mock("./components/TableRow/TableRow.web", () => ({
  __esModule: true,
  default: ({ label, value, href }) => (
    <div data-testid="table-row">
      <span>{label}</span>
      {href ? (
        <a href={href} data-testid="table-row-link">
          {label}
        </a>
      ) : (
        <span>{value}</span>
      )}
    </div>
  ),
}));

jest.mock("../../iconMapper", () => ({
  getIconByKey: jest.fn(() => null),
}));

const i18nMock = {
  playNow: "Play Now",
  rtp: "RTP",
  volatility: "Volatility",
  description: "How to play",
  glance: "At a glance",
  gameHelp: "Game Help",
};

const fullProps = {
  title: "Game Title",
  rtp: "95%",
  gameType: "Slot",
  gameVolatility: "High",
  gameMechanics: ["Megaways"],
  gameStudio: "Awesome Studio",
  gameTheme: "Adventure",
  jackpotType: "Progressive",
  gameHelp: "https://help.example.com",
  howToPlayDetails: {
    content: [{ text: "Step 1", type: RichTextType.LIST_ITEM, spans: [] }],
  },
  i18n: i18nMock,
  isDemoButtonDisplayed: true,
  playNowButtonOnClick: jest.fn(),
  launchUrl: "/play",
  launchUrlDemoMode: "/demo",
  screenshots: [],
  currencySymbol: "£",
  minStake: "0.10",
  maxStake: "100",
};

describe("GameInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders game title", () => {
    const { getByText } = render(<GameInfo {...fullProps} />);
    expect(getByText("Game Title")).toBeTruthy();
  });

  it("renders RTP, game type and volatility as pills", () => {
    const { getAllByTestId } = render(<GameInfo {...fullProps} />);
    const pills = getAllByTestId("pill").map((pill) => pill.textContent);
    expect(pills).toContain("RTP 95%");
    expect(pills).toContain("Slot");
    expect(pills).toContain("High Volatility");
  });

  it("renders table rows including game help link", () => {
    const { getAllByTestId, getByTestId } = render(<GameInfo {...fullProps} />);
    const rows = getAllByTestId("table-row").map((row) => row.textContent);
    expect(rows).toEqual(
      expect.arrayContaining([
        expect.stringContaining("Megaways"),
        expect.stringContaining("Awesome Studio"),
        expect.stringContaining("Adventure"),
        expect.stringContaining("Progressive"),
        expect.stringContaining("Game Help"),
      ]),
    );

    const helpLink = getByTestId("table-row-link");
    expect(helpLink.tagName).toBe("A");
    expect(helpLink.getAttribute("href")).toBe("https://help.example.com");
    expect(helpLink.textContent).toBe("Game Help");
  });

  it("renders the GameInfoCarousel with image and screenshots", () => {
    const propsWithScreenshots = {
      ...fullProps,
      screenshots: [
        {
          imageUrl: "https://fake/image.jpg",
          thumbnailUrl: "https://fake/thumb.jpg",
          altText: "Screenshot 1",
        },
      ],
    };

    const { getByTestId } = render(<GameInfo {...propsWithScreenshots} />);
    expect(getByTestId("carousel-mock")).toBeTruthy();
  });

  it("renders both buttons when demo is displayed", () => {
    const { getByText } = render(<GameInfo {...fullProps} />);
    expect(getByText("Demo")).toBeTruthy();
    expect(getByText("Play Now")).toBeTruthy();
  });

  it("triggers button callbacks correctly", () => {
    const { getByText } = render(<GameInfo {...fullProps} />);
    fireEvent.click(getByText("Demo"));
    fireEvent.click(getByText("Play Now"));
    expect(fullProps.playNowButtonOnClick).toHaveBeenCalledWith(true);
    expect(fullProps.playNowButtonOnClick).toHaveBeenCalledWith(false);
  });

  it("renders table rows with min/max stake including currency symbol", () => {
    const propsWithStakes = {
      ...fullProps,
      currencySymbol: "£",
      minStake: "0.10",
      maxStake: "100",
    };

    const { getAllByTestId } = render(<GameInfo {...propsWithStakes} />);
    const rows = getAllByTestId("table-row").map((row) => row.textContent);

    expect(rows).toEqual(expect.arrayContaining([expect.stringContaining("£0.10"), expect.stringContaining("£100")]));
  });

  describe("Favorite button functionality", () => {
    describe("when user is logged in and feature is enabled", () => {
      it("should render favorite button with outline heart when not favorite", () => {
        const props = {
          ...fullProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
          gameLaunchId: "game123",
          mainProduct: "arcade",
          dispatchAddToFavouriteGames: jest.fn(),
          dispatchRemoveFromFavouriteGames: jest.fn(),
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');

        expect(icon).toBeTruthy();
        expect(icon.getAttribute("data-icon-name")).toBe("System--heart-outline");
      });

      it("should render favorite button with filled heart when already favorite", () => {
        const props = {
          ...fullProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: true,
          gameLaunchId: "game123",
          dispatchAddToFavouriteGames: jest.fn(),
          dispatchRemoveFromFavouriteGames: jest.fn(),
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');

        expect(icon).toBeTruthy();
        expect(icon.getAttribute("data-icon-name")).toBe("System--heart-filled");
      });

      it("should call dispatchAddToFavouriteGames with tagging data when clicking favorite button on non-favorite game", () => {
        const dispatchAddToFavouriteGames = jest.fn();
        const dispatchRemoveFromFavouriteGames = jest.fn();

        const props = {
          ...fullProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
          gameLaunchId: "game123",
          gameName: "Starburst",
          gameProviderName: "NetEnt",
          mainProduct: "arcade",
          urn: "urn:game:card:1",
          dispatchAddToFavouriteGames,
          dispatchRemoveFromFavouriteGames,
          uid: "game123",
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');
        const favoriteButton = icon.closest("button");

        fireEvent.click(favoriteButton);

        expect(dispatchAddToFavouriteGames).toHaveBeenCalledWith(
          "game123",
          "arcade",
          "Starburst",
          "NetEnt",
          "urn:game:card:1",
        );
        expect(dispatchRemoveFromFavouriteGames).not.toHaveBeenCalled();
      });

      it("should call dispatchRemoveFromFavouriteGames with tagging data when clicking favorite button on favorite game", () => {
        const dispatchAddToFavouriteGames = jest.fn();
        const dispatchRemoveFromFavouriteGames = jest.fn();

        const props = {
          ...fullProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: true,
          gameLaunchId: "game123",
          gameName: "Book of Dead",
          gameProviderName: "Play'n GO",
          mainProduct: "arcade",
          urn: "urn:game:card:2",
          dispatchAddToFavouriteGames,
          dispatchRemoveFromFavouriteGames,
          uid: "game123",
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');
        const favoriteButton = icon.closest("button");

        fireEvent.click(favoriteButton);

        expect(dispatchRemoveFromFavouriteGames).toHaveBeenCalledWith(
          "game123",
          "arcade",
          "Book of Dead",
          "Play'n GO",
          "urn:game:card:2",
        );
        expect(dispatchAddToFavouriteGames).not.toHaveBeenCalled();
      });

      it("should use onFavouritesButtonClick prop if provided instead of dispatch functions", () => {
        const onFavouritesButtonClick = jest.fn();
        const dispatchAddToFavouriteGames = jest.fn();
        const dispatchRemoveFromFavouriteGames = jest.fn();

        const props = {
          ...fullProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
          gameLaunchId: "game123",
          onFavouritesButtonClick,
          dispatchAddToFavouriteGames,
          dispatchRemoveFromFavouriteGames,
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');
        const favoriteButton = icon.closest("button");

        fireEvent.click(favoriteButton);

        expect(onFavouritesButtonClick).toHaveBeenCalled();
        expect(dispatchAddToFavouriteGames).not.toHaveBeenCalled();
        expect(dispatchRemoveFromFavouriteGames).not.toHaveBeenCalled();
      });
    });

    describe("when user is not logged in", () => {
      it("should not render favorite button", () => {
        const props = {
          ...fullProps,
          isLoggedIn: false,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
          gameLaunchId: "game123",
          dispatchAddToFavouriteGames: jest.fn(),
          dispatchRemoveFromFavouriteGames: jest.fn(),
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');

        expect(icon).toBeFalsy();
      });
    });

    describe("when feature is not enabled", () => {
      it("should not render favorite button", () => {
        const props = {
          ...fullProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: false,
          isFavourite: false,
          gameLaunchId: "game123",
          dispatchAddToFavouriteGames: jest.fn(),
          dispatchRemoveFromFavouriteGames: jest.fn(),
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');

        expect(icon).toBeFalsy();
      });
    });

    describe("when no handler is provided", () => {
      it("should not render favorite button", () => {
        const props = {
          ...fullProps,
          isLoggedIn: true,
          isFavouriteGamesEnabled: true,
          isFavourite: false,
          gameLaunchId: "game123",
        };

        const { container } = render(<GameInfo {...props} />);
        const icon = container.querySelector('[data-testid="generic-icon"]');

        expect(icon).toBeFalsy();
      });
    });
  });

  describe("Edge cases and optional props", () => {
    it("should not render demo button when isDemoButtonDisplayed is false", () => {
      const props = {
        ...fullProps,
        isDemoButtonDisplayed: false,
      };

      const { queryByText } = render(<GameInfo {...props} />);
      expect(queryByText("Demo")).toBeFalsy();
      expect(queryByText("Play Now")).toBeTruthy();
    });

    it("should not render pills when all pill data is missing", () => {
      const props = {
        ...fullProps,
        rtp: undefined,
        gameType: undefined,
        gameVolatility: undefined,
      };

      const { queryAllByTestId } = render(<GameInfo {...props} />);
      expect(queryAllByTestId("pill")).toHaveLength(0);
    });

    it("should not render table when all values are empty", () => {
      const props = {
        ...fullProps,
        gameMechanics: undefined,
        gameStudio: undefined,
        gameTheme: undefined,
        jackpotType: undefined,
        gameHelp: undefined,
        minStake: undefined,
        maxStake: undefined,
      };

      const { queryByText } = render(<GameInfo {...props} />);
      expect(queryByText("At a glance")).toBeFalsy();
    });

    it("should not render how to play section when content is missing", () => {
      const props = {
        ...fullProps,
        howToPlayDetails: undefined,
      };

      const { queryByText } = render(<GameInfo {...props} />);
      expect(queryByText("How to play")).toBeFalsy();
    });

    it("should not render how to play section when content is empty", () => {
      const props = {
        ...fullProps,
        howToPlayDetails: { content: null },
      };

      const { queryByText } = render(<GameInfo {...props} />);
      expect(queryByText("How to play")).toBeFalsy();
    });

    it("should not render game help row when gameHelp is not provided", () => {
      const props = {
        ...fullProps,
        gameHelp: undefined,
      };

      const { queryByText } = render(<GameInfo {...props} />);
      expect(queryByText("Game Help")).toBeFalsy();
    });

    it("should render only RTP pill when only RTP is provided", () => {
      const props = {
        ...fullProps,
        gameType: undefined,
        gameVolatility: undefined,
      };

      const { getAllByTestId } = render(<GameInfo {...props} />);
      const pills = getAllByTestId("pill");
      expect(pills).toHaveLength(1);
      expect(pills[0].textContent).toBe("RTP 95%");
    });

    it("should apply custom className to button container", () => {
      const props = {
        ...fullProps,
        className: "custom-class",
      };

      const { getByText } = render(<GameInfo {...props} />);
      const playButton = getByText("Play Now");
      const buttonContainer = playButton.closest("div");

      expect(buttonContainer.className).toContain("custom-class");
    });

    it("should render table rows only for properties with non-empty values", () => {
      const props = {
        ...fullProps,
        gameMechanics: ["Megaways"],
        gameStudio: "",
        gameTheme: "   ",
        jackpotType: "Progressive",
      };

      const { getAllByTestId } = render(<GameInfo {...props} />);
      const rows = getAllByTestId("table-row").map((row) => row.textContent);

      expect(rows).toEqual(
        expect.arrayContaining([expect.stringContaining("Megaways"), expect.stringContaining("Progressive")]),
      );
      expect(rows.some((row) => row.includes("Awesome Studio"))).toBe(false);
    });

    it("should pass cardRef to the container div", () => {
      const ref = { current: null };
      const props = {
        ...fullProps,
        cardRef: ref,
      };

      render(<GameInfo {...props} />);
      expect(ref.current).toBeTruthy();
    });
  });
});
