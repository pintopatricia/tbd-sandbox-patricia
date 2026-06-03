const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeDownElement, swipeUpElement, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  FreeBetsCardLabelSO,
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  MultiplesCardSO,
  CardSO,
  RunnerSO,
  SportsbookMarketSO,
  BetslipDrawerSO,
  FixedNumberInputFieldSO,
  BetControlsSO,
  AccaInsuranceSO,
  OptionSO,
  FreeBetsSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetSummarySO,
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
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.collapsableSections[0]);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);
const freeBetsSO = new FreeBetsSO();
const freeBetsCardLabelSO = new FreeBetsCardLabelSO();
const freeBetsOptionSO = new OptionSO(freeBetsSO.element);
const eachWayOptionSO = new OptionSO(multipleControlsSO.eachWay);
const accaInsuranceSO = new AccaInsuranceSO(multipleControlsSO.accaInsurance);
const accaInsuranceOptionSO = new OptionSO(accaInsuranceSO.element);
const oddsInputFieldSO = new FixedNumberInputFieldSO(multipleControlsSO.fixedInput);
const primaryButtonSO = new PrimaryButtonSO();
const currencyNumberFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const firstCombinationSummarySO = new BetSummarySO(sportsbookReceiptPanelSO.multiples[0]);

const EVENT_TYPE_ID = 1;
const FIRST_EVENT_ID = 1;
const SECOND_EVENT_ID = 2;
const THIRD_EVENT_ID = 3;
const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";
const THIRD_MARKET_ID = "924.3";

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      eachwayAvailable: true,
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
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.2 },
            },
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "3",
          noOdds: true,
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "4",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.1 },
            },
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "5",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.2 },
            },
            decimalDisplayOdds: { decimalOdds: 2.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "6",
          noOdds: true,
        },
      ],
    },
    {
      marketId: THIRD_MARKET_ID,
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: "7",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3.1 },
            },
            decimalDisplayOdds: { decimalOdds: 3.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "8",
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3.2 },
            },
            decimalDisplayOdds: { decimalOdds: 3.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
        },
        {
          selectionId: "9",
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
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${FIRST_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
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
                      runners: [
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
                      ],
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${SECOND_EVENT_ID}`,
                  home: {
                    name: "Porto",
                  },
                  away: {
                    name: "West Ham",
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
                      urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Porto v West Ham",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                          selectionId: 4,
                          name: "Porto",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                          selectionId: 5,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
                          selectionId: 6,
                          name: "West Ham",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/4`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/5`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/6`,
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
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "MarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${THIRD_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${THIRD_EVENT_ID}`,
                  home: {
                    name: "Ermesinde",
                  },
                  away: {
                    name: "Astrumil",
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
                      urn: `ppb:sbkMarket:${THIRD_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Ermesinde v Astrumil",
                          urn: `ppb:event:${THIRD_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/7`,
                          selectionId: 7,
                          name: "Ermesinde",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/8`,
                          selectionId: 8,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/9`,
                          selectionId: 9,
                          name: "Astrumil",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/7`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/8`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${THIRD_MARKET_ID}/9`,
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
    marketId: FIRST_MARKET_ID,
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
          marketId: SECOND_MARKET_ID,
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 2.1,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: THIRD_MARKET_ID,
          selectionId: 7,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 3.1,
  winAverageOdds: 3.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.1 },
    },
    decimalDisplayOdds: { decimalOdds: 3.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: THIRD_MARKET_ID,
    selectionId: 7,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3.1 },
    },
    decimalDisplayOdds: { decimalOdds: 3.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
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
      numLines: 1,
      hasBonusMoney: true,
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

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      hasBonusMoney: true,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      accaInsuranceOffer: {
        decimalDisplayOdds: {
          decimalOdds: 2,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2 },
        },
      },
    },
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 2.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 2.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 3,
    },
    {
      betType: "TRIXIE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 3.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 3.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 3.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 3.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 4,
    },
    {
      betType: "PATENT",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 4.1,
      canPlaceEachwayBet: true,
      winAverageOdds: 4.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 4.1,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 4.1 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      numLines: 7,
    },
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2 },
        fractionalDisplayOdds: { numerator: 1, denominator: 1 },
      },
      betModifiers: ["ACCA_INSURANCE"],
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: "924.2", selectionId: 11 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: "924.3", selectionId: 111 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 4 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.3", selectionId: 7 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 0.24,
    },
  ],
};

describe("Betslip - SBK ACCA insurance", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("When user adds 3 selections to the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));

      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));

      await swipeUpElement(firstRunnerSO.element, 700); // display both second and third card

      await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
      await secondRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");

      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));

      await browser.waitUntilClickableNative(thirdRunnerSO.sbkBetButtons[0]);
      await thirdRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilEquals(minimizedSO.counter, "3");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook place panel element");
    });

    it("[PRPI-3309] should have free bets checkbox unselected", async () => {
      expect(await freeBetsOptionSO.checkbox.getAttribute("selected")).toBe("false");
    });

    describe("on the betslip bottom", () => {
      beforeAll(async () => {
        await swipeUpElement(multiplesCardSO.element, 410); // ensure acca is visible
      });

      it("[PRPI-3310] the each way checkbox is not selected", async () => {
        expect(await eachWayOptionSO.checkbox.getAttribute("selected")).toBe("false");
      });

      it("[PRPI-3311] should have ACCA Insurance title", async () => {
        expect(await accaInsuranceOptionSO.title.getText()).toBe("Apply ACCA Edge");
      });

      it("[PRPI-3312] should have ACCA Insurance subtitle and terms link", async () => {
        expect(await accaInsuranceOptionSO.subtitle.getText()).toBe(
          "Get your stake back in cash if one leg lets you down. T&C’s apply",
        );
      });

      it("[PRPI-3313] should have ACCA Insurance checkbox unchecked", async () => {
        expect(await accaInsuranceOptionSO.checkbox.getAttribute("selected")).toBe("false");
      });

      it("[PRPI-3314] should display the correct odds without ACCA Insurance", async () => {
        expect(await oddsInputFieldSO.numberField.getText()).toBe("1.1");
      });

      describe("when the user clicks on ACCA Insurance checkbox", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(accaInsuranceOptionSO.checkbox);
          await accaInsuranceOptionSO.checkbox.click();
          await browser.waitUntilEquals(accaInsuranceOptionSO.title, "ACCA Edge Applied");
        });

        it("[PRPI-3315] should have ACCA Insurance checkbox selected", async () => {
          expect(await accaInsuranceOptionSO.checkbox.getAttribute("selected")).toBe("true");
        });

        it("[PRPI-3316] should have ACCA Insurance title as ACCA Edge Applied", async () => {
          expect(await accaInsuranceOptionSO.title.getText()).toBe("ACCA Edge Applied");
        });

        it("[PRPI-3317] should update the odds", async () => {
          expect(await oddsInputFieldSO.numberField.getText()).toBe("2");
        });

        describe("when the user clicks on EW checkbox", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(eachWayOptionSO.checkbox);
            await eachWayOptionSO.checkbox.click();
            await browser.waitUntilEquals(accaInsuranceOptionSO.title, "Apply ACCA Edge");
          });

          it("[PRPI-3318] should have each way checkbox selected", async () => {
            expect(await eachWayOptionSO.checkbox.getAttribute("selected")).toBe("true");
          });

          it("[PRPI-3319] should have acca insurance checkbox unselected", async () => {
            expect(await accaInsuranceOptionSO.checkbox.getAttribute("selected")).toBe("false");
          });

          describe("when the user clicks on acca insurance checkbox", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(accaInsuranceOptionSO.checkbox);
              await accaInsuranceOptionSO.checkbox.click();
              await browser.waitUntilEquals(accaInsuranceOptionSO.title, "ACCA Edge Applied");
            });

            it("[PRPI-3320] should have each way checkbox unselected", async () => {
              expect(await eachWayOptionSO.checkbox.getAttribute("selected")).toBe("false");
            });

            describe("when the user set a $0.12 stake", () => {
              beforeAll(async () => {
                await swipeDownElement(accaInsuranceOptionSO.checkbox, 150);
                await browser.waitUntilClickableNative(currencyNumberFieldSO.numberField);
                await currencyNumberFieldSO.numberField.click();
                await currencyNumberFieldSO.numberField.setValue(0.12);
                await hideKeyboard();
              });

              it("[PRPI-3321] should show the place bet button", async () => {
                expect(await primaryButtonSO.element.isDisplayed()).toBe(true);
              });

              describe("when the user clicks on the free bets checkbox and inserts a valid stake", () => {
                beforeAll(async () => {
                  await swipeDownElement(multiplesCardSO.element, 600); // to the top

                  await browser.waitUntilClickableNative(freeBetsOptionSO.checkbox);
                  await freeBetsOptionSO.checkbox.click();

                  await swipeUpElement(multiplesCardSO.element, 600); // make freeBetsCardLabelSO visible
                  await browser.waitUntilEquals(freeBetsCardLabelSO.element, "Free Bet Ineligible");
                });

                it("[PRPI-3321] should have 'Free Bet Ineligible' label", async () => {
                  expect(await freeBetsCardLabelSO.element.getText()).toBe("Free Bet Ineligible");
                });

                describe("when the user press place button", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
                    await browser.waitUntilClickableNative(primaryButtonSO.element);
                    await primaryButtonSO.element.click();
                    await browser.waitUntilDisplayed(
                      sportsbookReceiptPanelSO.element,
                      "Receipt panel is not displayed",
                    );

                    await swipeUpElement(sportsbookReceiptPanelSO.element, 500); // to the bottom
                  });

                  it("[PRPI-3321] should have ACCA Insurance label", async () => {
                    expect(await firstCombinationSummarySO.accaLabel.getText()).toBe("ACCA Edge Applied");
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
