const { getGamingLayout, getGamingSearchCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { SearchBarPO, GamingSearchContainerPO } = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const gamingSearchContainerPO = new GamingSearchContainerPO();
const searchBarZonePO = new SearchBarPO();
const searchBarContainerPO = new SearchBarPO(gamingSearchContainerPO.gamingSearchBar);

const mockService = new MockService();
const MODULE_NAME = "gaming_search_zone";

const BFF_GAMING_SEARCH_ZONE = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        urn: "ppb:tbd:gaming:masterConfigElement:search:0",
        __typename: "SearchZone",
        searchZoneItems: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:searchBar:search|id-1",
                __typename: "SearchBarCard",
              },
              __typename: "ViewZoneItemEdge",
            },
            {
              node: {
                urn: "ppb:tbd:card:group:curatedGames:curatedGamesZoneCode",
                __typename: "GamingCardGroup",
                cardGroupTitle: "Recommended Games",
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
                          feedData: {
                            lastNumbers: [
                              { color: "red", number: "14" },
                              { color: "green", number: "0" },
                              { color: "black", number: "13" },
                              { color: "black", number: "23" },
                              { color: "red", number: "3" },
                              { color: "black", number: "11" },
                              { color: "black", number: "10" },
                              { color: "black", number: "8" },
                            ],
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
                          name: "Third Game Tile",
                          __typename: "Game",
                          urn: "ppb:game:game-2",
                          backgroundColor: "#B22222",
                          feedData: {
                            availableSeats: "8",
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
                          name: "Fourth Game Tile",
                          __typename: "Game",
                          urn: "ppb:game:game-3",
                          backgroundColor: "#B22222",
                          label: "JACKPOT",
                          feedData: {
                            jackpot: 1000000,
                          },
                        },
                      },
                    },
                  ],
                },
                partials: {
                  edges: [
                    { node: { urn: "ppb:tbd:card:game:game-0", __typename: "GameCard" } },
                    { node: { urn: "ppb:tbd:card:game:game-1", __typename: "GameCard" } },
                    { node: { urn: "ppb:tbd:card:game:game-2", __typename: "GameCard" } },
                    { node: { urn: "ppb:tbd:card:game:game-3", __typename: "GameCard" } },
                  ],
                },
              },
              __typename: "ViewZoneItemEdge",
            },
          ],
        },
      },
    },
  ],
};

const BFF_MOCK_4_CARDS = {
  gamingSearch: {
    __typename: "GamingSearchCardConnection",
    edges: [
      {
        __typename: "GamingCardEdge",
        node: {
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
      },
      {
        __typename: "GamingCardEdge",
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:gaming:game:uid/game-2",
          game: {
            name: "Game 2",
            urn: "ppb:gaming:game:game-2",
            backgroundColor: "#B22222",
            flattened: {
              medium: {
                url: "http://example.test.com/mockedImage/image.png",
              },
            },
          },
        },
      },
      {
        __typename: "GamingCardEdge",
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:gaming:game:uid/game-3",
          game: {
            name: "Game 3",
            urn: "ppb:gaming:game:game-3",
            backgroundColor: "#B22222",
            flattened: {
              medium: {
                url: "http://example.test.com/mockedImage/image.png",
              },
            },
          },
        },
      },
      {
        __typename: "GamingCardEdge",
        node: {
          __typename: "GameCard",
          urn: "ppb:tbd:card:gaming:game:uid/game-4",
          game: {
            name: "Game 4",
            urn: "ppb:gaming:game:game-4",
            backgroundColor: "#B22222",
            flattened: {
              medium: {
                url: "http://example.test.com/mockedImage/image.png",
              },
            },
          },
        },
      },
    ],
  },
};

describe("When user lands on gaming view with a search zone", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_GAMING_SEARCH_ZONE.urn, { disableCSSAnimations: true }));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_SEARCH_ZONE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(searchBarZonePO.input);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1345]_should_display_gaming_search_zone`);
  });

  it("[PRPI-1345]_should_display_gaming_search_zone", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1345]_should_display_gaming_search_zone`)).toEqual(0);
  });
});

describe("When user clicks on search input from gaming search zone", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_GAMING_SEARCH_ZONE.urn, {
        disableCSSAnimations: true,
        USER_FAVOURITE_GAMES: { isActive: true },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_SEARCH_ZONE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(searchBarZonePO.input);
    await searchBarZonePO.input.click();
    await browser.waitUntilDisplayed(searchBarContainerPO.input);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1346]_should_display_recommended_games_container`);
  });

  it("[PRPI-1346]_should_display_recommended_games_container", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1346]_should_display_recommended_games_container`)).toEqual(
      0,
    );
  });

  describe("When the user then types at least 3 letters in the search field", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(searchBarContainerPO.input);
      await searchBarContainerPO.input.click();
      await mockService.mockHttpRequest(getGamingSearchCardResults(BFF_MOCK_4_CARDS));
      await searchBarContainerPO.input.setValue("fff");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1347]_should_display_search_results`);
    });
    it("[PRPI-1347]_should_display_search_results", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1347]_should_display_search_results`)).toEqual(0);
    });
  });
});
