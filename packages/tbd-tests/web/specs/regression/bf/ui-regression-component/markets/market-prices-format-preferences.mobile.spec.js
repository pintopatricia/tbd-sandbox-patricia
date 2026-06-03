const {
  EventPagePO,
  CardPO,
  RunnerPO,
  SportsbookBetButtonPO,
  SportsbookMarketPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const sportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const firstRunnerSportsbookButtonPO = new SportsbookBetButtonPO(firstRunnerSportsbookPO.element);

const mockService = new MockService();

const EVENT_ID = "29359895";

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
            americanDisplayOdds: { americanOdds: -1000, americanOddsInt: -1000 },
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
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.193270252",
              notTotalMatched: true,
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

  partialEdges: [{ node: { urn: "ppb:tbd:card:29436223:MATCH_ODDS", __typename: "MarketCard" } }],
};

describe("when the user opens the event page with the displayOdds preference set to decimal", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { sportsbookOddsDisplay: "DECIMAL" }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilEquals(firstRunnerSportsbookButtonPO.odd, "1.1");
  });

  it("[PRPI-3626] then the sportsbook bet button shows decimal odds", async () => {
    expect(await firstRunnerSportsbookButtonPO.odd.getText()).toBe("1.1");
  });
});

describe(" when the user opens the event page with the displayOdds preference set to fractional", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { sportsbookOddsDisplay: "FRACTIONAL" }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilEquals(firstRunnerSportsbookButtonPO.odd, "1/2");
  });

  it("[PRPI-3627] then the sportsbook bet button shows fractional odds", async () => {
    expect(await firstRunnerSportsbookButtonPO.odd.getText()).toBe("1/2");
  });
});

describe("when the user opens the event page with the displayOdds preference set to american", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { sportsbookOddsDisplay: "AMERICAN" }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilEquals(firstRunnerSportsbookButtonPO.odd, "-1000");
  });

  it("[PRPI-3628] then the sportsbook bet button shows american odds", async () => {
    expect(await firstRunnerSportsbookButtonPO.odd.getText()).toBe("-1000");
  });
});
