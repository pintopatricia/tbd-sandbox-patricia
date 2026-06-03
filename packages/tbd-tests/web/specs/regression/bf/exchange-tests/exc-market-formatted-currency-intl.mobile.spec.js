const {
  EventPagePO,
  CardPO,
  ExchangeBetButtonPO,
  ExchangeMarketPO,
  RunnerPO,
  MarketBlurbsPO,
} = require("../../../../page-objects");
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
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const firstRunnerBackButtonPO = new ExchangeBetButtonPO(firstRunnerExchangePO.element);

const mockService = new MockService();

const EVENT_ID = "29359895";

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48045",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
    ],
  },
];

const ERO_WITH_TOTAL_MATCHED_ROUND_DOWN_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 4.49 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48045",
        availableToBack: [{ price: 1.1, size: 4.49 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
    ],

    state: { totalMatched: 4.49 },
  },
];

const ERO_WITH_TOTAL_MATCHED_ROUND_UP_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 4.5 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48045",
        availableToBack: [{ price: 1.1, size: 4.5 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
    ],

    state: { totalMatched: 4.5 },
  },
];

const SMP_MOCK = {
  markets: [{ marketId: "924.193270252" }],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
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
                  runnerURN: "ppb:excRunner:1.160337355/48045/0",
                  selectionId: 48045,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
              { runnerURN: "ppb:excRunner:1.160337355/48045/0" },
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

describe("EXC Market - Intl Formatted currency", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
  });

  const setup = async ({ markets = ERO_MOCK, localeCodeBcp47 = "en-GB", currencyCode = "EUR" } = {}) => {
    await mockService.mockHttpRequest(getMarkets(markets));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { localeCodeBcp47, currencyCode }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
  };

  describe("When the user opens the event page with the currency set to GBP", () => {
    beforeAll(async () => {
      await setup({ currencyCode: "GBP" });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "£100");
    });

    it("[PRPI-5415] Then he should see the matched value with the '\xA3' symbol", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: £6");
    });

    it("[PRPI-5416] And he should see all the liquidity values with the '\xA3' symbol", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("£100");
    });
  });

  describe("When the user opens the event page with the currency set to EUR", () => {
    beforeAll(async () => {
      await setup();
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "€100");
    });

    it("[PRPI-5417] Then he should see the matched value with the '\u20AC' symbol", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: €6");
    });

    it("[PRPI-5418] And he should see all the liquidity values with the '\u20AC' symbol", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("€100");
    });
  });

  describe("When the user opens the event page with the currency set to USD", () => {
    beforeAll(async () => {
      await setup({ currencyCode: "USD" });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "$100");
    });

    it("[PRPI-5419] Then he should see the matched value with the 'US$' symbol", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: US$6");
    });

    it("[PRPI-5420] And he should see all the liquidity values with the '$' symbol", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("$100");
    });
  });

  describe("When the user opens the event page with the currency set to AUD", () => {
    beforeAll(async () => {
      await setup({ currencyCode: "AUD" });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "$100");
    });

    it("[PRPI-5421] Then he should see the matched value with the 'A$' symbol", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: A$6");
    });

    it("[PRPI-5422] And he should see all the liquidity values with the '$' symbol", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("$100");
    });
  });

  describe("When the user opens the event page with the currency set to CAD", () => {
    beforeAll(async () => {
      await setup({ currencyCode: "CAD" });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "$100");
    });

    it("[PRPI-5423] Then he should see the matched value with the 'CA$' symbol", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: CA$6");
    });

    it("[PRPI-5424] And he should see all the liquidity values with the '$' symbol", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("$100");
    });
  });

  describe("When the user opens the event page with the currency set to RON", () => {
    beforeAll(async () => {
      await setup({ currencyCode: "RON" });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "100 RON");
    });

    it("[PRPI-5425] Then he should see the matched value with the 'RON' symbol prefixed", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: RON 6");
    });

    it("[PRPI-5426] And he should see all the liquidity values with the 'RON' symbol postfixed", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("100 RON");
    });
  });

  describe("When the user opens the event page with the currency set to DKK", () => {
    beforeAll(async () => {
      await setup({ currencyCode: "DKK" });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "100 kr.");
    });

    it("[PRPI-5427] Then he should see the matched value with the 'DKK' symbol prefixed", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: DKK 6");
    });

    it("[PRPI-5428] And he should see all the liquidity values with the 'kr.' symbol postfixed", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("100 kr.");
    });
  });

  describe("[554885] When the user opens the event page and he has a matched and liquidity of 4,49 that have to be round down", () => {
    beforeAll(async () => {
      await setup({ markets: ERO_WITH_TOTAL_MATCHED_ROUND_DOWN_MOCK });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "€4");
    });

    it("[PRPI-5429] Then he should see the matched value 4", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: €4");
    });

    it("[PRPI-5430] And then he should see the liquidity value 4", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("€4");
    });
  });

  describe("[554885] When the user opens the event page and he has a matched and liquidity of 4,50 that have to be round up", () => {
    beforeAll(async () => {
      await setup({ markets: ERO_WITH_TOTAL_MATCHED_ROUND_UP_MOCK });
      await browser.waitUntilEquals(firstRunnerBackButtonPO.liquidity, "€5");
    });

    it("[PRPI-5431] Then he should see the matched value 5", async () => {
      expect(await marketBlurbsPO.text.getText()).toBe("Matched: €5");
    });

    it("[PRPI-5432] And then he should see the liquidity value 5", async () => {
      expect(await firstRunnerBackButtonPO.liquidity.getText()).toBe("€5");
    });
  });
});
