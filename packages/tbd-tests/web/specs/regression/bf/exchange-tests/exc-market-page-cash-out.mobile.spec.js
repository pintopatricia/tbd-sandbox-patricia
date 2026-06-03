const {
  AppPO,
  BetSegmentsPO,
  MarketPagePO,
  ReceiptPanelPO,
  PrimaryButtonPO,
  PNLAndWhatIfPO,
} = require("../../../../page-objects");
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { waitForClickable } = require("../../../../helpers/cashout.util");
const routes = require("../../../../../utils/routes");

const marketPagePO = new MarketPagePO();

const betSegmentsPO = new BetSegmentsPO();
const primaryButtonPO = new PrimaryButtonPO();
const primaryButtonPnlPO = new PNLAndWhatIfPO(primaryButtonPO.element);
const cashoutReceiptPO = new ReceiptPanelPO();

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

  liveData: {
    cashoutQuotes: [CASHOUT_QUOTE],
  },
};

const MARKET_CARD_WITH_CASHOUT = {
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

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT = {
  __typename: "MarketView",
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

describe("Market Page - Cash Out", () => {
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
  });

  describe("when the user clicks on the cash out button and it succeeds", () => {
    beforeAll(async () => {
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
      await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));
      await waitForClickable(primaryButtonPO.element);
      await primaryButtonPO.element.click();
    });

    it("[PRPI-10343] the liability info should be displayed", async () => {
      expect(await betSegmentsPO.leftLabel.getText()).toBe("Liability");
      expect(await betSegmentsPO.leftValue.getText()).toBe("€0.02");
    });

    it("[PRPI-5445] the cash out button should display the success label and profit", async () => {
      await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");

      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("-€0.02");
    });

    it("[PRPI-5446] the cash out button should become disabled", async () => {
      expect(await primaryButtonPO.element.isEnabled()).toBe(false);
    });

    it("[PRPI-5447] the cash out receipt should not be displayed", async () => {
      expect(await cashoutReceiptPO.element.isDisplayed()).toBe(false);
    });
  });

  describe("when the user clicks on the cash out button and it fails", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
      await waitForClickable(primaryButtonPO.element);
      await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "CASHOUT_FAILED" }));
      await primaryButtonPO.element.click();
      await browser.waitUntilDisplayed(cashoutReceiptPO.element, "Cash out receipt wasn't displayed");
    });

    it("[PRPI-10344] the liability info should be displayed", async () => {
      expect(await betSegmentsPO.leftLabel.getText()).toBe("Liability");
      expect(await betSegmentsPO.leftValue.getText()).toBe("€2.00");
    });

    it("[PRPI-5448] the cash out receipt should display the 'Cash Out' title", async () => {
      expect(await cashoutReceiptPO.receiptTitle.getText()).toBe("Cash Out");
    });

    it("[PRPI-5449] the cash out receipt should display the dismiss button", async () => {
      expect(await cashoutReceiptPO.dismissButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5450] the cash out receipt should display the notification icon and message", async () => {
      expect(await cashoutReceiptPO.notificationIcon.isDisplayed()).toBe(true);
      expect(await cashoutReceiptPO.notificationMessage.getText()).toBe("Cash Out failed. Please try again.");
    });

    it("[PRPI-5451] the cash out button should remain enabled", async () => {
      expect(await primaryButtonPO.element.isEnabled()).toBe(true);
    });

    it("[PRPI-5452] the cash out button should display the label and profit", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: €1.98");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("-€0.02");
    });
  });

  describe("when the user clicks on the cash out button and it's unavailable", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
      await waitForClickable(primaryButtonPO.element);
      await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "UNAVAILABLE" }));
      await primaryButtonPO.element.click();
      await browser.waitUntilDisplayed(cashoutReceiptPO.element, "Cash out receipt wasn't displayed");
    });

    it("[PRPI-10345] the liability info should be displayed", async () => {
      expect(await betSegmentsPO.leftLabel.getText()).toBe("Liability");
      expect(await betSegmentsPO.leftValue.getText()).toBe("€2.00");
    });

    it("[PRPI-5453] the cash out receipt should display the 'Cash Out' title", async () => {
      expect(await cashoutReceiptPO.receiptTitle.getText()).toBe("Cash Out");
    });

    it("[PRPI-5454] the cash out receipt should display the dismiss button", async () => {
      expect(await cashoutReceiptPO.dismissButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5455] the cash out receipt should display the notification icon and message", async () => {
      expect(await cashoutReceiptPO.notificationIcon.isDisplayed()).toBe(true);
      expect(await cashoutReceiptPO.notificationMessage.getText()).toBe("Cash Out is currently unavailable.");
    });

    it("[PRPI-5456] the cash out button should remain enabled", async () => {
      expect(await primaryButtonPO.element.isEnabled()).toBe(true);
    });

    it("[PRPI-5457] the cash out button should display the label and profit", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: €1.98");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("-€0.02");
    });
  });

  describe("when the user clicks on the cash out button and it's disabled", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
      await waitForClickable(primaryButtonPO.element);
      await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "DISABLED" }));
      await primaryButtonPO.element.click();
      await browser.waitUntilDisplayed(cashoutReceiptPO.element, "Cash out receipt wasn't displayed");
    });

    it("[PRPI-10346] the liability info should be displayed", async () => {
      expect(await betSegmentsPO.leftLabel.getText()).toBe("Liability");
      expect(await betSegmentsPO.leftValue.getText()).toBe("€2.00");
    });

    it("[PRPI-5458] the cash out receipt should display the 'Cash Out' title", async () => {
      expect(await cashoutReceiptPO.receiptTitle.getText()).toBe("Cash Out");
    });

    it("[PRPI-5459] the cash out receipt should display the dismiss button", async () => {
      expect(await cashoutReceiptPO.dismissButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5460] the cash out receipt should display the notification icon and message", async () => {
      expect(await cashoutReceiptPO.notificationIcon.isDisplayed()).toBe(true);
      expect(await cashoutReceiptPO.notificationMessage.getText()).toBe("Cash Out disabled on this market.");
    });

    it("[PRPI-5461] the cash out button should remain enabled", async () => {
      expect(await primaryButtonPO.element.isEnabled()).toBe(true);
    });

    it("[PRPI-5462] the cash out button should display the label and profit", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: €1.98");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("-€0.02");
    });
  });

  describe("when the user clicks on the cash out button and limit loss is exceeded", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
      await waitForClickable(primaryButtonPO.element);
      await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "LOSS_LIMIT" }));
      await primaryButtonPO.element.click();
      await browser.waitUntilDisplayed(cashoutReceiptPO.element, "Cash out receipt wasn't displayed");
    });

    it("[PRPI-10347] the liability info should be displayed", async () => {
      expect(await betSegmentsPO.leftLabel.getText()).toBe("Liability");
      expect(await betSegmentsPO.leftValue.getText()).toBe("€2.00");
    });

    it("[PRPI-5463] the cash out receipt should display the 'Cash Out' title", async () => {
      expect(await cashoutReceiptPO.receiptTitle.getText()).toBe("Cash Out");
    });

    it("[PRPI-5464] the cash out receipt should display the dismiss button", async () => {
      expect(await cashoutReceiptPO.dismissButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5465] the cash out receipt should display the notification icon and message", async () => {
      expect(await cashoutReceiptPO.notificationIcon.isDisplayed()).toBe(true);
      expect(await cashoutReceiptPO.notificationMessage.getText()).toBe("Loss limit exceeded.");
    });

    it("[PRPI-5466] the cash out button should remain enabled", async () => {
      expect(await primaryButtonPO.element.isEnabled()).toBe(true);
    });

    it("[PRPI-5467] the cash out button should display the label and profit", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: €1.98");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("-€0.02");
    });
  });

  describe("when the user clicks on the cash out button and exposure loss is exceeded", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(
        AppPO.exchangeRunnerBetButtonHasPrice({
          market: marketPagePO.market,
          price: 2.5,
        }),
      );
      await waitForClickable(primaryButtonPO.element);
      await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "EXPOSURE" }));
      await primaryButtonPO.element.click();
      await browser.waitUntilDisplayed(cashoutReceiptPO.element, "Cash out receipt wasn't displayed");
    });

    it("[PRPI-10348] the liability info should be displayed", async () => {
      expect(await betSegmentsPO.leftLabel.getText()).toBe("Liability");
      expect(await betSegmentsPO.leftValue.getText()).toBe("€2.00");
    });

    it("[PRPI-5468] the cash out receipt should display the 'Cash Out' title", async () => {
      expect(await cashoutReceiptPO.receiptTitle.getText()).toBe("Cash Out");
    });

    it("[PRPI-5469] the cash out receipt should display the dismiss button", async () => {
      expect(await cashoutReceiptPO.dismissButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5470] the cash out receipt should display the notification icon and message", async () => {
      expect(await cashoutReceiptPO.notificationIcon.isDisplayed()).toBe(true);
      expect(await cashoutReceiptPO.notificationMessage.getText()).toBe("Exposure limit exceeded.");
    });

    it("[PRPI-5471] the cash out button should remain enabled", async () => {
      expect(await primaryButtonPO.element.isEnabled()).toBe(true);
    });

    it("[PRPI-5472] the cash out button should display the label and profit", async () => {
      expect(await primaryButtonPO.label.getText()).toBe("Cash Out: €1.98");
      expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
      expect(await primaryButtonPnlPO.pnl.getText()).toBe("-€0.02");
    });
  });
});
