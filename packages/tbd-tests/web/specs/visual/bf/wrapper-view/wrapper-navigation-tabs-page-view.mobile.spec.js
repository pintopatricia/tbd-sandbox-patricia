const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const MODULE_NAME = "wrapper";

const EVENT_ID = "296827291";

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
    urn: "ppb:tbd:card:market:924.2288264201",
    displayRunners: {
      sportsbook: {
        market: {
          __typename: "SportsbookMarket",
          urn: "ppb:sbkMarket:924.2288264201",
          hierarchy: {
            __typename: "EventHierarchy",
            sportevent: {
              urn: `ppb:event:${EVENT_ID}`,
            },
          },
          runners: [
            {
              __typename: "Runner",
              runnerURN: "ppb:sbkRunner:924.2288264201/1063100",
            },
          ],
        },
        runners: [{ runnerURN: "ppb:sbkRunner:924.2288264201/1063100" }],
      },
    },
  },
};

const CARD_PARTIAL_1 = { node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:1.170259755:924.228826155" } };
const CARD_PARTIAL_2 = { node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:924.228826435" } };
const CARD_PARTIAL_3 = { node: { __typename: "MarketCard", urn: "ppb:tbd:card:market:924.2288264201" } };

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

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: { urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##", __typename: "NavigationTabsList" },
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  title: "Navigation Tabs Test",
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

describe("When user opens a page with navigation tabs in a wrapper", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        clientContext: {
          platform: "android",
          uiVariant: "mobile",
          wrapper: {
            wrapperName: "GamingWrapper",
            bridgeAPIVersion: "1.0.0",
          },
          webWrappedExperience: true,
        },
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1593]_Wrapper_page_with_navigation_tabs_is_displayed`);
  });

  it("[PRPI-1593]_Wrapper_page_with_navigation_tabs_is_displayed", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1593]_Wrapper_page_with_navigation_tabs_is_displayed`)).toBe(
      0,
    );
  });
});
