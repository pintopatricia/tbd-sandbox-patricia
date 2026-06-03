const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const OneLineMultipleSO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.native.so");
const describe = require("./setup/setup");
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SingleSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  AlertSO,
  PrimaryButtonSO,
} = require("../../../../../screen-objects");

const mockService = new MockService(driver.capabilities.deviceName);
const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstMarketSO.sbkBetButtons[0]);

const placePanelSO = new SportsbookPlacePanelSO();
const alertSO = new AlertSO();
const singleSO = new SingleSO(placePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const singleStakeFieldSO = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);
const sportsbookMinimizedBetslipSO = new MinimizedSO();
const placeButtonSO = new PrimaryButtonSO();

const betslipDrawerSO = new BetslipDrawerSO();
const oneLineMultipleSO = new OneLineMultipleSO(placePanelSO.element);
const multipleControlsSO = new BetControlsSO(placePanelSO.element);
const multiplesStakeInputField = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);

const EVENT_TYPE_ID = 1;

const APP_CONTEXT_MOCK = {
  jurisdiction: "ITALY",
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 10 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: "1",
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
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        cardGroupTitle: "League 2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team C vs Team D",
                fixture: {
                  urn: "ppb:fixture:29359896",
                  home: {
                    name: "Team C",
                  },
                  away: {
                    name: "Team D",
                  },
                },
                sportevent: {
                  name: "Team C vs Team D",
                  urn: "ppb:event:29359896",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.2",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team C v Team D",
                          urn: "ppb:event:29359896",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.2/1",
                          selectionId: 1,
                          name: "Team C",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }],
                  },
                },
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.1",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 1200,
  betMaxPayout: 10000,
  averageOdds: 10,
  winAverageOdds: 10,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 10 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 10 },
    },
    decimalDisplayOdds: {
      decimalOdds: 10,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: "924.2",
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 1200,
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

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.2",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.4 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.4,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.1,
      betMaxStake: 1000,
      betMaxPayout: 10000,
      averageOdds: 10,
      winAverageOdds: 10,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 10,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 10 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const BFF_ENSURE_MARKETS_MOCK = {
  markets: [
    {
      __typename: "SportsbookMarket",
      urn: "ppb:sbkMarket:924.1",
      runners: [
        {
          runnerURN: "ppb:sbkRunner:924.1/1",
          selectionId: 1,
        },
      ],
    },
  ],
};

describe.sbkBetslipSetup({
  appContextMock: APP_CONTEXT_MOCK,
  bffMock: BFF_MOCK,
  bffGetMarketsMock: BFF_ENSURE_MARKETS_MOCK,
  initialSelections: [{ marketId: "924.1", selectionId: 1 }],
  options: {
    smpMock: SMP_MOCK,
    implyBetsMock: SINGLE_MOCK,
  },
})("Max Payout Validation", () => {
  describe("When I add a stake value of 1200", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(placePanelSO.element, "Sportsbook single place panel element was not displayed");

      await browser.waitUntilClickableNative(singleStakeFieldSO.numberField);
      await singleStakeFieldSO.numberField.click();
      await singleStakeFieldSO.numberField.setValue(1200);
      await browser.waitUntilEquals(singleStakeFieldSO.numberField, "1200");
      await browser.waitUntilDisplayed(alertSO.element, "Notification was not displayed");
    });

    it("[PRPI-3424] Should display the message 'Maximum returns are $10,000.00'", async () => {
      expect(await alertSO.items[0].getText()).toBe("Maximum returns are $10,000.00");
    });

    it("[PRPI-4091] Should display a disabled place button with 'Place $1,200.00 Bet' label", async () => {
      expect(await placeButtonSO.element.isEnabled()).toBe(false);
      expect(await placeButtonSO.label.getText()).toBe("Place $1,200.00 Bet");
    });

    describe("When I change the stake value to 1000", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(singleStakeFieldSO.numberField);
        await singleStakeFieldSO.numberField.click();
        await singleStakeFieldSO.numberField.setValue(1000);
        await browser.waitUntilEquals(singleStakeFieldSO.numberField, "1000");
        await browser.waitUntilNotDisplayed(alertSO.element, "Notification was not removed");
      });

      it("[PRPI-3425] Should remove the message", async () => {
        expect(await alertSO.element.isExisting()).toBe(false);
      });

      it("[PRPI-4092] Should display an enabled place button with 'Place $1,000.00 Bet' label", async () => {
        expect(await placeButtonSO.element.isEnabled()).toBe(true);
        expect(await placeButtonSO.label.getText()).toBe("Place $1,000.00 Bet");
      });

      describe("When I add another selection", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(singleStakeFieldSO.numberField);
          await singleStakeFieldSO.numberField.click();
          await singleStakeFieldSO.numberField.setValue("");

          await browser.waitUntilClickableNative(betslipDrawerSO.header);
          await betslipDrawerSO.header.click();
          await browser.waitUntilDisplayed(sportsbookMinimizedBetslipSO.counter, "Betslip was not minimized");

          await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
          await browser.waitUntilDisplayed(firstRunnerSO.element, "Second runner bet button not visible");
          await browser.waitUntilClickableNative(firstRunnerSO.element);
          await firstRunnerSO.element.click();
          await browser.waitUntilEquals(sportsbookMinimizedBetslipSO.counter, "2");

          await browser.waitUntilClickableNative(sportsbookMinimizedBetslipSO.element);
          await sportsbookMinimizedBetslipSO.element.click();
          await browser.waitUntilDisplayed(oneLineMultipleSO.element, "One line multiple was not displayed");
        });

        describe("And I add a stake value of 2200 in the Multiple", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(multiplesStakeInputField.numberField);
            await multiplesStakeInputField.numberField.click();
            await multiplesStakeInputField.numberField.setValue("2200");
            await browser.waitUntilDisplayed(alertSO.element, "Notification was not displayed");
          });

          it("[PRPI-3426] Should display the message 'Maximum returns are $10,000.00'", async () => {
            expect(await alertSO.items[0].getText()).toBe("Maximum returns are $10,000.00");
          });

          it("[PRPI-3427] Should display the message 'Maximum stake is $1,000.00'", async () => {
            expect(await alertSO.items[1].getText()).toBe("Maximum stake is $1,000.00");
          });

          it("[PRPI-3428] Should display the detail 'Tap to update stake'", async () => {
            expect(await alertSO.detail.getText()).toBe("Tap to update stake");
          });

          it("[PRPI-4093] Should display a disabled place button with 'Place $2,200.00 Bet' label", async () => {
            expect(await placeButtonSO.element.isEnabled()).toBe(false);
            expect(await placeButtonSO.label.getText()).toBe("Place $2,200.00 Bet");
          });

          describe("When I tap on the message", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(alertSO.element);
              await alertSO.element.click();
              await browser.waitUntilNotDisplayed(alertSO.element, "Notification was not removed");
            });

            it("[PRPI-3429] The stake field should update to 1000", async () => {
              expect(await multiplesStakeInputField.numberField.getText()).toBe("1000");
            });

            it("[PRPI-3430] The message should disappear", async () => {
              expect(await alertSO.element.isDisplayed()).toBe(false);
            });

            it("[PRPI-4094] Should display an enabled place button with 'Place $1,000.00 Bet' label", async () => {
              expect(await placeButtonSO.element.isEnabled()).toBe(true);
              expect(await placeButtonSO.label.getText()).toBe("Place $1,000.00 Bet");
            });
          });
        });
      });
    });
  });
});
