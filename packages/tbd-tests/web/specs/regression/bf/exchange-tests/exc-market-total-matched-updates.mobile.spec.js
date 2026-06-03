const { EventPagePO, ExchangeMarketPO, CardPO, MarketBlurbsPO } = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const marketBlurbsPO = new MarketBlurbsPO(exchangeMarketPO.element);

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
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
                  runnerURN: "ppb:excRunner:1.123567355/48044/0",
                  selectionId: 12345,
                  name: "Arsenal",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
              { runnerURN: "ppb:excRunner:1.123567355/48044/0" },
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

const SMP_MOCK = {
  markets: [{ marketId: "924.193270252" }],
};

describe("[558606] when the user opens the event page with one exchange market", () => {
  beforeAll(async () => {
    const ERO_MOCK = [{ state: { totalMatched: 12000 } }];

    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  });

  it("[PRPI-5485] then he should see the total matched value $12,000", async () => {
    await browser.waitUntilEquals(marketBlurbsPO.text, "Matched: $12,000");

    expect(await marketBlurbsPO.text.isDisplayed()).toBe(true);
  });

  describe("[558606] when the value is updated to 12,500 on the next request", () => {
    beforeAll(async () => {
      const ERO_MOCK = [{ state: { totalMatched: 12500 } }];

      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await browser.tickFakeClock();
    });

    it("[PRPI-5486] then he should see the total matched value $12,500", async () => {
      await browser.waitUntilEquals(marketBlurbsPO.text, "Matched: $12,500");

      expect(await marketBlurbsPO.text.isDisplayed()).toBe(true);
    });
  });

  describe("[558606] when the value is updated to 13,000 on the next request", () => {
    beforeAll(async () => {
      const ERO_MOCK = [{ state: { totalMatched: 13000 } }];

      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await browser.tickFakeClock();
    });

    it("[PRPI-5487] then he should see the total matched value $13,000", async () => {
      await browser.waitUntilEquals(marketBlurbsPO.text, "Matched: $13,000");

      expect(await marketBlurbsPO.text.isDisplayed()).toBe(true);
    });
  });
});
