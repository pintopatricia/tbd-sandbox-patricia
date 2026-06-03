const { ScrollableSwimlanePO, GameTilePO } = require("../../../../page-objects");

const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const scrollableSwimlanePO = new ScrollableSwimlanePO();
const fourthGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[3]);

const mockService = new MockService();
const MODULE_NAME = "gaming_play_new_swimlane";

const BFF_PLAY_NEW_SWIMLANE_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:masterConfigElement:curated/1",
        cardGroupTitle: "New Games",
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST"],
        decoration: "BF Gaming black",
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
                provider: {},
                game: {
                  name: "Game 3",
                  __typename: "Game",
                  urn: "ppb:game:game-3",
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
            {
              node: {
                urn: "ppb:tbd:card:game:game-3",
                __typename: "GameCard",
              },
            },
          ],
        },
      },
    },
  ],
};

describe("When user lands on gaming view with a play new swimlane", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_PLAY_NEW_SWIMLANE_MOCK.urn, {
        disableCSSAnimations: true,
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PLAY_NEW_SWIMLANE_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1333]_should_display_the_play_new_swimlane_with_first_and_second_game_tile`,
    );
  });

  it("[PRPI-1333]_should_display_the_play_new_swimlane_with_first_and_second_game_tile", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}_[PRPI-1333]_should_display_the_play_new_swimlane_with_first_and_second_game_tile`,
      ),
    ).toEqual(0);
  });

  describe("Then the user scrolls until the fourth game", () => {
    beforeAll(async () => {
      await fourthGameTile.element.scrollIntoView();
      await browser.waitUntilDisplayed(fourthGameTile.element);
    });
    it("[PRPI-1334]_should_display_the_third_and_the_fourth_game_tile", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1334]_should_display_the_third_and_the_fourth_game_tile`),
      ).toEqual(0);
    });
  });
});
