const {
  AppPO,
  MinimizedPO,
  SportPagePO,
  SinglesCardPO,
  SinglePO,
  RunnerPO,
  BetControlsPO,
  BetDetailsPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  BetslipDrawerPO,
  KeyboardPO,
  OptionPO,
  PrimaryButtonPO,
  SportsbookMarketPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const sportPage = new SportPagePO();
const raceMarketCardPO = new RaceMarketCardPO(sportPage.scrollableSwimlanes[0]);
const firstRaceCardPO = new CardPO(raceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const firstRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[0]);
const secondRunnerPO = new RunnerPO(firstMarketPO.horseRacingRunnerList[1]);

const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const keyboardPO = new KeyboardPO();
const optionPO = new OptionPO();
const placeButtonPO = new PrimaryButtonPO();
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const secondSingleControlsPO = new BetControlsPO(secondSinglePO.element);
const firstSingleStakeFieldPO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const secondSingleStakeFieldPO = new CurrencyNumberInputFieldPO(secondSingleControlsPO.currencyInput);
const secondSingleBetDetailsPO = new BetDetailsPO(secondSinglePO.element);

const mockService = new MockService();

const EVENT_TYPE_ID = 7;

const BFF_MOCK = {
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
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
                raceViewLink: {
                  viewUrn: "ppb:tbd:view:race:29901908.1410",
                  viewUrl: routes.getRaceViewUrl("7", "29901908.1410"),
                },
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
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
                          urn: "ppb:race:29901908.1410",
                          startTime: "2020-07-13T14:40:00Z",
                          name: "14:40 Wolverhampton",
                          details: {
                            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                          },
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
                            name: "Wind 13th Jul",
                            country: "GB",
                            countryFlag: {
                              medium: "http://example.test.com/mockedImage/image.png",
                            },
                            venue: "Wolverhampton",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901908",
                          name: "Wind 13th Jul",
                          country: "GB",
                          countryFlag: {
                            medium: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Wolverhampton",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          name: "John Snow Snowing Snowing Snowing",
                          selectionId: 2,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.1/3",
                          name: "Shakalala",
                          selectionId: 3,
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
                  urn: "ppb:race:29901908.1410",
                  startTime: "2020-07-13T14:30:00Z",
                  name: "14:30 Windsor",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
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
                numberOfRunnersToDisplay: 3,
                numberOfRunners: 14,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
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
            decimalDisplayOdds: { decimalOdds: 4.33 },
            fractionalDisplayOdds: { numerator: 10, denominator: 3 },
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

  betMinStake: 0.12,
  betMaxStake: 1000,
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

  betMinStake: 0.12,
  betMaxStake: 1000,
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
      decimalDisplayOdds: { decimalOdds: 4.33 },
      fractionalDisplayOdds: { numerator: 10, denominator: 3 },
    },
    decimalDisplayOdds: { decimalOdds: 4.33 },
    fractionalDisplayOdds: { numerator: 10, denominator: 3 },
  },
  eachwayPlaces: 3,
  placeFraction: {
    numerator: 1,
    denominator: 5,
  },
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SIB_NON_COMBINABLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: "924.1",
        selectionId: 1,
      },
      failureCode: "INVALID_COMBINATION",
    },
    {
      failedRunner: {
        marketId: "924.1",
        selectionId: 2,
      },
      failureCode: "INVALID_COMBINATION",
    },
  ],
};

describe("SBK Keyboard Interactions - Singles", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_TYPE_ID));

    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: raceMarketCardPO.market, price: 2, isHorseRacing: true }),
    );
  });

  describe("When a selection is added to the betslip", () => {
    beforeAll(async () => {
      await firstRunnerPO.sportsbookBetButton.waitForClickable();
      await firstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");
    });

    it("[PRPI-8115] The betslip singles should open", async () => {
      expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(true);
    });

    it("[PRPI-8116] The keyboard should be displayed", async () => {
      expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
    });

    describe("When a stake of 0.28 is added via keyboard", () => {
      beforeAll(async () => {
        await keyboardPO.zero.waitForClickable();
        await keyboardPO.zero.click();
        await keyboardPO.separator.click();
        await keyboardPO.two.click();
        await keyboardPO.eight.click();
      });

      it("[PRPI-8117] The stake field should should stay populated with 0.28", async () => {
        expect(await firstSingleStakeFieldPO.numberField.getValue()).toBe("0.28");
      });

      it("[PRPI-8118] The place button is enabled", async () => {
        expect(await placeButtonPO.element.isEnabled()).toBe(true);
      });

      describe("When backspace is pressed once on the keyboard", () => {
        beforeAll(async () => {
          await keyboardPO.delete.waitForClickable();
          await keyboardPO.delete.click();
        });

        it("[PRPI-8119] The stake field is populated with 0.2", async () => {
          expect(await firstSingleStakeFieldPO.numberField.getValue()).toBe("0.2");
        });

        describe("When a toggle exists in the betslip and is pressed", () => {
          beforeAll(async () => {
            await optionPO.title.waitForClickable();
            await optionPO.title.click();
            await browser.waitUntil(() => optionPO.input.isSelected(), {
              timeoutMsg: "Each way checkbox was not selected",
            });
          });

          it("[PRPI-8120] The toggle should be selected", async () => {
            expect(await optionPO.input.isSelected()).toBe(true);
          });

          it("[PRPI-8121] The keyboard should not be dismissed", async () => {
            expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
          });

          describe("When a non combinable selections is added to the betslip", () => {
            beforeAll(async () => {
              await betslipDrawerPO.header.waitForClickable();
              await betslipDrawerPO.header.click();
              await browser.waitUntilDisplayed(minimizedPO.element, "Betslip was not minimized");

              await mockService.mockHttpRequest(getImplyBetsResponse(SIB_NON_COMBINABLE_MOCK));
              await secondRunnerPO.sportsbookBetButton.waitForClickable();
              await secondRunnerPO.sportsbookBetButton.click();
              await browser.waitUntilEquals(minimizedPO.counter, "2");

              await minimizedPO.element.waitForClickable();
              await minimizedPO.element.click();
              await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Multiples betslip not displayed");
            });

            it("[PRPI-8122] The first added single stake input fields should not be focused", async () => {
              expect(await firstSingleStakeFieldPO.numberField.isFocused()).toBe(false);
            });

            it("[PRPI-8122] The second single stake input fields should not be focused", async () => {
              expect(await secondSingleStakeFieldPO.numberField.isFocused()).toBe(false);
            });

            it("[PRPI-8122] The keyboard should not be displayed", async () => {
              expect(await keyboardPO.element.isDisplayedInViewport()).toBe(false);
            });

            describe("When the second single is removed from the betslip", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
                await secondSingleBetDetailsPO.remove.waitForClickable();
                await secondSingleBetDetailsPO.remove.click();

                await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");
              });

              it("[PRPI-8122] The stake input field should be focused", async () => {
                expect(await firstSingleStakeFieldPO.numberField.isFocused()).toBe(true);
              });

              it("[PRPI-8122] The keyboard should be displayed", async () => {
                expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
              });
            });
          });
        });
      });
    });
  });
});
