const { MarketPagePO, AppPO, CardPO, RunnerPO, MarketBlurbsPO, ExchangeMarketPO } = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;

const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const marketPagePO = new MarketPagePO();

const marketCardPO = new CardPO(marketPagePO.market);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const marketBlurbsPO = new MarketBlurbsPO();
const firstRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const secondRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[1]);
const thirdRunnerPO = new RunnerPO(exchangeMarketPO.runnerList[2]);

const mockService = new MockService();

const EXCHANGE_MATCH_ODDS_MARKET_ID = "1.123456789";
const EVENT_ID = "29682729";

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

const EVENT_LINK = {
  node: {
    __typename: "QuickLinksCard",
    urn: `pb:tbd:card:quickLinks:view:event;${EVENT_ID}`,
    viewLink: {
      viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
    },
    sportevent: {
      name: "Man Utd v Wolves",
      urn: `ppb:event:${EVENT_ID}`,
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
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/12345/0`,
      selectionId: 12345,
    },
  ],
};

const MARKET_CARD = {
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

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
  mainMarket: EXCHANGE_MARKET,
  edges: [FIXTURE, MARKET_CARD, EVENT_LINK],
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
      { price: 3.5, size: 100 },
      { price: 3.3, size: 90 },
      { price: 3.1, size: 80 },
    ],

    availableToLay: [
      { price: 6.8, size: 110 },
      { price: 8, size: 120 },
      { price: 9, size: 130 },
    ],
  },
  {
    selectionId: "58805",
    availableToBack: [
      { price: 1.5, size: 100 },
      { price: 1.3, size: 90 },
      { price: 1.1, size: 80 },
    ],

    availableToLay: [
      { price: 1.8, size: 110 },
      { price: 2, size: 120 },
      { price: 3, size: 130 },
    ],
  },
];

const MATCH_ODDS_ERO_MOCK = [
  {
    marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

describe("Exchange Market Page - Market Depth Behaviour", () => {
  describe("When the user is on Match Odds EXC tab´s market view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK.urn));
      await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
      await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: "2.5" }));
    });

    it("[PRPI-5396] should draw only the defined number of runners on MarketExtendedCard", async () => {
      expect(await exchangeMarketPO.runnerList.length).toBe(3); // mock has 4 runners but only 3 runners are rendered
    });

    it("[PRPI-5397] the market depth button should be visible on the viewport", async () => {
      expect(await marketBlurbsPO.marketDepthButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-5398] the market depth book percentage should not be visible", async () => {
      expect(await marketBlurbsPO.bookPercentage.isDisplayed()).toBe(false);
    });

    it("[PRPI-5399] the best back and lay bet buttons should be available for each runner", async () => {
      expect(await firstRunnerPO.exchangeBetButtons.length).toBe(2);
      expect(await secondRunnerPO.exchangeBetButtons.length).toBe(2);
      expect(await thirdRunnerPO.exchangeBetButtons.length).toBe(2);
    });

    it("[PRPI-5400] the market graphs icon should be displayed", async () => {
      expect(await firstRunnerPO.runnerMarketGraphIcon.isDisplayed()).toBe(true);
    });

    describe("And the user clicks in the market depth button to expand it", () => {
      beforeAll(async () => {
        await marketBlurbsPO.marketDepthButton.click();
        await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: "2.1" }));
      });

      it("[PRPI-5401] the market depth button should be visible on the viewport", async () => {
        expect(await marketBlurbsPO.marketDepthButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-5402] the market depth book percentage should be visible", async () => {
        expect(await marketBlurbsPO.bookPercentage.isDisplayed()).toBe(true);
      });

      it("[PRPI-5403] the top 3 available back and lay prices for each runner should be visible on the viewport", async () => {
        expect(await firstRunnerPO.exchangeBetButtons.length).toBe(6);
        expect(await secondRunnerPO.exchangeBetButtons.length).toBe(6);
        expect(await thirdRunnerPO.exchangeBetButtons.length).toBe(6);
      });

      it("[PRPI-5404] the market graphs icon should not be displayed", async () => {
        expect(await firstRunnerPO.runnerMarketGraphIcon.isExisting()).toBe(false);
      });

      describe("And the user clicks in the market depth button to close it", () => {
        beforeAll(async () => {
          await marketBlurbsPO.marketDepthButton.scrollIntoView();
          await marketBlurbsPO.marketDepthButton.click();

          await browser.waitUntil(
            AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: "2.5" }),
          );
        });

        it("[PRPI-5405] the market depth button should be visible on the viewport", async () => {
          expect(await marketBlurbsPO.marketDepthButton.isDisplayed()).toBe(true);
        });

        it("[PRPI-5405] the market depth book percentage should not be visible", async () => {
          expect(await marketBlurbsPO.bookPercentage.isDisplayed()).toBe(false);
        });

        it("[PRPI-5406] the best back and lay bet buttons should be available for each runner", async () => {
          expect(await firstRunnerPO.exchangeBetButtons.length).toBe(2);
          expect(await secondRunnerPO.exchangeBetButtons.length).toBe(2);
          expect(await thirdRunnerPO.exchangeBetButtons.length).toBe(2);
        });

        it("[PRPI-5407] the market graphs icon should now be displayed", async () => {
          expect(await firstRunnerPO.runnerMarketGraphIcon.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
