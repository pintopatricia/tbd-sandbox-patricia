import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { getGameByURN } from "@ppb/tbd-store/state/entities/games/game-selectors";
import { UI__LAUNCH_GAME } from "@ppb/tbd-store/actions/navigation";
import { CLEAR_USER_FAVOURITE_GAMES_ERROR } from "@ppb/tbd-store/actions/user-favourite-games";
import {
  SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
} from "@ppb/tbd-store/actions/game-feeds";
import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { getPropsForGameInfo } from "../../view-model-factories/game";
import { getEndpoint } from "../../config/endpoints";

const getGameCard = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/games/game-selectors", () => ({
  getGameByURN: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(() => jest.fn()),
  getSportsbookPlacedCombinations: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSimpleSelectionsCounterSelector: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getGameCard),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    currencyCode: "EUR",
    localeCodeBcp47: "pt-BR",
    loggedIn: true,
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => jest.fn(() => false)),
}));

jest.mock("@ppb/tbd-store/state/entities/favouriteGames/user-favourite-games-selector", () => ({
  isGameFavourite: jest.fn(() => false),
}));

jest.mock("../../view-model-factories/game", () => ({
  getPropsForGameInfo: jest.fn(() => jest.fn()),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  getCurrencySymbol: jest.fn(() => "€"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const STATE = {
  layouts: {
    cards: {
      games: {},
    },
  },
  entities: {
    games: {},
  },
  userFavouriteGames: {
    favouriteGameIds: [],
    error: null,
    lastErrorTimestamp: null,
    lastErrorGameId: null,
  },
};

const GAME_INFO_CARD_URN = "urn:fake:gameCardUrn:1";

describe("mapToPropsFactories", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for games cards", () => {
    makeMapStateToProps();

    expect(createCardByURNSelector).toHaveBeenCalledWith();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
  });
});

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when card exists in the state", () => {
    describe("when games exists in the state", () => {
      beforeEach(() => {
        getGameCard.mockReturnValue({
          urn: "ppb:tbd:card:game:irish-riches-abp",
          type: "GAME_CARD",
          game: "ppb:game:irish-riches-abp",
        });
        getBetslipExchangeContext.mockReturnValue(undefined);
        getSportsbookPlacedCombinations.mockReturnValue(undefined);
        createSimpleSelectionsCounterSelector.mockReturnValue(() => 0);

        getGameByURN.mockReturnValue({
          urn: "ppb:game:irish-riches-abp",
          name: "Irish Riches",
          gameLauncherParams: "fakeGameLaunchParams",
          launchId: "ppb:game:irish-riches-abp",
          rgsCodeMobile: "BP_IrishRiches",
          label: "NEW",
          provider: {
            uid: "prismic:betfair-com-dev:id:WoFV1R4AAIPb2Jai",
            name: "Sample Provider",
          },
          mainProduct: "prismic:betfair-com-dev:id:WoGtmB4AADAA2jOs",
          jackpotLogo: "Jackpot King",
          backgroundColor: "darkgreen - green",
          description: "DESCRIPTION",
          rtp: "87.04%",
          uid: "irish-riches-uid",
          background: {
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
          flattened: {
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
          hasDemo: true,
        });
        getPropsForGameInfo.mockReturnValue({
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
          badge: { type: "REGULAR", label: "NEW" },
          rtp: "87.04%",
          title: "Irish Riches",
          jackpotLogo: "Jackpot King",
          howToPlayDetails: "DESCRIPTION",
          i18n: {
            playNow: "Play Now",
            rtp: "RTP",
          },
          isDemoButtonDisplayed: true,
        });
      });

      it("should return the correct props", () => {
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: GAME_INFO_CARD_URN });
        expect(getGameCard).toHaveBeenCalledWith(STATE.layouts.cards.gameinfos, GAME_INFO_CARD_URN);
        expect(getGameByURN).toHaveBeenCalledWith(STATE.entities.games, "ppb:game:irish-riches-abp");
        expect(props).toEqual({
          urn: "ppb:game:irish-riches-abp",
          gameInfoProps: {
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
            i18n: {
              playNow: "Play Now",
              rtp: "RTP",
            },
            badge: { type: "REGULAR", label: "NEW" },
            jackpotLogo: "Jackpot King",
            rtp: "87.04%",
            title: "Irish Riches",
            howToPlayDetails: "DESCRIPTION",
            isDemoButtonDisplayed: true,
          },
          currencyCode: "EUR",
          currencySymbol: "€",
          localeCodeBcp47: "pt-BR",
          jackpotAmount: false,
          gameLaunchId: "ppb:game:irish-riches-abp",
          gameName: "Irish Riches",
          gameProviderName: "Sample Provider",
          mainProduct: "prismic:betfair-com-dev:id:WoGtmB4AADAA2jOs",
          providerUid: "prismic:betfair-com-dev:id:WoFV1R4AAIPb2Jai",
          tableNames: undefined,
          isBetslipContainerDisplayed: false,
          isLoggedIn: true,
          isFavourite: false,
          isFavouriteGamesEnabled: false,
          uid: "irish-riches-uid",
          favouriteGamesErrorState: {
            timestamp: null,
            gameId: null,
          },
        });
      });

      it("should return the props with correct jackpotAmount value", () => {
        getPropsForGameInfo.mockReturnValue({
          badge: { type: "JACKPOT", label: "12" },
          rtp: "87.04%",
          title: "Irish Riches",
          jackpotLogo: "Jackpot King",
          howToPlayDetails: "DESCRIPTION",
          i18n: {
            playNow: "Play Now",
            rtp: "RTP",
          },
          isDemoButtonDisplayed: true,
        });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: GAME_INFO_CARD_URN });
        expect(getGameCard).toHaveBeenCalledWith(STATE.layouts.cards.gameinfos, GAME_INFO_CARD_URN);
        expect(getGameByURN).toHaveBeenCalledWith(STATE.entities.games, "ppb:game:irish-riches-abp");
        expect(props).toEqual({
          urn: "ppb:game:irish-riches-abp",
          gameInfoProps: {
            i18n: {
              playNow: "Play Now",
              rtp: "RTP",
            },
            badge: { type: "JACKPOT", label: "12" },
            jackpotLogo: "Jackpot King",
            rtp: "87.04%",
            title: "Irish Riches",
            howToPlayDetails: "DESCRIPTION",
            isDemoButtonDisplayed: true,
          },
          currencyCode: "EUR",
          currencySymbol: "€",
          localeCodeBcp47: "pt-BR",
          gameLaunchId: "ppb:game:irish-riches-abp",
          gameName: "Irish Riches",
          gameProviderName: "Sample Provider",
          mainProduct: "prismic:betfair-com-dev:id:WoGtmB4AADAA2jOs",
          providerUid: "prismic:betfair-com-dev:id:WoFV1R4AAIPb2Jai",
          jackpotAmount: "12",
          tableNames: undefined,
          isBetslipContainerDisplayed: false,
          isLoggedIn: true,
          isFavourite: false,
          isFavouriteGamesEnabled: false,
          uid: "irish-riches-uid",
          favouriteGamesErrorState: {
            timestamp: null,
            gameId: null,
          },
        });
      });

      it("should return the correct props when betslip container is displayed", () => {
        createSimpleSelectionsCounterSelector.mockReturnValue(() => 1);
        getPropsForGameInfo.mockReturnValue({
          badge: { type: "JACKPOT", label: "12" },
          rtp: "87.04%",
          title: "Irish Riches",
          jackpotLogo: "Jackpot King",
          howToPlayDetails: "DESCRIPTION",
          i18n: {
            playNow: "Play Now",
            rtp: "RTP",
          },
          isDemoButtonDisplayed: true,
        });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: GAME_INFO_CARD_URN });
        expect(getGameCard).toHaveBeenCalledWith(STATE.layouts.cards.gameinfos, GAME_INFO_CARD_URN);
        expect(getGameByURN).toHaveBeenCalledWith(STATE.entities.games, "ppb:game:irish-riches-abp");
        expect(props).toEqual({
          urn: "ppb:game:irish-riches-abp",
          gameInfoProps: {
            i18n: {
              playNow: "Play Now",
              rtp: "RTP",
            },
            badge: { type: "JACKPOT", label: "12" },
            jackpotLogo: "Jackpot King",
            rtp: "87.04%",
            title: "Irish Riches",
            howToPlayDetails: "DESCRIPTION",
            isDemoButtonDisplayed: true,
          },
          currencyCode: "EUR",
          currencySymbol: "€",
          localeCodeBcp47: "pt-BR",
          gameLaunchId: "ppb:game:irish-riches-abp",
          gameName: "Irish Riches",
          gameProviderName: "Sample Provider",
          mainProduct: "prismic:betfair-com-dev:id:WoGtmB4AADAA2jOs",
          providerUid: "prismic:betfair-com-dev:id:WoFV1R4AAIPb2Jai",
          jackpotAmount: "12",
          tableNames: undefined,
          isBetslipContainerDisplayed: true,
          isLoggedIn: true,
          isFavourite: false,
          isFavouriteGamesEnabled: false,
          uid: "irish-riches-uid",
          favouriteGamesErrorState: {
            timestamp: null,
            gameId: null,
          },
        });
      });

      it("should return favouriteGamesErrorState with error data when present in state", () => {
        const stateWithError = {
          ...STATE,
          userFavouriteGames: {
            favouriteGameIds: [],
            error: "Failed to add game",
            lastErrorTimestamp: 123456789,
            lastErrorGameId: "irish-riches-uid",
          },
        };

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(stateWithError, { urn: GAME_INFO_CARD_URN });

        expect(props.favouriteGamesErrorState).toEqual({
          timestamp: 123456789,
          gameId: "irish-riches-uid",
        });
      });
    });

    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown by `getUserDetails`", () => {
        makeMapStateToProps()(STATE, { urn: GAME_INFO_CARD_URN });

        expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
      });

      it("should return an empty object", () => {
        expect(makeMapStateToProps()(STATE, { urn: GAME_INFO_CARD_URN })).toEqual({});
      });
    });

    describe("when does not game exists in the state", () => {
      it("should return an empty object", () => {
        getGameCard.mockReturnValue({
          urn: "ppb:tbd:card:game:irish-riches-abp",
          type: "GAME_CARD",
          game: "ppb:game:irish-riches-abp",
        });
        getGameByURN.mockReturnValue(undefined);

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: GAME_INFO_CARD_URN });
        expect(getGameCard).toHaveBeenCalledWith(STATE.layouts.cards.gameinfos, GAME_INFO_CARD_URN);
        expect(getGameByURN).toHaveBeenCalledWith(STATE.entities.games, "ppb:game:irish-riches-abp");
        expect(props).toEqual({});
      });
    });
  });

  describe("when does not card exists in the state", () => {
    describe("when games exists in the state", () => {
      it("should return an empty object", () => {
        getGameCard.mockReturnValue(undefined);
        getGameByURN.mockReturnValue({
          urn: "ppb:game:irish-riches-abp",
          name: "Irish Riches",
          launchId: "ppb:game:irish-riches-abp",
          rgsCodeMobile: "BP_IrishRiches",
          label: "NEW",
          provider: "prismic:betfair-com-dev:id:WoFV1R4AAIPb2Jai",
          mainProduct: "prismic:betfair-com-dev:id:WoGtmB4AADAA2jOs",
          jackpotLogo: "Jackpot King",
          backgroundColor: "darkgreen - green",
          description: "DESCRIPTION",
        });
        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: GAME_INFO_CARD_URN });
        expect(getGameCard).toHaveBeenCalledWith(STATE.layouts.cards.gameinfos, GAME_INFO_CARD_URN);
        expect(getGameByURN).not.toHaveBeenCalled();
        expect(props).toEqual({});
      });
    });

    describe("when does not game exists in the state", () => {
      it("should return an empty object", () => {
        getGameCard.mockReturnValue(undefined);

        getGameByURN.mockReturnValue(null);

        const mapStateToProps = makeMapStateToProps();
        const props = mapStateToProps(STATE, { urn: GAME_INFO_CARD_URN });
        expect(getGameCard).toHaveBeenCalledWith(STATE.layouts.cards.gameinfos, GAME_INFO_CARD_URN);
        expect(props).toEqual({});
        expect(getGameByURN).not.toHaveBeenCalled();
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchLaunchGame", () => {
    it("should dispatch launch game from game info page action", () => {
      const { dispatchLaunchGame } = mapDispatchToProps;
      const urn = "fakeUrn";
      const gameUrn = "fakeGameUrn";
      const launchGameViewLink = {
        viewUrn: "fakeUrn",
        viewUrl: "http://url",
      };
      const platformType = "web";

      expect(dispatchLaunchGame(launchGameViewLink, gameUrn, urn, platformType)).toEqual({
        type: UI__LAUNCH_GAME,
        payload: { href: launchGameViewLink.viewUrl, gameUrn, cardUrn: urn, platformType },
      });
    });
  });

  describe("dispatchSubscribeToUpdateGameFeedResults", () => {
    it("shoud dispatch subscribe to update game feed results action", () => {
      const { dispatchSubscribeToUpdateGameFeedResults } = mapDispatchToProps;
      const gameUrnMock = "fakeGameUrn";
      const tableNamesMock = ["rol_prestigerol"];
      const currencyMock = "GBP";
      getEndpoint.mockReturnValueOnce("endpoint");

      expect(dispatchSubscribeToUpdateGameFeedResults(gameUrnMock, tableNamesMock, currencyMock)).toEqual({
        payload: { urn: gameUrnMock, tableNames: tableNamesMock, endpoint: "endpoint", currencyCode: currencyMock },
        type: SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
      });
    });
  });

  describe("dispatchUnsubscribeToUpdateGameFeedResults", () => {
    it("shoud dispatch unsubscribe to stop updating physical table results action", () => {
      const { dispatchUnsubscribeToUpdateGameFeedResults } = mapDispatchToProps;
      const gameUrnMock = "fakeGameUrn";
      const tableNamesMock = ["rol_prestigerol"];
      const currencyMock = "GBP";
      getEndpoint.mockReturnValueOnce("endpoint");

      expect(dispatchUnsubscribeToUpdateGameFeedResults(gameUrnMock, tableNamesMock, currencyMock)).toEqual({
        payload: { urn: gameUrnMock, tableNames: tableNamesMock, endpoint: "endpoint", currencyCode: currencyMock },
        type: UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
      });
    });
  });

  describe("dispatchClearFavouriteGamesError", () => {
    it("should dispatch clear favourite games error action", () => {
      const { dispatchClearFavouriteGamesError } = mapDispatchToProps;

      expect(dispatchClearFavouriteGamesError()).toEqual({
        type: CLEAR_USER_FAVOURITE_GAMES_ERROR,
      });
    });
  });
});
