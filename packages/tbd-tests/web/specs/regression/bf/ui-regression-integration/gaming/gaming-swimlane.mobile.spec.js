const { GamingPagePO, ScrollableSwimlanePO, GameTilePO } = require("../../../../../page-objects");

const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getGamingLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const gamingPagePO = new GamingPagePO();
const scrollableSwimlanePO = new ScrollableSwimlanePO();
const firstGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[0]);
const secondGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[1]);
const thirdGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[2]);
const fourthGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[3]);
const fifthGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[4]);
const sixthGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[5]);
const seventhGameTile = new GameTilePO(scrollableSwimlanePO.gameTiles[6]);
const mockService = new MockService();

const BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
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
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Game 2",
                  __typename: "Game",
                  urn: "ppb:game:game-2",
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
                urn: "ppb:tbd:card:game:game-3",
                __typename: "GameCard",
                provider: {},
                game: {
                  name: "Game 3",
                  __typename: "Game",
                  urn: "ppb:game:game-3",
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
            {
              node: {
                urn: "ppb:tbd:card:game:game-2",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-3",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-4",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-5",
                __typename: "GameCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:game:game-6",
                __typename: "GameCard",
              },
            },
          ],
        },
      },
    },
  ],
};
const BFF_FETCH_MORE_RECOMMENDED_GAME_CARDS_MOCK = {
  cards: [
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:game:game-4",
      game: {
        name: "Game 4",
        __typename: "Game",
        urn: "ppb:game:game-4",
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
      urn: "ppb:tbd:card:game:game-5",
      game: {
        name: "Game 5",
        __typename: "Game",
        urn: "ppb:game:game-5",
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
      urn: "ppb:tbd:card:game:game-6",
      game: {
        name: "Game 6",
        __typename: "Game",
        urn: "ppb:game:game-6",
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
describe("Recommended Games Swimlane - When user lands on gaming view", () => {
  describe("when there are no more cards to fetch", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK.urn, {
          USER_FAVOURITE_GAMES: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getGamingLayout(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
      await browser.waitUntilDisplayed(firstGameTile.element);
    });

    it("[PRPI-6568] Then the recommended games swimlane should have 4 game tiles", async () => {
      expect(await scrollableSwimlanePO.gameTiles.length).toBe(4);
    });

    it("[PRPI-6569] And the first and second game tiles should be visible in the viewport", async () => {
      expect(await firstGameTile.element.isDisplayedInViewport()).toBe(true);
      expect(await secondGameTile.element.isDisplayedInViewport()).toBe(true);
      expect(await thirdGameTile.element.isDisplayedInViewport()).toBe(false);
      expect(await fourthGameTile.element.isDisplayedInViewport()).toBe(false);
    });

    it("[PRPI-6570] And they contains favourite button", async () => {
      expect(await firstGameTile.getFavouriteButton.isDisplayed()).toBe(true);
      expect(await secondGameTile.getFavouriteButton.isDisplayed()).toBe(true);
    });

    describe("Then the user scrolls until the fourth game", () => {
      beforeAll(async () => {
        await fourthGameTile.element.scrollIntoView({ behavior: "smooth", inline: "end" });
        await browser.waitUntilDisplayed(fourthGameTile.element);
        await browser.waitUntil(async () => {
          const isInViewport = await fourthGameTile.element.isDisplayedInViewport();
          return isInViewport === true;
        });
      });

      it("[PRPI-6571] And the third and fourth game tiles should be visible in the viewport", async () => {
        expect(await thirdGameTile.element.isDisplayedInViewport()).toBe(true);
        expect(await fourthGameTile.element.isDisplayedInViewport()).toBe(true);
        expect(await firstGameTile.element.isDisplayedInViewport()).toBe(false);
        expect(await secondGameTile.element.isDisplayedInViewport()).toBe(false);
      });

      it("[PRPI-6572] And they contains favourite button", async () => {
        expect(await thirdGameTile.getFavouriteButton.isDisplayed()).toBe(true);
        expect(await fourthGameTile.getFavouriteButton.isDisplayed()).toBe(true);
      });
    });
  });

  describe("When the user scrolls to the last game and the next catalog request is triggered", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK.urn, {
          USER_FAVOURITE_GAMES: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getGamingLayout(BFF_RECOMMENDED_GAMES_SWIMLANE_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_MORE_RECOMMENDED_GAME_CARDS_MOCK));
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
    });

    describe("before any action", () => {
      it("[PRPI-6573] should have a total of 4 Game cards on the swimlane", async () => {
        await browser.waitUntil(async () => (await scrollableSwimlanePO.gameTiles.length) === 4);
        expect(await scrollableSwimlanePO.gameTiles.length).toBe(4);
      });
    });

    describe("when user scrolls", () => {
      beforeAll(async () => {
        // scroll with behavior smooth so useLazyLoading triggers the request for next 4 items
        await fourthGameTile.element.scrollIntoView({ behavior: "smooth", inline: "start" });
        await browser.waitUntilInViewport(fifthGameTile.element, "5th element not in viewport");
        await sixthGameTile.element.scrollIntoView({ behavior: "smooth", inline: "start" });
        await browser.waitUntilInViewport(seventhGameTile.element, "7th element not in viewport");
      });

      it("[PRPI-6574] Then the sixth and seventh game tiles should be visible in the viewport", async () => {
        expect(await sixthGameTile.element.isDisplayedInViewport()).toBe(true);
        expect(await seventhGameTile.element.isDisplayedInViewport()).toBe(true);
      });
      it("[PRPI-6575] And they contains favourite button", async () => {
        expect(await sixthGameTile.getFavouriteButton.isDisplayed()).toBe(true);
        expect(await seventhGameTile.getFavouriteButton.isDisplayed()).toBe(true);
      });
      it("[PRPI-6576] And the category link button should be visible", async () => {
        expect(await gamingPagePO.categoryLinkButton.isDisplayed()).toBe(true);
      });
      it("[PRPI-6577] And it should have a text of: See All", async () => {
        expect(await gamingPagePO.categoryLinkButton.getText()).toBe("See All");
      });
    });
  });
});
