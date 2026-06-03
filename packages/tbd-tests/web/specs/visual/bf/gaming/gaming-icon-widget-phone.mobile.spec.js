const { GamingCardGroupPO, LinkPO, GameCardPO } = require("../../../../page-objects");
const GamesCardGroupPO = require("@ppb/tbd-shared/components/GamesCardGroup/GamesCardGroup.po");

const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const gamingCardGroupPO = new GamingCardGroupPO();
const gameCardPO = new GameCardPO(gamingCardGroupPO.gameTileWidgetPositioning);
const gameLinkPO = new LinkPO(gameCardPO.link);
const gamesCardGroupPO = new GamesCardGroupPO();

const mockService = new MockService();
const MODULE_NAME = "gaming_icon_widget";

const BFF_ICON_WIDGET_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:masterConfigElement:curated/1",
        decoration: "BF Gaming iconwidget",
        cardGroupTitle: "Icon Widget Games",
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
          ],
        },
      },
    },
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/7",
        cardGroupTitle: "Popular Games",
        displayName: null,
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        type: "DEFAULT",
        full: {
          edges: [
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/sweet-bonanza-apr",
                game: {
                  urn: "ppb:gaming:game:uid/sweet-bonanza-apr",
                  uid: "sweet-bonanza-apr",
                  __typename: "Game",
                  name: "Sweet Bonanza",
                  launchId: "sweet-bonanza-apr",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/lava-lock-jpk-abp",
                game: {
                  urn: "ppb:gaming:game:uid/lava-lock-jpk-abp",
                  uid: "lava-lock-jpk-abp",
                  __typename: "Game",
                  name: "Lava Lock JPK",
                  launchId: "lava-lock-jpk-abp",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/ff-the-big-catch-abp",
                game: {
                  urn: "ppb:gaming:game:uid/ff-the-big-catch-abp",
                  uid: "ff-the-big-catch-abp",
                  __typename: "Game",
                  name: "The Big Catch",
                  launchId: "ff-the-big-catch-abp",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/epic-ape-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/epic-ape-cptn",
                  uid: "epic-ape-cptn",
                  __typename: "Game",
                  name: "Epic Ape",
                  launchId: "epic-ape-cptn",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/bonanza-anx",
                game: {
                  urn: "ppb:gaming:game:uid/bonanza-anx",
                  uid: "bonanza-anx",
                  __typename: "Game",
                  name: "Bonanza",
                  launchId: "bonanza-anx",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/starburst-evolution-cev",
                game: {
                  urn: "ppb:gaming:game:uid/starburst-evolution-cev",
                  uid: "starburst-evolution-cev",
                  __typename: "Game",
                  name: "Starburst",
                  launchId: "starburst-evolution-cev",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/wild-hot-chilli-art",
                game: {
                  urn: "ppb:gaming:game:uid/wild-hot-chilli-art",
                  uid: "wild-hot-chilli-art",
                  __typename: "Game",
                  name: "Wild Hot Chilli",
                  launchId: "wild-hot-chilli-art",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/fireblaze-red-wizard-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/fireblaze-red-wizard-cptn",
                  uid: "fireblaze-red-wizard-cptn",
                  __typename: "Game",
                  name: "Fireblaze Red Wizard",
                  launchId: "fireblaze-red-wizard-cptn",
                  mainProduct: "gaming",
                },
              },
              __typename: "GamingCardGroupItemEdge",
            },
          ],

          __typename: "GamingCardGroupItemsConnection",
        },
        partials: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/sweet-bonanza-apr",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/lava-lock-jpk-abp",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/ff-the-big-catch-abp",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/epic-ape-cptn",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/bonanza-anx",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/starburst-evolution-cev",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/wild-hot-chilli-art",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:gaming:game:uid/fireblaze-red-wizard-cptn",
                __typename: "GameCard",
              },
              __typename: "GamingCardGroupItemEdge",
            },
          ],

          __typename: "GamingCardGroupItemsConnection",
        },
        gameTileSize: "MEDIUM",
      },
    },
  ],
};

describe("When user lands on gaming view with floating icon widget", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_ICON_WIDGET_MOCK.urn, {
        disableCSSAnimations: true,
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_ICON_WIDGET_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(gameCardPO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-8708]_should_display_floating_icon_widget_on_bottom_right`,
    );
  });

  it("[PRPI-8708][_should_display_floating_icon_widget_on_bottom_right", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-8708]_should_display_floating_icon_widget_on_bottom_right`),
    ).toEqual(0);
  });

  it("[PRPI-8709]_should_verify_floating_widget_exists", async () => {
    expect(await gameCardPO.element.isExisting()).toBe(true);
    expect(await gameCardPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-8710]_should_verify_link", async () => {
    expect(await gameLinkPO.element.getAttribute("href")).toContain("gameId");
  });

  describe("When the user scrolls down the page", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(gamesCardGroupPO.element);
      const element = gamesCardGroupPO.gameContainers[7];
      await element.scrollIntoView();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-8711]_should_keep_widget_fixed_after_scroll`);
    });

    it("[PRPI-8711]_should_keep_widget_fixed_after_scroll", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-8711]_should_keep_widget_fixed_after_scroll`)).toEqual(0);
    });

    it("[PRPI-8712]_should_verify_widget_remains_visible_after_scroll", async () => {
      expect(await gameCardPO.element.isExisting()).toBe(true);
      expect(await gameCardPO.element.isDisplayed()).toBe(true);
    });
  });
});
