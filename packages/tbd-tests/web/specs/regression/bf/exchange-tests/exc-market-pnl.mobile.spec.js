const { EventPagePO, ExchangeMarketPO, CardPO, RunnerPO, PNLAndWhatIfPO } = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const runnerExchangePO = {
  first: new RunnerPO(exchangeMarketPO.runnerList[0]),
  second: new RunnerPO(exchangeMarketPO.runnerList[1]),
  third: new RunnerPO(exchangeMarketPO.runnerList[2]),
};
const pnlPO = {
  first: new PNLAndWhatIfPO(runnerExchangePO.first.pnlAndWhatIf).pnl,
  second: new PNLAndWhatIfPO(runnerExchangePO.second.pnlAndWhatIf).pnl,
  third: new PNLAndWhatIfPO(runnerExchangePO.third.pnlAndWhatIf).pnl,
};

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventTypeId: 1,
    name: "Football",
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds",
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

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 2.1, size: 100 }],
        availableToLay: [{ price: 2.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 3.4, size: 200 }],
        availableToLay: [{ price: 3.5, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 5.7, size: 300 }],
        availableToLay: [{ price: 5.8, size: 310 }],
      },
    ],
  },
];

const POSITION_VIEWS = {
  marketPositions: [
    {
      marketId: "1.160337355",
      selections: [
        {
          selectionId: 48044,
          orders: [
            {
              marketId: "1.160337355",
              selectionId: 48044,
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
          selectionId: 58805,
          orders: [
            {
              marketId: "1.160337355",
              selectionId: 58805,
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

describe("[645930] when the user opens the event page with an exchange market and open bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await browser.url(routes.getEventViewUrl(EVENT_ID));

    await browser.waitUntilDisplayed(pnlPO.first);
    await browser.waitUntilDisplayed(pnlPO.second);
    await browser.waitUntilDisplayed(pnlPO.third);
  });

  it("[PRPI-5473] should have correct PnL value for first runner", async () => {
    expect(await pnlPO.first.getText()).toBe("$13.00");
  });

  it("[PRPI-5474] should have correct PnL profit state for first runner", async () => {
    expect(await browser.containsClass(pnlPO.first, PNLAndWhatIfPO.states.profit)).toBe(true);
  });

  it("[PRPI-5475] should have correct PnL value for second runner", async () => {
    expect(await pnlPO.second.getText()).toBe("-$5.00");
  });

  it("[PRPI-5476] should have correct PnL loss state for second runner", async () => {
    expect(await browser.containsClass(pnlPO.second, PNLAndWhatIfPO.states.loss)).toBe(true);
  });

  it("[PRPI-5477] should have correct PnL value for third runner", async () => {
    expect(await pnlPO.third.getText()).toBe("$0.00");
  });

  it("[PRPI-5478] should have correct PnL neutral state for third runner", async () => {
    expect(await browser.containsClass(pnlPO.third, PNLAndWhatIfPO.states.neutral)).toBe(true);
  });
});
