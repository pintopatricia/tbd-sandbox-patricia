const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardSO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.so");

const MockService = require("../../../../../mock-essentials/mocking-service");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { hideKeyboard, swipeUpElement } = require("../../../../../helpers/gestures");
const { advanceToConfirmStep } = require("../../../../../helpers/confirm-bets");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  MultiBetBuilderSO,
  CardSO,
  BetControlsSO,
  BetslipDrawerSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  BetsSummarySO,
  PNLAndWhatIfSO,
  PrimaryButtonSO,
  SecondaryButtonSO,
  AlertSO,
  SelectionsBoardSO,
} = require("../../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const sportsbookMinimizedBetslipSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiBetBuilderSO = new MultiBetBuilderSO(sportsbookPlacePanelSO.element);

const multiplesCardSO = new CardSO(multiBetBuilderSO.element);
const selectionsBoardSO = new SelectionsBoardSO(multiplesCardSO.element);

const betsSummarySO = new BetsSummarySO(sportsbookPlacePanelSO.element);

const betslipDrawerSO = new BetslipDrawerSO();

const multipleControlsSO = new BetControlsSO(sportsbookPlacePanelSO.collapsableSections[0]);

const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const multipleReturnValuesSO = new PNLAndWhatIfSO(multipleControlsSO.returnsValueContainer);

const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const editButtonSO = new SecondaryButtonSO(sportsbookPlacePanelSO.actions[0]);
const confirmButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.actions[1]);

const placeNotificationSO = new AlertSO(sportsbookPlacePanelSO.element);

const firstEventMarketCardSO = new EventMarketCardSO(genericScreenSO.cards[0]);
const secondEventMarketCardSO = new EventMarketCardSO(genericScreenSO.cards[1]);
const thirdEventMarketCardSO = new EventMarketCardSO(genericScreenSO.cards[2]);

const firstMatchOddsCardSO = new CardSO(firstEventMarketCardSO.element);
const secondMatchOddsCardSO = new CardSO(secondEventMarketCardSO.element);
const thirdMatchOddsCard = new CardSO(thirdEventMarketCardSO.element);

const firstSbkMarketSO = new InlineSportsbookMarketSO(firstMatchOddsCardSO.contentWrapper);
const secondSbkMarketSO = new InlineSportsbookMarketSO(secondMatchOddsCardSO.contentWrapper);
const thirdSbkMarketSO = new InlineSportsbookMarketSO(thirdMatchOddsCard.contentWrapper);

const firstSbkRunnerSO = new SportsbookBetButtonSO(firstSbkMarketSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondSbkMarketSO.sbkBetButtons[0]);
const thirdSbkRunnerSO = new SportsbookBetButtonSO(thirdSbkMarketSO.sbkBetButtons[0]);

const mockService = new MockService();

const confirmButtonsElements = {
  placeButtonElement: placeButtonSO.element,
  editButtonElement: editButtonSO.element,
};

const EVENT_TYPE_ID = 1;

const APP_CONTEXT_MOCK = {
  currencyCode: "USD",
  countryCode: "GB",
  loggedIn: "true",
  products: ["sportsbook"],
  throttles: {
    BET_CONFIRMATION_STEP: { isActive: true },
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "11",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "22",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "33",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
      ],
    },
    {
      marketId: "924.3",
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "111",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "222",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: "333",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
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
                  openDate: "2010-10-14T18:45",
                  urn: "ppb:event:29359895",
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
                  urn: "ppb:event:29359896",
                  openDate: "2010-10-14T18:45",
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
                          name: "Team B 2 v Team A 2",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/11",
                          selectionId: 11,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/22",
                          selectionId: 22,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.2/32",
                          selectionId: 33,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/11" },
                      { runnerURN: "ppb:sbkRunner:924.2/22" },
                      { runnerURN: "ppb:sbkRunner:924.2/33" },
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
                    name: "Team B 3",
                  },
                  away: {
                    name: "Team A 3",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:29359897",
                  openDate: "2010-10-14T18:45",
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
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/111",
                          selectionId: 111,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/222",
                          selectionId: 222,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/333",
                          selectionId: 333,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/111" },
                      { runnerURN: "ppb:sbkRunner:924.3/222" },
                      { runnerURN: "ppb:sbkRunner:924.3/333" },
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
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Team A 4 vs Team B 4",
                fixture: {
                  urn: "ppb:fixture:29359898",
                  home: {
                    name: "Team B 4",
                  },
                  away: {
                    name: "Team A 4",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:29359898",
                  openDate: "2010-10-14T18:45",
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
                          name: "Team B 4 v Team A 4",
                          urn: "ppb:event:29359898",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.4/111",
                          selectionId: 111,
                          name: "Team B 4",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.4/222",
                          selectionId: 222,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.4/333",
                          selectionId: 333,
                          name: "Team A 4",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.4/111" },
                      { runnerURN: "ppb:sbkRunner:924.4/222" },
                      { runnerURN: "ppb:sbkRunner:924.4/333" },
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

const FIRST_RUNNER = { marketId: "924.1", selectionId: 1 };
const SECOND_RUNNER = { marketId: "924.2", selectionId: 11 };
const THIRD_RUNNER = { marketId: "924.3", selectionId: 111 };

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FIRST_RUNNER],
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
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [SECOND_RUNNER],
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

const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const TWO_SINGLES_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [THIRD_RUNNER],
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

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
};

const TREBLE_MULTI_SGM_MOCK = {
  betType: "TREBLE",
  features: ["SGM_MULTIPLES"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_MULTI_SGM_MOCK = {
  betType: "DOUBLE",
  features: ["SGM_MULTIPLES"],
  legCombinations: [{ runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const MULTI_BET_BUILDER_MOCK = {
  betCombinations: [TREBLE_MULTI_SGM_MOCK, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const MULTI_BET_BUILDER_MOCK_FAILURES = {
  betCombinations: [DOUBLE_MULTI_SGM_MOCK, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: "924.1",
        selectionId: 1,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      selectionId: "1",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runnerStatus: "SUSPENDED",
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
    {
      selectionId: "2",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
      },
    },
    {
      selectionId: "3",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.3 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
  ],
};

const SMP_MOCK_SECOND_UPDATE = {
  markets: [
    {
      selectionId: "1",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
    {
      selectionId: "2",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
      },
    },
    {
      selectionId: "3",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.3 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      eachwayRunnerOdds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.5 },
        },
      },
    },
  ],
};

describe("Betslip - Confirm SBK Multi Bet Builder", () => {
  beforeAll(async () => {
    const HOME_VIEW_LINK = getStartViewLink("football/s-1");
    await Promise.all([
      mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK)),
      mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
      mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK)),
    ]);

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when user adds 3 selections to the betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(firstSbkRunnerSO.odd, "1.1");
      await firstSbkRunnerSO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting to display single sbk place panel");

      await betslipDrawerSO.header.click();

      await browser.waitUntilDisplayed(
        sportsbookMinimizedBetslipSO.element,
        "Waiting for minimized betslip to be displayed",
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLES_MOCK));

      await browser.waitUntilDisplayed(secondSbkRunnerSO.element, "Second runner bet button not visible");
      await secondSbkRunnerSO.element.click();

      await browser.waitUntilEquals(sportsbookMinimizedBetslipSO.counter, "2");

      await mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK));

      await swipeUpElement(secondSbkRunnerSO.element);

      await browser.waitUntilDisplayed(thirdSbkRunnerSO.element, "Third runner bet button not visible");
      await thirdSbkRunnerSO.element.click();

      await browser.waitUntilEquals(sportsbookMinimizedBetslipSO.counter, "3");

      await sportsbookMinimizedBetslipSO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element);
    });

    it("[PRPI-4041] should have a Treble", async () => {
      expect(await selectionsBoardSO.title.getText()).toBe("Treble");
    });

    describe("when the user adds stake to the Multi Bet Builder", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(
          multipleStakeInputFieldSO.element,
          "Multiple stake field is not clickable",
        );
        await multipleStakeInputFieldSO.element.click();
        await multipleStakeInputFieldSO.setValue("0.12");

        await hideKeyboard();

        await browser.waitUntilEquals(await multipleReturnValuesSO.pnl, "$0.29");
      });

      it("[PRPI-4042] should update the returns values on the selection level", async () => {
        expect(await multipleReturnValuesSO.pnl.getText()).toBe("$0.29");
      });

      it("[PRPI-4043] should update the returns values on the betslip level", async () => {
        expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.29");
      });
    });

    describe("and the user advances to the confirm step", () => {
      beforeAll(async () => {
        await advanceToConfirmStep(confirmButtonsElements);
      });

      it("[PRPI-4044] should display the confirm screen", async () => {
        expect(await editButtonSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4045] should display a Treble", async () => {
        expect(await selectionsBoardSO.title.getText()).toBe("Treble");
      });

      describe("when one of the markets get suspended", () => {
        beforeAll(async () => {
          await Promise.all([
            mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_FIRST_UPDATE)),
            mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK_FAILURES)),
          ]);

          await browser.waitUntilDisplayed(placeNotificationSO.element, "The notification is not displayed");
          await browser.waitUntilEquals(placeNotificationSO.message, "Odds and availability have changed");
        });

        it("[PRPI-4046] should disable the confirm button", async () => {
          expect(await confirmButtonSO.element.isEnabled()).toBe(false);
        });

        describe("and the user clicks the edit button", () => {
          beforeAll(async () => {
            await editButtonSO.element.click();

            await browser.waitUntilNotInDOM(confirmButtonSO.element, "Confirm button is still visible");
          });

          describe("and the user adds a stake to the bet builder multi", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(
                multipleStakeInputFieldSO.element,
                "Multiple stake field is not clickable",
              );
              await multipleStakeInputFieldSO.element.click();
              await multipleStakeInputFieldSO.setValue("0.12");

              await hideKeyboard();

              await browser.waitUntilEquals(await multipleReturnValuesSO.pnl, "$0.29");
            });

            it("[PRPI-4047] should update the return values on the selection level", async () => {
              expect(await multipleReturnValuesSO.pnl.getText()).toBe("$0.29");
            });

            it("[PRPI-4047] should update the return values on the betslip level", async () => {
              expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.29");
            });

            describe("and the user advances to confirm step", () => {
              beforeAll(async () => {
                await advanceToConfirmStep(confirmButtonsElements);
              });

              it("[PRPI-4047] should display the confirm step", async () => {
                expect(await confirmButtonSO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-4047] should have a Double", async () => {
                expect(await selectionsBoardSO.title.getText()).toBe("Double");
              });

              describe("when the suspended market gets available again", () => {
                beforeAll(async () => {
                  await Promise.all([
                    mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SECOND_UPDATE)),
                    mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK)),
                  ]);

                  await browser.waitUntilDisplayed(placeNotificationSO.element, "The notification is not displayed");
                  await browser.waitUntilEquals(placeNotificationSO.message, "Odds and availability have changed");
                });

                it("[PRPI-4047] should disable the confirm button", async () => {
                  expect(await confirmButtonSO.element.isEnabled()).toBe(false);
                });
              });
            });
          });
        });
      });
    });
  });
});
