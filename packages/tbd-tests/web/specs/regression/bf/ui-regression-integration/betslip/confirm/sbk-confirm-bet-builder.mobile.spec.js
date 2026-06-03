const {
  AppPO,
  EventPagePO,
  MinimizedPO,
  BetBuildersCardPO,
  BetBuilderPO,
  SportsbookConfirmPO,
  BetLegsPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  BetslipDrawerPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  PrimaryButtonPO,
  SecondaryButtonPO,
  SelectionsBoardPO,
  BetSelectionDetailsPO,
  AlertPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");
const { advanceToConfirmStep } = require("../../../../../../helpers/betslip.util");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const thirdCardPO = new CardPO(eventPagePO.markets[2]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const thirdSportsbookMarketPO = new SportsbookMarketPO(thirdCardPO.sportsbookMarket);
const firstMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketRunnerSportsbookPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);
const thirdMarketRunnerSportsbookPO = new RunnerPO(thirdSportsbookMarketPO.runnerList[0]);
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookConfirmPO = new SportsbookConfirmPO();
const betslipDrawerPO = new BetslipDrawerPO();
const betBuildersCardPO = new BetBuildersCardPO(sportsbookPlacePanelPO.element);
const betBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const betSelectionsPO = new BetLegsPO(betBuilderPO.element);
const selectionsBoardPO = new SelectionsBoardPO(betSelectionsPO.element);
const betControlsPO = new BetControlsPO(betBuilderPO.element);
const stakePO = new CurrencyNumberInputFieldPO(betControlsPO.currencyInput);
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const editButtonPO = new SecondaryButtonPO(sportsbookConfirmPO.edit);
const placeNotification = new AlertPO(sportsbookPlacePanelPO.element);
const firstSelectionDetailPOFirstBB = new BetSelectionDetailsPO(betSelectionsPO.selections[0]);
const secondSelectionDetailPOFirstBB = new BetSelectionDetailsPO(betSelectionsPO.selections[1]);
const thirdSelectionDetailPOFirstBB = new BetSelectionDetailsPO(betSelectionsPO.selections[2]);
const mockService = new MockService();

const confirmButtonsElements = {
  placeButtonElement: placeButtonPO.element,
  editButtonElement: editButtonPO.element,
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:event:29359895",
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
    urn: "ppb:event:29359000",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##MATCH_ODDS",
        title: "Match Odds",
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
                  urn: "ppb:event:29359000",
                },
              },
              runners: [
                {
                  resultType: "HOME",
                  runnerURN: "ppb:sbkRunner:924.11111111/11111",
                  selectionId: 11111,
                  name: "Wolves",
                },
                {
                  resultType: "AWAY",
                  runnerURN: "ppb:sbkRunner:924.11111111/33333",
                  selectionId: 33333,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.11111111/11111" },
              { runnerURN: "ppb:sbkRunner:924.11111111/33333" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##HALF_TIME",
        title: "Half Time",
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
                  urn: "ppb:event:29359000",
                },
              },
              runners: [
                {
                  resultType: "HOME",
                  runnerURN: "ppb:sbkRunner:924.22222222/44444",
                  selectionId: 44444,
                  name: "Wolves",
                },
                {
                  resultType: "AWAY",
                  runnerURN: "ppb:sbkRunner:924.22222222/66666",
                  selectionId: 66666,
                  name: "Man Utd",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.22222222/44444" },
              { runnerURN: "ppb:sbkRunner:924.22222222/66666" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:29359896##MATCH_ODDS`,
        title: "Match Odds",
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
                {
                  runnerURN: "ppb:sbkRunner:924.33333333/99999",
                  selectionId: 99999,
                  name: "AD Marco",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.33333333/77777" },
              { runnerURN: "ppb:sbkRunner:924.33333333/99999" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:29359896##HALF_TIME`,
        title: "Half Time",
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
                {
                  runnerURN: "ppb:sbkRunner:924.44444444/14141",
                  selectionId: 14141,
                  name: "AD Marco",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.44444444/12121" },
              { runnerURN: "ppb:sbkRunner:924.44444444/14141" },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:29359896##CORRECT_SCORE`,
        title: "Correct Score",
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
                {
                  runnerURN: "ppb:sbkRunner:924.55555555/44555",
                  selectionId: 44555,
                  name: "2-0",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.55555555/66777",
                  selectionId: 66777,
                  name: "3-0",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.55555555/22333" },
              { runnerURN: "ppb:sbkRunner:924.55555555/44555" },
              { runnerURN: "ppb:sbkRunner:924.55555555/66777" },
            ],
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
        {
          selectionId: "33333",
          noOdds: true,
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
        {
          selectionId: "66666",
          noOdds: true,
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
        {
          selectionId: "99999",
          noOdds: true,
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
        {
          selectionId: "14141",
          noOdds: true,
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
        {
          selectionId: "44555",
          noOdds: true,
        },
        {
          selectionId: "66777",
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

const SINGLE_MOCK = {
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

const DOUBLE_SGM = {
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
  },
};

const FIRST_SGM_MOCK = {
  betCombinations: [DOUBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
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
  },
};

const SECOND_SGM_MOCK = {
  betCombinations: [TREBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SMP_MOCK_FIRST_UPDATE = {
  markets: [
    {
      selectionId: "11111",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runnerStatus: "SUSPENDED",
    },
  ],
};

const DOUBLE_SGM_FAILED = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [{ runners: [THIRD_RUNNER] }, { runners: [SECOND_RUNNER] }],
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 2.4,
  betMinStakeIncrement: 0.01,
  winAverageOdds: 2.4,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 2.4 } },
    decimalDisplayOdds: { decimalOdds: 2.4 },
  },
};

const MARKETS_FIRST_UPDATE_FAILURES = {
  betCombinations: [DOUBLE_SGM_FAILED, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
  betFailures: [
    {
      failedRunner: {
        marketId: "924.11111111",
        selectionId: "11111",
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

describe("Bet Builders Confirm Experience", () => {
  describe("when one selection is added to betslip", () => {
    beforeAll(async () => {
      const indexHTML = await getIndexHTML(BFF_MOCK.urn, {
        sportsbookOddsDisplay: "FRACTIONAL",
        products: ["sportsbook"],
        BET_CONFIRMATION_STEP: { isActive: true },
      });
      await Promise.all([
        mockService.mockHttpRequest(indexHTML),
        mockService.mockHttpRequest(getEventLayout(BFF_MOCK)),
        mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
        mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      ]);

      await browser.url(`${routes.getEventViewUrl(29359895)}`);
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: "1/2" }),
      );

      await firstMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(firstMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
    });

    it("[PRPI-7742] should open betslip with a single selection", async () => {
      expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(true);
    });

    describe("when adding another combinable selection to betslip", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilNotDisplayed(sportsbookPlacePanelPO.element, "Singles panel hasn't been minimized");
        await secondMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(
          secondMarketRunnerSportsbookPO.sportsbookBetButton,
          "Bet button is not visible",
        );
        await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SGM_MOCK));
        await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();
        await browser.waitUntil(
          async () => {
            const counter = await sportsbookMinimizedBetslipPO.counter.getText();

            return counter === "2";
          },
          { timeoutMsg: "Unexpected minimized counter value" },
        );
        await sportsbookMinimizedBetslipPO.element.click();
        await browser.waitUntilInViewport(betBuildersCardPO.element);
      });

      it("[PRPI-7743] should open betslip with a bet builder", async () => {
        expect(await betBuildersCardPO.element.isDisplayedInViewport()).toBe(true);
      });

      it("[PRPI-7744] betslip should display 'Double' as bet type title", async () => {
        expect(await betBuilderPO.title.getText()).toBe("Double");
      });

      it("[PRPI-7745] selections board should display '2 Selections' title", async () => {
        expect(await selectionsBoardPO.title.getText()).toBe("2 Selections");
      });

      describe("and the user adds another combinable selection to betslip", () => {
        beforeAll(async () => {
          await betslipDrawerPO.header.waitForClickable();
          await betslipDrawerPO.header.click();
          await browser.waitUntilInViewport(sportsbookMinimizedBetslipPO.counter);

          await thirdMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(
            thirdMarketRunnerSportsbookPO.sportsbookBetButton,
            "Bet button is not visible",
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(SECOND_SGM_MOCK));
          await thirdMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
          await thirdMarketRunnerSportsbookPO.sportsbookBetButton.click();

          await browser.waitUntil(
            async () => {
              const counter = await sportsbookMinimizedBetslipPO.counter.getText();

              return counter === "3";
            },
            { timeoutMsg: "Unexpected minimized counter value" },
          );
        });

        it("[PRPI-7746] the minimized betslip counter should show the number 3", async () => {
          expect(await sportsbookMinimizedBetslipPO.counter.getText()).toBe("3");
        });

        describe("and the user opens the betslip", () => {
          beforeAll(async () => {
            await sportsbookMinimizedBetslipPO.element.waitForClickable();
            await sportsbookMinimizedBetslipPO.element.click();
            await browser.waitUntilInViewport(betBuildersCardPO.element);
          });

          it("[PRPI-7747] should display 'Treble' as bet type", async () => {
            expect(await betBuilderPO.title.getText()).toBe("Treble");
          });

          it("[PRPI-7748] selections board should display '3 Selections' title", async () => {
            expect(await selectionsBoardPO.title.getText()).toBe("3 Selections");
          });
        });

        describe("when the user inserts a stake value", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(stakePO.element, "second stake not displayed");
            await stakePO.element.scrollIntoView({ block: "center" });
            await stakePO.numberField.waitForClickable();
            await stakePO.numberField.click();
            await stakePO.setValue("1");
          });

          describe("and advances to confirm step", () => {
            beforeAll(async () => {
              await advanceToConfirmStep(confirmButtonsElements);
            });

            it("[PRPI-7749] should display the confirm screen", async () => {
              expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
            });

            it("[PRPI-7749] selections board should display '3 Selections' title", async () => {
              expect(await selectionsBoardPO.title.getText()).toBe("3 Selections");
            });

            it("[PRPI-7749] should display 'Treble' as bet type", async () => {
              expect(await betBuilderPO.title.getText()).toBe("Treble");
            });
          });

          describe("and one of the runners gets suspended", () => {
            beforeAll(async () => {
              await Promise.all([
                mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_FIRST_UPDATE)),
                mockService.mockHttpRequest(getImplyBetsResponse(MARKETS_FIRST_UPDATE_FAILURES)),
              ]);
              await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
            });

            it("[PRPI-7750] should show the proper notification", async () => {
              expect(await placeNotification.message.getText()).toBe("Odds and availability have changed");
            });

            it("[PRPI-7750] should disable the place button", async () => {
              expect(await placeButtonPO.element.isEnabled()).toBe(false);
            });

            describe("and the user clicks on the edit button", () => {
              beforeAll(async () => {
                await editButtonPO.element.waitForClickable();
                await editButtonPO.element.click();
              });

              it("[PRPI-7750] should return to place potential step", async () => {
                expect(await sportsbookPlacePanelPO.element.isDisplayedInViewport()).toBe(true);
              });

              it("[PRPI-7750] selections board should display '2 Selections' title", async () => {
                expect(await selectionsBoardPO.title.getText()).toBe("2 Selections");
              });

              it("[PRPI-7750] betslip should display 'Double' as bet type title", async () => {
                expect(await betBuilderPO.title.getText()).toBe("Double");
              });

              describe("and adds a stake to the available bet builders", () => {
                beforeAll(async () => {
                  await stakePO.numberField.waitForClickable();
                  await stakePO.numberField.setValue(1);
                });

                describe("and advances to confirm step", () => {
                  beforeAll(async () => {
                    await advanceToConfirmStep(confirmButtonsElements);
                    await browser.waitUntilDisplayed(betControlsPO.element, "Bet controls is not visible");
                  });

                  it("[PRPI-7750] should display the confirm screen", async () => {
                    expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
                  });

                  it("[PRPI-7750] should display bet controls", async () => {
                    expect(await betControlsPO.element.isDisplayedInViewport()).toBe(true);
                  });

                  it("[PRPI-7750] selections board should display '2 Selections' title", async () => {
                    expect(await selectionsBoardPO.title.getText()).toBe("2 Selections");
                  });

                  it("[PRPI-7750] selections should display the titles", async () => {
                    expect(await firstSelectionDetailPOFirstBB.title.getText()).toBe("FC Porto");
                    expect(await secondSelectionDetailPOFirstBB.title.getText()).toBe("Wolves");
                  });

                  it("[PRPI-7750] selections should display the subtitles", async () => {
                    expect(await firstSelectionDetailPOFirstBB.subtitle.getText()).toBe(
                      "Match Odds - FC Porto v AD Marco",
                    );

                    expect(await secondSelectionDetailPOFirstBB.subtitle.getText()).toBe(
                      "Half Time - Wolves v Man Utd",
                    );
                  });
                });

                describe("and the former suspended market is available again", () => {
                  beforeAll(async () => {
                    await Promise.all([
                      mockService.mockHttpRequest(getMarketPrices(SMP_MOCK)),
                      mockService.mockHttpRequest(getImplyBetsResponse(SECOND_SGM_MOCK)),
                    ]);
                    await browser.waitUntilEquals(placeNotification.message, "Odds and availability have changed");
                  });

                  it("[PRPI-7750] should show the proper notification", async () => {
                    expect(await placeNotification.message.getText()).toBe("Odds and availability have changed");
                  });

                  describe("when the user clicks on the edit button", () => {
                    beforeAll(async () => {
                      await editButtonPO.element.waitForClickable();
                      await editButtonPO.element.click();
                    });

                    describe("and the user inserts a stake value", () => {
                      beforeAll(async () => {
                        await browser.waitUntil(
                          async () => {
                            const counter = await selectionsBoardPO.title.getText();

                            return counter === "3 Selections";
                          },
                          { timeoutMsg: "Unexpected minimized counter value" },
                        );
                        await browser.waitUntilInViewport(betBuildersCardPO.element);
                        await browser.waitUntilDisplayed(stakePO.element, "second stake not displayed");
                        await stakePO.element.scrollIntoView({ block: "center" });
                        await stakePO.numberField.waitForClickable();
                        await stakePO.numberField.click();
                        await stakePO.setValue("1");
                      });

                      describe("and advances to confirm step", () => {
                        beforeAll(async () => {
                          await advanceToConfirmStep(confirmButtonsElements);
                          await browser.waitUntilDisplayed(betControlsPO.element, "Bet controls is not visible");
                        });

                        it("[PRPI-7750] should display the confirm screen", async () => {
                          expect(await sportsbookConfirmPO.element.isDisplayedInViewport()).toBe(true);
                        });

                        it("[PRPI-7750] should display bet controls", async () => {
                          expect(await betControlsPO.element.isDisplayedInViewport()).toBe(true);
                        });

                        it("[PRPI-7750] selections board should display '3 Selections' title", async () => {
                          expect(await selectionsBoardPO.title.getText()).toBe("3 Selections");
                        });

                        it("[PRPI-7750] selections should display the titles", async () => {
                          expect(await firstSelectionDetailPOFirstBB.title.getText()).toBe("Wolves");
                          expect(await secondSelectionDetailPOFirstBB.title.getText()).toBe("Wolves");
                          expect(await thirdSelectionDetailPOFirstBB.title.getText()).toBe("FC Porto");
                        });

                        it("[PRPI-7750] selections should display the subtitles", async () => {
                          expect(await firstSelectionDetailPOFirstBB.subtitle.getText()).toBe(
                            "Match Odds - Wolves v Man Utd",
                          );

                          expect(await secondSelectionDetailPOFirstBB.subtitle.getText()).toBe(
                            "Half Time - Wolves v Man Utd",
                          );

                          expect(await thirdSelectionDetailPOFirstBB.subtitle.getText()).toBe(
                            "Match Odds - FC Porto v AD Marco",
                          );
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
});
