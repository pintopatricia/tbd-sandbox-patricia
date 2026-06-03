const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { hideKeyboard, swipeUpElementFullscreen } = require("../../../../../helpers/gestures");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
  MultiBetBuilderSO,
  GenericScreenSO,
  CardSO,
  BetslipDrawerSO,
  SportsbookMarketSO,
  RunnerSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  PrimaryButtonSO,
  AlertSO,
  HorseRacingRunnerSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdCardSO = new RaceMarketCardSO();
const firstSbkMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSbkMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const firstSbkRunnerSO = new RunnerSO(firstSbkMarketSO.runnerList[0]);
const secondSbkRunnerSO = new RunnerSO(secondSbkMarketSO.runnerList[0]);
const thirdSbkRunnerSO = new HorseRacingRunnerSO(thirdCardSO.runners[0]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const multiBetBuilderSO = new MultiBetBuilderSO();
const multiBetBuilderControlsSO = new BetControlsSO(multiBetBuilderSO.element);
const multiBetBuilderStakeSO = new CurrencyNumberInputFieldSO(multiBetBuilderControlsSO.currencyInput);
const alertSO = new AlertSO();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  sportevent: {
    name: "Team A vs Team B",
    urn: `ppb:event:29359895`,
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##MATCH_ODDS",
        cardTitle: "Match Odds",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "Team A vs Team B",
            urn: `ppb:event:29359895`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.1",
              marketType: "MATCH_ODDS_90",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Team A vs Team B",
                  urn: `ppb:event:29359895`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                  selectionId: 1,
                  name: "Team A",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/2",
                  selectionId: 2,
                  name: "Draw",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.1/3",
                  selectionId: 3,
                  name: "Team B",
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
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##BOTH_TEAMS_TO_SCORE",
        cardTitle: "Both teams to score",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "Team A vs Team B",
            urn: `ppb:event:29359895`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.2",
              noLiveData: true,
              name: "Both teams to score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Team A vs Team B",
                  urn: `ppb:event:29359895`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.2/1",
                  selectionId: 1,
                  name: "Yes",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.2/2",
                  selectionId: 2,
                  name: "No",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }, { runnerURN: "ppb:sbkRunner:924.2/2" }],
          },
        },
      },
    },
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:topEventsInSport:2",
        cardGroupTitle: "League",
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
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                numberOfRunners: 1,
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
                title: "Win",
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
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
                          urn: "ppb:race:30061949.1335",
                          startTime: "2020-07-13T14:40:00",
                          name: "Windsor",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:30061949",
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
                          urn: "ppb:meeting:30061949",
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
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          name: "Shakalakaboomboom",
                          selectionId: 1,
                          handicap: 0,
                          resultType: null,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.3/1",
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
                    urn: "ppb:meeting:30061949",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Windsor",
                  },
                },
                numberOfRunnersToDisplay: 1,
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
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##MATCH_ODDS",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##BOTH_TEAMS_TO_SCORE",
      },
    },
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:topEventsInSport:2",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const APP_CONTEXT_MOCK = {
  throttles: {
    MULTI_BET_BUILDER_ONBOARDING: {
      isActive: true,
    },
  },
};

const FIRST_RUNNER = { marketId: "924.1", selectionId: 1 };
const SECOND_RUNNER = { marketId: "924.2", selectionId: 1 };
const THIRD_RUNNER = { marketId: "924.3", selectionId: 1 };

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [FIRST_RUNNER],
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    decimalDisplayOdds: { decimalOdds: 1.1 },
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [SECOND_RUNNER],
    },
  ],
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    decimalDisplayOdds: { decimalOdds: 1.1 },
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TWO_SINGLES_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [THIRD_RUNNER],
    },
  ],
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    decimalDisplayOdds: { decimalOdds: 1.1 },
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_MULTI_SGM_MOCK = {
  betType: "TREBLE",
  features: ["SGM_MULTIPLES"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const MULTI_BET_BUILDER_MOCK = {
  betCombinations: [TREBLE_MULTI_SGM_MOCK, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["SGM_MULTIPLES"],
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      runners: [{ runner: FIRST_RUNNER }, { runner: SECOND_RUNNER }, { runner: THIRD_RUNNER }],
      legs: [
        { leg: { betRunners: [{ runner: FIRST_RUNNER }] } },
        { leg: { betRunners: [{ runner: SECOND_RUNNER }] } },
        { leg: { betRunners: [{ runner: THIRD_RUNNER }] } },
      ],

      totalPotentialWin: 2,
      totalStake: 0.12,
    },
  ],
};

const CARD_NAME = "betslip_sbk";

xdescribe("SBK Multi Bet Builder", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));

    const HOME_VIEW_LINK = getStartViewLink(`football/s-${EVENT_TYPE_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when adding the first selection", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilClickableNative(firstSbkRunnerSO.sbkBetButtons[0]);

      await firstSbkRunnerSO.sbkBetButtons[0].click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "First selection hasn't been added");
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");
    });

    describe("when adding the second selection", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLES_MOCK));

        await browser.waitUntilDisplayed(secondSbkRunnerSO.sbkBetButtons[0], "Second runner bet button not visible");
        await browser.waitUntilClickableNative(secondSbkRunnerSO.sbkBetButtons[0]);
        await secondSbkRunnerSO.sbkBetButtons[0].click();

        await browser.waitUntilEquals(minimizedSO.counter, "2");
        await swipeUpElementFullscreen(secondSbkRunnerSO.element);
      });

      describe("when adding the last selection", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(MULTI_BET_BUILDER_MOCK));

          await browser.waitUntilDisplayed(thirdSbkRunnerSO.sbkBetButtons[0], "Third runner bet button not visible");
          await browser.waitUntilClickableNative(thirdSbkRunnerSO.sbkBetButtons[0]);

          await thirdSbkRunnerSO.sbkBetButtons[0].click();

          await browser.waitUntilEquals(minimizedSO.counter, "3");

          await browser.waitUntilClickableNative(minimizedSO.element);
          await minimizedSO.element.click();

          await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Multiples betslip not displayed");

          await browser.waitUntilImageEquals(
            `${CARD_NAME}_[PRPI-4894]_should_render_multi_bet_builder_with_onboarding_message`,
          );
        });

        it("[PRPI-4894]_should_render_multi_bet_builder_with_onboarding_message", async () => {
          expect(
            (
              await browser.compareScreen(
                `${CARD_NAME}_[PRPI-4894]_should_render_multi_bet_builder_with_onboarding_message`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });

        describe("when closing the on boarding message", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(alertSO.action);
            await alertSO.action.click();

            await multiBetBuilderStakeSO.numberField.click();
            await multiBetBuilderStakeSO.numberField.setValue(0.12);
            await hideKeyboard();

            await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4895]_should_render_multi_bet_builder`);
          });

          it("[PRPI-4895]_should_render_multi_bet_builder", async () => {
            expect(
              (await browser.compareScreen(`${CARD_NAME}_[PRPI-4895]_should_render_multi_bet_builder`))
                .misMatchPercentage,
            ).toEqual(0);
          });

          describe("when collapsing betslip", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(betslipDrawerSO.header);
              await betslipDrawerSO.header.click();
              await browser.waitUntilDisplayed(minimizedSO.counter, "Betslip is not collapsed");

              await browser.waitUntilImageEquals(
                `${CARD_NAME}_[PRPI-4896]_should_render_multi_bet_builder_info_in_collapsed_betslip`,
              );
            });

            it("[PRPI-4896]_should_render_multi_bet_builder_info_in_collapsed_betslip", async () => {
              expect(
                (
                  await browser.compareScreen(
                    `${CARD_NAME}_[PRPI-4896]_should_render_multi_bet_builder_info_in_collapsed_betslip`,
                  )
                ).misMatchPercentage,
              ).toEqual(0);
            });

            describe("when placing the multi", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(minimizedSO.element);
                await minimizedSO.element.click();
                await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Multiples betslip not displayed");

                await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));

                await browser.waitUntilClickableNative(placeButtonSO.element);
                await placeButtonSO.element.click();

                await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Receipt was not displayed");
                await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4897]_should_render_multi_bet_builder_receipt`);
              });

              it("[PRPI-4897]_should_render_multi_bet_builder_receipt", async () => {
                expect(
                  (await browser.compareScreen(`${CARD_NAME}_[PRPI-4897]_should_render_multi_bet_builder_receipt`))
                    .misMatchPercentage,
                ).toEqual(0);
              });
            });
          });
        });
      });
    });
  });
});
