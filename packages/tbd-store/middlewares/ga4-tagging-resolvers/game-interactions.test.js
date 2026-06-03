import { buildGameInteractionsEvent } from "tagging-library";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import {
  getLoadPrizeMachineEvent,
  getLoadPlayNewEvent,
  getJackpotMerchandiseViewEvent,
  getLoadedPageContentEvent,
  getAddGameToFavouritesEvent,
  getRemoveGameFromFavouritesEvent,
} from "./game-interactions";
import { createCardGroupByURNSelector } from "../../state/layout/cardgroups/cardgroups-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getLayoutMetadata } from "../../state/layout-snapshot";

const metadataMock = {
  verticalPosition: 1,
};

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => metadataMock),
}));

jest.mock("../../state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

jest.mock("../../state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("tagging-library", () => ({
  buildGameInteractionsEvent: jest.fn().mockReturnValue("buildGameInteractionsEvent"),
}));

describe("game interactions events", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const mockCardGroupSelector = jest.fn().mockReturnValue({
      items: [{ urn: "test:game:uid/game-name" }],
    });

    const mockGameCardSelector = jest.fn().mockReturnValue({
      game: "test:game:uid/game-name",
    });

    createCardGroupByURNSelector.mockReturnValue(mockCardGroupSelector);
    createCardByURNSelector.mockReturnValue(mockGameCardSelector);

    getLayoutMetadata.mockReturnValue(metadataMock);
    buildGameInteractionsEvent.mockReturnValue("buildGameInteractionsEvent");
  });

  describe("getLoadPrizeMachineEvent", () => {
    it("should return the correct event", () => {
      const params = {
        urn: "urn",
        hasJackpot: true,
        jackpotState: "jackpotState",
        guaranteedPrize: true,
      };

      const result = getLoadPrizeMachineEvent(params, {});

      expect(buildGameInteractionsEvent).toHaveBeenCalledWith({
        gameName: "prize pinball",
        gameId: "prize pinball",
        position: "",
        gameProvider: "",
        moduleDisplayOrder: "1",
        gameState: "",
        action: TaggingAction.DISPLAYED,
        module: "prize machine",
        stake: "",
        winnings: "",
        elementText: "prize machine - plus - active jackpot - jackpotState",
      });
      expect(result).toBe("buildGameInteractionsEvent");
    });
  });

  describe("getLoadPlayNewEvent", () => {
    describe("when loading play new widget on a view", () => {
      it("should be called with correct params and return the correct value when isStaticPromo is true", () => {
        const action = {
          payload: {
            urn: "urn",
            isStaticPromo: true,
            parents: "parents",
          },
        };

        const result = getLoadPlayNewEvent(action, {});

        expect(buildGameInteractionsEvent).toHaveBeenCalledWith({
          gameName: "spin until you win - hype building",
          gameId: "spin until you win - hype building",
          position: "",
          gameProvider: "",
          moduleDisplayOrder: "1",
          gameState: "",
          action: TaggingAction.DISPLAYED,
          module: "spin until you win",
          stake: "",
          winnings: "",
          elementText: "",
        });
        expect(result).toBe("buildGameInteractionsEvent");
      });

      it("should be called with correct params and return the correct value when isStaticPromo is false", () => {
        const action = {
          payload: {
            urn: "urn",
            isStaticPromo: false,
            parents: "parents",
          },
        };

        const result = getLoadPlayNewEvent(action, {});

        expect(buildGameInteractionsEvent).toHaveBeenCalledWith({
          gameName: "spin until you win - active",
          gameId: "spin until you win - active",
          position: "",
          gameProvider: "",
          moduleDisplayOrder: "1",
          gameState: "",
          action: TaggingAction.DISPLAYED,
          module: "spin until you win",
          stake: "",
          winnings: "",
          elementText: "",
        });
        expect(result).toBe("buildGameInteractionsEvent");
      });
    });
  });

  describe("getJackpotMerchandiseViewEvent", () => {
    const action = {
      payload: {
        state: "hot",
        name: "name",
        urn: "card:URN",
        parents: ["parent 1", "parent 2"],
        elementText: "element text",
      },
    };
    const getState = (noViewZone, noGamingCardGroup) => ({
      entities: {
        games: {
          "test:game:uid/game-name": {
            urn: "test:game:uid/game-name",
            name: "game name",
            launchId: "game id",
            provider: {
              name: "provider",
            },
            mainProduct: "gaming",
          },
          "test:game:uid/game-name2": {
            urn: "test:game:uid/game-name2",
            name: "game name2",
            launchId: "game id2",
            provider: {
              name: "provider2",
            },
            mainProduct: "gaming",
          },
        },
      },
      layouts: {
        cardgroups: {
          gamingcardgroups: {
            "card:URN": {
              typename: "GamingCardGroup",
              urn: "card:URN",
              items: [
                {
                  typename: "GameCard",
                  urn: "test:game:uid/game-name",
                },
                {
                  typename: "GameCard",
                  urn: "test:game:uid/game-name2",
                },
              ],
            },
          },
        },
        cards: {
          games: {
            "test:game:uid/game-name": {
              typename: "GameCard",
              urn: "test:game:uid/game-name",
              game: "test:game:uid/game-name",
            },
            "test:game:uid/game-name2": {
              typename: "GameCard",
              urn: "test:game:uid/game-name2",
              game: "test:game:uid/game-name2",
            },
          },
        },
        views: {
          gaming: {
            "view:gaming": {
              urn: "view:gaming",
              typename: "GamingView",
              items: [
                {
                  urn: "gaming:masterConfigElement:jackpot_merchandising/1",
                  typename: "ViewZone",
                },
              ],
            },
          },
        },
        viewzones: noViewZone
          ? {}
          : {
              "gaming:masterConfigElement:jackpot_merchandising/1": {
                urn: "gaming:masterConfigElement:jackpot_merchandising/1",
                typename: "ViewZone",
                title: "jackpot title",
                items: [{ typename: noGamingCardGroup ? "XCardGroup" : "GamingCardGroup", urn: "card:URN" }],
              },
            },
      },
      router: {
        currentView: "view:gaming",
        currentUrn: "view:gaming",
      },
    });
    it("should call buildGameInteractionsEvent with the correct payload when state is complete", () => {
      const result = getJackpotMerchandiseViewEvent(action, getState());

      expect(buildGameInteractionsEvent).toHaveBeenCalledWith({
        elementText: "element text",
        module: "name",
        gameId: "game id",
        gameName: "game name",
        gameProvider: "provider",
        position: "",
        moduleDisplayOrder: "1",
        gameState: "hot",
        action: "displayed",
        stake: "",
        winnings: "",
      });
      expect(result).toEqual("buildGameInteractionsEvent");
    });

    it("should call buildGameInteractionsEvent with the correct payload when state has no propper view zone", () => {
      const result = getJackpotMerchandiseViewEvent(action, getState(true));

      expect(buildGameInteractionsEvent).toHaveBeenCalledWith({
        elementText: "element text",
        module: "name",
        gameId: "",
        gameName: "",
        gameProvider: "",
        position: "",
        moduleDisplayOrder: "1",
        gameState: "hot",
        action: "displayed",
        stake: "",
        winnings: "",
      });
      expect(result).toEqual("buildGameInteractionsEvent");
    });

    it("should call buildGameInteractionsEvent with the correct payload when gamingcardgroups has different typename than GamingCardGroup", () => {
      const result = getJackpotMerchandiseViewEvent(action, getState(false, true));

      expect(buildGameInteractionsEvent).toHaveBeenCalledWith({
        elementText: "element text",
        module: "name",
        gameId: "",
        gameName: "",
        gameProvider: "",
        position: "",
        moduleDisplayOrder: "1",
        gameState: "hot",
        action: "displayed",
        stake: "",
        winnings: "",
      });
      expect(result).toEqual("buildGameInteractionsEvent");
    });
  });

  describe("getLoadedPageContentEvent", () => {
    const mockCardGroupUrn = "urn:cardgroup:123";
    const mockGameURN = "urn:game:123";

    const mockAction = {
      payload: {
        urn: "urn:page:1",
        title: "New releases",
      },
    };

    const mockState = {
      layouts: {
        cardgroups: {
          gamingcardgroups: {
            [mockCardGroupUrn]: {
              items: [{ urn: mockGameURN }],
            },
          },
        },
        cards: {
          games: {
            [mockGameURN]: {
              game: "game-id-1",
            },
          },
        },
      },
      entities: {
        games: {
          "game-id-1": {
            name: "Game Test",
            launchId: "launch-1",
            provider: {
              name: "GameProvider",
            },
          },
        },
      },
    };

    beforeEach(() => {
      jest.clearAllMocks();

      getLayoutMetadata.mockReturnValue({
        cardGroupUrn: mockCardGroupUrn,
        verticalPosition: 2,
      });

      const mockCardGroupSelector = jest.fn().mockReturnValue({
        items: [{ urn: mockGameURN }],
      });
      const mockGameCardSelector = jest.fn().mockReturnValue({
        game: "game-id-1",
      });

      createCardGroupByURNSelector.mockReturnValue(mockCardGroupSelector);
      createCardByURNSelector.mockReturnValue(mockGameCardSelector);

      buildGameInteractionsEvent.mockImplementation((params) => ({
        ...params,
      }));
    });

    it("should return a correctly built GameInteractionsEvent", () => {
      const result = getLoadedPageContentEvent(mockAction, mockState);

      expect(result).toEqual({
        elementText: "New releases",
        module: JSON.stringify(mockCardGroupUrn),
        gameName: "Game Test",
        gameId: "launch-1",
        position: "null",
        gameProvider: "GameProvider",
        moduleDisplayOrder: "2",
        gameState: "",
        action: TaggingAction.DISPLAYED,
      });

      expect(getLayoutMetadata).toHaveBeenCalledWith("urn:page:1");
      expect(buildGameInteractionsEvent).toHaveBeenCalled();
    });

    it("should return null values when no card group is found", () => {
      const mockCardGroupSelector = jest.fn().mockReturnValue(null);
      createCardGroupByURNSelector.mockReturnValue(mockCardGroupSelector);

      const result = getLoadedPageContentEvent(mockAction, mockState);

      expect(result.gameName).toBe("");
      expect(result.gameId).toBe("");
      expect(result.gameProvider).toBe("");
    });
  });

  describe("getAddGameToFavouritesEvent", () => {
    beforeEach(() => {
      buildGameInteractionsEvent.mockImplementation((params) => ({
        ...params,
      }));
    });

    it("should return correctly built GameInteractionsEvent with all data", () => {
      const action = {
        payload: {
          gameId: "game-123",
          gameName: "Starburst",
          gameProvider: "NetEnt",
          mainProduct: "arcade",
          urn: "urn:game:card:1",
        },
      };

      getLayoutMetadata.mockReturnValue({
        horizontalPosition: 3,
        verticalPosition: 2,
      });

      const result = getAddGameToFavouritesEvent(action, {});

      expect(result).toEqual({
        elementText: "",
        module: "",
        gameName: "Starburst",
        gameId: "game-123",
        position: "3",
        gameProvider: "NetEnt",
        moduleDisplayOrder: "2",
        gameState: "",
        action: "added game to favourites",
      });

      expect(getLayoutMetadata).toHaveBeenCalledWith("urn:game:card:1");
      expect(buildGameInteractionsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "added game to favourites",
          gameId: "game-123",
          gameName: "Starburst",
          gameProvider: "NetEnt",
        }),
      );
    });

    it("should return null when urn is missing", () => {
      const action = {
        payload: {
          gameId: "game-456",
          gameName: "Book of Dead",
          gameProvider: "Play'n GO",
          mainProduct: "arcade",
        },
      };

      const result = getAddGameToFavouritesEvent(action, {});

      expect(result).toBeNull();
    });

    it("should handle cardGroupUrn and segmentedCardGroupUrn in module", () => {
      const action = {
        payload: {
          gameId: "game-789",
          gameName: "Gonzo's Quest",
          gameProvider: "NetEnt",
          mainProduct: "arcade",
          urn: "urn:game:card:2",
          cardGroupUrn: "urn:cardgroup:featured",
          segmentedCardGroupUrn: "urn:segmented:new-games",
        },
      };

      getLayoutMetadata.mockReturnValue({
        horizontalPosition: 1,
        verticalPosition: 0,
      });

      const result = getAddGameToFavouritesEvent(action, {});

      expect(result.module).toBe("urn:cardgroup:featured");
      expect(result.position).toBe("1");
      expect(result.moduleDisplayOrder).toBe("0");
    });

    it("should return null when gameName is missing", () => {
      const action = {
        payload: {
          gameId: "game-123",
          product: "arcade",
        },
      };

      const result = getAddGameToFavouritesEvent(action, {});

      expect(result).toBeNull();
    });

    it("should return null when gameProvider is missing", () => {
      const action = {
        payload: {
          gameId: "game-123",
          gameName: "Starburst",
          product: "arcade",
        },
      };

      const result = getAddGameToFavouritesEvent(action, {});

      expect(result).toBeNull();
    });

    it("should return null when urn is missing", () => {
      const action = {
        payload: {
          gameId: "game-123",
          gameName: "Starburst",
          gameProvider: "NetEnt",
          product: "arcade",
        },
      };

      const result = getAddGameToFavouritesEvent(action, {});

      expect(result).toBeNull();
    });
  });

  describe("getRemoveGameFromFavouritesEvent", () => {
    beforeEach(() => {
      buildGameInteractionsEvent.mockImplementation((params) => ({
        ...params,
      }));
    });

    it("should return correctly built GameInteractionsEvent with all data", () => {
      const action = {
        payload: {
          gameId: "game-321",
          gameName: "Mega Moolah",
          gameProvider: "Microgaming",
          mainProduct: "arcade",
          urn: "urn:game:card:5",
        },
      };

      getLayoutMetadata.mockReturnValue({
        horizontalPosition: 5,
        verticalPosition: 1,
      });

      const result = getRemoveGameFromFavouritesEvent(action, {});

      expect(result).toEqual({
        elementText: "",
        module: "",
        gameName: "Mega Moolah",
        gameId: "game-321",
        position: "5",
        gameProvider: "Microgaming",
        moduleDisplayOrder: "1",
        gameState: "",
        action: "removed game from favourites",
      });

      expect(getLayoutMetadata).toHaveBeenCalledWith("urn:game:card:5");
      expect(buildGameInteractionsEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "removed game from favourites",
          gameId: "game-321",
          gameName: "Mega Moolah",
          gameProvider: "Microgaming",
        }),
      );
    });

    it("should return null when urn is missing", () => {
      const action = {
        payload: {
          gameId: "game-654",
          gameName: "Divine Fortune",
          gameProvider: "NetEnt",
          mainProduct: "arcade",
        },
      };

      const result = getRemoveGameFromFavouritesEvent(action, {});

      expect(result).toBeNull();
    });

    it("should prioritize cardGroupUrn over segmentedCardGroupUrn in module", () => {
      const action = {
        payload: {
          gameId: "game-999",
          gameName: "Rainbow Riches",
          gameProvider: "Barcrest",
          mainProduct: "arcade",
          urn: "urn:game:card:3",
          cardGroupUrn: "urn:cardgroup:jackpots",
          segmentedCardGroupUrn: "urn:segmented:hot-games",
        },
      };

      getLayoutMetadata.mockReturnValue({
        horizontalPosition: 2,
        verticalPosition: 3,
      });

      const result = getRemoveGameFromFavouritesEvent(action, {});

      expect(result.module).toBe("urn:cardgroup:jackpots");
      expect(result.position).toBe("2");
      expect(result.moduleDisplayOrder).toBe("3");
    });

    it("should return null when gameName is missing", () => {
      const action = {
        payload: {
          gameId: "game-123",
          product: "arcade",
        },
      };

      const result = getRemoveGameFromFavouritesEvent(action, {});

      expect(result).toBeNull();
    });

    it("should return null when gameProvider is missing", () => {
      const action = {
        payload: {
          gameId: "game-123",
          gameName: "Starburst",
          product: "arcade",
        },
      };

      const result = getRemoveGameFromFavouritesEvent(action, {});

      expect(result).toBeNull();
    });

    it("should return null when urn is missing", () => {
      const action = {
        payload: {
          gameId: "game-123",
          gameName: "Starburst",
          gameProvider: "NetEnt",
          product: "arcade",
        },
      };

      const result = getRemoveGameFromFavouritesEvent(action, {});

      expect(result).toBeNull();
    });
  });
});
