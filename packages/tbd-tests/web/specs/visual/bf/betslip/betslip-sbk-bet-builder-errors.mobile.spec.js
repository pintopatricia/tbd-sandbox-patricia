const {
  MinimizedPO,
  SportPagePO,
  CardPO,
  BetslipDrawerPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  SportsbookPlacePanelPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[1]);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[2]);
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const betslipDrawerPO = new BetslipDrawerPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team B",
                  },
                  away: {
                    name: "Team A",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
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
                          name: "Team B v Team A",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team B",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team A",
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
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 2,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.2,
  winAverageOdds: 1.2,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 3,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.3,
  winAverageOdds: 1.3,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 3,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
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
      features: ["SGM"],
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: "924.1",
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.1,
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      runner: {
        marketId: "924.1",
        selectionId: 2,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.2,
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: "924.1",
              selectionId: 1,
            },
          ],
        },
        {
          runners: [
            {
              marketId: "924.1",
              selectionId: 2,
            },
          ],
        },
      ],

      combinationGroup: 1,
      betType: "DOUBLE",
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      features: ["SGM"],
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 1,
    },
  ],

  betFailures: [
    {
      failedRunner: {
        marketId: "924.1",
        selectionId: 3,
      },
      combinationGroups: [1],
      failureCode: "INVALID_SGM_COMBINATION",
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const MODULE_NAME = "betslip_sbk";

describe("Bet Builder combination errors", () => {
  describe("when adding multiple selections to the Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );

      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "First selection hasn't been added");

      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element, "Singles panel hasn't been minimized");
      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.click();

      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();

          return title.includes("2.4");
        },
        {
          timeoutMsg: "2 Leg bet builder was not combined",
        },
      );

      await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK, { ignoreLegsOrder: true }));
      await thirdSbkRunnerPO.sportsbookBetButton.click();
      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1225]_should_see_open_betslip_with_bet_builder_failures_two_accordions`,
      );
    });

    it("[PRPI-1225]_should_see_open_betslip_with_bet_builder_failures_two_accordions", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1225]_should_see_open_betslip_with_bet_builder_failures_two_accordions`,
        ),
      ).toBe(0);
    });
  });
});
