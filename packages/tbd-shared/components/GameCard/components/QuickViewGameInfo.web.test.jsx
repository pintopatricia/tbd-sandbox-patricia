import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { BadgeType } from "@ppb/the-wall-web/types";
import { Provider } from "react-redux";
import QuickViewGameInfo from "./QuickViewGameInfo.web";
import { useFavouriteGamesErrorToast } from "../../../hooks/useFavouriteGamesErrorToast";
import { ErrorToast } from "../../ErrorToast/ErrorToast.web";

jest.mock("../../GameInfo/GameInfo.web", () => {
  const MockGameInfo = () => <div data-testid="mocked-smart-game-info" />;
  MockGameInfo.displayName = "MockGameInfo";
  return MockGameInfo;
});
jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: () => <div data-testid="close-icon" />,
}));
jest.mock("@ppb/the-wall-icons", () => ({
  SystemIconName: { CLOSE: "close" },
}));
jest.mock("../../RegulatoryCard/RegulatoryCard.web", () => ({
  __esModule: true,
  default: () => <div data-testid="mocked-regulatory-card" />,
}));

jest.mock("../../../hooks/useFavouriteGamesErrorToast", () => ({
  useFavouriteGamesErrorToast: jest.fn(() => ({
    isVisible: false,
    hideToast: jest.fn(),
  })),
}));

jest.mock("../../ErrorToast/ErrorToast.web", () => ({
  ErrorToast: jest.fn((props) => (
    <div
      data-testid="error-toast"
      onClick={props.onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          props.onClose();
        }
      }}
      role="button"
      tabIndex={0}
    />
  )),
}));

const store = {
  getState: () => ({
    layouts: { cards: { regulatory: [] } },
    entities: { throttles: {} },
    app: { isLoggedIn: true },
    user: { currency: "GBP" },
    brandSettings: {},
  }),
  subscribe: jest.fn(),
  dispatch: jest.fn(),
};

const defaultProps = {
  urn: "fakeUrn",
  gameUrn: "fakeGameUrn",
  isLoggedIn: true,
  mainProduct: "arcade",
  gameLaunchId: "game123",
  providerUid: "providerX",
  currencyCode: "GBP",
  currencySymbol: "£",
  localeCode: "en-GB",
  jackpotAmount: "5000",
  tableNames: ["roulette"],
  isBetslipContainerDisplayed: false,
  gameInfoProps: {
    title: "Hot Jackpot",
    i18n: { playNow: "Play Now" },
    isDemoButtonDisplayed: true,
    badge: { type: BadgeType.JACKPOT },
  },
  dispatchLaunchGame: jest.fn(),
  dispatchSubscribeToUpdateGameFeedResults: jest.fn(),
  dispatchUnsubscribeToUpdateGameFeedResults: jest.fn(),
  onClose: jest.fn(),
  uid: "game123",
  gameName: "Hot Jackpot",
  gameProviderName: "Test Provider",
  favouriteGamesErrorState: {
    timestamp: null,
    gameId: null,
  },
  dispatchClearFavouriteGamesError: jest.fn(),
};

describe("QuickViewGameInfo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFavouriteGamesErrorToast.mockReturnValue({
      isVisible: false,
      hideToast: jest.fn(),
    });
  });

  it("renders the smart GameInfo component", () => {
    render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} />
      </Provider>,
    );
    expect(screen.getByTestId("mocked-smart-game-info")).not.toBeNull();
  });

  it("returns null if urn is missing", () => {
    const { container } = render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} urn={null} />
      </Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls onClose when clicking the overlay background", () => {
    render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} />
      </Provider>,
    );

    const overlay = screen.getByTestId("quickview-overlay");
    fireEvent.click(overlay);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("does NOT call onClose if event target is different from currentTarget", () => {
    render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} />
      </Provider>,
    );

    const overlay = screen.getByTestId("quickview-overlay");
    const fakeChild = document.createElement("div");

    const fakeEvent = {
      stopPropagation: jest.fn(),
      target: fakeChild,
      currentTarget: overlay,
    };

    overlay.onclick(fakeEvent);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(0);
  });

  it("calls onClose on overlay keyDown with Enter or Space", () => {
    render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} />
      </Provider>,
    );

    const overlay = screen.getByTestId("quickview-overlay");

    fireEvent.keyDown(overlay, { key: "Enter" });
    fireEvent.keyDown(overlay, { key: " " });

    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });

  it("calls onClose on close button click", () => {
    render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} />
      </Provider>,
    );

    const closeButton = screen.getByTestId("close-icon").parentElement;
    fireEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("calls onClose on close button keyDown (Enter and Space)", () => {
    render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} />
      </Provider>,
    );

    const closeButton = screen.getByTestId("close-icon").parentElement;
    fireEvent.keyDown(closeButton, { key: "Enter" });
    fireEvent.keyDown(closeButton, { key: " " });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });

  it("renders game title in header after scrolling", async () => {
    render(
      <Provider store={store}>
        <QuickViewGameInfo {...defaultProps} />
      </Provider>,
    );

    const scrollContainer = screen.getByTestId("scroll-container");
    expect(screen.queryByText("Hot Jackpot")).toBeNull();

    fireEvent.scroll(scrollContainer, { target: { scrollTop: 200 } });

    await waitFor(() => {
      expect(screen.getByText("Hot Jackpot")).not.toBeNull();
    });
  });

  describe("Error Toast functionality", () => {
    it("should call useFavouriteGamesErrorToast with correct parameters", () => {
      const propsWithError = {
        ...defaultProps,
        favouriteGamesErrorState: {
          timestamp: 123456789,
          gameId: "game123",
        },
      };

      render(
        <Provider store={store}>
          <QuickViewGameInfo {...propsWithError} />
        </Provider>,
      );

      expect(useFavouriteGamesErrorToast).toHaveBeenCalledWith({
        errorTimestamp: 123456789,
        errorGameId: "game123",
        gameId: "game123",
        onDismiss: defaultProps.dispatchClearFavouriteGamesError,
      });
    });

    it("should not render ErrorToast when isVisible is false", () => {
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: false,
        hideToast: jest.fn(),
      });

      render(
        <Provider store={store}>
          <QuickViewGameInfo {...defaultProps} />
        </Provider>,
      );

      expect(screen.queryByTestId("error-toast")).toBeNull();
    });

    it("should render ErrorToast when isVisible is true", () => {
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: true,
        hideToast: jest.fn(),
      });

      render(
        <Provider store={store}>
          <QuickViewGameInfo {...defaultProps} />
        </Provider>,
      );

      expect(screen.getByTestId("error-toast")).not.toBeNull();
    });

    it("should call hideToast when ErrorToast onClose is triggered", () => {
      const mockHideToast = jest.fn();
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: true,
        hideToast: mockHideToast,
      });

      render(
        <Provider store={store}>
          <QuickViewGameInfo {...defaultProps} />
        </Provider>,
      );

      const errorToast = screen.getByTestId("error-toast");
      fireEvent.click(errorToast);

      expect(mockHideToast).toHaveBeenCalled();
    });

    it("should handle null favouriteGamesErrorState gracefully", () => {
      const propsWithNullError = {
        ...defaultProps,
        favouriteGamesErrorState: undefined,
      };

      render(
        <Provider store={store}>
          <QuickViewGameInfo {...propsWithNullError} />
        </Provider>,
      );

      expect(useFavouriteGamesErrorToast).toHaveBeenCalledWith({
        errorTimestamp: null,
        errorGameId: null,
        gameId: "game123",
        onDismiss: defaultProps.dispatchClearFavouriteGamesError,
      });
    });
  });
});
