const {
  MinimizedPO,
  SportPagePO,
  SportsbookPlacePanelPO,
  CardPO,
  BetslipDrawerPO,
  SportsbookBetButtonPO,
  InlineSportsbookMarketPO,
  CombinationsListPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const MultiLinesMultiplesPO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.web.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const thirdEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[2]);
const fourthEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[3]);
const firstMatchOddsCard = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCard = new CardPO(secondEventMarketCardPO.market);
const thirdMatchOddsCard = new CardPO(thirdEventMarketCardPO.market);
const fourthMatchOddsCard = new CardPO(fourthEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCard.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCard.inlineSportsbookMarket);
const thirdSbkMarketPO = new InlineSportsbookMarketPO(thirdMatchOddsCard.inlineSportsbookMarket);
const fourthSbkMarketPO = new InlineSportsbookMarketPO(fourthMatchOddsCard.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(thirdSbkMarketPO.betButtons[0]);
const fourthSbkRunnerPO = new SportsbookBetButtonPO(fourthSbkMarketPO.betButtons[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const betslipDrawerPO = new BetslipDrawerPO();
const multiLinesMultiplesPO = new MultiLinesMultiplesPO();
const doubleMultiple = multiLinesMultiplesPO.multiples[1];
const doubleCombinationsPO = new CombinationsListPO(doubleMultiple);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const FIRST_RUNNER = { marketId: "924.1", selectionId: 1 };
const SECOND_RUNNER = { marketId: "924.2", selectionId: 1 };
const THIRD_RUNNER = { marketId: "924.3", selectionId: 1 };
const FOURTH_RUNNER = { marketId: "924.4", selectionId: 1 };

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
          noOdds: true,
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
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          noOdds: true,
        },
        {
          selectionId: "3",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.3",
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
          noOdds: true,
        },
        {
          selectionId: "3",
          noOdds: true,
        },
      ],
    },
    {
      marketId: "924.4",
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
          noOdds: true,
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
                          name: "Team A 1 v Team B 1",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team A 1",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw 1",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Team B 1",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team A 2 vs Team B 2",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team B 2",
                  },
                  away: {
                    name: "Team A 2",
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
                      urn: "ppb:sbkMarket:924.2",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team A 2 v Team B 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Team A 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/3",
                          selectionId: 3,
                          name: "Team B 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/1" },
                      { runnerURN: "ppb:sbkRunner:924.2/2" },
                      { runnerURN: "ppb:sbkRunner:924.2/3" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        cardGroupTitle: "League 3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                fixture: {
                  urn: "ppb:fixture:29359897",
                  home: {
                    name: "Team A 3",
                  },
                  away: {
                    name: "Team B 3",
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
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team A 3 v Team B 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/1" },
                      { runnerURN: "ppb:sbkRunner:924.3/2" },
                      { runnerURN: "ppb:sbkRunner:924.3/3" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
        cardGroupTitle: "League 4",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Team A 4 vs Team B 4",
                fixture: {
                  urn: "ppb:fixture:29359898",
                  home: {
                    name: "Team A 4",
                  },
                  away: {
                    name: "Team B 4",
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
                      urn: "ppb:sbkMarket:924.4",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team A 4 v Team B 4",
                          urn: "ppb:event:29359898",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.4/1",
                          selectionId: 1,
                          name: "Team A 4",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.4/2",
                          selectionId: 2,
                          name: "Draw 4",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.4/3",
                          selectionId: 3,
                          name: "Team B 4",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.4/1" },
                      { runnerURN: "ppb:sbkRunner:924.4/2" },
                      { runnerURN: "ppb:sbkRunner:924.4/3" },
                    ],
                  },
                },
              },
            },
          ],
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:4",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [{ runners: [FIRST_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [{ runners: [SECOND_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [{ runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_MOCK = {
  legCombinations: [{ runners: [FOURTH_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_ODDS_MOCK = {
  runner: FOURTH_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 2.1,
      winAverageOdds: 2.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 2.1 },
        trueOdds: { decimalOdds: { decimalOdds: 2.1 } },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "TREBLE",
      numLines: 1,
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 3.1,
      winAverageOdds: 3.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 3.1 },
        trueOdds: { decimalOdds: { decimalOdds: 3.1 } },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "DOUBLE",
      numLines: 3,
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 3.1,
      winAverageOdds: 3.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 3.1 },
        trueOdds: { decimalOdds: { decimalOdds: 3.1 } },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const FOUR_FOLD_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    {
      betType: "FOURFOLD",
      numLines: 1,
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 4.1,
      winAverageOdds: 4.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 4.1 },
        trueOdds: { decimalOdds: { decimalOdds: 4.1 } },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "TREBLE",
      numLines: 4,
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 3.4 },
        trueOdds: { decimalOdds: { decimalOdds: 3.4 } },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "DOUBLE",
      numLines: 6,
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 2.4 },
        trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const MODULE_NAME = "betslip_sbk_preview";

describe("Combinations List (.it jurisdiction)", () => {
  describe("when opening betslip with 4 selections (4 Fold)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          jurisdiction: "ITALY",
          countryCode: "IT",
          localeCode: "it",
          localeCodeBcp47: "it",
        }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );
      await firstSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");

      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");
      await secondSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await secondSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();

          return title.includes("2.1");
        },
        {
          timeoutMsg: "2 leg multiple was not combined",
        },
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
      await thirdSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(thirdSbkRunnerPO.sportsbookBetButton, "Third runner bet button not visible");
      await thirdSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await thirdSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();

          return title.includes("3.1");
        },
        {
          timeoutMsg: "3 leg multiple was not combined",
        },
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(FOUR_FOLD_MOCK));
      await fourthSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(fourthSbkRunnerPO.sportsbookBetButton, "Fourth runner bet button not visible");
      await fourthSbkRunnerPO.sportsbookBetButton.waitForClickable();
      await fourthSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntil(
        async () => {
          const title = await sportsbookMinimizedBetslipPO.title.getText();

          return title.includes("4.1");
        },
        {
          timeoutMsg: "4 leg multiple was not combined",
        },
      );

      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
    });

    describe("when checking the Double (Doppio)", () => {
      beforeAll(async () => {
        await multiLinesMultiplesPO.element.scrollIntoView({
          block: "center",
        });

        await browser.waitUntilInViewport(doubleCombinationsPO.element, " Double combinations list not on viewport");

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1233]_should_see_betslip_with_combinations_list_default_closed`,
        );
      });

      it("[PRPI-1233]_should_see_betslip_with_combinations_list_default_closed", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1233]_should_see_betslip_with_combinations_list_default_closed`,
          ),
        ).toBe(0);
      });

      describe("when the combinations list is clicked", () => {
        beforeAll(async () => {
          await doubleCombinationsPO.headerTitle.waitForClickable();
          await doubleCombinationsPO.headerTitle.click();

          await doubleCombinationsPO.more.scrollIntoView({
            block: "end",
          });

          await browser.waitUntilInViewport(
            doubleCombinationsPO.more,
            "Combinations list 'Show more' button not on viewport",
          );

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1234]_should_see_betslip_with_combinations_list_open_and_show_more_button`,
          );
        });

        it("[PRPI-1234]_should_see_betslip_with_combinations_list_open_and_show_more_button", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1234]_should_see_betslip_with_combinations_list_open_and_show_more_button`,
            ),
          ).toBe(0);
        });

        describe("when combinations list show more button is clicked", () => {
          beforeAll(async () => {
            await doubleCombinationsPO.more.waitForClickable();
            await doubleCombinationsPO.more.click();

            await doubleCombinationsPO.more.scrollIntoView({
              block: "end",
            });

            await browser.waitUntilInViewport(
              doubleCombinationsPO.more,
              "Combinations list 'Show less' button not on viewport",
            );

            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1235]_should_see_betslip_with_combinations_list_open_and_show_less_button`,
            );
          });

          it("[PRPI-1235]_should_see_betslip_with_combinations_list_open_and_show_less_button", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1235]_should_see_betslip_with_combinations_list_open_and_show_less_button`,
              ),
            ).toBe(0);
          });
        });
      });
    });
  });
});
