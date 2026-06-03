const GamingRibbonCardPO = require("@ppb/tbd-shared/components/GamingRibbonCard/GamingRibbonCard.po");
const { IconButtonPO } = require("../../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const gamingRibbonCardPO = new GamingRibbonCardPO();
const firstCardButtonPO = new IconButtonPO(gamingRibbonCardPO.items[0]);
const favouritesCardButtonPO = new IconButtonPO(gamingRibbonCardPO.items[6]);
const lastCardButtonPO = new IconButtonPO(gamingRibbonCardPO.items[7]);

const currentDate = new Date(Date.now());

const newestReleases = "newestReleases_en-US";
const favouriteGames = "favouritesNotifications_en-US";
const gameList = ["funky-monkey-cptn", "mega-fire-blaze-roulette-cptl", "live-quantum-blackjack-cptl"];
const seenGameList = ["funky-monkey-cptn", "mega-fire-blaze-roulette-cptl"];
const localStorageWithNewAndSeenGames = {
  new: ["live-quantum-blackjack-cptl"],
  seen: seenGameList,
};
const localStorageWithFavouritesAndSeenGames = {
  unseenCount: 1,
  addedGameIds: seenGameList,
};
const localStorageWithSeenGames = {
  new: [],
  seen: gameList,
};
const localStorageWithFavouritesSeenGames = {
  unseenCount: 0,
  addedGameIds: gameList,
};
const localStorageWithFavouritesAllUnseen = {
  unseenCount: 3,
  addedGameIds: gameList,
};

const BFF_GAMING_NAVIGATION_LINKS_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:navigation/0",
        cardGroupTitle: "Categories",
        displayName: null,
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST"],
        type: "CATEGORIES",
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:1",
                __typename: "GamingLinkCard",
                games: [
                  {
                    releaseDate: currentDate,
                    uid: "funky-monkey-cptn",
                    __typename: "GameWithReleaseDate",
                  },
                  {
                    releaseDate: currentDate,
                    uid: "mega-fire-blaze-roulette-cptl",
                    __typename: "GameWithReleaseDate",
                  },
                  {
                    releaseDate: currentDate,
                    uid: "live-quantum-blackjack-cptl",
                    __typename: "GameWithReleaseDate",
                  },
                ],

                link: {
                  icon: "New",
                  label: "New",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:gaming-new-for-bfrb",
                    viewUrl: "/gc-gaming-new-for-bfrb",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:2",
                __typename: "GamingLinkCard",
                games: [],
                link: {
                  icon: "Slots",
                  label: "Slots",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:slots",
                    viewUrl: "casino/c/null/gc-null",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:3",
                __typename: "GamingLinkCard",
                games: [],
                link: {
                  icon: "Live",
                  label: "Live",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:live",
                    viewUrl: "casino/c/sportsgaming-live/gc-sportsgaming-live",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:4",
                __typename: "GamingLinkCard",
                games: [],
                link: {
                  icon: "Instant Win",
                  label: "Instant Win",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:slots",
                    viewUrl: "casino/c/null/gc-null",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:5",
                __typename: "GamingLinkCard",
                games: [],
                link: {
                  icon: "Roulette",
                  label: "Roulette",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:slots",
                    viewUrl: "casino/c/null/gc-null",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:6",
                __typename: "GamingLinkCard",
                games: [],
                link: {
                  icon: "Blackjack",
                  label: "Blackjack",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:slots",
                    viewUrl: "casino/c/null/gc-null",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:7",
                __typename: "GamingLinkCard",
                link: {
                  icon: "Favourites",
                  label: "FAVOURITE GAMES",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:bfrb-favourite-games",
                    viewUrl: "casino/c/bfrb-favourite-games/gc-bfrb-favourite-games",
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:8",
                __typename: "GamingLinkCard",
                games: [],
                link: {
                  icon: "Slingo",
                  label: "Slingo",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:slots",
                    viewUrl: "casino/c/null/gc-null",
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
                urn: "ppb:tbd:card:gamingLink:1",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:2",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:3",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:4",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:5",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:6",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:7",
                __typename: "GamingLinkCard",
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:8",
                __typename: "GamingLinkCard",
              },
            },
          ],

          __typename: "GamingCardGroupItemsConnection",
        },
        decoration: null,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:navigation/0",
      },
    },
  ],
};

describe("GamingRibbonCard", () => {
  describe("When user lands on gaming view with a gaming ribbon card", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_GAMING_NAVIGATION_LINKS_MOCK.urn));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_LINKS_MOCK));
      await browser.url(routes.getGamingViewUrl("1"));
      await browser.waitUntilDisplayed(firstCardButtonPO.element);
    });

    it("[PRPI-5181] The Gaming Ribbon swimlane should be displayed", async () => {
      expect(await gamingRibbonCardPO.element.isDisplayed()).toBe(true);
      expect(await gamingRibbonCardPO.items.length).toBe(8);
    });

    it("[PRPI-5182] The first gaming ribbon card should be New Games", async () => {
      expect(await firstCardButtonPO.text.getText()).toEqual("NEW");
      expect(await firstCardButtonPO.iconContainer.isDisplayed()).toBe(true);
    });
  });
});

describe("Navigation cards Swimlane", () => {
  describe("When the user swipes to reveal the last gaming ribbon card", () => {
    beforeAll(async () => {
      await lastCardButtonPO.element.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilInViewport(lastCardButtonPO.element);
    });

    it("[PRPI-5183]The last Gaming Ribbon card should display the name - Slingo", async () => {
      expect(await lastCardButtonPO.text.getText()).toEqual("SLINGO");
      expect(await lastCardButtonPO.iconContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-5184]Scroll back to see the first card", async () => {
      await firstCardButtonPO.element.scrollIntoView();

      expect(await firstCardButtonPO.text.getText()).toEqual("NEW");
      expect(await firstCardButtonPO.iconContainer.isDisplayed()).toBe(true);
    });
  });
});

describe("New releases indicator", () => {
  describe("When user lands on gaming view with new games indicator", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_GAMING_NAVIGATION_LINKS_MOCK.urn));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_LINKS_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilDisplayed(firstCardButtonPO.element);
    });

    it("[PRPI-6561] And checks that the new games indicator displays the correct number", async () => {
      expect(await firstCardButtonPO.notificationCount.getText()).toBe(gameList.length.toString());
    });
  });

  describe("When user lands on gaming view with 1 new and 2 seen games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_GAMING_NAVIGATION_LINKS_MOCK.urn));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_LINKS_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.execute(
        (key, value) => localStorage.setItem(key, value),
        newestReleases,
        JSON.stringify(localStorageWithNewAndSeenGames),
      );
      await browser.waitUntilDisplayed(firstCardButtonPO.element);
      await browser.refresh();
    });

    it("[PRPI-6562] And verifies that the indicator shows only 1 new game", async () => {
      expect(await browser.execute((key) => localStorage.getItem(key), newestReleases)).toBe(
        JSON.stringify(localStorageWithNewAndSeenGames),
      );

      expect(await firstCardButtonPO.notificationCount.getText()).toBe("1");
    });

    describe("When user already has seen all games", () => {
      beforeAll(async () => {
        await browser.execute(
          (key, value) => localStorage.setItem(key, value),
          newestReleases,
          JSON.stringify(localStorageWithSeenGames),
        );
        await browser.refresh();
      });

      it("[PRPI-6563] Then verifies that the indicator is not displayed", async () => {
        expect(await browser.execute((key) => localStorage.getItem(key), newestReleases)).toBe(
          JSON.stringify(localStorageWithSeenGames),
        );

        expect(await firstCardButtonPO.notificationCount.isDisplayed()).toBe(false);
      });
    });
  });
});

describe("Favourites category", () => {
  describe("When user lands on gaming view with favourite games indicator", () => {
    beforeAll(async () => {
      await browser.execute(() => localStorage.clear());
      await mockService.mockHttpRequest(await getIndexHTML(BFF_GAMING_NAVIGATION_LINKS_MOCK.urn));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_LINKS_MOCK));
      await browser.url(routes.getGamingViewUrl("1"));
      await browser.execute(
        (key, value) => localStorage.setItem(key, value),
        favouriteGames,
        JSON.stringify(localStorageWithFavouritesAllUnseen),
      );
      await browser.waitUntilDisplayed(favouritesCardButtonPO.element);
    });

    it("[PRPI-6564] And favourite category card is displayed", async () => {
      expect(await favouritesCardButtonPO.text.getText()).toEqual("FAVOURITE GAMES");
      expect(await favouritesCardButtonPO.iconContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-6565] And checks that favourites games indicator displays the correct number", async () => {
      expect(await favouritesCardButtonPO.notificationCount.getText()).toBe(gameList.length.toString());
    });
  });

  describe("When user lands on gaming view with 1 new and 2 seen games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_GAMING_NAVIGATION_LINKS_MOCK.urn));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_LINKS_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.execute(
        (key, value) => localStorage.setItem(key, value),
        favouriteGames,
        JSON.stringify(localStorageWithFavouritesAndSeenGames),
      );
      await browser.waitUntilDisplayed(favouritesCardButtonPO.element);
      await browser.refresh();
    });

    it("[PRPI-6566] And checks that the favourites games indicator shows only 1 new game", async () => {
      expect(await browser.execute((key) => localStorage.getItem(key), favouriteGames)).toBe(
        JSON.stringify(localStorageWithFavouritesAndSeenGames),
      );
      expect(await favouritesCardButtonPO.notificationCount.getText()).toBe("1");
    });
  });

  describe("When user already has seen all games", () => {
    beforeAll(async () => {
      await browser.execute(
        (key, value) => localStorage.setItem(key, value),
        favouriteGames,
        JSON.stringify(localStorageWithFavouritesSeenGames),
      );
      await browser.refresh();
    });

    it("[PRPI-6567] And checks that the indicator is not displayed for favourite category", async () => {
      expect(await browser.execute((key) => localStorage.getItem(key), favouriteGames)).toBe(
        JSON.stringify(localStorageWithFavouritesSeenGames),
      );

      expect(await favouritesCardButtonPO.notificationCount.isDisplayed()).toBe(false);
    });
  });
});
