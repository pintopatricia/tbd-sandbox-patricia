const { getCardResults, getBrowseLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSearchGamesResponse } = require("@ppb/tbd-shared/mocks/search-games/search-games.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { SearchBarPO, GamingSearchContainerPO, TabsGroupPO } = require("../../../../page-objects");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const gamingSearchContainerPO = new GamingSearchContainerPO();
const searchBarPO = new SearchBarPO(gamingSearchContainerPO.gamingSearchBar);
const tabsPO = new TabsGroupPO();

const mockService = new MockService();

const BFF_MULTIFUNCTIONAL_MODULE = {
  __typename: "BrowseView",
  urn: "ppb:tbd:view:browse:gaming",
  url: "browse/browse:gaming",
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
                urn: "ppb:tbd:card:group:recentlyPlayedGames:recentlyPlayedGamesZoneCode/recently_played",
                __typename: "GamingCardGroup",
                cardGroupTitle: "Recently Played",
                defaultLayout: "GRID_FOUR_COLUMNS",
                layouts: ["GRID_FOUR_COLUMNS"],
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
                        viewAll: {
                          label: "Curated Games",
                          viewLink: {
                            viewUrl: routes.getGamingCategoryViewUrl("curatedGames"),
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

  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: routes.getSportViewUrl("1"),
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: routes.getBrowseViewUrl(),
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: routes.getMyBetsViewUrl("open"),
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: routes.getGamingViewUrl("1"),
        },
      },
    ],
  },
};

const BFF_MOCK_4_CARDS = {
  cards: [
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/game-1",
      game: {
        name: "Game 1",
        urn: "ppb:gaming:game:game-1",
        backgroundColor: "#B22222",
        flattened: {
          small: {
            url: "http://example.test.com/mockedImage/image.png",
          },
        },
      },
    },
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/game-2",
      game: {
        name: "Game 2",
        urn: "ppb:gaming:game:game-2",
        backgroundColor: "#B22222",
        flattened: {
          small: {
            url: "http://example.test.com/mockedImage/image.png",
          },
        },
      },
    },
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/game-3",
      game: {
        name: "Game 3",
        urn: "ppb:gaming:game:game-3",
        backgroundColor: "#B22222",
        flattened: {
          small: {
            url: "http://example.test.com/mockedImage/image.png",
          },
        },
      },
    },
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/game-4",
      game: {
        name: "Game 4",
        urn: "ppb:gaming:game:game-4",
        backgroundColor: "#B22222",
        flattened: {
          small: {
            url: "http://example.test.com/mockedImage/image.png",
          },
        },
      },
    },
  ],
};

const BFF_MOCK_1_CARD = {
  cards: [
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/game-1",
      game: {
        name: "Game 1",
        urn: "ppb:gaming:game:game-1",
        backgroundColor: "#B22222",
        flattened: {
          small: {
            url: "http://example.test.com/mockedImage/image.png",
          },
        },
      },
    },
  ],
};

const BFF_MOCK_NO_CARDS = {
  cards: [],
};

const SEARCH_MOCK_4_RESULTS = {
  content: [
    {
      uid: "game-1",
    },
    {
      uid: "game-2",
    },
    {
      uid: "game-3",
    },
    {
      uid: "game-4",
    },
  ],

  results: 4,
};

const SEARCH_MOCK_1_RESULT = {
  content: [
    {
      uid: "game-1",
    },
  ],

  results: 1,
};

const SEARCH_MOCK_NO_RESULTS = {
  content: [],
  results: 0,
};

const MODULE_NAME = "gaming-browse";

describe("Searching on the browse section", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MULTIFUNCTIONAL_MODULE.urn, {
        disableCSSAnimations: true,
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getBrowseLayout(BFF_MULTIFUNCTIONAL_MODULE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getBrowseViewUrl()}`);
    await browser.waitUntilDisplayed(tabsPO.element);
    await tabsPO.tabs[1].click();
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1313]_should_render_search_default_view`);
  });

  it("[PRPI-1313]_should_render_search_default_view", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1313]_should_render_search_default_view`)).toBe(0);
  });

  describe("And user clicks on the search input", () => {
    beforeAll(async () => {
      await searchBarPO.input.click();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1314]_should_dismiss_default_container`);
    });

    it("[PRPI-1314]_should_dismiss_default_container", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1314]_should_dismiss_default_container`)).toBe(0);
    });

    describe("And user inputs 'game'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getSearchGamesResponse(SEARCH_MOCK_4_RESULTS));
        await mockService.mockHttpRequest(getCardResults(BFF_MOCK_4_CARDS));
        await searchBarPO.input.setValue("game");
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1315]_should_display_search_results_two_column_layout`,
        );
      });

      it("[PRPI-1315]_should_display_search_results_two_column_layout", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1315]_should_display_search_results_two_column_layout`),
        ).toBe(0);
      });

      describe("And user inputs ' 1'", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getSearchGamesResponse(SEARCH_MOCK_1_RESULT));
          await mockService.mockHttpRequest(getCardResults(BFF_MOCK_1_CARD));
          await searchBarPO.input.addValue(" 1");
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1316]_should_display_search_results_rectangle_layout`,
          );
        });

        it("[PRPI-1316]_should_display_search_results_rectangle_layout", async () => {
          expect(
            await browser.checkScreen(`${MODULE_NAME}_[PRPI-1316]_should_display_search_results_rectangle_layout`),
          ).toBe(0);
        });

        describe("And user clicks on the 'x' icon", () => {
          beforeAll(async () => {
            await searchBarPO.cleanButton.click();
            await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1317]_should_show_outOfIdeas_label`);
          });

          it("[PRPI-1317]_should_show_outOfIdeas_label", async () => {
            expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1317]_should_show_outOfIdeas_label`)).toBe(0);
          });

          describe("And user clicks on the cancel button", () => {
            beforeAll(async () => {
              await browser.waitUntilDisplayed(searchBarPO.cancelButton);
              await searchBarPO.cancelButton.click();
              await browser.waitUntilDisplayed(gamingSearchContainerPO.defaultContainer);
              await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1318]_should_show_default_container`);
            });

            it("[PRPI-1318]_should_show_default_container", async () => {
              expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1318]_should_show_default_container`)).toBe(0);
            });

            describe("Search with 'typos' and there aren't results", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getSearchGamesResponse(SEARCH_MOCK_NO_RESULTS));
                await mockService.mockHttpRequest(getCardResults(BFF_MOCK_NO_CARDS));
                await searchBarPO.input.setValue("wzk");
                await browser.pause(1000); //wait for red underline
                await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1319]_should_show_noResults_label`);
              });

              it("[PRPI-1319]_should_show_noResults_label", async () => {
                expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1319]_should_show_noResults_label`)).toBe(0);
              });
            });
          });
        });
      });
    });
  });
});
