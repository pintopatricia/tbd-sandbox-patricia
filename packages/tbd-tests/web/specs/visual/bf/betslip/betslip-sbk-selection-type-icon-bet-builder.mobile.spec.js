const {
  MinimizedPO,
  BetslipDrawerPO,
  SportsbookPlacePanelPO,
  SportsbookConfirmPO,
  CardPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  SecondaryButtonPO,
  EventPagePO,
  SportsbookMarketPO,
  RunnerPO,
  BetBuildersCardPO,
  BetBuilderPO,
} = require("../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { addStake, advanceToConfirmStep } = require("../../../../helpers/betslip.util");

// Sorts page
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

// Betslip
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const sportsbookConfirmPO = new SportsbookConfirmPO();
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();

// Betslip - Bet Builder
const betBuildersCardPO = new BetBuildersCardPO(sportsbookPlacePanelPO.element);
const betBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const betControlsPO = new BetControlsPO(betBuilderPO.element);
const stakePO = new CurrencyNumberInputFieldPO(betControlsPO.currencyInput);

// Betslip - Buttons
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const editButtonPO = new SecondaryButtonPO(sportsbookConfirmPO.edit);

const mockService = new MockService();

const confirmButtonsElements = {
  placeButtonElement: placeButtonPO.element,
  editButtonElement: editButtonPO.element,
};

const MODULE_NAME = "betslip_sbk_selection_type_icon_bet_builder";

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
        urn: "ppb:tbd:card:29359895##FULL_TIME_RESULT_-_2_UP",
        title: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.11111111",
              marketType: "FULL_TIME_RESULT_-_2_UP",
              noLiveData: true,
              name: "Full Time Result - 2 UP",
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
              isSuperSub: true,
              name: "Anytime Goalscorer",
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
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:card:29359895##FULL_TIME_RESULT_-_2_UP", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359895##HALF_TIME", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359896##MATCH_ODDS", __typename: "MarketCard" } },
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

const IMPLY_MOCK = {
  betCombinations: [TREBLE_SGM, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_SUCCESS_MOCK = {
  result: [
    {
      betNo: 0,
      betId: 2431213139,
      betReceiptId: "O/5844339/0016252",
      numLines: 1,
      totalStake: 0.1,
      runners: [
        {
          runner: FIRST_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          runner: SECOND_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          runner: THIRD_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: FIRST_RUNNER }],
            legType: "SIMPLE_SELECTION",
            isBanker: false,
            edgeContexts: [],
          },
        },
        {
          leg: {
            betRunners: [{ runner: SECOND_RUNNER }],
            legType: "SIMPLE_SELECTION",
            isBanker: false,
            edgeContexts: [],
          },
        },
        {
          leg: {
            betRunners: [{ runner: THIRD_RUNNER }],
            legType: "SIMPLE_SELECTION",
            isBanker: false,
            edgeContexts: [],
          },
        },
      ],

      totalPotentialWin: 0.39,
      betModifiers: ["SGM"],
      betPrice: {
        trueOdds: {
          decimalOdds: {
            decimalOdds: 3.92,
          },
        },
        decimalDisplayOdds: {
          decimalOdds: 3.92,
        },
      },
      resultCode: "SUCCESS",
    },
  ],

  respCode: "SUCCESS",
};

describe("Selection type icon - Bet Builder", () => {
  describe("when one selection with selection type icon is added to betslip", () => {
    beforeAll(async () => {
      const indexHTML = await getIndexHTML(BFF_MOCK.urn, {
        products: ["sportsbook"],
        sportsbookOddsDisplay: "FRACTIONAL",
        brandSettings: {
          SHOW_SELECTION_TYPE_ICON: true,
        },
        BET_CONFIRMATION_STEP: { isActive: true },
      });
      await Promise.all([
        mockService.mockFonts(getMockFonts()),
        mockService.mockHttpRequest(indexHTML),
        mockService.mockHttpRequest(getEventLayout(BFF_MOCK)),
        mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true })),
        mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK)),
      ]);

      await browser.url(`${routes.getEventViewUrl(29359895)}`);
      await browser.waitUntilEquals(
        firstMarketRunnerSportsbookPO.sportsbookBetButton,
        "1/2",
        "Bet button price is not equal to 1/2",
      );
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(firstMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");
      await browser.waitUntilStopsMoving(firstMarketRunnerSportsbookPO.sportsbookBetButton);
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
    });

    describe("when adding another two combinable selection to betslip", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

        await secondMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilDisplayed(
          secondMarketRunnerSportsbookPO.sportsbookBetButton,
          "Second runner bet button not visible",
        );

        await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
        await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();

        await thirdMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(
          thirdMarketRunnerSportsbookPO.sportsbookBetButton,
          "Bet button is not visible",
        );
        await thirdMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
        await thirdMarketRunnerSportsbookPO.sportsbookBetButton.click();

        await browser.waitUntilEquals(sportsbookMinimizedBetslipPO.counter, "3", "Unexpected minimized counter value");

        await sportsbookMinimizedBetslipPO.element.click();
        await browser.waitUntilInViewport(betBuildersCardPO.element);

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1265]_should_display_place_step_bet_builder`);
      });

      it("[PRPI-1265]_should_display_place_step_bet_builder", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1265]_should_display_place_step_bet_builder`)).toBe(0);
      });

      describe("and the user adds stake value to bet builder", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(stakePO.element, "Stake not displayed");
          await stakePO.element.scrollIntoView({ block: "center" });
          await stakePO.numberField.waitForClickable();
          await stakePO.numberField.click();
          await addStake(stakePO, "1");
        });

        describe("and the user advances to confirm step", () => {
          beforeAll(async () => {
            await advanceToConfirmStep(confirmButtonsElements);
            await browser.waitUntilDisplayed(sportsbookConfirmPO.element, "Confirm step is not visible");
            await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1266]_should_display_confirm_step_bet_builder`);
          });

          it("[PRPI-1266]_should_display_confirm_step_bet_builder", async () => {
            expect(
              await browser.checkScreen(`${MODULE_NAME}_[PRPI-1266]_should_display_confirm_step_bet_builder`),
            ).toBe(0);
          });

          describe("and placing the bet", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBet(SPB_SUCCESS_MOCK));
              await placeButtonPO.element.click();
              await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1266]_should_display_bet_receipt_bet_builder`);
            });

            it("[PRPI-1266]_should_display_bet_receipt_bet_builder", async () => {
              expect(
                await browser.checkScreen(`${MODULE_NAME}_[PRPI-1266]_should_display_bet_receipt_bet_builder`),
              ).toBe(0);
            });
          });
        });
      });
    });
  });
});
