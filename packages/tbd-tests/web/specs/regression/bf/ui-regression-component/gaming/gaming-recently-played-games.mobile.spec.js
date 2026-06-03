const { GamingPagePO, GameTilePO } = require("../../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const gamingPagePO = new GamingPagePO();
const firstGameTile = new GameTilePO(gamingPagePO.gameTiles[0]);
const secondGameTile = new GameTilePO(gamingPagePO.gameTiles[1]);
const thirdGameTile = new GameTilePO(gamingPagePO.gameTiles[2]);
const fourthGameTile = new GameTilePO(gamingPagePO.gameTiles[3]);

const mockService = new MockService();

const BFF_FOUR_RECENTLY_PLAYED_GAMES_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:group:recentlyPlayedGames:recentlyPlayedGamesZoneCode/recently_played",
        __typename: "GamingCardGroup",
        cardGroupTitle: "Recently Played",
        defaultLayout: "GRID_FOUR_COLUMNS",
        layouts: ["GRID_FOUR_COLUMNS"],
        full: {
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
                  jackpotLogo: "PROGRESSIVE_JACKPOT",
                  customLogo: {
                    name: "Custom Logo",
                    image: {
                      dimensions: {
                        width: 120,
                        height: 120,
                      },
                      alt: null,
                      url: "https://images.prismic.io/betfair-com-dev/3f0d4d2d-86a2-4e0f-b259-844ce178f153_drops_and_wins.png?auto=compress,format&rect=0,0,120,120&w=120&h=120",
                    },
                  },
                  feedData: {
                    jackpot: 1536128.23,
                  },
                  label: "JACKPOT",
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
                  jackpotLogo: "JACKPOT_KING",
                  label: "JACKPOT",
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
                  label: "JACKPOT",
                  feedData: {
                    jackpot: 1000.23,
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

const BFF_ONE_RECENTLY_PLAYED_GAME_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:group:recentlyPlayedGames:recentlyPlayedGamesZoneCode/recently_played",
        __typename: "GamingCardGroup",
        cardGroupTitle: "Recently Played",
        defaultLayout: "GRID_FOUR_COLUMNS",
        layouts: "GRID_FOUR_COLUMNS",
        full: {
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
                  jackpotLogo: "PROGRESSIVE_JACKPOT",
                  customLogo: {
                    name: "Custom Logo",
                    image: {
                      dimensions: {
                        width: 120,
                        height: 120,
                      },
                      alt: null,
                      url: "https://images.prismic.io/betfair-com-dev/3f0d4d2d-86a2-4e0f-b259-844ce178f153_drops_and_wins.png?auto=compress,format&rect=0,0,120,120&w=120&h=120",
                    },
                  },
                  feedData: {
                    jackpot: 1536128.23,
                  },
                  label: "JACKPOT",
                },
              },
            },
          ],
        },
        partials: {
          edges: [{ node: { urn: "ppb:tbd:card:game:game-0", __typename: "GameCard" } }],
        },
      },
    },
  ],
};

describe("When user lands on gaming view", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_ONE_RECENTLY_PLAYED_GAME_MOCK.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_ONE_RECENTLY_PLAYED_GAME_MOCK));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilEquals(gamingPagePO.title, "Recently Played");
  });

  it("[PRPI-5818] Then the gaming page container should be displayed", async () => {
    expect(await gamingPagePO.gamingPageContainer.isDisplayed()).toBe(true);
  });

  it("[PRPI-5885] And the games grid with recently played games should be displayed", async () => {
    expect(await gamingPagePO.gamesGrid.isDisplayed()).toBe(true);
  });

  it("[PRPI-5886] And the title of the grid should be: Recently Played", async () => {
    expect(await gamingPagePO.title.getText()).toBe("Recently Played");
  });

  it("[PRPI-5887] And there should be one game round tile displayed", async () => {
    expect(await gamingPagePO.gameTiles.length).toBe(1);
  });

  it("[PRPI-5888] And it should not contain favourite button", async () => {
    expect(await firstGameTile.getFavouriteButton.isDisplayed()).toBe(false);
  });

  describe("Then user has 4 recently played games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*drops.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_FOUR_RECENTLY_PLAYED_GAMES_MOCK));
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_FOUR_RECENTLY_PLAYED_GAMES_MOCK.urn, {
          USER_FAVOURITE_GAMES: { isActive: true },
        }),
      );
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilDisplayed(secondGameTile.jackpotLogo);
      await browser.waitUntilDisplayed(firstGameTile.customLogoImage);
      await browser.waitUntilEquals(firstGameTile.gameTitle, "First Game Tile");
    });

    it("[PRPI-5889] And there should be 4 game round tiles displayed", async () => {
      expect(await gamingPagePO.gameTiles.length).toBe(4);
    });

    it("[PRPI-5890] And the game tile should have round style applied", async () => {
      expect(await browser.containsClass(firstGameTile.element, GameTilePO.states.round)).toBe(true);
    });

    it("[PRPI-5891] And the first game tile should have the title: First Game Tile ", async () => {
      expect(await firstGameTile.gameTitle.getText()).toBe("First Game Tile");
    });

    it("[PRPI-5892] And it should not contain favourite button", async () => {
      expect(await firstGameTile.getFavouriteButton.isDisplayed()).toBe(false);
    });

    it("[PRPI-5893] And the first game tile should not have jackpot logo displayed if the customLogoImage is displayed", async () => {
      expect(await firstGameTile.jackpotLogo.isDisplayed()).toBe(false);
    });

    it("[PRPI-5894] And the first game tile should have customLogoImage displayed", async () => {
      expect(await firstGameTile.customLogoImage.isDisplayed()).toBe(true);
    });

    it("[PRPI-5895] And the second game tile should have jackpot badge displayed", async () => {
      expect(await secondGameTile.gameJackpotContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-8373] And second game should not contain favourite button", async () => {
      expect(await secondGameTile.getFavouriteButton.isDisplayed()).toBe(false);
    });

    it("[PRPI-5896] And the second game tile should have the title: Second Game Tile ", async () => {
      expect(await secondGameTile.gameTitle.getText()).toBe("Second Game Tile");
    });

    it("[PRPI-5897] And the second game tile should have jackpot logo displayed", async () => {
      expect(await secondGameTile.jackpotLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-5898] And the second game tile should not have customLogoImage displayed", async () => {
      expect(await secondGameTile.customLogoImage.isDisplayed()).toBe(false);
    });

    it("[PRPI-5899] And the second game tile should display the jackpot badge with label: JACKPOT", async () => {
      expect(await secondGameTile.gameJackpotContainer.getText()).toBe("JACKPOT");
    });

    it("[PRPI-5900] And the third game tile should have the title: Third Game Tile ", async () => {
      expect(await thirdGameTile.gameTitle.getText()).toBe("Third Game Tile");
    });

    it("[PRPI-8374] And third game should not contain favourite button", async () => {
      expect(await thirdGameTile.getFavouriteButton.isDisplayed()).toBe(false);
    });

    it("[PRPI-5901] And the third game tile should not have jackpot logo displayed", async () => {
      expect(await thirdGameTile.jackpotLogo.isDisplayed()).toBe(false);
    });

    it("[PRPI-5902] And the third game tile should have not customLogoImage displayed", async () => {
      expect(await thirdGameTile.customLogoImage.isDisplayed()).toBe(false);
    });

    it("[PRPI-5903] And the third game tile should display the jackpot badge", async () => {
      expect(await thirdGameTile.gameJackpotContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-5904] And the fourth game tile should have the title: Fourth Game Tile ", async () => {
      expect(await fourthGameTile.gameTitle.getText()).toBe("Fourth Game Tile");
    });

    it("[PRPI-8375] And fourth game should not contain favourite button", async () => {
      expect(await fourthGameTile.getFavouriteButton.isDisplayed()).toBe(false);
    });

    it("[PRPI-5905] And the fourth game tile should not have jackpot logo displayed", async () => {
      expect(await fourthGameTile.jackpotLogo.isDisplayed()).toBe(false);
    });

    it("[PRPI-5906] And the fourth game tile should not have customLogoImage displayed", async () => {
      expect(await fourthGameTile.customLogoImage.isDisplayed()).toBe(false);
    });

    it("[PRPI-5907] And the fourth game tile should not display the jackpot badge", async () => {
      expect(await fourthGameTile.gameJackpotContainer.isDisplayed()).toBe(false);
    });
  });
});
