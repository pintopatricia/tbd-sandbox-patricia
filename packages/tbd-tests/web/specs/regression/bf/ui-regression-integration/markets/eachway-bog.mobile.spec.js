const {
  EventPagePO,
  CardPO,
  SportsbookMarketPO,
  RunnerPO,
  MarketBlurbsPO,
  MarketPromoPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const marketBlurbsPO = new MarketBlurbsPO(sportsbookMarketPO.element);
const marketPromoPO = new MarketPromoPO();
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);

const mockService = new MockService();

const EVENT_ID = "29359895";
const TIMEOUT = 5000;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      guaranteedPriceAvailable: true,
      eachwayAvailable: true,
      numberOfPlaces: 3,
      placeFraction: {
        numerator: 1,
        denominator: 5,
      },
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
          noOdds: true,
        },
      ],
    },
  ],
};

const SUSPENDED_SBK_MARKET = {
  markets: [
    {
      marketId: "924.193270252",
      marketStatus: "SUSPENDED",
      guaranteedPriceAvailable: true,
      eachwayAvailable: true,
      numberOfPlaces: 3,
      placeFraction: {
        numerator: 1,
        denominator: 5,
      },
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
          noOdds: true,
        },
      ],
    },
  ],
};

const INPLAY_SBK_MARKET = {
  markets: [
    {
      marketId: "924.193270252",
      inplay: true,
      guaranteedPriceAvailable: true,
      eachwayAvailable: true,
      numberOfPlaces: 3,
      placeFraction: {
        numerator: 1,
        denominator: 5,
      },
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
          noOdds: true,
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
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.160337355",
            viewUrl: routes.getMarketViewUrl("1.160337355"),
          },
          {
            viewUrn: "ppb:tbd:view:market:924.193270252",
            viewUrl: routes.getMarketViewUrl("924.193270252"),
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
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/58805",
                  selection: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.193270252/48351",
                  selection: 48351,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
              { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
              { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
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

describe("EachWay and BOG", () => {
  describe("Marketcard is retrieved with pre-play SBK market, eachwayAvailable and guaranteedPriceAvailable are both retrieved as true", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(eventPagePO.element);
      await browser.waitUntilDisplayed(firstCardPO.element);
    });

    it("[PRPI-8475] The marketcard with SBK market should be visible", async () => {
      expect(await firstCardPO.element.isDisplayed()).toBe(true);
      expect(await sportsbookMarketPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8476] The each way terms should be visible: 'Each Way: 1/5 Odds, 3 Places'", async () => {
      expect(await marketPromoPO.title.getText()).toBe("Each Way: 1/5 Odds, 3 Places");
    });

    it("[PRPI-8477] The BOG icon should be visible", async () => {
      expect(await marketBlurbsPO.bogBadge.isDisplayed()).toBe(true);
    });

    describe("And the SBK market status changes to Suspended", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SUSPENDED_SBK_MARKET));
        await browser.tickFakeClock();
        await browser.waitUntilNotDisplayed(marketBlurbsPO.bogBadge);
      });

      it("[PRPI-8478] The each way terms should be visible: 'Each Way: 1/5 Odds, 3 Places'", async () => {
        expect(await marketPromoPO.title.getText()).toBe("Each Way: 1/5 Odds, 3 Places");
      });

      it("[PRPI-8479] The BOG icon should not be visible", async () => {
        expect(await marketBlurbsPO.bogBadge.isDisplayed()).toBe(false);
      });

      describe("And the market turns in-play", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarketPrices(INPLAY_SBK_MARKET));
          await browser.tickFakeClock();
          await firstRunnerSportsbookPO.sportsbookBetButton.waitForEnabled({ timeout: TIMEOUT });
        });

        it("[PRPI-8480] The each way terms should be visible: 'Each Way: 1/5 Odds, 3 Places'", async () => {
          expect(await marketPromoPO.title.getText()).toBe("Each Way: 1/5 Odds, 3 Places");
        });

        it("[PRPI-8481] The BOG icon should not be visible", async () => {
          expect(await marketBlurbsPO.bogBadge.isDisplayed()).toBe(false);
        });
      });
    });
  });
});
