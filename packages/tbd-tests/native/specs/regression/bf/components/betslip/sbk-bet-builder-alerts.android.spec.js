const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  SportsbookPlacePanelSO,
  GenericScreenSO,
  BetBuildersCardSO,
  BetBuilderSO,
  BetLegsSO,
  CardSO,
  SportsbookMarketSO,
  RunnerSO,
  BetSelectionDetailsSO,
  FixedNumberInputFieldSO,
  OddsMovementSO,
  BetControlsSO,
  BetslipDrawerSO,
  MinimizedSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const placePanelSO = new SportsbookPlacePanelSO();

const EVENT_ID = "29682729";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "FC Porto v AD Marco",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`,
        title: "Match Odds - FC Porto v AD Marco",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v AD Marco",
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.11111111",
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v AD Marco",
                  urn: `ppb:event:${EVENT_ID}`,
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
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`,
        title: "Half Time - FC Porto v AD Marco",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v AD Marco",
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
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
                  name: "FC Porto v AD Marco",
                  urn: `ppb:event:${EVENT_ID}`,
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
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##CORRECT_SCORE`,
        title: "Correct Score - FC Porto v AD Marco",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v AD Marco",
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
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
                  urn: `ppb:event:${EVENT_ID}`,
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
  ],

  partialEdges: [
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`, __typename: "MarketCard" } },
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`, __typename: "MarketCard" } },
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##CORRECT_SCORE`, __typename: "MarketCard" } },
  ],
};

const SMP_FIRST_MARKET = {
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
};

const SMP_SECOND_MARKET = {
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
};

const SMP_THIRD_MARKET = {
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
};

const SMP_MOCK = {
  markets: [SMP_FIRST_MARKET, SMP_SECOND_MARKET, SMP_THIRD_MARKET],
};

const SMP_MOCK_MOVEMENT = {
  markets: [
    {
      ...SMP_FIRST_MARKET,
      runnerDetails: [
        {
          ...SMP_FIRST_MARKET.runnerDetails[0],
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    SMP_SECOND_MARKET,
    SMP_THIRD_MARKET,
  ],
};

const SMP_MOCK_SUSPENDED = {
  markets: [
    {
      ...SMP_FIRST_MARKET,
      marketStatus: "SUSPENDED",
      runnerDetails: [
        {
          ...SMP_FIRST_MARKET.runnerDetails[0],
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    SMP_SECOND_MARKET,
    SMP_THIRD_MARKET,
  ],
};

const SMP_MOCK_TWO_SUSPENDED = {
  markets: [
    {
      ...SMP_FIRST_MARKET,
      marketStatus: "SUSPENDED",
      runnerDetails: [
        {
          ...SMP_FIRST_MARKET.runnerDetails[0],
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      ...SMP_SECOND_MARKET,
      marketStatus: "SUSPENDED",
    },
    SMP_THIRD_MARKET,
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

const ONE_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
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

const TWO_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const THIRD_RUNNER = { marketId: "924.55555555", selectionId: 22333 };

const THIRD_SINGLE_MOCK = { legCombinations: [{ runners: [THIRD_RUNNER] }] };
const THIRD_SINGLE_ODDS_MOCK = {
  runner: THIRD_RUNNER,
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM = {
  betType: "TREBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
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

const TREBLE_SGM_ODD_MOVEMENT = {
  betType: "TREBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 5,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 5 } },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_SGM = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 3,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 3,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 3 } },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const TREBLE_SGM_MOCK = {
  betCombinations: [TREBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const TREBLE_SGM_MOVEMENT_MOCK = {
  betCombinations: [TREBLE_SGM_ODD_MOVEMENT, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const DOUBLE_SGM_SUSPENDED_MOCK = {
  betCombinations: [DOUBLE_SGM, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  betFailures: [
    {
      failedRunner: FIRST_RUNNER,
      failureCode: "MARKET_SUSPENDED",
    },
  ],

  runnerOdds: [SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const TWO_MARKETS_SUSPENDED_MOCK = {
  betCombinations: [THIRD_SINGLE_MOCK],
  betFailures: [
    {
      failedRunner: FIRST_RUNNER,
      failureCode: "MARKET_SUSPENDED",
    },
    {
      failedRunner: SECOND_RUNNER,
      failureCode: "MARKET_SUSPENDED",
    },
  ],

  runnerOdds: [THIRD_SINGLE_ODDS_MOCK],
};

describe("Bet Builder alerts", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when there is a Treble Bet Builder in the betslip", () => {
    beforeAll(async () => {
      const genericScreenSO = new GenericScreenSO();

      await mockService.mockHttpRequest(getImplyBetsResponse(ONE_SINGLE_MOCK));
      await browser.waitUntil(async () => (await genericScreenSO.cards.length) === 3);

      const loadedGenericScreenSO = new GenericScreenSO();
      const firstCardSO = new CardSO(loadedGenericScreenSO.cards[0]);
      const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
      const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);

      await browser.waitUntilDisplayed(firstRunnerSO.sbkBetButtons[0], "First bet button is not visible");
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(placePanelSO.element, "First selection hasn't been added");

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilNotInDOM(placePanelSO.element, "Singles panel hasn't been minimized");

      const secondCardSO = new CardSO(loadedGenericScreenSO.cards[1]);
      const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
      const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);

      await browser.waitUntilDisplayed(secondRunnerSO.sbkBetButtons[0], "Second bet button is not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLE_MOCK));
      await secondRunnerSO.sbkBetButtons[0].click();

      const thirdCardSO = new CardSO(loadedGenericScreenSO.cards[2]);
      const thirdSportsbookMarketSO = new SportsbookMarketSO(thirdCardSO.sportsbookMarket);
      const thirdRunnerSO = new RunnerSO(thirdSportsbookMarketSO.runnerList[0]);

      await browser.waitUntilDisplayed(thirdRunnerSO.sbkBetButtons[0], "Third bet button is not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOCK));
      await thirdRunnerSO.sbkBetButtons[0].click();

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(placePanelSO.element);
    });

    describe("when the odds change on selection 1", () => {
      const betBuildersCardSO = new BetBuildersCardSO();
      const firstBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[0]);
      const firstBetControlsSO = new BetControlsSO(firstBetBuilderSO.element);
      const firstOddsSO = new FixedNumberInputFieldSO(firstBetControlsSO.fixedInput);

      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_MOVEMENT, { ignoreRequestedMarketIdsMatch: true }));
        await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOVEMENT_MOCK));

        await browser.waitUntilEquals(firstOddsSO.numberField, "5");
      });

      it("[PRPI-3322] The arrow should be displayed in odds field", async () => {
        const firstOddsMovementSO = new OddsMovementSO(firstOddsSO.oddsMovement);

        expect(await firstOddsMovementSO.element.isDisplayed()).toEqual(true);
      });

      describe("When market of selection 1 suspends", () => {
        const suspendedBetBuildersCardSO = new BetBuildersCardSO();
        const suspendedFirstBetBuilderSO = new BetBuilderSO(suspendedBetBuildersCardSO.betBuilders[0]);
        const firstBetSelectionsSO = new BetLegsSO(suspendedFirstBetBuilderSO.element);
        const firstSelectionDetailSO = new BetSelectionDetailsSO(firstBetSelectionsSO.selections[0]);
        const secondSelectionDetailSO = new BetSelectionDetailsSO(firstBetSelectionsSO.selections[1]);

        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_SGM_SUSPENDED_MOCK));
          await browser.waitUntil(async () => (await firstBetSelectionsSO.selections.length) === 2);
        });

        it("[PRPI-3323] The bet builder title changes to 'Double'", async () => {
          expect(await suspendedFirstBetBuilderSO.title.getText()).toBe("Double");
        });

        it("[PRPI-3324] The bet builder accordion should not show selection 1", async () => {
          expect(await firstBetSelectionsSO.selections.length).toBe(2);
        });

        it("[PRPI-3325] The bet builder accordion should show selection 2 and 3", async () => {
          expect(await firstSelectionDetailSO.title.getText()).toBe("Wolves");
          expect(await firstSelectionDetailSO.subtitle.getText()).toBe("Half Time - FC Porto v AD Marco");
          expect(await secondSelectionDetailSO.title.getText()).toBe("1-0");
          expect(await secondSelectionDetailSO.subtitle.getText()).toBe("Correct Score - FC Porto v AD Marco");
        });

        describe("When market of selection 2 suspends", () => {
          const noBetBuildersCardSO = new BetBuildersCardSO();

          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_TWO_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }),
            );
            await mockService.mockHttpRequest(getImplyBetsResponse(TWO_MARKETS_SUSPENDED_MOCK));
            await browser.waitUntilNotInDOM(noBetBuildersCardSO.element);
          });

          it("[PRPI-3326] The bet builder component should not be displayed", async () => {
            expect(await noBetBuildersCardSO.element.isExisting()).toBe(false);
          });

          describe("when previous suspended markets are available again", () => {
            const newBetBuildersCardSO = new BetBuildersCardSO();

            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getMarketPrices(SMP_MOCK_MOVEMENT, { ignoreRequestedMarketIdsMatch: true }),
              );
              await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOCK));
              await browser.waitUntilDisplayed(newBetBuildersCardSO.element);
            });

            it("[PRPI-3327] The bet builder component should be displayed", async () => {
              expect(await newBetBuildersCardSO.element.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
});
