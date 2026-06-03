const {
  AppPO,
  CardPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  BetsSummaryPO,
  MinimizedPO,
  SportPagePO,
  CastBetPO,
  CastBetsCardPO,
  ScrollableSwimlanePO,
  RunnerPO,
  ForecastTricastSelectionPO,
  PebbleListPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  BetControlsPO,
  AlertPO,
  SecondaryButtonPO,
  SportsbookPlacePanelPO,
  DraggableListPO,
  DraggableListItemPO,
  PebblePO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { advanceToConfirmStep } = require("../../../../../../helpers/betslip.util");

const sportPage = new SportPagePO();
const firstScrollableSwimlane = new ScrollableSwimlanePO(sportPage.scrollableSwimlanes[0]);
const firstRaceMarketCardPO = new RaceMarketCardPO(firstScrollableSwimlane.scrollItems[0]);

const firstRaceCardPO = new CardPO(firstRaceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const firstRaceFirstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const firstRaceSecondRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[1]);
const firstRaceFirstRunnerBetButtonPO = new SportsbookBetButtonPO(firstRaceFirstRunnerPO.sportsbookBetButton);
const firstRaceSecondRunnerBetButtonPO = new SportsbookBetButtonPO(firstRaceSecondRunnerPO.sportsbookBetButton);

const placePanelPO = new SportsbookPlacePanelPO();
const summaryPO = new BetsSummaryPO(placePanelPO.summary);
const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const castBetsCardPO = new CastBetsCardPO(placePanelPO.element);
const castHeaderPO = new CardPO(placePanelPO.collapsableSections[0]);
const firstCastBetPO = new CastBetPO(castBetsCardPO.castBets[0]);
const firstCastBetTypesPO = new PebbleListPO(firstCastBetPO.element);
const firstRaceFirstBetTypePO = new PebblePO(firstCastBetTypesPO.pebbles[0]);
const firstRaceSecondBetTypePO = new PebblePO(firstCastBetTypesPO.pebbles[1]);
const draggableList = new DraggableListPO(firstCastBetPO.element);
const firstSelectionPO = new ForecastTricastSelectionPO(draggableList.items[0]);
const firstDraggableItemPO = new DraggableListItemPO(draggableList.items[0]);
const secondSelectionPO = new ForecastTricastSelectionPO(draggableList.items[1]);
const secondDraggableItemPO = new DraggableListItemPO(draggableList.items[1]);
const firstCastControlsPO = new BetControlsPO(firstCastBetPO.element);

const firstStakePO = new CurrencyNumberInputFieldPO(firstCastControlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);
const placeNotification = new AlertPO(placePanelPO.element);

const editButtonPO = new SecondaryButtonPO(placePanelPO.actions[0]);
const confirmButtonPO = new PrimaryButtonPO(placePanelPO.actions[1]);

const mockService = new MockService();

const confirmButtonsElements = {
  placeButtonElement: placeButtonPO.element,
  editButtonElement: editButtonPO.element,
};

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

const SMP_MOCK_WITH_ERRORS = {
  markets: [
    {
      ...SMP_MOCK.markets[0],
      runnerDetails: [
        {
          ...SMP_MOCK.markets[0].runnerDetails[0],
          runnerStatus: "SUSPENDED",
        },
        { ...SMP_MOCK.markets[0].runnerDetails[1], runnerStatus: "SUSPENDED" },
        { ...SMP_MOCK.markets[0].runnerDetails[2], runnerStatus: "SUSPENDED" },
      ],
    },
    {
      ...SMP_MOCK.markets[1],
      runnerDetails: [
        {
          ...SMP_MOCK.markets[1].runnerDetails[0],
          runnerStatus: "SUSPENDED",
        },
        { ...SMP_MOCK.markets[1].runnerDetails[1], runnerStatus: "SUSPENDED" },
        { ...SMP_MOCK.markets[1].runnerDetails[2], runnerStatus: "SUSPENDED" },
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

const RACE_ONE_FIRST_BET_FAILURES = {
  failedRunner: {
    marketId: "924.1",
    selectionId: 1,
  },
  failureCode: "MARKET_SUSPENDED",
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

const ONE_RACE_FORECAST_MOCK_WITH_ERRORS = {
  betCombinations: [RACE_ONE_FIRST_COMBINATION, RACE_ONE_SECOND_COMBINATION],
  runnerOdds: [RACE_ONE_FIRST_RUNNER_ODDS, RACE_ONE_SECOND_RUNNER_ODDS],
  betFailures: [RACE_ONE_FIRST_BET_FAILURES],
};

describe("Cast Bets Confirm Experience", () => {
  beforeAll(async () => {
    const indexHTML = await getIndexHTML(BFF_VIEW_MOCK.urn, {
      BET_CONFIRMATION_STEP: { isActive: true },
    });

    await Promise.all([
      mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" })),
      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
      mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK)),
      mockService.mockHttpRequest(getScaResponse({})),
      mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      mockService.mockHttpRequest(indexHTML),
    ]);

    await browser.url(routes.getRacingViewUrl());

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: firstRaceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
  });

  describe("When the user makes a cast bet selection to the betslip", () => {
    beforeAll(async () => {
      await firstRaceFirstRunnerBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");
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

    describe("When the user advances to confirm step", () => {
      beforeAll(async () => {
        await advanceToConfirmStep(confirmButtonsElements);

        await browser.waitUntilDisplayed(placePanelPO.element, "Place panel is not visible");
      });

      it("[PRPI-8610] should have confirm panel displayed", async () => {
        expect(await placePanelPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8611] should edit button be displayed", async () => {
        expect(await editButtonPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8612] should place button be displayed", async () => {
        expect(await confirmButtonPO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8613] should have Forecast title displayed", async () => {
        expect(await castHeaderPO.title.getText()).toEqual("FORECAST");
      });

      it("[PRPI-8614] should have race time and race name '15:30 Windsor'", async () => {
        expect(await firstCastBetPO.title.getText()).toEqual("15:30 Windsor");
      });

      it("[PRPI-8615] should have Straight Forecast chip selected", async () => {
        expect(await browser.containsClass(firstRaceFirstBetTypePO.element, PebblePO.states.active)).toEqual(true);
      });

      it("[PRPI-8616] should have two runners", async () => {
        expect(await draggableList.items.length).toEqual(2);
      });

      it("[PRPI-8617] should selection A have runner name '3 A'", async () => {
        expect(await firstSelectionPO.horse.getText()).toEqual("3 A");
      });

      it("[PRPI-8618] should selection A have a silk", async () => {
        expect(await firstSelectionPO.silk.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8619] should selection A not have a hamburger icon displayed", async () => {
        expect(await firstDraggableItemPO.icon.isDisplayed()).toEqual(false);
      });

      it("[PRPI-8620] should selection B have runner name '5 B'", async () => {
        expect(await secondSelectionPO.horse.getText()).toEqual("5 B");
      });

      it("[PRPI-8621] should selection B have a silk", async () => {
        expect(await secondSelectionPO.silk.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8622] should selection B not have a hamburger icon displayed", async () => {
        expect(await secondDraggableItemPO.icon.isDisplayed()).toEqual(false);
      });

      it("[PRPI-8623] should dividend bet label be displayed", async () => {
        expect(await firstCastControlsPO.dividend.isDisplayed()).toEqual(true);
      });

      it("[PRPI-8624] should stake have 0.1 as value", async () => {
        expect(await firstStakePO.numberField.getValue()).toEqual("0.1");
      });

      it("[PRPI-8625] should stake be readonly", async () => {
        expect(!!(await firstStakePO.numberField.getAttribute("readonly"))).toEqual(true);
      });

      it("[PRPI-8626] should total stake be $0.10", async () => {
        expect(await placeButtonPO.label.getText()).toContain("$0.10");
      });

      it("[PRPI-8627] should total returns be TBD", async () => {
        expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
      });

      describe("When user click on edit button", () => {
        beforeAll(async () => {
          await editButtonPO.element.click();
          await browser.waitUntilDisplayed(placePanelPO.element, "Place panel is not visible");
        });

        it("[PRPI-8628] should place panel be displayed ", async () => {
          expect(await placePanelPO.element.isDisplayed()).toEqual(true);
        });
      });

      describe("When the user add stake to other bet type and move to confirmation step", () => {
        beforeAll(async () => {
          await firstRaceSecondBetTypePO.element.click();
          await browser.waitUntilContainsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active);

          await browser.waitUntilDisplayed(firstStakePO.element, "First stake is not visible");
          await firstStakePO.numberField.waitForClickable();
          await firstStakePO.numberField.click();
          await firstStakePO.setValue("0.1");

          await browser.waitUntilEquals(firstStakePO.numberField, "0.1");

          await advanceToConfirmStep(confirmButtonsElements);

          await browser.waitUntilDisplayed(placePanelPO.element, "Place panel is not visible");
        });

        it("[PRPI-8629] should the selected race on confirmation be the first bet type ", async () => {
          expect(await browser.containsClass(firstRaceFirstBetTypePO.element, PebblePO.states.active)).toEqual(true);
        });

        it("[PRPI-8630] should total stake be $0.20", async () => {
          expect(await placeButtonPO.label.getText()).toContain("$0.30");
        });

        describe("When the user clicks in the second bet type", () => {
          beforeAll(async () => {
            await firstRaceSecondBetTypePO.element.click();
            await browser.waitUntilContainsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active);
          });

          it("[PRPI-8631] should the selected race on confirmation be the second bet type ", async () => {
            expect(await browser.containsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active)).toEqual(true);
          });
        });
      });

      describe("When market gets suspend", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_WITH_ERRORS, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK_WITH_ERRORS));

          await browser.tickFakeClock();

          await browser.waitUntilDisplayed(placeNotification.element, "The notification is not displayed");
          await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
        });

        it("[PRPI-8632] should show notifications", async () => {
          expect(await placeNotification.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8633] should show hint on bet controls", async () => {
          expect(await firstCastControlsPO.hintWarning.isDisplayed()).toEqual(true);
        });

        it("[PRPI-8634] should disable place button", async () => {
          expect(await confirmButtonPO.element.isEnabled()).toBe(false);
        });
      });
    });
  });
});
