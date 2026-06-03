const { ScrollableSwimlanePO, GameTilePO } = require("../../../../page-objects");

const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const scrollableSwimlanePO = new ScrollableSwimlanePO();
const firstGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[0]);
const firstSmallGameTile = new GameTilePO(scrollableSwimlanePO.smallGameTiles[0]);
const mockService = new MockService();

const MODULE_NAME = "reduce_tiles_swimlane";

const BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:card:group:recommendedGames:recommendedGamesZoneCode",
        cardGroupTitle: "Recommended Games Swimlane",
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST"],
        viewAll: {
          label: "See All",
          viewLink: {
            viewUrl: routes.getGamingCategoryViewUrl("randomCategory"),
            viewUrn: "ppb:tbd:view:gamingCategory:randomCategory",
          },
        },
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:game:game-0",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Game 0",
                  __typename: "Game",
                  urn: "ppb:game:game-0",
                  backgroundColor: "#B22222",
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
                provider: {},
                game: {
                  name: "Game 1",
                  __typename: "Game",
                  urn: "ppb:game:game-1",
                  backgroundColor: "#2268b2",
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
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Game 2",
                  __typename: "Game",
                  urn: "ppb:game:game-2",
                  backgroundColor: "#3ab222",
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
            {
              node: {
                urn: "ppb:tbd:card:game:game-0",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-1",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
              },
            },
          ],
        },
      },
      theme: "GAMING_SMALL_TILES",
    },
  ],
};

describe("Reduced Tiles Swimlane - Gaming Small Tiles Theme", () => {
  let smallTileSize;
  let normalTileSize;

  describe("when user lands on gaming view with small tiles theme", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK.urn, { disableCSSAnimations: true }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGamingLayout(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
      await browser.waitUntilDisplayed(firstSmallGameTile.element);

      smallTileSize = await firstSmallGameTile.element.getSize();
    });

    it("[PRPI-8715]_should_capture_small_tile_size", async () => {
      expect(smallTileSize).toBeDefined();
      expect(smallTileSize.width).toBeGreaterThan(0);
    });

    it("[PRPI-8716]_should_render_small_tile_sized_card", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-8716]_should_render_small_tile_sized_card`)).toEqual(0);
    });

    describe("Then the user reloads the view without the reduced tile size", () => {
      beforeAll(async () => {
        BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK.edges[0].theme = null;
        await mockService.mockHttpRequest(
          await getIndexHTML(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK.urn, { disableCSSAnimations: true }),
        );
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(getGamingLayout(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK));
        await browser.url(`${routes.getGamingViewUrl("1")}`);
        await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
        await browser.waitUntilDisplayed(firstGameTile.element);

        normalTileSize = await firstGameTile.element.getSize();
      });

      it("[PRPI-8717]_should_compare_normal_tile_is_larger_than_small_tile", async () => {
        expect(normalTileSize).toBeDefined();
        expect(normalTileSize.width).toBeGreaterThan(smallTileSize.width);
        expect(normalTileSize.height).toBeGreaterThan(smallTileSize.height);
      });
    });
  });
});
