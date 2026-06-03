const { EventPagePO, CardPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
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
    ],
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
      ],
    },
  ],
};

const BFF_MOCK_EXCHANGE = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.160337355",
            viewUrl: routes.getMarketViewUrl("1.160337355", false),
          },
        ],

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
              ],
            },
            runners: [{ runnerURN: "ppb:excRunner:1.160337355/48044/0" }],
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

const BFF_MOCK_SPORTSBOOK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:924.193270252",
            viewUrl: routes.getMarketViewUrl("924.193270252", false),
          },
        ],

        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.193270252",
              noLiveData: true,
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
                  runnerURN: "ppb:sbkRunner:924.193270252/48044",
                  selectionId: 48044,
                  name: "Wolves",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.193270252/48044" }],
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

describe("Exchange Market View Link", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_EXCHANGE.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_EXCHANGE));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(firstCardPO.exchangeMarket);
  });

  describe("the user clicks on the market title", () => {
    beforeAll(async () => {
      await firstCardPO.title.waitForClickable();
      await firstCardPO.title.click();
    });

    it("[PRPI-6127] should navigate to the first market page", async () => {
      const url = await browser.getUrl();

      expect(url).toContain(routes.getMarketViewUrl("1.160337355"));
    });
  });
});

describe("Sportsbook Market View Link", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_SPORTSBOOK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_SPORTSBOOK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(firstCardPO.sportsbookMarket);
  });

  describe("the user clicks on the market title", () => {
    beforeAll(async () => {
      await firstCardPO.title.waitForClickable();
      await firstCardPO.title.click();
    });

    it("[PRPI-6128] should navigate to the first market page", async () => {
      const url = await browser.getUrl();

      expect(url).toContain(routes.getMarketViewUrl("924.193270252"));
    });
  });
});
