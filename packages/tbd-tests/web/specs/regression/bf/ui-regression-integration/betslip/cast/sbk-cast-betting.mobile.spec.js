const {
  AppPO,
  MinimizedPO,
  SportPagePO,
  CastBetsCardPO,
  ScrollableSwimlanePO,
  SportsbookReceiptPanelPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  BetSegmentsPO,
  BetsSummaryPO,
  CastBetPO,
  ForecastTricastSelectionPO,
  SubHeaderPO,
  PebbleListPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  BetControlsPO,
  SportsbookPlacePanelPO,
  DraggableListPO,
  DraggableListItemPO,
  PebblePO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPage = new SportPagePO();
const firstScrollableSwimlane = new ScrollableSwimlanePO(sportPage.scrollableSwimlanes[0]);
const firstRaceMarketCardPO = new RaceMarketCardPO(firstScrollableSwimlane.scrollItems[0]);
const secondRaceMarketCardPO = new RaceMarketCardPO(firstScrollableSwimlane.scrollItems[1]);

// Next Races Card
const firstRaceCardPO = new CardPO(firstRaceMarketCardPO.market);
const secondRaceCardPO = new CardPO(secondRaceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const secondMarketPO = new SportsbookMarketPO(secondRaceCardPO.sportsbookMarket);
const firstRaceFirstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const firstRaceSecondRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[1]);
const firstRaceThirdRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[2]);
const secondRaceFirstRunnerPO = new RunnerPO(secondMarketPO.horseRacingRunnerList[0]);
const secondRaceSecondRunnerPO = new RunnerPO(secondMarketPO.horseRacingRunnerList[1]);
const secondRaceThirdRunnerPO = new RunnerPO(secondMarketPO.horseRacingRunnerList[2]);
const firstRaceFirstRunnerBetButtonPO = new SportsbookBetButtonPO(firstRaceFirstRunnerPO.sportsbookBetButton);
const firstRaceSecondRunnerBetButtonPO = new SportsbookBetButtonPO(firstRaceSecondRunnerPO.sportsbookBetButton);
const firstRaceThirdRunnerBetButtonPO = new SportsbookBetButtonPO(firstRaceThirdRunnerPO.sportsbookBetButton);
const secondRaceFirstRunnerBetButtonPO = new SportsbookBetButtonPO(secondRaceFirstRunnerPO.sportsbookBetButton);
const secondRaceSecondRunnerBetButtonPO = new SportsbookBetButtonPO(secondRaceSecondRunnerPO.sportsbookBetButton);
const secondRaceThirdRunnerBetButtonPO = new SportsbookBetButtonPO(secondRaceThirdRunnerPO.sportsbookBetButton);

// Betslip Receipt
const receiptPanelPO = new SportsbookReceiptPanelPO();
const receiptSummaryPO = new BetsSummaryPO(receiptPanelPO.summary);
const receiptCastHeaderPO = new SubHeaderPO(receiptPanelPO.castsTitle);
const receiptFirstRaceDraggableList = new DraggableListPO(receiptPanelPO.casts[0]);
const receiptSecondRaceDraggableList = new DraggableListPO(receiptPanelPO.casts[1]);
const races = [
  {
    title: receiptPanelPO.castBetTitles[0],
    subtitle: receiptPanelPO.castBetSubtitles[0],
    draggableList: receiptFirstRaceDraggableList,
    firstSelection: new ForecastTricastSelectionPO(receiptFirstRaceDraggableList.items[0]),
    secondSelection: new ForecastTricastSelectionPO(receiptFirstRaceDraggableList.items[1]),
    thirdSelection: new ForecastTricastSelectionPO(receiptFirstRaceDraggableList.items[2]),
    segments: new BetSegmentsPO(receiptPanelPO.casts[0]),
  },
  {
    title: receiptPanelPO.castBetTitles[1],
    subtitle: receiptPanelPO.castBetSubtitles[1],
    draggableList: receiptSecondRaceDraggableList,
    firstSelection: new ForecastTricastSelectionPO(receiptSecondRaceDraggableList.items[0]),
    secondSelection: new ForecastTricastSelectionPO(receiptSecondRaceDraggableList.items[1]),
    segments: new BetSegmentsPO(receiptPanelPO.casts[1]),
  },
];

// Betslip Place
const placePanelPO = new SportsbookPlacePanelPO();
const summaryPO = new BetsSummaryPO(placePanelPO.summary);
const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const castBetsCardPO = new CastBetsCardPO(placePanelPO.element);
const castHeaderPO = new CardPO(placePanelPO.collapsableSections[0]);
const firstCastBetPO = new CastBetPO(castBetsCardPO.castBets[0]);
const secondCastBetPO = new CastBetPO(castBetsCardPO.castBets[1]);
const firstCastBetTypesPO = new PebbleListPO(firstCastBetPO.element);
const firstRaceFirstBetTypePO = new PebblePO(firstCastBetTypesPO.pebbles[0]);
const firstRaceSecondBetTypePO = new PebblePO(firstCastBetTypesPO.pebbles[1]);
const firstRaceThirdBetTypePO = new PebblePO(firstCastBetTypesPO.pebbles[2]);
const draggableList = new DraggableListPO(firstCastBetPO.element);
const firstSelectionPO = new ForecastTricastSelectionPO(draggableList.items[0]);
const firstDraggableItemPO = new DraggableListItemPO(draggableList.items[0]);
const secondSelectionPO = new ForecastTricastSelectionPO(draggableList.items[1]);
const secondDraggableItemPO = new DraggableListItemPO(draggableList.items[1]);
const thirdSelectionPO = new ForecastTricastSelectionPO(draggableList.items[2]);
const thirdDraggableItemPO = new DraggableListItemPO(draggableList.items[2]);
const firstCastControlsPO = new BetControlsPO(firstCastBetPO.element);
const secondCastControlsPO = new BetControlsPO(secondCastBetPO.element);
const firstStakePO = new CurrencyNumberInputFieldPO(firstCastControlsPO.currencyInput);
const secondStakePO = new CurrencyNumberInputFieldPO(secondCastControlsPO.currencyInput);
const placeButton = new PrimaryButtonPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 7;

const sporstBookRunners = [
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

const sporstBookRunnersTwo = [
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

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  title: "Horse Racing",
  edges: [
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
                      urn: "ppb:sbkMarket:924.1",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      sport: {
                        __typename: "Sport",
                        name: "Horse Racing",
                        sportId: 7,
                        urn: "ppb:eventType:7",
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
                      runners: sporstBookRunners,
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1/1" },
                      { runnerURN: "ppb:sbkRunner:924.1/2" },
                      { runnerURN: "ppb:sbkRunner:924.1/3" },
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
                      sport: {
                        __typename: "Sport",
                        name: "Horse Racing",
                        sportId: 7,
                        urn: "ppb:eventType:7",
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061950.1400",
                          startTime: "2020-07-13T14:00:00Z",
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
                      runners: sporstBookRunnersTwo,
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/1" },
                      { runnerURN: "ppb:sbkRunner:924.2/2" },
                      { runnerURN: "ppb:sbkRunner:924.2/3" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061950.1400",
                  startTime: "2020-07-13T14:00:00Z",
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
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
      },
    },
  ],
};

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
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
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
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
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
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 16, denominator: 5 },
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
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
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
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
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
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 16, denominator: 5 },
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

const TWO_RACES_TRICAST_MOCK_SECTION_ONE = {
  betCombinations: [RACE_ONE_FIRST_COMBINATION, RACE_ONE_SECOND_COMBINATION, RACE_TWO_FIRST_COMBINATION],
  runnerOdds: [RACE_ONE_FIRST_RUNNER_ODDS, RACE_ONE_SECOND_RUNNER_ODDS, RACE_TWO_FIRST_RUNNER_ODDS],
};
const TWO_RACES_TRICAST_MOCK_SECTION_TWO = {
  betCombinations: [
    RACE_ONE_FIRST_COMBINATION,
    RACE_ONE_SECOND_COMBINATION,
    RACE_TWO_FIRST_COMBINATION,
    RACE_TWO_SECOND_COMBINATION,
  ],

  runnerOdds: [
    RACE_ONE_FIRST_RUNNER_ODDS,
    RACE_ONE_SECOND_RUNNER_ODDS,
    RACE_TWO_FIRST_RUNNER_ODDS,
    RACE_TWO_SECOND_RUNNER_ODDS,
  ],
};

const TWO_RACES_TRICAST_MOCK_FINAL = {
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

describe("Forecast/tricast", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_VIEW_MOCK.urn, {
        currentUrl: routes.getRacingViewUrl(),
      }),
    );
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await browser.url(`${routes.getRacingViewUrl()}`);

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: firstRaceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
  });

  describe("When user clicks in two HR bet selections from the Windsor race and add a 0.1 stake", () => {
    beforeAll(async () => {
      await firstRaceFirstRunnerBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
      await betslipDrawerPO.header.click();
      await browser.waitUntilEquals(minimizedPO.title, "$10.00 Single @ 2 returns $20.00");

      await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK));
      await firstRaceSecondRunnerBetButtonPO.element.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");
      await minimizedPO.element.click();

      await browser.waitUntilDisplayed(firstStakePO.element);

      await firstStakePO.numberField.waitForClickable();
      await firstStakePO.numberField.click();
      await firstStakePO.setValue("0.1");
      await browser.waitUntilEquals(firstStakePO.numberField, "0.1");
    });

    it("[PRPI-8584] should have the place panel displayed", async () => {
      expect(await placePanelPO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8585] should have the Forecast title displayed", async () => {
      expect(await castHeaderPO.title.getText()).toEqual("FORECAST");
    });

    it("[PRPI-8586] should have the race time and race name '15:30 Windsor'", async () => {
      expect(await firstCastBetPO.title.getText()).toEqual("15:30 Windsor");
    });

    it("[PRPI-8587] should have the Straight Forecast chip selected", async () => {
      expect(await browser.containsClass(firstRaceFirstBetTypePO.element, PebblePO.states.active)).toEqual(true);
    });

    it("[PRPI-8588] should have the Reverse Forecast chip displayed", async () => {
      expect(await browser.containsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active)).toEqual(false);
      expect(await firstRaceSecondBetTypePO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8589] should have two runners", async () => {
      expect(await draggableList.items.length).toEqual(2);
    });

    it("[PRPI-8590] the selection A should have position '1st'", async () => {
      expect(await firstSelectionPO.positionNumber.getText()).toEqual("1st");
    });

    it("[PRPI-8591] the selection A should have runner name '3 A'", async () => {
      expect(await firstSelectionPO.horse.getText()).toEqual("3 A");
    });

    it("[PRPI-8592] the selection A should have a silk", async () => {
      expect(await firstSelectionPO.silk.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8593] the selection A should have a hamburger icon displayed", async () => {
      expect(await firstDraggableItemPO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8594] the selection B should have position '2nd'", async () => {
      expect(await secondSelectionPO.positionNumber.getText()).toEqual("2nd");
    });

    it("[PRPI-8595] the selection B should have runner name '5 B'", async () => {
      expect(await secondSelectionPO.horse.getText()).toEqual("5 B");
    });

    it("[PRPI-8596] the selection B should have a silk", async () => {
      expect(await secondSelectionPO.silk.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8597] the selection B should have a hamburger icon displayed", async () => {
      expect(await secondDraggableItemPO.icon.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8598] the dividend bet label should be displayed", async () => {
      expect(await firstCastControlsPO.dividend.isDisplayed()).toEqual(true);
    });

    it("[PRPI-8599] the returns should be TBD", async () => {
      expect(await firstCastControlsPO.returns.getText()).toEqual("Returns TBD");
    });

    it("[PRPI-8600] the total stake should update to $0.10", async () => {
      expect(await placeButton.label.getText()).toContain("$0.10");
    });

    it("[PRPI-8601] the total returns should update to TBD", async () => {
      expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
    });

    describe("When the user drags the runner A to 2nd place", () => {
      beforeAll(async () => {
        const { height } = await firstSelectionPO.element.getSize();

        await firstDraggableItemPO.icon.dragAndDrop({ x: 0, y: height + 10 });
        await browser.waitUntilEquals(firstSelectionPO.positionNumber, "1st");
      });

      it("[PRPI-8602] the runner B should stay in first place", async () => {
        expect(await firstSelectionPO.positionNumber.getText()).toEqual("1st");
        expect(await firstSelectionPO.horse.getText()).toEqual("5 B");
      });

      it("[PRPI-8603] the runner A should stay in second place", async () => {
        expect(await secondSelectionPO.positionNumber.getText()).toEqual("2nd");
        expect(await secondSelectionPO.horse.getText()).toEqual("3 A");
      });

      describe("When the user clicks on Reverse Forecast chip", () => {
        beforeAll(async () => {
          await firstRaceSecondBetTypePO.element.click();
          await browser.waitUntilContainsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active);
        });

        it("[PRPI-8604] each selection should have silk, runner name but no hamburger icon or place", async () => {
          expect(await firstSelectionPO.positionNumber.isExisting()).toEqual(false);
          expect(await firstSelectionPO.silk.isDisplayed()).toEqual(true);
          expect(await firstSelectionPO.horse.getText()).toEqual("5 B");
          expect(await secondSelectionPO.positionNumber.isExisting()).toEqual(false);
          expect(await secondSelectionPO.silk.isDisplayed()).toEqual(true);
          expect(await secondSelectionPO.horse.getText()).toEqual("3 A");
          expect(await firstDraggableItemPO.icon.isDisplayed()).toEqual(false);
          expect(await secondDraggableItemPO.icon.isDisplayed()).toEqual(false);
        });

        it("[PRPI-8605] the dividend bet should have 2 lines", async () => {
          expect(await firstCastControlsPO.lines.getText()).toEqual("2 Lines");
        });

        it("[PRPI-8606] the stake input field should be empty", async () => {
          expect(await firstStakePO.numberField.getValue()).toEqual("");
        });

        it("[PRPI-8607] the returns should be TBD", async () => {
          expect(await firstCastControlsPO.returns.getText()).toEqual("Returns TBD");
        });

        describe("When the user adds a 0.1 stake", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(firstStakePO.element);

            await firstStakePO.numberField.waitForClickable();
            await firstStakePO.numberField.click();
            await firstStakePO.setValue("0.1");
          });

          it("[PRPI-8608] the total stake should update to $0.30", async () => {
            expect(await placeButton.label.getText()).toContain("$0.30");
          });

          it("[PRPI-8608] the total returns should remain TBD", async () => {
            expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
          });

          describe("When the user adds another selection to betslip and adds a 0.1 stake", () => {
            beforeAll(async () => {
              await betslipDrawerPO.header.click();
              await browser.waitUntilEquals(minimizedPO.title, "Betslip");

              await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_TRICAST_MOCK));

              await firstRaceThirdRunnerBetButtonPO.element.click();
              await browser.waitUntilEquals(minimizedPO.counter, "3");
              await minimizedPO.element.click();

              await browser.waitUntilDisplayed(firstStakePO.element);

              await firstStakePO.numberField.waitForClickable();
              await firstStakePO.numberField.click();
              await firstStakePO.setValue("0.1");
            });

            it("[PRPI-8609] the Tricast, Combination Tricast and Combination Forecast chips should be displayed", async () => {
              expect(await firstRaceFirstBetTypePO.element.getText()).toEqual("Straight Tricast");
              expect(await firstRaceSecondBetTypePO.element.getText()).toEqual("Combination Tricast");
              expect(await firstRaceThirdBetTypePO.element.getText()).toEqual("Combination Forecast");
            });

            it("[PRPI-8609] the Tricast chip should be selected", async () => {
              const isTricastPebbleSelected = await browser.containsClass(
                firstRaceFirstBetTypePO.element,
                PebblePO.states.active,
              );

              expect(isTricastPebbleSelected).toEqual(true);
            });

            it("[PRPI-8609] the runner C selection should be displayed in third place", async () => {
              expect(await thirdSelectionPO.horse.getText()).toEqual("7 C");
            });

            it("[PRPI-8609] the dividend bet label should have 1 line", async () => {
              expect(await firstCastControlsPO.lines.getText()).toEqual("1 Lines");
            });

            it("[PRPI-8609] the stake input field should have 0.1", async () => {
              expect(await firstStakePO.numberField.getValue()).toEqual("0.1");
            });

            it("[PRPI-8609] the returns should be TBD", async () => {
              expect(await firstCastControlsPO.returns.getText()).toEqual("Returns TBD");
            });

            it("[PRPI-8609] the total stake should update to $0.10", async () => {
              expect(await placeButton.label.getText()).toContain("$0.10");
            });

            it("[PRPI-8609] the total returns should remain TBD", async () => {
              expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
            });

            describe("When the user clicks on Combination Tricast chip", () => {
              beforeAll(async () => {
                await firstRaceSecondBetTypePO.element.click();
                await browser.waitUntilContainsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active);
              });

              it("[PRPI-8609] the Combination Tricast chip should be selected", async () => {
                const isCombinationPebbleSelected = await browser.containsClass(
                  firstRaceSecondBetTypePO.element,
                  PebblePO.states.active,
                );

                expect(isCombinationPebbleSelected).toEqual(true);
              });

              it("[PRPI-8609] each selection should have silk, runner name but no hamburger icon or place", async () => {
                expect(await firstSelectionPO.positionNumber.isExisting()).toEqual(false);
                expect(await firstSelectionPO.silk.isDisplayed()).toEqual(true);
                expect(await firstSelectionPO.horse.getText()).toEqual("5 B");
                expect(await secondSelectionPO.positionNumber.isExisting()).toEqual(false);
                expect(await secondSelectionPO.silk.isDisplayed()).toEqual(true);
                expect(await secondSelectionPO.horse.getText()).toEqual("3 A");
                expect(await thirdSelectionPO.positionNumber.isExisting()).toEqual(false);
                expect(await thirdSelectionPO.silk.isDisplayed()).toEqual(true);
                expect(await thirdSelectionPO.horse.getText()).toEqual("7 C");

                expect(await firstDraggableItemPO.icon.isDisplayed()).toEqual(false);
                expect(await secondDraggableItemPO.icon.isDisplayed()).toEqual(false);
                expect(await thirdDraggableItemPO.icon.isDisplayed()).toEqual(false);
              });

              it("[PRPI-8609] the dividend bet label should have 6 lines", async () => {
                expect(await firstCastControlsPO.lines.getText()).toEqual("6 Lines");
              });

              it("[PRPI-8609] the stake input field should be empty", async () => {
                expect(await firstStakePO.numberField.getValue()).toEqual("");
              });

              it("[PRPI-8609] the returns should be TBD", async () => {
                expect(await firstCastControlsPO.returns.getText()).toEqual("Returns TBD");
              });

              describe("When the user adds a 0.1 stake", () => {
                beforeAll(async () => {
                  await browser.waitUntilDisplayed(firstStakePO.element);
                  await firstStakePO.numberField.waitForClickable();
                  await firstStakePO.numberField.click();
                  await firstStakePO.setValue("0.1");
                  await browser.waitUntilEquals(placeButton.label, "Place $0.70 Bet");
                });

                it("[PRPI-8609] the total stake should update to $0.70", async () => {
                  expect(await placeButton.label.getText()).toContain("$0.70");
                });

                it("[PRPI-8609] the total returns should remain TBD", async () => {
                  expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
                });

                describe("When the user removes the selection C", () => {
                  beforeAll(async () => {
                    await betslipDrawerPO.header.click();
                    await browser.waitUntilEquals(minimizedPO.title, "Betslip");

                    await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK));
                    await firstRaceThirdRunnerBetButtonPO.element.click();
                    await browser.waitUntilEquals(minimizedPO.counter, "2");
                    await minimizedPO.element.click();
                    await browser.waitUntilDisplayed(placePanelPO.element);
                  });

                  it("[PRPI-8609] two chips should be displayed", async () => {
                    expect(await firstRaceFirstBetTypePO.element.isDisplayed()).toEqual(true);
                    expect(await firstRaceSecondBetTypePO.element.isDisplayed()).toEqual(true);
                  });

                  it("[PRPI-8609] the stake input field should be empty", async () => {
                    expect(await firstStakePO.numberField.getValue()).toEqual("");
                  });

                  describe("When the user adds three selections from the Lingfield race to betslip", () => {
                    beforeAll(async () => {
                      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_RACES_TRICAST_MOCK_SECTION_ONE));
                      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_RACES_TRICAST_MOCK_SECTION_TWO));
                      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_RACES_TRICAST_MOCK_FINAL));
                      await betslipDrawerPO.header.click();
                      await browser.waitUntilDisplayed(secondRaceMarketCardPO.element);

                      await secondRaceFirstRunnerBetButtonPO.element.click();
                      await secondRaceSecondRunnerBetButtonPO.element.click();
                      await secondRaceThirdRunnerBetButtonPO.element.click();
                      await browser.waitUntilEquals(minimizedPO.counter, "5");
                      await minimizedPO.element.click();
                      await browser.waitUntilDisplayed(placePanelPO.element);
                    });

                    it("[PRPI-8609] the Lingfield race should be displayed first", async () => {
                      expect(await firstCastBetPO.title.getText()).toEqual("15:00 Lingfield");
                    });

                    it("[PRPI-8609] the Windsor race should be displayed second", async () => {
                      expect(await secondCastBetPO.title.getText()).toEqual("15:30 Windsor");
                    });

                    describe("When the user adds a 0.1 stake on Windsor race straight forecast and a 0.1 stake to the Lingfield race combination tricast", () => {
                      beforeAll(async () => {
                        await firstRaceSecondBetTypePO.element.click();
                        await browser.waitUntilContainsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active);

                        await browser.waitUntilDisplayed(firstStakePO.element);

                        await firstStakePO.numberField.waitForClickable();
                        await firstStakePO.numberField.click();
                        await firstStakePO.setValue("0.1");
                        await browser.waitUntilEquals(firstStakePO.numberField, "0.1");

                        await browser.waitUntilDisplayed(secondCastBetPO.element);

                        await secondStakePO.numberField.waitForClickable();
                        await secondStakePO.numberField.click();
                        await secondStakePO.setValue("0.1");
                        await browser.waitUntilEquals(placeButton.label, "Place $0.70 Bet");
                      });

                      it("[PRPI-8609] the total stake should update to $0.70", async () => {
                        expect(await placeButton.label.getText()).toContain("$0.70");
                      });

                      it("[PRPI-8609] the total returns should update to TBD", async () => {
                        expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
                      });

                      describe("When the user clicks on the CTA button", () => {
                        beforeAll(async () => {
                          await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS));
                          await placeButton.element.click();
                          await browser.waitUntilDisplayed(receiptPanelPO.element);
                        });

                        it("[PRPI-8609] the receipt panel should be displayed", async () => {
                          expect(await receiptPanelPO.element.isDisplayed()).toEqual(true);
                        });

                        it("[PRPI-8609] the Forecast title should be displayed", async () => {
                          expect(await receiptCastHeaderPO.element.getText()).toEqual("FORECAST");
                        });

                        it("[PRPI-8609] the Lingfield race should be displayed first", async () => {
                          expect(await races[0].title.getText()).toEqual("15:00 Lingfield");
                        });

                        it("[PRPI-8609] the Windsor race should be displayed second", async () => {
                          expect(await races[1].title.getText()).toEqual("15:30 Windsor");
                        });

                        it("[PRPI-8609] (Windsor) - the race time and race name should be displayed", async () => {
                          expect(await races[1].title.getText()).toEqual("15:30 Windsor");
                        });

                        it("[PRPI-8609] (Windsor) - the bet type should be Straight Forecast", async () => {
                          expect(await races[1].subtitle.getText()).toEqual("Straight Forecast");
                        });

                        it("[PRPI-8609] (Windsor) - two runners should be displayed with place, silk and runner name", async () => {
                          expect(await races[1].draggableList.items.length).toEqual(2);
                          expect(await races[1].draggableList.items[0].isDisplayed()).toEqual(true);
                          expect(await races[1].firstSelection.positionNumber.getText()).toEqual("1st");
                          expect(await races[1].firstSelection.horse.getText()).toEqual("5 B");
                          expect(await races[1].firstSelection.silk.isDisplayed()).toEqual(true);
                          expect(await races[1].draggableList.items[1].isDisplayed()).toEqual(true);
                          expect(await races[1].secondSelection.positionNumber.getText()).toEqual("2nd");
                          expect(await races[1].secondSelection.horse.getText()).toEqual("3 A");
                          expect(await races[1].secondSelection.silk.isDisplayed()).toEqual(true);
                        });

                        it("[PRPI-8609] (Windsor) - the lines should be 1", async () => {
                          expect(await races[1].segments.leftValue.getText()).toEqual("1");
                        });

                        it("[PRPI-8609] (Windsor) - the stake should be 0.10", async () => {
                          expect(await races[1].segments.midValue.getText()).toEqual("$0.10");
                        });

                        it("[PRPI-8609] (Windsor) - the returns should be TBD", async () => {
                          expect(await races[1].segments.rightValue.getText()).toEqual("TBD");
                        });

                        it("[PRPI-8609] (Lingfield) - the race time and race name should be displayed", async () => {
                          expect(await races[0].title.getText()).toEqual("15:00 Lingfield");
                        });

                        it("[PRPI-8609] (Lingfield) - the bet type should be Combination Tricast", async () => {
                          expect(await races[0].subtitle.getText()).toEqual("Combination Tricast");
                        });

                        it("[PRPI-8609] (Lingfield) - three runners should be displayed without place, but with silk and runner name", async () => {
                          expect(await races[0].draggableList.items.length).toEqual(3);
                          expect(await races[0].draggableList.items[0].isDisplayed()).toEqual(true);
                          expect(await races[0].firstSelection.positionNumber.isDisplayed()).toEqual(false);
                          expect(await races[0].firstSelection.horse.getText()).toEqual("3 D");
                          expect(await races[0].firstSelection.silk.isDisplayed()).toEqual(true);
                          expect(await races[0].draggableList.items[1].isDisplayed()).toEqual(true);
                          expect(await races[0].secondSelection.positionNumber.isDisplayed()).toEqual(false);
                          expect(await races[0].secondSelection.horse.getText()).toEqual("5 E");
                          expect(await races[0].secondSelection.silk.isDisplayed()).toEqual(true);
                          expect(await races[0].draggableList.items[2].isDisplayed()).toEqual(true);
                          expect(await races[0].thirdSelection.positionNumber.isDisplayed()).toEqual(false);
                          expect(await races[0].thirdSelection.horse.getText()).toEqual("7 F");
                          expect(await races[0].thirdSelection.silk.isDisplayed()).toEqual(true);
                        });

                        it("[PRPI-8609] (Lingfield) - the lines should be 6", async () => {
                          expect(await races[0].segments.leftValue.getText()).toEqual("6");
                        });

                        it("[PRPI-8609] (Lingfield) - the stake should be 0.60", async () => {
                          expect(await races[0].segments.midValue.getText()).toEqual("$0.60");
                        });

                        it("[PRPI-8609] (Lingfield) - the returns should be TBD", async () => {
                          expect(await races[0].segments.rightValue.getText()).toEqual("TBD");
                        });

                        it("[PRPI-8609] the total stake should be $0.70", async () => {
                          expect(await receiptSummaryPO.leftSegmentValue.getText()).toContain("$0.70");
                        });

                        it("[PRPI-8609] the total returns should be TBD", async () => {
                          expect(await receiptSummaryPO.totalReturnsValue.getText()).toEqual("TBD");
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
