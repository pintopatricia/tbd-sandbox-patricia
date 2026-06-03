const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard, swipeUpElementFullscreen } = require("../../../../../helpers/gestures");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  MinimizedSO,
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  BetBuilderSummarySO,
  GenericScreenSO,
  BetBuildersCardSO,
  BetBuilderSO,
  BetLegsSO,
  CardSO,
  SportsbookMarketSO,
  RunnerSO,
  BetslipDrawerSO,
  BetSelectionDetailsSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  BetsSummarySO,
  PrimaryButtonSO,
  SubHeaderSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);
const fourthCardSO = new CardSO(genericScreenSO.cards[3]);
const fifthCardSO = new CardSO(genericScreenSO.cards[4]);
const thirdSportsbookMarketSO = new SportsbookMarketSO(thirdCardSO.sportsbookMarket);
const fourthSportsbookMarketSO = new SportsbookMarketSO(fourthCardSO.sportsbookMarket);
const fifthSportsbookMarketSO = new SportsbookMarketSO(fifthCardSO.sportsbookMarket);
const thirdRunnerSO = new RunnerSO(thirdSportsbookMarketSO.runnerList[0]);
const fourthRunnerSO = new RunnerSO(fourthSportsbookMarketSO.runnerList[0]);
const fifthRunnerSO = new RunnerSO(fifthSportsbookMarketSO.runnerList[0]);

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

const placePanelSO = new SportsbookPlacePanelSO();
const placeBetBuilderTitleSO = new SubHeaderSO(placePanelSO.collapsableSections[0].title);
const betBuildersCardSO = new BetBuildersCardSO(placePanelSO.element);
const firstBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[0]);
const secondBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[1]);
const secondBetSelectionsSO = new BetLegsSO(secondBetBuilderSO.element);
const thirdSelectionDetailSOSecondBB = new BetSelectionDetailsSO(secondBetSelectionsSO.selections[2]);
const firstBetControlsSO = new BetControlsSO(firstBetBuilderSO.element);
const secondBetControlsSO = new BetControlsSO(secondBetBuilderSO.element);
const firstStakeSO = new CurrencyNumberInputFieldSO(firstBetControlsSO.currencyInput);
const secondStakeSO = new CurrencyNumberInputFieldSO(secondBetControlsSO.currencyInput);
const betsSummarySO = new BetsSummarySO(placePanelSO.element);
const placeButtonSO = new PrimaryButtonSO(placePanelSO.place);

const receiptPanelSO = new SportsbookReceiptPanelSO();
const receiptFirstBBSO = new BetBuilderSummarySO(receiptPanelSO.betBuilderSummaries[0]);

const BFF_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29359895##MATCH_ODDS",
        title: "Match Odds - Wolves v Man Utd",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.11111111",
              marketType: "MATCH_ODDS_90",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: "ppb:event:29359895",
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.11111111/11111",
                  selectionId: 11111,
                  name: "Wolves",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.11111111/11111" }],
          },
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:29359895##HALF_TIME",
        title: "Half Time - Wolves v Man Utd",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.22222222",
              noLiveData: true,
              name: "Half Time",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: "ppb:event:29359895",
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.22222222/44444",
                  selectionId: 44444,
                  name: "Wolves",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.22222222/44444" }],
          },
        },
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:29359896##MATCH_ODDS`,
        title: "Match Odds - FC Porto v AD Marco",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.33333333",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v AD Marco",
                  urn: `ppb:event:29359896`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.33333333/77777",
                  selectionId: 77777,
                  name: "FC Porto",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.33333333/77777" }],
          },
        },
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:29359896##HALF_TIME`,
        title: "Half Time - FC Porto v AD Marco",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.44444444",
              noLiveData: true,
              name: "Half Time",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v AD Marco",
                  urn: `ppb:event:29359896`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.44444444/12121",
                  selectionId: 12121,
                  name: "FC Porto",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.44444444/12121" }],
          },
        },
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:29359896##CORRECT_SCORE`,
        title: "Correct Score - FC Porto v AD Marco",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.55555555",
              noLiveData: true,
              name: "Correct Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v AD Marco",
                  urn: `ppb:event:29359896`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.55555555/22333",
                  selectionId: 22333,
                  name: "1-0",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.55555555/22333" }],
          },
        },
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:29359000##CORRECT_SCORE`,
        title: "Filler Market",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.55555000",
              noLiveData: true,
              name: "Incorrect Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Filler Game",
                  urn: `ppb:event:29359000`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.55555000/22300",
                  selectionId: 22300,
                  name: "1-0",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.55555000/22300" }],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:card:29359895##MATCH_ODDS", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359895##HALF_TIME", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##MATCH_ODDS", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##HALF_TIME", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##CORRECT_SCORE", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359000##CORRECT_SCORE", __typename: "MarketCard" } },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.11111111",
      runnerDetails: [
        {
          selectionId: "11111",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.22222222",
      runnerDetails: [
        {
          selectionId: "44444",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.33333333",
      runnerDetails: [
        {
          selectionId: "77777",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.44444444",
      runnerDetails: [
        {
          selectionId: "12121",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.55555555",
      runnerDetails: [
        {
          selectionId: "22333",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.55555000",
      runnerDetails: [
        {
          selectionId: "22300",
          noOdds: true,
        },
      ],
    },
  ],
};

const FIRST_RUNNER = { marketId: "924.11111111", selectionId: 11111 };

const FIRST_SINGLE_MOCK = { legCombinations: [{ runners: [FIRST_RUNNER] }] };
const FIRST_SINGLE_ODDS_MOCK = {
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_RUNNER = { marketId: "924.22222222", selectionId: 44444 };

const SECOND_SINGLE_MOCK = { legCombinations: [{ runners: [SECOND_RUNNER] }] };
const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_DOUBLE_SGM = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }],
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

const FIRST_SGM_MOCK = {
  betCombinations: [FIRST_DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_RUNNER = { marketId: "924.33333333", selectionId: 77777 };

const THIRD_SINGLE_MOCK = { legCombinations: [{ runners: [THIRD_RUNNER] }] };
const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_2_LINES = {
  betType: "DOUBLE",
  numLines: 2,
  features: [],
};

const SECOND_SGM_MOCK = {
  betCombinations: [FIRST_DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK, DOUBLE_2_LINES],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const FOURTH_RUNNER = { marketId: "924.44444444", selectionId: 12121 };

const FOURTH_SINGLE_MOCK = { legCombinations: [{ runners: [FOURTH_RUNNER] }] };
const FOURTH_SINGLE_ODDS_MOCK = {
  runner: FOURTH_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_DOUBLE_SGM = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [THIRD_RUNNER] }, { runners: [FOURTH_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 3.2,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 3.2,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 3.2 } },
    decimalDisplayOdds: { decimalOdds: 3.2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_4_LINES = {
  betType: "DOUBLE",
  numLines: 4,
  features: [],
};

const THIRD_SGM_MOCK = {
  betCombinations: [
    FIRST_DOUBLE_SGM,
    SECOND_DOUBLE_SGM,
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    DOUBLE_4_LINES,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const FIFTH_RUNNER = { marketId: "924.55555555", selectionId: 22333 };

const FIFTH_SINGLE_MOCK = { legCombinations: [{ runners: [FIFTH_RUNNER] }] };
const FIFTH_SINGLE_ODDS_MOCK = {
  runner: FIFTH_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM = {
  betType: "TREBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [THIRD_RUNNER] }, { runners: [FOURTH_RUNNER] }, { runners: [FIFTH_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 4.5,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 4.5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 4.5 } },
    decimalDisplayOdds: { decimalOdds: 4.5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_6_LINES = {
  betType: "DOUBLE",
  numLines: 6,
  features: [],
};

const FOURTH_SGM_MOCK = {
  betCombinations: [
    FIRST_DOUBLE_SGM,
    TREBLE_SGM,
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    FIFTH_SINGLE_MOCK,
    DOUBLE_6_LINES,
  ],

  runnerOdds: [
    FIRST_SINGLE_ODDS_MOCK,
    SECOND_SINGLE_ODDS_MOCK,
    THIRD_SINGLE_ODDS_MOCK,
    FOURTH_SINGLE_ODDS_MOCK,
    FIFTH_SINGLE_ODDS_MOCK,
  ],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["SGM"],
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      runners: [{ runner: FIRST_RUNNER }, { runner: SECOND_RUNNER }],
      legs: [{ leg: { betRunners: [{ runner: FIRST_RUNNER }] } }, { leg: { betRunners: [{ runner: SECOND_RUNNER }] } }],
      totalPotentialWin: 2,
      totalStake: 1,
    },
    {
      betModifiers: ["SGM"],
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      runners: [{ runner: THIRD_RUNNER }, { runner: FOURTH_RUNNER }],
      legs: [{ leg: { betRunners: [{ runner: THIRD_RUNNER }] } }, { leg: { betRunners: [{ runner: FOURTH_RUNNER }] } }],
      totalPotentialWin: 2,
      totalStake: 1,
    },
  ],
};

const ENCODED_PIPE = encodeURIComponent("|");
const betsParam = [FIRST_RUNNER, SECOND_RUNNER].reduce(
  (acc, { marketId, selectionId }) => `${acc}${marketId}${ENCODED_PIPE}${selectionId};`,
  "",
);

const CARD_NAME = "betslip_sbk_bet_builders";

xdescribe("Bet Builder bets place", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SGM_MOCK));

    const HOME_VIEW_LINK = getStartViewLink(`football/s-1?bets=${betsParam}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when the user opens the betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(placeBetBuilderTitleSO.element);
      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4884]_should_render_bet_builder_with_one_double`);
    });

    it("[PRPI-4884]_should_render_bet_builder_with_one_double", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4884]_should_render_bet_builder_with_one_double`))
          .misMatchPercentage,
      ).toEqual(0);
    });

    describe("when stake is set to 1", () => {
      beforeAll(async () => {
        await firstStakeSO.setValue(1);
        await hideKeyboard();
        await browser.waitUntilEquals(betsSummarySO.totalReturnsValue, "$2.40");
        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-4885]_should_render_bet_builder_with_one_double_and_show_total_returns`,
        );
      });

      it("[PRPI-4885]_should_render_bet_builder_with_one_double_and_show_total_returns", async () => {
        expect(
          (
            await browser.compareScreen(
              `${CARD_NAME}_[PRPI-4885]_should_render_bet_builder_with_one_double_and_show_total_returns`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });

      describe("when the user adds three combinable selections from another event", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(betslipDrawerSO.header);
          await betslipDrawerSO.header.click();
          await browser.waitUntilNotDisplayed(placePanelSO.element);
        });

        describe("1/3 combinable selection", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_SGM_MOCK));
            await browser.waitUntilDisplayed(thirdRunnerSO.sbkBetButtons[0], "Third bet button is not visible");
            await browser.waitUntilClickableNative(thirdRunnerSO.sbkBetButtons[0]);
            await thirdRunnerSO.sbkBetButtons[0].click();
          });

          describe("2/3 combinable selection", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_SGM_MOCK));
              await browser.waitUntilDisplayed(fourthRunnerSO.sbkBetButtons[0], "Fourth bet button is not visible");
              await browser.waitUntilClickableNative(fourthRunnerSO.betButtons[0]);
              await fourthRunnerSO.betButtons[0].click();
            });

            describe("3/3 combinable selection", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getImplyBetsResponse(FOURTH_SGM_MOCK));
                await swipeUpElementFullscreen(fourthRunnerSO.element);
                await browser.waitUntilClickableNative(
                  fifthRunnerSO.sbkBetButtons[0],
                  "Fifth bet button is not visible",
                );
                await fifthRunnerSO.sbkBetButtons[0].click();
                await browser.waitUntilEquals(minimizedSO.counter, "5");
              });

              describe("and opens the betslip", () => {
                beforeAll(async () => {
                  await browser.waitUntilClickableNative(minimizedSO.element);
                  await minimizedSO.element.click();
                  await browser.waitUntilDisplayed(betBuildersCardSO.element);
                  await swipeUpElementFullscreen(betBuildersCardSO.element);
                  await browser.waitUntilEquals(secondBetBuilderSO.title, "Treble");

                  await browser.waitUntilImageEquals(
                    `${CARD_NAME}_[PRPI-4886]_should_render_bet_builder_with_one_treble`,
                  );
                });

                it("[PRPI-4886]_should_render_bet_builder_with_one_treble", async () => {
                  expect(
                    (await browser.compareScreen(`${CARD_NAME}_[PRPI-4886]_should_render_bet_builder_with_one_treble`))
                      .misMatchPercentage,
                  ).toEqual(0);
                });

                describe("when the user removes one of the selections from the second BB", () => {
                  beforeAll(async () => {
                    await browser.waitUntilDisplayed(thirdSelectionDetailSOSecondBB.title);
                    await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_SGM_MOCK));
                    await thirdSelectionDetailSOSecondBB.removeButton.click();
                    await browser.waitUntil(
                      async () => {
                        const title = await secondBetBuilderSO.title.getText();
                        return title === "Double";
                      },
                      {
                        timeoutMsg: "Unexpected BB collapse title",
                      },
                    );
                  });

                  describe("when stake is set to 1 and clicks the CTA button", () => {
                    beforeAll(async () => {
                      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
                      await secondStakeSO.setValue(1);
                      await hideKeyboard();
                      await browser.waitUntilClickableNative(placeButtonSO.element);
                      await placeButtonSO.element.click();
                      await browser.waitUntilDisplayed(receiptPanelSO.element);

                      await browser.waitUntilImageEquals(
                        `${CARD_NAME}_[PRPI-4887]_should_render_the_receipt_with_first_bet_builder`,
                      );
                    });

                    it("[PRPI-4887]_should_render_the_receipt_with_first_bet_builder", async () => {
                      expect(
                        (
                          await browser.compareScreen(
                            `${CARD_NAME}_[PRPI-4887]_should_render_the_receipt_with_first_bet_builder`,
                          )
                        ).misMatchPercentage,
                      ).toEqual(0);
                    });

                    describe("when scrolling the receipt", () => {
                      beforeAll(async () => {
                        await swipeUpElementFullscreen(receiptFirstBBSO.element);

                        await browser.waitUntilImageEquals(
                          `${CARD_NAME}_[PRPI-4887]_should_render_the_receipt_with_second_bet_builder`,
                        );
                      });

                      it("[PRPI-4887]_should_render_the_receipt_with_second_bet_builder", async () => {
                        expect(
                          (
                            await browser.compareScreen(
                              `${CARD_NAME}_[PRPI-4887]_should_render_the_receipt_with_second_bet_builder`,
                            )
                          ).misMatchPercentage,
                        ).toEqual(0);
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
