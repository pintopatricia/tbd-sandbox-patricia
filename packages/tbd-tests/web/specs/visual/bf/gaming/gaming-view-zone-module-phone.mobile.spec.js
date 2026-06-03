const { GamingCategoryLinkPO } = require("../../../../page-objects");
const ViewZonePO = require("@ppb/tbd-shared/components/ViewZone/ViewZone.po");
const SegmentedCardGroupPO = require("@ppb/tbd-shared/components/SegmentedCardGroup/SegmentedCardGroup.po");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const viewZonePO = new ViewZonePO();
const segmentedCardGroupPO = new SegmentedCardGroupPO();
const firstZoneCategoryLinkPO = new GamingCategoryLinkPO(segmentedCardGroupPO.categoryLink);

const mockService = new MockService();
const MODULE_NAME = "gaming_multifunctional_module";

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
                          icon: "Slots",
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

describe("Multifunctional Module - When user lands on gaming view", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MULTIFUNCTIONAL_MODULE.urn, {
        disableCSSAnimations: true,
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_MULTIFUNCTIONAL_MODULE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(viewZonePO.element);
    await browser.waitUntilDisplayed(segmentedCardGroupPO.element);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1350]_should_display_recently_played_card_group_and_recommended_segmented_card_group_with_category`,
    );
  });

  it("[PRPI-1350]_should_display_recently_played_card_group_and_recommended_segmented_card_group_with_category", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}_[PRPI-1350]_should_display_recently_played_card_group_and_recommended_segmented_card_group_with_category`,
      ),
    ).toEqual(0);
  });

  describe("Then the user scrolls until the category link from first gaming zone", () => {
    beforeAll(async () => {
      await firstZoneCategoryLinkPO.element.scrollIntoView();
      await browser.waitUntilInViewport(firstZoneCategoryLinkPO.element, "category link not in view port");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1351]_should_display_the_curated_card_group_with_category`,
      );
    });

    it("[PRPI-1351]_should_display_the_curated_card_group_with_category", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1351]_should_display_the_curated_card_group_with_category`),
      ).toEqual(0);
    });
  });
});
