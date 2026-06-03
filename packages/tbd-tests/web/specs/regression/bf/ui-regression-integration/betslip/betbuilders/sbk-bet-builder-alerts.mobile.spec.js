const {
  AppPO,
  EventPagePO,
  MinimizedPO,
  BetBuildersCardPO,
  BetBuilderPO,
  BetLegsPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  BetslipDrawerPO,
  BetSelectionDetailsPO,
  FixedNumberInputFieldPO,
  BetControlsPO,
  OddsMovementPO,
  AlertPO,
  SportsbookPlacePanelPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

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

const betslipDrawerPO = new BetslipDrawerPO();
const placePanelPO = new SportsbookPlacePanelPO();
const betBuildersCardPO = new BetBuildersCardPO();
const firstBetBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const firstBetSelectionsPO = new BetLegsPO(firstBetBuilderPO.element);

const secondSelectionDetailPO = new BetSelectionDetailsPO(firstBetSelectionsPO.selections[0]);
const thirdSelectionDetailPO = new BetSelectionDetailsPO(firstBetSelectionsPO.selections[1]);

const firstBetControlsPO = new BetControlsPO(firstBetBuilderPO.element);
const firstOddsPO = new FixedNumberInputFieldPO(firstBetControlsPO.fixedInput);
const firstOddsMovementPO = new OddsMovementPO(firstOddsPO.oddsMovementContainer);
const placeAlert = new AlertPO(placePanelPO.element);

const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:event:29359895",
  sportevent: {
    name: "Wolves v Man Utd",
    urn: "ppb:event:29359895",
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359895##MATCH_ODDS",
        title: "Match Odds - Wolves v Man Utd",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "Wolves v Man Utd",
            urn: "ppb:event:29359895",
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
        __typename: "MarketCard",
        urn: "ppb:tbd:card:29359897##HALF_TIME",
        title: "Half Time - Wolves v Man Utd",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "Wolves v Man Utd",
            urn: "ppb:event:29359897",
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
                  name: "Wolves v Man Utd",
                  urn: "ppb:event:29359897",
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
        urn: `ppb:tbd:card:29359896##CORRECT_SCORE`,
        title: "Correct Score - FC Porto v AD Marco",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v AD Marco",
            urn: `ppb:event:29359896`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.33333333",
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
                  runnerURN: "ppb:sbkRunner:924.33333333/22333",
                  selectionId: 22333,
                  name: "1-0",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.33333333/22333" }],
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:29359891##CORRECT_SCORE`,
        title: "Correct Score - FC Porto v AD Marco",
        marketsHierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            name: "FC Porto v AD Marco",
            urn: `ppb:event:29359891`,
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.33333331",
              noLiveData: true,
              name: "Correct Score",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "FC Porto v AD Marco",
                  urn: `ppb:event:29359891`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.33333331/22333",
                  selectionId: 22333,
                  name: "1-0",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.33333331/22333" }],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:card:29359895##MATCH_ODDS", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359897##HALF_TIME", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##CORRECT_SCORE", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359891##CORRECT_SCORE", __typename: "MarketCard" } },
  ],

  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse/browse:sports",
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: "mybets/myBets-open",
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: "casino/gm-1",
        },
      },
    ],
  },
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
          selectionId: "22333",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
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

const THIRD_RUNNER = { marketId: "924.33333333", selectionId: 22333 };

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
  describe("when the user adds three combinable selections from the same event and opens the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(`${routes.getEventViewUrl(29359895)}`);
      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));

      await mockService.mockHttpRequest(getImplyBetsResponse(ONE_SINGLE_MOCK));
      await browser.waitUntilDisplayed(
        firstMarketRunnerSportsbookPO.sportsbookBetButton,
        "First bet button is not visible",
      );
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");

      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");

      await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLE_MOCK));
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();

      await thirdMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOCK));
      await thirdMarketRunnerSportsbookPO.sportsbookBetButton.click();

      await browser.waitUntil(
        async () => {
          const counter = await sportsbookMinimizedBetslipPO.counter.getText();

          return counter === "3";
        },
        { timeoutMsg: "Unexpected minimized counter value" },
      );

      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(betBuildersCardPO.element);
    });

    describe("when the odds changes on selection 1", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOVEMENT_MOCK));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(firstOddsPO.numberField, "5");
        await browser.waitUntilDisplayed(firstOddsMovementPO.arrow);
      });

      it("[PRPI-7674] the arrow should be displayed in odds field", async () => {
        expect(await firstOddsMovementPO.arrow.isDisplayed()).toEqual(true);
      });

      describe("when market of selection 1 suspends", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_SGM_SUSPENDED_MOCK));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(placeAlert.message, "Market Suspended");
        });

        it("[PRPI-7675] the BB title changes to 'Double'", async () => {
          expect(await firstBetBuilderPO.title.getText()).toBe("Double");
        });

        it("[PRPI-7676] the BB accordion should not show selection 1", async () => {
          expect(await firstBetSelectionsPO.selections.length).toBe(2);
        });

        it("[PRPI-7677] the BB accordion should show selection 2", async () => {
          expect(await secondSelectionDetailPO.title.getText()).toBe("Wolves");
          expect(await secondSelectionDetailPO.subtitle.getText()).toBe("Half Time - Wolves v Man Utd");
        });

        it("[PRPI-7678] the BB accordion should show selection 3", async () => {
          expect(await thirdSelectionDetailPO.title.getText()).toBe("1-0");
          expect(await thirdSelectionDetailPO.subtitle.getText()).toBe("Correct Score - FC Porto v AD Marco");
        });

        describe("when market of selection 2 suspends", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getImplyBetsResponse(TWO_MARKETS_SUSPENDED_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilNotDisplayed(betBuildersCardPO.element);
          });

          it("[PRPI-7679] the BB component should not be displayed", async () => {
            expect(await betBuildersCardPO.element.isDisplayed()).toBe(false);
          });

          describe("When previous suspended markets are available again", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_SGM_MOCK));
              await browser.tickFakeClock();
              await browser.waitUntilDisplayed(betBuildersCardPO.element);
            });

            it("[PRPI-7680] the BB component should not be displayed", async () => {
              expect(await betBuildersCardPO.element.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });
  });
});
