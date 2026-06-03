const {
  AppPO,
  MinimizedPO,
  SportPagePO,
  CastBetsCardPO,
  ScrollableSwimlanePO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  CastBetPO,
  PebbleListPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  BetControlsPO,
  AlertPO,
  SecondaryButtonPO,
  SportsbookPlacePanelPO,
  PebblePO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { addStake, advanceToConfirmStep } = require("../../../../helpers/betslip.util");

const MODULE_NAME = "betslip_sbk_confirm_cast_bet";

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
const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const castBetsCardPO = new CastBetsCardPO(placePanelPO.element);
const firstCastBetPO = new CastBetPO(castBetsCardPO.castBets[0]);
const firstCastBetTypesPO = new PebbleListPO(firstCastBetPO.element);
const firstRaceSecondBetTypePO = new PebblePO(firstCastBetTypesPO.pebbles[1]);
const firstCastControlsPO = new BetControlsPO(firstCastBetPO.element);

const firstStakePO = new CurrencyNumberInputFieldPO(firstCastControlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);
const placeNotification = new AlertPO(placePanelPO.element);

const editButtonPO = new SecondaryButtonPO(placePanelPO.actions[0]);

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
      mockService.mockFonts(getMockFonts()),
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

  describe("when the user makes a cast bet selection to betslip", () => {
    beforeAll(async () => {
      await firstRaceFirstRunnerBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placeButtonPO.element, "Place button is not visible");
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedPO.element, "Betslip was not minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK));
      await firstRaceSecondRunnerBetButtonPO.element.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");
      await minimizedPO.element.click();

      await browser.waitUntilDisplayed(firstStakePO.element, "First stake is not visible");

      await firstStakePO.numberField.waitForClickable();
      await firstStakePO.numberField.click();
      await addStake(firstStakePO, "0.1");
      await browser.waitUntilEquals(firstStakePO.numberField, "0.1");
    });

    describe("when the user advances to confirm step", () => {
      beforeAll(async () => {
        await advanceToConfirmStep(confirmButtonsElements);

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4684]_should_display_cast_bet_selection`);
      });

      it("[PRPI-4684]_should_display_cast_bet_selection", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4684]_should_display_cast_bet_selection`)).toBe(0);
      });

      describe("when the user add stake to other bet type and move to confirmation step", () => {
        beforeAll(async () => {
          await editButtonPO.element.click();
          await browser.waitUntilDisplayed(placePanelPO.element, "Place panel is not visible");

          await firstRaceSecondBetTypePO.element.click();
          await browser.waitUntilContainsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active);

          await browser.waitUntilDisplayed(firstStakePO.element, "First stake is not visible");
          await firstStakePO.numberField.waitForClickable();
          await firstStakePO.numberField.click();
          await addStake(firstStakePO, "0.1");

          await browser.waitUntilEquals(firstStakePO.numberField, "0.1");

          await advanceToConfirmStep(confirmButtonsElements);

          await browser.waitUntilDisplayed(placePanelPO.element, "Place panel is not visible");

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-4685]_should_show_other_cast_bet_type_in_confirmation_screen`,
          );
        });

        it("[PRPI-4685]_should_show_other_cast_bet_type_in_confirmation_screen", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-4685]_should_show_other_cast_bet_type_in_confirmation_screen`,
            ),
          ).toBe(0);
        });

        describe("when the user clicks in the second bet type", () => {
          beforeAll(async () => {
            await firstRaceSecondBetTypePO.element.click();
            await browser.waitUntilContainsClass(firstRaceSecondBetTypePO.element, PebblePO.states.active);

            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-4686]_should_have_the_other_cast_bet_type_selected_in_confirmation_screen`,
            );
          });

          it("[PRPI-4686]_should_have_the_other_cast_bet_type_selected_in_confirmation_screen", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-4686]_should_have_the_other_cast_bet_type_selected_in_confirmation_screen`,
              ),
            ).toBe(0);
          });
        });
      });

      describe("when market gets suspend", () => {
        beforeAll(async () => {
          await Promise.all([
            mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_WITH_ERRORS, { ignoreRequestedMarketIdsMatch: true })),
            mockService.mockHttpRequest(getImplyBetsResponse(ONE_RACE_FORECAST_MOCK_WITH_ERRORS)),
          ]);

          await browser.tickFakeClock();

          await browser.waitUntilDisplayed(placeNotification.element, "The notification is not displayed");
          await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-4687]_should_disable_place_button_and_show_market_notification`,
          );
        });

        it("[PRPI-4687]_should_disable_place_button_and_show_market_notification", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-4687]_should_disable_place_button_and_show_market_notification`,
            ),
          ).toBe(0);
        });
      });
    });
  });
});
