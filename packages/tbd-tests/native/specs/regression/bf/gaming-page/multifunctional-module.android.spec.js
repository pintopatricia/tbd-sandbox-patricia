const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getConnectivityCheck } = require("@ppb/tbd-shared/mocks/connectivity-check/connectivity-check.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const {
  GamesCardGroupSO,
  BottomBarSO,
  ViewZoneSO,
  SegmentedCardGroupSO,
  GameTileSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const gamesCardGroupSO = new GamesCardGroupSO();
const viewZoneSO = new ViewZoneSO();
const segmentedCardGroupSO = new SegmentedCardGroupSO();
const firstGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[0]);
const secondGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[1]);
const thirdGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[2]);
const fourthGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[3]);

const MULTIFUNCTIONAL_MODULE_TITLE = "Casino";
const RECTNTLY_PLAYED_SECTION_TITLE = "Recently Played";
const FIRST_GAME_TITLE = "First Game Tile";
const SECOND_GAME_TITLE = "Second Game Tile";
const THIRD_GAME_TITLE = "Third Game Tile";
const FOURTH_GAME_TITLE = "Fourth Game Tile";

const BFF_MULTIFUNCTIONAL_MODULE = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module:0",
        __typename: "ViewZone",
        title: "Casino",
        viewZoneItems: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:group:recentlyPlayedGames:recentlyPlayedGamesZoneCode",
                __typename: "GamingCardGroup",
                cardGroupTitle: "Recently Played",
                defaultLayout: "GRID_FOUR_COLUMNS",
                layouts: ["GRID_FOUR_COLUMNS"],
                games: [],
                full: {
                  edges: [
                    {
                      node: {
                        urn: "ppb:tbd:card:game:game-recently-1",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "First Game Tile",
                          __typename: "Game",
                          urn: "ppb:game:game-recently-1",
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
                        urn: "ppb:tbd:card:game:game-recently-2",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "Second Game Tile",
                          __typename: "Game",
                          urn: "ppb:game:game-recently-2",
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
                        urn: "ppb:tbd:card:game:game-recently-3",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "Third Game Tile",
                          __typename: "Game",
                          urn: "ppb:game:game-recently-3",
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
                        urn: "ppb:tbd:card:game:game-recently-4",
                        __typename: "GameCard",
                        provider: {},
                        game: {
                          name: "Fourth Game Tile",
                          __typename: "Game",
                          urn: "ppb:game:game-recently-4",
                          backgroundColor: "#B22222",
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
                    { node: { urn: "ppb:tbd:card:game:game-recently-1", __typename: "GameCard" } },
                    { node: { urn: "ppb:tbd:card:game:game-recently-2", __typename: "GameCard" } },
                    { node: { urn: "ppb:tbd:card:game:game-recently-3", __typename: "GameCard" } },
                    { node: { urn: "ppb:tbd:card:game:game-recently-4", __typename: "GameCard" } },
                  ],
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|segmented-zone",
                __typename: "SegmentedCardGroup",
                title: "SegmentedCardGroup",
                full: {
                  edges: [
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:recommendedGames:recommendedGamesZoneCode",
                        cardGroupTitle: "Recommended Games Swimlane",
                        defaultLayout: "CARD_LIST",
                        layouts: ["CARD_LIST"],
                        games: [],
                        viewAll: {
                          label: "See All",
                          viewLink: {
                            viewUrl: "",
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
                                  backgroundColor: "#B22222",
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
                        urn: "ppb:tbd:card:group:gaming:curated:randomCuratedZoneCode",
                        cardGroupTitle: "Curated Games Swimlane",
                        defaultLayout: "CARD_LIST",
                        layouts: ["CARD_LIST"],
                        games: [],
                        viewAll: {
                          label: "Curated Games",
                          viewLink: {
                            viewUrl: "",
                            viewUrn: "ppb:tbd:view:gamingCategory:curatedGames",
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
                                  backgroundColor: "#B22222",
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
                  ],
                },
                partials: {
                  edges: [
                    {
                      node: {
                        urn: "ppb:tbd:card:group:recommendedGames:recommendedGamesZoneCode",
                        __typename: "GamingCardGroup",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:group:gaming:curated:randomCuratedZoneCode",
                        __typename: "GamingCardGroup",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  ],
};

const BFF_MULTIFUNCTIONAL_MODULE_CATEGORY_LINKS = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module:0",
        __typename: "ViewZone",
        title: "Casino",
        viewZoneItems: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|curatedGames|segmented-zone",
                __typename: "SegmentedCardGroup",
                title: "SegmentedCardGroup",
                full: {
                  edges: [
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:recommendedGames:recommendedGamesZoneCode",
                        cardGroupTitle: "Recommended Games Swimlane",
                        defaultLayout: "CARD_LIST",
                        layouts: ["CARD_LIST"],
                        games: [],
                        viewAll: {
                          label: "See All",
                          viewLink: {
                            viewUrl: "",
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
                                  backgroundColor: "#B22222",
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
                        urn: "ppb:tbd:card:group:gaming:curated:randomCuratedZoneCode",
                        cardGroupTitle: "Curated Games Swimlane",
                        defaultLayout: "CARD_LIST",
                        layouts: ["CARD_LIST"],
                        games: [],
                        viewAll: {
                          label: "Curated Games",
                          viewLink: {
                            viewUrl: "",
                            viewUrn: "ppb:tbd:view:gamingCategory:curatedGames",
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
                                  backgroundColor: "#B22222",
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
                  ],
                },
                partials: {
                  edges: [
                    {
                      node: {
                        urn: "ppb:tbd:card:group:recommendedGames:recommendedGamesZoneCode",
                        __typename: "GamingCardGroup",
                      },
                    },
                    {
                      node: {
                        urn: "ppb:tbd:card:group:gaming:curated:randomCuratedZoneCode",
                        __typename: "GamingCardGroup",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  ],
};

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
];

const ERO_MOCK = [
  {
    runners: [],
  },
];

xdescribe("Multifunctional module section", () => {
  describe("When user opens Casino tab with Multifunctional module section", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getConnectivityCheck({}));
      await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
      await mockService.mockHttpRequest(
        getMarketPositionViews({
          marketPositions: [],
        }),
      );
      await mockService.mockHttpRequest(
        getMarketPrices({
          markets: [],
        }),
      );
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(
        getScaResponse({
          fixture: [],
        }),
      );
      await mockService.mockHttpRequest(getGamingLayout(BFF_MULTIFUNCTIONAL_MODULE));
      await startApp("home", { pullToRefresh: true });
      await browser.waitUntilClickableNative(BottomBarSO.gaming);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(gamesCardGroupSO.element);
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroup);
    });

    it("[PRPI-2754] Multifunctional module is displayed", async () => {
      expect(await viewZoneSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2755] And multifunctional module has correct title", async () => {
      expect(await viewZoneSO.viewZoneTitle.getText()).toEqual(MULTIFUNCTIONAL_MODULE_TITLE);
    });

    it("[PRPI-2756] And recently played section is displayed with correct title", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupHeaderText.getText()).toEqual(RECTNTLY_PLAYED_SECTION_TITLE);
    });

    it("[PRPI-2757] And recently played section should contain 4 games", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupGamesList.length).toBe(4);
    });

    it("[PRPI-2758] And recently played games have names displayed under tiles", async () => {
      expect(await firstGameTileSO.gameTileTitle.getText()).toEqual(FIRST_GAME_TITLE);
      expect(await secondGameTileSO.gameTileTitle.getText()).toEqual(SECOND_GAME_TITLE);
      expect(await thirdGameTileSO.gameTileTitle.getText()).toEqual(THIRD_GAME_TITLE);
      expect(await fourthGameTileSO.gameTileTitle.getText()).toEqual(FOURTH_GAME_TITLE);
    });

    it("[PRPI-2759] And Segmented Card Group container should be displayed", async () => {
      expect(await segmentedCardGroupSO.element.isDisplayed()).toBe(true);
    });
  });

  describe("Then the logged out user opens Casino tab with category swimlane", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_MULTIFUNCTIONAL_MODULE_CATEGORY_LINKS));
      await swipeDownElementFullscreen(fourthGameTileSO.gameTileTitle);
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroup);
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroupCategoryLink);
    });

    it("[PRPI-2760] And first gaming section should display a category link", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupCategoryLink.isDisplayed()).toBe(true);
    });

    it("[PRPI-2761] And the category link from first sesction should have label: See All", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupCategoryLinkLabel.getText()).toBe("See All");
    });

    it("[PRPI-2762] And the category link from first section should have See All button displayed", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupCategoryLinkButtonText.isDisplayed()).toBe(true);
    });

    it("[PRPI-2763] And first segmented card group should contain 2 games", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupGamesList.length).toBe(2);
    });
  });
});
