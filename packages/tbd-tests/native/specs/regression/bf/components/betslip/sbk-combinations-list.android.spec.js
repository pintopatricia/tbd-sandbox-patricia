const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getCombinations } = require("@flutter-global/uki-channels-http-clients/mock-index").BCE;

const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MultiLinesMultiplesSO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.native.so");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { swipeUpElement, getVerticalDistanceBetweenTwoElements } = require("../../../../../helpers/gestures");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  CombinationsListSO,
  GenericScreenSO,
  CardSO,
  BetslipDrawerSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const sportsbookMinimizedBetslipSO = new MinimizedSO();
const firstMatchOddsCard = new CardSO(genericScreenSO.cards[0]);
const secondMatchOddsCard = new CardSO(genericScreenSO.cards[1]);
const firstSbkMarketSO = new InlineSportsbookMarketSO(firstMatchOddsCard.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondMatchOddsCard.contentWrapper);
const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[0]);

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const cardCollapseSO1 = new CardSO(sportsbookPlacePanelSO.collapsableSections[0]);
const cardCollapseSO2 = new CardSO(sportsbookPlacePanelSO.collapsableSections[1]);
const cardCollapseSO3 = new CardSO(sportsbookPlacePanelSO.collapsableSections[2]);

const betslipDrawerSO = new BetslipDrawerSO();

const multiLinesMultiplesSO = new MultiLinesMultiplesSO(sportsbookPlacePanelSO.element);
const doubleMultiple = multiLinesMultiplesSO.multiples[1];
let doubleCombinationsListSO = new CombinationsListSO(doubleMultiple);

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
                title: "Home vs Away",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Away",
                  },
                  away: {
                    name: "Home",
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
                          name: "Home 1 v Away 1",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Home 1",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw 1",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          selectionId: 3,
                          name: "Away 1",
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
                title: "Home 2 vs Away 2",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Away 2",
                  },
                  away: {
                    name: "Home 2",
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
                          name: "Home 2 v Away 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Home 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/3",
                          selectionId: 3,
                          name: "Away 2",
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
                title: "Home 3 vs Away 3",
                fixture: {
                  urn: "ppb:fixture:29359897",
                  home: {
                    name: "Home 3",
                  },
                  away: {
                    name: "Away 3",
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
                          name: "Home 3 v Away 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Away 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Home 3",
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
                title: "Home 4 vs Away 4",
                fixture: {
                  urn: "ppb:fixture:29359898",
                  home: {
                    name: "Home 4",
                  },
                  away: {
                    name: "Away 4",
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
                          name: "Home 4 v Away 4",
                          urn: "ppb:event:29359898",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.4/1",
                          selectionId: 1,
                          name: "Home 4",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.4/2",
                          selectionId: 2,
                          name: "Draw 4",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.4/3",
                          selectionId: 3,
                          name: "Away 4",
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
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
            title: "title",
            items: [
              {
                __typename: "RegulatoryLoggedInSinceItem",
                alignment: "LEFT",
                loggedInSinceText: "Some Logged In Text",
                timeFormat: "HH:mm",
              },
            ],
          },
        ],
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
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
      __typename: "ViewItemEdge",
    },
  ],
};

const APP_CONTEXT_MOCK = {
  jurisdiction: "ITALY",
  countryCode: "IT",
  localeCode: "it",
  localeCodeBcp47: "it",
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

const FIRST_SELECTION = {
  betfairMarketId: FIRST_RUNNER.marketId,
  betfairSelectionId: FIRST_RUNNER.selectionId,
};

const SECOND_SELECTION = {
  betfairMarketId: SECOND_RUNNER.marketId,
  betfairSelectionId: SECOND_RUNNER.selectionId,
};

const THIRD_SELECTION = {
  betfairMarketId: THIRD_RUNNER.marketId,
  betfairSelectionId: THIRD_RUNNER.selectionId,
};

const FOURTH_SELECTION = {
  betfairMarketId: FOURTH_RUNNER.marketId,
  betfairSelectionId: FOURTH_RUNNER.selectionId,
};

const COMBINATIONS_MOCK = {
  combinations: [
    {
      selections: [FIRST_SELECTION, SECOND_SELECTION],
      price: { decimalOdds: { decimalOdds: 2 } },
    },
    {
      selections: [FIRST_SELECTION, THIRD_SELECTION],
      price: { decimalOdds: { decimalOdds: 3 } },
    },
    {
      selections: [FIRST_SELECTION, FOURTH_SELECTION],
      price: { decimalOdds: { decimalOdds: 4 } },
    },
    {
      selections: [SECOND_SELECTION, THIRD_SELECTION],
      price: { decimalOdds: { decimalOdds: 5 } },
    },
    {
      selections: [SECOND_SELECTION, FOURTH_SELECTION],
      price: { decimalOdds: { decimalOdds: 6 } },
    },
    {
      selections: [THIRD_SELECTION, FOURTH_SELECTION],
      price: { decimalOdds: { decimalOdds: 7 } },
    },
  ],
};

describe("SBK Combinations List", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));

    const URL = `football/s-${EVENT_TYPE_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(URL);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await mockService.mockHttpRequest(
      getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
    );

    await browser.waitUntilDisplayed(firstSbkMarketSO.element, "First market is not visible");
    await browser.waitUntilDisplayed(secondSbkMarketSO.element, "Second market is not visible");

    await browser.waitUntilDisplayed(firstSbkRunnerSO.element, "First runner bet button not visible");
    await browser.waitUntilDisplayed(secondSbkRunnerSO.element, "Second runner bet button not visible");

    await browser.waitUntilClickableNative(firstSbkRunnerSO.element);
    await browser.waitUntilClickableNative(secondSbkRunnerSO.element);

    const DISTANCE_BETWEEN_MARKETS = await getVerticalDistanceBetweenTwoElements(
      secondSbkRunnerSO.element,
      firstSbkRunnerSO.element,
    );

    await firstSbkRunnerSO.element.click();
    await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));

    await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "First selection hasn't been added");
    await betslipDrawerSO.header.click();
    await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");

    await secondSbkRunnerSO.element.click();
    await browser.waitUntilEquals(sportsbookMinimizedBetslipSO.counter, "2");
    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));

    await swipeUpElement(genericScreenSO.element, DISTANCE_BETWEEN_MARKETS);
    await swipeUpElement(genericScreenSO.element, DISTANCE_BETWEEN_MARKETS);
    await swipeUpElement(genericScreenSO.element, DISTANCE_BETWEEN_MARKETS);

    const thirdMatchOddsCard = new CardSO(genericScreenSO.cards[driver.isIOS ? 2 : 1]);

    const thirdSbkMarketSO = new InlineSportsbookMarketSO(thirdMatchOddsCard.contentWrapper);
    const thirdSbkRunnerSO = new SportsbookBetButtonSO(thirdSbkMarketSO.sbkBetButtons[0]);

    await browser.waitUntilDisplayed(thirdSbkRunnerSO.element, "Third runner bet button not visible");
    await browser.waitUntilClickableNative(thirdSbkRunnerSO.element);
    await thirdSbkRunnerSO.element.click();
    await browser.waitUntilEquals(sportsbookMinimizedBetslipSO.counter, "3");

    await mockService.mockHttpRequest(getImplyBetsResponse(FOUR_FOLD_MOCK));
    await mockService.mockHttpRequest(getCombinations(COMBINATIONS_MOCK));

    const fourthMatchOddsCard = new CardSO(genericScreenSO.cards[driver.isIOS ? 3 : 2]);
    const fourthSbkMarketSO = new InlineSportsbookMarketSO(fourthMatchOddsCard.contentWrapper);
    const fourthSbkRunnerSO = new SportsbookBetButtonSO(fourthSbkMarketSO.sbkBetButtons[0]);

    await browser.waitUntilDisplayed(fourthSbkRunnerSO.element, "Fourth runner bet button not visible");
    await browser.waitUntilClickableNative(fourthSbkRunnerSO.element);
    await fourthSbkRunnerSO.element.click();

    await browser.waitUntilEquals(sportsbookMinimizedBetslipSO.counter, "4");

    await sportsbookMinimizedBetslipSO.element.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook place panel not visible");
  });

  describe("When the user adds a fourth selection to the betslip", () => {
    it("[PRPI-3368] The betslip should be open", async () => {
      expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
    });

    describe("And scrolls till Additional Multiples section", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(cardCollapseSO1.element, "First collapse is not visible.");
        await browser.waitUntilClickableNative(cardCollapseSO1.header);
        await cardCollapseSO1.header.click();

        await browser.waitUntilDisplayed(cardCollapseSO2.element, "Second collapse is not visible.");
        await browser.waitUntilClickableNative(cardCollapseSO2.header);
        await cardCollapseSO2.header.click();

        await browser.waitUntilDisplayed(cardCollapseSO3.element, "Third collapse is not visible.");
        await browser.waitUntilClickableNative(cardCollapseSO3.header);
        await cardCollapseSO3.header.click();

        await browser.waitUntilClickableNative(cardCollapseSO2.header);
        await cardCollapseSO2.header.click();

        await browser.waitUntilDisplayed(doubleCombinationsListSO.element, "Double's combinations list not visible.");
      });

      it("[PRPI-3369] The additional multiples section should be visible", async () => {
        expect(await multiLinesMultiplesSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-3370] The combination list should be visible and closed by default", async () => {
        expect(await doubleCombinationsListSO.element.isDisplayed()).toBe(true);
        expect(await doubleCombinationsListSO.more.isExisting()).toBe(false);
      });

      describe("When the user taps the combinations list accordion", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(doubleCombinationsListSO.header);
          await doubleCombinationsListSO.header.click();

          const scrollHeaderDistance = await getVerticalDistanceBetweenTwoElements(
            doubleCombinationsListSO.header,
            cardCollapseSO1.element,
          );

          await browser.waitUntilArrayLength(doubleCombinationsListSO.lineRows, (length) => length > 0);

          await swipeUpElement(doubleCombinationsListSO.header, scrollHeaderDistance);

          if (!driver.isIOS) {
            doubleCombinationsListSO = new CombinationsListSO();
          }

          await browser.waitUntilDisplayed(
            doubleCombinationsListSO.more,
            "Double's combinations list 'Show More' button not visible",
          );
        });

        it("[PRPI-3371] The first 4 possible combinations should be visible", async () => {
          expect(await doubleCombinationsListSO.lineRows.length).toBe(4);
          expect(await doubleCombinationsListSO.lineRows[3].isDisplayed()).toBe(true);
        });

        it("[PRPI-3372] The 'Show More' button should be visible", async () => {
          expect(await doubleCombinationsListSO.moreLabel.getText()).toBe("Mostra più");
        });

        describe("When the user taps the 'Show More' button", () => {
          let DISTANCE_BETWEEN_COMBINATIONS = 0;

          beforeAll(async () => {
            await browser.waitUntilClickableNative(doubleCombinationsListSO.more);
            await doubleCombinationsListSO.more.click();

            DISTANCE_BETWEEN_COMBINATIONS = await getVerticalDistanceBetweenTwoElements(
              doubleCombinationsListSO.lineRows[1],
              doubleCombinationsListSO.lineRows[0],
            );

            await swipeUpElement(sportsbookPlacePanelSO.element, DISTANCE_BETWEEN_COMBINATIONS);

            await browser.waitUntilDisplayed(
              doubleCombinationsListSO.lineRows[5],
              "The last combination is not visible",
            );
          });

          it("[PRPI-3373] The 6 possible combinations should be visible", async () => {
            expect(await doubleCombinationsListSO.lineRows.length).toBe(6);
            expect(await doubleCombinationsListSO.lineRows[5].isDisplayed()).toBe(true);
          });

          it("[PRPI-3374] The 'Show Less' button should be visible", async () => {
            await swipeUpElement(sportsbookPlacePanelSO.element, DISTANCE_BETWEEN_COMBINATIONS);

            await browser.waitUntilDisplayed(
              doubleCombinationsListSO.more,
              "Double's combinations list 'Show Less' button not visible",
            );

            expect(await doubleCombinationsListSO.moreLabel.getText()).toBe("Mostra meno");
          });
        });
      });
    });
  });
});
