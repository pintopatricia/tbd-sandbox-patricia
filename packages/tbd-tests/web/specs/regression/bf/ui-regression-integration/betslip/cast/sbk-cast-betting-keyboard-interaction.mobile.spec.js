const {
  AppPO,
  MinimizedPO,
  SportPagePO,
  CastBetsCardPO,
  SinglePO,
  SinglesCardPO,
  ScrollableSwimlanePO,
  RunnerPO,
  BetDetailsPO,
  CardPO,
  CastBetPO,
  CurrencyNumberInputFieldPO,
  BetslipDrawerPO,
  ForecastTricastSelectionPO,
  KeyboardPO,
  PebbleListPO,
  SportsbookBetButtonPO,
  SportsbookMarketPO,
  BetControlsPO,
  DraggableListItemPO,
  DraggableListPO,
  SportsbookPlacePanelPO,
  PebblePO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const sportPage = new SportPagePO();
const scrollableSwimlanePO = new ScrollableSwimlanePO(sportPage.scrollableSwimlanes[0]);
const raceMarketCardPO = new RaceMarketCardPO(scrollableSwimlanePO.scrollItems[0]);
const raceCardPO = new CardPO(raceMarketCardPO.market);
const sportsbookMarketPO = new SportsbookMarketPO(raceCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(sportsbookMarketPO.horseRacingRunnerList[0]);
const secondRunnerPO = new RunnerPO(sportsbookMarketPO.horseRacingRunnerList[1]);
const firstSportsbookBetButtonPO = new SportsbookBetButtonPO(firstRunnerPO.sportsbookBetButton);
const secondSportsbookBetButtonPO = new SportsbookBetButtonPO(secondRunnerPO.sportsbookBetButton);

const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(sportsbookPlacePanelPO.element);
const keyboardPO = new KeyboardPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const castBetsCardPO = new CastBetsCardPO(sportsbookPlacePanelPO.element);
const castBetPO = new CastBetPO(castBetsCardPO.castBets[0]);
const castBetTypesPO = new PebbleListPO(castBetPO.element);
const secondBetTypePO = new PebblePO(castBetTypesPO.pebbles[1]);
const draggableList = new DraggableListPO(castBetPO.element);
const firstSelectionPO = new ForecastTricastSelectionPO(draggableList.items[0]);
const castBetStakePO = new CurrencyNumberInputFieldPO(castBetPO.element);
const firstDraggableItemPO = new DraggableListItemPO(draggableList.items[0]);
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const secondSingleBetDetailsPO = new BetDetailsPO(secondSinglePO.element);

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
                        urn: "ppb:eventType:7",
                        name: "HR",
                        sportId: 7,
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

describe("SBK Keyboard Interactions - Cast Bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        currentUrl: routes.getRacingViewUrl(),
      }),
    );
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_TYPE_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
  });

  describe("When two selections from the same race are added to the betslip", () => {
    beforeAll(async () => {
      await firstSportsbookBetButtonPO.element.waitForClickable();
      await firstSportsbookBetButtonPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");

      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedPO.element, "Betslip was not minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_FORECAST_MOCK));
      await browser.waitUntilDisplayed(secondSportsbookBetButtonPO.element, "Second runner bet button not visible");
      await secondSportsbookBetButtonPO.element.waitForClickable();
      await secondSportsbookBetButtonPO.element.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");

      await minimizedPO.element.waitForClickable();
      await minimizedPO.element.click();
      await browser.waitUntilDisplayed(castBetPO.title, "Sportsbook Cast Bet not displayed");
    });

    describe("When the cast bet stake field is pressed", () => {
      beforeAll(async () => {
        await castBetStakePO.numberField.waitForClickable();
        await castBetStakePO.numberField.click();
        await browser.waitUntil(() => castBetStakePO.numberField.isFocused());
        await browser.waitUntilDisplayed(keyboardPO.element);
      });

      it("[PRPI-7712] The keyboard should display", async () => {
        expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
      });

      describe("When a stake of 1.79 is added via keyboard", () => {
        beforeAll(async () => {
          await browser.waitUntilStopsMoving(keyboardPO.element);
          await keyboardPO.one.waitForClickable();
          await keyboardPO.one.click();
          await keyboardPO.separator.click();
          await keyboardPO.seven.click();
          await keyboardPO.nine.click();
        });

        it("[PRPI-7713] The stake field is populated with 1.79", async () => {
          expect(await castBetStakePO.numberField.getValue()).toBe("1.79");
        });

        describe("When the runner order is changed", () => {
          beforeAll(async () => {
            const { height } = await firstSelectionPO.element.getSize();

            await firstDraggableItemPO.icon.dragAndDrop({ x: 0, y: height + 10 });
            await browser.waitUntilEquals(firstSelectionPO.positionNumber, "1st");
          });

          it("[PRPI-7714] The keyboard should not be dismissed", async () => {
            expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
          });

          describe("When the user changes the selected cast type", () => {
            beforeAll(async () => {
              await secondBetTypePO.element.waitForClickable();
              await secondBetTypePO.element.click();
              await browser.waitUntilContainsClass(secondBetTypePO.element, PebblePO.states.active);
            });

            it("[PRPI-7715] The keyboard should not be displayed", async () => {
              expect(await keyboardPO.element.isDisplayedInViewport()).toBe(false);
            });

            describe("When the second single is removed from the betslip", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
                await secondSingleBetDetailsPO.remove.waitForClickable();
                await secondSingleBetDetailsPO.remove.click();

                await browser.waitUntil(async () => (await singlesCardPO.singles.length) === 1);
                await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");
                await browser.waitUntilDisplayed(keyboardPO.element);
              });

              it("[PRPI-7715] The stake input field should be focused", async () => {
                expect(await stakeInputFieldPO.numberField.isFocused()).toBe(true);
              });

              it("[PRPI-7715] The keyboard should be displayed", async () => {
                expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
              });
            });
          });
        });
      });
    });
  });
});
