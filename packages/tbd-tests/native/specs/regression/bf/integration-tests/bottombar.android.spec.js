const QuickLinksCardSO = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.native.so");
const {
  getMyBetsLayout,
  getEventLayout,
  getBrowseLayout,
  getSportsLayout,
  getGenericLayout,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { swipeUp } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");

const {
  GenericScreenSO,
  BottomBarSO,
  BrowseScreenSO,
  CardSO,
  QuickLinkSO,
  ScrollableSwimlaneSO,
  StateIndicatorSO,
  MyBetsHeaderSO,
  HeaderSO,
} = require("../../../../screen-objects");
const { HEADER_ITEMS_MOCK, GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const browseScreenSO = new BrowseScreenSO();
const myBetsHeaderSO = new MyBetsHeaderSO();
const cardSO = new CardSO();
const quickLinkCardSO = new QuickLinksCardSO();
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const headerSO = new HeaderSO();
const stateIndicatorSO = new StateIndicatorSO();

const eventQuickLink = new QuickLinkSO(quickLinkCardSO.links[0]);
const sportQuickLink = new QuickLinkSO(quickLinkCardSO.links[1]);

const EVENT_ID = "29682729";
const MARKET_ID = "1.160337355";
const SPORTSBOOK_MARKET_ID = "924.222615412";

const BOTTOM_BAR = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/b-sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: "mybets/mybets-open",
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
    {
      tileType: "PROMOTIONS",
      viewLink: {
        viewUrn: "ppb:tbd:view:external:external",
        viewUrl: "https://www.betfair.com/promotions/offers",
        viewDisplayMode: "BLANK_WEBVIEW",
      },
    },
  ],
};

const BFF_HOMEPAGE_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "/view/d-home",
  title: "Awesome Homepage",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:random:1",
        links: [
          {
            label: "Event Link",
            viewLink: {
              viewUrl: `sport/competition/event/e-${EVENT_ID}`,
              viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
            },
          },
          {
            label: "Sport Link",
            viewLink: {
              viewUrl: `sport/s-1`,
              viewUrn: `ppb:tbd:view:sport:1`,
            },
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:random:1",
      },
    },
  ],

  bottomBar: BOTTOM_BAR,
};

const BFF_EVENT_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  name: "Wolves",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                },
              ],
            },
            runners: [
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
              },
            ],
          },
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
                  selectionId: 48044,
                  name: "Wolves",
                },
              ],
            },
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/48044`,
              },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

const BFF_BROWSE_MOCK = {
  __typename: "BrowseView",
  urn: "ppb:tbd:view:browse:sports",
  url: "browse/b-sports",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
        links: [
          {
            label: "Football",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/s-1",
            },
            target: null,
            icon: null,
          },
        ],
      },
    },
  ],
};

const BFF_BROWSE_GAMING_MOCK = {
  urn: "ppb:tbd:view:browse:gaming",
  url: "browse/b-gaming",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:azMenu:gaming",
        quickLinksTitle: null,
        links: [],
      },
    },
  ],
};

const BFF_SPORT_MOCK = {
  urn: `ppb:tbd:view:sport:1`,
  title: "Football",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                title: "Match Odds Exchange",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Wolves v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:1111`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [],
                    },
                    runners: [],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const BFF_MY_BETS_MOCK = {
  __typename: "MyBetsView",
  urn: "ppb:tbd:view:myBets:open",
  filters: {
    orderType: {
      items: ["OPEN", "SETTLED"],
      defaultIndex: 0,
    },
    productType: {
      items: ["EXCHANGE", "SPORTSBOOK"],
      defaultIndex: 0,
    },
  },
  edges: [],
  bottomBar: BOTTOM_BAR,
  headerItems: HEADER_ITEMS_MOCK,
};

describe("Navigation - Bottom Bar", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest({ ...getGenericLayout(BFF_HOMEPAGE_MOCK), delay: 4 });
    await startApp("home");
    await browser.waitUntilDisplayed(stateIndicatorSO.title);
  });

  describe("When the user is at Home Screen And BFF still not retrieve Bottom Bar", () => {
    afterAll(async () => {
      await browser.waitUntilEquals(genericScreenSO.title, "Awesome Homepage");
    });

    it("[PRPI-2812] StateIndicator Title should be visible with correct text", async () => {
      expect(await stateIndicatorSO.title.isDisplayed()).toBe(true);
      expect(await stateIndicatorSO.title.getText()).toBe("Loading Your Experience");
    });

    it("[PRPI-2813] StateIndicator Subitle should be visible with correct text", async () => {
      expect(await stateIndicatorSO.subtitle.isDisplayed()).toBe(true);
      expect(await stateIndicatorSO.subtitle.getText()).toBe("Getting odds and events...");
    });

    it("[PRPI-2814] StateIndicator Spinner should be visible", async () => {
      expect(await stateIndicatorSO.spinner.isDisplayed()).toBe(true);
    });
  });

  describe("When the user is at Home Screen And BFF is retrieving 5 tiles for Bottom Bar ordered as: Home, Browse, My Bets, Casino, Promotions", () => {
    it("[PRPI-3867] The 'Home' tile should be visible", async () => {
      expect(await BottomBarSO.home.isDisplayed()).toBe(true);
    });

    it("[PRPI-3868] The 'Browse' tile should be visible", async () => {
      expect(await BottomBarSO.browse.isDisplayed()).toBe(true);
    });

    it("[PRPI-3869] The 'My Bets' tile should be visible", async () => {
      expect(await BottomBarSO.myBets.isDisplayed()).toBe(true);
    });

    it("[PRPI-3870] The 'Casino' tile should be visible", async () => {
      expect(await BottomBarSO.gaming.isDisplayed()).toBe(true);
    });

    it("[PRPI-3983] The 'Promotions' tile should be visible", async () => {
      expect(await BottomBarSO.promotions.isDisplayed()).toBe(true);
    });

    describe("When the user taps to navigate to a given Event screen", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_MOCK));
        await browser.waitUntilClickableNative(eventQuickLink.element);
        await eventQuickLink.element.click();

        await browser.waitUntilEquals(cardSO.title, "Match Odds");
      });

      it("[PRPI-3871] The event screen should be displayed", async () => {
        expect(await cardSO.title.getText()).toBe("Match Odds");
      });

      it("[PRPI-3872] The back button should be available", async () => {
        expect(await headerSO.backButton.isDisplayed()).toBe(true);
      });
    });

    describe("When the user taps the back button", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(headerSO.backButton);
        await headerSO.backButton.click();

        await browser.waitUntilEquals(eventQuickLink.label, "Event Link");
      });

      it("[PRPI-3873] The home screen should be displayed", async () => {
        expect(await genericScreenSO.title.getText()).toBe("Awesome Homepage");
      });

      it("[PRPI-3874] The back button should not be displayed", async () => {
        expect(await headerSO.backButton.isDisplayed()).toBe(false);
      });
    });

    describe("When the user navigates to event screen and taps on Browse tab bar", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_MOCK));
        await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_GAMING_MOCK));
        await browser.waitUntilClickableNative(eventQuickLink.element);
        await eventQuickLink.element.click();

        await browser.waitUntilEquals(cardSO.title, "Match Odds");
        await BottomBarSO.browse.click();

        await browser.waitUntilEquals(browseScreenSO.title, "Browse");
      });

      it("[PRPI-3875] The Browse screen should be displayed", async () => {
        expect(await browseScreenSO.title.getText()).toContain("Browse");
      });

      it("[PRPI-3875] The back button should not be displayed", async () => {
        expect(await headerSO.backButton.isDisplayed()).toBe(false);
      });
    });

    describe("When the user navigates to sports screen in the given tab", () => {
      beforeAll(async () => {
        await BottomBarSO.home.click();

        await browser.waitUntilEquals(cardSO.title, "Match Odds");
        await browser.waitUntilClickableNative(headerSO.backButton);
        await headerSO.backButton.click();

        await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_MOCK));
        await browser.waitUntilClickableNative(sportQuickLink.element);
        await sportQuickLink.element.click();

        await browser.waitUntilEquals(scrollableSwimlaneSO.title, "First Card");
      });

      it("[PRPI-3876] The Sport screen should be displayed", async () => {
        expect(await genericScreenSO.title.getText()).toBe("Football");
      });

      it("[PRPI-3877] The back button should be displayed", async () => {
        expect(await headerSO.backButton.isDisplayed()).toBe(true);
      });
    });

    describe("When the user taps Home in bottom bar again", () => {
      beforeAll(async () => {
        await BottomBarSO.home.click();

        await browser.waitUntilEquals(eventQuickLink.label, "Event Link");
      });

      it("[PRPI-3878] The Home screen should be displayed", async () => {
        expect(await genericScreenSO.title.getText()).toBe("Awesome Homepage");
      });

      it("[PRPI-3879] The back button should not be displayed", async () => {
        expect(await headerSO.backButton.isDisplayed()).toBe(false);
      });
    });

    describe("When the user scrolls down and taps home again", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(genericScreenSO.element);
        await swipeUp(0.5);
        await BottomBarSO.home.click();

        await browser.waitUntilDisplayed(genericScreenSO.title);
      });

      it("[PRPI-3880] The Home screen should be shown in top position", async () => {
        expect(await genericScreenSO.title.isDisplayed()).toBe(true);
      });
    });

    describe("When the user taps on 'My Bets' tab bar", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMyBetsLayout(BFF_MY_BETS_MOCK));
        await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
        await BottomBarSO.myBets.click();

        await browser.waitUntilEquals(myBetsHeaderSO.title, "My Bets");
      });

      it("[PRPI-3881] The My Bets screen should be shown\u200B\u200B", async () => {
        expect(await myBetsHeaderSO.title.getText()).toBe("My Bets");
      });
    });

    describe("When the user taps on 'Promotions' tab bar", () => {
      beforeAll(async () => {
        await BottomBarSO.promotions.click();
      });

      // At this point we can only validate that we're on a webview but was impossible to verify any element
      it("[PRPI-3984] The Promotions page should be shown", async () => {
        await browser.waitUntil(
          async () => {
            const contexts = await driver.getContexts();
            return contexts.length > 1;
          },
          {
            timeout: 8000,
            timeoutMsg: "Get context is smaller than 2",
          },
        );
        const contexts = await driver.getContexts();

        expect(contexts.length).toBeGreaterThan(1);

        const webviewContext = contexts.find((context) => context.includes("WEBVIEW"));

        expect(webviewContext).toBeDefined();
      });
    });
  });
});
