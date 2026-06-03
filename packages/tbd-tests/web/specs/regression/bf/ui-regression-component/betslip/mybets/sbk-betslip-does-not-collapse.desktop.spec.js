const {
  AppPO,
  EventPagePO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  SportsbookPlacePanelPO,
  SinglesCardPO,
  DesktopBetslipPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const firstMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketRunnerSportsbookPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const singlesCardPO = new SinglesCardPO();
const desktopBetslipPO = new DesktopBetslipPO();

const mockService = new MockService();

const EVENT_ID = "29359895";

const smpMock = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "6",
          noOdds: true,
        },
      ],
    },
  ],
};

const BFF_MOCK = {
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
        urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`,
        title: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.1",
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
                  runnerURN: "ppb:sbkRunner:924.1/1",
                  selectionId: 1,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/2",
                  selectionId: 2,
                  name: "The Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/3",
                  selectionId: 3,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.1/1" },
              { runnerURN: "ppb:sbkRunner:924.1/2" },
              { runnerURN: "ppb:sbkRunner:924.1/3" },
            ],
          },
        },
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`,
        title: "Half Time",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.2",
              noLiveData: true,
              name: "Half Time",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.2/4",
                  selectionId: 4,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.2/5",
                  selectionId: 5,
                  name: "The Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.2/6",
                  selectionId: 6,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.2/4" },
              { runnerURN: "ppb:sbkRunner:924.2/5" },
              { runnerURN: "ppb:sbkRunner:924.2/6" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`, __typename: "MarketCard" } },
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`, __typename: "MarketCard" } },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        decimalDisplayOdds: { decimalOdds: 2.4 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

describe("Sportsbook multiples", () => {
  describe("When the user add selections and click in Betslip to collapse", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(smpMock));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await browser.url(routes.getEventViewUrl(EVENT_ID));

      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "First selection hasn't been added");
      await browser.waitUntilDisplayed(secondMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await desktopBetslipPO.title.click();
    });
    it("[PRPI-5260]Betslip does not collapse", async () => {
      expect(await desktopBetslipPO.title.isDisplayed()).toBe(true);
      expect(await singlesCardPO.singles[0].isDisplayed()).toBe(true);
      expect(await singlesCardPO.singles[1].isDisplayed()).toBe(true);
    });
  });
});
