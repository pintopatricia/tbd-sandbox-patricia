const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const {
  getAppContext,
  getEventLayout,
  getMarketLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp, openHomeViewLink } = require("../../../../helpers/urls");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { BottomBarSO, GenericScreenSO, PebbleListSO, PrimaryButtonSO } = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const primaryButtonSO = new PrimaryButtonSO();
const pebbleListSO = new PebbleListSO();

const EVENT_ID = "29359895";
const EXCHANGE_MATCH_ODDS_MARKET_ID = "1.123456789";
const EXCHANGE_OVER_UNDER_15_MARKET_ID = "1.173614168";

const CASHOUT_QUOTE = {
  urn: `ppb:excCashoutQuote:${EXCHANGE_MATCH_ODDS_MARKET_ID}/0`,
  marketURN: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  value: 1.98,
  profit: -0.02,
  currentLiability: 2,
  status: "AVAILABLE",
};

const EXCHANGE_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  runners: [
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/55190/0`,
      selectionId: 55190,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/48224/0`,
      selectionId: 48224,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/58805/0`,
      selectionId: 58805,
    },
  ],

  liveData: {
    cashoutQuotes: [CASHOUT_QUOTE],
  },
};

const EXCHANGE_OVER_UNDER_15_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_OVER_UNDER_15_MARKET_ID}`,
  name: "Over/Under 1.5 Goals",
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  marketType: "OVER_UNDER_15",
  bettingType: "ODDS",
  runners: [
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_OVER_UNDER_15_MARKET_ID}/55190/0`,
      selectionId: 55190,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_OVER_UNDER_15_MARKET_ID}/48224/0`,
      selectionId: 48224,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_OVER_UNDER_15_MARKET_ID}/58805/0`,
      selectionId: 58805,
    },
  ],
};

const PEBBLE_CARD_GROUP = {
  node: {
    __typename: "PebbleCardGroup",
    urn: `ppb:tbd:card:pebbleMarkets:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
    pebbleCardGroupTitle: { translated: "Over/Under Goals" },
    selectedItemUrn: `ppb:tbd:card:marketExtended:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
    full: {
      edges: [
        {
          name: "0.5",
          node: {
            __typename: "MarketExtendedCard",
            urn: `ppb:tbd:card:marketExtended:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
            displayRunners: {
              exchange: {
                market: EXCHANGE_MARKET,
                runners: [
                  { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/55190/0` },
                  { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/48224/0` },
                  { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/58805/0` },
                ],
              },
            },
          },
        },
        {
          name: "1.5",
          node: {
            __typename: "MarketExtendedCard",
            urn: `ppb:tbd:card:marketExtended:${EXCHANGE_OVER_UNDER_15_MARKET_ID}`,
            displayRunners: {
              exchange: {
                market: EXCHANGE_OVER_UNDER_15_MARKET,
                runners: [
                  { runnerURN: `ppb:excRunner:${EXCHANGE_OVER_UNDER_15_MARKET_ID}/55190/0` },
                  { runnerURN: `ppb:excRunner:${EXCHANGE_OVER_UNDER_15_MARKET_ID}/48224/0` },
                  { runnerURN: `ppb:excRunner:${EXCHANGE_OVER_UNDER_15_MARKET_ID}/58805/0` },
                ],
              },
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          name: "0.5",
          node: {
            __typename: "MarketExtendedCard",
            urn: `ppb:tbd:card:marketExtended:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
          },
        },
        {
          name: "1.5",
          node: {
            __typename: "MarketExtendedCard",
            urn: `ppb:tbd:card:marketExtended:${EXCHANGE_OVER_UNDER_15_MARKET_ID}`,
          },
        },
      ],
    },
  },
};

const FIXTURE = {
  node: {
    __typename: "FixtureCard",
    urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
    sportevent: { urn: `ppb:event:${EVENT_ID}` },
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      home: { name: "Man Utd" },
      away: { name: "Wolves" },
    },
  },
};

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET,
  edges: [FIXTURE, PEBBLE_CARD_GROUP],
};

const ERO_RUNNERS_MOCK = [
  {
    selectionId: "55190",
    availableToBack: [{ price: 2.5, size: 100 }],
    availableToLay: [{ price: 5.8, size: 110 }],
  },
  {
    selectionId: "48224",
    availableToBack: [{ price: 3.5, size: 100 }],
    availableToLay: [{ price: 6.8, size: 110 }],
  },
  {
    selectionId: "58805",
    availableToBack: [{ price: 1.5, size: 100 }],
    availableToLay: [{ price: 1.8, size: 110 }],
  },
];

const MATCH_ODDS_ERO_MOCK = [
  {
    marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

const POSITION_VIEWS = {
  marketPositions: [
    {
      marketId: `${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
      selections: [
        {
          selectionId: "55190",
          orders: [
            {
              marketId: `${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
              selectionId: "55190",
              betId: "1:11111111111",
              price: 6,
              size: 3,
              averagePriceMatched: 6,
              sizeMatched: 3,
              sizeRemaining: 0,
              status: "EXECUTION_COMPLETE",
            },
          ],
        },
        {
          selectionId: "48224",
          orders: [
            {
              marketId: `${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
              selectionId: "48224",
              betId: "2:22222222222",
              price: 2.5,
              size: 2,
              averagePriceMatched: 2.5,
              sizeMatched: 2,
              sizeRemaining: 0,
              status: "EXECUTION_COMPLETE",
            },
          ],
        },
      ],
    },
  ],
};

const CASHOUT_QUOTE_MOCK = [
  {
    marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
    value: 1.98,
    currentLiability: 2,
    profit: -0.02,
    minPartialPercentage: 5,
    maxPartialPercentage: 100,
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
  },
];

const CASHOUT_QUOTE_UNAVAILABLE_MOCK = [
  {
    marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
    status: "UNAVAILABLE",
  },
];

const BFF_EVENT_VIEW_MOCK = {
  __typename: "EventView",
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: parseInt(EVENT_ID),
    name: "Man Utd v Wolves",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture##${EVENT_ID}`,
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: { name: "Man Utd", color: "f9f9fa" },
          away: { name: "Wolves", color: "050b5c" },
          scheduledAt: "2021-02-17T20:00Z",
          duration: {},
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture##${EVENT_ID}`,
      },
    },
  ],
};

const MARKET_URL = `sport/competition/event/market/m-${EXCHANGE_MATCH_ODDS_MARKET_ID}`;

const clickOnElement = async (element) => {
  await browser.waitUntilClickableNative(element, "Element is not clickable");
  await element.click();
};

describe("EXC Market Page - Cash Out Receipt Dismiss", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({}));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));

    await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }));

    const HOME_VIEW_LINK = getStartViewLink(MARKET_URL);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
    await browser.waitUntilDisplayed(genericScreenSO.element, "Market page wasn't displayed");
    await browser.waitUntilDisplayed(primaryButtonSO.element, "Cash out button wasn't displayed");
    await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $1.98");

    await browser.waitUntilClickableNative(primaryButtonSO.element, "Cash out button wasn't clickable");
    await primaryButtonSO.element.click();

    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));

    await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out Successful");
  });

  describe("when the user switches pebbles and back", () => {
    beforeAll(async () => {
      await clickOnElement(pebbleListSO.pebbleListElements[1]);
      await clickOnElement(pebbleListSO.pebbleListElements[0]);
    });

    it("[PRPI-11512] should keep the cashout receipt displayed", async () => {
      await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out Successful");
    });
  });

  describe("when the user pulls to refresh", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
      await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));

      await swipeDownElementFullscreen(genericScreenSO.element);
      await browser.waitUntilDisplayed(
        primaryButtonSO.element,
        "Cash out button wasn't displayed after pull to refresh",
      );
    });

    it("[PRPI-12740]should dismiss the cashout receipt", async () => {
      await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $1.98");
    });
  });

  describe("when the user navigates to another page and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
      await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));

      await clickOnElement(BottomBarSO.home);
      await browser.waitUntilNotDisplayed(primaryButtonSO.element, "Market Page is still visible");

      await openHomeViewLink();
      await browser.waitUntilDisplayed(primaryButtonSO.element, "Cash out button wasn't displayed");
    });

    it("[PRPI-11513] should dismiss the cashout receipt", async () => {
      await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $1.98");
    });
  });
});
