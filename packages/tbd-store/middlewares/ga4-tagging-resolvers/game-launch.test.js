import { buildGameLaunchEvent } from "tagging-library";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import {
  getGameTileClickEvent,
  getGameLaunchFromGameInfoEvent,
  getGameLaunchFromBottomBar,
  getGameLaunchFromPNEvent,
} from "./game-launch";
import { getGamingSearchGamePositionByURN } from "../../state/layout/gaming-search/gaming-search-selectors";

const metadataMock = {
  verticalPosition: 1,
  viewZoneTitle: "Curated Games",
  horizontalPosition: 3,
};

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => metadataMock),
}));

const mockState = {
  entities: {
    games: {},
  },
  layouts: {
    gamingSearch: {},
  },
};

jest.mock("../../state/entities/games/game-selectors", () => ({
  getGameByURN: jest.fn(() => ({
    name: "gameName",
    provider: {
      name: "gameProvider",
    },
    label: "Ted",
    launchId: "gameId",
  })),
}));

jest.mock("../../state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => jest.fn(() => ({ urn: "urn:game:1" }))),
}));

const mockResults = {
  results: ["game1", "game2"],
  inputSearchTerm: "game",
  gamesRetrieved: true,
};

const mockNoResults = {
  results: [],
  inputSearchTerm: "game",
  gamesRetrieved: true,
};

const getGamingSearchInterface = jest.fn();

jest.mock("../../state/layout/gaming-search/gaming-search-selectors", () => ({
  createGamingSearchInterfaceSelector: jest.fn(() => getGamingSearchInterface),
  getGamingSearchGamePositionByURN: jest.fn(),
}));

jest.mock("tagging-library", () => ({
  buildGameLaunchEvent: jest.fn().mockReturnValue("buildGameLaunchEvent"),
}));

describe("game launch events", () => {
  describe("getGameTileClickEvent", () => {
    describe("when clicking in a game tile to launch a game", () => {
      it("should be called with correct params and return the correct value", () => {
        const action = {
          payload: {
            href: "href.com",
          },
        };

        getGamingSearchInterface.mockReturnValue(mockNoResults);
        getGamingSearchGamePositionByURN.mockReturnValue(3);
        const result = getGameTileClickEvent(action, mockState);

        expect(buildGameLaunchEvent).toHaveBeenCalledWith({
          gameId: "gameId",
          gameName: "gameName",
          gameProvider: "gameProvider",
          position: "4",
          moduleDisplayOrder: "1",
          gameFilter: undefined,
          gameState: "",
          gameAction: TaggingAction.CLICKED_PLAY_NOW,
          destinationUrl: "href.com",
          module: "Curated Games",
          type: "real play",
        });
        expect(result).toBe("buildGameLaunchEvent");
      });
    });

    describe("when clicking in a game tile from games search results to launch a game", () => {
      it("should be called with correct params and return the correct value", () => {
        const action = {
          payload: {
            href: "href.com",
          },
        };
        getGamingSearchInterface.mockReturnValue(mockResults);
        getGamingSearchGamePositionByURN.mockReturnValue(1);
        const result = getGameTileClickEvent(action, mockState);

        expect(buildGameLaunchEvent).toHaveBeenCalledWith({
          gameId: "gameId",
          gameName: "gameName",
          gameProvider: "gameProvider",
          position: "2",
          moduleDisplayOrder: "1",
          gameState: "",
          gameAction: TaggingAction.CLICKED_PLAY_NOW,
          gameFilter: "2 results for game",
          destinationUrl: "href.com",
          module: "games search",
          type: "real play",
        });
        expect(result).toBe("buildGameLaunchEvent");
      });
    });
  });

  describe("getGameLaunchFromGameInfoEvent", () => {
    describe("when clicking on a Play now button from Game Info Page", () => {
      it("should be called with correct params and return the correct value", () => {
        const action = {
          payload: {
            href: "href.com",
            isDemo: true,
          },
        };

        const result = getGameLaunchFromGameInfoEvent(action, {
          entities: { game: {} },
        });

        expect(buildGameLaunchEvent).toHaveBeenCalledWith({
          gameAction: "clicked play now",
          gameId: "gameId",
          gameName: "gameName",
          gameProvider: "gameProvider",
          position: "",
          moduleDisplayOrder: "",
          gameState: "",
          destinationUrl: "href.com",
          module: "game info cta",
          type: "demo play",
        });
        expect(result).toBe("buildGameLaunchEvent");
      });
    });
  });

  describe("getGameLaunchFromBottomBar", () => {
    describe("when clicking on a ExperimentalBottomBarTile on Bottom Bar", () => {
      it("should be called with correct params and return the correct value", () => {
        const action = {
          payload: {
            path: "game-url.com",
            tile: "roulette",
          },
        };

        const result = getGameLaunchFromBottomBar(action, {
          entities: { game: {} },
        });

        expect(buildGameLaunchEvent).toHaveBeenCalledWith({
          gameAction: "clicked play now",
          gameId: "roulette",
          gameName: "roulette",
          gameProvider: "playtech",
          position: "4",
          moduleDisplayOrder: "",
          gameState: "",
          destinationUrl: "game-url.com",
          module: "bottom bar",
          type: "real play",
        });
        expect(result).toBe("buildGameLaunchEvent");
      });
    });
  });

  describe("getGameLaunchFromPN", () => {
    beforeEach(() => {
      buildGameLaunchEvent.mockClear();
    });
    it("should build event correctly and called with correct params and return the correct value", () => {
      const action = {
        payload: {
          gameId: "gameId",
          href: "https://some.url/launch?gameId=gameId",
        },
      };

      const result = getGameLaunchFromPNEvent(action, {
        entities: {
          games: {
            "urn:game:gameId": {
              name: "gameName",
              provider: {
                name: "gameProvider",
              },
              label: "Ted",
              launchId: "gameId",
            },
          },
        },
        layouts: {
          gamingSearch: {},
        },
      });

      expect(buildGameLaunchEvent).toHaveBeenCalledTimes(1);
      expect(buildGameLaunchEvent).toHaveBeenCalledWith({
        gameId: "gameId",
        gameName: "gameName",
        gameProvider: "gameProvider",
        position: "null",
        moduleDisplayOrder: "",
        gameState: "",
        gameAction: "null",
        destinationUrl: "https://some.url/launch?gameId=gameId",
        module: "push notification",
        type: "real play",
      });

      expect(result).toBe("buildGameLaunchEvent");
    });
  });

  describe("getGameLaunchFromWidgetEvent", () => {
    describe("when launching a game from the widget", () => {
      const mockState = {
        entities: {
          games: {
            "ppb:tbd:game:mega-fire-blaze-roulette-live": {
              urn: "ppb:tbd:game:mega-fire-blaze-roulette-live",
              name: "mega fire blaze roulette live",
              launchId: "mega-fb-roulete-cptl",
              provider: {
                name: "playtech - alias - live",
                uid: "playtech",
              },
            },
          },
        },
      };

      const mockAction = {
        type: "UI__LAUNCH_GAME_FROM_WIDGET",
        payload: {
          href: "https://launcher.example.com/game?gameId=mega-fb-roulete-cptl",
          gameUrn: "ppb:tbd:game:mega-fire-blaze-roulette-live",
          cardUrn: "ppb:tbd:card:gaming:game:mega-fire-blaze-roulette-live",
          platformType: require("../tagging-resolvers/AnalyticsConstants").PlatformType.Web,
        },
      };

      it("should be called with correct params and return the correct value", () => {
        const { getGameLaunchFromWidgetEvent } = require("./game-launch");
        const { buildGameLaunchEvent } = require("tagging-library");
        buildGameLaunchEvent.mockClear();
        const result = getGameLaunchFromWidgetEvent(mockAction, mockState);

        expect(buildGameLaunchEvent).toHaveBeenCalledWith({
          gameId: "gameId",
          gameName: "gameName",
          gameProvider: "gameProvider",
          position: "0",
          moduleDisplayOrder: "0",
          gameState: "null",
          gameAction: "clicked play now",
          destinationUrl: "https://launcher.example.com/game?gameId=mega-fb-roulete-cptl",
          module: "x-sell enhancement - floating icon",
          type: "real play",
          swimlaneType: "null",
          promotionIndicator: "null",
          gameFilter: "null",
        });
        expect(result).toBe("buildGameLaunchEvent");
      });
    });

    describe("when the game is missing in state", () => {
      const mockAction = {
        type: "UI__LAUNCH_GAME_FROM_WIDGET",
        payload: {
          href: "https://launcher.example.com/game?gameId=mega-fb-roulete-cptl",
          gameUrn: "ppb:tbd:game:mega-fire-blaze-roulette-live",
          cardUrn: "ppb:tbd:card:gaming:game:mega-fire-blaze-roulette-live",
          platformType: require("../tagging-resolvers/AnalyticsConstants").PlatformType.Web,
        },
      };
      const stateWithoutGame = {
        entities: {
          games: {},
        },
      };

      it("should be called with correct params and return the correct value", () => {
        const { getGameLaunchFromWidgetEvent } = require("./game-launch");
        const { buildGameLaunchEvent } = require("tagging-library");
        buildGameLaunchEvent.mockClear();
        const result = getGameLaunchFromWidgetEvent(mockAction, stateWithoutGame);

        expect(buildGameLaunchEvent).toHaveBeenCalledWith({
          gameId: "gameId",
          gameName: "gameName",
          gameProvider: "gameProvider",
          position: "0",
          moduleDisplayOrder: "0",
          gameState: "null",
          gameAction: "clicked play now",
          destinationUrl: "https://launcher.example.com/game?gameId=mega-fb-roulete-cptl",
          module: "x-sell enhancement - floating icon",
          type: "real play",
          swimlaneType: "null",
          promotionIndicator: "null",
          gameFilter: "null",
        });
        expect(result).toBe("buildGameLaunchEvent");
      });
    });
  });
});
