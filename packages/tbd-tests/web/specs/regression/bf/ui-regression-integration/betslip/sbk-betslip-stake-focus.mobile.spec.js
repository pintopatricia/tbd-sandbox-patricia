const {
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  BetBuildersCardPO,
  BetBuilderPO,
  SportsbookMarketPO,
  SinglePO,
  CardPO,
  RunnerPO,
  CastBetsCardPO,
  CastBetPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  SportsbookPlacePanelPO,
  ScrollableSwimlanePO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const OneLineMultiplePO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.po");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstScrollableSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[2]);

const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const secondEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[1]);
const raceMarketCardPO = new RaceMarketCardPO(firstScrollableSwimlanePO.scrollItems[0]);

const firstMatchOddsCardPO = new CardPO(firstEventMarketCardPO.market);
const secondMatchOddsCardPO = new CardPO(secondEventMarketCardPO.market);
const raceCardPO = new CardPO(raceMarketCardPO.market);

const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCardPO.inlineSportsbookMarket);
const secondSbkMarketPO = new InlineSportsbookMarketPO(secondMatchOddsCardPO.inlineSportsbookMarket);

const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondSbkMarketPO.betButtons[0]);

const firstMarketPO = new SportsbookMarketPO(raceCardPO.sportsbookMarket);

const raceFirstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const raceSecondRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[1]);

const raceFirstRunnerBetButtonPO = new SportsbookBetButtonPO(raceFirstRunnerPO.sportsbookBetButton);
const raceSecondRunnerBetButtonPO = new SportsbookBetButtonPO(raceSecondRunnerPO.sportsbookBetButton);

const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);

const oneLineMultiplePO = new OneLineMultiplePO(sportsbookPlacePanelPO.element);
const oneLineMultipleControlsPO = new BetControlsPO(oneLineMultiplePO.element);

const betBuildersCardPO = new BetBuildersCardPO(sportsbookPlacePanelPO.element);
const betBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const betBuilderControlsPO = new BetControlsPO(betBuilderPO.element);

const castBetsCardPO = new CastBetsCardPO(sportsbookPlacePanelPO.element);
const castBetPO = new CastBetPO(castBetsCardPO.castBets[0]);
const castControlsPO = new BetControlsPO(castBetPO.element);

const sportsbookFirstSingleStakeInputField = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const sportsbookOneLineMultipleStakeInputField = new CurrencyNumberInputFieldPO(
  oneLineMultipleControlsPO.currencyInput,
);
const sportsbookBetBuilderStakeInputField = new CurrencyNumberInputFieldPO(betBuilderControlsPO.currencyInput);
const sportsbookCastStakeInputField = new CurrencyNumberInputFieldPO(castControlsPO.currencyInput);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const MARKET_A_ID = "924.1";
const MARKET_B_ID = "924.2";
const MARKET_C_ID = "924.3";

const SELECTION_A_ID = 1;
const SELECTION_B_ID = 2;
const SELECTION_C_ID = 3;

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_A_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_B_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: MARKET_C_ID,
      runnerDetails: [
        {
          selectionId: String(SELECTION_A_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_B_ID),
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: String(SELECTION_C_ID),
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
                  name: "Team B vs Team A",
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
                      urn: `ppb:sbkMarket:${MARKET_A_ID}`,
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
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_A_ID}/${SELECTION_C_ID}` },
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
                  name: "Team B 2 vs Team A 2",
                  urn: "ppb:event:29359896",
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
                      urn: `ppb:sbkMarket:${MARKET_B_ID}`,
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
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}`,
                          selectionId: SELECTION_A_ID,
                          name: "Team B 2",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}`,
                          selectionId: SELECTION_B_ID,
                          name: "Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}`,
                          selectionId: SELECTION_C_ID,
                          name: "Team A 2",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_A_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_B_ID}` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_B_ID}/${SELECTION_C_ID}` },
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
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
        cardGroupTitle: "Next Races",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 14,
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_C_ID}`,
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "Horse Racing",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061949.1335",
                          startTime: "2020-07-13T14:30:00Z",
                          name: "14:30 Windsor",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
                            venue: "Windsor",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901908",
                          venue: "Windsor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/1`,
                          name: "A",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/2`,
                          name: "B",
                          selectionId: 2,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/3`,
                          name: "C",
                          selectionId: 3,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/1` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/2` },
                      { runnerURN: `ppb:sbkRunner:${MARKET_C_ID}/3` },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T14:30:00Z",
                  name: "14:30 Windsor",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/1",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 1,
                      horse: {
                        name: "A",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/2",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 2,
                      horse: {
                        name: "B",
                        sireName: "DUNADEN (FR)",
                        damName: "CEILIDH BAND",
                        damSireName: "CELTIC SWING",
                        age: 4,
                        color: "BAY",
                        sex: "FILLY",
                      },
                      details: {
                        jockeyName: "Sophie Ralston",
                        trainerName: "Dean Ivory",
                        saddleCloth: 5,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 2,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/3",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 3,
                      horse: {
                        name: "C",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                      },
                      details: {
                        jockeyName: "Oisin Murphy",
                        trainerName: "Saeed bin Suroor",
                        saddleCloth: 7,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 5,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Windsor",
                  },
                },
                numberOfRunnersToDisplay: 3,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
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
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_A_ID,
          selectionId: SELECTION_A_ID,
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
    marketId: MARKET_A_ID,
    selectionId: SELECTION_A_ID,
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
          marketId: MARKET_B_ID,
          selectionId: SELECTION_A_ID,
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

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_B_ID,
    selectionId: SELECTION_A_ID,
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
};

const RACE_FIRST_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_C_ID,
          selectionId: SELECTION_A_ID,
        },
      ],
    },
  ],

  averageOdds: 2,
  winAverageOdds: 2,
  canPlaceEachwayBet: true,
  eachwayAvgOdds: {
    trueOdds: {
      decimalOdds: {
        decimalOdds: 1.5,
      },
    },
  },
  betType: "SINGLE",
};

const RACE_FIRST_RUNNER_ODDS = {
  runner: {
    marketId: MARKET_C_ID,
    selectionId: SELECTION_A_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
  eachwayPlaces: 3,
  placeFraction: {
    numerator: 1,
    denominator: 5,
  },
};

const RACE_SECOND_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_C_ID,
          selectionId: SELECTION_B_ID,
        },
      ],
    },
  ],

  averageOdds: 2,
  winAverageOdds: 2,
  canPlaceEachwayBet: true,
  eachwayAvgOdds: {
    trueOdds: {
      decimalOdds: {
        decimalOdds: 1.5,
      },
    },
  },
  betType: "SINGLE",
};

const RACE_SECOND_RUNNER_ODDS = {
  runner: {
    marketId: MARKET_C_ID,
    selectionId: SELECTION_B_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
  eachwayPlaces: 4,
  placeFraction: {
    numerator: 1,
    denominator: 4,
  },
};

const RACE_FORECAST_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_C_ID,
          selectionId: SELECTION_A_ID,
        },
        {
          marketId: MARKET_C_ID,
          selectionId: SELECTION_B_ID,
        },
      ],

      legType: "FORECAST",
    },
  ],

  betMinStake: 0.1,
  betType: "SINGLE",
};

const ONE_LINE_MULTIPLE_MOCK = {
  betType: "DOUBLE",
  legCombinations: [],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    decimalDisplayOdds: {
      decimalOdds: 2.4,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_BET_BUILDER_MOCK = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_A_ID,
          selectionId: SELECTION_A_ID,
        },
      ],
    },
    {
      runners: [
        {
          marketId: MARKET_B_ID,
          selectionId: SELECTION_A_ID,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const FIRST_IMPLY_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, RACE_FIRST_MOCK, RACE_SECOND_MOCK, RACE_FORECAST_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, RACE_FIRST_RUNNER_ODDS, RACE_SECOND_RUNNER_ODDS],
};

const SECOND_IMPLY_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    RACE_FIRST_MOCK,
    RACE_SECOND_MOCK,
    RACE_FORECAST_MOCK,
    ONE_LINE_MULTIPLE_MOCK,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, RACE_FIRST_RUNNER_ODDS, RACE_SECOND_RUNNER_ODDS, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_IMPLY_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    RACE_FIRST_MOCK,
    RACE_SECOND_MOCK,
    RACE_FORECAST_MOCK,
    ONE_LINE_MULTIPLE_MOCK,
    DOUBLE_BET_BUILDER_MOCK,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, RACE_FIRST_RUNNER_ODDS, RACE_SECOND_RUNNER_ODDS, SECOND_SINGLE_ODDS_MOCK],
};

describe("Stake Field Focus Experience", () => {
  beforeAll(async () => {
    const indexHTML = await getIndexHTML(BFF_MOCK.urn, {
      products: ["sportsbook"],
      STAKE_FOCUS: { isActive: true },
    });

    await Promise.all([
      mockService.mockHttpRequest(indexHTML),
      mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
    ]);

    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
  });

  describe("when one selection is added to betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");
      await firstSbkRunnerPO.sportsbookBetButton.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Single place panel is not being shown");
    });

    it("[PRPI-3992] should focus first stake field", async () => {
      await browser.waitUntilDisplayed(sportsbookFirstSingleStakeInputField.element, "Single stake is not visible");

      await sportsbookFirstSingleStakeInputField.element.scrollIntoView({
        block: "center",
      });

      await browser.waitUntil(async () => sportsbookFirstSingleStakeInputField.numberField.isFocused());
      await browser.waitUntilStopsMoving(sportsbookFirstSingleStakeInputField.numberField);

      expect(await sportsbookFirstSingleStakeInputField.numberField.isFocused()).toBe(true);
    });
  });

  describe("when adding forecast selection to betslip", () => {
    beforeAll(async () => {
      await betslipDrawerPO.header.click();

      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

      await sportPagePO.element.scrollIntoView({
        block: "end",
      });

      await browser.waitUntilDisplayed(
        raceFirstRunnerBetButtonPO.element,
        "First race First runner bet button is not visible",
      );
      await browser.waitUntilDisplayed(
        raceSecondRunnerBetButtonPO.element,
        "First race Second runner bet button is not visible",
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_IMPLY_MOCK));

      await raceFirstRunnerBetButtonPO.element.click();
      await raceSecondRunnerBetButtonPO.element.click();

      await sportsbookMinimizedBetslipPO.element.waitForClickable();
      await sportsbookMinimizedBetslipPO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Betslip is not visible");
    });

    it("[PRPI-3993] should focus forecast stake field", async () => {
      await browser.waitUntilDisplayed(sportsbookCastStakeInputField.element, "Forecast stake is not visible");

      await sportsbookCastStakeInputField.element.scrollIntoView({
        block: "center",
      });

      await browser.waitUntil(async () => sportsbookCastStakeInputField.numberField.isFocused());
      await browser.waitUntilStopsMoving(sportsbookCastStakeInputField.numberField);

      expect(await sportsbookCastStakeInputField.numberField.isFocused()).toBe(true);
    });
  });

  describe("when adding multiple selection to betslip", () => {
    beforeAll(async () => {
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

      await sportPagePO.element.scrollIntoView({
        block: "center",
      });

      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_IMPLY_MOCK));

      await secondSbkRunnerPO.sportsbookBetButton.click();

      await sportsbookMinimizedBetslipPO.element.waitForClickable();
      await sportsbookMinimizedBetslipPO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Betslip is not visible");
    });

    it("[PRPI-3994] should focus one line multiple stake field", async () => {
      await browser.waitUntilDisplayed(
        sportsbookOneLineMultipleStakeInputField.element,
        "Multiples stake is not visible",
      );

      await sportsbookOneLineMultipleStakeInputField.element.scrollIntoView({
        block: "center",
      });

      await browser.waitUntil(async () => sportsbookOneLineMultipleStakeInputField.numberField.isFocused());
      await browser.waitUntilStopsMoving(sportsbookOneLineMultipleStakeInputField.numberField);

      expect(await sportsbookOneLineMultipleStakeInputField.numberField.isFocused()).toBe(true);
    });
  });

  describe("when adding bet builder selection to betslip", () => {
    beforeAll(async () => {
      await betslipDrawerPO.header.click();

      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_IMPLY_MOCK));

      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await secondSbkRunnerPO.sportsbookBetButton.click();
      await secondSbkRunnerPO.sportsbookBetButton.click();

      await sportsbookMinimizedBetslipPO.element.waitForClickable();
      await sportsbookMinimizedBetslipPO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Betslip is not visible");
    });

    it("[PRPI-3995] should focus bet builder stake field", async () => {
      await browser.waitUntilDisplayed(sportsbookBetBuilderStakeInputField.element, "Bet builder stake is not visible");

      await sportsbookBetBuilderStakeInputField.element.scrollIntoView({
        block: "center",
      });

      await browser.waitUntil(async () => sportsbookBetBuilderStakeInputField.numberField.isFocused());
      await browser.waitUntilStopsMoving(sportsbookBetBuilderStakeInputField.numberField);

      expect(await sportsbookBetBuilderStakeInputField.numberField.isFocused()).toBe(true);
    });
  });
});
