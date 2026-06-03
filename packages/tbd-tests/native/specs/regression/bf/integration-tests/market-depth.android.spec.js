const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;

const {
  getMarketLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp, openUrl } = require("../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");

const {
  MarketBlurbsSO,
  RunnerSO,
  ExchangeBetButtonSO,
  ExchangeMarketSO,
  MarketDepthButtonSO,
  CardSO,
  GenericScreenSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSO.element);
const exchangeMarketSO = new ExchangeMarketSO(cardSO.exchangeMarket);

const marketDepthButtonSO = new MarketDepthButtonSO();
const firstRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const firstBetButtonSO = new ExchangeBetButtonSO(firstRunnerSO.betButtons[0]);
const marketBlurbsSO = new MarketBlurbsSO(exchangeMarketSO.blurbs);

const EXCHANGE_FIRST_MARKET_ID = "1.987654323";
const EXCHANGE_SECOND_MARKET_ID = "1.123456789";
const EVENT_ID = "29682729";

const EXCHANGE_FIRST_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_FIRST_MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  runners: [
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_FIRST_MARKET_ID}/55190/0`,
      selectionId: 55190,
      name: "Wolves",
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_FIRST_MARKET_ID}/48224/0`,
      selectionId: 48224,
      name: "Man Utd",
    },
  ],
};

const EXCHANGE_SECOND_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_SECOND_MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  runners: [
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_SECOND_MARKET_ID}/55190/0`,
      selectionId: 55190,
      name: "Liverpool",
    },
    {
      runnerURN: `ppb:excRunner:${EXCHANGE_SECOND_MARKET_ID}/48224/0`,
      selectionId: 48224,
      name: "Saints",
    },
  ],
};

const BFF_MOCK_FIRST_MARKET = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${EXCHANGE_FIRST_MARKET_ID}`,
  mainMarket: EXCHANGE_FIRST_MARKET,
  edges: [
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended:${EXCHANGE_FIRST_MARKET_ID}`,
        displayRunners: {
          exchange: {
            market: EXCHANGE_FIRST_MARKET,
            runners: [
              { runnerURN: `ppb:excRunner:${EXCHANGE_FIRST_MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_FIRST_MARKET_ID}/48224/0` },
            ],
          },
        },
      },
    },
  ],
};

const BFF_MOCK_SECOND_MARKET = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${EXCHANGE_SECOND_MARKET_ID}`,
  mainMarket: EXCHANGE_SECOND_MARKET,
  edges: [
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended:${EXCHANGE_SECOND_MARKET_ID}`,
        displayRunners: {
          exchange: {
            market: EXCHANGE_SECOND_MARKET,
            runners: [
              { runnerURN: `ppb:excRunner:${EXCHANGE_SECOND_MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_SECOND_MARKET_ID}/48224/0` },
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
];

const FIRST_MARKET_ERO_MOCK = [
  {
    marketId: EXCHANGE_FIRST_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

const SECOND_MARKET_ERO_MOCK = [
  {
    marketId: EXCHANGE_SECOND_MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

describe("Market Depth Component", () => {
  describe("When user enters in market view for exchange market", () => {
    const urls = [
      `sport/competition/event/market/m-${EXCHANGE_FIRST_MARKET_ID}`,
      `sport/competition/event/market/m-${EXCHANGE_SECOND_MARKET_ID}`,
    ];

    const HOME_VIEW_LINKS = getStartViewLinks(urls);
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_FIRST_MARKET));
      await mockService.mockHttpRequest(getMarkets(FIRST_MARKET_ERO_MOCK));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });

      await browser.waitUntilDisplayed(marketDepthButtonSO.element);
    });

    it("[PRPI-3036] The market depth book percentage should not be visible", async () => {
      expect(await marketBlurbsSO.bookPercentage.isDisplayed()).toBe(false);
    });

    it("[PRPI-3037] The first runner should have 2 bet buttons available", async () => {
      expect(await firstRunnerSO.betButtons.length).toBe(2);
    });

    it("[PRPI-3749] the market graphs icon should be displayed", async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.runnerMarketGraphIcon);
      expect(await firstRunnerSO.runnerMarketGraphIcon.isDisplayed()).toBe(true);
    });

    describe("When user taps on market depth button", () => {
      beforeAll(async () => {
        await browser.waitUntilEquals(firstBetButtonSO.odd, "2.5");
        await marketDepthButtonSO.element.click();
        await browser.waitUntilDisplayed(marketBlurbsSO.bookPercentage);
      });

      it("[PRPI-3038] The market depth book percentage should be visible", async () => {
        expect(await marketBlurbsSO.bookPercentage.isDisplayed()).toBe(true);
      });

      it("[PRPI-3039] The first runner should have 6 bet buttons available", async () => {
        expect(await firstRunnerSO.betButtons.length).toBe(6);
      });

      it("[PRPI-3750] the market graphs icon should not be displayed", async () => {
        expect(await firstRunnerSO.runnerMarketGraphIcon.isExisting()).toBe(false);
      });

      describe("When user navigates to another market", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(SECOND_MARKET_ERO_MOCK));
          await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK_SECOND_MARKET));

          await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });

          await browser.waitUntilDisplayed(marketBlurbsSO.bookPercentage);
          await browser.waitUntilEquals(firstRunnerSO.runnerName, "Liverpool");
        });

        it("[PRPI-3040] The market depth book percentage should be visible", async () => {
          expect(await marketBlurbsSO.bookPercentage.isDisplayed()).toBe(true);
        });

        it("[PRPI-3041] The first runner should have 6 bet buttons available", async () => {
          expect(await firstRunnerSO.betButtons.length).toBe(6);
        });

        it("[PRPI-3751] the market graphs icon should still not be displayed", async () => {
          expect(await firstRunnerSO.runnerMarketGraphIcon.isExisting()).toBe(false);
        });

        describe("When user taps to close market depth", () => {
          beforeAll(async () => {
            await browser.waitUntilEquals(firstBetButtonSO.odd, "2.1");
            await marketDepthButtonSO.element.click();
            await browser.waitUntilNotDisplayed(marketBlurbsSO.bookPercentage);
          });

          it("[PRPI-3042] The market depth book percentage should not be visible", async () => {
            expect(await marketBlurbsSO.bookPercentage.isDisplayed()).toBe(false);
          });

          it("[PRPI-3043] The first runner should have 2 bet buttons available", async () => {
            expect(await firstRunnerSO.betButtons.length).toBe(2);
          });

          it("[PRPI-3752] the market graphs icon should now be displayed", async () => {
            expect(await firstRunnerSO.runnerMarketGraphIcon.isDisplayed()).toBe(true);
          });
        });
      });
    });
  });
});
