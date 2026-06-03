const {
  AppPO,
  MinimizedPO,
  SportPagePO,
  SportsbookReceiptPanelPO,
  SinglesCardPO,
  SinglePO,
  ScrollableSwimlanePO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  OptionPO,
  BetControlsPO,
  BetSummaryPO,
  SportsbookPlacePanelPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPage = new SportPagePO();
const scrollableSwimlane = new ScrollableSwimlanePO(sportPage.scrollableSwimlanes[0]);
const firstRaceMarketCardPO = new RaceMarketCardPO(scrollableSwimlane.scrollItems[0]);
const secondRaceMarketCardPO = new RaceMarketCardPO(scrollableSwimlane.scrollItems[1]);

// Next Races Card
const firstRaceCardPO = new CardPO(firstRaceMarketCardPO.market);
const secondRaceCardPO = new CardPO(secondRaceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const secondMarketPO = new SportsbookMarketPO(secondRaceCardPO.sportsbookMarket);
const firstRaceFirstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const secondRaceFirstRunnerPO = new RunnerPO(secondMarketPO.horseRacingRunnerList[0]);
const firstRaceFirstRunnerBetButtonPO = new SportsbookBetButtonPO(firstRaceFirstRunnerPO.sportsbookBetButton);
const secondRaceFirstRunnerBetButtonPO = new SportsbookBetButtonPO(secondRaceFirstRunnerPO.sportsbookBetButton);

// Betslip Place
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedPO = new MinimizedPO();
const placePanelPO = new SportsbookPlacePanelPO();
const multiplesEachWayOptionPO = new OptionPO(placePanelPO.element);
const multiplesControlsPO = new BetControlsPO();
const multiplesStakeFieldPO = new CurrencyNumberInputFieldPO(multiplesControlsPO.currencyInput);
const singlesCardsPO = new SinglesCardPO(placePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardsPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const firstSingleStakePO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const singleEachWayOptionPO = new OptionPO(firstSinglePO.element);
const placeButtonPO = new PrimaryButtonPO();

// Betslip Receipt
const receiptPanelPO = new SportsbookReceiptPanelPO();
const singleReceiptEachWayOptionPO = new OptionPO(receiptPanelPO.singles[0]);
const multipleSummaryPO = new BetSummaryPO(receiptPanelPO.multiples[0]);
const multipleReceiptEachWayOptionPO = new OptionPO(multipleSummaryPO.element);

const mockService = new MockService();

const SPORT_ID = 7;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
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
                numberOfRunners: 2,
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
                        urn: "ppb:eventType:7",
                        name: "HR",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061949.1335",
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
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          name: "B",
                          selectionId: 2,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.1/1" }, { runnerURN: "ppb:sbkRunner:924.1/2" }],
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
                    numberOfRunners: 3,
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
                    {
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
                numberOfRunnersToDisplay: 2,
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 2,
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
                        urn: "ppb:eventType:7",
                        name: "HR",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061950.1400",
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
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          name: "C",
                          selectionId: 1,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          name: "D",
                          selectionId: 2,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }, { runnerURN: "ppb:sbkRunner:924.2/2" }],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061950.1400",
                  startTime: "2020-07-13T14:00:00",
                  name: "14:00 Lingfield",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 2,
                  },
                  runners: [
                    {
                      selectionId: 1,
                      horse: {
                        name: "C",
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
                      selectionId: 2,
                      horse: {
                        name: "D",
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
                numberOfRunnersToDisplay: 2,
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
          noOdds: true,
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
          noOdds: true,
        },
      ],
    },
  ],
};

const FIRST_COMBINATION = {
  betMinStake: 0.05,
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

const FIRST_COMBINATION_ODDS = {
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

const SECOND_COMBINATION = {
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

const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: "924.2",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalDisplayOdds: { numerator: 1, denominator: 1 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
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
  averageOdds: 8,
  winAverageOdds: 8,
  eachwayAverageOdds: 5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 8 } },
    decimalDisplayOdds: { decimalOdds: 8 },
  },
  eachwayAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 5 } },
    decimalDisplayOdds: { decimalOdds: 5 },
  },
  betMinStakeIncrement: 0.01,
  betType: "DOUBLE",
};

const FIRST_IMPLY_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const SECOND_IMPLY_MOCK = {
  betCombinations: [FIRST_COMBINATION, SECOND_COMBINATION, DOUBLE_COMBINATION_ODDS],
  runnerOdds: [FIRST_COMBINATION_ODDS, SECOND_COMBINATION_ODDS],
};

const SPB_SUCCESS = {
  result: [
    {
      betType: "SINGLE",
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
        },
      ],
    },
    {
      betType: "DOUBLE",
      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.2", selectionId: 1 } }],
          },
        },
      ],
    },
  ],
};

describe("Betslip Multiple Each Way", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getRacingViewUrl()}`);

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: firstRaceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
  });

  describe("when user adds two racing selections", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_IMPLY_MOCK));
      await firstRaceFirstRunnerBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);

      await betslipDrawerPO.header.click();
      await browser.waitUntilEquals(minimizedPO.title, "$10.00 Single @ 2 returns $20.00");

      await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_IMPLY_MOCK));
      await secondRaceFirstRunnerBetButtonPO.element.scrollIntoView({
        block: "center",
      });
      await secondRaceFirstRunnerBetButtonPO.element.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");

      await minimizedPO.element.waitForClickable();
      await minimizedPO.element.click();
      await browser.waitUntilDisplayed(multiplesEachWayOptionPO.element);
    });

    it("[PRPI-6355] should open betslip multiples place panel", async () => {
      expect(await placePanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-6356] should have each way title", async () => {
      expect(await multiplesEachWayOptionPO.title.getText()).toBe("Each Way");
    });

    it("[PRPI-6357] should have each way checkbox unselected", async () => {
      expect(await multiplesEachWayOptionPO.input.isSelected()).toBe(false);
    });

    describe("when user adds 2 stake to Double and selects Each Way", () => {
      beforeAll(async () => {
        await multiplesStakeFieldPO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(multiplesStakeFieldPO.element);

        await multiplesStakeFieldPO.numberField.waitForClickable();
        await multiplesStakeFieldPO.numberField.click();
        await multiplesStakeFieldPO.setValue("2");

        await multiplesEachWayOptionPO.input.click();
        await browser.waitUntilDisplayed(multiplesStakeFieldPO.multiplier);
      });

      it("[PRPI-6358] should have each way checkbox selected", async () => {
        expect(await multiplesEachWayOptionPO.input.isSelected()).toBe(true);
      });

      it("[PRPI-6359] should have multiplier displayed on input", async () => {
        expect(await multiplesStakeFieldPO.multiplier.getText()).toBe("2x");
      });

      it("[PRPI-6360] should have returns label", async () => {
        expect(await multiplesControlsPO.returnsLabel.getText()).toBe("Returns");
        expect(await multiplesControlsPO.returnsValueContainer.getText()).toBe("$20.00");
      });

      describe("when user adds 0.1 stake to single, selects Each Way and places the bet", () => {
        beforeAll(async () => {
          await firstSingleStakePO.element.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(firstSingleStakePO.element);

          await firstSingleStakePO.numberField.waitForClickable();
          await firstSingleStakePO.numberField.click();
          await firstSingleStakePO.setValue("0.1");

          await singleEachWayOptionPO.input.scrollIntoView({
            block: "center",
          });
          await singleEachWayOptionPO.input.click();
          await browser.waitUntil(() => singleEachWayOptionPO.input.isSelected(), {
            timeoutMsg: "Single EW checkbox timed out",
          });
          await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS));
          await placeButtonPO.element.click();
          await browser.waitUntilDisplayed(singleReceiptEachWayOptionPO.element);
        });

        it("[PRPI-6361] the Double on the receipt, should have each way title", async () => {
          expect(await multipleReceiptEachWayOptionPO.title.getText()).toBe("Each Way");
        });

        it("[PRPI-6362] the Double on the receipt, should have green tick icon", async () => {
          expect(await multipleReceiptEachWayOptionPO.selectedCheckMarkReadOnly.isDisplayed()).toBe(true);
        });

        it("[PRPI-6363] the Single on the receipt, should have each way title", async () => {
          expect(await singleReceiptEachWayOptionPO.title.getText()).toBe("Each Way");
        });

        it("[PRPI-6364] the Single on the receipt, should have green tick icon", async () => {
          expect(await singleReceiptEachWayOptionPO.selectedCheckMarkReadOnly.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
