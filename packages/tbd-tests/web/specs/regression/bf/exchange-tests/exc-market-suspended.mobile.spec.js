const { EventPagePO, ExchangeMarketPO, AppPO, CardPO, RunnerPO, MarketStatusPO } = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const exchangeMarketStatusPO = new MarketStatusPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const secondRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[1]);
const thirdRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[2]);

const mockService = new MockService();
const TIMEOUT = 5000;
const EVENT_ID = "29359895";

const ERO_MOCK = [
  {
    marketId: "1.160337355",
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
];

const SUSPENDED_EXC_MARKET = [
  {
    state: { status: "SUSPENDED" },
    ...ERO_MOCK[0],
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      runnerDetails: [
        {
          selectionId: "48044",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "58805",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "48351",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};
const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        title: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337355",
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:excRunner:1.160337355/48044/0",
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/48351/0",
                  selectionId: 48351,
                  name: "Man Utd",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/58805/0",
                  selectionId: 58805,
                  name: "The Draw",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
              { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
              { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [{ node: { urn: "ppb:tbd:card:29436223:MATCH_ODDS", __typename: "MarketCard" } }],
};

describe("when a user gets to an open exchange market", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK, { hasRequestedNewMarkets: true }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(eventPagePO.element);
    await browser.waitUntilNotDisplayed(exchangeMarketStatusPO.label);
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  it("[PRPI-5393] the back/lay buttons are enabled", async () => {
    expect(await firstRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(true);
    expect(await firstRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(true);
    expect(await secondRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(true);
    expect(await secondRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(true);
    expect(await thirdRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(true);
    expect(await thirdRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(true);
  });

  it("[PRPI-5479] the market status is not present on the market", async () => {
    expect(await exchangeMarketStatusPO.label.isDisplayed()).toBe(false);
    expect(await exchangeMarketStatusPO.indicator.isDisplayed()).toBe(false);
  });

  describe("and there's an ERO update (SUSPENDED)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarkets(SUSPENDED_EXC_MARKET, { hasRequestedNewMarkets: false }));
      await browser.tickFakeClock();
      await browser.waitUntilDisplayed(exchangeMarketStatusPO.label);
    });

    it("[PRPI-5480] the bet buttons are no longer clickable", async () => {
      expect(await firstRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(false);
      expect(await firstRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(false);
      expect(await secondRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(false);
      expect(await secondRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(false);
      expect(await thirdRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(false);
      expect(await thirdRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(false);
    });

    it("[PRPI-5481] the 'Suspended' label is displayed", async () => {
      expect(await exchangeMarketStatusPO.label.getText()).toBe("SUSPENDED");
      expect(await exchangeMarketStatusPO.indicator.isDisplayed()).toBe(true);
    });
  });
});

describe("when a user gets to a suspended exchange market", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(SUSPENDED_EXC_MARKET, { hasRequestedNewMarkets: true }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(eventPagePO.element);
    await browser.waitUntilDisplayed(exchangeMarketStatusPO.label);
  });

  it("[PRPI-5482] the market is suspended", async () => {
    expect(await exchangeMarketStatusPO.label.getText()).toBe("SUSPENDED");
    expect(await exchangeMarketStatusPO.indicator.isDisplayed()).toBe(true);
  });

  describe("and there's an ERO update (OPEN)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK, { hasRequestedNewMarkets: false }));
      await browser.tickFakeClock();
      await firstRunnerExchangePO.exchangeBetButtons[0].waitForEnabled({ timeout: TIMEOUT });
      await browser.waitUntilNotDisplayed(exchangeMarketStatusPO.label);
    });

    it("[PRPI-5483] the back/lay buttons are enabled", async () => {
      // The market is open and bet buttons are clickable
      expect(await firstRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(true);
      expect(await firstRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(true);
      expect(await secondRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(true);
      expect(await secondRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(true);
      expect(await thirdRunnerExchangePO.exchangeBetButtons[0].isEnabled()).toBe(true);
      expect(await thirdRunnerExchangePO.exchangeBetButtons[1].isEnabled()).toBe(true);
    });

    it("[PRPI-5484] the market status is not present on the market", async () => {
      expect(await exchangeMarketStatusPO.label.isDisplayed()).toBe(false);
      expect(await exchangeMarketStatusPO.indicator.isDisplayed()).toBe(false);
    });
  });
});
