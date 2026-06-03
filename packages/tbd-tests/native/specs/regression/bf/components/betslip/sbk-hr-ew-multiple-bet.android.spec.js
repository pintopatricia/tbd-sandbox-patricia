const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const {
  getSportsLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const {
  swipeLeftElement,
  checkIfDisplayedWithSwipe,
  VERTICAL,
  hideKeyboard,
  swipeUpElement,
} = require("../../../../../helpers/gestures");
// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  BottomBarSO,
  SinglesCardSO,
  SingleSO,
  MultiplesCardSO,
  HorseRacingRunnerSO,
  BetslipDrawerSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  OptionSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();

const firstRaceMarketCardSO = new RaceMarketCardSO(genericScreenSO.cards[0]);
const secondRaceMarketCardSO = new RaceMarketCardSO(genericScreenSO.cards[2]);
const firstHRRunnerSO = new HorseRacingRunnerSO(firstRaceMarketCardSO.runners[0]);
const secondHRRunnerSO = new HorseRacingRunnerSO(secondRaceMarketCardSO.runners[0]);

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);
const multipleControlsSO = new BetControlsSO(multiplesCardSO.element);

const multipleEachWayOptionSO = new OptionSO(multiplesCardSO.element);
const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const primaryButtonSO = new PrimaryButtonSO();

const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const singleEachWayOptionSO = new OptionSO(firstSingleSO.element);
const singleStakeFieldSO = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);

const receiptPanelSO = new SportsbookReceiptPanelSO();
const receiptMultipleEWOptionSO = new OptionSO(receiptPanelSO.multiples[0]);
const receiptSingleEWOptionSO = new OptionSO(receiptPanelSO.singles[0]);

const BFF_MOCK = {
  urn: "ppb:tbd:view:sport:7",
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
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.1/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.1/2",
                      },
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
                defaultIndex: 0,
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
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.2/1",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.2/2",
                      },
                    ],
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
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061950.1400/1",
                      raceURN: "ppb:race:30061950.1400",
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
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061950.1400/2",
                      raceURN: "ppb:race:30061950.1400",
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
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:2`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:2`,
                fixture: {
                  urn: `ppb:fixture:2`,
                  home: {
                    name: "Porto",
                  },
                  away: {
                    name: "Marco",
                  },
                },
                sportevent: {
                  name: "Porto v Marco",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:2`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:924.3`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Porto v Marco",
                          urn: `ppb:event:2`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:924.3/4`,
                          selectionId: 4,
                          name: "Porto",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:924.3/5`,
                          selectionId: 5,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:924.3/6`,
                          selectionId: 6,
                          name: "Marco",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:924.3/4`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:924.3/5`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:924.3/6`,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
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

describe("Betslip - SBK Multiples HR EW Place", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(
      getAppContext({
        preferences: {
          oddsMovement: true,
        },
      }),
    );
    const url = "horse-racing/s-7";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(BottomBarSO.browse);
  });

  describe("when user adds one racing selection", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_IMPLY_MOCK));
      await browser.waitUntilDisplayed(firstHRRunnerSO.sbkBetButtons[0], "Wait for bet button timed out");
      await firstHRRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for single place panel timed out");
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilDisplayed(minimizedSO.element, "Wait for minimized betslip timed out");
    });

    describe("when user adds second racing selection", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_IMPLY_MOCK));
        await swipeLeftElement(firstHRRunnerSO.element);
        await secondHRRunnerSO.sbkBetButtons[0].click();
        await browser.waitUntilEquals(minimizedSO.counter, "2");
        await browser.waitUntilClickableNative(minimizedSO.element);
        await minimizedSO.element.click();
        await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Timed out waiting for SBK place panel");
      });

      it("[PRPI-3389] should open betslip multiples place panel", async () => {
        expect(await sportsbookPlacePanelSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-3390] should have each way title", async () => {
        expect(await multipleEachWayOptionSO.title.getText()).toBe("Each Way");
      });

      it("[PRPI-3391] should have each way check box unselected", async () => {
        expect(await multipleEachWayOptionSO.checkbox.getAttribute("selected")).toBe("false");
      });

      describe("when user adds 2 stake and selects Each Way", () => {
        beforeAll(async () => {
          await multipleEachWayOptionSO.checkbox.click();
          await browser.waitUntilClickableNative(multipleStakeInputFieldSO.numberField);
          await multipleStakeInputFieldSO.numberField.click();
          await multipleStakeInputFieldSO.setValue(2);
          await hideKeyboard();
          await browser.waitUntilDisplayed(multipleStakeInputFieldSO.multiplier, "Wait for multiplier timed out");
        });

        it("[PRPI-3392] should have checkbox selected", async () => {
          expect(await multipleEachWayOptionSO.checkbox.getAttribute("selected")).toBe("true");
        });

        it("[PRPI-3393] should have multiplier displayed on input", async () => {
          expect(await multipleStakeInputFieldSO.multiplier.getText()).toContain("2x");
        });

        it("[PRPI-3394] should have returns label", async () => {
          expect(await multipleControlsSO.returns.isDisplayed()).toBeTrue();
        });

        describe("when user adds 0.1 stake to singles", () => {
          beforeAll(async () => {
            // single stake field is outside of the view port and we need to this swipe in order for it to be visible
            await checkIfDisplayedWithSwipe({
              scrollContainer: multiplesCardSO.element,
              searchableElement: singleEachWayOptionSO.checkbox,
              direction: VERTICAL.UP,
              percentage: 0.6,
            });
            await singleStakeFieldSO.setValue(0.1);
            await hideKeyboard();
          });

          describe("and selects Each Way", () => {
            beforeAll(async () => {
              await singleEachWayOptionSO.checkbox.click();
              await browser.waitUntilDisplayed(singleStakeFieldSO.multiplier, "Wait for multiplier timed out");
            });

            describe("when user places the bet", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS));
                await primaryButtonSO.element.click();
                await browser.waitUntilDisplayed(receiptPanelSO.element, "Wait for receipt panel timed out");
                await swipeUpElement(receiptPanelSO.element, 500);
              });

              it("[PRPI-3395] the double on the receipt, should have each way title", async () => {
                expect(await receiptMultipleEWOptionSO.title.getText()).toBe("Each Way");
              });

              it("[PRPI-3395] the double on the receipt, should have green tick icon", async () => {
                expect(await receiptMultipleEWOptionSO.checkmarkReadOnly.isDisplayed()).toBe(true);
              });

              it("[PRPI-3395] the Single on the receipt, should have each way title", async () => {
                expect(await receiptSingleEWOptionSO.title.getText()).toBe("Each Way");
              });

              it("[PRPI-3395] the Single on the receipt, should have green tick icon", async () => {
                expect(await receiptSingleEWOptionSO.checkmarkReadOnly.isDisplayed()).toBe(true);
              });
            });
          });
        });
      });
    });
  });
});
