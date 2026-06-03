const { GamingCategoryLinkPO, GameTilePO } = require("../../../../../page-objects");
const GamesCardGroupPO = require("@ppb/tbd-shared/components/GamesCardGroup/GamesCardGroup.po");
const SegmentedCardGroupPO = require("@ppb/tbd-shared/components/SegmentedCardGroup/SegmentedCardGroup.po");
const ViewZonePO = require("@ppb/tbd-shared/components/ViewZone/ViewZone.po");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");

const routes = require("../../../../../../utils/routes");

const viewZonePO = new ViewZonePO();
const gamesCardGroupPO = new GamesCardGroupPO();
const segmentedCardGroupPO = new SegmentedCardGroupPO();
const firstZoneCategoryLinkPO = new GamingCategoryLinkPO(segmentedCardGroupPO.categoryLink);
const firstGameTile = new GameTilePO(segmentedCardGroupPO.segmentedGameTile[0]);
const secondGameTile = new GameTilePO(segmentedCardGroupPO.segmentedGameTile[1]);

const mockService = new MockService();

const BFF_MULTIFUNCTIONAL_MODULE = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
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

describe("Multifunctional Module(View Zone) - Gaming View", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MULTIFUNCTIONAL_MODULE.urn, {
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_MULTIFUNCTIONAL_MODULE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(viewZonePO.element);
    await browser.waitUntilEquals(viewZonePO.getTitle, "Casino");
    await browser.waitUntilDisplayed(gamesCardGroupPO.element);
    await browser.waitUntilDisplayed(segmentedCardGroupPO.element);
  });

  it("[PRPI-5915] The view zone should be displayed", async () => {
    expect(await viewZonePO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5916] And the view zone title should be: Casino", async () => {
    expect(await viewZonePO.getTitle.getText()).toBe("Casino");
  });

  it("[PRPI-5917] And the view zone should contain a games card group container and a segmented card container ", async () => {
    expect(await gamesCardGroupPO.element.isDisplayed()).toBe(true);
    expect(await segmentedCardGroupPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5918] And Games Card Group container should have title: Recently Played ", async () => {
    expect(await gamesCardGroupPO.getTitle.getText()).toBe("Recently Played");
  });

  it("[PRPI-5919] And Games Card Group container should contain 4 games", async () => {
    expect(await gamesCardGroupPO.gameContainers.length).toBe(4);
  });

  it("[PRPI-5920] And Segmented Card Group container should have 2 gaming zones", async () => {
    expect(await segmentedCardGroupPO.gamingZones.length).toBe(2);
  });

  it("[PRPI-5921] And first gaming zone should have title: Recommended Games Swimlane", async () => {
    expect(await segmentedCardGroupPO.segmentedTitle[0].getText()).toBe("Recommended Games Swimlane");
  });

  it("[PRPI-5922] And first gaming zone should contain 2 games ", async () => {
    expect(await segmentedCardGroupPO.segmentedGameTile.length).toBe(2);
  });

  it("[PRPI-5923] And they should contain favourite button", async () => {
    expect(await firstGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    expect(await secondGameTile.getFavouriteButton.isDisplayed()).toBe(true);
  });

  describe("Then the user scrolls until the category link card", () => {
    beforeAll(async () => {
      await firstZoneCategoryLinkPO.element.scrollIntoView();
      await browser.waitUntilInViewport(firstZoneCategoryLinkPO.element, "category link card not in viewport");
      await browser.waitUntilDisplayed(firstZoneCategoryLinkPO.label);
      await browser.waitUntilDisplayed(firstZoneCategoryLinkPO.button);
    });

    it("[PRPI-5924] And first gaming zone should display a category link", async () => {
      expect(await firstZoneCategoryLinkPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-5925] And the category link from first zone should have label: See All", async () => {
      expect(await firstZoneCategoryLinkPO.label.getText()).toBe("See All");
    });

    it("[PRPI-5926] And the category link from first zone should have displayed: See All button", async () => {
      expect(await firstZoneCategoryLinkPO.button.isDisplayed()).toBe(true);
    });

    it("[PRPI-5927] And it should have an action to randomCategory", async () => {
      const url = routes.getGamingCategoryViewUrl("randomCategory");

      expect(await firstZoneCategoryLinkPO.element.getAttribute("href")).toContain(url);
    });

    describe("Then the user scrolls until the last game from second gaming zone", () => {
      beforeAll(async () => {
        await segmentedCardGroupPO.gamingZones[1].scrollIntoView();
        await browser.waitUntilInViewport(segmentedCardGroupPO.gamingZones[1], "last game not in viewport");
        await browser.waitUntilEquals(segmentedCardGroupPO.segmentedTitle[1], "Curated Games Swimlane");
      });

      it("[PRPI-5928] And second gaming zone should have title: Casino Games", async () => {
        expect(await segmentedCardGroupPO.segmentedTitle[1].getText()).toBe("Curated Games Swimlane");
      });

      it("[PRPI-5929] And second gaming zone should contain 2 games ", async () => {
        expect(await segmentedCardGroupPO.segmentedTitle.length).toBe(2);
      });
    });
  });
});
