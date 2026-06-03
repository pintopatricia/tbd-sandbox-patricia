const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const { swipeDownElement, swipeUpElement } = require("../../../../../helpers/gestures");

const {
  GenericScreenSO,
  SportsbookPlacePanelSO,
  SinglesCardSO,
  SingleSO,
  BetLegsSO,
  MultiplesCardSO,
  CardSO,
  CurrencyNumberInputFieldSO,
  MinimizedSO,
  BetslipDrawerSO,
  HintSO,
  AlertSO,
  PrimaryButtonSO,
  RunnerSO,
  SportsbookMarketSO,
  BetSelectionDetailsSO,
  BetControlsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const sportsbookPlaceSO = new SportsbookPlacePanelSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const thirdSportsbookMarketSO = new SportsbookMarketSO(thirdCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const thirdRunnerSO = new RunnerSO(thirdSportsbookMarketSO.runnerList[0]);
const minimizedSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();
const generalAlert = new AlertSO(sportsbookPlaceSO.element);

const singlesCardSO = new SinglesCardSO();
const firstSingleSO = new SingleSO(singlesCardSO.element);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const firstSingleStakeInputSO = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const firstSingleHintSO = new HintSO(firstSingleControlsSO.element);

const multiplesCardSO = new MultiplesCardSO();
const betLegsSO = new BetLegsSO(multiplesCardSO.element);
const firstMultipleCollapseItemSO = new BetSelectionDetailsSO(betLegsSO.selections[0]);
const firstMultipleSelectionHintSO = new HintSO(firstMultipleCollapseItemSO.element);

const generalMultipleAlert = new AlertSO();
const placeButtonSO = new PrimaryButtonSO();

const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const SECOND_EVENT_ID = 29359891;
const THIRD_EVENT_ID = 29359892;

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48351,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48041,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48051,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58801,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48042,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48052,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58802,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48041,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48051,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58801,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48042,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48052,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58802,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_FOURTH_UPDATE = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      marketStatus: "CLOSED",
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58805,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48351,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.3 },
            },
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48041,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48051,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58801,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      marketStatus: "CLOSED",
      runnerDetails: [
        {
          selectionId: 48042,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 48052,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 58802,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
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
        cardGroupTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Sporting v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID}`,
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
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                          selectionId: 58805,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48351`,
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/58805`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48351`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${SECOND_EVENT_ID}`,
                  home: {
                    name: "2 Sporting",
                  },
                  away: {
                    name: "2 Man Utd",
                  },
                },
                sportevent: {
                  name: "2 Sporting v 2 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${SECOND_EVENT_ID}`,
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
                      urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "2 Sporting v Man Utd",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48041`,
                          selectionId: 48041,
                          name: "2 Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48051`,
                          selectionId: 48051,
                          name: "2 Sporting Too",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58801`,
                          selectionId: 58801,
                          name: "2 The Draw",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48041`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/48051`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/58801`,
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Third Card",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${THIRD_EVENT_ID}`,
                  home: {
                    name: "3 Sporting",
                  },
                  away: {
                    name: "3 Man Utd",
                  },
                },
                sportevent: {
                  name: "3 Sporting v 3 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${THIRD_EVENT_ID}`,
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
                      urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "3 Sporting v Man Utd",
                          urn: `ppb:event:${THIRD_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48042`,
                          selectionId: 48042,
                          name: "3 Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48052`,
                          selectionId: 48052,
                          name: "3 Sporting Too",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/58802`,
                          selectionId: 58802,
                          name: "3 The Draw",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48042`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/48052`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/58802`,
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
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          runnerStatus: "CLOSED",
          selectionId: 48044,
        },
      ],
    },
  ],

  runnerStatus: "CLOSED",
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
    marketId: FIRST_MARKET_ID,
    selectionId: 48044,
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
          marketId: SECOND_MARKET_ID,
          selectionId: 48041,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2,
  winAverageOdds: 2,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 48041,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ALT_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: 48041,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2,
  winAverageOdds: 2,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.5 },
    },
    decimalDisplayOdds: { decimalOdds: 1.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ALT_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 48041,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.5 },
    },
    decimalDisplayOdds: { decimalOdds: 1.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: THIRD_MARKET_ID,
          selectionId: 48042,
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
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: THIRD_MARKET_ID,
    selectionId: 48042,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_ODDS = 6;
const DOUBLE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: DOUBLE_ODDS,
  winAverageOdds: DOUBLE_ODDS,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: DOUBLE_ODDS } },
    decimalDisplayOdds: { decimalOdds: DOUBLE_ODDS },
  },
  betType: "DOUBLE",
};
const DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_COMBINATION],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const DOUBLE_COMBINATION_X_LINES = {
  ...DOUBLE_COMBINATION,
  numLines: 3,
};

const TREBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK, DOUBLE_COMBINATION_X_LINES],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const MARKETS_FIRST_UPDATE = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 48044,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

const MARKETS_SECOND_UPDATE = {
  ...TREBLE_MOCK,
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 48044,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

const MARKETS_THIRD_UPDATE = {
  betCombinations: [SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK, DOUBLE_COMBINATION_X_LINES],
  runnerOdds: [SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const MARKETS_FOURTH_UPDATE = {
  betCombinations: [SECOND_SINGLE_ALT_MOCK, THIRD_SINGLE_MOCK, DOUBLE_COMBINATION_X_LINES],
  runnerOdds: [SECOND_SINGLE_ALT_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: THIRD_MARKET_ID,
        selectionId: 48042,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

describe("Betslip - SBK Market Closed", () => {
  beforeAll(async () => {
    /**
     * Describe when user has an SBK footbal bet
     */
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when user places first bet", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(sportsbookPlaceSO.element, "Waiting for Sportsbook single place panel element");
    });

    describe("when market is closed", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getMarketPrices(SMP_MOCK_FIRST_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE));
        await browser.waitUntilDisplayed(generalAlert.element);
      });

      it("[PRPI-3406] should display 'market closed' notification", async () => {
        expect(await generalAlert.message.getText()).toBe("Market Closed");
      });

      it("[PRPI-3407] should have disabled input field", async () => {
        expect(await firstSingleStakeInputSO.numberField.getAttribute("wdEnabled")).toBe("false");
      });

      describe("when user adds second selection", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(betslipDrawerSO.header);
          await betslipDrawerSO.header.click();
          await swipeUpElement(genericScreenSO.element);
          await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
          await secondRunnerSO.sbkBetButtons[0].click();
        });

        describe("when user adds third selection", () => {
          beforeAll(async () => {
            await swipeUpElement(genericScreenSO.element);
            await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_SECOND_UPDATE, { ignoreLegsOrder: true }));
            await thirdRunnerSO.sbkBetButtons[0].click();
            await browser.waitUntilClickableNative(minimizedSO.element);
            await minimizedSO.element.click();
            await browser.waitUntilDisplayed(multiplesCardSO.element);
          });

          it("[PRPI-3408] should display 'Market Closed' notification", async () => {
            expect(await generalMultipleAlert.message.getText()).toBe("Market Closed");
          });

          it("[PRPI-3409] should show hint 'CLOSED' on the first accordion item", async () => {
            expect(await firstMultipleSelectionHintSO.message.getText()).toBe("CLOSED");
          });

          describe("when user checks first selection", () => {
            beforeAll(async () => {
              await swipeUpElement(multiplesCardSO.element, 200);
              await browser.waitUntilDisplayed(firstSingleHintSO.element);
            });

            it("[PRPI-3410] should show hint 'CLOSED' on first selection single", async () => {
              expect(await firstSingleHintSO.message.getText()).toBe("CLOSED");
            });

            describe("when pressing the remove icon on selection 1", () => {
              beforeAll(async () => {
                await swipeDownElement(firstSingleHintSO.element, 200);
                await mockService.mockHttpRequest(
                  getImplyBetsResponse(MARKETS_THIRD_UPDATE, { ignoreLegsOrder: true }),
                );
                await firstMultipleCollapseItemSO.removeButton.click();
                await browser.waitUntilNotDisplayed(generalMultipleAlert.message);
                await browser.waitUntil(async () => {
                  const betLegs = await betLegsSO.selections.length;
                  return betLegs === 2;
                });
                await browser.waitUntilEquals(firstMultipleCollapseItemSO.title, "2 Sporting");
              });

              it("[PRPI-3411] should not display 'Market Closed' notification", async () => {
                expect(await generalMultipleAlert.message.isDisplayed()).toBe(false);
              });

              it("[PRPI-3411] should have the first selection removed", async () => {
                expect(await betLegsSO.selections.length).toBe(2);
                expect(await firstMultipleCollapseItemSO.title.getText()).toBe("2 Sporting");
              });

              describe("when selection 2 odds change and selection 3 closes", () => {
                beforeAll(async () => {
                  const notification = AlertSO();

                  await mockService.mockHttpRequest(
                    getMarketPrices(SMP_MOCK_FOURTH_UPDATE, { ignoreRequestedMarketIdsMatch: true }),
                  );
                  await mockService.mockHttpRequest(
                    getImplyBetsResponse(MARKETS_FOURTH_UPDATE, { ignoreLegsOrder: true }),
                  );
                  await browser.waitUntilEquals(notification.message, "Odds and availability have changed");
                });

                it("[PRPI-3412] should display 'Odds and availability have changed' notification", async () => {
                  const notification = AlertSO();

                  expect(await notification.message.getText()).toBe("Odds and availability have changed");
                });

                it("[PRPI-3412] should show CTA button with text 'Accept Changes & Place Bet'", async () => {
                  expect(await placeButtonSO.label.getText()).toBe("Accept Changes & Place Bet");
                });
              });
            });
          });
        });
      });
    });
  });
});
