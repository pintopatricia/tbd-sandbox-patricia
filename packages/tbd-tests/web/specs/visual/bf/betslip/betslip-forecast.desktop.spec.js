const {
  AppPO,
  SportPagePO,
  CastBetsCardPO,
  ScrollableSwimlanePO,
  SportsbookReceiptPanelPO,
  RunnerPO,
  CardPO,
  CastBetPO,
  CurrencyNumberInputFieldPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  SportsbookPlacePanelPO,
} = require("../../../../page-objects");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { SMP, SIB, SPB } = require("@flutter-global/uki-channels-http-clients/mock-index");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { getSportViewUrl } = require("../../../../../utils/routes");

const { getMarketPrices } = SMP;
const { getImplyBetsResponse } = SIB;
const { getPlaceBet } = SPB;

const MODULE_NAME = "betslip_forecast";
const sportPagePO = new SportPagePO();
const scrollableSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const raceMarketCardPO = new RaceMarketCardPO(scrollableSwimlanePO.scrollItems[0]);
const raceCardPO = new CardPO(raceMarketCardPO.market);
const sportsbookMarketPO = new SportsbookMarketPO(raceCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(sportsbookMarketPO.horseRacingRunnerList[0]);
const secondRunnerPO = new RunnerPO(sportsbookMarketPO.horseRacingRunnerList[1]);
const firstSportsbookBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);
const secondSportsbookBetButtonPO = new SportsbookBetButtonPO(secondRunnerPO.sportsbookBetButton);

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const castBetsCardPO = new CastBetsCardPO(sportsbookPlacePanelPO.element);
const castBetPO = new CastBetPO(castBetsCardPO.castBets[0]);
const castBetStakePO = new CurrencyNumberInputFieldPO(castBetPO.element);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();

const mockService = new MockService();

const EVENT_TYPE_ID = 7;

const BFF_MOCK = {
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
                          startTime: "2020-07-13T14:30:00",
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
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          name: "A",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          name: "Brazilean Cow",
                          selectionId: 2,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          name: "Charismatic Panther",
                          selectionId: 3,
                          handicap: 0,
                          resultType: null,
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
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T14:30:00",
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
                        name: "Brazilean Cow",
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
                        name: "Charismatic Panther",
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
  ],
};

const FIRST_SINGLE_MOCK = {
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

const FIRST_SINGLE_ODDS_MOCK = {
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

const SECOND_SINGLE_MOCK = {
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

const SECOND_SINGLE_ODDS_MOCK = {
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

const FORECAST_MOCK = {
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

const REVERSE_FORECAST_MOCK = {
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

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SIB_FORECAST_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, FORECAST_MOCK, REVERSE_FORECAST_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      totalStake: 2,
      runners: [
        {
          runner: {
            marketId: FIRST_SINGLE_ODDS_MOCK.runner.marketId,
            selectionId: FIRST_SINGLE_ODDS_MOCK.runner.selectionId,
          },
        },
        {
          runner: {
            marketId: SECOND_SINGLE_ODDS_MOCK.runner.marketId,
            selectionId: SECOND_SINGLE_ODDS_MOCK.runner.selectionId,
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: FIRST_SINGLE_ODDS_MOCK.runner.marketId,
                  selectionId: FIRST_SINGLE_ODDS_MOCK.runner.selectionId,
                },
                order: 1,
              },
              {
                runner: {
                  marketId: SECOND_SINGLE_ODDS_MOCK.runner.marketId,
                  selectionId: SECOND_SINGLE_ODDS_MOCK.runner.selectionId,
                },
                order: 2,
              },
            ],

            legType: "FORECAST",
          },
          legType: "FORECAST",
        },
      ],
    },
  ],
};

describe("Betslip - Forecast", () => {
  describe("when adding selections to the Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getSSCHeaderCSS());
      await mockService.mockHttpRequest(getSSCv1Content());
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));

      await browser.url(getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 2, isHorseRacing: true }),
      );

      await firstSportsbookBetButtonPO.element.waitForClickable();
      await firstSportsbookBetButtonPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_FORECAST_MOCK));
      await browser.waitUntilDisplayed(secondSportsbookBetButtonPO.element, "Second runner bet button not visible");
      await secondSportsbookBetButtonPO.element.waitForClickable();
      await secondSportsbookBetButtonPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples betslip not displayed");

      await castBetStakePO.numberField.waitForClickable();
      await castBetStakePO.numberField.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1217]_should_see_populated_betslip_with_forecast`);
    });

    it("[PRPI-1217]_should_see_populated_betslip_with_forecast", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1217]_should_see_populated_betslip_with_forecast`)).toBe(
        0,
      );
    });
  });

  describe("when inputing a stake value", () => {
    beforeAll(async () => {
      await castBetStakePO.setValue("2");
      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1218]_should_input_value_and_tbd_returns`);
    });

    it("[PRPI-1218]_should_input_value_and_tbd_returns", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1218]_should_input_value_and_tbd_returns`)).toBe(0);
    });
  });

  describe("when placing the bet", () => {
    beforeAll(async () => {
      await sportsbookPlacePanelPO.place.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1219]_should_see_betreceipt_with_forecast`);
    });

    it("[PRPI-1219]_should_see_betreceipt_with_forecast", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1219]_should_see_betreceipt_with_forecast`)).toBe(0);
    });
  });

  describe("when clicking on reuse selection", () => {
    beforeAll(async () => {
      await sportsbookReceiptPanelPO.reUseSelectionsContainer.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1220]_should_see_betslip_forecast_again`);
    });

    it("[PRPI-1220]_should_see_betslip_forecast_again", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1220]_should_see_betslip_forecast_again`)).toBe(0);
    });
  });
});
