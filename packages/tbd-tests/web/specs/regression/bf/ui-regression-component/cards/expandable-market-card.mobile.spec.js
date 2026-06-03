const { getGenericLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const { CardPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const navigationTabsListPO = new NavigationTabsListPO();
const firstExpandableMarketCardPO = new CardPO(navigationTabsListPO.tabItems[0]);
const secondExpandableMarketCardPO = new CardPO(navigationTabsListPO.tabItems[1]);

const mockService = new MockService();

const EVENT_ID = "29682729";

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
    tabsTitle: null,
    full: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##allmarkets##",
            tabTitle: {
              translated: "All Markets",
            },
            full: {
              edges: [
                {
                  node: {
                    __typename: "ExpandableMarketCard",
                    urn: "ppb:tbd:card:expandableMarket:1.1;924.1|0|false|false",
                    title: "Match Odds",
                    marketCardURN: "ppb:tbd:card:market:1.1;924.1|0|false|false",
                  },
                },
                {
                  node: {
                    __typename: "ExpandableMarketCard",
                    urn: "ppb:tbd:card:expandableMarket:1.2;924.2|0|false|false",
                    title: "Correct Score",
                    marketCardURN: "ppb:tbd:card:market:1.2;924.2|0|false|false",
                  },
                },
              ],
            },
            partials: {
              partialEdges: [
                {
                  node: {
                    __typename: "ExpandableMarketCard",
                    urn: "ppb:tbd:card:expandableMarket:1.1;924.1|0|false|false",
                  },
                },
                {
                  node: {
                    __typename: "ExpandableMarketCard",
                    urn: "ppb:tbd:card:expandableMarket:1.2;924.2|0|false|false",
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
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##allmarkets##",
            tabTitle: {
              translated: "All Markets",
            },
          },
        },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: {
    urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
    __typename: "NavigationTabsList",
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

const BFF_CARDS_MOCK = {
  cards: [
    {
      __typename: "MarketCard",
      urn: "ppb:tbd:card:market:1.1;924.1|0|false|false",
      title: "Match Odds",
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.1",
            hierarchy: {
              __typename: "EventHierarchy",
              sportevent: {
                name: "Wolves v Man Utd",
                urn: `ppb:event:${EVENT_ID}`,
              },
            },
            runners: [
              {
                runnerURN: "ppb:excRunner:1.1/1/0",
                selectionId: 1,
                name: "Wolves",
              },
            ],
          },
          runners: [{ runnerURN: "ppb:excRunner:1.1/1/0" }],
        },
      },
    },
  ],
};

describe("Expandable market card", () => {
  describe("When the user is on a generic view with expandable market cards", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
      await browser.url(routes.getGenericViewUrl("home"));
      await browser.waitUntilDisplayed(firstExpandableMarketCardPO.element);
    });

    it("[PRPI-5666] The expandable market cards should be collapsed and no market cards should be displayed", async () => {
      expect(await firstExpandableMarketCardPO.content.isDisplayed()).toBe(false);
      expect(await secondExpandableMarketCardPO.content.isDisplayed()).toBe(false);
    });

    it("[PRPI-5667] The 1st expandable market card title should be Match Odds", async () => {
      expect(await firstExpandableMarketCardPO.title.getText()).toBe("Match Odds");
    });

    describe("When the user clicks on first expandable market card", () => {
      beforeAll(async () => {
        await firstExpandableMarketCardPO.headerWrapper.waitForClickable();
        await firstExpandableMarketCardPO.headerWrapper.click();
        await browser.waitUntilDisplayed(firstExpandableMarketCardPO.content);
      });

      it("[PRPI-5668] The market card should be displayed on the first expandable market card", async () => {
        expect(await firstExpandableMarketCardPO.content.isDisplayed()).toBe(true);
        expect(await secondExpandableMarketCardPO.content.isDisplayed()).toBe(false);
      });

      it("[PRPI-5669] The market card title should not be visible", async () => {
        const firstMarketCardPO = new CardPO(firstExpandableMarketCardPO.content);

        expect(await firstMarketCardPO.title.isDisplayed()).toBe(false);
        expect(await firstMarketCardPO.content.isDisplayed()).toBe(true);
      });

      describe("When the user click again on first expandable market card", () => {
        beforeAll(async () => {
          await firstExpandableMarketCardPO.headerWrapper.waitForClickable();
          await firstExpandableMarketCardPO.headerWrapper.click();
          await browser.waitUntilNotDisplayed(firstExpandableMarketCardPO.content);
        });

        it("[PRPI-5670] The market card should not be displayed anymore", async () => {
          expect(await firstExpandableMarketCardPO.content.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
