const { getQuote } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const { AppPO, MarketPagePO, PNLAndWhatIfPO, PrimaryButtonPO, BetSegmentsPO } = require("../../../../page-objects");
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const primaryButtonPO = new PrimaryButtonPO();
const pnlAndWhatIfPO = new PNLAndWhatIfPO(primaryButtonPO.element);
const marketPagePO = new MarketPagePO();
const liabilityInfoPO = new BetSegmentsPO();

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
};

const EXCHANGE_MARKET_WITH_CASHOUT = {
  ...EXCHANGE_MARKET,
  liveData: {
    cashoutQuotes: [CASHOUT_QUOTE],
  },
};

const MARKET_CARD_WITHOUT_CASHOUT = {
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
};

const MARKET_CARD_WITH_CASHOUT = {
  ...MARKET_CARD_WITHOUT_CASHOUT,
  node: {
    ...MARKET_CARD_WITHOUT_CASHOUT.node,
    displayRunners: {
      ...MARKET_CARD_WITHOUT_CASHOUT.node.displayRunners,
      exchange: {
        ...MARKET_CARD_WITHOUT_CASHOUT.node.displayRunners.exchange,
        market: EXCHANGE_MARKET_WITH_CASHOUT,
      },
    },
  },
};

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT = {
  __typename: "MarketExtendedCard",
  urn: `ppb:tbd:view:market:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET_WITH_CASHOUT,
  edges: [FIXTURE, MARKET_CARD_WITH_CASHOUT],
  partialEdges: [FIXTURE, MARKET_CARD_WITH_CASHOUT],
};

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITHOUT_CASHOUT = {
  __typename: "MarketExtendedCard",
  urn: `ppb:tbd:view:market:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET,
  edges: [FIXTURE, MARKET_CARD_WITHOUT_CASHOUT],
  partialEdges: [FIXTURE, MARKET_CARD_WITHOUT_CASHOUT],
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

const CASHOUT_QUOTE_UPDATED_MOCK = [
  {
    marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
    value: 2.01,
    currentLiability: 2,
    profit: 0.01,
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

describe("Market Page - Cash Out - Availability", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
  });

  describe("when the market doesn't have cash out quotes available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITHOUT_CASHOUT.urn, {
          currencyCode: "EUR",
          localeCodeBcp47: "en-GB",
        }),
      );
      await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITHOUT_CASHOUT));

      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
    });

    it("[PRPI-5436] the cash out button should not be displayed", async () => {
      expect(await primaryButtonPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-10370] the liability info should not be displayed", async () => {
      expect(await liabilityInfoPO.element.isDisplayed()).toBe(false);
    });
  });

  describe("when the market has cash out quotes available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT.urn, {
          currencyCode: "EUR",
          localeCodeBcp47: "en-GB",
        }),
      );
      await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));

      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntilDisplayed(primaryButtonPO.element);
    });

    it("[PRPI-5437] the cash out button should display the label and PnL", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: €1.98");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await pnlAndWhatIfPO.pnl.getText()).toBe("-€0.02");
    });

    it("[PRPI-10371] the liability info should be displayed", async () => {
      expect(await liabilityInfoPO.leftLabel.getText()).toBe("Liability");
      expect(await liabilityInfoPO.leftValue.getText()).toBe("€2.00");
    });

    describe("and when cash out quotes get updated", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UPDATED_MOCK));
        await browser.tickFakeClock();
      });

      it("[PRPI-5438] the cash out button should display the updated label and PnL", async () => {
        await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: €2.01");
        await browser.waitUntilEquals(primaryButtonPO.secondaryLabel, "Profit");
        await browser.waitUntilEquals(pnlAndWhatIfPO.pnl, "€0.01");
      });

      describe("and when cash out becomes unavailable", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));
          await browser.tickFakeClock();
        });

        it("[PRPI-5439] the cash out button should display the 'Unavailable' label", async () => {
          await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out");
          await browser.waitUntilEquals(primaryButtonPO.secondaryLabel, "Unavailable");
        });
      });
    });
  });
});
