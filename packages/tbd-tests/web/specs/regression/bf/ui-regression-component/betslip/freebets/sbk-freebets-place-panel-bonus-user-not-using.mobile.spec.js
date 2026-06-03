const {
  AppPO,
  EventPagePO,
  CardPO,
  FreeBetsPO,
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

describe("SBK Freebets - Bet Place Panel Toggle Behaviour (singles)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(EVENT_PAGE_BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(EVENT_PAGE_BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
  });
  describe("when user with SBK bonus taps to make a bet", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_BET_SERVICE_MOCK));

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({
          market: eventPagePO.markets[0],
          price: 1.1,
        }),
      );

      await firstRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(
        freeBetsPO.label,
        "Use Free Bet Balance",
        "Freebets label is not equal to 'Use Free Bet Balance'",
      );
    });

    it("[PRPI-8092] the bonus component should be displayed", async () => {
      expect(await freeBetsPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8093] the bonus component radio button should not be selected", async () => {
      expect(await freeBetsPO.input.isSelected()).toBe(false);
    });

    it("[PRPI-8094] the bonus component is displayed with label 'Use Free Bet Balance'", async () => {
      expect(await freeBetsPO.label.getText()).toEqual("Use Free Bet Balance");
    });
  });
});
