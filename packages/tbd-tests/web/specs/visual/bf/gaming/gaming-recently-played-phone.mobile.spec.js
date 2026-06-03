const { GamingPagePO, GameTilePO, ScrollableSwimlanePO } = require("../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const gamingPagePO = new GamingPagePO();
const scrollableSwimlane = new ScrollableSwimlanePO();
const firstGameTile = new GameTilePO(gamingPagePO.gameTiles[0]);
const secondGameTile = new GameTilePO(gamingPagePO.gameTiles[1]);

const mockService = new MockService();
const MODULE_NAME = "game_round_tiles";

const BFF_FIVE_RECENTLY_PLAYED_GAMES_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:group:recentlyPlayedGames:recentlyPlayedGamesZoneCode/recently_played",
        __typename: "GamingCardGroup",
        cardGroupTitle: "Recently Played",
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST"],
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
                  jackpotLogo: "JACKPOT_KING",
                  customLogo: {
                    name: "Custom Logo",
                    image: {
                      dimensions: {
                        width: 120,
                        height: 120,
                      },
                      alt: null,
                      url: "http://example.test.com/mockedImage/image.png",
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
                provider: {},
                __typename: "GameCard",
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
                provider: {},
                __typename: "GameCard",
                game: {
                  name: "Fourth Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-3",
                  backgroundColor: "#B22222",
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-4",
                provider: {},
                __typename: "GameCard",
                game: {
                  name: "Fifth Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-4",
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
            { node: { urn: "ppb:tbd:card:game:game-4", __typename: "GameCard" } },
          ],
        },
        type: "RECENTLY_PLAYED",
      },
    },
  ],
};

describe("When user lands on gaming view with a recently played module", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_FIVE_RECENTLY_PLAYED_GAMES_MOCK.urn, { disableCSSAnimations: true, pause: true }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_FIVE_RECENTLY_PLAYED_GAMES_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.flushFakeClockTimers();
    await browser.waitUntilEquals(scrollableSwimlane.title, "Recently Played");
    await browser.waitUntilDisplayed(firstGameTile.customLogoImage);
    await browser.waitUntilDisplayed(secondGameTile.jackpotLogo);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1344]_should_display_four_game_tiles_in_recently_played_module`,
    );
  });

  it("[PRPI-1344]_should_display_four_game_tiles_in_recently_played_module", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1344]_should_display_four_game_tiles_in_recently_played_module`),
    ).toEqual(0);
  });
});
