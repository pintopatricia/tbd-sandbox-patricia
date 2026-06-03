const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const { AppPO, MarketPagePO, PrimaryButtonPO, PNLAndWhatIfPO } = require("../../../../page-objects");
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { waitForClickable } = require("../../../../helpers/cashout.util");
const routes = require("../../../../../utils/routes");

const primaryButtonPO = new PrimaryButtonPO();
const pnlAndWhatIfPO = new PNLAndWhatIfPO(primaryButtonPO.element);
const marketPagePO = new MarketPagePO();

const mockService = new MockService();

const EVENT_ID = "29359895";
const EXCHANGE_MATCH_ODDS_MARKET_ID = "1.123456789";

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

const EXCHANGE_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  liveData: {
    cashoutQuotes: [
      {
        urn: `ppb:excCashoutQuote:${EXCHANGE_MATCH_ODDS_MARKET_ID}/0`,
        marketURN: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
        value: 1.98,
        profit: -0.02,
        status: "AVAILABLE",
      },
    ],
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
};

const MARKET_CARD_WITH_CASHOUT = {
  node: {
    __typename: "MarketExtendedCard",
    urn: `ppb:tbd:card:marketExtended:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
    marketsHierarchy: {
      __typename: "RaceHierarchy",
      race: {
        __typename: "Race",
        urn: "ppb:race:29901908.1410",
        startTime: "2020-07-13T14:40:00",
        name: "14:40 Aintree",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:29901908",
          name: "Wind 13th Jul",
        },
      },
    },
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
  cashoutQuotes: {
    exchangeCashoutQuotes: [
      {
        urn: `ppb:excCashoutQuote:${EXCHANGE_MATCH_ODDS_MARKET_ID}/0`,
        marketURN: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
        value: 1.98,
        profit: -0.02,
        status: "AVAILABLE",
      },
    ],
  },
};

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT = {
  __typename: "MarketExtendedCard",
  urn: `ppb:tbd:view:market:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET,
  edges: [FIXTURE, MARKET_CARD_WITH_CASHOUT],
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

const CASHOUT_QUOTE = [
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

const CASHOUT_QUOTE_UNAVAILABLE = [
  {
    marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
    status: "UNAVAILABLE",
  },
];

const setupMarketPage = async ({ jurisdiction, confirmCashout } = {}) => {
  await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
  await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
  await mockService.mockHttpRequest(
    await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT.urn, {
      currencyCode: "EUR",
      localeCodeBcp47: "en-GB",
      ...(jurisdiction && { jurisdiction }),
      ...(confirmCashout !== undefined && { confirmCashout }),
    }),
  );
  await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
  await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE));

  await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
  await browser.waitUntil(
    AppPO.exchangeRunnerBetButtonHasPrice({
      market: marketPagePO.market,
      price: 2.5,
    }),
  );
};

describe("Exchange Market - Cashout - Jurisdiction", () => {
  describe("when a user cashes out an Exchange matched bet via market level", () => {
    describe("when user is in Brazil jurisdiction", () => {
      beforeAll(async () => {
        await setupMarketPage({ jurisdiction: "BRAZIL", confirmCashout: false });

        await waitForClickable(primaryButtonPO.element);
        await primaryButtonPO.element.click();
      });

      it("[PRPI-10367] should see the cashout confirmation screen", async () => {
        await browser.waitUntilEquals(primaryButtonPO.label, "Confirm: €1.98");
        await browser.waitUntilEquals(primaryButtonPO.secondaryLabel, "Profit");
        await browser.waitUntilEquals(pnlAndWhatIfPO.pnl, "-€0.02");
      });
    });

    describe("when user is in any other jurisdiction", () => {
      describe("when 'Show Cash Out confirmation' setting is enabled", () => {
        beforeAll(async () => {
          await setupMarketPage({ jurisdiction: "INTERNATIONAL", confirmCashout: true });

          await waitForClickable(primaryButtonPO.element);
          await primaryButtonPO.element.click();
        });

        it("[PRPI-10368] should see the cashout confirmation screen", async () => {
          await browser.waitUntilEquals(primaryButtonPO.label, "Confirm: €1.98");
          await browser.waitUntilEquals(primaryButtonPO.secondaryLabel, "Profit");
          await browser.waitUntilEquals(pnlAndWhatIfPO.pnl, "-€0.02");
        });
      });

      describe("when 'Show Cash Out confirmation' setting is not enabled", () => {
        beforeAll(async () => {
          await setupMarketPage({ jurisdiction: "INTERNATIONAL", confirmCashout: false });

          await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }));
          await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE));

          await waitForClickable(primaryButtonPO.element);
          await primaryButtonPO.element.click();
        });

        it("[PRPI-10369] should not see the cashout confirmation screen", async () => {
          await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");
          expect(await primaryButtonPO.element.isEnabled()).toBe(false);
        });
      });
    });
  });
});
