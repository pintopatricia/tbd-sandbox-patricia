const { AppPO, BottomBarPO, MarketPagePO, PebbleListPO, PrimaryButtonPO } = require("../../../../page-objects");

const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getMarketLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { waitForClickable } = require("../../../../helpers/cashout.util");
const routes = require("../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const primaryButtonPO = new PrimaryButtonPO();
const bottomBarPO = new BottomBarPO();
const pebblesPO = new PebbleListPO(marketPagePO.element);
const secondPebble = pebblesPO.pebbles[1];

const mockService = new MockService();

const EVENT_ID = "29359895";
const EXCHANGE_MATCH_ODDS_MARKET_ID = "1.123456789";
const EXCHANGE_OVER_UNDER_15_MARKET_ID = "1.173614168";

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

const BFF_HOME_VIEW_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [],
};

const clickOnElement = async (element) => {
  await element.waitForClickable();
  await element.click();
};

describe("EXC Market Page - Cash Out Receipt Dismiss", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT.urn, {
        currencyCode: "EUR",
        localeCodeBcp47: "en-GB",
      }),
    );
    await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(BFF_HOME_VIEW_MOCK, { withBottomBar: false }));

    await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: marketPagePO.market,
        price: 2.5,
      }),
    );

    await browser.waitUntilDisplayed(primaryButtonPO.element, "Cash out button wasn't displayed");
    await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: €1.98");

    // Trigger a successful cashout to land on the RECEIPT step
    await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }));
    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));

    await waitForClickable(primaryButtonPO.element);
    await primaryButtonPO.element.click();

    // Receipt step (button shows "Cash Out Successful" and is disabled)
    await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
    expect(await primaryButtonPO.element.isEnabled()).toBe(false);
  });

  describe("when the user switches pebbles and back", () => {
    beforeAll(async () => {
      await clickOnElement(secondPebble);
      await clickOnElement(pebblesPO.pebbles[0]);
    });

    it("[PRPI-11512] should keep the cashout receipt displayed", async () => {
      await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
      expect(await primaryButtonPO.element.isEnabled()).toBe(false);
    });
  });

  describe("when the user navigates to another page and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
      await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));

      await clickOnElement(bottomBarPO.tiles[0]);
      await browser.waitUntilNotDisplayed(marketPagePO.element, "Market Page is still visible");

      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
    });

    it("[PRPI-11513] should dismiss the cashout receipt", async () => {
      await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: €1.98");
      expect(await primaryButtonPO.element.isEnabled()).toBe(true);
    });
  });
});
