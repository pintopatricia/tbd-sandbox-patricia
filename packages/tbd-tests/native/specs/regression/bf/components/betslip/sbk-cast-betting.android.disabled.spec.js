const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeUpElement, swipeLeft, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  SelectionSegmentSO,
  DraggableListSO,
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  CastBetsCardSO,
  HorseRacingRunnerSO,
  PebbleListSO,
  PrimaryButtonSO,
  BetslipDrawerSO,
  PebbleSO,
  SportsbookBetButtonSO,
  BetSegmentsSO,
  SubHeaderSO,
  ForecastTricastSelectionSO,
  BetsSummarySO,
  CurrencyNumberInputFieldSO,
  CastBetSO,
  BetControlsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const minimizedSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();

// Next Races Card
const firstRaceCardSO = new RaceMarketCardSO(genericScreenSO.cards[0]);
const secondRaceCardSO = new RaceMarketCardSO(genericScreenSO.cards[1]);
const firstRaceFirstRunnerSO = new HorseRacingRunnerSO(firstRaceCardSO.runners[0]);
const firstRaceSecondRunnerSO = new HorseRacingRunnerSO(firstRaceCardSO.runners[1]);
const firstRaceThirdRunnerSO = new HorseRacingRunnerSO(firstRaceCardSO.runners[2]);
const secondRaceFirstRunnerSO = new HorseRacingRunnerSO(secondRaceCardSO.runners[0]);
const secondRaceSecondRunnerSO = new HorseRacingRunnerSO(secondRaceCardSO.runners[1]);
const secondRaceThirdRunnerSO = new HorseRacingRunnerSO(secondRaceCardSO.runners[2]);
const firstRaceFirstRunnerBetButtonSO = new SportsbookBetButtonSO(firstRaceFirstRunnerSO.sbkBetButtons[0]);
const firstRaceSecondRunnerBetButtonSO = new SportsbookBetButtonSO(firstRaceSecondRunnerSO.sbkBetButtons[0]);
const firstRaceThirdRunnerBetButtonSO = new SportsbookBetButtonSO(firstRaceThirdRunnerSO.sbkBetButtons[0]);
const secondRaceFirstRunnerBetButtonSO = new SportsbookBetButtonSO(secondRaceFirstRunnerSO.sbkBetButtons[0]);
const secondRaceSecondRunnerBetButtonSO = new SportsbookBetButtonSO(secondRaceSecondRunnerSO.sbkBetButtons[0]);
const secondRaceThirdRunnerBetButtonSO = new SportsbookBetButtonSO(secondRaceThirdRunnerSO.sbkBetButtons[0]);

// place screen objects
const placePanelSO = new SportsbookPlacePanelSO();
const castBetsCardSO = new CastBetsCardSO();
const firstCastBetSO = new CastBetSO(castBetsCardSO.castBets[0]);
const secondCastBetSO = new CastBetSO(castBetsCardSO.castBets[1]);
const firstCastBetControlsSO = new BetControlsSO(firstCastBetSO.element);
const firstCastBetSizeInput = new CurrencyNumberInputFieldSO(firstCastBetSO.element);
const secondCastBetSizeInput = new CurrencyNumberInputFieldSO(secondCastBetSO.element);
const castHeaderSO = new SubHeaderSO(placePanelSO.collapsableSections[0].title);
const firstCastBetDraggableListSO = new DraggableListSO(placePanelSO.element);
const firstSelectionSO = new ForecastTricastSelectionSO(firstCastBetDraggableListSO.items[0]);
const secondSelectionSO = new ForecastTricastSelectionSO(firstCastBetDraggableListSO.items[1]);
const thirdSelectionSO = new ForecastTricastSelectionSO(firstCastBetDraggableListSO.items[2]);

const firstCastBetTypesSO = new PebbleListSO(firstCastBetSO.element);
const firstRaceFirstBetTypeSO = new PebbleSO(firstCastBetTypesSO.pebbleListElements[0]);
const firstRaceSecondBetTypeSO = new PebbleSO(firstCastBetTypesSO.pebbleListElements[1]);
const firstRaceThirdBetTypeSO = new PebbleSO(firstCastBetTypesSO.pebbleListElements[2]);

const placeButtonSO = new PrimaryButtonSO();
const betsSummarySO = new BetsSummarySO(placePanelSO.element);
// receipt screen objects
// Betslip Receipt
const receiptPanelSO = new SportsbookReceiptPanelSO();
const receiptSummarySO = new BetsSummarySO(receiptPanelSO.summary);
const receiptCastHeaderSO = new SubHeaderSO(receiptPanelSO.castsTitle);
const receiptFirstRaceDraggableList = new DraggableListSO(receiptPanelSO.casts[0]);
const receiptSecondRaceDraggableList = new DraggableListSO(receiptPanelSO.casts[1]);
const races = [
  {
    title: receiptPanelSO.castBetTitles[0],
    subtitle: receiptPanelSO.castBetSubtitles[0],
    draggableList: receiptFirstRaceDraggableList,
    firstSelection: new ForecastTricastSelectionSO(receiptFirstRaceDraggableList.items[0]),
    secondSelection: new ForecastTricastSelectionSO(receiptFirstRaceDraggableList.items[1]),
    thirdSelection: new ForecastTricastSelectionSO(receiptFirstRaceDraggableList.items[2]),
    lines: new SelectionSegmentSO(new BetSegmentsSO(receiptPanelSO.casts[0]).odds),
    stake: new SelectionSegmentSO(new BetSegmentsSO(receiptPanelSO.casts[0]).stake),
    returns: new SelectionSegmentSO(new BetSegmentsSO(receiptPanelSO.casts[0]).profit),
  },
  {
    title: receiptPanelSO.castBetTitles[1],
    subtitle: receiptPanelSO.castBetSubtitles[1],
    draggableList: receiptSecondRaceDraggableList,
    firstSelection: new ForecastTricastSelectionSO(receiptSecondRaceDraggableList.items[0]),
    secondSelection: new ForecastTricastSelectionSO(receiptSecondRaceDraggableList.items[1]),
    lines: new SelectionSegmentSO(new BetSegmentsSO(receiptPanelSO.casts[1]).odds),
    stake: new SelectionSegmentSO(new BetSegmentsSO(receiptPanelSO.casts[1]).stake),
    returns: new SelectionSegmentSO(new BetSegmentsSO(receiptPanelSO.casts[1]).profit),
  },
];

const EVENT_TYPE_ID = 7;

const sporstbookRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/1",
    name: "A",
    selectionId: 1,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/2",
    name: "B",
    selectionId: 2,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/3",
    name: "C",
    selectionId: 3,
    handicap: 0,
    resultType: null,
  },
];

const sporstbookRunnersTwo = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.2/1",
    name: "D",
    selectionId: 1,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.2/2",
    name: "E",
    selectionId: 2,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.2/3",
    name: "F",
    selectionId: 3,
    handicap: 0,
    resultType: null,
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 4.2 },
            },
            decimalDisplayOdds: { decimalOdds: 4.2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 2 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 4.2 },
            },
            decimalDisplayOdds: { decimalOdds: 4.2 },
          },
        },
      ],
    },
  ],
};

const RACE_ONE_FIRST_COMBINATION = {
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

const RACE_ONE_FIRST_RUNNER_ODDS = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
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

const RACE_ONE_SECOND_COMBINATION = {
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

const RACE_ONE_SECOND_RUNNER_ODDS = {
  runner: {
    marketId: "924.1",
    selectionId: 2,
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

const RACE_ONE_THIRD_COMBINATION = {
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

  averageOdds: 2,
  winAverageOdds: 2,
  betType: "SINGLE",
};

const RACE_ONE_THIRD_RUNNER_ODDS = {
  runner: {
    marketId: "924.1",
    selectionId: 3,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4.2 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 4.2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
};

const RACE_TWO_FIRST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 1,
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

const RACE_TWO_FIRST_RUNNER_ODDS = {
  runner: {
    marketId: "924.2",
    selectionId: 1,
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

const RACE_TWO_SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 2,
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

const RACE_TWO_SECOND_RUNNER_ODDS = {
  runner: {
    marketId: "924.2",
    selectionId: 2,
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

const RACE_TWO_THIRD_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 3,
        },
      ],
    },
  ],

  averageOdds: 2,
  winAverageOdds: 2,
  betType: "SINGLE",
};

const RACE_TWO_THIRD_RUNNER_ODDS = {
  runner: {
    marketId: "924.2",
    selectionId: 3,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4.2 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 4.2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 1 },
  },
};

const RACE_ONE_FORECAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
        {
          marketId: "924.1",
          selectionId: 2,
        },
      ],

      legType: "FORECAST",
    },
  ],

  betMinStake: 0.1,
  betType: "SINGLE",
};

const RACE_ONE_REVERSE_FORECAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
        {
          marketId: "924.1",
          selectionId: 2,
        },
      ],

      legType: "REVERSE_FORECAST",
    },
  ],

  numLines: 2,
  betMinStake: 0.1,
  betType: "SINGLE",
};

const RACE_ONE_TRICAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
        {
          marketId: "924.1",
          selectionId: 2,
        },
        {
          marketId: "924.1",
          selectionId: 3,
        },
      ],

      legType: "TRICAST",
    },
  ],

  betMinStake: 0.1,
  betType: "SINGLE",
};

const RACE_ONE_COMBINATION_TRICAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
        {
          marketId: "924.1",
          selectionId: 2,
        },
        {
          marketId: "924.1",
          selectionId: 3,
        },
      ],

      legType: "COMBINATION_TRICAST",
    },
  ],

  numLines: 6,
  betMinStake: 0.1,
  betType: "SINGLE",
};

const RACE_ONE_COMBINATION_FORECAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
        {
          marketId: "924.1",
          selectionId: 2,
        },
        {
          marketId: "924.1",
          selectionId: 3,
        },
      ],

      legType: "COMBINATION_FORECAST",
    },
  ],

  betMinStake: 0.1,
  betType: "SINGLE",
};

const RACE_TWO_TRICAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 1,
        },
        {
          marketId: "924.2",
          selectionId: 2,
        },
        {
          marketId: "924.2",
          selectionId: 3,
        },
      ],

      legType: "TRICAST",
    },
  ],

  betMinStake: 0.1,
  betType: "SINGLE",
};

const RACE_TWO_COMBINATION_TRICAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 1,
        },
        {
          marketId: "924.2",
          selectionId: 2,
        },
        {
          marketId: "924.2",
          selectionId: 3,
        },
      ],

      legType: "COMBINATION_TRICAST",
    },
  ],

  numLines: 6,
  betMinStake: 0.1,
  betType: "SINGLE",
};

const RACE_TWO_COMBINATION_FORECAST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 1,
        },
        {
          marketId: "924.2",
          selectionId: 2,
        },
        {
          marketId: "924.2",
          selectionId: 3,
        },
      ],

      legType: "COMBINATION_FORECAST",
    },
  ],

  betMinStake: 0.1,
  betType: "SINGLE",
};

const SINGLE_MOCK = {
  betCombinations: [RACE_ONE_FIRST_COMBINATION],
  runnerOdds: [RACE_ONE_FIRST_RUNNER_ODDS],
};

const ONE_RACE_FORECAST_MOCK = {
  betCombinations: [
    RACE_ONE_FIRST_COMBINATION,
    RACE_ONE_SECOND_COMBINATION,
    RACE_ONE_FORECAST_COMBINATION,
    RACE_ONE_REVERSE_FORECAST_COMBINATION,
  ],

  runnerOdds: [RACE_ONE_FIRST_RUNNER_ODDS, RACE_ONE_SECOND_RUNNER_ODDS],
};

const ONE_RACE_TRICAST_MOCK = {
  betCombinations: [
    RACE_ONE_FIRST_COMBINATION,
    RACE_ONE_SECOND_COMBINATION,
    RACE_ONE_THIRD_COMBINATION,
    RACE_ONE_TRICAST_COMBINATION,
    RACE_ONE_COMBINATION_TRICAST_COMBINATION,
    RACE_ONE_COMBINATION_FORECAST_COMBINATION,
  ],

  runnerOdds: [RACE_ONE_FIRST_RUNNER_ODDS, RACE_ONE_SECOND_RUNNER_ODDS, RACE_ONE_THIRD_RUNNER_ODDS],
};

const TWO_RACES_TRICAST_MOCK = {
  betCombinations: [
    RACE_ONE_FIRST_COMBINATION,
    RACE_ONE_SECOND_COMBINATION,
    RACE_TWO_FIRST_COMBINATION,
    RACE_TWO_SECOND_COMBINATION,
    RACE_TWO_THIRD_COMBINATION,
    RACE_ONE_FORECAST_COMBINATION,
    RACE_ONE_REVERSE_FORECAST_COMBINATION,
    RACE_TWO_TRICAST_COMBINATION,
    RACE_TWO_COMBINATION_TRICAST_COMBINATION,
    RACE_TWO_COMBINATION_FORECAST_COMBINATION,
  ],

  runnerOdds: [
    RACE_ONE_FIRST_RUNNER_ODDS,
    RACE_ONE_SECOND_RUNNER_ODDS,
    RACE_TWO_FIRST_RUNNER_ODDS,
    RACE_TWO_SECOND_RUNNER_ODDS,
    RACE_TWO_THIRD_RUNNER_ODDS,
  ],
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s/7",
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
                      urn: "ppb:sbkMarket:924.1",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061949.1335",
                          startTime: "2020-07-13T13:30:00.000Z",
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
                      runners: sporstbookRunners,
                    },
                    runners: sporstbookRunners,
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T13:30:00.000Z",
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
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 14,
                urn: "ppb:tbd:card:raceMarket:30061950.1400;WIN|3",
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.2",
                      name: "2m3f Nov Stks",
                      marketType: "WIN",
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061950.1400",
                          startTime: "2020-07-13T13:00:00.000Z",
                          name: "14:00 Lingfield",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901909",
                            venue: "Lingfield",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901909",
                          venue: "Lingfield",
                        },
                      },
                      runners: sporstbookRunnersTwo,
                    },
                    runners: sporstbookRunnersTwo,
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061950.1400",
                  startTime: "2020-07-13T13:00:00.000Z",
                  name: "14:00 Lingfield",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061950.1400/1",
                      raceURN: "ppb:race:30061950.1400",
                      selectionId: 1,
                      horse: {
                        name: "D",
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
                      urn: "ppb:tbd:racerunner:30061950.1400/2",
                      raceURN: "ppb:race:30061950.1400",
                      selectionId: 2,
                      horse: {
                        name: "E",
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
                      urn: "ppb:tbd:racerunner:30061950.1400/3",
                      raceURN: "ppb:race:30061950.1400",
                      selectionId: 3,
                      horse: {
                        name: "F",
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
                    urn: "ppb:meeting:29901909",
                    name: "Ling 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Lingfield",
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
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061950.1400;WIN|3",
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
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s/7",
      },
    },
  ],

  sections: [
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    // adding more content so it reaches 100% of the viewporty, remove this after the GenericScreen is fixed
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
  ],
};

const SPB_SUCCESS = {
  result: [
    {
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
        },
        {
          runner: { marketId: "924.1", selectionId: 2 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              { order: 2, runner: { marketId: "924.1", selectionId: 1 } },
              { order: 1, runner: { marketId: "924.1", selectionId: 2 } },
            ],
          },
          legType: "FORECAST",
        },
      ],

      totalStake: 0.1,
    },
    {
      runners: [
        {
          runner: { marketId: "924.2", selectionId: 1 },
        },
        {
          runner: { marketId: "924.2", selectionId: 2 },
        },
        {
          runner: { marketId: "924.2", selectionId: 3 },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              { runner: { marketId: "924.2", selectionId: 1 } },
              { runner: { marketId: "924.2", selectionId: 2 } },
              { runner: { marketId: "924.2", selectionId: 3 } },
            ],
          },
          legType: "COMBINATION_TRICAST",
        },
      ],

      numLines: 6,
      totalStake: 0.6,
    },
  ],
};

describe("Place two forecast/tricast bets", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = `horse-racing/s-${EVENT_TYPE_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(firstRaceCardSO.element, "Waiting for card");
  });

  describe("When user clicks in two HR bet selections from the race 1 and adds a 0.1 stake", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRaceFirstRunnerBetButtonSO.element, "Waiting for bet button");
      await firstRaceFirstRunnerBetButtonSO.element.click();
      await browser.waitUntilDisplayed(placePanelSO.element, "Waiting for betslip single place panel");
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntil(async () => {
        const title = await minimizedSO.title.getText();

        return title.includes("Betslip");
      });
      await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK));
      await firstRaceSecondRunnerBetButtonSO.element.click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");
      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(placePanelSO.element, "Waiting for betslip place panel");

      await firstCastBetSizeInput.setValue("0.1");
      await hideKeyboard();
    });

    it("[PRPI-3958] should have the Forecast title displayed", async () => {
      expect(await castHeaderSO.element.getText()).toEqual("FORECAST");
    });

    it("[PRPI-3959] should have the race time and race name '14:30 Windsor'", async () => {
      expect(await firstCastBetSO.title.getText()).toEqual("14:30 Windsor");
    });

    it("[PRPI-3960] should have two runners", async () => {
      expect(await firstCastBetDraggableListSO.items.length).toEqual(2);
    });

    it("[PRPI-3961] the selection A should have position '1st'", async () => {
      expect(await firstSelectionSO.positionNumber.getText()).toEqual("1");
      expect(await firstSelectionSO.positionOrdinal.getText()).toEqual("st");
    });

    it("[PRPI-3962] the selection A should have runner name '3 A'", async () => {
      expect(await firstSelectionSO.horse.getText()).toEqual("3 A");
    });

    it("[PRPI-3963] the selection A should have a hamburger icon displayed", async () => {
      expect(await firstCastBetDraggableListSO.icons[0].isDisplayed()).toEqual(true);
    });

    it("[PRPI-3964] the selection B should have position '2nd'", async () => {
      expect(await secondSelectionSO.positionNumber.getText()).toEqual("2");
      expect(await secondSelectionSO.positionOrdinal.getText()).toEqual("nd");
    });

    it("[PRPI-3965] the selection B should have runner name '5 B'", async () => {
      expect(await secondSelectionSO.horse.getText()).toEqual("5 B");
    });

    it("[PRPI-3966] the selection B should have a hamburger icon displayed", async () => {
      expect(await firstCastBetDraggableListSO.icons[1].isDisplayed()).toEqual(true);
    });

    it("[PRPI-3967] the dividend bet label should be displayed", async () => {
      expect(await firstCastBetControlsSO.dividend.isDisplayed()).toEqual(true);
    });

    it("[PRPI-3968] the returns should be TBD", async () => {
      expect(await firstCastBetControlsSO.returns.getText()).toEqual("Returns TBD");
    });

    describe("when the user drags the runner A to 2nd place", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(firstCastBetDraggableListSO.icons[1]);
        await swipeUpElement(firstCastBetDraggableListSO.icons[1], 100);
        await browser.waitUntilEquals(firstSelectionSO.horse, "5 B");
      });

      it("[PRPI-3969] the runner B should stay in first place", async () => {
        expect(await firstSelectionSO.positionNumber.getText()).toEqual("1");
        expect(await firstSelectionSO.horse.getText()).toEqual("5 B");
      });

      it("[PRPI-3970] the runner A should stay in second place", async () => {
        expect(await secondSelectionSO.positionNumber.getText()).toEqual("2");
        expect(await secondSelectionSO.horse.getText()).toEqual("3 A");
      });

      describe("when the user clicks on Reverse Forecast chip", () => {
        beforeAll(async () => {
          await firstRaceSecondBetTypeSO.element.click();
          await browser.waitUntilEquals(firstCastBetControlsSO.lines, "2 Lines");
        });

        it("[PRPI-3971] should have no position and horse name", async () => {
          expect(await firstSelectionSO.position.isExisting()).toEqual(false);
          expect(await firstSelectionSO.horse.getText()).toEqual("5 B");
        });

        it("[PRPI-3972] should have no position and horse name", async () => {
          expect(await secondSelectionSO.position.isExisting()).toEqual(false);
          expect(await secondSelectionSO.horse.getText()).toEqual("3 A");
        });

        it("[PRPI-3973] the dividend bet should have 2 lines", async () => {
          expect(await firstCastBetControlsSO.lines.getText()).toEqual("2 Lines");
        });

        it("[PRPI-3974] the stake input field should be empty", async () => {
          // "Stake" placeholder is always visible
          expect(await firstCastBetSizeInput.numberField.getText()).toEqual("");
        });

        it("[PRPI-3975] the returns should be TBD", async () => {
          expect(await firstCastBetControlsSO.returns.getText()).toEqual("Returns TBD");
        });

        describe("when the user adds another selection to betslip and adds a 0.1 stake", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(betslipDrawerSO.header);
            await betslipDrawerSO.header.click();
            await browser.waitUntilEquals(minimizedSO.counter, "2");
            await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_TRICAST_MOCK));
            await firstRaceThirdRunnerBetButtonSO.element.click();

            await browser.waitUntilEquals(minimizedSO.counter, "3");
            await browser.waitUntilClickableNative(minimizedSO.element);
            await minimizedSO.element.click();
            await firstCastBetSizeInput.setValue("0.1");
            await hideKeyboard();
          });

          it("[PRPI-3976] the Tricast, Combination Tricast and Combination Forecast chips should be displayed", async () => {
            expect(await firstRaceFirstBetTypeSO.element.getText()).toEqual("Straight Tricast");
            expect(await firstRaceSecondBetTypeSO.element.getText()).toEqual("Combination Tricast");
            expect(await firstRaceThirdBetTypeSO.element.getText()).toEqual("Combination Forecast");
          });

          it("[PRPI-3976] the runner C selection should be displayed in third place", async () => {
            expect(await thirdSelectionSO.horse.getText()).toEqual("7 C");
          });

          it("[PRPI-3976] the stake input field should have 0.1", async () => {
            expect(await firstCastBetSizeInput.numberField.getText()).toEqual("0.1");
          });

          describe("when the user clicks on Combination Tricast chip", () => {
            beforeAll(async () => {
              await firstRaceSecondBetTypeSO.element.click();
              await browser.waitUntilEquals(firstCastBetControlsSO.lines, "6 Lines");
            });

            it("[PRPI-3976] should have place, runner name", async () => {
              expect(await firstSelectionSO.position.isExisting()).toEqual(false);
              expect(await firstSelectionSO.horse.getText()).toEqual("5 B");
            });

            it("[PRPI-3976] should have place, runner name", async () => {
              expect(await secondSelectionSO.position.isExisting()).toEqual(false);
              expect(await secondSelectionSO.horse.getText()).toEqual("3 A");
            });

            it("[PRPI-3976] should have place, runner name", async () => {
              expect(await thirdSelectionSO.position.isExisting()).toEqual(false);
              expect(await thirdSelectionSO.horse.getText()).toEqual("7 C");
            });

            it("[PRPI-3976] the dividend bet label should have 6 lines", async () => {
              expect(await firstCastBetControlsSO.lines.getText()).toEqual("6 Lines");
            });

            it("[PRPI-3976] the stake input field should be empty", async () => {
              // "Stake" placeholder is always visible
              expect(await firstCastBetSizeInput.numberField.getText()).toEqual("");
            });

            describe("when the user adds a 0.1 stake", () => {
              beforeAll(async () => {
                await firstCastBetSizeInput.setValue("0.1");
                await hideKeyboard();
                await browser.waitUntilEquals(placeButtonSO.label, "Place $0.70 Bet");
              });

              it("[PRPI-3976] the total stake should update to $0.70", async () => {
                expect(await placeButtonSO.label.getText()).toContain("$0.70");
              });

              describe("when the user removes the selection C", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(betslipDrawerSO.header);
                  await betslipDrawerSO.header.click();
                  await browser.waitUntil(async () => {
                    const title = await minimizedSO.title.getText();

                    return title.includes("Betslip");
                  });

                  await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK));
                  await firstRaceThirdRunnerBetButtonSO.element.click();
                  await browser.waitUntilEquals(minimizedSO.counter, "2");
                  await browser.waitUntilClickableNative(minimizedSO.element);
                  await minimizedSO.element.click();
                  await browser.waitUntilDisplayed(castHeaderSO.element, "FORECAST");
                });

                it("[PRPI-3976] two chips should be displayed", async () => {
                  expect(await firstRaceFirstBetTypeSO.element.isDisplayed()).toEqual(true);
                  expect(await firstRaceSecondBetTypeSO.element.isDisplayed()).toEqual(true);
                });

                it("[PRPI-3976] the stake input field should be empty", async () => {
                  // "Stake" placeholder is always visible
                  expect(await firstCastBetSizeInput.numberField.getText()).toEqual("");
                });

                describe("when the user adds three selections from the Lingfield race to betslip", () => {
                  beforeAll(async () => {
                    await browser.waitUntilClickableNative(betslipDrawerSO.header);
                    await betslipDrawerSO.header.click();
                    await browser.waitUntil(async () => {
                      const title = await minimizedSO.title.getText();

                      return title.includes("Betslip");
                    });

                    await swipeLeft(0.8);

                    await secondRaceFirstRunnerBetButtonSO.element.click();
                    await secondRaceSecondRunnerBetButtonSO.element.click();
                    await mockService.mockHttpRequest(getImplyBetsResponse(TWO_RACES_TRICAST_MOCK));
                    await secondRaceThirdRunnerBetButtonSO.element.click();
                    await browser.waitUntilEquals(minimizedSO.counter, "5");
                  });

                  describe("and opens Betslip", () => {
                    beforeAll(async () => {
                      await browser.waitUntilClickableNative(minimizedSO.element);
                      await minimizedSO.element.click();
                      await browser.waitUntilDisplayed(placePanelSO.element, "Waiting for betslip place panel");
                      await browser.waitUntilEquals(firstCastBetSO.title, "14:00 Lingfield");
                    });

                    it("[PRPI-3976] the Lingfield race should be displayed first", async () => {
                      expect(await firstCastBetSO.title.getText()).toEqual("14:00 Lingfield");
                    });

                    it("[PRPI-3976] the Windsor race should be displayed second", async () => {
                      expect(await secondCastBetSO.title.getText()).toEqual("14:30 Windsor");
                    });

                    describe("when the user adds a 0.1 stake on Lingfield race combination tricast", () => {
                      beforeAll(async () => {
                        await firstRaceSecondBetTypeSO.element.click();
                        await browser.waitUntilEquals(firstCastBetControlsSO.lines, "6 Lines");
                        await firstCastBetSizeInput.setValue("0.1");
                        await hideKeyboard();
                        await browser.waitUntilEquals(placeButtonSO.label, "Place $0.60 Bet");
                      });

                      describe("and a 0.1 stake to the Windsor race straight forecast", () => {
                        beforeAll(async () => {
                          await swipeUpElement(firstCastBetControlsSO.lines, 300);
                          await browser.waitUntilDisplayed(
                            secondCastBetSizeInput.numberField,
                            "Waiting for second size input",
                          );
                          await secondCastBetSizeInput.setValue("0.1");
                          await hideKeyboard();
                        });

                        it("[PRPI-3976] the total stake should update to $0.70", async () => {
                          expect(await placeButtonSO.label.getText()).toContain("$0.70");
                        });

                        it("[PRPI-3976] the total returns should update to TBD", async () => {
                          expect(await betsSummarySO.totalReturnsValue.getText()).toEqual("TBD");
                        });

                        describe("when the user clicks on the CTA button", () => {
                          beforeAll(async () => {
                            await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS));
                            await placeButtonSO.element.click();
                            await browser.waitUntilDisplayed(receiptPanelSO.element, "Waiting for receipt panel");
                          });

                          it("[PRPI-3976] the Forecast title should be displayed", async () => {
                            expect(await receiptCastHeaderSO.element.getText()).toEqual("FORECAST");
                          });

                          it("[PRPI-3976] the Lingfield race should be displayed first", async () => {
                            expect(await races[0].title.getText()).toEqual("14:00 Lingfield");
                          });

                          it("[PRPI-3976] the Windsor race should be displayed second", async () => {
                            expect(await races[1].title.getText()).toEqual("14:30 Windsor");
                          });

                          describe("Lingfield race", () => {
                            it("[PRPI-3976] (Lingfield) - the bet type should be Combination Tricast", async () => {
                              expect(await races[0].subtitle.getText()).toEqual("Combination Tricast");
                            });

                            it("[PRPI-3976] (Lingfield) - first runner should be displayed without place, but with runner name", async () => {
                              expect(await races[0].firstSelection.positionNumber.isExisting()).toEqual(false);
                              expect(await races[0].firstSelection.horse.getText()).toEqual("3 D");
                            });

                            it("[PRPI-3976] (Lingfield) - second runner should be displayed without place, but with runner name", async () => {
                              expect(await races[0].secondSelection.positionNumber.isExisting()).toEqual(false);
                              expect(await races[0].secondSelection.horse.getText()).toEqual("5 E");
                            });

                            it("[PRPI-3976] (Lingfield) - third runner should be displayed without place, but with runner name", async () => {
                              expect(await races[0].thirdSelection.positionNumber.isExisting()).toEqual(false);
                              expect(await races[0].thirdSelection.horse.getText()).toEqual("7 F");
                            });

                            it("[PRPI-3976] (Lingfield) - the lines should be 6", async () => {
                              expect(await races[0].lines.value.getText()).toEqual("6");
                            });

                            it("[PRPI-3976] (Lingfield) - the stake should be $0.60", async () => {
                              expect(await races[0].stake.value.getText()).toEqual("$0.60");
                            });

                            it("[PRPI-3976] (Lingfield) - the returns should be TBD", async () => {
                              expect(await races[0].returns.value.getText()).toEqual("TBD");
                            });

                            describe("Windsor race", () => {
                              beforeAll(async () => {
                                await swipeUpElement(races[1].title, 100);
                              });

                              it("[PRPI-3976] (Windsor) - the bet type should be Straight Forecast", async () => {
                                expect(await races[1].subtitle.getText()).toEqual("Straight Forecast");
                              });

                              it("[PRPI-3976] (Windsor) - first runner should be displayed with place and runner name", async () => {
                                expect(await races[1].firstSelection.positionNumber.getText()).toEqual("1");
                                expect(await races[1].firstSelection.horse.getText()).toEqual("5 B");
                              });

                              it("[PRPI-3976] (Windsor) - second runner should be displayed with place and runner name", async () => {
                                expect(await races[1].secondSelection.positionNumber.getText()).toEqual("2");
                                expect(await races[1].secondSelection.horse.getText()).toEqual("3 A");
                              });

                              it("[PRPI-3976] (Windsor) - the lines should be 1", async () => {
                                expect(await races[1].lines.value.getText()).toEqual("1");
                              });

                              it("[PRPI-3976] (Windsor) - the stake should be $0.10", async () => {
                                expect(await races[1].stake.value.getText()).toEqual("$0.10");
                              });

                              it("[PRPI-3976] (Windsor) - the returns should be TBD", async () => {
                                expect(await races[1].returns.value.getText()).toEqual("TBD");
                              });
                            });
                          });

                          it("[PRPI-3976] the total stake should be $0.70", async () => {
                            expect(await receiptSummarySO.leftSegmentValue.getText()).toEqual("$0.70");
                          });

                          it("[PRPI-3976] the total returns should be TBD", async () => {
                            expect(await receiptSummarySO.totalReturnsValue.getText()).toEqual("TBD");
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
      });
    });
  });
});
