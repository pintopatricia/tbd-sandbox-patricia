import { render } from "@testing-library/react-native";
import { useLogin } from "@flutter-global/react-native-cet-framework";

import { GameLaunchMode } from "../GameCard/snowflakes/GameTile/GameTile.types";
import { GameInfo } from "./snowflakes/GameInfo/GameInfo.native";

import useTicker from "../../hooks/useTicker";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import ConnectedGameInfo from "./GameInfo.native";

jest.mock("@flutter-global/react-native-cet-framework", () => {
  const loginCET = jest.fn();
  return { useLogin: jest.fn(() => loginCET) };
});

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockReturnValue("£50"),
}));

jest.mock("./snowflakes/GameInfo/GameInfo.native", () => ({
  GameInfo: jest.fn(() => <game-info-mock />),
}));

jest.mock("../../view-model-factories/game", () => ({
  getLaunchUrl: jest.fn(() => "launchURL"),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateWithThirdPartyScreenName: jest.fn(() => {}),
  ScreenName: jest.fn(() => {}),
  navigateMyAccount: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../hooks/useTicker", () => jest.fn(() => ({ ticker: 0 })));

const FLATTENED_IMAGE_MOCK = {
  small: {
    url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,225,225&w=225&h=225",
    dimensions: {
      width: 225,
      height: 225,
    },
  },
  medium: {
    url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,450,450&w=450&h=450",
    dimensions: {
      width: 225,
      height: 225,
    },
  },
  large: {
    url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,900,900&w=900&h=900",
    dimensions: {
      width: 225,
      height: 225,
    },
  },
};

const BADGE = {
  label: "BADGE MOCK",
  type: "REGULAR",
};

const gameInfoProps = {
  jackpotLogo: "jackpot_king",
  flattenedImage: FLATTENED_IMAGE_MOCK,
  badge: BADGE,
  title: "Irish Riches",
  rtp: "87,09",
  howToPlayDetails: { content: "Content " },
  i18n: { playNow: "Play Now", rtp: "% RTP" },
};

let jackpotAmount = "10.82";
const gameLauncherParams = {
  gameId: "arcade-bomb",
  channel: "lottery",
  returnURL: "https%3A%2F%2Fwww.betfair.com%2F",
  launchProduct: "arcade",
  RPBucket: "arcade",
  mode: GameLaunchMode.REAL,
  statusBar: false,
  dismissButtonPosition: "topRight",
};

function renderGameInfoPage({
  urn = "urn",
  gameUrn = "gameUrn",
  currencyCode = "GBP",
  localeCodeBcp47 = "en-GB",
  dispatchLaunchGame = jest.fn(),
  gameLaunchId,
  mainProduct,
  providerUid,
  dispatchSubscribeToUpdateGameFeedResults = jest.fn(),
  dispatchUnsubscribeToUpdateGameFeedResults = jest.fn(),
  tableNames,
  isLoggedIn,
  visible = true,
}) {
  return render(
    <ConnectedGameInfo
      urn={urn}
      gameUrn={gameUrn}
      gameLaunchId={gameLaunchId}
      mainProduct={mainProduct}
      providerUid={providerUid}
      gameInfoProps={gameInfoProps}
      currencyCode={currencyCode}
      localeCodeBcp47={localeCodeBcp47}
      gameLauncherParams={gameLauncherParams}
      dispatchLaunchGame={dispatchLaunchGame}
      dispatchSubscribeToUpdateGameFeedResults={dispatchSubscribeToUpdateGameFeedResults}
      dispatchUnsubscribeToUpdateGameFeedResults={dispatchUnsubscribeToUpdateGameFeedResults}
      jackpotAmount={jackpotAmount}
      tableNames={tableNames}
      isLoggedIn={isLoggedIn}
      visible={visible}
    />,
  );
}

describe("ConnectedGameInfo component", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("should render the component", () => {
    it("should render game info component", () => {
      useTicker.mockReturnValueOnce({ ticker: 10.82 });

      renderGameInfoPage(gameInfoProps);

      expect(GameInfo).toHaveBeenCalled();
      expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(1, {
        currencyCode: "GBP",
        localeCodeBcp47: "en-GB",
        value: 10.82,
      });
      expect(GameInfo).toHaveBeenCalledWith(
        {
          badge: {
            label: "BADGE MOCK",
            type: "REGULAR",
          },
          jackpotLogo: undefined,
          launchUrl: {
            viewUrn: "urn",
            viewUrl: "launchURL",
          },
          flattenedImage: {
            small: {
              url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,225,225&w=225&h=225",
              dimensions: {
                width: 225,
                height: 225,
              },
            },
            medium: {
              url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,450,450&w=450&h=450",
              dimensions: {
                width: 225,
                height: 225,
              },
            },
            large: {
              url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,900,900&w=900&h=900",
              dimensions: {
                width: 225,
                height: 225,
              },
            },
          },
          title: "Irish Riches",
          rtp: "87,09",
          howToPlayDetails: { content: "Content " },
          i18n: {
            playNow: "Play Now",
            rtp: "% RTP",
          },
          playNowButtonOnClick: expect.any(Function),
        },
        undefined,
      );
    });

    describe("should display the GameInfo component with Jackpot badge value", () => {
      it("should call GameInfo with jackpot badge value", () => {
        gameInfoProps.badge = {
          label: 50,
          type: "JACKPOT",
        };
        renderGameInfoPage(gameInfoProps);
        expect(GameInfo).toHaveBeenCalledWith(
          {
            badge: {
              label: "£50",
              type: "JACKPOT",
            },
            jackpotLogo: undefined,
            launchUrl: {
              viewUrn: "urn",
              viewUrl: "launchURL",
            },
            flattenedImage: {
              small: {
                url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,225,225&w=225&h=225",
                dimensions: {
                  width: 225,
                  height: 225,
                },
              },
              medium: {
                url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,450,450&w=450&h=450",
                dimensions: {
                  width: 225,
                  height: 225,
                },
              },
              large: {
                url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,900,900&w=900&h=900",
                dimensions: {
                  width: 225,
                  height: 225,
                },
              },
            },
            title: "Irish Riches",
            rtp: "87,09",
            howToPlayDetails: { content: "Content " },
            i18n: {
              playNow: "Play Now",
              rtp: "% RTP",
            },
            playNowButtonOnClick: expect.any(Function),
          },
          undefined,
        );
      });

      it("should call currencyFormatWithDecimalPlaces with correct jackpot value", () => {
        useTicker.mockReturnValueOnce({ ticker: 10.82 });

        renderGameInfoPage(gameInfoProps);

        expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(1, {
          currencyCode: "GBP",
          localeCodeBcp47: "en-GB",
          value: 10.82,
        });
      });
    });

    describe("should display the GameInfo component Jackpot badge with no value", () => {
      it("should call GameInfo with no jackpot value and JACKPOT text", () => {
        jackpotAmount = false;
        gameInfoProps.badge = {
          type: "JACKPOT",
        };
        renderGameInfoPage(gameInfoProps);

        expect(GameInfo).toHaveBeenCalledWith(
          {
            badge: {
              label: "I18N.GAME_CARD.BADGE.JACKPOT",
              type: "JACKPOT",
            },
            jackpotLogo: undefined,
            launchUrl: {
              viewUrn: "urn",
              viewUrl: "launchURL",
            },
            flattenedImage: {
              small: {
                url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,225,225&w=225&h=225",
                dimensions: {
                  width: 225,
                  height: 225,
                },
              },
              medium: {
                url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,450,450&w=450&h=450",
                dimensions: {
                  width: 225,
                  height: 225,
                },
              },
              large: {
                url: "https://images.prismic.io/betfair-com/923bff3a-3041-4a1b-b721-84cc6d5edec4_DESIGNS-61125_BF-Arcade_Cleopatra_Gold_logo.png?auto=compress,format&rect=0,0,900,900&w=900&h=900",
                dimensions: {
                  width: 225,
                  height: 225,
                },
              },
            },
            title: "Irish Riches",
            rtp: "87,09",
            howToPlayDetails: { content: "Content " },
            i18n: {
              playNow: "Play Now",
              rtp: "% RTP",
            },
            playNowButtonOnClick: expect.any(Function),
          },
          undefined,
        );
      });

      it("should call currencyFormatWithDecimalPlaces with 0 jackpot value", () => {
        gameInfoProps.badge = {
          type: "JACKPOT",
        };
        renderGameInfoPage(gameInfoProps);
        expect(currencyFormatWithDecimalPlaces).toHaveBeenNthCalledWith(1, {
          currencyCode: "GBP",
          localeCodeBcp47: "en-GB",
          value: 0,
        });
      });
    });
  });

  describe("when performing interactions", () => {
    describe("playNowButtonOnClick", () => {
      it("should call dispatchLaunchGame with the correct payload", () => {
        const spy = jest.fn();
        const viewLinkMock = { viewUrl: "launchURL", viewUrn: "urn" };
        renderGameInfoPage({ dispatchLaunchGame: spy, isLoggedIn: true });
        const { playNowButtonOnClick } = GameInfo.mock.calls[0][0];
        playNowButtonOnClick();
        expect(spy).toHaveBeenCalledWith(viewLinkMock, "gameUrn", "urn", "native");
      });

      it("should navigate to login screen when the user is not loggedin", () => {
        const spy = jest.fn();
        renderGameInfoPage({
          isLoggedIn: false,
          dispatchLaunchGame: spy,
        });
        const { playNowButtonOnClick } = GameInfo.mock.calls[0][0];
        playNowButtonOnClick();
        expect(useLogin).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when the game has ROULETTE_NUMBERS as badge type", () => {
    it("should dispatch dispatchSubscribeToUpdateGameFeedResults action", () => {
      const tableNames = ["rol_prestigerol"];
      const spy = jest.fn();

      renderGameInfoPage({ dispatchSubscribeToUpdateGameFeedResults: spy, tableNames });

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("urn", ["rol_prestigerol"], "GBP");
    });
  });

  describe("when card is not visible", () => {
    it("should dispatch dispatchUnsubscribeToUpdateGameFeedResults action", () => {
      const tableNames = ["rol_prestigerol"];
      const spy = jest.fn();
      renderGameInfoPage({ dispatchUnsubscribeToUpdateGameFeedResults: spy, tableNames, visible: false });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("urn", ["rol_prestigerol"], "GBP");
    });
  });
});
