const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const {
  getAppContext,
  getHomeLayoutWithViewLink,
  getSportsLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { advanceToConfirmStep } = require("../../../../../helpers/confirm-bets");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  DraggableListSO,
  CastBetsCardSO,
  GenericScreenSO,
  HorseRacingRunnerSO,
  SportsbookBetButtonSO,
  BetsSummarySO,
  CastBetSO,
  ForecastTricastSelectionSO,
  BetslipDrawerSO,
  PebbleSO,
  PebbleListSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
  SecondaryButtonSO,
  AlertSO,
  HintSO,
  CardSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();

const firstRaceCardSO = new RaceMarketCardSO(genericScreenSO.cards[0]);
const firstRaceFirstRunnerSO = new HorseRacingRunnerSO(firstRaceCardSO.runners[0]);
const firstRaceSecondRunnerSO = new HorseRacingRunnerSO(firstRaceCardSO.runners[1]);
const firstRaceFirstRunnerBetButtonSO = new SportsbookBetButtonSO(firstRaceFirstRunnerSO.sbkBetButtons[0]);
const firstRaceSecondRunnerBetButtonSO = new SportsbookBetButtonSO(firstRaceSecondRunnerSO.sbkBetButtons[0]);

const placePanelSO = new SportsbookPlacePanelSO();
const summarySO = new BetsSummarySO(placePanelSO.summary);
const minimizedSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();
const castBetsCardSO = new CastBetsCardSO(placePanelSO.element);
const castHeaderCardSO = new CardSO(placePanelSO.collapsableSections[0]);

const firstCastBetSO = new CastBetSO(castBetsCardSO.castBets[0]);
const firstCastBetTypesSO = new PebbleListSO(firstCastBetSO.element);
const firstRaceFirstBetTypeSO = new PebbleSO(firstCastBetTypesSO.pebbleListElements[0]);
const firstRaceSecondBetTypeSO = new PebbleSO(firstCastBetTypesSO.pebbleListElements[1]);

const draggableList = new DraggableListSO(placePanelSO.element);
const firstSelectionSO = new ForecastTricastSelectionSO(draggableList.items[0]);
const secondSelectionSO = new ForecastTricastSelectionSO(draggableList.items[1]);
const firstCastControlsSO = new BetControlsSO(firstCastBetSO.element);

const firstStakeSO = new CurrencyNumberInputFieldSO(firstCastControlsSO.element);
const removeAllButtonSO = new PrimaryButtonSO(placePanelSO.removeAll);
const placeButtonSO = new PrimaryButtonSO(placePanelSO.place);
const placeNotification = new AlertSO(placePanelSO.element);
const hintSO = new HintSO(firstCastControlsSO.element);

const editButtonSO = new SecondaryButtonSO(placePanelSO.actions[0]);
const confirmButtonSO = new PrimaryButtonSO(placePanelSO.actions[1]);

const silkURLMock = `http://${mockService.getMockServerHost()}:${mockService.getMockServerPort()}/mockedImage/image.png`;

const confirmButtonsElements = {
  placeButtonElement: placeButtonSO.element,
  editButtonElement: editButtonSO.element,
};

const APP_CONTEXT_MOCK = {
  loggedIn: "true",
  products: ["sportsbook"],
  throttles: {
    BET_CONFIRMATION_STEP: { isActive: true },
  },
};

const EVENT_TYPE_ID = 7;

const SBK_FIRST_RUNNER = [
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

const SBK_SECOND_RUNNER = [
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

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  title: "Horse Racing",
  edges: [
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
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
                      runners: SBK_FIRST_RUNNER,
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
                        silk: silkURLMock,
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
                        silk: silkURLMock,
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
                        silk: silkURLMock,
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
                      vector: silkURLMock,
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
                      runners: SBK_SECOND_RUNNER,
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
                        silk: silkURLMock,
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
                        silk: silkURLMock,
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
                        silk: silkURLMock,
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
                      vector: silkURLMock,
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
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s/7",
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

describe("Betslip - Confirm SBK Cast Bet Type", () => {
  beforeAll(async () => {
    const HOME_VIEW_LINK = getStartViewLink(`horse-racing/s-${EVENT_TYPE_ID}`);
    await Promise.all([
      mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" })),
      mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK)),
      mockService.mockHttpRequest(getSportsLayout(BFF_MOCK)),
      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
      mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK)),
    ]);

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(firstRaceCardSO.element, "Waiting for card");
  });

  describe("when adding a cast bet selections to betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRaceFirstRunnerBetButtonSO.element, "Waiting for bet button");
      await firstRaceFirstRunnerBetButtonSO.element.click();

      await browser.waitUntilClickableNative(betslipDrawerSO.header, "Expandable was not clickable");
      await betslipDrawerSO.header.click();

      await browser.waitUntilDisplayed(minimizedSO.counter, "Betslip was not minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK));

      await firstRaceSecondRunnerBetButtonSO.element.click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");
      await minimizedSO.element.click();

      await browser.waitUntilDisplayed(placePanelSO.element, "Place panel is not displayed");
    });

    describe("and add stake to the cast bet and then advances to confirm step", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(firstStakeSO.element, "Stake is not displayed");
        await firstStakeSO.numberField.click();
        await firstStakeSO.setValue("0.1");
        await hideKeyboard();

        await browser.waitUntilEquals(firstStakeSO.numberField, "0.1");

        await advanceToConfirmStep(confirmButtonsElements);

        await browser.waitUntilDisplayed(confirmButtonSO.element, "Confirm button is not visible");
      });

      it("[PRPI-4011] should edit button be displayed", async () => {
        expect(await editButtonSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-4012] should confirm button be displayed", async () => {
        expect(await confirmButtonSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-4013] should have Forecast title displayed", async () => {
        expect(await castHeaderCardSO.title.getText()).toEqual("FORECAST");
      });

      it("[PRPI-4014] should have race time and race name '15:30 Windsor'", async () => {
        expect(await firstCastBetSO.title.getText()).toEqual("15:30 Windsor");
      });

      it("[PRPI-4015] should have Straight Forecast chip selected", async () => {
        expect(await firstRaceFirstBetTypeSO.title.getText()).toEqual("Straight Forecast");
      });

      it("[PRPI-4016] should have two runners", async () => {
        expect(await draggableList.items.length).toEqual(2);
      });

      it("[PRPI-4017] should selection A have runner name '3 A'", async () => {
        expect(await firstSelectionSO.horse.getText()).toContain("3 A");
      });

      it("[PRPI-4018] should selection A have a silk", async () => {
        expect(await firstSelectionSO.silk.isDisplayed()).toBe(true);
      });

      it("[PRPI-4019] should selection A not have a hamburger icon displayed", async () => {
        expect(await draggableList.icons[0].element).toBeUndefined();
      });

      it("[PRPI-4020] should selection B have runner name '5 B'", async () => {
        expect(await secondSelectionSO.horse.getText()).toEqual("5 B");
      });

      it("[PRPI-4021] should selection B have a silk", async () => {
        expect(await secondSelectionSO.silk.isDisplayed()).toEqual(true);
      });

      it("[PRPI-4022] should selection B not have a hamburger icon displayed", async () => {
        expect(await draggableList.icons[1].element).toBeUndefined();
      });

      it("[PRPI-4023] should dividend bet label be displayed", async () => {
        expect(await firstCastControlsSO.dividend.isDisplayed()).toEqual(true);
      });

      it("[PRPI-4024] should stake have 0.1 as value", async () => {
        expect(await firstStakeSO.numberField.getText()).toContain("0.1");
      });

      it("[PRPI-4025] should stake be readonly", async () => {
        expect(await firstStakeSO.numberField.isEnabled()).toEqual(false);
      });

      it("[PRPI-4026] should total stake be $0.10", async () => {
        expect(await placeButtonSO.label.getText()).toContain("$0.10");
      });

      it("[PRPI-4027] should total returns be TBD", async () => {
        expect(await summarySO.totalReturnsValue.getText()).toEqual("TBD");
      });
    });

    describe("and user clicks on edit button", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(editButtonSO.element, "Edit button is not clickable");
        await editButtonSO.element.click();
        await browser.waitUntilDisplayed(removeAllButtonSO.element, "Remove all button is not displayed");
        await browser.waitUntilClickableNative(placeButtonSO.element);
      });

      it("[PRPI-4028] should have two runners", async () => {
        expect(await draggableList.items.length).toEqual(2);
      });

      it("[PRPI-4029] should display place potential elements", async () => {
        expect(await placeButtonSO.element.isDisplayed()).toEqual(true);
        expect(await removeAllButtonSO.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-4030] should stake input be enable", async () => {
        expect(await firstStakeSO.numberField.isEnabled()).toEqual(true);
      });

      it("[PRPI-4031] should selection A have a hamburger icon displayed", async () => {
        expect(await draggableList.icons[0].isDisplayed()).toEqual(true);
      });

      it("[PRPI-4032] should selection B have a hamburger icon displayed", async () => {
        expect(await draggableList.icons[1].isDisplayed()).toEqual(true);
      });
    });

    describe("and the user adds stake to other bet type and then move to confirmation step", () => {
      beforeAll(async () => {
        await firstRaceSecondBetTypeSO.element.click();

        await browser.waitUntilClickableNative(firstStakeSO.numberField, "First stake is not clickable");
        await firstStakeSO.numberField.click();
        await firstStakeSO.setValue("0.5");
        await hideKeyboard();

        await browser.waitUntilEquals(firstStakeSO.numberField, "0.5");

        await advanceToConfirmStep(confirmButtonsElements);

        await browser.waitUntilDisplayed(confirmButtonSO.element, "Confirm button is not visible");
      });

      it("[PRPI-4033] should have Straight Forecast chip selected", async () => {
        expect(await firstRaceFirstBetTypeSO.title.getText()).toEqual("Straight Forecast");
      });

      it("[PRPI-4034] should have Reverse Forecast chip selected", async () => {
        expect(await firstRaceSecondBetTypeSO.title.getText()).toEqual("Reverse Forecast");
      });

      it("[PRPI-4035] should total stake be $1.10", async () => {
        expect(await placeButtonSO.label.getText()).toContain("$1.10");
      });

      describe("when the user clicks in the second bet type", () => {
        beforeAll(async () => {
          await firstRaceSecondBetTypeSO.element.click();
          await browser.waitUntilEquals(firstStakeSO.numberField, "0.5");
        });

        it("[PRPI-4036] should stake have 0.5 as value", async () => {
          expect(await firstStakeSO.numberField.getText()).toContain("0.5");
        });

        it("[PRPI-4037] should stake be readonly", async () => {
          expect(await firstStakeSO.numberField.isEnabled()).toEqual(false);
        });
      });
    });

    describe("when market gets suspend", () => {
      beforeAll(async () => {
        await Promise.all([
          mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_WITH_ERRORS, { ignoreRequestedMarketIdsMatch: true })),
          mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK_WITH_ERRORS)),
        ]);

        await browser.waitUntilDisplayed(placeNotification.element, "The notification is not displayed");
        await browser.waitUntilDisplayed(hintSO.element, "The hint is not displayed");
      });

      it("[PRPI-4038] should show notifications", async () => {
        expect(await placeNotification.element.isDisplayed()).toEqual(true);
      });

      it("[PRPI-4039] should show hint on bet controls", async () => {
        expect(await hintSO.message.getText()).toBe("SUSPENDED");
      });

      it("[PRPI-4040] should disable place button", async () => {
        expect(await confirmButtonSO.element.isEnabled()).toBe(false);
      });
    });
  });
});
