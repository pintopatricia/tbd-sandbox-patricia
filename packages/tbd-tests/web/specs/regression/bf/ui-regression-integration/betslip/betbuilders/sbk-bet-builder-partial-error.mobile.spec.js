const {
  EventPagePO,
  BetBuildersCardPO,
  BetBuilderPO,
  BetLegsPO,
  CardPO,
  BetslipDrawerPO,
  SportsbookBetButtonPO,
  BetSelectionDetailsPO,
  SelectionsBoardPO,
  SportsbookPlacePanelPO,
  SportsbookMarketPO,
  RunnerPO,
  MinimizedPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse, getPayloadMatcherImplyBetsResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const firstMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[1]);
const thirdMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[2]);
const tfourthMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[3]);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstMarketRunnerSportsbookPO.sportsbookBetButton);
const secondSbkRunnerPO = new SportsbookBetButtonPO(secondMarketRunnerSportsbookPO.sportsbookBetButton);
const thirdSbkRunnerPO = new SportsbookBetButtonPO(thirdMarketRunnerSportsbookPO.sportsbookBetButton);
const fourthSbkRunnerPO = new SportsbookBetButtonPO(tfourthMarketRunnerSportsbookPO.sportsbookBetButton);
const placePanelPO = new SportsbookPlacePanelPO();
const betBuildersCardPO = new BetBuildersCardPO(placePanelPO.element);
const firstBetBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const firstBetBuilderFailedLegsPO = new BetLegsPO(firstBetBuilderPO.accordion[0]);
const firstBetSelectionsPO = new BetLegsPO(firstBetBuilderPO.element);
const firstSelectionsBoardPO = new SelectionsBoardPO(firstBetSelectionsPO.element);
const firstBetBuilderCombinedLegsPO = new BetLegsPO(firstBetBuilderPO.accordion[1]);
const firstFailedBetDetailsPO = new BetSelectionDetailsPO(firstBetBuilderFailedLegsPO.selections[0]);
const secondFailedBetDetailsPO = new BetSelectionDetailsPO(firstBetBuilderFailedLegsPO.selections[1]);
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookMinimizedPO = new MinimizedPO();

const mockService = new MockService();

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

const LEGS_PAYLOAD_MATCH = [
  {
    betRunners: [{ runner: { marketId: "924.1", selectionId: 2 } }],
    isBoostedLeg: false,
    legType: "SIMPLE_SELECTION",
  },
  {
    betRunners: [{ runner: { marketId: "924.1", selectionId: 3 } }],
    isBoostedLeg: false,
    legType: "SIMPLE_SELECTION",
  },
  {
    betRunners: [{ runner: { marketId: "924.1", selectionId: 4 } }],
    isBoostedLeg: false,
    legType: "SIMPLE_SELECTION",
  },
];

describe("Bet Builder combination errors", () => {
  describe("when adding 2 non combinable selections (INVALID_SGM_COMBINATION)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(
        getImplyBetsResponse({ betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] }),
      );

      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

      await firstSbkRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "First selection hasn't been added");

      await betslipDrawerPO.header.click();
      await browser.waitUntilNotDisplayed(placePanelPO.element, "Singles panel hasn't been minimized");
      await mockService.mockHttpRequest(getImplyBetsResponse(INVALID_SGM_DOUBLE_MOCK, { ignoreLegsOrder: true }));

      await secondSbkRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(secondSbkRunnerPO.sportsbookBetButton, "Second runner bet button not visible");

      await secondSbkRunnerPO.sportsbookBetButton.click();
      await sportsbookMinimizedPO.element.waitForClickable();
      await sportsbookMinimizedPO.element.click();
      await browser.waitUntilEquals(firstSelectionsBoardPO.title, "Some selections cannot be combined");
    });

    it("[PRPI-7684] Should display 'Some selections cannot be combined' in the top accordion", async () => {
      expect(await firstSelectionsBoardPO.title.getText()).toBe("Some selections cannot be combined");
    });

    it("[PRPI-7685] Should display 'NOT COMBINABLE' for each failed selection", async () => {
      expect(await firstFailedBetDetailsPO.hintMessage.getText()).toBe("NOT COMBINABLE");
      expect(await secondFailedBetDetailsPO.hintMessage.getText()).toBe("NOT COMBINABLE");
    });

    it("[PRPI-7686] Should display '1 or more of these selections aren't combinable. Review them and delete accordingly to place a valid Bet Builder'", async () => {
      expect(await firstBetBuilderFailedLegsPO.description.getText()).toBe(
        "1 or more of these selections aren't combinable. Review them and delete accordingly to place a valid Bet Builder.",
      );
    });

    describe("when adding 2 combinable selections and 2 non combinable from the same market", () => {
      beforeAll(async () => {
        await betslipDrawerPO.header.click();
        await browser.waitUntilNotDisplayed(placePanelPO.element);

        await mockService.mockHttpRequest(getImplyBetsResponse(SAME_MARKET_DOUBLE_MOCK, { ignoreLegsOrder: true }));

        await thirdSbkRunnerPO.sportsbookBetButton.waitForClickable();
        await thirdSbkRunnerPO.sportsbookBetButton.click();
        await fourthSbkRunnerPO.sportsbookBetButton.waitForClickable();
        await fourthSbkRunnerPO.sportsbookBetButton.click();
        await sportsbookMinimizedPO.element.waitForClickable();
        await sportsbookMinimizedPO.element.click();
        await browser.waitUntil(async () => (await firstBetBuilderPO.accordion.length) === 2);
      });

      it("[PRPI-7687] Should have 2 accordions", async () => {
        expect(await firstBetBuilderPO.accordion.length).toEqual(2);
      });

      it("[PRPI-7688] Should display 'Some selections cannot be combined' in the first accordion", async () => {
        expect(await firstSelectionsBoardPO.title.getText()).toBe("Some selections cannot be combined");
      });

      it("[PRPI-7689] Should not have a description of the message'", async () => {
        expect(await firstBetBuilderFailedLegsPO.description.isExisting()).toBe(false);
      });

      it("[PRPI-7690] Should display 'NOT COMBINABLE' for each failed selection", async () => {
        expect(await firstFailedBetDetailsPO.hintMessage.getText()).toBe("NOT COMBINABLE");
        expect(await secondFailedBetDetailsPO.hintMessage.getText()).toBe("NOT COMBINABLE");
      });

      it("[PRPI-7691] Should display 2 combinable selections in the second accordion", async () => {
        expect(await firstBetBuilderCombinedLegsPO.selections.length).toBe(2);
      });

      describe("When adding 2 combinable selections and 1 non eligible BB selection", () => {
        beforeAll(async () => {
          await mockService.clearAllMocks();
          await mockService.mockHttpRequest(
            getPayloadMatcherImplyBetsResponse(NOT_ELIGIBLE_DOUBLE_MOCK, {
              betLegs: LEGS_PAYLOAD_MATCH,
            }),
          );
          await firstFailedBetDetailsPO.removeButton.waitForClickable();
          await firstFailedBetDetailsPO.removeButton.click();
          await browser.waitUntilEquals(firstSelectionsBoardPO.title, "Some selections cannot be combined");
          await browser.waitUntilEquals(firstFailedBetDetailsPO.hintMessage, "NOT AVAILABLE FOR BET BUILDER");
        });

        it("[PRPI-7692] Should display 'Some selections cannot be combined' in the first accordion", async () => {
          expect(await firstSelectionsBoardPO.title.getText()).toBe("Some selections cannot be combined");
        });

        it("[PRPI-7692] Should display 'NOT AVAILABLE FOR BET BUILDER' for each failed selection", async () => {
          expect(await firstFailedBetDetailsPO.hintMessage.getText()).toBe("NOT AVAILABLE FOR BET BUILDER");
        });
      });
    });
  });
});
