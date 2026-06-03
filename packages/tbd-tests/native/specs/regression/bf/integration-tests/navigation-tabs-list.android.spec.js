const NavigationTabsSO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.so");

const {
  getEventLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeLeftElement, swipeUp, swipeDown, swipeToBottom } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp, openUrl } = require("../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");

const { GenericScreenSO, CardSO, TabsGroupSO, FooterSO } = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);
const navigationTabsSO = new NavigationTabsSO();
const tabsSO = new TabsGroupSO();
const footerSO = new FooterSO();

const secondTabSO = new TabsGroupSO(tabsSO.tabButtons[1]);
const fifthTabSO = new TabsGroupSO(tabsSO.tabButtons[4]);

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
    urn: "ppb:tbd:card:market:924.228826435",
    cardTitle: "Over/Under Total Goals 0.5",
    displayRunners: {
      sportsbook: {
        market: {
          __typename: "SportsbookMarket",
          urn: "ppb:sbkMarket:924.228826435",
          hierarchy: {
            __typename: "EventHierarchy",
            sportevent: {
              urn: `ppb:event:${EVENT_ID}`,
            },
          },
        },
        runners: [{ runnerURN: "ppb:sbkRunner:924.228826435/5851483" }],
      },
    },
  },
};

const CARD_MOCK_3 = {
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
const CARD_PARTIAL_2 = { node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:924.228826435" } };
const CARD_PARTIAL_3 = { node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:924.228826420" } };

const NAVIGATION_TAB_1_PARTIAL = {
  __typename: "NavigationTab",
  urn: "ppb:tbd:view:navigationTab:##monday##",
  tabTitle: { translate: { key: "I18N.DATE.MONDAY" } },
};

const NAVIGATION_TAB_2_PARTIAL = {
  __typename: "NavigationTab",
  urn: "ppb:tbd:view:navigationTab:##tuesday##",
  tabTitle: { translate: { key: "I18N.DATE.TUESDAY" } },
};
const NAVIGATION_TAB_3_PARTIAL = {
  __typename: "NavigationTab",
  urn: "ppb:tbd:view:navigationTab:##wednesday##",
  tabTitle: { translate: { key: "I18N.DATE.WEDNESDAY" } },
};
const NAVIGATION_TAB_4_PARTIAL = {
  __typename: "NavigationTab",
  urn: "ppb:tbd:view:navigationTab:##thursday##",
  tabTitle: { translate: { key: "I18N.DATE.THURSDAY" } },
};
const NAVIGATION_TAB_5_PARTIAL = {
  __typename: "NavigationTab",
  urn: "ppb:tbd:view:navigationTab:##friday##",
  tabTitle: { translate: { key: "I18N.DATE.FRIDAY" } },
};

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
    tabsTitle: "All Football",
    full: {
      edges: [
        {
          node: {
            ...NAVIGATION_TAB_1_PARTIAL,
            full: { edges: [{ ...CARD_MOCK_1 }, { ...CARD_MOCK_2 }, { ...CARD_MOCK_3 }] },
            partials: {
              partialEdges: [{ ...CARD_PARTIAL_1 }, { ...CARD_PARTIAL_2 }, { ...CARD_PARTIAL_3 }],
            },
          },
        },
        {
          node: {
            ...NAVIGATION_TAB_5_PARTIAL,
            full: { edges: [{ ...CARD_MOCK_3 }] },
            partials: { partialEdges: [{ ...CARD_PARTIAL_3 }] },
          },
        },
      ],
    },
    partials: {
      edges: [
        { node: { ...NAVIGATION_TAB_1_PARTIAL } },
        { node: { ...NAVIGATION_TAB_2_PARTIAL } },
        { node: { ...NAVIGATION_TAB_3_PARTIAL } },
        { node: { ...NAVIGATION_TAB_4_PARTIAL } },
        { node: { ...NAVIGATION_TAB_5_PARTIAL } },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_LAST_MOCK = {
  ...NAVIGATION_TABS_LIST_MOCK,
  node: {
    ...NAVIGATION_TABS_LIST_MOCK.node,
    selectedTabUrn: "ppb:tbd:view:navigationTab:##friday##",
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: { urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##", __typename: "NavigationTabsList" },
};

const FOOTER_NODE = {
  node: {
    urn: "ppb:tbd:card:regulatory:footer",
    __typename: "RegulatoryCard",
  },
  __typename: "ViewItemEdge",
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  title: "Navigation Tabs Test",
  edges: [
    NAVIGATION_TABS_LIST_MOCK,
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
            title: "title",
            items: [
              {
                __typename: "RegulatoryLoggedInSinceItem",
                alignment: "LEFT",
                loggedInSinceText: "Some Logged In Text",
                timeFormat: "HH:mm",
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL, FOOTER_NODE],
};

const BFF_MOCK_LAST = {
  ...BFF_MOCK,
  edges: [NAVIGATION_TABS_LIST_LAST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

const BFF_NAVIGATION_MOCK = {
  cards: [
    {
      ...NAVIGATION_TAB_2_PARTIAL,
      full: { edges: [{ ...CARD_MOCK_2 }] },
      partials: { partialEdges: [{ ...CARD_PARTIAL_2 }] },
    },
  ],
};

describe("Navigation Tabs List", () => {
  const urls = [
    `football/whiskas/saquetas/e-${EVENT_ID}`,
    `football/whiskas/saquetas/e-${EVENT_ID}`,
    `football/whiskas/saquetas/e-${EVENT_ID}`,
  ];

  const HOME_VIEW_LINKS = getStartViewLinks(urls);
  describe("When the default tab is the first one", () => {
    describe("When user enters an event view containing Tabs", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });
        await browser.waitUntilDisplayed(navigationTabsSO.element);
        await browser.waitUntilEquals(thirdCardSO.title, "Correct Score");
      });

      it("[PRPI-3064] The navigation tab list should be displayed", async () => {
        expect(await navigationTabsSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-3065] The number of cards rendered should be 3", async () => {
        expect(await genericScreenSO.cards.length).toBe(3);
      });

      it("[PRPI-3066] The first card title should be 'Match Odds'", async () => {
        expect(await firstCardSO.title.getText()).toBe("Match Odds");
      });
    });

    describe("When user scrolls down to reveal more content", () => {
      beforeEach(async () => {
        await swipeUp(0.5);
        await browser.waitUntilEquals(thirdCardSO.title, "Correct Score");
      });

      it("[PRPI-3067] The loaded content should be rendered in page", async () => {
        expect(await thirdCardSO.title.getText()).toBe("Correct Score");
      });

      it("[PRPI-8681] No extra space should exist between the last card and the footer", async () => {
        await browser.waitUntilDisplayed(thirdCardSO.element);
        await browser.waitUntilDisplayed(footerSO.element);
        await swipeToBottom();

        const lastCardLocation = await thirdCardSO.element.getLocation();
        const lastCardSize = await thirdCardSO.element.getSize();
        const lastCardBottom = lastCardLocation.y + lastCardSize.height;

        const footerLocation = await footerSO.element.getLocation();
        const footerTop = footerLocation.y;

        const spacing = footerTop - lastCardBottom;
        const tolerance = Math.max(40, lastCardSize.height * 0.1);

        expect(spacing).toBeLessThanOrEqual(tolerance);
      });
    });

    describe("When user taps on the second tab", () => {
      beforeEach(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_NAVIGATION_MOCK));
        await swipeDown(0.5);
        await browser.waitUntilDisplayed(secondTabSO.element);
        await secondTabSO.element.click();
        await browser.waitUntilEquals(firstCardSO.title, "Over/Under Total Goals 0.5");
      });

      it("[PRPI-3068] \u200BThe second tab content should be displayed", async () => {
        expect(await firstCardSO.title.getText()).toBe("Over/Under Total Goals 0.5");
      });
    });

    describe("When user scrolls until last tab", () => {
      beforeEach(async () => {
        await swipeLeftElement(secondTabSO.element);
        await browser.waitUntilDisplayed(fifthTabSO.element);
        await fifthTabSO.element.click();
        await browser.waitUntilEquals(firstCardSO.title, "Correct Score");
      });

      it("[PRPI-3069] The fourth tab should be displayed", async () => {
        expect(await fifthTabSO.element.isDisplayed()).toBe(true);
        expect(await firstCardSO.title.getText()).toBe("Correct Score");
      });
    });

    describe("When the user navigates to another page and returns to event view containing tabs", () => {
      beforeEach(async () => {
        await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });
        await browser.waitUntilDisplayed(fifthTabSO.element);
        await browser.waitUntilEquals(firstCardSO.title, "Correct Score");
      });

      it("[PRPI-3070] The last tab should still be selected", async () => {
        expect(await fifthTabSO.element.isDisplayed()).toBe(true);
        expect(await firstCardSO.title.getText()).toBe("Correct Score");
      });
    });
  });

  /*
    This feature never worked since `navigation-tab-list-normalizer.ts`
    has never contemplated the selectedTabUrn from BFF, forcing always the first tab
  */
  describe("When the default tab is the last one", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_LAST));

      await openUrl(urls[2], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 2 });
      await browser.waitUntilDisplayed(navigationTabsSO.element);
      await browser.waitUntilEquals(firstCardSO.title, "Correct Score");
    });

    it("[PRPI-3071] The navigation tab list should be displayed", async () => {
      expect(await navigationTabsSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-3072] The number of cards rendered should be 1", async () => {
      expect(await genericScreenSO.cards.length).toBe(1);
    });

    it("[PRPI-3073] The first card title should be 'Correct Score'", async () => {
      expect(await firstCardSO.title.getText()).toBe("Correct Score");
    });
  });
});
