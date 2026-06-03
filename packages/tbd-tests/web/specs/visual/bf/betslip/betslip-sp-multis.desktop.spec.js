const {
  AppPO,
  SportPagePO,
  SinglePO,
  SinglesCardPO,
  ScrollableSwimlanePO,
  SportsbookReceiptPanelPO,
  RunnerPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  BetControlsPO,
  OptionPO,
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
const { addStake } = require("../../../../helpers/betslip.util");

const { getMarketPrices } = SMP;
const { getImplyBetsResponse } = SIB;
const { getPlaceBet } = SPB;

const MODULE_NAME = "betslip_sp_multis";
const sportPagePO = new SportPagePO();
const scrollableSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);

const firstRaceMarketCardPO = new RaceMarketCardPO(scrollableSwimlanePO.scrollItems[0]);
const firstRaceCardPO = new CardPO(firstRaceMarketCardPO.market);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(firstSportsbookMarketPO.horseRacingRunnerList[0]);
const firstSportsbookBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);

const secondRaceMarketCardPO = new RaceMarketCardPO(scrollableSwimlanePO.scrollItems[1]);
const secondRaceCardPO = new CardPO(secondRaceMarketCardPO.market);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondRaceCardPO.sportsbookMarket);
const secondRunnerPO = new RunnerPO(secondSportsbookMarketPO.horseRacingRunnerList[0]);
const secondSportsbookBetButtonPO = new SportsbookBetButtonPO(secondRunnerPO.sportsbookBetButton);

const placePanelPO = new SportsbookPlacePanelPO();

const singlesCardsPO = new SinglesCardPO(placePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardsPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const singleStartingPriceOptionPO = new OptionPO(firstSingleControlsPO.startingPrice);

const controlsPO = new BetControlsPO();
const sportsbookStakeInputPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
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
                          name: "A cavalo anda-se bem",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          name: "Ferrari Enzo",
                          selectionId: 2,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          name: "Bonito cavaliiiiinho",
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
                        name: "A cavalo anda-se bem",
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
                        name: "Ferrari Enzo",
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
                        name: "Bonito cavaliiiiinho",
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
                          startTime: "2020-07-13T15:30:00",
                          name: "15:30 Madagascar",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901909",
                            venue: "Madagascar",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901909",
                          venue: "Madagascar",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          name: "7 Takeitorleaveit",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          name: "Alberto Silva",
                          selectionId: 2,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }, { runnerURN: "ppb:sbkRunner:924.2/2" }],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061950.1400",
                  startTime: "2020-07-13T15:30:00",
                  name: "15:30 Madagascar",
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
                        name: "7 Takeitorleaveit",
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
                        name: "Alberto Silva",
                        sireName: "DUNADEN (FR)",
                        damName: "CEILIDH BAND",
                        damSireName: "CELTIC SWING",
                        age: 4,
                        color: "BAY",
                        sex: "FILLY",
                      },
                      details: {
                        jockeyName: "Diogo Batista",
                        trainerName: "Dean Ivory",
                        saddleCloth: 5,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 2,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901909",
                    name: "Lindt 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Madagascar",
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
  availablePriceTypes: ["STARTING_PRICE", "LIVE_PRICE"],
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
  availablePriceTypes: ["STARTING_PRICE", "LIVE_PRICE"],
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

const SECOND_SINGLE_ODDS_MOCK = {
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

const DOUBLE_COMBINATION_ODDS = {
  canPlaceEachwayBet: true,
  betMinStake: 0.1,
  averageOdds: 4.4,
  winAverageOdds: 4.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 4.4 } },
    decimalDisplayOdds: { decimalOdds: 4.4 },
  },
  betMinStakeIncrement: 0.01,
  betType: "DOUBLE",
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SIB_DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, DOUBLE_COMBINATION_ODDS],
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
          odds: {
            decimalDisplayOdds: { decimalOdds: SECOND_SINGLE_ODDS_MOCK.averageOdds },
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
              },
            ],
          },
        },
        {
          leg: {
            betRunners: [
              {
                runner: {
                  marketId: SECOND_SINGLE_ODDS_MOCK.runner.marketId,
                  selectionId: SECOND_SINGLE_ODDS_MOCK.runner.selectionId,
                },
              },
            ],
          },
          winOdds: SECOND_SINGLE_ODDS_MOCK.odds,
        },
      ],
    },
  ],
};

describe("Betslip - SP Multis", () => {
  describe("when adding two races to the betslip", () => {
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
        AppPO.sportsbookRunnerBetButtonHasPrice({
          market: firstRaceMarketCardPO.market,
          price: 2,
          isHorseRacing: true,
        }),
      );

      await firstSportsbookBetButtonPO.element.waitForClickable();
      await firstSportsbookBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Singles betslip not displayed");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
      await secondSportsbookBetButtonPO.element.scrollIntoView({
        block: "center",
      });
      await secondSportsbookBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Multiples betslip not displayed");

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1275]_should_see_betslip_with_race_multi`);
    });

    it("[PRPI-1275]_should_see_betslip_with_race_multi", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1275]_should_see_betslip_with_race_multi`)).toBe(0);
    });
  });

  xdescribe("when checking the starting price box", () => {
    beforeAll(async () => {
      await singleStartingPriceOptionPO.input.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(singleStartingPriceOptionPO.element);
      await singleStartingPriceOptionPO.input.click();
      await browser.waitUntil(() => singleStartingPriceOptionPO.input.isSelected(), {
        timeoutMsg: "Single Starting Price checkbox timed out",
      });
      await placePanelPO.collapsableSections[0].header.scrollIntoView({ block: "center" });

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1276]_should_see_betslip_multi_sp_update_odds`);
    });

    it("[PRPI-1276]_should_see_betslip_multi_sp_update_odds", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1276]_should_see_betslip_multi_sp_update_odds`)).toBe(0);
    });
  });

  describe("when placing the bet", () => {
    beforeAll(async () => {
      await addStake(sportsbookStakeInputPO, "2");

      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

      await placePanelPO.place.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1277]_should_see_betreceipt_with_multi_sp_tbd_returns`);
    });

    it("[PRPI-1277]_should_see_betreceipt_with_multi_sp_tbd_returns", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1277]_should_see_betreceipt_with_multi_sp_tbd_returns`),
      ).toBe(0);
    });
  });
});
