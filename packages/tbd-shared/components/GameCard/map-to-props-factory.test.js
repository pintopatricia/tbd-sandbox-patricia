import { UI__LAUNCH_GAME, UI__NAVIGATE_TO_GAME_INFO_VIEW } from "@ppb/tbd-store/actions/navigation";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { CLEAR_USER_FAVOURITE_GAMES_ERROR } from "@ppb/tbd-store/actions/user-favourite-games";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { getGameByURN } from "@ppb/tbd-store/state/entities/games/game-selectors";
import {
  SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  GAME_LAUNCH,
  UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
} from "@ppb/tbd-store/actions/game-feeds";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createGameCardViewModel, getPropsForGameInfo } from "../../view-model-factories/game";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { getEndpoint } from "../../config/endpoints";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/games/game-selectors", () => ({
  getGameByURN: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(),
  getSportsbookPlacedCombinations: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSimpleSelectionsCounterSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => jest.fn(() => false)),
}));

jest.mock("@ppb/tbd-store/state/entities/favouriteGames/user-favourite-games-selector", () => ({
  isGameFavourite: jest.fn(() => false),
}));

jest.mock("../../view-model-factories/game", () => ({
  createGameCardViewModel: jest.fn(),
  getPropsForGameInfo: jest.fn(),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  getCurrencySymbol: jest.fn(() => "€"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => {});

const stateMock = {
  layouts: {
    cards: {
      games: {
        "urn:tbd:card:1": {
          urn: "urn:tbd:card:1",
          game: "ppb:game:1",
          type: "GAME_CARD",
        },
      },
    },
  },
  entities: {
    games: {
      "ppb:game:1": {
        urn: "ppb:game:1",
        name: "Sample Game",
      },
    },
  },
  userFavouriteGames: {
    favouriteGameIds: [],
    error: null,
    lastErrorTimestamp: null,
    lastErrorGameId: null,
  },
};

const stateMockForInputSearchTerm = {
  layouts: {
    gamingSearch: {
      key1: {
        inputSearchTerm: "test",
        result: [
          {
            type: "GAMING_SEARCH_RESULT_ITEM",
            urn: "urn:tbd:card:1",
          },
        ],
      },
    },
    cards: {
      games: {
        "urn:tbd:card:1": {
          urn: "urn:tbd:card:1",
          game: "ppb:game:1",
          type: "GAME_CARD",
        },
      },
    },
  },
  entities: {
    games: {
      "ppb:game:1": {
        urn: "ppb:game:1",
        name: "Sample Game",
      },
    },
  },
  userFavouriteGames: {
    favouriteGameIds: [],
    error: null,
    lastErrorTimestamp: null,
    lastErrorGameId: null,
  },
};

const getGameCard = jest.fn();

function setupMapStateToProps(cardMock) {
  const cardWithLayout = {
    ...cardMock,
    layout: "RECTANGLE",
    isRound: false,
    game: "ppb:game:1",
  };

  getGameCard.mockImplementation(() => cardWithLayout);
  createCardByURNSelector.mockImplementation(() => getGameCard);

  return makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1" });
}

describe("makeMapStateToProps", () => {
  const BASE_MOCK = {
    urn: "urn:tbd:card:1",
    name: "Cleopatra Gold",
    rgsCodeMobile: "200-1503-001",
    badge: {
      label: "BADGE MOCK",
      type: "REGULAR",
    },
    provider: {
      uid: "gp-bp",
    },
    mainProduct: "arcade",
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
    },
    launchId: "launchId",
    rtp: "95.05%",
  };

  it("should return the expected full props object for a valid game card URN", () => {
    getUserDetails.mockReturnValue({
      currencyCode: "EUR",
      currencySymbol: "€",
      localeCodeBcp47: "en-GB",
      loggedIn: true,
      jurisdiction: { jurisdiction: "INTERNATIONAL" },
    });
    const gameCardStub = stateMock.layouts.cards.games["urn:tbd:card:1"];
    createCardByURNSelector.mockReturnValue(jest.fn(() => gameCardStub));
    const gameStub = {
      urn: "ppb:game:1",
      name: "Sample Game",
      launchId: "launchId",
      provider: { uid: "gp-bp", name: "Sample Provider" },
      mainProduct: "arcade",
    };
    getGameByURN.mockReturnValue(gameStub);
    createGameCardViewModel.mockReturnValue(jest.fn(() => "gameTileProps"));
    getPropsForGameInfo.mockReturnValue({
      badge: { type: "JACKPOT", label: "Jackpot Value" },
    });
    getBetslipExchangeContext.mockReturnValue(null);
    getSportsbookPlacedCombinations.mockReturnValue(null);
    createSimpleSelectionsCounterSelector.mockReturnValue(() => 0);

    const result = makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1" });

    expect(result).toEqual({
      urn: "urn:tbd:card:1",
      currencyCode: "EUR",
      currencySymbol: "€",
      gameTileProps: "gameTileProps",
      localeCodeBcp47: "en-GB",
      gameLaunchId: "launchId",
      gameName: "Sample Game",
      gameProviderName: "Sample Provider",
      providerUid: "gp-bp",
      mainProduct: "arcade",
      layout: "RECTANGLE",
      isRoundGameTile: false,
      gameUrn: "ppb:game:1",
      gameInfoViewUrl: undefined,
      tableNames: undefined,
      topLevelDomain: "com",
      gameInfoProps: expect.any(Object),
      jackpotAmount: expect.any(String),
      isBetslipContainerDisplayed: false,
      isLoggedIn: true,
      inputSearchTerm: "",
      isFavourite: false,
      isFavouriteGamesEnabled: false,
      uid: undefined,
      favouriteGamesErrorState: {
        timestamp: null,
        gameId: null,
      },
      isXmallGameTile: false,
      isGameTileRefined: false,
    });
  });

  it("should set isXmallGameTile to true when theme is GAMING_SMALL_TILES", () => {
    getUserDetails.mockReturnValue({
      currencyCode: "EUR",
      currencySymbol: "€",
      localeCodeBcp47: "en-GB",
      loggedIn: true,
      jurisdiction: { jurisdiction: "INTERNATIONAL" },
    });
    const gameCardStub = stateMock.layouts.cards.games["urn:tbd:card:1"];
    createCardByURNSelector.mockReturnValue(jest.fn(() => gameCardStub));
    const gameStub = {
      urn: "ppb:game:1",
      name: "Sample Game",
      launchId: "launchId",
      provider: { uid: "gp-bp", name: "Sample Provider" },
      mainProduct: "arcade",
    };
    getGameByURN.mockReturnValue(gameStub);
    createGameCardViewModel.mockReturnValue(jest.fn(() => "gameTileProps"));
    getPropsForGameInfo.mockReturnValue({
      badge: { type: "JACKPOT", label: "Jackpot Value" },
    });
    getBetslipExchangeContext.mockReturnValue(null);
    getSportsbookPlacedCombinations.mockReturnValue(null);
    createSimpleSelectionsCounterSelector.mockReturnValue(() => 0);

    const result = makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1", theme: "GAMING_SMALL_TILES" });

    expect(result.isXmallGameTile).toBe(true);
  });

  it("should set isXmallGameTile to false when theme is not GAMING_SMALL_TILES", () => {
    getUserDetails.mockReturnValue({
      currencyCode: "EUR",
      currencySymbol: "€",
      localeCodeBcp47: "en-GB",
      loggedIn: true,
      jurisdiction: { jurisdiction: "INTERNATIONAL" },
    });
    const gameCardStub = stateMock.layouts.cards.games["urn:tbd:card:1"];
    createCardByURNSelector.mockReturnValue(jest.fn(() => gameCardStub));
    const gameStub = {
      urn: "ppb:game:1",
      name: "Sample Game",
      launchId: "launchId",
      provider: { uid: "gp-bp", name: "Sample Provider" },
      mainProduct: "arcade",
    };
    getGameByURN.mockReturnValue(gameStub);
    createGameCardViewModel.mockReturnValue(jest.fn(() => "gameTileProps"));
    getPropsForGameInfo.mockReturnValue({
      badge: { type: "JACKPOT", label: "Jackpot Value" },
    });
    getBetslipExchangeContext.mockReturnValue(null);
    getSportsbookPlacedCombinations.mockReturnValue(null);
    createSimpleSelectionsCounterSelector.mockReturnValue(() => 0);

    const result = makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1", theme: "OTHER_THEME" });

    expect(result.isXmallGameTile).toBe(false);
  });

  it("should set isXmallGameTile to false when theme is undefined", () => {
    getUserDetails.mockReturnValue({
      currencyCode: "EUR",
      currencySymbol: "€",
      localeCodeBcp47: "en-GB",
      loggedIn: true,
      jurisdiction: { jurisdiction: "INTERNATIONAL" },
    });
    const gameCardStub = stateMock.layouts.cards.games["urn:tbd:card:1"];
    createCardByURNSelector.mockReturnValue(jest.fn(() => gameCardStub));
    const gameStub = {
      urn: "ppb:game:1",
      name: "Sample Game",
      launchId: "launchId",
      provider: { uid: "gp-bp", name: "Sample Provider" },
      mainProduct: "arcade",
    };
    getGameByURN.mockReturnValue(gameStub);
    createGameCardViewModel.mockReturnValue(jest.fn(() => "gameTileProps"));
    getPropsForGameInfo.mockReturnValue({
      badge: { type: "JACKPOT", label: "Jackpot Value" },
    });
    getBetslipExchangeContext.mockReturnValue(null);
    getSportsbookPlacedCombinations.mockReturnValue(null);
    createSimpleSelectionsCounterSelector.mockReturnValue(() => 0);

    const result = makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1" });

    expect(result.isXmallGameTile).toBe(false);
  });

  it("should return the correct inputSearchTerm value when the game.urn is present in the gamingSearch result list", () => {
    getUserDetails.mockReturnValue({
      currencyCode: "EUR",
      currencySymbol: "€",
      localeCodeBcp47: "en-GB",
      loggedIn: true,
      jurisdiction: { jurisdiction: "INTERNATIONAL" },
    });
    const gameCardStub = stateMockForInputSearchTerm.layouts.cards.games["urn:tbd:card:1"];
    createCardByURNSelector.mockReturnValue(jest.fn(() => gameCardStub));
    const gameStub = {
      urn: "ppb:game:1",
      name: "Sample Game",
      launchId: "launchId",
      provider: { uid: "gp-bp", name: "Sample Provider" },
      mainProduct: "arcade",
    };
    getGameByURN.mockReturnValue(gameStub);
    createGameCardViewModel.mockReturnValue(jest.fn(() => "gameTileProps"));
    getPropsForGameInfo.mockReturnValue({
      badge: { type: "JACKPOT", label: "Jackpot Value" },
    });
    getBetslipExchangeContext.mockReturnValue(null);
    getSportsbookPlacedCombinations.mockReturnValue(null);
    createSimpleSelectionsCounterSelector.mockReturnValue(() => 0);

    const result = makeMapStateToProps()(stateMockForInputSearchTerm, { urn: "urn:tbd:card:1" });

    expect(result).toEqual({
      urn: "urn:tbd:card:1",
      currencyCode: "EUR",
      currencySymbol: "€",
      gameTileProps: "gameTileProps",
      localeCodeBcp47: "en-GB",
      gameLaunchId: "launchId",
      gameName: "Sample Game",
      gameProviderName: "Sample Provider",
      providerUid: "gp-bp",
      mainProduct: "arcade",
      layout: "RECTANGLE",
      isRoundGameTile: false,
      gameUrn: "ppb:game:1",
      gameInfoViewUrl: undefined,
      tableNames: undefined,
      topLevelDomain: "com",
      gameInfoProps: expect.any(Object),
      jackpotAmount: expect.any(String),
      isBetslipContainerDisplayed: false,
      isLoggedIn: true,
      inputSearchTerm: "test",
      isFavourite: false,
      isFavouriteGamesEnabled: false,
      uid: undefined,
      favouriteGamesErrorState: {
        timestamp: null,
        gameId: null,
      },
      isXmallGameTile: false,
      isGameTileRefined: false,
    });
  });

  it("should return favouriteGamesErrorState with error data when present in state", () => {
    const stateWithError = {
      ...stateMock,
      userFavouriteGames: {
        favouriteGameIds: [],
        error: "Failed to add game",
        lastErrorTimestamp: 123456789,
        lastErrorGameId: "game-123",
      },
    };

    getUserDetails.mockReturnValue({
      currencyCode: "EUR",
      currencySymbol: "€",
      localeCodeBcp47: "en-GB",
      loggedIn: true,
      jurisdiction: { jurisdiction: "INTERNATIONAL" },
    });
    const gameCardStub = stateMock.layouts.cards.games["urn:tbd:card:1"];
    createCardByURNSelector.mockReturnValue(jest.fn(() => gameCardStub));
    const gameStub = {
      urn: "ppb:game:1",
      name: "Sample Game",
      launchId: "launchId",
      provider: { uid: "gp-bp" },
      mainProduct: "arcade",
      uid: "game-123",
    };
    getGameByURN.mockReturnValue(gameStub);
    createGameCardViewModel.mockReturnValue(jest.fn(() => "gameTileProps"));
    getPropsForGameInfo.mockReturnValue({
      badge: { type: "REGULAR", label: "Badge" },
    });
    getBetslipExchangeContext.mockReturnValue(null);
    getSportsbookPlacedCombinations.mockReturnValue(null);
    createSimpleSelectionsCounterSelector.mockReturnValue(() => 0);

    const result = makeMapStateToProps()(stateWithError, { urn: "urn:tbd:card:1" });

    expect(result.favouriteGamesErrorState).toEqual({
      timestamp: 123456789,
      gameId: "game-123",
    });
  });

  describe("when `getUserDetails` throws", () => {
    const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

    beforeEach(() => {
      getGameByURN.mockReturnValue(BASE_MOCK);
      getUserDetails.mockImplementationOnce(() => {
        throw new Error(GET_USER_DETAILS_ERROR);
      });
    });

    it("should call console.error with the error thrown by `getUserDetails`", () => {
      setupMapStateToProps(stateMock.layouts.cards.games["urn:tbd:card:1"]);

      expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
    });

    it("should return an empty object", () => {
      expect(setupMapStateToProps(stateMock.layouts.cards.games["urn:tbd:card:1"])).toEqual({});
    });
  });

  it("if getGameCardViewModel is null, should return empty object", () => {
    getGameCard.mockImplementation(() => stateMock.layouts.cards.games["urn:tbd:card:1"]);
    createCardByURNSelector.mockImplementation(() => getGameCard);
    getGameByURN.mockReturnValue({
      urn: "ppb:game:irish-riches-abp",
      name: "Irish Riches",
      gameLauncherParams: "fakeGameLaunchParams",
      launchId: "ppb:game:irish-riches-abp",
      rgsCodeMobile: "BP_IrishRiches",
      label: "NEW",
      provider: "prismic:betfair-com-dev:id:WoFV1R4AAIPb2Jai",
      mainProduct: "prismic:betfair-com-dev:id:WoGtmB4AADAA2jOs",
      jackpotLogo: "Jackpot King",
      backgroundColor: "darkgreen - green",
      description: "DESCRIPTION",
      rtp: "87.04%",
    });
    createGameCardViewModel.mockReturnValue(() => null);

    const props = makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1" });
    expect(props).toEqual({});
  });

  it("when there is no card for provided URN should return empty object", () => {
    const gameCard = setupMapStateToProps(null);
    expect(gameCard).toEqual({});
  });

  it("when there is no game for provided URN should return empty object", () => {
    getGameCard.mockImplementation(() => stateMock.layouts.cards.games["urn:tbd:card:1"]);
    createCardByURNSelector.mockImplementation(() => getGameCard);
    getGameByURN.mockReturnValue(null);

    const props = makeMapStateToProps()(stateMock, { urn: "urn:tbd:card:1" });
    expect(props).toEqual({});
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchLaunchGame", () => {
    it("should dispatch launch game", () => {
      const { dispatchLaunchGame } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      const gameUrnMock = "fakeGameUrn";
      const urnMock = "fakeUrn";
      const platformTypeMock = "web";

      const result = dispatchLaunchGame(viewLinkMock, gameUrnMock, urnMock, platformTypeMock);

      expect(result).toEqual({
        payload: {
          href: viewLinkMock.viewUrl,
          gameUrn: gameUrnMock,
          cardUrn: urnMock,
          platformType: platformTypeMock,
        },
        type: UI__LAUNCH_GAME,
      });
    });
  });

  describe("dispatchNavigateToGameInfoView", () => {
    it("should dispatch navigate to game info view", () => {
      const { dispatchNavigateToGameInfoView } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      const gameUrnMock = "fakeGameUrn";
      const urnMock = "fakeUrn";

      expect(dispatchNavigateToGameInfoView(viewLinkMock, gameUrnMock, urnMock)).toEqual({
        payload: {
          href: viewLinkMock.viewUrl,
          gameUrn: gameUrnMock,
          cardUrn: urnMock,
        },
        type: UI__NAVIGATE_TO_GAME_INFO_VIEW,
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("shoud dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };

      expect(dispatchPushAction(viewLinkMock)).toEqual({
        payload: viewLinkMock,
        type: PUSH,
      });
    });
  });

  describe("dispatchSubscribeToUpdateGameFeedResults", () => {
    it("shoud dispatch subscribe to update physical table results action", () => {
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

  describe("dispatchGameLaunchRefresh", () => {
    it("should dispatch game launch to refresh the recently played games list", () => {
      const { dispatchGameLaunchRefresh } = mapDispatchToProps;
      const gameUrnMock = "fakeGameUrn";
      expect(dispatchGameLaunchRefresh({ urn: gameUrnMock, typename: "GameCard" })).toEqual({
        type: GAME_LAUNCH,
        payload: { urn: gameUrnMock, typename: "GameCard" },
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
