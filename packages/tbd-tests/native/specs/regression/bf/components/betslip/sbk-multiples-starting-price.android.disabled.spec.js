const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");

const Gestures = require("../../../../../helpers/gestures");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  BetLegsSO,
  HorseRacingRunnerSO,
  SportsbookBetButtonSO,
  PrimaryButtonSO,
  MinimizedSO,
  BetslipDrawerSO,
  BetSegmentsSO,
  BetsSummarySO,
  SubHeaderSO,
  BetSelectionDetailsSO,
  FixedNumberInputFieldSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  BetSelectionsSO,
  BetSummarySO,
  OddsSO,
  KeyboardSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstRaceSO = new RaceMarketCardSO(genericScreenSO.cards[0]);
const secondRaceSO = new RaceMarketCardSO(genericScreenSO.cards[1]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const keyboardSO = new KeyboardSO(sportsbookPlacePanelSO.element);
const receiptPanelSO = new SportsbookReceiptPanelSO();
const currentMultipleSO = new BetControlsSO();
const minimizedSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();
const ctaPrimaryButtonSO = new PrimaryButtonSO();
const summarySO = new BetsSummarySO();
const placeMultiplesCollapseSO = new BetLegsSO();
const multiplesCollapseSO = new BetSelectionsSO();
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const singleSO = new SingleSO(singlesCardSO.singles[1]);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const firstBetLegSO = new BetSelectionDetailsSO(placeMultiplesCollapseSO.selections[0]);
const firstBetOddsSO = new OddsSO(firstBetLegSO.element);
const secondBetSelectionSO = new BetSelectionDetailsSO(multiplesCollapseSO.selections[1]);
const secondBetOddsSO = new OddsSO(secondBetSelectionSO.element);
const multiplesHeaderSO = new SubHeaderSO(sportsbookPlacePanelSO.collapsableSections[0].title);
const currentMultipleInputSO = new FixedNumberInputFieldSO(currentMultipleSO.fixedInput);
const currentStakeInputSO = new CurrencyNumberInputFieldSO(currentMultipleSO.currencyInput);
const singleInputSO = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);
const multipleSummarySO = new BetSummarySO(receiptPanelSO.multiples[0]);
const multipleBetSegmentSO = new BetSegmentsSO(multipleSummarySO.element);
const spRunnerSO = new HorseRacingRunnerSO(firstRaceSO.runners[1]);
const spRunnerBetButtonSO = new SportsbookBetButtonSO(spRunnerSO.sbkBetButtons[0]);
const pricedRunnerSO = new HorseRacingRunnerSO(secondRaceSO.runners[0]);
const pricedRunnerBetButtonSO = new SportsbookBetButtonSO(pricedRunnerSO.sbkBetButtons[0]);

const insertStakeWithKeyboard = async () => {
  await browser.waitUntilClickableNative(keyboardSO.zero);
  await keyboardSO.zero.click();
  await keyboardSO.separator.click();
  await keyboardSO.one.click();
};

const EVENT_TYPE_ID = 7;
const MARKET_ID = "924.252091866";
const MARKET_ID_2 = "924.252091867";

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
                      {
                        runnerURN: "ppb:sbkRunner:924.252091866/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091866/7",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091866/8",
                      },
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s2/7",
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
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/2",
                          name: "Shakalakaboomboom2",
                          selectionId: 2,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/3",
                          name: "Shakalakaboomboom3",
                          selectionId: 3,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/4",
                          name: "Shakalakaboomboom4",
                          selectionId: 4,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/5",
                          name: "Shakalakaboomboom5",
                          selectionId: 5,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/6",
                          name: "Shakalakaboomboom6",
                          selectionId: 6,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/7",
                          name: "Shakalakaboomboom7",
                          selectionId: 7,
                          handicap: 0,
                          resultType: null,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.252091867/8",
                          name: "Shakalakaboomboom8",
                          selectionId: 8,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/2",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/3",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/4",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/5",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/6",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/7",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.252091867/8",
                      },
                    ],
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
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1435/1",
                      raceURN: "ppb:race:30061949.1435",
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s/7",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:nextRaces/s2/7",
      },
    },
  ],

  sections: [
    {
      sectionType: "GENERIC",
      __typename: "RegulatorySectionGeneric",
      genericSectionTitle: "Responsible Gambling",
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
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
      marketId: MARKET_ID_2,
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
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_COMBINATION = {
  betType: "DOUBLE",
  legCombinations: [],
  betMinStake: 0.1,
  betMaxStake: 1000,
  betMinStakeIncrement: 0.01,
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

const SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const DOUBLE_MOCK = {
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

describe("Horse Racing - Sportsbook - Starting Price", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    const url = "horse-racing/s-7";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(spRunnerSO.element);
  });

  describe("When the user adds one SP selection and another selection from different races to betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(spRunnerBetButtonSO.element);
      await spRunnerBetButtonSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Single Place Panel was not displayed on runner add",
      );
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await Gestures.swipeUpElement(spRunnerBetButtonSO.element, 400);

      await browser.waitUntilClickableNative(pricedRunnerBetButtonSO.element);
      await pricedRunnerBetButtonSO.element.click();

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();

      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Place Panel was not displayed on second runner add",
      );
      await browser.waitUntilDisplayed(multiplesHeaderSO.element);
      await browser.waitUntilDisplayed(firstBetLegSO.element);
      await browser.waitUntilDisplayed(currentMultipleInputSO.element);
    });

    it("[PRPI-3439] Then betslip should open with multiples", async () => {
      expect(await multiplesHeaderSO.element.getText()).toEqual("MULTIPLES");
    });

    it("[PRPI-3440] The first selection in the accordion should have 'SP' odd", async () => {
      expect(await firstBetOddsSO.odds.getText()).toEqual("SP");
    });

    it("[PRPI-3441] The multiple odds field should display 'SP'", async () => {
      expect(await currentMultipleInputSO.numberField.getValue()).toEqual("SP");
    });

    describe("when the user adds a 0.1 stake to selection 2", () => {
      beforeAll(async () => {
        await Gestures.swipeUp(0.5);

        await browser.waitUntilClickableNative(singleInputSO.numberField);
        await singleInputSO.numberField.click();

        await insertStakeWithKeyboard();
        await browser.waitUntilEquals(summarySO.totalReturnsValue, "$0.30");
      });

      it("[PRPI-3442] The total returns should be $0.30", async () => {
        expect(await summarySO.totalReturnsValue.getText()).toEqual("$0.30");
      });

      describe("when the user adds a 0.1 stake to the multiple", () => {
        beforeAll(async () => {
          await Gestures.swipeDownElement(singleSO.element, 500);

          await browser.waitUntilClickableNative(currentStakeInputSO.numberField);
          await currentStakeInputSO.numberField.click();

          await insertStakeWithKeyboard();
          await browser.waitUntilEquals(summarySO.totalReturnsValue, "TBD");
        });

        it("[PRPI-3443] The returns should be 'Returns TBD'", async () => {
          expect(await currentMultipleSO.returns.getText()).toEqual("Returns TBD");
        });

        it("[PRPI-3443] The total returns should be 'TBD'", async () => {
          expect(await summarySO.totalReturnsValue.getText()).toEqual("TBD");
        });
      });

      describe("when the user clicks on place button and expands the multiples accordion", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
          await browser.waitUntilClickableNative(ctaPrimaryButtonSO.element);
          await ctaPrimaryButtonSO.element.click();
          await browser.waitUntilDisplayed(receiptPanelSO.element);
          await browser.waitUntilClickableNative(multiplesCollapseSO.element);
          await multiplesCollapseSO.element.click();
          await browser.waitUntilDisplayed(secondBetSelectionSO.element);
        });

        it("[PRPI-3444] The receipt should appear", async () => {
          expect(await receiptPanelSO.element.isDisplayed()).toEqual(true);
        });

        it("[PRPI-3444] The second selection in the accordion should have 'SP' odd", async () => {
          expect(await secondBetOddsSO.odds.getText()).toEqual("SP");
        });

        it("[PRPI-3444] The multiple odds field should display 'SP'", async () => {
          expect(await multipleBetSegmentSO.leftLabel.getText()).toBe("Odds");
          expect(await multipleBetSegmentSO.leftValue.getText()).toBe("SP");
        });

        it("[PRPI-3444] The multiple returns should be 'TBD'", async () => {
          expect(await multipleBetSegmentSO.rightLabel.getText()).toBe("Returns");
          expect(await multipleBetSegmentSO.rightValue.getText()).toBe("TBD");
        });

        it("[PRPI-3444] The total returns should be 'TBD'", async () => {
          expect(await summarySO.totalReturnsValue.getText()).toEqual("TBD");
        });
      });
    });
  });
});
