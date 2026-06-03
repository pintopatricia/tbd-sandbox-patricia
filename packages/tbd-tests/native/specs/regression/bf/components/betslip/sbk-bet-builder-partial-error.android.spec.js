const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const {
  getHomeLayoutWithViewLink,
  getEventLayout,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { swipeDownElement } = require("../../../../../helpers/gestures");

const {
  SportsbookPlacePanelSO,
  BetBuildersCardSO,
  BetBuilderSO,
  BetLegsSO,
  GenericScreenSO,
  CardSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  MinimizedSO,
  BetSelectionDetailsSO,
  HintSO,
  SelectionsBoardSO,
  SportsbookMarketSO,
  RunnerSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstSbkMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSbkMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(firstSbkMarketSO.runnerList[1]);
const thirdRunnerSO = new RunnerSO(firstSbkMarketSO.runnerList[2]);
const fourthRunnerSO = new RunnerSO(firstSbkMarketSO.runnerList[3]);
const firstSbkRunnerSO = new SportsbookBetButtonSO(firstRunnerSO.sbkBetButtons[0]);
const secondSbkRunnerSO = new SportsbookBetButtonSO(secondRunnerSO.sbkBetButtons[0]);
const thirdSbkRunnerSO = new SportsbookBetButtonSO(thirdRunnerSO.sbkBetButtons[0]);
const fourthSbkRunnerSO = new SportsbookBetButtonSO(fourthRunnerSO.sbkBetButtons[0]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const betBuildersCardSO = new BetBuildersCardSO(sportsbookPlacePanelSO.element);
const firstBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[0]);

const firstBetBuilderFailedLegsSO = new BetLegsSO(firstBetBuilderSO.betLegs[0]);
const firstFailedSelectionsBoardSO = new SelectionsBoardSO(firstBetBuilderFailedLegsSO.element);
const firstBetBuilderCombinedLegsSO = new BetLegsSO(firstBetBuilderSO.betLegs[1]);
const firstFailedBetDetailsSO = new BetSelectionDetailsSO(firstBetBuilderFailedLegsSO.selections[0]);
const secondFailedBetDetailsSO = new BetSelectionDetailsSO(firstBetBuilderFailedLegsSO.selections[1]);
const firstSelectionHintSO = new HintSO(firstFailedBetDetailsSO.hint);
const secondSelectionHintSO = new HintSO(secondFailedBetDetailsSO.hint);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const MARKET_ID = "924.1";

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "4",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: `ppb:eventType:${EVENT_TYPE_ID}`,
    },
    name: "Team A vs Team B",
  },
  edges: [
    {
      node: {
        urn: `ppb:tbd:card:${EVENT_ID}##TOTAL_CARDS`,
        title: "Team A vs Team B",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID}`,
              noLiveData: true,
              name: "Team A vs Team B",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                  selectionId: "1",
                  name: "Team B",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                  selectionId: "2",
                  name: "Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                  selectionId: "3",
                  name: "Team A",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID}/4`,
                  selectionId: "4",
                  name: "Extra",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:sbkRunner:${MARKET_ID}/1` },
              { runnerURN: `ppb:sbkRunner:${MARKET_ID}/2` },
              { runnerURN: `ppb:sbkRunner:${MARKET_ID}/3` },
              { runnerURN: `ppb:sbkRunner:${MARKET_ID}/4` },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [{ node: { urn: `ppb:tbd:card:${EVENT_ID}##TOTAL_CARDS`, __typename: "MarketCard" } }],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.12,
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

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 2,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.2,
  winAverageOdds: 1.2,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 3,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.3,
  winAverageOdds: 1.3,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 3,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.3 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 4,
        },
      ],
    },
  ],

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.4,
  winAverageOdds: 1.4,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.4 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.4 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const INVALID_SGM_DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_ID,
        selectionId: 1,
      },
      combinationGroups: [1],
      failureCode: "INVALID_SGM_COMBINATION",
    },
    {
      failedRunner: {
        marketId: MARKET_ID,
        selectionId: 2,
      },
      combinationGroups: [1],
      failureCode: "INVALID_SGM_COMBINATION",
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SAME_MARKET_DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    FOURTH_SINGLE_MOCK,
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: MARKET_ID,
              selectionId: 3,
            },
          ],
        },
        {
          runners: [
            {
              marketId: MARKET_ID,
              selectionId: 4,
            },
          ],
        },
      ],

      combinationGroup: 1,
      betType: "DOUBLE",
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      features: ["SGM"],
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 1,
    },
  ],

  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_ID,
        selectionId: 1,
      },
      combinationGroups: [1],
      failureCode: "IMPOSSIBLE_SAME_MARKET_COMBINATION",
    },
    {
      failedRunner: {
        marketId: MARKET_ID,
        selectionId: 2,
      },
      combinationGroups: [1],
      failureCode: "IMPOSSIBLE_SAME_MARKET_COMBINATION",
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK, FOURTH_SINGLE_ODDS_MOCK],
};

const NOT_ELIGIBLE_DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: MARKET_ID,
              selectionId: 3,
            },
          ],
        },
        {
          runners: [
            {
              marketId: MARKET_ID,
              selectionId: 4,
            },
          ],
        },
      ],

      combinationGroup: 1,
      betType: "DOUBLE",
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      features: ["SGM"],
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 1,
    },
  ],

  betFailures: [
    {
      failedRunner: {
        marketId: MARKET_ID,
        selectionId: 2,
      },
      combinationGroups: [1],
      failureCode: "NOT_ELIGIBLE_SGM_SELECTION",
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

describe("Bet Builder Error - non-combinable", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(
      getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
    );
    await mockService.mockHttpRequest(
      getAppContext({
        preferences: {
          oddsMovement: true,
        },
      }),
    );
    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("adding the first selection", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstSbkRunnerSO.element, "First bet button is not visible");
      await browser.waitUntilClickableNative(firstSbkRunnerSO.element);
      await firstSbkRunnerSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "First selection hasn't been added");

      await browser.waitUntilDisplayed(betslipDrawerSO.element);
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element, "Singles panel hasn't been minimized");
    });

    describe("then adding the non-combinable selection", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(secondSbkRunnerSO.element, "Second runner bet button not visible");

        await mockService.mockHttpRequest(getImplyBetsResponse(INVALID_SGM_DOUBLE_MOCK, { ignoreLegsOrder: true }));
        await browser.waitUntilClickableNative(secondSbkRunnerSO.element);
        await secondSbkRunnerSO.element.click();
      });

      describe("opening the betslip", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(minimizedSO.element);
          await browser.waitUntilClickableNative(minimizedSO.element);
          await minimizedSO.element.click();
          await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element);
          await browser.waitUntilEquals(firstFailedSelectionsBoardSO.title, "Some selections cannot be combined");
          await browser.waitUntilEquals(firstSelectionHintSO.message, "NOT COMBINABLE");
          await browser.waitUntilEquals(secondSelectionHintSO.message, "NOT COMBINABLE");
          await browser.waitUntilEquals(
            firstBetBuilderFailedLegsSO.description,
            "1 or more of these selections aren't combinable. Review them and delete accordingly to place a valid Bet Builder.",
          );
        });

        it("[PRPI-3331] Should display 'Some selections cannot be combined' in the top accordion", async () => {
          expect(await firstFailedSelectionsBoardSO.title.getText()).toBe("Some selections cannot be combined");
        });

        it("[PRPI-3332] Should display 'NOT COMBINABLE' for each failed selection", async () => {
          expect(await firstSelectionHintSO.message.getText()).toBe("NOT COMBINABLE");
          expect(await secondSelectionHintSO.message.getText()).toBe("NOT COMBINABLE");
        });

        it("[PRPI-3333] Should display '1 or more of these selections aren't combinable. Review them and delete accordingly to place a valid Bet Builder'", async () => {
          expect(await firstBetBuilderFailedLegsSO.description.getText()).toBe(
            "1 or more of these selections aren't combinable. Review them and delete accordingly to place a valid Bet Builder.",
          );
        });

        describe("with 2 combinable selections and 2 non combinable from the same market", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getImplyBetsResponse(SAME_MARKET_DOUBLE_MOCK, { ignoreLegsOrder: true }));

            await browser.waitUntilDisplayed(betslipDrawerSO.element);
            await browser.waitUntilClickableNative(betslipDrawerSO.header);
            await betslipDrawerSO.header.click();
            await browser.waitUntilNotDisplayed(sportsbookPlacePanelSO.element);

            await browser.waitUntilDisplayed(thirdSbkRunnerSO.element);
            await browser.waitUntilClickableNative(thirdSbkRunnerSO.element);
            await thirdSbkRunnerSO.element.click();

            await browser.waitUntilDisplayed(fourthSbkRunnerSO.element);
            await browser.waitUntilClickableNative(fourthSbkRunnerSO.element);
            await fourthSbkRunnerSO.element.click();
          });

          describe("and re-open the betslip", () => {
            beforeAll(async () => {
              await browser.waitUntilDisplayed(minimizedSO.element);
              await browser.waitUntilClickableNative(minimizedSO.element);
              await minimizedSO.element.click();

              await browser.waitUntilEquals(firstFailedSelectionsBoardSO.title, "Some selections cannot be combined");
            });

            it("[PRPI-3334] Should display 'Some selections cannot be combined' in the first accordion", async () => {
              expect(await firstFailedSelectionsBoardSO.title.getText()).toBe("Some selections cannot be combined");
            });

            it("[PRPI-3334] Should display 'NOT COMBINABLE' for each failed selection", async () => {
              expect(await firstSelectionHintSO.message.getText()).toBe("NOT COMBINABLE");
              expect(await secondSelectionHintSO.message.getText()).toBe("NOT COMBINABLE");
            });

            it("[PRPI-3334] Should display 2 combinable selections in the second accordion", async () => {
              expect(await firstBetBuilderCombinedLegsSO.selections.length).toBe(2);
            });

            describe("with 2 combinable selections and 1 non eligible BB selection", () => {
              beforeAll(async () => {
                await swipeDownElement(firstBetBuilderCombinedLegsSO.element, 280);
                await browser.waitUntilDisplayed(firstFailedBetDetailsSO.element);
                await browser.waitUntilClickableNative(firstFailedBetDetailsSO.removeButton);
                await firstFailedBetDetailsSO.removeButton.click();
                await mockService.mockHttpRequest(
                  getImplyBetsResponse(NOT_ELIGIBLE_DOUBLE_MOCK, { ignoreLegsOrder: true }),
                );
                await browser.waitUntilEquals(firstSelectionHintSO.message, "NOT AVAILABLE FOR BET BUILDER");
              });

              it("[PRPI-3335] Should display 'Some selections cannot be combined' in the first accordion", async () => {
                expect(await firstFailedSelectionsBoardSO.title.getText()).toBe("Some selections cannot be combined");
              });

              it("[PRPI-3335] Should display 'NOT AVAILABLE FOR BET BUILDER' for each failed selection", async () => {
                expect(await firstSelectionHintSO.message.getText()).toBe("NOT AVAILABLE FOR BET BUILDER");
              });
            });
          });
        });
      });
    });
  });
});
