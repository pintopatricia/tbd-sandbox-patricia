import "jest-dom/extend-expect";
import { act, render } from "@testing-library/react";
import { Link } from "@ppb/the-wall-web";
import { GameTile } from "./snowflakes/GameTile/GameTile.web";
import { updateSeenGames, getStoredNewestReleasedGames } from "../../helpers/gaming-new-releases.web";
import {
  incrementFavouritesNotification,
  decrementFavouritesNotification,
} from "../../helpers/gaming-favourites-notifications.web";
import { getImagePath } from "../../view-model-factories/game.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import ConnectedGameCard from "./GameCard.web";
import QuickViewGameInfoMock from "./components/QuickViewGameInfo.web";
import { updateGamingSearchHistory } from "../../helpers/search-history-helper.web";
import { useFavouriteGamesErrorToast } from "../../hooks/useFavouriteGamesErrorToast";
import { ErrorToast } from "../ErrorToast/ErrorToast.web";

jest.mock("@ppb/the-wall-web", () => ({
  Link: jest.fn((props) => <link-mock {...props} />),
  GameTileContainerLayout: {
    SQUARE: "SQUARE",
    RECTANGLE: "RECTANGLE",
  },
}));
jest.mock("../../helpers/gaming-new-releases.web", () => ({
  updateSeenGames: jest.fn(),
  getStoredNewestReleasedGames: jest.fn().mockReturnValue([]),
}));

jest.mock("../../helpers/gaming-favourites-notifications.web", () => ({
  incrementFavouritesNotification: jest.fn(),
  decrementFavouritesNotification: jest.fn(),
}));

jest.mock("../../helpers/search-history-helper.web", () => ({
  updateGamingSearchHistory: jest.fn(),
}));

jest.mock("../../config/endpoints.ts", () => ({
  getBasePath: jest.fn().mockReturnValue("/mocked/base/path"),
}));

jest.mock("./snowflakes/GameTile/GameTile.web", () => ({
  GameTile: jest.fn((props) => <game-tile-mock {...props} />),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("£50"),
}));

jest.mock("../../view-model-factories/game", () => ({
  getLaunchUrl: jest.fn((gameLaunchId, providerUid) => {
    if (gameLaunchId && providerUid === "pt-sportsgaming-live") {
      return "https://example.com&switchedToNewTab=true";
    }
    return "fakeLaunchURL";
  }),
}));

jest.mock("../../view-model-factories/game.web", () => ({
  getImagePath: jest.fn().mockReturnValue("fakeJackpotLogoPath"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));

jest.mock("./components/QuickViewGameInfo.web", () => ({
  __esModule: true,
  default: jest.fn((props) => <quick-view-mock {...props} />),
}));

jest.mock("../../hooks/useFavouriteGamesErrorToast", () => ({
  useFavouriteGamesErrorToast: jest.fn(() => ({
    isVisible: false,
    hideToast: jest.fn(),
  })),
}));

jest.mock("../ErrorToast/ErrorToast.web", () => ({
  ErrorToast: jest.fn((props) => <error-toast-mock {...props} />),
}));

function renderConnectedGameCard(
  gameTileProps,
  dispatchProps,
  tableNames,
  gameLaunchId = "gameLaunchId",
  providerUid = "providerUid",
  mainProduct = "mainProduct",
  urn = "fakeUrn",
  gameUrn = "fakeGameUrn/test",
  gameInfoViewUrl = { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
  currencyCode = "GBP",
  currencySymbol = "£",
  isLoggedIn = undefined,
  isFavourite = undefined,
  isFavouriteGamesEnabled = undefined,
  uid = "gameLaunchId",
  favouriteGamesErrorState = { timestamp: null, gameId: null },
  isGameWidget = false,
) {
  return render(
    <ConnectedGameCard
      gameTileProps={gameTileProps}
      gameInfoViewUrl={gameInfoViewUrl}
      gameLaunchId={gameLaunchId}
      gameName="Test Game"
      gameProviderName="Test Provider"
      providerUid={providerUid}
      mainProduct={mainProduct}
      layout="RECTANGLE"
      isRoundGameTile={false}
      urn={urn}
      gameUrn={gameUrn}
      dispatchLaunchGame={dispatchProps.dispatchLaunchGame}
      dispatchLaunchGameFromWidget={dispatchProps.dispatchLaunchGameFromWidget}
      dispatchNavigateToGameInfoView={dispatchProps.dispatchNavigateToGameInfoView}
      dispatchRemoveFromFavouriteGames={dispatchProps.dispatchRemoveFromFavouriteGames}
      dispatchAddToFavouriteGames={dispatchProps.dispatchAddToFavouriteGames}
      dispatchPushAction={dispatchProps.dispatchPushAction}
      dispatchSubscribeToUpdateGameFeedResults={dispatchProps.dispatchSubscribeToUpdateGameFeedResults}
      dispatchUnsubscribeToUpdateGameFeedResults={dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults}
      dispatchClearFavouriteGamesError={dispatchProps.dispatchClearFavouriteGamesError}
      tableNames={tableNames}
      currencyCode={currencyCode}
      currencySymbol={currencySymbol}
      isLoggedIn={isLoggedIn}
      isFavourite={isFavourite}
      isFavouriteGamesEnabled={isFavouriteGamesEnabled}
      uid={uid}
      favouriteGamesErrorState={favouriteGamesErrorState}
      isGameWidget={isGameWidget}
    />,
  );
}

const gameTileProps = {
  urn: "urn:tbd:card:1",
  name: "Cleopatra Gold",
  launchId: "1234",
  rgsCodeMobile: "200-1503-001",
  provider: "gp-ig",
  mainProduct: "arcade",
  badge: {
    label: "BADGE MOCK",
    type: "REGULAR",
  },
  gameInfoViewLink: {
    viewUrn: "fakeUrn",
    viewUrl: "fakeUrl",
  },
  currencyCode: "GBP",
  countryCode: "RO",
  localeCode: "EN",
};

const dispatchProps = {
  dispatchLaunchGame: jest.fn(),
  dispatchLaunchGameFromWidget: jest.fn(),
  dispatchNavigateToGameInfoView: jest.fn(),
  dispatchRemoveFromFavouriteGames: jest.fn(),
  dispatchAddToFavouriteGames: jest.fn(),
  dispatchPushAction: jest.fn(),
  dispatchSubscribeToUpdateGameFeedResults: jest.fn(),
  dispatchUnsubscribeToUpdateGameFeedResults: jest.fn(),
  dispatchClearFavouriteGamesError: jest.fn(),
};

describe("Connected Game Tile", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when component props are available", () => {
    it("updateSeenGames should be called", () => {
      renderConnectedGameCard(gameTileProps, dispatchProps);
      expect(updateSeenGames).toHaveBeenCalledWith("test");
    });

    it("should display the Game Tile component", () => {
      renderConnectedGameCard(gameTileProps, dispatchProps);

      expect(GameTile).toHaveBeenCalledWith(
        {
          launchId: "1234",
          mainProduct: "arcade",
          name: "Cleopatra Gold",
          provider: "gp-ig",
          rgsCodeMobile: "200-1503-001",
          urn: "urn:tbd:card:1",
          gameInfoViewLink: {
            viewUrl: "fakeUrl",
            viewUrn: "fakeUrn",
          },
          badge: {
            label: "BADGE MOCK",
            type: "REGULAR",
          },
          gameDetailsUrl: "/mocked/base/pathgameInfoFakeViewUrl",
          isRoundGameTile: false,
          onInfoButtonClick: expect.any(Function),
          onFavouritesButtonClick: expect.any(Function),
          countryCode: "RO",
          currencyCode: "GBP",
          localeCode: "EN",
          jackpotLogo: "fakeJackpotLogoPath",
          isFavourite: undefined,
          isFavouriteGamesEnabled: undefined,
          isLoggedIn: undefined,
          isGameWidget: false,
        },
        undefined,
      );
    });

    it("should set target to '_blank' if viewUrl contains 'switchedToNewTab'", () => {
      const modifiedGameInfoViewUrl = {
        viewUrn: "fakeUrn",
        viewUrl: "https://example.com&switchedToNewTab=true",
      };

      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "pt-sportsgaming-live",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        modifiedGameInfoViewUrl,
      );

      expect(Link.mock.calls[0][0].item.target).toEqual("_blank");
    });

    it("should set target to '_self' if viewUrl does not contain 'switchedToNewTab'", () => {
      const modifiedGameInfoViewUrl = {
        viewUrn: "fakeUrn",
        viewUrl: "http://example.com",
      };

      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "pt-alias-live",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        modifiedGameInfoViewUrl,
      );

      expect(Link.mock.calls[0][0].item.target).toEqual("_self");
    });

    it("correct badge label should be set if the game is newly released", () => {
      gameTileProps.badge = {
        label: 50,
        type: "NEW_REGULAR",
      };
      getStoredNewestReleasedGames.mockReturnValueOnce(["test"]);
      renderConnectedGameCard(gameTileProps, dispatchProps);

      expect(GameTile).toHaveBeenCalledWith(
        {
          launchId: "1234",
          mainProduct: "arcade",
          name: "Cleopatra Gold",
          provider: "gp-ig",
          rgsCodeMobile: "200-1503-001",
          urn: "urn:tbd:card:1",
          gameInfoViewLink: {
            viewUrl: "fakeUrl",
            viewUrn: "fakeUrn",
          },
          badge: {
            label: "I18N.GAME_CARD.BADGE.JUST_LANDED",
            type: "NEW_REGULAR",
          },
          gameDetailsUrl: "/mocked/base/pathgameInfoFakeViewUrl",
          isRoundGameTile: false,
          onInfoButtonClick: expect.any(Function),
          onFavouritesButtonClick: expect.any(Function),
          countryCode: "RO",
          currencyCode: "GBP",
          localeCode: "EN",
          jackpotLogo: "fakeJackpotLogoPath",
          isFavourite: undefined,
          isFavouriteGamesEnabled: undefined,
          isLoggedIn: undefined,
          isGameWidget: false,
        },
        undefined,
      );
    });

    it("should display the GameTile component with jackpot badge and correct jackpot value", () => {
      gameTileProps.badge = {
        label: 50,
        type: "NEW_REGULAR",
      };
      getStoredNewestReleasedGames.mockReturnValueOnce(["test"]);
      renderConnectedGameCard(gameTileProps, dispatchProps);

      expect(GameTile).toHaveBeenCalledWith(
        {
          launchId: "1234",
          mainProduct: "arcade",
          name: "Cleopatra Gold",
          provider: "gp-ig",
          rgsCodeMobile: "200-1503-001",
          urn: "urn:tbd:card:1",
          gameInfoViewLink: {
            viewUrl: "fakeUrl",
            viewUrn: "fakeUrn",
          },
          badge: {
            label: "I18N.GAME_CARD.BADGE.JUST_LANDED",
            type: "NEW_REGULAR",
          },
          gameDetailsUrl: "/mocked/base/pathgameInfoFakeViewUrl",
          isRoundGameTile: false,
          onInfoButtonClick: expect.any(Function),
          onFavouritesButtonClick: expect.any(Function),
          countryCode: "RO",
          currencyCode: "GBP",
          localeCode: "EN",
          jackpotLogo: "fakeJackpotLogoPath",
          isFavourite: undefined,
          isFavouriteGamesEnabled: undefined,
          isLoggedIn: undefined,
          isGameWidget: false,
        },
        undefined,
      );
    });

    it("should call updateGamingSearchHistory if inputSearchTerm exists", () => {
      render(
        <ConnectedGameCard
          gameTileProps={gameTileProps}
          gameInfoViewUrl={{ viewUrn: "urn", viewUrl: "url" }}
          gameLaunchId="gameLaunchId"
          providerUid="providerUid"
          mainProduct="mainProduct"
          layout="RECTANGLE"
          isRoundGameTile={false}
          urn="urn"
          gameUrn="gameUrn"
          dispatchLaunchGame={dispatchProps.dispatchLaunchGame}
          dispatchNavigateToGameInfoView={dispatchProps.dispatchNavigateToGameInfoView}
          dispatchRemoveFromFavouriteGames={dispatchProps.dispatchRemoveFromFavouriteGames}
          dispatchAddToFavouriteGames={dispatchProps.dispatchAddToFavouriteGames}
          dispatchPushAction={dispatchProps.dispatchPushAction}
          dispatchSubscribeToUpdateGameFeedResults={dispatchProps.dispatchSubscribeToUpdateGameFeedResults}
          dispatchUnsubscribeToUpdateGameFeedResults={dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults}
          dispatchClearFavouriteGamesError={dispatchProps.dispatchClearFavouriteGamesError}
          tableNames={[]}
          currencyCode="GBP"
          currencySymbol="£"
          inputSearchTerm="test"
          gameInfoProps={{ title: "Mock Game Info" }}
          isBetslipContainerDisplayed={false}
          favouriteGamesErrorState={{ timestamp: null, gameId: null }}
        />,
      );
      const { onClick } = Link.mock.calls[0][0];
      onClick();

      expect(updateGamingSearchHistory).toHaveBeenCalledWith("test");
    });

    it("should display the GameTile component with jackpot badge and no value", () => {
      gameTileProps.badge = {
        type: "JACKPOT",
      };
      renderConnectedGameCard(gameTileProps, dispatchProps);

      expect(GameTile).toHaveBeenCalledWith(
        {
          urn: "urn:tbd:card:1",
          name: "Cleopatra Gold",
          launchId: "1234",
          rgsCodeMobile: "200-1503-001",
          provider: "gp-ig",
          mainProduct: "arcade",
          isRoundGameTile: false,
          gameInfoViewLink: {
            viewUrl: "fakeUrl",
            viewUrn: "fakeUrn",
          },
          badge: {
            label: "I18N.GAME_CARD.BADGE.JACKPOT",
            type: "JACKPOT",
          },
          countryCode: "RO",
          currencyCode: "GBP",
          localeCode: "EN",
          gameDetailsUrl: "/mocked/base/pathgameInfoFakeViewUrl",
          onInfoButtonClick: expect.any(Function),
          onFavouritesButtonClick: expect.any(Function),
          jackpotLogo: "fakeJackpotLogoPath",
          isFavourite: undefined,
          isFavouriteGamesEnabled: undefined,
          isLoggedIn: undefined,
          isGameWidget: false,
        },
        undefined,
      );
    });

    it("should display the GameTile component with jackpot logo", () => {
      gameTileProps.jackpotLogo = "jackpot_king";
      getImagePath.mockReturnValue("newFakeJackpotLogoPath");
      renderConnectedGameCard(gameTileProps, dispatchProps);
      expect(getImagePath).toHaveBeenCalledWith("jackpot_king");
      expect(GameTile).toHaveBeenCalledWith(
        {
          urn: "urn:tbd:card:1",
          name: "Cleopatra Gold",
          launchId: "1234",
          rgsCodeMobile: "200-1503-001",
          provider: "gp-ig",
          jackpotLogo: "newFakeJackpotLogoPath",
          mainProduct: "arcade",
          isRoundGameTile: false,
          gameInfoViewLink: {
            viewUrl: "fakeUrl",
            viewUrn: "fakeUrn",
          },
          badge: {
            label: "I18N.GAME_CARD.BADGE.JACKPOT",
            type: "JACKPOT",
          },
          countryCode: "RO",
          currencyCode: "GBP",
          localeCode: "EN",
          gameDetailsUrl: "/mocked/base/pathgameInfoFakeViewUrl",
          onInfoButtonClick: expect.any(Function),
          onFavouritesButtonClick: expect.any(Function),
          isFavourite: undefined,
          isFavouriteGamesEnabled: undefined,
          isLoggedIn: undefined,
          isGameWidget: false,
        },
        undefined,
      );
    });

    it("should render the Link component", () => {
      renderConnectedGameCard(gameTileProps, dispatchProps);
      expect(Link.mock.calls[0][0].item).toEqual({
        target: "_self",
        viewLink: {
          viewUrn: "ppb:tbd:view:external",
          viewUrl: "fakeLaunchURL",
        },
      });
    });

    it("should pass isFavourite and isFavouriteGamesEnabled props when provided", () => {
      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
        true,
        true,
      );

      expect(GameTile).toHaveBeenCalledWith(
        expect.objectContaining({
          isFavourite: true,
          isFavouriteGamesEnabled: true,
          isLoggedIn: true,
        }),
        undefined,
      );
    });
  });

  describe("when the game has ROULETTE_NUMBERS as badge type", () => {
    it("should dispatch dispatchSubscribeToUpdateGameFeedResults action", () => {
      const tableNames = ["rol_prestigerol"];
      renderConnectedGameCard(gameTileProps, dispatchProps, tableNames);
      useVisibilityObserver.mock.calls[0][0].onShow("fakeGameUrn/test");

      expect(dispatchProps.dispatchSubscribeToUpdateGameFeedResults).toHaveBeenCalledTimes(1);
      expect(dispatchProps.dispatchSubscribeToUpdateGameFeedResults).toHaveBeenCalledWith(
        "fakeGameUrn/test",
        ["rol_prestigerol"],
        "GBP",
      );
    });
  });

  describe("when card is not visible anymore", () => {
    it("should dispatch dispatchUnsubscribeToUpdateGameFeedResults action", () => {
      const tableNames = ["rol_prestigerol"];
      renderConnectedGameCard(gameTileProps, dispatchProps, tableNames);
      useVisibilityObserver.mock.calls[0][0].onHide();

      expect(dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults).toHaveBeenCalledTimes(1);
      expect(dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults).toHaveBeenCalledWith(
        "fakeGameUrn/test",
        ["rol_prestigerol"],
        "GBP",
      );
    });
  });

  describe("when onClick is called", () => {
    it("should call dispatchLaunchGame with the correct payload", () => {
      renderConnectedGameCard(gameTileProps, dispatchProps);
      const { onClick } = Link.mock.calls[0][0];
      onClick();
      expect(dispatchProps.dispatchLaunchGame).toHaveBeenCalledTimes(1);
      expect(dispatchProps.dispatchLaunchGame).toHaveBeenCalledWith(
        { viewUrl: "fakeLaunchURL", viewUrn: "ppb:tbd:view:external" },
        "fakeGameUrn/test",
        "fakeUrn",
        "web",
      );
    });

    it("should call dispatchLaunchGameFromWidget when isGameWidget is true", () => {
      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        false,
        false,
        false,
        "uid",
        { timestamp: null, gameId: null },
        true, // isGameWidget
      );
      const { onClick } = Link.mock.calls[0][0];
      onClick();
      expect(dispatchProps.dispatchLaunchGameFromWidget).toHaveBeenCalledTimes(1);
      expect(dispatchProps.dispatchLaunchGameFromWidget).toHaveBeenCalledWith(
        { viewUrl: "fakeLaunchURL", viewUrn: "ppb:tbd:view:external" },
        "fakeGameUrn/test",
        "fakeUrn",
        "web",
      );
      expect(dispatchProps.dispatchLaunchGame).not.toHaveBeenCalled();
    });
  });

  describe("onInfoButtonClick", () => {
    describe("when user is not logged in", () => {
      it("should call dispatchNavigateToGameInfoView and dispatchPushAction", () => {
        renderConnectedGameCard(
          gameTileProps,
          dispatchProps,
          [],
          "gameLaunchId",
          "providerUid",
          "mainProduct",
          "fakeUrn",
          "fakeGameUrn/test",
          { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
          "GBP",
          "£",
          false,
        );

        const { onInfoButtonClick } = GameTile.mock.calls[0][0];
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

        onInfoButtonClick(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(dispatchProps.dispatchNavigateToGameInfoView).toHaveBeenCalledWith(
          { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
          "fakeGameUrn/test",
          "fakeUrn",
        );
        expect(dispatchProps.dispatchPushAction).toHaveBeenCalledWith({
          viewUrn: "gameInfoFakeViewUrn",
          viewUrl: "gameInfoFakeViewUrl",
        });
      });

      it("should not render QuickViewGameInfo", () => {
        renderConnectedGameCard(
          gameTileProps,
          dispatchProps,
          [],
          "gameLaunchId",
          "providerUid",
          "mainProduct",
          "fakeUrn",
          "fakeGameUrn/test",
          { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
          "GBP",
          "£",
          false,
        );

        const { onInfoButtonClick } = GameTile.mock.calls[0][0];
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

        onInfoButtonClick(mockEvent);

        expect(QuickViewGameInfoMock).not.toHaveBeenCalled();
      });
    });

    describe("when user is logged in", () => {
      it("should set showQuickView to true and not call navigation actions", () => {
        renderConnectedGameCard(
          gameTileProps,
          dispatchProps,
          [],
          "gameLaunchId",
          "providerUid",
          "mainProduct",
          "fakeUrn",
          "fakeGameUrn/test",
          { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
          "GBP",
          "£",
          true,
        );

        const { onInfoButtonClick } = GameTile.mock.calls[0][0];
        const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

        onInfoButtonClick(mockEvent);

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockEvent.stopPropagation).toHaveBeenCalled();
        expect(dispatchProps.dispatchNavigateToGameInfoView).not.toHaveBeenCalled();
        expect(dispatchProps.dispatchPushAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("onFavouritesButtonClick", () => {
    it("should call dispatchRemoveFromFavouriteGames and decrementFavouritesNotification when game is already a favourite", () => {
      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
        true,
        true,
        "gameLaunchId",
      );

      const { onFavouritesButtonClick } = GameTile.mock.calls[0][0];
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

      onFavouritesButtonClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(dispatchProps.dispatchRemoveFromFavouriteGames).toHaveBeenCalledWith(
        "gameLaunchId",
        "mainProduct",
        "Test Game",
        "Test Provider",
        "fakeUrn",
      );
      expect(dispatchProps.dispatchAddToFavouriteGames).not.toHaveBeenCalled();
    });

    it("should call dispatchAddToFavouriteGames and incrementFavouritesNotification when game is not a favourite", () => {
      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
        false,
        true,
        "gameLaunchId",
      );

      const { onFavouritesButtonClick } = GameTile.mock.calls[0][0];
      const mockEvent = { preventDefault: jest.fn(), stopPropagation: jest.fn() };

      onFavouritesButtonClick(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(dispatchProps.dispatchAddToFavouriteGames).toHaveBeenCalledWith(
        "gameLaunchId",
        "mainProduct",
        "Test Game",
        "Test Provider",
        "fakeUrn",
      );
      expect(dispatchProps.dispatchRemoveFromFavouriteGames).not.toHaveBeenCalled();
    });
  });

  describe("QuickViewGameInfo functionality", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should not render QuickViewGameInfo initially", () => {
      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
      );

      expect(QuickViewGameInfoMock).not.toHaveBeenCalled();
    });

    it("should render QuickViewGameInfo when user is logged in and info button is clicked", async () => {
      render(
        <ConnectedGameCard
          gameTileProps={gameTileProps}
          gameInfoViewUrl={{ viewUrn: "urn", viewUrl: "url" }}
          gameLaunchId="gameLaunchId"
          providerUid="providerUid"
          mainProduct="mainProduct"
          layout="RECTANGLE"
          isRoundGameTile={false}
          urn="urn"
          gameUrn="gameUrn"
          dispatchLaunchGame={dispatchProps.dispatchLaunchGame}
          dispatchNavigateToGameInfoView={dispatchProps.dispatchNavigateToGameInfoView}
          dispatchRemoveFromFavouriteGames={dispatchProps.dispatchRemoveFromFavouriteGames}
          dispatchAddToFavouriteGames={dispatchProps.dispatchAddToFavouriteGames}
          dispatchPushAction={dispatchProps.dispatchPushAction}
          dispatchSubscribeToUpdateGameFeedResults={dispatchProps.dispatchSubscribeToUpdateGameFeedResults}
          dispatchUnsubscribeToUpdateGameFeedResults={dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults}
          dispatchClearFavouriteGamesError={dispatchProps.dispatchClearFavouriteGamesError}
          tableNames={[]}
          currencyCode="GBP"
          currencySymbol="£"
          isLoggedIn={true}
          isFavourite={true}
          isFavouriteGamesEnabled={true}
          gameInfoProps={{ title: "Mock Game Info" }}
          isBetslipContainerDisplayed={false}
          favouriteGamesErrorState={{ timestamp: null, gameId: null }}
        />,
      );

      const { onInfoButtonClick: infoButtonClick } = GameTile.mock.calls[0][0];

      await act(async () => {
        infoButtonClick({ preventDefault: jest.fn(), stopPropagation: jest.fn() });
      });

      expect(QuickViewGameInfoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          gameInfoProps: { title: "Mock Game Info" },
          gameLaunchId: "gameLaunchId",
          gameUrn: "gameUrn",
          urn: "urn",
          providerUid: "providerUid",
          mainProduct: "mainProduct",
          currencyCode: "GBP",
          currencySymbol: "£",
          isFavourite: true,
          isFavouriteGamesEnabled: true,
          isLoggedIn: true,
          onFavouritesButtonClick: expect.any(Function),
          tableNames: [],
          isBetslipContainerDisplayed: false,
          dispatchClearFavouriteGamesError: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should pass onClose callback to QuickViewGameInfo", async () => {
      const scrollToSpy = jest.spyOn(window, "scrollTo").mockImplementation(() => {});
      Object.defineProperty(window, "scrollY", { value: 500, writable: true });

      render(
        <ConnectedGameCard
          gameTileProps={gameTileProps}
          gameInfoViewUrl={{ viewUrn: "urn", viewUrl: "url" }}
          gameLaunchId="gameLaunchId"
          providerUid="providerUid"
          mainProduct="mainProduct"
          layout="RECTANGLE"
          isRoundGameTile={false}
          urn="urn"
          gameUrn="gameUrn"
          dispatchLaunchGame={dispatchProps.dispatchLaunchGame}
          dispatchNavigateToGameInfoView={dispatchProps.dispatchNavigateToGameInfoView}
          dispatchRemoveFromFavouriteGames={dispatchProps.dispatchRemoveFromFavouriteGames}
          dispatchAddToFavouriteGames={dispatchProps.dispatchAddToFavouriteGames}
          dispatchPushAction={dispatchProps.dispatchPushAction}
          dispatchSubscribeToUpdateGameFeedResults={dispatchProps.dispatchSubscribeToUpdateGameFeedResults}
          dispatchUnsubscribeToUpdateGameFeedResults={dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults}
          dispatchClearFavouriteGamesError={dispatchProps.dispatchClearFavouriteGamesError}
          tableNames={[]}
          currencyCode="GBP"
          currencySymbol="£"
          isLoggedIn={true}
          gameInfoProps={{ title: "Mock Game Info" }}
          isBetslipContainerDisplayed={false}
          favouriteGamesErrorState={{ timestamp: null, gameId: null }}
        />,
      );

      const { onInfoButtonClick: infoButtonClick } = GameTile.mock.calls[0][0];

      await act(async () => {
        infoButtonClick({ preventDefault: jest.fn(), stopPropagation: jest.fn() });
      });

      const { onClose } = QuickViewGameInfoMock.mock.calls[0][0];

      act(() => {
        onClose();
      });

      expect(scrollToSpy).toHaveBeenCalledWith(0, 500);

      scrollToSpy.mockRestore();
    });
  });

  describe("Error Toast functionality", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should not render ErrorToast when isVisible is false", () => {
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: false,
        hideToast: jest.fn(),
      });

      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
        false,
        true,
        "gameLaunchId",
        { timestamp: 123456, gameId: "gameLaunchId" },
      );

      expect(ErrorToast).not.toHaveBeenCalled();
    });

    it("should render ErrorToast when isVisible is true", () => {
      const mockHideToast = jest.fn();
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: true,
        hideToast: mockHideToast,
      });

      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
        false,
        true,
        "gameLaunchId",
        { timestamp: 123456, gameId: "gameLaunchId" },
      );

      expect(ErrorToast).toHaveBeenCalledWith(
        {
          message: "I18N.FAVOURITE_GAMES.ERROR_MESSAGE",
          onClose: expect.any(Function),
        },
        undefined,
      );
    });

    it("should call useFavouriteGamesErrorToast with correct parameters including onDismiss", () => {
      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
        false,
        true,
        "gameLaunchId",
        { timestamp: 123456, gameId: "gameLaunchId" },
      );

      expect(useFavouriteGamesErrorToast).toHaveBeenCalledWith({
        errorTimestamp: 123456,
        errorGameId: "gameLaunchId",
        gameId: "gameLaunchId",
        onDismiss: dispatchProps.dispatchClearFavouriteGamesError,
      });
    });

    it("should call hideToast and dispatchClearFavouriteGamesError when ErrorToast onClose is triggered", () => {
      const mockHideToast = jest.fn();
      useFavouriteGamesErrorToast.mockReturnValue({
        isVisible: true,
        hideToast: mockHideToast,
      });

      renderConnectedGameCard(
        gameTileProps,
        dispatchProps,
        [],
        "gameLaunchId",
        "providerUid",
        "mainProduct",
        "fakeUrn",
        "fakeGameUrn/test",
        { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
        "GBP",
        "£",
        true,
        false,
        true,
        "gameLaunchId",
        { timestamp: 123456, gameId: "gameLaunchId" },
      );

      const { onClose } = ErrorToast.mock.calls[0][0];
      onClose();

      expect(mockHideToast).toHaveBeenCalled();
      expect(dispatchProps.dispatchClearFavouriteGamesError).toHaveBeenCalled();
    });
  });
});
