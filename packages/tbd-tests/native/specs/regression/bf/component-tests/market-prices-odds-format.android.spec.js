const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getHomeLayoutWithViewLink,
  getAppContext,
  getMarkets,
  getEventLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");

const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");
const { SportsbookBetButtonSO, SportsbookMarketSO } = require("../../../../screen-objects");

const sportsbookMarketSO = new SportsbookMarketSO();
const firstRunnerSportsbookSO = new SportsbookBetButtonSO(sportsbookMarketSO.runnerList[0]);
const firstRunnerSportsbookButtonSO = new SportsbookBetButtonSO(firstRunnerSportsbookSO.element);

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
            americanDisplayOdds: { americanOdds: -1000.0, americanOddsInt: -1000 },
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

const GET_MARKETS_MOCK = {
  markets: [{ urn: `ppb:sbkMarket:924.193270252` }],
};

describe("when the user opens the event page with the displayOdds preference set to decimal", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        sportsbookOddsDisplay: "DECIMAL",
      }),
    );
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));

    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);

    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });

    await browser.waitUntilDisplayed(firstRunnerSportsbookButtonSO.odd);
    await browser.waitUntilEquals(firstRunnerSportsbookButtonSO.odd, "1.1");
  });

  it("[PRPI-3626] then the sportsbook bet button shows decimal odds", async () => {
    expect(await firstRunnerSportsbookButtonSO.odd.getText()).toBe("1.1");
  });
});

describe(" when the user opens the event page with the displayOdds preference set to fractional", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        sportsbookOddsDisplay: "FRACTIONAL",
      }),
    );

    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });

    await browser.waitUntilDisplayed(firstRunnerSportsbookButtonSO.odd);
    await browser.waitUntilEquals(firstRunnerSportsbookButtonSO.odd, "1/2");
  });

  it("[PRPI-3627] then the sportsbook bet button shows fractional odds", async () => {
    expect(await firstRunnerSportsbookButtonSO.odd.getText()).toBe("1/2");
  });
});

describe("when the user opens the event page with the displayOdds preference set to american", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      getAppContext({
        sportsbookOddsDisplay: "AMERICAN",
      }),
    );

    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });

    await browser.waitUntilDisplayed(firstRunnerSportsbookButtonSO.odd);
    await browser.waitUntilEquals(firstRunnerSportsbookButtonSO.odd, "-1000");
  });

  it("[PRPI-3628] then the sportsbook bet button shows american odds", async () => {
    expect(await firstRunnerSportsbookButtonSO.odd.getText()).toBe("-1000");
  });
});
