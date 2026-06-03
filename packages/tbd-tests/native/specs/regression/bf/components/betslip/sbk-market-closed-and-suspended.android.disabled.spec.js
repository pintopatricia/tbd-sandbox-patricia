const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const { swipeUpElement } = require("../../../../../helpers/gestures");

const {
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
  MinimizedSO,
  BetslipDrawerSO,
  RunnerSO,
  SportsbookMarketSO,
  AlertSO,
  FixedNumberInputFieldSO,
  BetDetailsSO,
  BetControlsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
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

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const singleCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const secondSingleItemMultiplesSO = new SingleSO(singleCardSO.singles[1]);
const secondSingleBetDetailsMultiplesSO = new BetDetailsSO(secondSingleItemMultiplesSO.element);

const thirdSingleItemSO = new SingleSO(singleCardSO.singles[2]);
const thirdSingleItemControlsSO = new BetControlsSO(thirdSingleItemSO.controls);
const thirdSingleFixedSO = new FixedNumberInputFieldSO(thirdSingleItemControlsSO.fixedInput);
const alertSO = new AlertSO(sportsbookPlacePanelSO.element);

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

const SMP_MOCK_SUSPENDED_CLOSED = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      marketStatus: "SUSPENDED",
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
      marketStatus: "CLOSED",
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

const SMP_MOCK_SUSPENDED_CLOSED_MOVEMENT = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      marketStatus: "SUSPENDED",
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
      marketStatus: "CLOSED",
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
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
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

const THIRD_SINGLE_ALT_MOCK = {
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
      decimalOdds: { decimalOdds: 1.5 },
    },
    decimalDisplayOdds: { decimalOdds: 1.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ALT_ODDS_MOCK = {
  runner: {
    marketId: THIRD_MARKET_ID,
    selectionId: 48042,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.5 },
    },
    decimalDisplayOdds: { decimalOdds: 1.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const MARKETS_FIRST_UPDATE = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};
const MARKETS_SECOND_UPDATE = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const MARKETS_THIRD_UPDATE = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [THIRD_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 48044,
      },
      failureCode: "MARKET_SUSPENDED",
    },
    {
      failedRunner: {
        marketId: SECOND_MARKET_ID,
        selectionId: 48041,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

const MARKETS_FOURTH_UPDATE = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_ALT_MOCK],
  runnerOdds: [THIRD_SINGLE_ALT_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 48044,
      },
      failureCode: "MARKET_SUSPENDED",
    },
    {
      failedRunner: {
        marketId: SECOND_MARKET_ID,
        selectionId: 48041,
      },
      failureCode: "MARKET_NOT_FOUND",
    },
  ],
};

const MARKETS_FIFTH_UPDATE = {
  betCombinations: [FIRST_SINGLE_MOCK, THIRD_SINGLE_ALT_MOCK],
  runnerOdds: [THIRD_SINGLE_ALT_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 48044,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const MARKETS_SIXTH_UPDATE = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: 48044,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

describe("Betslip - SBK Market Closed and Suspended", () => {
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
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );
    });

    describe("when user adds second selection", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(betslipDrawerSO.header);
        await betslipDrawerSO.header.click();
        await swipeUpElement(genericScreenSO.element, 350);
        await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE));
        await secondRunnerSO.sbkBetButtons[0].click();
      });

      describe("when user adds third selection", () => {
        beforeAll(async () => {
          await swipeUpElement(genericScreenSO.element, 350);
          await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_SECOND_UPDATE));
          await thirdRunnerSO.sbkBetButtons[0].click();
          await browser.waitUntilClickableNative(minimizedSO.element);
          await minimizedSO.element.click();
          await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element);
        });

        describe("when selection 1 suspends and selection 2 closes", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_SUSPENDED_CLOSED, { ignoreRequestedMarketIdsMatch: true }),
            );
            await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_THIRD_UPDATE));
            await browser.waitUntilDisplayed(alertSO.message);
          });

          it("[PRPI-3403] should show notification with 'Availability of selections has changed' text", async () => {
            expect(await alertSO.message.getText()).toBe("Availability of selections has changed");
          });

          describe("when selection 3 odds are changed", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getMarketPrices(SMP_MOCK_SUSPENDED_CLOSED_MOVEMENT, { ignoreRequestedMarketIdsMatch: true }),
              );
              await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FOURTH_UPDATE));
              await swipeUpElement(secondSingleBetDetailsMultiplesSO.action, 200);
              await browser.waitUntilDisplayed(thirdSingleFixedSO.oddsMovement);
            });

            it("[PRPI-3404] should show notification with 'Odds and availability have changed' text", async () => {
              expect(await alertSO.message.getText()).toBe("Odds and availability have changed");
            });

            describe("when user removes selection 2", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIFTH_UPDATE));
                await secondSingleBetDetailsMultiplesSO.action.click();
              });

              it("[PRPI-3405] should show notification with 'Odds and availability have changed' text", async () => {
                expect(await alertSO.message.getText()).toBe("Odds and availability have changed");
              });

              describe("when user removes selection 3", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_SIXTH_UPDATE));
                  await secondSingleBetDetailsMultiplesSO.action.click();
                  await browser.waitUntilDisplayed(alertSO.message);
                });

                it("[PRPI-3405] should show notification with 'Market Suspended' text", async () => {
                  expect(await alertSO.message.getText()).toBe("Market Suspended");
                });
              });
            });
          });
        });
      });
    });
  });
});
