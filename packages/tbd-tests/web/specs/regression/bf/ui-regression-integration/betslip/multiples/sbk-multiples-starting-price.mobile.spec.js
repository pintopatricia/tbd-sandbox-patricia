const {
  AppPO,
  BetControlsPO,
  BetSelectionDetailsPO,
  BetSelectionsPO,
  BetSegmentsPO,
  BetSummaryPO,
  BetsSummaryPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  FixedNumberInputFieldPO,
  BetslipDrawerPO,
  PrimaryButtonPO,
  SportsbookMarketPO,
  MinimizedPO,
  SportPagePO,
  SportsbookReceiptPanelPO,
  SinglesCardPO,
  SinglePO,
  BetLegsPO,
  ScrollableSwimlanePO,
  HorseRacingRunnerPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");

const { getCompetitionsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const OneLineMultiplePO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.po");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const firstPrimarySwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const secondPrimarySwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[1]);

const firstRaceMarketCardPO = new RaceMarketCardPO(firstPrimarySwimlanePO.scrollItems[0]);
const secondRaceMarketCardPO = new RaceMarketCardPO(secondPrimarySwimlanePO.scrollItems[0]);
const firstRaceCardPO = new CardPO(firstRaceMarketCardPO.market);
const secondRaceCardPO = new CardPO(secondRaceMarketCardPO.market);

const firstSportsbookMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondRaceCardPO.sportsbookMarket);
const startingPriceRunner = new HorseRacingRunnerPO(firstSportsbookMarketPO.horseRacingRunnerList[1]);
const pricedRunnerPO = new HorseRacingRunnerPO(secondSportsbookMarketPO.horseRacingRunnerList[0]);

const minimizedPO = new MinimizedPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const betslipDrawerPO = new BetslipDrawerPO();
const primaryButtonPO = new PrimaryButtonPO();
const summaryPO = new BetsSummaryPO();
const placeMultiplesCollapsePO = new BetLegsPO();
const multiplesCollapsePO = new BetSelectionsPO();
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const oneLineMultiplePO = new OneLineMultiplePO(sportsbookPlacePanelPO.element);
const singlePO = new SinglePO(singlesCardPO.singles[1]);
const singleControlsPO = new BetControlsPO(singlePO.element);
const oneLineMultipleControlsPO = new BetControlsPO(oneLineMultiplePO.element);
const firstBetLegPO = new BetSelectionDetailsPO(placeMultiplesCollapsePO.selections[0]);
const secondBetSelectionPO = new BetSelectionDetailsPO(multiplesCollapsePO.selections[1]);
const multiplesHeaderPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const oneLineMultipleInputPO = new FixedNumberInputFieldPO(oneLineMultipleControlsPO.fixedInput);
const oneLineMultipleStakeInputPO = new CurrencyNumberInputFieldPO(oneLineMultipleControlsPO.currencyInput);
const singleInputPO = new CurrencyNumberInputFieldPO(singleControlsPO.currencyInput);
const multipleSummaryPO = new BetSummaryPO(sportsbookReceiptPanelPO.multiples[0]);
const multipleBetSegmentsPO = new BetSegmentsPO(multipleSummaryPO.element);

const EVENT_TYPE_ID = 7;
const COMPETITION_ID = "228";
const FIRST_MARKET_ID = "924.252091866";
const SECOND_MARKET_ID = "924.252091867";

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
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
                      urn: "ppb:sbkMarket:924.252091866",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      marketTypeName: "Win",
                      liveData: {
                        inplay: false,
                        turnInPlayEnabled: false,
                        bspMarket: true,
                      },
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
                          urn: "ppb:race:30264302.1755",
                          startTime: "2020-07-13T14:40:00",
                          name: "Windsor",
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
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091866/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091866/7",
                          name: "Unnamed Favourite",
                          runnerOrder: 99,
                          selectionId: 7,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091866/8",
                          name: "Unnamed 2nd Favourite",
                          runnerOrder: 100,
                          selectionId: 8,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.252091866/1" },
                      { runnerURN: "ppb:sbkRunner:924.252091866/7" },
                      { runnerURN: "ppb:sbkRunner:924.252091866/8" },
                    ],
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
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s2/7",
        cardGroupTitle: "Next Races",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 14,
                urn: "ppb:tbd:card:raceMarket:30061949.1435;WIN|3",
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.252091867",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      marketTypeName: "Win",
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
                          urn: "ppb:race:30061949.1435",
                          startTime: "2020-07-13T14:35:00",
                          name: "Lingfield",
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
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.252091867/1" }],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1435",
                  startTime: "2020-07-13T14:35:00.000Z",
                  name: "14:35 Lingfield",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
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
                urn: "ppb:tbd:card:raceMarket:30061949.1435;WIN|3",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s2/9",
        cardGroupTitle: "Next Races again",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 14,
                urn: "ppb:tbd:card:raceMarket:30061949.1435;WIN|4",
                title: "Win2",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.252091868",
                      name: "1m2f Nov Stks",
                      marketType: "WIN",
                      marketTypeName: "Win2",

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
                          urn: "ppb:race:30061949.1435",
                          startTime: "2020-07-13T14:35:00",
                          name: "Lingfield",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901910",
                            name: "Ling 13th Jul",
                            country: "GB",
                            countryFlag: {
                              vector: "http://example.test.com/mockedImage/image.png",
                            },
                            venue: "Lingfield",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901910",
                          name: "Ling 13th Jul",
                          country: "GB",
                          countryFlag: {
                            vector: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Lingfield",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.252091867/1" }],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061949.1435",
                  startTime: "2020-07-13T14:35:00.000Z",
                  name: "14:35 Lingfield",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
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
                urn: "ppb:tbd:card:raceMarket:30061949.1435;WIN|3",
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
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s2/7",
      },
    },
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s2/9",
      },
    },
  ],

  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse/browse:sports",
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: "mybets/myBets-open",
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: "casino/gm-1",
        },
      },
    ],
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOrder: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5.0 },
              fractionalOdds: { numerator: 4, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 5.0 },
            fractionalDisplayOdds: { numerator: 4, denominator: 1 },
            americanDisplayOdds: { americanOdds: 400.0, americanOddsInt: 400 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 7,
          runnerOrder: 98,
          noOdds: true,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 8,
          runnerOrder: 99,
          noOdds: true,
          runnerStatus: "ACTIVE",
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOrder: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3.0 },
              fractionalOdds: { numerator: 2, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 3.0 },
            fractionalDisplayOdds: { numerator: 2, denominator: 1 },
            americanDisplayOdds: { americanOdds: 400.0, americanOddsInt: 400 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const FIRST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.252091866",
          selectionId: 7,
        },
      ],
    },
  ],

  betType: "SINGLE",
};

const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: "924.252091866",
    selectionId: 7,
  },
};

const SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.252091867",
          selectionId: 1,
        },
      ],
    },
  ],

  betType: "SINGLE",
  betMinStake: 0.1,
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

const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: "924.252091867",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalDisplayOdds: { numerator: 2, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 1 },
  },
};

const DOUBLE_COMBINATION = {
  betType: "DOUBLE",
  legCombinations: [],
  betMinStake: 0.1,
  betMaxStake: 1000,
  betMinStakeIncrement: 0.01,
};

const SINGLE_SIB_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const DOUBLE_SIB_MOCK = {
  betCombinations: [FIRST_COMBINATION, SECOND_COMBINATION, DOUBLE_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS, SECOND_COMBINATION_ODDS],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      runners: [
        {
          runner: { marketId: "924.252091867", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.252091867", selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 1 },
          },
        },
      ],

      totalPotentialWin: 0.3,
      totalStake: 0.1,
    },
    {
      runners: [
        {
          runner: { marketId: "924.252091866", selectionId: 7 },
        },
        {
          runner: { marketId: "924.252091867", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.252091866", selectionId: 7 } }],
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.252091867", selectionId: 1 } }],
          },
        },
      ],

      betType: "DOUBLE",
      totalStake: 0.1,
    },
  ],
};

describe("Sportsbook Multiples Starting Price", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getCompetitionsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_SIB_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await browser.url(`${routes.getCompetitionViewUrl(COMPETITION_ID)}`);

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: firstRaceMarketCardPO.market,
        runnerIndex: 1,
        price: "SP",
        isHorseRacing: true,
      }),
    );
  });

  describe("When the user adds one SP selection and another selection from different races to betslip", () => {
    beforeAll(async () => {
      await startingPriceRunner.sportsbookBetButton.waitForClickable();
      await startingPriceRunner.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelPO.element,
        "Single Place Panel was not displayed on runner add",
      );

      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedPO.element, "Single Place Panel hasn't been minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_SIB_MOCK));
      await pricedRunnerPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await pricedRunnerPO.sportsbookBetButton.waitForClickable();
      await pricedRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");

      await minimizedPO.element.waitForClickable();
      await minimizedPO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelPO.element,
        "Place Panel was not displayed on second runner add",
      );
      await placeMultiplesCollapsePO.element.scrollIntoView({ block: "center" });
      await placeMultiplesCollapsePO.element.waitForClickable();
      await placeMultiplesCollapsePO.element.click();
      await browser.waitUntilDisplayed(multiplesHeaderPO.element);
      await browser.waitUntilDisplayed(firstBetLegPO.element);
    });

    it("[PRPI-8026] Then betslip should open with multiples", async () => {
      expect(await multiplesHeaderPO.title.getText()).toEqual("MULTIPLES");
    });

    it("[PRPI-8027] The first selection in the accordion should have 'SP' odd", async () => {
      expect(await firstBetLegPO.odd.getText()).toEqual("SP");
    });

    it("[PRPI-8028] The multiple odds field should display 'SP'", async () => {
      expect(await oneLineMultipleInputPO.numberField.getValue()).toEqual("SP");
    });

    describe("When the user adds a 0.1 stake to selection 2", () => {
      beforeAll(async () => {
        await singleInputPO.numberField.waitForClickable();
        await singleInputPO.numberField.click();
        await singleInputPO.setValue("0.1");

        await browser.waitUntilEquals(summaryPO.totalReturnsValue, "$0.30");
      });

      it("[PRPI-8029] The total returns should be $0.30", async () => {
        expect(await summaryPO.totalReturnsValue.getText()).toEqual("$0.30");
      });

      describe("when the user adds a 0.1 stake to the multiple", () => {
        beforeAll(async () => {
          // Scroll and collapse element to force keyboard to dismiss
          await placeMultiplesCollapsePO.element.scrollIntoView();
          await browser.waitUntilInViewport(placeMultiplesCollapsePO.element);
          await placeMultiplesCollapsePO.element.click();

          await oneLineMultipleStakeInputPO.element.waitForClickable();
          await oneLineMultipleStakeInputPO.element.scrollIntoView();
          await oneLineMultipleStakeInputPO.element.click();
          await oneLineMultipleStakeInputPO.setValue("0.1");
        });

        it("[PRPI-8030] The returns should be 'Returns TBD'", async () => {
          expect(await oneLineMultipleControlsPO.returns.getText()).toEqual("Returns TBD");
        });

        it("[PRPI-8031] The total returns should be 'TBD'", async () => {
          expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
        });

        describe("when the user clicks on place button and expands the multiples accordion", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
            await primaryButtonPO.element.waitForClickable();
            await primaryButtonPO.element.click();
            await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);

            await multiplesCollapsePO.element.waitForClickable();
            await multiplesCollapsePO.element.click();
            await browser.waitUntilDisplayed(secondBetSelectionPO.element);
          });

          it("[PRPI-8032] The receipt should appear", async () => {
            expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toEqual(true);
          });

          it("[PRPI-8032] The second selection in the accordion should have 'SP' odd", async () => {
            expect(await secondBetSelectionPO.odd.getText()).toEqual("SP");
          });

          it("[PRPI-8032] The second selection should have the correct icon", async () => {
            expect(await secondBetSelectionPO.silk.isDisplayed()).toEqual(true);
          });

          it("[PRPI-8032] The multiple odds field should display 'SP'", async () => {
            expect(await multipleBetSegmentsPO.leftLabel.getText()).toBe("Odds");
            expect(await multipleBetSegmentsPO.leftValue.getText()).toBe("SP");
          });

          it("[PRPI-8032] The multiple returns should be 'TBD'", async () => {
            expect(await multipleBetSegmentsPO.rightLabel.getText()).toBe("Returns");
            expect(await multipleBetSegmentsPO.rightValue.getText()).toBe("TBD");
          });

          it("[PRPI-8032] The total returns should be 'TBD'", async () => {
            expect(await summaryPO.totalReturnsValue.getText()).toEqual("TBD");
          });
        });
      });
    });
  });
});
