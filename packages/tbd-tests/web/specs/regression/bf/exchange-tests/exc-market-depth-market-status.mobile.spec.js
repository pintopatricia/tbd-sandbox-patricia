const {
  MarketPagePO,
  AppPO,
  CardPO,
  ExchangeMarketPO,
  RunnerPO,
  MarketBlurbsPO,
  MarketDepthButtonPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const marketCardPO = new CardPO(marketPagePO.market);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const marketDepthButtonPO = new MarketDepthButtonPO();
const marketBlurbsPO = new MarketBlurbsPO(marketCardPO.exchangeMarket);
const firstRunner = new RunnerPO(exchangeMarketPO.runnerList[0]);
const secondRunner = new RunnerPO(exchangeMarketPO.runnerList[1]);

const mockService = new MockService();
const EXCHANGE_MARKET_ID = "1.123456789";

const EXCHANGE_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:29979322`,
    },
  },
  runners: [
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0`,
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0`,
    },
  ],
};

const BFF_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${EXCHANGE_MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET,
  edges: [
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended:${EXCHANGE_MARKET_ID}`,
        displayRunners: {
          exchange: {
            market: EXCHANGE_MARKET,
            runners: [
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0` },
            ],
          },
        },
      },
    },
  ],
};

const ERO_RUNNERS_MOCK = [
  {
    selectionId: "55190",
    availableToBack: [
      { price: 2.5, size: 100 },
      { price: 2.3, size: 90 },
      { price: 2.1, size: 80 },
    ],

    availableToLay: [
      { price: 5.8, size: 110 },
      { price: 7, size: 120 },
      { price: 8, size: 130 },
    ],
  },
  {
    selectionId: "48224",
    availableToBack: [
      { price: 2.5, size: 100 },
      { price: 2.3, size: 90 },
      { price: 2.1, size: 80 },
    ],

    availableToLay: [
      { price: 5.8, size: 110 },
      { price: 7, size: 120 },
      { price: 8, size: 130 },
    ],
  },
];

const SUSPENDED_EXC_MARKET = [
  {
    state: { status: "SUSPENDED" },
    marketId: EXCHANGE_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

const CLOSED_EXC_MARKET = [
  {
    state: { status: "CLOSED" },
    marketId: EXCHANGE_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

describe("Exchange Market Page - Market Depth Behaviour with market state", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));
  });

  describe("When the user is on EXC tab´s market view with Market State SUSPENDED", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarkets(SUSPENDED_EXC_MARKET));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MARKET_ID));
      await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: 2.5 }));
    });

    describe("And the user clicks on the market depth button", () => {
      beforeAll(async () => {
        await marketDepthButtonPO.element.click();
        await browser.waitUntilDisplayed(marketPagePO.element);
      });

      it("[PRPI-5408] the market depth button should be visible on the viewport", async () => {
        expect(await marketDepthButtonPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-5409] the top 3 available back and lay prices for each runner should be disabled", async () => {
        expect(await firstRunner.exchangeBetButtons[0].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[1].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[2].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[3].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[4].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[5].isEnabled()).toBe(false);

        expect(await secondRunner.exchangeBetButtons[0].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[1].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[2].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[3].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[4].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[5].isEnabled()).toBe(false);
      });

      it("[PRPI-5410] the market depth book percentage should be visible", async () => {
        expect(await marketBlurbsPO.bookPercentage.isDisplayed()).toBe(true);
      });
    });
  });

  describe("When the user is on EXC tab´s market view with Market state CLOSED", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarkets(CLOSED_EXC_MARKET));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MARKET_ID));
      await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: 2.5 }));
    });

    describe("And the user clicks on the market depth button", () => {
      beforeAll(async () => {
        await marketDepthButtonPO.element.click();
        await browser.waitUntilDisplayed(marketPagePO.element);
      });

      it("[PRPI-5411] the market depth button should be visible on the viewport", async () => {
        expect(await marketDepthButtonPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-5412] the top 3 available back and lay prices for each runner should be disabled", async () => {
        expect(await firstRunner.exchangeBetButtons[0].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[1].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[2].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[3].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[4].isEnabled()).toBe(false);
        expect(await firstRunner.exchangeBetButtons[5].isEnabled()).toBe(false);

        expect(await secondRunner.exchangeBetButtons[0].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[1].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[2].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[3].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[4].isEnabled()).toBe(false);
        expect(await secondRunner.exchangeBetButtons[5].isEnabled()).toBe(false);
      });

      it("[PRPI-5413] the market depth book percentage should be visible", async () => {
        expect(await marketBlurbsPO.bookPercentage.isDisplayed()).toBe(true);
      });
    });
  });
});
