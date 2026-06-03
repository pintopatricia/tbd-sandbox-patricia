const { GamingPagePO, GameTilePO, GamingCardGroupPO } = require("../../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const gamingPagePO = new GamingPagePO();
const gamingCardGroupPagePO = new GamingCardGroupPO();
const firstGameTilePO = new GameTilePO(gamingPagePO.gameTiles[0]);
const secondGameTilePO = new GameTilePO(gamingPagePO.gameTiles[1]);
const thirdGameTilePO = new GameTilePO(gamingPagePO.gameTiles[2]);
const fourthGameTilePO = new GameTilePO(gamingPagePO.gameTiles[3]);

const mockService = new MockService();

const BFF_FAVOURITES_GAMES_GRID_MOCK = {
  __typename: "GamingCategoryView",
  urn: "ppb:tbd:view:gamingCategory:bfrb-favourite-games",
  url: routes.getGamingCategoryViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:card:group:gaming:favouriteGames:uid/bfrb-favourite-games-zone",
        cardGroupTitle: "Favourites",
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        type: "FAVOURITE_GAMES",
        full: {
          __typename: "GamingCardGroupItemsConnection",
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:game:game-0",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "First Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-0",
                  backgroundColor: "#B22222",
                  copyrightText: "Game Tile Copyright Text 0",
                  label: "NEW",
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-1",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Second Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-1",
                  backgroundColor: "#B22222",
                  feedData: {
                    lastNumbers: [
                      { color: "red", number: "14" },
                      { color: "green", number: "0" },
                      { color: "black", number: "13" },
                      { color: "black", number: "23" },
                      { color: "red", number: "3" },
                      { color: "black", number: "11" },
                      { color: "black", number: "10" },
                      { color: "black", number: "8" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Third Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-2",
                  backgroundColor: "#B22222",
                  feedData: {
                    availableSeats: "8",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-3",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Fourth Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-3",
                  backgroundColor: "#B22222",
                  label: "JACKPOT",
                  feedData: {
                    jackpot: 1000000,
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            { node: { urn: "ppb:tbd:card:game:game-0", __typename: "GameCard" } },
            { node: { urn: "ppb:tbd:card:game:game-1", __typename: "GameCard" } },
            { node: { urn: "ppb:tbd:card:game:game-2", __typename: "GameCard" } },
            { node: { urn: "ppb:tbd:card:game:game-3", __typename: "GameCard" } },
          ],
        },
      },
    },
  ],
};

const BFF_FAVOURITES_GAMES_EMPTY_GRID_MOCK = {
  __typename: "GamingCategoryView",
  urn: "ppb:tbd:view:gamingCategory:bfrb-favourite-games",
  url: routes.getGamingCategoryViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:card:group:gaming:favouriteGames:uid/bfrb-favourite-games-zone",
        cardGroupTitle: "Favourites",
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        type: "FAVOURITE_GAMES",
        full: {
          __typename: "GamingCardGroupItemsConnection",
          edges: [],
        },
        partials: {
          edges: [],
        },
      },
    },
  ],
};

describe("Gaming Favourites Grid Component - Phone Regression", () => {
  describe("When gaming favourites grid contains games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_FAVOURITES_GAMES_GRID_MOCK.urn, {
          USER_FAVOURITE_GAMES: { isActive: true },
          pause: true,
        }),
      );
      await mockService.mockHttpRequest(getGamingLayout(BFF_FAVOURITES_GAMES_GRID_MOCK));
      await browser.url(`${routes.getGamingCategoryViewUrl("1")}`);
      await browser.flushFakeClockTimers();
      await browser.waitUntilDisplayed(gamingPagePO.element);
      await browser.waitUntilDisplayed(gamingCardGroupPagePO.favouritesWelcome);
    });

    it("[PRPI-5106]Then the gaming page container should be displayed", async () => {
      expect(await gamingPagePO.gamingPageContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-5107]And the games grid should be displayed", async () => {
      expect(await gamingPagePO.gamesGrid.isDisplayed()).toBe(true);
    });

    it("[PRPI-5108]And the title of the grid should be: Welcome to your FAVOURITES COLLECTION", async () => {
      expect(await gamingCardGroupPagePO.favouritesWelcome.getText()).toBe("Welcome to your");
      expect(await gamingCardGroupPagePO.favouritesTitle.getText()).toBe("COLLECTION OF FAVOURITES");
    });

    it("[PRPI-5109]And there should be 4 game containers displayed", async () => {
      expect(await gamingPagePO.gameContainers.length).toBe(4);
    });

    it("[PRPI-5110]And there should be 4 game tiles displayed", async () => {
      expect(await gamingPagePO.gameTiles.length).toBe(4);
    });

    it("[PRPI-5111]And the first game tile should have a title of: First Game Tile", async () => {
      expect(await firstGameTilePO.gameTitle.getText()).toBe("First Game Tile");
    });

    it("[PRPI-5817] And it should contain favourite button", async () => {
      expect(await firstGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5112]And it should have a copyright text: Game Tile Copyright Text 0", async () => {
      expect(await firstGameTilePO.gameCopyright.getText()).toBe("Game Tile Copyright Text 0");
    });

    it("[PRPI-5113]And it should have a badge with the text: NEW", async () => {
      expect(await firstGameTilePO.badge.getText()).toBe("NEW");
    });

    it("[PRPI-5114]And it should have a visible game info button", async () => {
      expect(await firstGameTilePO.gameInfoButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5115]And the second game tile should have a visible badge", async () => {
      expect(await secondGameTilePO.badge.isDisplayed()).toBe(true);
    });

    it("[PRPI-8360] And second game should contain favourite button", async () => {
      expect(await secondGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5116]And the badge should contain the 'rouletteNumbers' class", async () => {
      expect(await browser.containsClass(secondGameTilePO.badge, GameTilePO.states.rouletteNumbers)).toBe(true);
    });

    it("[PRPI-5117]And it should contain 8 numbers", async () => {
      expect(await secondGameTilePO.badgeRouletteNumbers.length).toEqual(8);
    });

    it("[PRPI-5118]And the first number should be 14 and the last number should be 8", async () => {
      expect(await secondGameTilePO.badgeRouletteNumbers[0].getText()).toBe("14");
      expect(await secondGameTilePO.badgeRouletteNumbers[7].getText()).toBe("8");
    });

    it("[PRPI-5119]And the third game tile should have a visible badge", async () => {
      expect(await thirdGameTilePO.badge.isDisplayed()).toBe(true);
    });

    it("[PRPI-8361] And third game should contain favourite button", async () => {
      expect(await thirdGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5120]And it should contain the 'seatsAvailable' class", async () => {
      expect(await browser.containsClass(thirdGameTilePO.badge, GameTilePO.states.seatsAvailable)).toBe(true);
    });

    it("[PRPI-5121]And the text should be 8 SEATS AVAILABLE", async () => {
      expect(await thirdGameTilePO.badge.getText()).toBe("8 SEATS AVAILABLE");
    });

    it("[PRPI-5122]And the fourth game tile should have a visible badge", async () => {
      expect(await fourthGameTilePO.badge.isDisplayed()).toBe(true);
    });

    it("[PRPI-8362] And fourth game should contain favourite button", async () => {
      expect(await fourthGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5123]And it should contain the 'jackpot' class", async () => {
      expect(await browser.containsClass(fourthGameTilePO.badge, GameTilePO.states.jackpot)).toBe(true);
    });

    it("[PRPI-5124]And the value should be displayed", async () => {
      expect(await fourthGameTilePO.badge.getText()).toBe("$1,000,000.00");
    });
  });

  describe("When gaming favourites grid is empty", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_FAVOURITES_GAMES_EMPTY_GRID_MOCK.urn, { pause: true }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_FAVOURITES_GAMES_EMPTY_GRID_MOCK));
      await browser.url(`${routes.getGamingCategoryViewUrl("1")}`);
      await browser.flushFakeClockTimers();
      await browser.waitUntilDisplayed(gamingPagePO.element);
      await browser.waitUntilDisplayed(gamingCardGroupPagePO.favouritesWelcome);
    });

    it("[PRPI-5125]And the title of the grid should be displayed", async () => {
      expect(await gamingCardGroupPagePO.favouritesWelcome.getText()).toBe("Welcome to your");

      expect(await gamingCardGroupPagePO.favouritesTitle.getText()).toBe("COLLECTION OF FAVOURITES");
    });

    it("[PRPI-5126]And the empty state message of the grid should be displayed", async () => {
      expect(await gamingCardGroupPagePO.favouritesEmptyMessage.getText()).toContain(
        "Your personal library of games you have a special affection for. Here you can create your own collection of games for easy access",
      );

      expect(await gamingCardGroupPagePO.favouritesEmptyInstruction.getText()).toBe(
        "Click the \n in any game to add it to your collection of favorites",
      );

      expect(await gamingCardGroupPagePO.favouritesHeartIcon.isDisplayed()).toBe(true);
    });
  });
});
