const {
  AppPO,
  EventPagePO,
  CardPO,
  FreeBetsPO,
  PrimaryButtonPO,
  RunnerPO,
  SportsbookMarketPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");

const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);

const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);

const freeBetsPO = new FreeBetsPO();
const placeButtonPO = new PrimaryButtonPO();
const mockService = new MockService();

const EVENT_ID = "29359895";
const MARKET_ID = "924.193270252";

const FRACTIONAL_DISPLAY_ODDS_MOCK = {
  fractionalDisplayOdds: { numerator: 1, denominator: 2 },
};

const RUNNER_ODDS_MOCK = {
  ...FRACTIONAL_DISPLAY_ODDS_MOCK,
  decimalDisplayOdds: { decimalOdds: 1.1 },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          runnerOdds: RUNNER_ODDS_MOCK,
          selectionId: "48044",
        },
        {
          noOdds: true,
          selectionId: "48351",
        },
      ],
    },
  ],
};

const EVENT_PAGE_BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
              },
            ],

            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID}`,
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
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/48044`,
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/58805`,
                  selectionId: 58805,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/48351`,
                  selectionId: 48351,
                  name: "Man Utd",
                },
              ],
            },
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
      },
    },
  ],
};

const IMPLY_BET_SERVICE_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: "924.193270252",
              selectionId: 48044,
            },
          ],
        },
      ],

      winAverageOdds: 1.2,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
      },
      averageOdds: 1.2,
      hasBonusMoney: true,
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [
    {
      runner: {
        marketId: "924.193270252",
        selectionId: 48044,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.193270252",
          selectionId: 48044,
        },
      ],
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.193270252",
    selectionId: 48044,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

describe("SBK Freebets - Bet Place Panel Toggle Behaviour (singles)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(EVENT_PAGE_BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(EVENT_PAGE_BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
  });

  describe("when user without bonus has betslip open with SBK bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({
          market: eventPagePO.markets[0],
          price: 1.1,
        }),
      );

      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button not displayed");
    });

    it("[PRPI-8101] the bonus component is not displayed", async () => {
      expect(await freeBetsPO.element.isDisplayed()).toBe(false);
    });

    describe("and next imply polling request returns wallets with bonus", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BET_SERVICE_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(
          freeBetsPO.label,
          "Use Free Bet Balance",
          "Freebets label is not equal to 'Use Free Bet Balance'",
        );
      });

      it("[PRPI-8102] the bonus component is displayed", async () => {
        expect(await freeBetsPO.element.isDisplayed()).toBe(true);
      });
    });

    describe("and next imply polling request returns no wallets with bonus", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
        );
        await browser.tickFakeClock();
        await browser.waitUntilNotDisplayed(freeBetsPO.element, "Free bets label still displayed");
      });

      it("[PRPI-8103] the bonus component is not displayed", async () => {
        expect(await freeBetsPO.element.isDisplayed()).toBe(false);
      });
    });
  });
});
