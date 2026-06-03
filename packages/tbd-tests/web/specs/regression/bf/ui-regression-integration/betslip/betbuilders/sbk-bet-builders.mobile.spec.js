const {
  AppPO,
  EventPagePO,
  MinimizedPO,
  SportsbookPlacePanelPO,
  SportsbookReceiptPanelPO,
  BetBuildersCardPO,
  BetBuilderPO,
  SinglesCardPO,
  BetLegsPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  BetslipDrawerPO,
  BetSelectionsPO,
  BetSelectionDetailsPO,
  FixedNumberInputFieldPO,
  CurrencyNumberInputFieldPO,
  BetControlsPO,
  BetsSummaryPO,
  PrimaryButtonPO,
  BetSummaryPO,
  SelectionsBoardPO,
  BetSegmentsPO,
  BetBuilderSummaryPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const thirdCardPO = new CardPO(eventPagePO.markets[2]);
const fourthCardPO = new CardPO(eventPagePO.markets[3]);
const fifthCardPO = new CardPO(eventPagePO.markets[4]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const thirdSportsbookMarketPO = new SportsbookMarketPO(thirdCardPO.sportsbookMarket);
const fourthSportsbookMarketPO = new SportsbookMarketPO(fourthCardPO.sportsbookMarket);
const fifthSportsbookMarketPO = new SportsbookMarketPO(fifthCardPO.sportsbookMarket);
const firstMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketRunnerSportsbookPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);
const thirdMarketRunnerSportsbookPO = new RunnerPO(thirdSportsbookMarketPO.runnerList[0]);
const fourthMarketRunnerSportsbookPO = new RunnerPO(fourthSportsbookMarketPO.runnerList[0]);
const fifthMarketRunnerSportsbookPO = new RunnerPO(fifthSportsbookMarketPO.runnerList[0]);
const sportsbookMinimizedBetslipPO = new MinimizedPO();

const betslipDrawerPO = new BetslipDrawerPO();
const placePanelPO = new SportsbookPlacePanelPO();
const betBuildersCardPO = new BetBuildersCardPO(placePanelPO.element);
const firstBetBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const secondBetBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[1]);
const betBuilderTitle = new CardPO(placePanelPO.collapsableSections[0]);
const singlesTitle = new CardPO(placePanelPO.collapsableSections[1]);
const multiplesTitle = new CardPO(placePanelPO.collapsableSections[1]);
const firstBetSelectionsPO = new BetLegsPO(firstBetBuilderPO.element);
const firstSelectionsBoardPO = new SelectionsBoardPO(firstBetSelectionsPO.element);
const secondBetSelectionsPO = new BetLegsPO(secondBetBuilderPO.element);
const secondSelectionsBoardPO = new SelectionsBoardPO(secondBetSelectionsPO.element);
const firstSelectionDetailPOFirstBB = new BetSelectionDetailsPO(firstBetSelectionsPO.selections[0]);
const secondSelectionDetailPOFirstBB = new BetSelectionDetailsPO(firstBetSelectionsPO.selections[1]);
const thirdSelectionDetailPOSecondBB = new BetSelectionDetailsPO(secondBetSelectionsPO.selections[2]);
const firstBetControlsPO = new BetControlsPO(firstBetBuilderPO.element);
const secondBetControlsPO = new BetControlsPO(secondBetBuilderPO.element);

const firstOddsPO = new FixedNumberInputFieldPO(firstBetControlsPO.fixedInput);
const secondOddsPO = new FixedNumberInputFieldPO(secondBetControlsPO.fixedInput);
const firstStakePO = new CurrencyNumberInputFieldPO(firstBetControlsPO.currencyInput);
const secondStakePO = new CurrencyNumberInputFieldPO(secondBetControlsPO.currencyInput);
const singlesCardPO = new SinglesCardPO(placePanelPO.element);
const betsSummaryPO = new BetsSummaryPO(placePanelPO.element);

const placeButtonPO = new PrimaryButtonPO(placePanelPO.place);

const receiptPanelPO = new SportsbookReceiptPanelPO();
const receiptFirstBBPO = new BetBuilderSummaryPO(receiptPanelPO.betBuilderSummaries[0]);
const receiptFirstBBSelectionsPO = new BetSelectionsPO(receiptFirstBBPO.selections);
const receiptBB1stDetailsPO = new BetSelectionDetailsPO(receiptFirstBBSelectionsPO.selections[0]);
const receiptBB2ndDetailsPO = new BetSelectionDetailsPO(receiptFirstBBSelectionsPO.selections[1]);
const receiptFirstBBSummaryPO = new BetSummaryPO(receiptFirstBBPO.summary);
const receiptFirstBBBetSegmentsPO = new BetSegmentsPO(receiptFirstBBPO.element);

const mockService = new MockService();

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

describe("Bet Builder bets place", () => {
  describe("when the user adds two combinable selections from the same event and opens the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { sportsbookOddsDisplay: "FRACTIONAL" }));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(`${routes.getEventViewUrl(29359895)}`);
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: "1/2" }),
      );
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(firstMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");

      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");

      await secondMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilDisplayed(secondMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");

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

    it("[PRPI-7696] betslip should display bet builder title", async () => {
      expect(await betBuilderTitle.title.getText()).toBe("BET BUILDER");
    });

    it("[PRPI-7697] betslip should display 'Double' as bet type title", async () => {
      expect(await firstBetBuilderPO.title.getText()).toBe("Double");
    });

    it("[PRPI-7698] betslip should display event name as subtitle", async () => {
      expect(await firstBetBuilderPO.subtitle.getText()).toBe("Wolves v Man Utd");
    });

    it("[PRPI-7699][1167324] betslip should display odds field", async () => {
      expect(await firstOddsPO.numberField.getValue()).toBe("1.4/1");
    });

    it("[PRPI-7700] betslip should display stake field with 'Stake' placeholder", async () => {
      expect(await firstStakePO.numberField.getAttribute("placeholder")).toBe("Stake");
    });

    it("[PRPI-7701] betslip should display singles title", async () => {
      expect(await singlesTitle.title.getText()).toBe("SINGLES");
    });

    it("[PRPI-7702] betslip should display two single components", async () => {
      expect(await singlesCardPO.singles.length).toBe(2);
    });

    it("[PRPI-7703] collapse should display '2 Selections' title", async () => {
      expect(await firstSelectionsBoardPO.title.getText()).toBe("2 Selections");
    });

    it("[PRPI-7704] selections should display title and subtitle", async () => {
      expect(await firstSelectionDetailPOFirstBB.title.getText()).toBe("Wolves");
      expect(await firstSelectionDetailPOFirstBB.subtitle.getText()).toBe("Match Odds - Wolves v Man Utd");
      expect(await secondSelectionDetailPOFirstBB.title.getText()).toBe("Wolves");
      expect(await secondSelectionDetailPOFirstBB.subtitle.getText()).toBe("Half Time - Wolves v Man Utd");
    });

    it("[PRPI-7705] selections should NOT display odds", async () => {
      expect(await firstSelectionDetailPOFirstBB.odd.isDisplayed()).toBe(false);
      expect(await secondSelectionDetailPOFirstBB.odd.isDisplayed()).toBe(false);
    });

    describe("when stake is set to 1", () => {
      beforeAll(async () => {
        await firstStakePO.element.scrollIntoView({ block: "center" });
        await browser.waitUntilDisplayed(firstStakePO.element);

        await firstStakePO.numberField.waitForClickable();
        await firstStakePO.numberField.click();
        await firstStakePO.setValue("1");
      });

      it("[PRPI-7706] should display returns", async () => {
        expect(await firstBetControlsPO.returnsLabel.getText()).toBe("Returns");
        expect(await firstBetControlsPO.returnsValueContainer.getText()).toBe("$2.40");
      });

      it("[PRPI-7707] should update total stake", async () => {
        expect(await placeButtonPO.label.getText()).toContain("$1.00");
      });

      it("[PRPI-7708] should update total returns", async () => {
        expect(await betsSummaryPO.totalReturnsValue.getText()).toBe("$2.40");
      });

      describe("when the user adds three combinable selections from another event", () => {
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

          await fourthMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(
            fourthMarketRunnerSportsbookPO.sportsbookBetButton,
            "Bet button is not visible",
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_SGM_MOCK));
          await fourthMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
          await fourthMarketRunnerSportsbookPO.sportsbookBetButton.click();

          await fifthMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(
            fifthMarketRunnerSportsbookPO.sportsbookBetButton,
            "Bet button is not visible",
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(FOURTH_SGM_MOCK));
          await fifthMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
          await fifthMarketRunnerSportsbookPO.sportsbookBetButton.click();

          await browser.waitUntil(
            async () => {
              const counter = await sportsbookMinimizedBetslipPO.counter.getText();

              return counter === "5";
            },
            { timeoutMsg: "Unexpected minimized counter value" },
          );

          await browser.waitUntilEquals(sportsbookMinimizedBetslipPO.title, "$10.00 Treble @ 3.5/1 returns $45.00");
        });

        it("[PRPI-7709] the  minimized betslip counter should show the number 5", async () => {
          expect(await sportsbookMinimizedBetslipPO.counter.getText()).toBe("5");
        });

        it("[PRPI-7710] The minimized betslip should show returns for a 10 stake", async () => {
          expect(await sportsbookMinimizedBetslipPO.title.getText()).toBe("$10.00 Treble @ 3.5/1 returns $45.00");
        });

        describe("and the user opens the betslip", () => {
          beforeAll(async () => {
            await sportsbookMinimizedBetslipPO.element.waitForClickable();
            await sportsbookMinimizedBetslipPO.element.click();
            await browser.waitUntilInViewport(betBuildersCardPO.element);
          });

          it("[PRPI-7711] should display 'Treble' as bet type", async () => {
            expect(await secondBetBuilderPO.title.getText()).toBe("Treble");
          });

          it("[PRPI-7711] betslip should display event name as subtitle", async () => {
            expect(await secondBetBuilderPO.subtitle.getText()).toBe("FC Porto v AD Marco");
          });

          it("[PRPI-7711] collapse should display '3 Selections' title", async () => {
            expect(await secondSelectionsBoardPO.title.getText()).toBe("3 Selections");
          });

          it("[PRPI-7711][1167324] betslip should display odds field", async () => {
            expect(await secondOddsPO.numberField.getValue()).toBe("3.5/1");
          });

          it("[PRPI-7711] betslip should display stake field with 'Stake' placeholder", async () => {
            expect(await secondStakePO.numberField.getAttribute("placeholder")).toBe("Stake");
          });

          it("[PRPI-7711] betslip should display multiples title", async () => {
            expect(await multiplesTitle.title.getText()).toBe("MULTIPLES");
          });

          describe("when the user removes one of the selections from the second BB", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getImplyBetsResponse(THIRD_SGM_MOCK));
              await thirdSelectionDetailPOSecondBB.removeButton.scrollIntoView();
              await thirdSelectionDetailPOSecondBB.removeButton.waitForClickable();
              await thirdSelectionDetailPOSecondBB.removeButton.click();
              await browser.waitUntil(
                async () => {
                  const title = await secondBetBuilderPO.title.getText();
                  return title === "Double";
                },
                {
                  timeoutMsg: "Unexpected BB collapse title",
                },
              );
            });

            it("[PRPI-7711] should display 'Double' as bet type", async () => {
              expect(await secondBetBuilderPO.title.getText()).toBe("Double");
            });

            it("[PRPI-7711] collapse should display '2 Selections' title", async () => {
              expect(await secondSelectionsBoardPO.title.getText()).toBe("2 Selections");
            });

            describe("when stake is set to 1 and clicks the CTA button", () => {
              beforeAll(async () => {
                await secondStakePO.element.scrollIntoView({ block: "center" });
                await browser.waitUntilDisplayed(secondStakePO.element, "second stake not displayed");
                await secondStakePO.numberField.waitForClickable();
                await secondStakePO.numberField.click();

                await secondStakePO.setValue("1");

                await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
                await placeButtonPO.element.waitForClickable();
                await placeButtonPO.element.click();
                await browser.waitUntilDisplayed(receiptPanelPO.element, "receipt not displayed");
              });

              it("[PRPI-7711] should show receipt", async () => {
                expect(await receiptPanelPO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-7711] should show Bet Builder title", async () => {
                expect(await receiptPanelPO.betBuilderTitle.getText()).toBe("BET BUILDER");
              });

              it("[PRPI-7711] should show 2 bet builders", async () => {
                expect(await receiptPanelPO.betBuilderSummaries.length).toBe(2);
              });

              it("[PRPI-7711] should show event name", async () => {
                expect(await receiptFirstBBPO.title.getText()).toBe("Wolves v Man Utd");
              });

              it("[PRPI-7711] should have Card open", async () => {
                expect(await receiptFirstBBSelectionsPO.content.isDisplayed()).toBe(true);
              });

              it("[PRPI-7711] should have Card title", async () => {
                expect(await receiptFirstBBSelectionsPO.header.getText()).toBe("2 Selections");
              });

              it("[PRPI-7711] should show two selections", async () => {
                expect(await receiptFirstBBSelectionsPO.selections.length).toBe(2);
              });

              it("[PRPI-7711] should show titles", async () => {
                expect(await receiptBB1stDetailsPO.title.getText()).toBe("Wolves");
                expect(await receiptBB2ndDetailsPO.title.getText()).toBe("Wolves");
              });

              it("[PRPI-7711] should show subtitles", async () => {
                expect(await receiptBB1stDetailsPO.subtitle.getText()).toBe("Match Odds - Wolves v Man Utd");
                expect(await receiptBB2ndDetailsPO.subtitle.getText()).toBe("Half Time - Wolves v Man Utd");
              });

              it("[PRPI-7711] should show 90 min icon when applied", async () => {
                expect(await receiptBB1stDetailsPO.icon90Min.isDisplayed()).toBe(true);
                expect(await receiptBB2ndDetailsPO.icon90Min.isDisplayed()).toBe(false);
              });

              it("[PRPI-7711] should not show odds", async () => {
                expect(await receiptBB1stDetailsPO.odd.isDisplayed()).toBe(false);
                expect(await receiptBB2ndDetailsPO.odd.isDisplayed()).toBe(false);
              });

              it("[PRPI-7711] should show bet type title", async () => {
                expect(await receiptFirstBBSummaryPO.title.getText()).toBe("Double");
              });

              it("[PRPI-7711] should show odds", async () => {
                expect(await receiptFirstBBBetSegmentsPO.leftValue.getText()).toBe("1/2");
              });

              it("[PRPI-7711] should show stake", async () => {
                expect(await receiptFirstBBBetSegmentsPO.midValue.getText()).toBe("$1.00");
              });

              it("[PRPI-7711] should show returns", async () => {
                expect(await receiptFirstBBBetSegmentsPO.rightValue.getText()).toBe("$2.00");
              });
            });
          });
        });
      });
    });
  });
});
