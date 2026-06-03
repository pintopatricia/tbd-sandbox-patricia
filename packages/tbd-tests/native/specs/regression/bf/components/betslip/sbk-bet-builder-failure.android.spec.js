const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeUpElement } = require("../../../../../helpers/gestures");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  SportsbookPlacePanelSO,
  GenericScreenSO,
  BetBuildersCardSO,
  BetBuilderSO,
  CardSO,
  SportsbookMarketSO,
  RunnerSO,
  BetslipDrawerSO,
  MinimizedSO,
  FixedNumberInputFieldSO,
  BetControlsSO,
  AlertSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const thirdCardSO = new CardSO(genericScreenSO.cards[2]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const thirdSportsbookMarketSO = new SportsbookMarketSO(thirdCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const thirdRunnerSO = new RunnerSO(thirdSportsbookMarketSO.runnerList[0]);

const minimizedSO = new MinimizedSO();
const betslipDrawerSO = new BetslipDrawerSO();

const placePanelSO = new SportsbookPlacePanelSO();
const betBuildersCardSO = new BetBuildersCardSO(placePanelSO.element);
const firstBetBuilderSO = new BetBuilderSO(betBuildersCardSO.betBuilders[0]);
const firstBetControlsSO = new BetControlsSO(firstBetBuilderSO.element);
const firstOddsSO = new FixedNumberInputFieldSO(firstBetControlsSO.fixedInput);
const alertSO = new AlertSO();

const BFF_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29359895##MATCH_ODDS",
        title: "Match Odds",
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
                {
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
                  urn: "ppb:event:29359895",
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.22222222/44444",
                  selectionId: 44444,
                  name: "Wolves",
                },
                {
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
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:card:29359895##MATCH_ODDS", __typename: "MarketCard" } },
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

const FAILED_SGM_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  betFailures: [
    {
      failedRunner: FIRST_RUNNER,
      failureCode: "INVALID_COMBINATION",
    },
    {
      failedRunner: SECOND_RUNNER,
      failureCode: "INVALID_COMBINATION",
    },
    {
      failedRunner: FIRST_RUNNER,
      combinationGroups: [1],
      failureCode: "INVALID_SGM_COMBINATION_SINGLE_ODDS",
    },
    {
      failedRunner: SECOND_RUNNER,
      combinationGroups: [1],
      failureCode: "INVALID_SGM_COMBINATION_SINGLE_ODDS",
    },
  ],

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

const TREBLE = {
  betType: "TREBLE",
  numLines: 1,
  features: ["SGM"],
  legCombinations: [{ runners: [FIRST_RUNNER] }, { runners: [SECOND_RUNNER] }, { runners: [THIRD_RUNNER] }],
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

const VALID_SGM_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK, THIRD_SINGLE_MOCK, TREBLE],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

describe("Bet Builder bets place", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when the user adds two combinable selections from the same event and opens the betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
      await mockService.mockHttpRequest(getImplyBetsResponse(FAILED_SGM_MOCK));

      await secondRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilClickableNative(minimizedSO.element);
      await browser.waitUntilNotInDOM(placePanelSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilEquals(
        alertSO.message,
        "This Bet Builder needs one more selection to be completed",
        "Failed bet builder was not displayed",
      );
    });

    it("[PRPI-3329] The message 'This Bet Builder needs one more selection to be completed' should be displayed", async () => {
      expect(await alertSO.message.getText()).toEqual("This Bet Builder needs one more selection to be completed");
    });

    describe("When adding another combinable selection from the same event", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(VALID_SGM_MOCK));
        await browser.waitUntilDisplayed(betslipDrawerSO.element);
        await browser.waitUntilClickableNative(betslipDrawerSO.header);
        await betslipDrawerSO.header.click();
        await swipeUpElement(secondRunnerSO.element, 500);
        await browser.waitUntilDisplayed(thirdRunnerSO.element);
        await browser.waitUntilClickableNative(thirdRunnerSO.sbkBetButtons[0]);
        await thirdRunnerSO.sbkBetButtons[0].click();
        await browser.waitUntilDisplayed(minimizedSO.element);
        await browser.waitUntilClickableNative(minimizedSO.element);
        await minimizedSO.element.click();
        await browser.waitUntilEquals(firstOddsSO.numberField, "3.2", "Valid bet builder was not displayed");
        await browser.waitUntilNotInDOM(alertSO.element);
      });

      it("[PRPI-3330] The message 'This Bet Builder needs one more selection to be completed' should NOT be displayed", async () => {
        expect(await alertSO.element.isExisting()).toBe(false);
      });
    });
  });
});
