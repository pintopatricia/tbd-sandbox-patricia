const { ScrollableSwimlanePO, HighlightedLinkCardPO } = require("../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { IconButtonPO } = require("../../../../page-objects");
const GamingRibbonCardPO = require("@ppb/tbd-shared/components/GamingRibbonCard/GamingRibbonCard.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const scrollableSwimlanePO = new ScrollableSwimlanePO();
const fourthNavigationLinkPO = new HighlightedLinkCardPO(scrollableSwimlanePO.highlightedLinkCards[3]);
const gamingRibbonCardPO = new GamingRibbonCardPO();
const favouriteGames = "favouritesNotifications_en-US";
const lastCardButtonPO = new IconButtonPO(gamingRibbonCardPO.items[7]);

const mockService = new MockService();
const MODULE_NAME = "gaming_navigation_links";

const localStorageWithFavouritesUnseenGames = {
  unseenCount: 3,
};
const localStorageWithFavouritesSeenGames = {
  unseenCount: 0,
};
const BFF_ONE_NAVIGATION_LINK_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:navigation/0",
        cardGroupTitle: "The World Of Casino",
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:1",
                __typename: "GamingLinkCard",
                link: {
                  icon: "New",
                  label: "New Slots",
                  viewLink: {},
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
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:navigation/0",
      },
    },
  ],
};

const BFF_GAMING_NAVIGATION_LINKS_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:navigation/0",
        cardGroupTitle: "The World Of Casino",
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:1",
                __typename: "GamingLinkCard",
                link: {
                  icon: "New",
                  label: "New Slots",
                  viewLink: {
                    viewUrn: "ppb:tbd:card:gamingCategory:slots",
                    viewUrl: routes.getGamingCategoryViewUrl("slots"),
                  },
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:2",
                __typename: "GamingLinkCard",
                link: {
                  icon: "Live",
                  label: "Live Table Game",
                  viewLink: {},
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:3",
                __typename: "GamingLinkCard",
                link: {
                  label: "Daily Jackpot",
                  viewLink: {},
                },
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:4",
                __typename: "GamingLinkCard",
                link: {
                  icon: "Blackjack",
                  label: "Very Very Long Name Navigation Link",
                  viewLink: {},
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
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:navigation/0",
      },
    },
  ],
};

const BFF_GAMING_NAVIGATION_MOCK = {
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
                games: [],
                link: {
                  icon: "All Games",
                  label: "All Games",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:gamingCategory:slots",
                    viewUrl: "casino/c/null/gc-null",
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
            {
              node: {
                urn: "ppb:tbd:card:gamingLink:8",
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

describe("Gaming Navigation Links", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_ONE_NAVIGATION_LINK_MOCK.urn, { disableCSSAnimations: true }),
    );
  });

  describe("When user lands on gaming view and just one navigation link is available", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGamingLayout(BFF_ONE_NAVIGATION_LINK_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1327]_the_navigation_link_card_should_fit_the_swimlane_width`,
      );
    });

    it("[PRPI-1327]_the_navigation_link_card_should_fit_the_swimlane_width", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1327]_the_navigation_link_card_should_fit_the_swimlane_width`),
      ).toEqual(0);
    });
  });

  describe("When user lands on gaming view with a navigation links swimlane", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_LINKS_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1328]_should_display_first_and_second_navigation_links`);
    });

    it("[PRPI-1328]_should_display_first_and_second_navigation_links", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1328]_should_display_first_and_second_navigation_links`),
      ).toEqual(0);
    });

    describe("Then the user scrolls to the 4th navigation link", () => {
      beforeAll(async () => {
        await fourthNavigationLinkPO.element.scrollIntoView();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1329]_should_display_third_and_fourth_navigation_links`,
        );
      });

      it("[PRPI-1329]_should_display_third_and_fourth_navigation_links", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1329]_should_display_third_and_fourth_navigation_links`),
        ).toEqual(0);
      });
    });
  });

  describe("When user lands on gaming view with a navigation links that has type Categories", () => {
    beforeAll(async () => {
      await getIndexHTML(BFF_GAMING_NAVIGATION_MOCK.urn, { disableCSSAnimations: true });
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1330]_should_display_the_top_five_navigation_links`);
    });

    it("[PRPI-1330]_should_display_the_top_five_navigation_links", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1330]_should_display_the_top_five_navigation_links`),
      ).toEqual(0);
    });
  });

  describe("Then the user scrolls to the Favourites category and three unseen games are displayed", () => {
    beforeAll(async () => {
      await getIndexHTML(BFF_GAMING_NAVIGATION_MOCK.urn, { disableCSSAnimations: true });
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);

      await browser.execute(
        (key, value) => localStorage.setItem(key, value),
        favouriteGames,
        JSON.stringify(localStorageWithFavouritesUnseenGames),
      );
      await lastCardButtonPO.element.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(lastCardButtonPO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1331]_should_display_three_games_unseen_on_favourites`);
    });

    it("[PRPI-1331]_should_display_three_games_unseen_on_favourites", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1331]_should_display_three_games_unseen_on_favourites`),
      ).toEqual(0);
    });
  });

  describe("Then the user scrolls to the Favourites category and no unseen games are displayed", () => {
    beforeAll(async () => {
      await getIndexHTML(BFF_GAMING_NAVIGATION_MOCK.urn, { disableCSSAnimations: true });
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_NAVIGATION_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);

      await browser.execute(
        (key, value) => localStorage.setItem(key, value),
        favouriteGames,
        JSON.stringify(localStorageWithFavouritesSeenGames),
      );
      await lastCardButtonPO.element.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(lastCardButtonPO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1332]_should_display_no_games_unseen_on_favourites`);
    });

    it("[PRPI-1332]_should_display_no_games_unseen_on_favourites", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1332]_should_display_no_games_unseen_on_favourites`),
      ).toEqual(0);
    });
  });
});
