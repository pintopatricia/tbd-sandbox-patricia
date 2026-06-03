const { getGamingCategoryLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const LIVE_TABLE_CATEGORY = "live-table";
const MODULE_NAME = "games_category_view";

const BFF_GAMING_CATEGORY_VIEW_MOCK = {
  __typename: "GamingCategoryView",
  urn: `ppb:tbd:view:gamingCategory:${LIVE_TABLE_CATEGORY}`,
  url: `/casino/c/live-table/gamingCategory:${LIVE_TABLE_CATEGORY}`,
  provider: {},
  edges: [
    {
      node: {
        urn: `ppb:tbd:card:group:gamesByCategory:${LIVE_TABLE_CATEGORY}`,
        __typename: "GamingCardGroup",
        cardGroupTitle: "Games by Category",
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:game:game-0",
                __typename: "GameCard",
                game: {
                  name: "First Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-0",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-1",
                __typename: "GameCard",
                game: {
                  name: "Second Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-1",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                  feedData: {
                    lastNumbers: [
                      { color: "RED", number: "14" },
                      { color: "GREEN", number: "0" },
                      { color: "BLACK", number: "13" },
                      { color: "BLACK", number: "23" },
                      { color: "RED", number: "3" },
                      { color: "BLACK", number: "11" },
                      { color: "BLACK", number: "10" },
                      { color: "BLACK", number: "8" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
                game: {
                  name: "Third Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-2",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-3",
                __typename: "GameCard",
                game: {
                  name: "Fourth Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-3",
                  feedData: {
                    availableSeats: "8",
                  },
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
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

  partialEdges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: `ppb:tbd:card:group:gamesByCategory:${LIVE_TABLE_CATEGORY}`,
      },
    },
  ],

  navigationItem: {
    title: "Live Table",
    __typename: "NavigationItem",
  },
};

const BFF_3_GAMES_CATEGORY_VIEW_MOCK = {
  __typename: "GamingCategoryView",
  urn: `ppb:tbd:view:gamingCategory:${LIVE_TABLE_CATEGORY}`,
  url: `/casino/c/live-table/gamingCategory:${LIVE_TABLE_CATEGORY}`,
  edges: [
    {
      node: {
        urn: `ppb:tbd:card:group:gamesByCategory:${LIVE_TABLE_CATEGORY}`,
        __typename: "GamingCardGroup",
        cardGroupTitle: "Games by Category",
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:game:game-0",
                __typename: "GameCard",
                game: {
                  name: "First Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-0",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                  copyrightText: "Game Tile Copyright Text",
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-1",
                __typename: "GameCard",
                game: {
                  name: "Second Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-1",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                  copyrightText: "Game Tile Copyright Text",
                  feedData: {
                    lastNumbers: [
                      { color: "RED", number: "14" },
                      { color: "GREEN", number: "0" },
                      { color: "BLACK", number: "13" },
                      { color: "BLACK", number: "23" },
                      { color: "RED", number: "3" },
                      { color: "BLACK", number: "11" },
                      { color: "BLACK", number: "10" },
                      { color: "BLACK", number: "8" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
                game: {
                  name: "Third Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-2",
                  flattened: {
                    small: {
                      url: "http://example.test.com/mockedImage/image.png",
                    },
                  },
                  copyrightText: "Game Tile Copyright Text",
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
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: `ppb:tbd:card:group:gamesByCategory:${LIVE_TABLE_CATEGORY}`,
      },
    },
  ],

  navigationItem: {
    title: "Live Table",
    __typename: "NavigationItem",
  },
};

describe("When user lands on live table gaming category page view with an even number of games", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_GAMING_CATEGORY_VIEW_MOCK.urn, {
        disableCSSAnimations: true,
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getGamingCategoryLayout(BFF_GAMING_CATEGORY_VIEW_MOCK));
    await browser.url(routes.getGamingCategoryViewUrl(LIVE_TABLE_CATEGORY));
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1320]_should_display_four_game_containers_with_two_games_layout`,
    );
  });

  it("[PRPI-1320]_should_display_four_game_containers_with_two_games_layout", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1320]_should_display_four_game_containers_with_two_games_layout`),
    ).toEqual(0);
  });

  describe("When user lands on live table gaming category page view with an odd number of games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_3_GAMES_CATEGORY_VIEW_MOCK.urn, {
          disableCSSAnimations: true,
          USER_FAVOURITE_GAMES: { isActive: true },
        }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingCategoryLayout(BFF_3_GAMES_CATEGORY_VIEW_MOCK));
      await browser.url(routes.getGamingCategoryViewUrl(LIVE_TABLE_CATEGORY));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1321]_should_display_three_game_containers_with_three_games_layout`,
      );
    });

    it("[PRPI-1321]_should_display_three_game_containers_with_three_games_layout", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1321]_should_display_three_game_containers_with_three_games_layout`,
        ),
      ).toEqual(0);
    });
  });
});
