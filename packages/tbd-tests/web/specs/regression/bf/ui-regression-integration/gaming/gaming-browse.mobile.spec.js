const {
  SectionHeaderPO,
  SearchBarPO,
  GamingSearchContainerPO,
  GameTilePO,
  TabsGroupPO,
} = require("../../../../../page-objects");
const ViewZonePO = require("@ppb/tbd-shared/components/ViewZone/ViewZone.po");
const GamingBrowsePO = require("@ppb/tbd-shared/components/GamingBrowse/GamingBrowse.po");
const { getSearchGamesResponse } = require("@ppb/tbd-shared/mocks/search-games/search-games.controller");
const { getCardResults, getBrowseLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const browsePO = new SectionHeaderPO();
const gamingBrowsePO = new GamingBrowsePO();
const gamingSearchContainerPO = new GamingSearchContainerPO();
const searchBarPO = new SearchBarPO(gamingSearchContainerPO.gamingSearchBar);
const tabsPO = new TabsGroupPO();
const firstSearchResult = new GameTilePO(gamingSearchContainerPO.results[0]);
const secondSearchResult = new GameTilePO(gamingSearchContainerPO.results[1]);
const thirdSearchResult = new GameTilePO(gamingSearchContainerPO.results[2]);
const fourthSearchResult = new GameTilePO(gamingSearchContainerPO.results[3]);
const viewZonePO = new ViewZonePO();

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
          medium: {
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

describe("Interacting with the Casino search", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MULTIFUNCTIONAL_MODULE.urn));
    await mockService.mockHttpRequest(getBrowseLayout(BFF_MULTIFUNCTIONAL_MODULE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getBrowseViewUrl());
    await browser.waitUntilDisplayed(tabsPO.element);
    await tabsPO.tabs[1].click();
    await browser.waitUntilDisplayed(searchBarPO.input);
  });

  it("[PRPI-6504] the gaming search bar should be displayed", async () => {
    expect(await gamingSearchContainerPO.gamingSearchBar.isDisplayed()).toBe(true);
  });

  it("[PRPI-6505] the results container should not be displayed", async () => {
    expect(await gamingBrowsePO.resultsContainer.isDisplayed()).toBe(false);
  });

  it("[PRPI-6506] the rest of the search components are correctly displayed", async () => {
    expect(await browsePO.title.getText()).toBe("Browse");
    expect(await searchBarPO.searchIcon.isDisplayed()).toBe(true);
    expect(await searchBarPO.input.isDisplayed()).toBe(true);
    expect(await searchBarPO.input.getAttribute("placeholder")).toBe("Search games, providers, live tables");
    expect(await searchBarPO.cleanButton.isDisplayed()).toBe(false);
    expect(await searchBarPO.cancelButton.isDisplayed()).toBe(true);
    expect(await tabsPO.tabs[0].getText()).toBe("Sports");
    expect(await tabsPO.tabs[1].getText()).toBe("Casino");
  });

  describe("And user clicks on the search input", () => {
    beforeAll(async () => {
      await searchBarPO.input.click();
      await browser.waitUntilDisplayed(searchBarPO.cancelButton);
      await browser.waitUntilNotDisplayed(searchBarPO.cleanButton);
    });

    it("[PRPI-6507] the viewZone is dismissed", async () => {
      expect(await viewZonePO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-6508] the outOfIdeas label should be displayed", async () => {
      expect(await gamingSearchContainerPO.outOfIdeasLabel.isDisplayed()).toBe(true);
    });

    describe("And user clicks outside the input box", () => {
      beforeAll(async () => {
        await browsePO.title.click();
        await browser.waitUntil(async () => (await searchBarPO.input.isFocused()) === false);
      });

      it("[PRPI-6509] the gaming search bar is still displayed", async () => {
        expect(await gamingSearchContainerPO.gamingSearchBar.isDisplayed()).toBe(true);
      });
    });
  });
});

describe("Search and delete", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MULTIFUNCTIONAL_MODULE.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getBrowseViewUrl());
    await browser.waitUntilDisplayed(tabsPO.element);
    await tabsPO.tabs[1].click();
    await browser.waitUntilDisplayed(searchBarPO.input);
    await searchBarPO.input.click();
    await browser.waitUntilDisplayed(searchBarPO.cancelButton);
    await mockService.mockHttpRequest(getSearchGamesResponse(SEARCH_MOCK_4_RESULTS));
    await mockService.mockHttpRequest(getCardResults(BFF_MOCK_4_CARDS));
    await searchBarPO.input.setValue("gam");
    await browser.waitUntilDisplayed(gamingBrowsePO.resultsContainer);
  });

  it("[PRPI-6510] should show 4 games", async () => {
    expect(await gamingSearchContainerPO.results.length).toBe(4);
    expect(await firstSearchResult.gameTitle.getText()).toBe("Game 1");
    expect(await secondSearchResult.gameTitle.getText()).toBe("Game 2");
    expect(await thirdSearchResult.gameTitle.getText()).toBe("Game 3");
    expect(await fourthSearchResult.gameTitle.getText()).toBe("Game 4");
  });

  it("[PRPI-6511] And they should contain favourite button", async () => {
    expect(await firstSearchResult.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await secondSearchResult.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await thirdSearchResult.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await fourthSearchResult.getFavouriteButton.isDisplayed()).toBe(true);
  });

  describe("And user deletes the 3rd character", () => {
    beforeAll(async () => {
      await browser.keys("Backspace");
      await browser.waitUntilNotDisplayed(gamingBrowsePO.resultsContainer);
    });

    it("[PRPI-6512] results are dismissed", async () => {
      expect(await gamingBrowsePO.resultsContainer.isDisplayed()).toBe(false);
    });

    describe("And deletes the rest of the search term and loses focus", () => {
      beforeAll(async () => {
        await browser.keys(["Backspace", "Backspace"]);
        await browser.waitUntilEquals(searchBarPO.input, "");
        await browsePO.title.click();
        await browser.waitUntil(async () => (await searchBarPO.input.isFocused()) === false);
      });

      it("[PRPI-6513] the gaming search bar should be displayed", async () => {
        expect(await gamingSearchContainerPO.gamingSearchBar.isDisplayed()).toBe(true);
      });

      it("[PRPI-6514] it should show the placeholder", async () => {
        expect(await searchBarPO.input.getAttribute("placeholder")).toBe("Search games, providers, live tables");
      });
    });
  });
});
