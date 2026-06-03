const { getGamingLayout, getGamingSearchCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { SearchBarPO, GamingSearchContainerPO, PebbleListPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const gamingSearchContainerPO = new GamingSearchContainerPO();
const gamingSearchZonePO = new GamingSearchContainerPO();
const pebblesContainerPO = new PebbleListPO(gamingSearchContainerPO.element);
const searchBarHomepagePO = new SearchBarPO();
const searchBarPO = new SearchBarPO(gamingSearchZonePO.gamingSearchBar);
const mockService = new MockService();

const recentSearchesKey = "recentSearches_en-US";
const searchHistoryList = ["age", "joker", "blackjack"];

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

// Disabled due to flakyness in CI
// https://github.com/Flutter-Global/tbd/actions/runs/16932361101/job/47981037792
// Ticket raised for further investigation: https://tools.skybet.net/jira/browse/PRPI-495
xdescribe("When user lands on gaming view with a search zone", () => {
  beforeAll(async () => {
    const indexHTML = await getIndexHTML(BFF_GAMING_SEARCH_ZONE.urn, {
      DISPLAY_SEARCH_HISTORY: { isActive: true },
    });
    await mockService.mockHttpRequest(indexHTML);
    await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_SEARCH_ZONE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(searchBarHomepagePO.input);
  });

  it("[PRPI-5908] The gaming search bar should be displayed", async () => {
    expect(await searchBarHomepagePO.input.isDisplayed()).toBe(true);
  });

  describe("Then the user clicks on the search zone", () => {
    beforeAll(async () => {
      await searchBarHomepagePO.input.click();
    });

    it("[PRPI-5909] The gaming search bar should be displayed", async () => {
      expect(await searchBarPO.input.isDisplayed()).toBe(true);
    });

    it("[PRPI-5910] The recommended games should be displayed", async () => {
      expect(await gamingSearchZonePO.recommendedGamesContainer.isDisplayed()).toBe(true);
    });

    describe("Then the user clicks on the search input", () => {
      beforeAll(async () => {
        await searchBarPO.input.click();
        await browser.waitUntilDisplayed(gamingSearchZonePO.recommendedGamesContainer);
      });

      it("[PRPI-5911] The recommended games container should be displayed", async () => {
        expect(await gamingSearchZonePO.recommendedGamesContainer.isDisplayed()).toBe(true);
      });

      describe("The user then types at least 3 letters in the search field", () => {
        beforeAll(async () => {
          await searchBarPO.input.click();
          await browser.waitUntilDisplayed(gamingSearchZonePO.recommendedGamesContainer);
          await mockService.mockHttpRequest(getGamingSearchCardResults(BFF_MOCK_4_CARDS));
          await searchBarPO.input.setValue("fff");
        });

        it("[PRPI-5912] should show 4 games", async () => {
          expect(await gamingSearchContainerPO.results.length).toBe(4);
        });
      });
    });
  });

  describe("When the user lands on the page with a search history set", () => {
    beforeAll(async () => {
      await browser.execute(
        (key, value) => localStorage.setItem(key, value),
        recentSearchesKey,
        JSON.stringify(searchHistoryList),
      );
      await browser.refresh();
      await browser.waitUntilDisplayed(searchBarHomepagePO.input);
      await searchBarHomepagePO.input.click();
    });

    it("[PRPI-5913] The gaming search history should be displayed", async () => {
      expect(await gamingSearchContainerPO.searchHistory.isDisplayed()).toBe(true);
    });

    it("[PRPI-5914] The search history container should contain 3 pebbles with the proper values", async () => {
      expect(await pebblesContainerPO.pebbles.length).toBe(3);

      for (let i = 0; i < pebblesContainerPO.pebbles.length; i += 1) {
        expect(pebblesContainerPO.pebbles[i].getText()).toBe(searchHistoryList[i]);
      }
    });
  });
});
