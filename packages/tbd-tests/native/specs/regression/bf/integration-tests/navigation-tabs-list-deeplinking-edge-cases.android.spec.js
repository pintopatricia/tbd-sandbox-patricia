const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const NavigationTabsListSO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.so");

const { CardSO, GenericScreenSO, HeaderSO, TabsGroupSO } = require("../../../../screen-objects");

const MockService = require("../../../../mock-essentials/mocking-service");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");
const { startApp, openUrl } = require("../../../../helpers/urls");

const mockService = new MockService();

const headerSO = new HeaderSO();
const genericScreenSO = new GenericScreenSO();

const navigationTabsListSO = new NavigationTabsListSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);

const tabsSO = new TabsGroupSO();
const thirdTabSO = new TabsGroupSO(tabsSO.tabButtons[2]);

const EVENT_ID = "29682729";

const CARD_MOCK_1 = {
  node: {
    __typename: "MarketCard",
    urn: "ppb:tbd:card:market:1.170259755:924.228826155",
    cardTitle: "Match Odds",
    displayRunners: {
      exchange: {
        market: {
          __typename: "ExchangeMarket",
          urn: "ppb:excMarket:1.170259755",
          hierarchy: {
            __typename: "EventHierarchy",
            sportevent: {
              urn: `ppb:event:${EVENT_ID}`,
            },
          },
        },
        runners: [{ runnerURN: "ppb:excRunner:1.170259755/0/0" }],
      },
    },
  },
};

const CARD_MOCK_2 = {
  node: {
    __typename: "MarketCard",
    cardTitle: "Correct Score",
    urn: "ppb:tbd:card:market:924.228826420",
    displayRunners: {
      sportsbook: {
        market: {
          __typename: "SportsbookMarket",
          urn: "ppb:sbkMarket:924.228826420",
          hierarchy: {
            __typename: "EventHierarchy",
            sportevent: {
              urn: `ppb:event:${EVENT_ID}`,
            },
          },
          runners: [
            {
              __typename: "Runner",
              runnerURN: "ppb:sbkRunner:924.228826420/1063100",
            },
          ],
        },
        runners: [{ runnerURN: "ppb:sbkRunner:924.228826420/1063100" }],
      },
    },
  },
};

const CARD_PARTIAL_1 = { node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:1.170259755:924.228826155" } };
const CARD_PARTIAL_2 = { node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:924.228826420" } };

const NAVIGATION_TAB_1_PARTIAL = {
  __typename: "NavigationTab",
  urn: `ppb:tbd:view:navigationTab:monday/e/${EVENT_ID}`,
  tabTitle: { translate: { key: "I18N.DATE.MONDAY" } },
  tabViewLink: {
    viewUrl: `football/whiskas/saquetas/e-${EVENT_ID}?tabId=monday#monday`,
    viewUrn: `ppb:tbd:view:event:${EVENT_ID}?=tabId=monday`,
  },
};
const NAVIGATION_TAB_2_PARTIAL = {
  __typename: "NavigationTab",
  urn: `ppb:tbd:view:navigationTab:tuesday/e/${EVENT_ID}`,
  tabTitle: { translate: { key: "I18N.DATE.TUESDAY" } },
  tabViewLink: {
    viewUrl: `football/whiskas/saquetas/e-${EVENT_ID}?tabId=tuesday#tuesday`,
    viewUrn: `ppb:tbd:view:event:${EVENT_ID}?=tabId=tuesday`,
  },
};
const NAVIGATION_TAB_3_PARTIAL = {
  __typename: "NavigationTab",
  urn: `ppb:tbd:view:navigationTab:wednesday/e/${EVENT_ID}`,
  tabTitle: { translate: { key: "I18N.DATE.WEDNESDAY" } },
  tabViewLink: {
    viewUrl: `football/whiskas/saquetas/e-${EVENT_ID}?tabId=wednesday#wednesday`,
    viewUrn: `ppb:tbd:view:event:${EVENT_ID}?=tabId=wednesday`,
  },
};

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: `ppb:tbd:card:navigationTabsList:ABCDEFGH/e/${EVENT_ID}?=tabId=tuesday`,
    tabsTitle: "All Football",
    full: {
      edges: [
        {
          node: {
            ...NAVIGATION_TAB_2_PARTIAL,
            full: { edges: [{ ...CARD_MOCK_1 }] },
            partials: {
              partialEdges: [{ ...CARD_PARTIAL_1 }],
            },
          },
        },
        {
          node: {
            ...NAVIGATION_TAB_3_PARTIAL,
            full: { edges: [{ ...CARD_MOCK_2 }] },
            partials: { partialEdges: [{ ...CARD_PARTIAL_2 }] },
          },
        },
      ],
    },
    partials: {
      edges: [
        { node: { ...NAVIGATION_TAB_1_PARTIAL } },
        { node: { ...NAVIGATION_TAB_2_PARTIAL } },
        { node: { ...NAVIGATION_TAB_3_PARTIAL } },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: {
    urn: `ppb:tbd:card:navigationTabsList:ABCDEFGH/e/${EVENT_ID}?=tabId=tuesday`,
    __typename: "NavigationTabsList",
  },
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  queryParams: "?=tabId=tuesday",
  url: `football/whiskas/saquetas/e-${EVENT_ID}`,
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

describe("Navigation Tabs List - Deeplinking Edge Cases", () => {
  describe("When the user enters a page with a Navigation Tabs List (the default tab is the second one)", () => {
    const urls = [
      `football/whiskas/saquetas/e-${EVENT_ID}`,
      `football/whiskas/saquetas/e-${EVENT_ID}?tabId=tuesday`,
      `football/whiskas/saquetas/e-${EVENT_ID}?tabId=tuesday`,
    ];

    const HOME_VIEW_LINKS = getStartViewLinks(urls);
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });
      await browser.waitUntilDisplayed(navigationTabsListSO.element);
      await browser.waitUntilEquals(firstCardSO.title, "Match Odds");
    });

    it("[PRPI-3060] The navigation tabs list should be displayed", async () => {
      expect(await navigationTabsListSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-3061] The second tab content should be displayed", async () => {
      expect(await firstCardSO.title.getText()).toBe("Match Odds");
    });

    describe("and clicks on the third tab and opens a deeplink for the second tab", () => {
      beforeAll(async () => {
        await thirdTabSO.element.click();
        await browser.waitUntilEquals(firstCardSO.title, "Correct Score");

        await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

        await browser.waitUntilEquals(firstCardSO.title, "Match Odds");
      });

      it("[PRPI-3062] The second tab content should be displayed", async () => {
        expect(await firstCardSO.title.getText()).toBe("Match Odds");
      });

      describe("and clicks again on the third tab, clicks on the back button and returns to the event view through deeplinking to the second tab", () => {
        beforeAll(async () => {
          await thirdTabSO.element.click();
          await browser.waitUntilEquals(firstCardSO.title, "Correct Score");

          await headerSO.backButton.click();
          await browser.waitUntilNotDisplayed(navigationTabsListSO.element);

          await openUrl(urls[2], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 2 });

          await browser.waitUntilEquals(firstCardSO.title, "Match Odds");
        });

        it("[PRPI-3063] The second tab content should be displayed", async () => {
          expect(await firstCardSO.title.getText()).toBe("Match Odds");
        });
      });
    });
  });
});
