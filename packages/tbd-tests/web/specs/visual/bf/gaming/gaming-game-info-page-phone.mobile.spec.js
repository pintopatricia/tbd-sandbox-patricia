const { getGameLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { GameInfoPO, GameInfoCarouselPO, RichTextPO } = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const gameInfoPO = new GameInfoPO();
const gameInfoCarouselPO = new GameInfoCarouselPO();
const richTextPO = new RichTextPO();
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const MODULE_NAME = "game_info_page_";

const GAME_INFO_MOCK = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:bonanza-anx",
  url: "casino/game/bonanza-anx/g-bonanza-anx",
  edges: [
    {
      node: {
        game: {
          __typename: "Game",
          urn: "ppb:game:bonanza-anx",
          name: "Bonanza",
          provider: {},
          gameType: "Megaways",
          gameVolatility: "High",
          gameTheme: "Classic Slots",
          jackpotType: "Jackpot King",
          gameStudio: "Big Time Gaming",
          minStake: "0.1",
          maxStake: "10",
          gameHelp: "https://help.example.com",
          gameMechanics: ["Free Spins", "Jackpot"],
          description: {
            content: [
              {
                spans: [
                  {
                    start: 0,
                    end: 10,
                    style: "hyperlink",
                    url: "mockedLink",
                  },
                ],

                type: "paragraph",
                text: "Game info:",
              },
              {
                spans: [
                  {
                    start: 0,
                    end: 10,
                    style: "strong",
                  },
                ],

                type: "list-item",
                text: "Bonus round",
              },
            ],

            headline: "How to play",
          },
          rtp: "95.15%",
          customBackgroundColor: "#744943",
          label: "JACKPOT",
          flattened: {
            small: {
              url: "http://example.test.com/mockedImage/image.png",
            },
          },
          feedData: {
            jackpot: 101158.62,
          },
          screenshots: [
            {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 770,
                height: 578,
                __typename: "Dimension",
              },
              __typename: "GameImage",
            },
            {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 770,
                height: 578,
                __typename: "Dimension",
              },
              __typename: "GameImage",
            },
          ],
        },
        urn: "ppb:tbd:card:game:bonanza-anx",
        __typename: "GameInfoCard",
      },
    },
  ],

  navigationItem: {
    title: "Bonanza",
    __typename: "NavigationItem",
  },
};

const BFF_GAME_INFO_MOCK_NO_METADATA_INFO = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:bonanza-anx",
  url: "casino/game/bonanza-anx/g-bonanza-anx",
  edges: [
    {
      node: {
        game: {
          __typename: "Game",
          urn: "ppb:game:bonanza-anx",
          name: "Bonanza",
          provider: {},
          gameType: null,
          gameVolatility: null,
          gameTheme: null,
          jackpotType: null,
          gameStudio: null,
          minStake: null,
          maxStake: null,
          gameHelp: null,
          gameMechanics: null,
          description: {
            content: [
              {
                spans: [
                  {
                    start: 0,
                    end: 10,
                    style: "hyperlink",
                    url: "mockedLink",
                  },
                ],

                type: "paragraph",
                text: "Game info:",
              },
              {
                spans: [
                  {
                    start: 0,
                    end: 10,
                    style: "strong",
                  },
                ],

                type: "list-item",
                text: "Bonus round",
              },
            ],

            headline: "How to play",
          },
          rtp: null,
          customBackgroundColor: "#744943",
          label: "JACKPOT",
          flattened: {
            small: {
              url: "http://example.test.com/mockedImage/image.png",
            },
          },
          feedData: {
            jackpot: 101158.62,
          },
          screenshots: [
            {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 770,
                height: 578,
                __typename: "Dimension",
              },
              __typename: "GameImage",
            },
            {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 770,
                height: 578,
                __typename: "Dimension",
              },
              __typename: "GameImage",
            },
          ],
        },
        urn: "ppb:tbd:card:game:bonanza-anx",
        __typename: "GameInfoCard",
      },
    },
  ],

  navigationItem: {
    title: "Bonanza",
    __typename: "NavigationItem",
  },
};

const DEMO_BUTTON = {
  ...GAME_INFO_MOCK,
  edges: [
    {
      ...GAME_INFO_MOCK.edges[0],
      node: {
        ...GAME_INFO_MOCK.edges[0].node,
        game: {
          ...GAME_INFO_MOCK.edges[0].node.game,
          hasDemo: true, // Add the hasDemo field
        },
      },
    },
  ],

  partialEdges: [{ node: { urn: "ppb:tbd:card:game:game-1", __typename: "GameInfoCard" } }],
};

describe("When Game Info page for a game is opened", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(GAME_INFO_MOCK.urn, { USER_FAVOURITE_GAMES: { isActive: true } }),
    );
    await mockService.mockHttpRequest(getGameLayout(GAME_INFO_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(`${routes.getGameViewUrl("bonanza-anx")}`);
    await browser.tickFakeClock(30000);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(gameInfoCarouselPO.carouselSlider);
    await browser.waitUntilDisplayed(gameInfoPO.title);
    await browser.waitUntilDisplayed(gameInfoPO.keyInfoPillsSection);
    await browser.waitUntilDisplayed(gameInfoPO.table);
    await browser.waitUntilDisplayed(gameInfoPO.howToPlayHeadline);
    await browser.waitUntilEquals(await richTextPO.getParagrphsList[0], "Game info:");
    await browser.waitUntilEquals(await richTextPO.getItemsList[0], "Bonus round");
    await browser.waitUntilDisplayed(gameInfoPO.playNowButton);
    await browser.waitUntilDisplayed(gameInfoPO.launchGame);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1322]_should_display_jackpot_game_info_page`);
  });

  it("[PRPI-1322]_should_display_jackpot_game_info_page", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1322]_should_display_jackpot_game_info_page`)).toEqual(0);
  });
});

describe("When Game Info page for a game that does not contain metadata info is opened", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_GAME_INFO_MOCK_NO_METADATA_INFO.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getGameLayout(BFF_GAME_INFO_MOCK_NO_METADATA_INFO));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(`${routes.getGameViewUrl("bonanza-anx")}`);
    await browser.tickFakeClock(30000);
    await browser.flushFakeClockTimers();
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1323]_should_display_game_info_page_no_metadata`);
  });

  it("[PRPI-1323]_should_display_game_info_page_no_metadata", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1323]_should_display_game_info_page_no_metadata`)).toEqual(
      0,
    );
  });
});

describe("When Game Info page for a game is opened", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getIndexHTML(DEMO_BUTTON.urn, { USER_FAVOURITE_GAMES: { isActive: true } }, { jurisdiction: "ITALY" }),
    );
    await mockService.mockHttpRequest(getGameLayout(DEMO_BUTTON));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(`${routes.getGameViewUrl("bonanza-anx")}`);
    await browser.tickFakeClock(30000);
    await browser.flushFakeClockTimers();
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1324]_should_display_the_game_info_page_with_demo_button`);
  });

  it("[PRPI-1324]_should_display_the_game_info_page_with_demo_button", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1324]_should_display_the_game_info_page_with_demo_button`),
    ).toEqual(0);
  });
});
