const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getSportsLayout, getMarkets, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { GenericScreenSO, BetDetailsSO, SportsbookPlacePanelSO } = require("../../../../../screen-objects");

const mockService = new MockService();
const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const FIRST_MARKET_ID = "924.1";

const genericScreenSO = new GenericScreenSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const betDetailsSO = new BetDetailsSO(sportsbookPlacePanelSO.element);

const MARKET_RUNNERS = [
  {
    runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
    selectionId: 1,
    name: "Sporting",
  },
  {
    runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
    selectionId: 2,
    name: "The Draw",
  },
  {
    runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
    selectionId: 3,
    name: "Man Utd",
  },
];

const BFF_ENSURE_MARKETS_SINGLE_SELECTION_MOCK = {
  markets: [
    {
      __typename: "SportsbookMarket",
      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
      runners: MARKET_RUNNERS,
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          noOdds: true,
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${FIRST_EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "3 Sporting v 3 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${FIRST_EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:${FIRST_EVENT_ID}`,
                        },
                      },
                      runners: MARKET_RUNNERS,
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/3`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 6.5,
  winAverageOdds: 6.5,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: { decimalOdds: 6.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: { decimalOdds: 6.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SCA = {
  fixture: [
    {
      score: {},
      duration: {},
    },
  ],
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const WALLET_MOCK = [
  { amount: "5.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
];

describe("Deep linking with query parameters", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getScaResponse(SCA));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(BFF_ENSURE_MARKETS_SINGLE_SELECTION_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

    const HOME_VIEW_LINK = getStartViewLink("football/s-1?bets=SIMPLE_SELECTION:924.1%7C1");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element);
  });

  describe("when the app is open", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(betDetailsSO.title);
    });

    it("[PRPI-3469] should show the selection title", async () => {
      expect(await betDetailsSO.title.getText()).toBe("Sporting");
    });
  });
});
