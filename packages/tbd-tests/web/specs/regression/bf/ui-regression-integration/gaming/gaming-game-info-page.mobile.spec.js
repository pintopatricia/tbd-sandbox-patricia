const { getGameLayout, getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const {
  GameInfoPO,
  QuickViewGameInfoPO,
  GameInfoCarouselPO,
  RichTextPO,
  GamingPagePO,
  GameTilePO,
} = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const gamingPagePO = new GamingPagePO();
const firstGameTilePO = new GameTilePO(gamingPagePO.gameTiles[0]);
const secondGameTilePO = new GameTilePO(gamingPagePO.gameTiles[1]);
const gameInfoPO = new GameInfoPO();
const quickViewGameInfoPO = new QuickViewGameInfoPO();
const gameInfoCarouselPO = new GameInfoCarouselPO();
const richTextPO = new RichTextPO();

const mockService = new MockService();

const flattened = {
  small: {
    url: "http://example.test.com/mockedImage/image.png",
    width: 250,
  },
  medium: {
    url: "http://example.test.com/mockedImage/image.png",
    width: 450,
  },
  large: {
    url: "http://example.test.com/mockedImage/image.png",
    width: 900,
  },
};
const BFF_GAME_CARD_HOMEPAGE_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:group:curatedGames:curatedGamesZoneCode",
        __typename: "GamingCardGroup",
        cardGroupTitle: "Curated Games Grid",
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        viewAll: {
          label: "Random Category",
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
                  name: "First Game Tile",
                  __typename: "Game",
                  urn: "ppb:game:game-0",
                  backgroundColor: "#B22222",
                  copyrightText: "Game Tile Copyright Text",
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
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            { node: { urn: "ppb:tbd:card:game:game-0", __typename: "GameCard" } },
            { node: { urn: "ppb:tbd:card:game:game-1", __typename: "GameCard" } },
          ],
        },
      },
    },
  ],
};

const BFF_GAME_INFO_MOCK = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:game-1",
  url: "casino/game/game-1/game:game-1",
  provider: {},
  edges: [
    {
      node: {
        game: {
          __typename: "Game",
          urn: "ppb:game:game-1",
          name: "Bonanza",
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
                span: [
                  {
                    start: 0,
                    end: 10,
                    style: "strong",
                  },
                ],

                type: "paragraph",
                text: "Game info:",
              },
              {
                span: [
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
          flattened,
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
        urn: "ppb:tbd:card:game:game-1",
        __typename: "GameInfoCard",
      },
    },
  ],

  partialEdges: [{ node: { urn: "ppb:tbd:card:game:game-1", __typename: "GameInfoCard" } }],
};

const BFF_GAME_INFO_MOCK_NO_METADATA_INFO = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:game-1",
  url: "casino/game/game-1/game:game-1",
  provider: {},
  edges: [
    {
      node: {
        game: {
          __typename: "Game",
          urn: "ppb:game:game-1",
          name: "Bonanza",
          gameType: null,
          gameVolatility: null,
          gameTheme: null,
          jackpotType: null,
          gameStudio: null,
          minStake: null,
          maxStake: null,
          gameHelp: null,
          gameMechanics: [],
          description: {
            content: [
              {
                span: [
                  {
                    start: 0,
                    end: 10,
                    style: "strong",
                  },
                ],

                type: "paragraph",
                text: "Game info:",
              },
              {
                span: [
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
          flattened,
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
        urn: "ppb:tbd:card:game:game-1",
        __typename: "GameInfoCard",
      },
    },
  ],

  partialEdges: [{ node: { urn: "ppb:tbd:card:game:game-1", __typename: "GameInfoCard" } }],
};

const DEMO_BUTTON = {
  ...BFF_GAME_INFO_MOCK,
  edges: [
    {
      ...BFF_GAME_INFO_MOCK.edges[0],
      node: {
        ...BFF_GAME_INFO_MOCK.edges[0].node,
        game: {
          ...BFF_GAME_INFO_MOCK.edges[0].node.game,
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
      await getIndexHTML(BFF_GAME_INFO_MOCK.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
        pause: true,
      }),
    );
    await mockService.mockHttpRequest(getGameLayout(BFF_GAME_INFO_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGameViewUrl("game-1")}`);
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
  });

  it("[PRPI-6515] And the carousel is displayed", async () => {
    expect(await gameInfoCarouselPO.carouselSlider.isDisplayed()).toBe(true);
  });

  it("[PRPI-8467] And the carousel displays 3 items", async () => {
    expect(await gameInfoCarouselPO.carouselItems.length).toBe(3);
  });

  it("[PRPI-6516] And the title is displayed", async () => {
    expect(await gameInfoPO.title.isDisplayed()).toBe(true);
  });

  it("[PRPI-6517] And the key info pills section is displayed", async () => {
    expect(await gameInfoPO.keyInfoPillsSection.isDisplayed()).toBe(true);
  });

  it("[PRPI-6518] And the rtp pill is displayed", async () => {
    expect(await gameInfoPO.keyInfoPills[0].isDisplayed()).toBe(true);
  });

  it("[PRPI-6519] And the rtp pill should be", async () => {
    expect(await gameInfoPO.keyInfoPills[0].getText()).toBe("RTP 95.15%");
  });

  it("[PRPI-6520] And the game type pill is displayed", async () => {
    expect(await gameInfoPO.keyInfoPills[1].isDisplayed()).toBe(true);
  });

  it("[PRPI-6521] And the game type pill should be", async () => {
    expect(await gameInfoPO.keyInfoPills[1].getText()).toBe(BFF_GAME_INFO_MOCK.edges[0].node.game.gameType);
  });

  it("[PRPI-6522] And the game volatility pill is displayed", async () => {
    expect(await gameInfoPO.keyInfoPills[2].isDisplayed()).toBe(true);
  });

  it("[PRPI-6523] And the game volatility pill should be", async () => {
    expect(await gameInfoPO.keyInfoPills[2].getText()).toBe("High Volatility");
  });

  it("[PRPI-6524] And the game table is displayed", async () => {
    expect(await gameInfoPO.table.isDisplayed()).toBe(true);
  });

  it("[PRPI-6525] And the game theme is displayed", async () => {
    expect(await gameInfoPO.tableContent[0].isDisplayed()).toBe(true);
  });

  it("[PRPI-6526] And the game theme should be", async () => {
    expect(await gameInfoPO.tableContent[0].getText()).toBe(BFF_GAME_INFO_MOCK.edges[0].node.game.gameTheme);
  });

  it("[PRPI-6527] And the game studio is displayed", async () => {
    expect(await gameInfoPO.tableContent[1].isDisplayed()).toBe(true);
  });

  it("[PRPI-6528] And the game studio should be", async () => {
    expect(await gameInfoPO.tableContent[1].getText()).toBe(BFF_GAME_INFO_MOCK.edges[0].node.game.gameStudio);
  });

  it("[PRPI-6529] And the jackpot type is displayed", async () => {
    expect(await gameInfoPO.tableContent[2].isDisplayed()).toBe(true);
  });

  it("[PRPI-6530] And the jackpot type should be", async () => {
    expect(await gameInfoPO.tableContent[2].getText()).toBe(BFF_GAME_INFO_MOCK.edges[0].node.game.jackpotType);
  });

  it("[PRPI-6531] And the min stake is displayed", async () => {
    expect(await gameInfoPO.tableContent[3].isDisplayed()).toBe(true);
  });

  it("[PRPI-6532] And the min stake should be", async () => {
    expect(await gameInfoPO.tableContent[3].getText()).toBe(`$${BFF_GAME_INFO_MOCK.edges[0].node.game.minStake}`);
  });

  it("[PRPI-6533] And the max stake is displayed", async () => {
    expect(await gameInfoPO.tableContent[4].isDisplayed()).toBe(true);
  });

  it("[PRPI-6534] And the max stake should be", async () => {
    expect(await gameInfoPO.tableContent[4].getText()).toBe(`$${BFF_GAME_INFO_MOCK.edges[0].node.game.maxStake}`);
  });

  it("[PRPI-6535] And the game mechanic is displayed", async () => {
    expect(await gameInfoPO.tableContent[5].isDisplayed()).toBe(true);
  });

  it("[PRPI-6536] And the game mechanic should be", async () => {
    expect(await gameInfoPO.tableContent[5].getText()).toBe(
      `${BFF_GAME_INFO_MOCK.edges[0].node.game.gameMechanics[0]}, ${BFF_GAME_INFO_MOCK.edges[0].node.game.gameMechanics[1]}`,
    );
  });

  it("[PRPI-6537] And the game help is displayed", async () => {
    expect(await gameInfoPO.gameHelp.isDisplayed()).toBe(true);
  });

  it("[PRPI-6538] And the game help should be", async () => {
    expect(await gameInfoPO.gameHelp.getAttribute("href")).toBe(BFF_GAME_INFO_MOCK.edges[0].node.game.gameHelp);
  });

  it("[PRPI-6539] And the game help is clickable", async () => {
    expect(await gameInfoPO.gameHelp.isClickable()).toBe(true);
  });

  it("[PRPI-6540] And How to play headline container is displayed", async () => {
    expect(await gameInfoPO.howToPlayHeadline.isDisplayed()).toBe(true);
  });

  it("[PRPI-6541] And headline should be: How to play", async () => {
    expect(await gameInfoPO.howToPlayHeadline.getText()).toBe("Description");
  });

  it("[PRPI-6542] And first paragraph should be: Game Info:", async () => {
    expect(await richTextPO.getParagrphsList[0].getText()).toBe("Game info:");
  });

  it("[PRPI-6543] And first item from list should be: Bonus Round", async () => {
    expect(await richTextPO.getItemsList[0].getText()).toBe("Bonus round");
  });

  it("[PRPI-6544] And the CTA button is displayed", async () => {
    expect(await gameInfoPO.playNowButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-6545] And the CTA button is clickable", async () => {
    expect(await gameInfoPO.playNowButton.isClickable()).toBe(true);
  });

  it("[PRPI-6546] And the CTA launch URL is correct", async () => {
    expect(await gameInfoPO.launchGame.getAttribute("href")).toContain("/?gameId=bonanza-anx");
  });

  it("[PRPI-6547] And it should contain favourite button", async () => {
    expect(await gameInfoPO.getFavouriteButton.isDisplayed()).toBe(true);
  });
});

describe("When Game Info page for a game that does not contain metadata info is opened", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_GAME_INFO_MOCK_NO_METADATA_INFO.urn, {
        pause: true,
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getGameLayout(BFF_GAME_INFO_MOCK_NO_METADATA_INFO));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGameViewUrl("game-1")}`);
    await browser.tickFakeClock(30000);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(gameInfoCarouselPO.carouselSlider);
    await browser.waitUntilDisplayed(gameInfoPO.title);
    await browser.waitUntilDisplayed(gameInfoPO.howToPlayHeadline);
    await browser.waitUntilEquals(await richTextPO.getParagrphsList[0], "Game info:");
    await browser.waitUntilEquals(await richTextPO.getItemsList[0], "Bonus round");
    await browser.waitUntilDisplayed(gameInfoPO.playNowButton);
    await browser.waitUntilDisplayed(gameInfoPO.launchGame);
  });

  it("[PRPI-6548] And the key info pills section is not displayed", async () => {
    expect(await gameInfoPO.keyInfoPillsSection.isDisplayed()).toBe(false);
  });

  it("[PRPI-6549] And the game table is not displayed", async () => {
    expect(await gameInfoPO.table.isDisplayed()).toBe(false);
  });

  it("[PRPI-6550] And it should contain favourite button", async () => {
    expect(await gameInfoPO.getFavouriteButton.isDisplayed()).toBe(true);
  });
});

describe("When Game Info page for a game with demo button is opened", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getIndexHTML(DEMO_BUTTON.urn, { jurisdiction: "ITALY" }));
    await mockService.mockHttpRequest(getGameLayout(DEMO_BUTTON));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGameViewUrl("game-1")}`);
    await browser.tickFakeClock(30000);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(gameInfoPO.demoButton);
  });

  it("[PRPI-6551] And the Demo button is displayed", async () => {
    expect(await gameInfoPO.demoButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-6552] And the Demo button is clickable", async () => {
    expect(await gameInfoPO.demoButton.isClickable()).toBe(true);
  });

  it("[PRPI-6553] And it should contain favourite button", async () => {
    expect(await gameInfoPO.getFavouriteButton.isDisplayed()).toBe(true);
  });
});

describe("When Game Info overlay for a game is opened", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_GAME_CARD_HOMEPAGE_MOCK.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_GAME_CARD_HOMEPAGE_MOCK));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.tickFakeClock(30000);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(gamingPagePO.element);
    await browser.waitUntilEquals(gamingPagePO.title, "Curated Games Grid");
    await browser.waitUntilDisplayed(firstGameTilePO.element);
    await browser.waitUntilEquals(firstGameTilePO.gameTitle, "First Game Tile");
    await browser.waitUntilDisplayed(firstGameTilePO.gameInfoButton);
    await firstGameTilePO.gameInfoButton.click();
    await browser.waitUntilDisplayed(quickViewGameInfoPO.overlayModal);
  });

  it("[PRPI-6554] And the overlay is displayed", async () => {
    expect(await quickViewGameInfoPO.overlayModal.isDisplayed()).toBe(true);
  });

  it("[PRPI-6555] And the close button is displayed", async () => {
    expect(await quickViewGameInfoPO.overlayCloseButton.isDisplayed()).toBe(true);
  });

  it("[PRPI-6556] And the close button is clickable", async () => {
    expect(await quickViewGameInfoPO.overlayCloseButton.isClickable()).toBe(true);
  });

  it("[PRPI-6557] And it should contain favourite button", async () => {
    expect(await gameInfoPO.getFavouriteButton.isDisplayed()).toBe(true);
  });

  describe("When Game Info overlay close button is clicked", () => {
    beforeAll(async () => {
      await quickViewGameInfoPO.overlayCloseButton.click();
      await browser.waitUntilDisplayed(gamingPagePO.element);
    });

    it("[PRPI-6558] And the gaming page title is displayed", async () => {
      expect(await gamingPagePO.title.isDisplayed()).toBe(true);
    });

    it("[PRPI-6559] And first game should contain favourite button", async () => {
      expect(await firstGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-6560] And second game should contain favourite button", async () => {
      expect(await secondGameTilePO.getFavouriteButton.isDisplayed()).toBe(true);
    });
  });
});
