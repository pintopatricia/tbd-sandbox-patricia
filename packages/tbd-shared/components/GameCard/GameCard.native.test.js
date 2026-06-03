import { useLogin } from "@flutter-global/react-native-cet-framework";
import { render, fireEvent } from "@testing-library/react-native";
import { Keyboard } from "react-native";
import { navigateWithThirdPartyScreenName } from "@ppb/tbd-router/native";
import { GameTile } from "./snowflakes/GameTile/GameTile.native";
import ConnectedGameCard from "./GameCard.native";
import { updateGamingSearchHistory } from "../../helpers/search-history-helper.native";
import useTicker from "../../hooks/useTicker";
import selectors from "./GameCard.native.selectors";

const PARENTS = ["ppb:tab:1", "ppb:cardgroup:1"];
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => PARENTS),
}));

jest.mock("@flutter-global/react-native-cet-framework", () => {
  const loginCET = jest.fn();
  return { useLogin: jest.fn(() => loginCET) };
});

jest.mock("./snowflakes/GameTile/GameTile.native", () => ({
  GameTile: jest.fn((props) => <game-tile-mock {...props} />),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("£50"),
}));

jest.mock("../../view-model-factories/game", () => ({
  getLaunchUrl: jest
    .fn()
    .mockReturnValue(
      "https://launcher.betfair.com/launcher/?gameId=age-of-the-gods-god-of-storms-cptn&channel=lottery&returnURL=''&launchProduct=casino&RPBucket=casino&mode=real&statusBar=false&dismissButtonPosition=topRight",
    ),
}));

jest.mock("../../helpers/search-history-helper.native", () => ({
  updateGamingSearchHistory: jest.fn(),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateWithThirdPartyScreenName: jest.fn(),
  ScreenName: {
    GameLaunchScreen: "GameLaunchScreen",
    GameInfoScreen: "GameInfoScreen",
  },
  navigateMyAccount: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const mockTicker = { ticker: 0 };

jest.mock("../../hooks/useTicker", () => jest.fn(() => mockTicker));

jest.mock("../../hooks/useAppBrand", () => ({
  useAppBrand: () => "betfair",
}));

jest.mock("../../helpers/storage.native", () => ({
  getItem: jest.fn(() => Promise.resolve(undefined)),
  setItem: jest.fn(),
}));

function renderConnectedGameCard({
  gameTileProps,
  dispatchProps,
  tableNames,
  isLoggedIn = true,
  gameLaunchId = "launchId",
  providerUid = "providerUid",
  mainProduct = "mainProduct",
  urn = "fakeUrn",
  gameUrn = "fakeGameUrn",
  cardGroupUrn = "fakeCardGroupUrn",
  segmentedCardGroupUrn = "fakeSegmentedCardGroupUrn",
  gameInfoViewUrl = { viewUrn: "gameInfoFakeViewUrn", viewUrl: "gameInfoFakeViewUrl" },
  viewLink = { viewUrn: "fakeViewUrn", viewUrl: "fakeViewUrl" },
  currencyCode = "GBP",
  visible = false,
  inputSearchTerm = "",
}) {
  return render(
    <ConnectedGameCard
      gameTileProps={gameTileProps}
      gameInfoViewUrl={gameInfoViewUrl}
      viewLink={viewLink}
      gameLaunchId={gameLaunchId}
      providerUid={providerUid}
      mainProduct={mainProduct}
      layout="RECTANGLE"
      isRoundGameTile={false}
      urn={urn}
      gameUrn={gameUrn}
      cardGroupUrn={cardGroupUrn}
      segmentedCardGroupUrn={segmentedCardGroupUrn}
      dispatchLaunchGame={dispatchProps.dispatchLaunchGame}
      dispatchNavigateToGameInfoView={dispatchProps.dispatchNavigateToGameInfoView}
      dispatchPushAction={dispatchProps.dispatchPushAction}
      dispatchSubscribeToUpdateGameFeedResults={dispatchProps.dispatchSubscribeToUpdateGameFeedResults}
      dispatchGameLaunchRefresh={dispatchProps.dispatchGameLaunchRefresh}
      dispatchUnsubscribeToUpdateGameFeedResults={dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults}
      tableNames={tableNames}
      isLoggedIn={isLoggedIn}
      currencyCode={currencyCode}
      visible={visible}
      inputSearchTerm={inputSearchTerm}
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
  dispatchNavigateToGameInfoView: jest.fn(),
  dispatchPushAction: jest.fn(),
  dispatchSubscribeToUpdateGameFeedResults: jest.fn(),
  dispatchGameLaunchRefresh: jest.fn(),
  dispatchUnsubscribeToUpdateGameFeedResults: jest.fn(),
};

describe("Connected Game Tile", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when component props are available", () => {
    it("should display the Game Tile component", () => {
      renderConnectedGameCard({ gameTileProps, dispatchProps });

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
          isRoundGameTile: false,
          onInfoButtonTap: expect.any(Function),
          jackpotLogo: undefined,
          countryCode: "RO",
          currencyCode: "GBP",
          localeCode: "EN",
        },
        undefined,
      );
    });

    it("should display the GameTile component with jackpot badge and correct jackpot value", () => {
      gameTileProps.badge = {
        label: 50,
        type: "JACKPOT",
      };

      useTicker.mockReturnValueOnce({
        ticker: gameTileProps.badge.label,
      });

      renderConnectedGameCard({ gameTileProps, dispatchProps });

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
            label: "£50",
            type: "JACKPOT",
          },
          countryCode: "RO",
          currencyCode: "GBP",
          localeCode: "EN",
          onInfoButtonTap: expect.any(Function),
          jackpotLogo: undefined,
        },
        undefined,
      );
    });

    it("should display the GameTile component with jackpot badge and no value", () => {
      gameTileProps.badge = {
        type: "JACKPOT",
      };
      renderConnectedGameCard({ gameTileProps, dispatchProps });

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
          onInfoButtonTap: expect.any(Function),
          jackpotLogo: undefined,
        },
        undefined,
      );
    });
  });

  describe("when the game has ROULETTE_NUMBERS as badge type", () => {
    it("should dispatch dispatchSubscribeToUpdateGameFeedResults action", () => {
      const tableNames = ["rol_prestigerol"];
      renderConnectedGameCard({ gameTileProps, dispatchProps, tableNames, visible: true });

      expect(dispatchProps.dispatchSubscribeToUpdateGameFeedResults).toHaveBeenCalledTimes(1);
      expect(dispatchProps.dispatchSubscribeToUpdateGameFeedResults).toHaveBeenCalledWith(
        "fakeGameUrn",
        ["rol_prestigerol"],
        "GBP",
      );
    });
  });

  describe("when card is not visible", () => {
    it("should dispatch dispatchUnsubscribeToUpdateGameFeedResults action", () => {
      const tableNames = ["rol_prestigerol"];
      renderConnectedGameCard({ gameTileProps, dispatchProps, tableNames });
      expect(dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults).toHaveBeenCalledTimes(1);
      expect(dispatchProps.dispatchUnsubscribeToUpdateGameFeedResults).toHaveBeenCalledWith(
        "fakeGameUrn",
        ["rol_prestigerol"],
        "GBP",
      );
    });
  });

  describe("when tap on the GameTile", () => {
    it("should dispatch UI__LAUNCH_GAME action", () => {
      const { getByTestId } = renderConnectedGameCard({ gameTileProps, dispatchProps });
      const pressableContainer = getByTestId(selectors.GAME_CARD);
      fireEvent.press(pressableContainer);
      expect(dispatchProps.dispatchLaunchGame).toHaveBeenCalledTimes(1);
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith("GameLaunchScreen", {
        viewLink: {
          viewUrl:
            "https://launcher.betfair.com/launcher/?gameId=age-of-the-gods-god-of-storms-cptn&channel=lottery&returnURL=''&launchProduct=casino&RPBucket=casino&mode=real&statusBar=false&dismissButtonPosition=topRight",
          viewUrn: "",
        },
        params: {
          urn: "fakeUrn",
        },
      });
    });

    it("should dismiss the keyboard when tile is pressed", () => {
      const { getByTestId } = renderConnectedGameCard({ gameTileProps, dispatchProps });
      const pressableContainer = getByTestId(selectors.GAME_CARD);
      fireEvent.press(pressableContainer);
      expect(Keyboard.dismiss).toBeDefined();
      expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    });

    it("should call updateGamingSearchHistory when tile is pressed", () => {
      const { getByTestId } = renderConnectedGameCard({
        gameTileProps,
        dispatchProps,
        inputSearchTerm: "Cleopatra",
      });
      const pressableContainer = getByTestId(selectors.GAME_CARD);
      fireEvent.press(pressableContainer);
      expect(updateGamingSearchHistory).toHaveBeenCalledTimes(1);
      expect(updateGamingSearchHistory).toHaveBeenCalledWith("Cleopatra");
    });

    it("should navigate to login screen when user is not logged in", () => {
      const { getByTestId } = renderConnectedGameCard({
        gameTileProps,
        dispatchProps,
        tableNames: null,
        isLoggedIn: false,
      });
      const pressableContainer = getByTestId(selectors.GAME_CARD);
      fireEvent.press(pressableContainer);
      expect(dispatchProps.dispatchLaunchGame).not.toHaveBeenCalledTimes(1);
      expect(useLogin).toHaveBeenCalled();
    });
  });
});
