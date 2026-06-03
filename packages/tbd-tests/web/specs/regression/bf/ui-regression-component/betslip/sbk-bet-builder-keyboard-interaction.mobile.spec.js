const {
  AppPO,
  EventPagePO,
  BetBuildersCardPO,
  BetBuilderPO,
  SinglePO,
  SinglesCardPO,
  MinimizedPO,
  RunnerPO,
  BetControlsPO,
  BetDetailsPO,
  CardPO,
  CurrencyNumberInputFieldPO,
  BetslipDrawerPO,
  KeyboardPO,
  SportsbookMarketPO,
  SportsbookPlacePanelPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const firstSportsbookRunnerPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondSportsbookRunnerPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);

const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const keyboardPO = new KeyboardPO();
const controlsPO = new BetControlsPO();
const stakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const betBuildersCardPO = new BetBuildersCardPO(sportsbookPlacePanelPO.element);
const firstBetBuilderPO = new BetBuilderPO(betBuildersCardPO.betBuilders[0]);
const firstBetControlsPO = new BetControlsPO(firstBetBuilderPO.element);
const betBuilderStakePO = new CurrencyNumberInputFieldPO(firstBetControlsPO.currencyInput);
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const firstSingleStakePO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);
const secondSinglePO = new SinglePO(singlesCardPO.singles[1]);
const secondSingleBetDetailsPO = new BetDetailsPO(secondSinglePO.element);

const mockService = new MockService();

const BFF_MOCK = {
  urn: "ppb:tbd:view:event:29359895",
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
  ],

  partialEdges: [
    { node: { urn: "ppb:tbd:card:29359895##MATCH_ODDS", __typename: "MarketCard" } },
    { node: { urn: "ppb:tbd:card:29359895##HALF_TIME", __typename: "MarketCard" } },
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

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [{ marketId: "924.11111111", selectionId: 11111 }],
    },
  ],
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: { marketId: "924.11111111", selectionId: 11111 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [{ marketId: "924.22222222", selectionId: 44444 }],
    },
  ],
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: { marketId: "924.22222222", selectionId: 44444 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_SGM_MOCK = {
  betType: "DOUBLE",
  features: ["SGM"],
  legCombinations: [
    { runners: [{ marketId: "924.11111111", selectionId: 11111 }] },
    { runners: [{ marketId: "924.22222222", selectionId: 44444 }] },
  ],

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

const SIB_BET_BUILDER_MOCK = {
  betCombinations: [DOUBLE_SGM_MOCK, FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

describe("SBK Keyboard Interactions - Bet Builder", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
    await browser.url(routes.getEventViewUrl(29359895));
    await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
  });

  describe("When two Bet Builder compatible selections are added to the betslip", () => {
    beforeAll(async () => {
      await firstSportsbookRunnerPO.sportsbookBetButton.waitForClickable();
      await firstSportsbookRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");

      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedPO.counter, "Betslip was not minimized");
      await secondSportsbookRunnerPO.sportsbookBetButton.scrollIntoView({
        block: "center",
      });
      await browser.waitUntilDisplayed(
        secondSportsbookRunnerPO.sportsbookBetButton,
        "Second runner bet button not visible",
      );

      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_BET_BUILDER_MOCK));
      await secondSportsbookRunnerPO.sportsbookBetButton.waitForClickable();
      await secondSportsbookRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(minimizedPO.counter, "2");

      await minimizedPO.element.waitForClickable();
      await minimizedPO.element.click();
      await browser.waitUntilDisplayed(betBuildersCardPO.element, "Bet Builder not displayed");
    });

    describe("When Bet Builder stake field is pressed", () => {
      beforeAll(async () => {
        await betBuilderStakePO.numberField.waitForClickable();
        await betBuilderStakePO.numberField.click();
        await browser.waitUntil(() => betBuilderStakePO.numberField.isFocused());
      });

      it("[PRPI-5600] The keyboard should display", async () => {
        expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
      });

      describe("When a stake of 1.79 is added via keyboard", () => {
        beforeAll(async () => {
          await browser.waitUntilStopsMoving(keyboardPO.element);
          await keyboardPO.one.waitForClickable();
          await keyboardPO.one.click();
          await keyboardPO.separator.click();
          await keyboardPO.seven.click();
          await keyboardPO.nine.click();
        });

        it("[PRPI-5601] The stake field is populated with 1.79", async () => {
          expect(await betBuilderStakePO.numberField.getValue()).toBe("1.79");
        });

        describe("When the single selection stake input field is clicked", () => {
          beforeAll(async () => {
            await firstSingleStakePO.element.scrollIntoView({ block: "center" });
            await browser.waitUntilDisplayed(firstSingleStakePO.element, "Single stake input field not visible");

            await firstSingleStakePO.numberField.waitForClickable();
            await firstSingleStakePO.numberField.click();
          });

          it("[PRPI-5602] Should remove focus from Bet Builder stake field", async () => {
            expect(await betBuilderStakePO.numberField.isFocused()).toBe(false);
          });

          it("[PRPI-5602] Should add focus to single stake field", async () => {
            expect(await firstSingleStakePO.numberField.isFocused()).toBe(true);
          });

          describe("When the second single is removed from the betslip", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
              await secondSingleBetDetailsPO.remove.waitForClickable();
              await secondSingleBetDetailsPO.remove.click();

              await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Singles betslip not displayed");
              await browser.waitUntil(async () => (await singlesCardPO.singles.length) === 1);
            });

            it("[PRPI-5602] The stake input field should be focused", async () => {
              expect(await stakeInputFieldPO.numberField.isFocused()).toBe(true);
            });

            it("[PRPI-5602] The keyboard should be displayed", async () => {
              expect(await keyboardPO.element.isDisplayedInViewport()).toBe(true);
            });
          });
        });
      });
    });
  });
});
