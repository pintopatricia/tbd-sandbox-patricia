import "jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { useFavouriteGamesErrorToast } from "../../hooks/useFavouriteGamesErrorToast";
import { ErrorToast } from "../ErrorToast/ErrorToast.web";
import ConnectedGameInfo from "./GameInfo.web";

const gameInfoMock = jest.fn(() => <div data-testid="game-info-mock" />);

jest.mock("./snowflakes/GameInfo/GameInfo.web", () => ({
  GameInfo: (props) => gameInfoMock(props),
}));

jest.mock("../../view-model-factories/game", () => ({
  getLaunchUrl: jest.fn(() => "launchURL"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
  })),
}));

jest.mock("../../hooks/useFavouriteGamesErrorToast", () => ({
  useFavouriteGamesErrorToast: jest.fn(() => ({
    isVisible: false,
    hideToast: jest.fn(),
  })),
}));

jest.mock("../ErrorToast/ErrorToast.web", () => ({
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

const gameInfoProps = {
  title: "Irish Riches",
  i18n: { playNow: "Play Now", rtp: "% RTP" },
  rtp: "96.00%",
  isDemoButtonDisplayed: true,
};

function renderSmartGameInfo(overrides = {}) {
  return render(
    <ConnectedGameInfo
      urn="mock-urn"
      gameUrn="mock-game-urn"
      currencyCode="GBP"
      currencySymbol="£"
      localeCodeBcp47="en-GB"
      gameLaunchId="mock-launch-id"
      providerUid="mock-provider"
      mainProduct="mock-main-product"
      dispatchLaunchGame={jest.fn()}
      dispatchSubscribeToUpdateGameFeedResults={jest.fn()}
      dispatchUnsubscribeToUpdateGameFeedResults={jest.fn()}
      tableNames={["table-1"]}
      jackpotAmount="10.00"
      isBetslipContainerDisplayed={false}
      gameInfoProps={gameInfoProps}
      uid="mock-uid"
      favouriteGamesErrorState={{ timestamp: null, gameId: null }}
      dispatchClearFavouriteGamesError={jest.fn()}
      {...overrides}
    />,
  );
}

describe("Smart GameInfo (ConnectedGameInfo)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useFavouriteGamesErrorToast.mockReturnValue({
      isVisible: false,
      hideToast: jest.fn(),
    });
  });

  it("should render GameInfo with proper props", () => {
    renderSmartGameInfo();

    expect(gameInfoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Irish Riches",
        rtp: "96.00%",
        isDemoButtonDisplayed: true,
        currencySymbol: "£",
        playNowButtonOnClick: expect.any(Function),
        launchUrl: expect.objectContaining({ viewUrl: "launchURL" }),
        launchUrlDemoMode: expect.objectContaining({ viewUrl: "launchURL" }),
        cardRef: expect.any(Function),
      }),
    );
  });

  it("should handle visibility observer callbacks", () => {
    renderSmartGameInfo();
    expect(useVisibilityObserver).toHaveBeenCalled();
  });

  it("should call dispatchLaunchGame with correct args for demo and real launch", () => {
    const dispatchLaunchGame = jest.fn();
    renderSmartGameInfo({ dispatchLaunchGame });

    const playNowFn = gameInfoMock.mock.calls[0][0].playNowButtonOnClick;

    playNowFn(true);
    expect(dispatchLaunchGame).toHaveBeenCalledWith(
      expect.objectContaining({ viewUrl: "launchURL" }),
      "mock-urn",
      "mock-game-urn",
      expect.any(String),
    );

    playNowFn(false);
    expect(dispatchLaunchGame).toHaveBeenCalledTimes(2);
  });

  it("should return null if urn is missing", () => {
    const { container } = renderSmartGameInfo({ urn: null });
    expect(container.firstChild).toBeNull();
  });

  describe("Error Toast functionality", () => {
    it("should call useFavouriteGamesErrorToast with correct parameters", () => {
      const dispatchClearFavouriteGamesError = jest.fn();

      renderSmartGameInfo({
        uid: "game-123",
        favouriteGamesErrorState: {
          timestamp: 123456789,
          gameId: "game-123",
        },
        dispatchClearFavouriteGamesError,
      });

      expect(useFavouriteGamesErrorToast).toHaveBeenCalledWith({
        errorTimestamp: 123456789,
        errorGameId: "game-123",
        gameId: "game-123",
        onDismiss: dispatchClearFavouriteGamesError,
      });
    });

    it("should not render ErrorToast when isVisible is false", () => {
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: false,
        hideToast: jest.fn(),
      });

      renderSmartGameInfo();

      expect(screen.queryByTestId("error-toast")).toBeNull();
    });

    it("should render ErrorToast when isVisible is true", () => {
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: true,
        hideToast: jest.fn(),
      });

      renderSmartGameInfo();

      expect(screen.getByTestId("error-toast")).not.toBeNull();
    });

    it("should call hideToast when ErrorToast onClose is triggered", () => {
      const mockHideToast = jest.fn();
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: true,
        hideToast: mockHideToast,
      });

      renderSmartGameInfo();

      expect(ErrorToast).toHaveBeenCalledWith(
        {
          message: "Failed to update favourite games",
          onClose: mockHideToast,
        },
        undefined,
      );
    });

    it("should handle null favouriteGamesErrorState gracefully", () => {
      renderSmartGameInfo({
        favouriteGamesErrorState: undefined,
      });

      expect(useFavouriteGamesErrorToast).toHaveBeenCalledWith({
        errorTimestamp: null,
        errorGameId: null,
        gameId: "mock-uid",
        onDismiss: expect.any(Function),
      });
    });
  });
});
