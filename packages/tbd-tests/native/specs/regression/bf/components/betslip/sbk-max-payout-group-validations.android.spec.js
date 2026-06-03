const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const OneLineMultipleSO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.native.so");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeUpElementFullscreen, hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

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
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(secondMarketSO.sbkBetButtons[0]);

const placePanelSO = new SportsbookPlacePanelSO();
const alertSO = new AlertSO();
const singleSO = new SingleSO(placePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const singleStakeFieldSO = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);
const sportsbookMinimizedBetslipSO = new MinimizedSO();

const betslipDrawerSO = new BetslipDrawerSO();
const oneLineMultipleSO = new OneLineMultipleSO(placePanelSO.element);
const multipleControlsSO = new BetControlsSO(placePanelSO.element);
const multiplesStakeInputField = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const placeButtonSO = new PrimaryButtonSO();

const EVENT_TYPE_ID = 1;

const APP_CONTEXT_MOCK = {
  currencyCode: "USD",
  countryCode: "GB",
  loggedIn: "true",
  throttles: {
    DAILY_PAYOUT_LIMIT: { isActive: true },
  },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League 1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                title: "Team A vs Team B",
                fixture: {
                  urn: "ppb:fixture:29359895",
                  home: {
                    name: "Team A",
                  },
                  away: {
                    name: "Team B",
                  },
                },
                sportevent: {
                  name: "Team A vs Team B",
                  urn: "ppb:event:29359895",
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
                      urn: "ppb:sbkMarket:924.1",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team A v Team B",
                          urn: "ppb:event:29359895",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                          selectionId: 1,
                          name: "Team A",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.1/1" }, { runnerURN: "ppb:sbkRunner:924.1/2" }],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
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
                        {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [{ runnerURN: "ppb:sbkRunner:924.2/1" }, { runnerURN: "ppb:sbkRunner:924.2/2" }],
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
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
  betMaxStake: 500000,
  betMaxPayout: 100000,
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
  betMaxStake: 500000,
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
      betMaxStake: 500000,
      betMaxPayout: 100000,
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

describe("Max Payout Group Validation", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(firstRunnerSO.element);
    await browser.waitUntilClickableNative(firstRunnerSO.element);
    await firstRunnerSO.element.click();
    await browser.waitUntilDisplayed(placePanelSO.element, "Sportsbook single place panel element was not displayed");
  });

  describe("When I add a stake value of 400000 in the Single", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(singleStakeFieldSO.element);
      await browser.waitUntilClickableNative(singleStakeFieldSO.numberField);
      await singleStakeFieldSO.numberField.click();
      await singleStakeFieldSO.numberField.setValue(400000);
      await browser.waitUntilDisplayed(alertSO.element, "Alert was not displayed");
      await browser.waitUntilEquals(alertSO.items[0], "Maximum payout is $1.40 millions per day");
      await browser.waitUntilEquals(alertSO.detail, "Please review your stake");
    });

    it("[PRPI-3418] Should display the message 'Maximum payout is $1.40 millions per day'", async () => {
      expect(await alertSO.items[0].getText()).toBe("Maximum payout is $1.40 millions per day");
    });

    it("[PRPI-3419] Should display the url description 'Please review your stake'", async () => {
      expect(await alertSO.detail.getText()).toBe("Please review your stake");
    });

    describe("When I add a stake value that is above the max payout and the max stake limit", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(singleStakeFieldSO.numberField);
        await singleStakeFieldSO.numberField.click();
        await singleStakeFieldSO.numberField.setValue(5000000);
        await browser.waitUntilDisplayed(alertSO.element, "Alert was not displayed");
      });

      it("[PRPI-4089] should only display the max stake notification", async () => {
        expect(await alertSO.items[0].getText()).toBe("Maximum stake is $500,000.00");
        expect(await alertSO.items.length).toBe(1);
      });

      describe("when I tap on the message to correct the stake to the max stake value", () => {
        beforeAll(async () => {
          await hideKeyboard();
        });

        it("[PRPI-4090] should display the max payout notification", async () => {
          expect(await alertSO.items[0].getText()).toBe("Maximum payout is $1.40 millions per day");
          expect(await alertSO.items.length).toBe(1);
        });
      });
    });

    describe("When I change the stake value to 40 in the Single", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(singleStakeFieldSO.numberField);
        await singleStakeFieldSO.numberField.click();
        await singleStakeFieldSO.numberField.setValue(40);
        await browser.waitUntilNotDisplayed(alertSO.element, "Alert was not removed");
      });

      it("[PRPI-3420] Should remove the message", async () => {
        expect(await alertSO.element.isExisting()).toBe(false);
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
          await swipeUpElementFullscreen(firstCardSO.element);
          await browser.waitUntilDisplayed(secondRunnerSO.element, "Second runner bet button not visible");
          await browser.waitUntilClickableNative(secondRunnerSO.element);
          await secondRunnerSO.element.click();
          await browser.waitUntilDisplayed(sportsbookMinimizedBetslipSO.title, "Acca builder for double not visible");

          await browser.waitUntilDisplayed(sportsbookMinimizedBetslipSO.element);
          await browser.waitUntilClickableNative(sportsbookMinimizedBetslipSO.element);
          await sportsbookMinimizedBetslipSO.element.click();
          await browser.waitUntilDisplayed(multiplesStakeInputField.element);
          await browser.waitUntilDisplayed(oneLineMultipleSO.element, "One Line Multiple was not displayed");
        });

        describe("When I add a stake value of 400000 in the Multiple", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(multiplesStakeInputField.numberField);
            await multiplesStakeInputField.numberField.click();
            await multiplesStakeInputField.numberField.setValue(400000);
            await browser.waitUntilDisplayed(alertSO.element, "Alert was not displayed");
            await browser.waitUntilEquals(alertSO.items[0], "Maximum payout is $1.40 millions per day");
            await browser.waitUntilEquals(alertSO.detail, "Please review your stake");
          });

          it("[PRPI-3421] Should display the message 'Maximum payout is $1.40 millions per day'", async () => {
            expect(await alertSO.items[0].getText()).toBe("Maximum payout is $1.40 millions per day");
          });

          it("[PRPI-3421] Should display the url description 'Please review your stake'", async () => {
            expect(await alertSO.detail.getText()).toBe("Please review your stake");
          });

          it("[PRPI-3422] And the place bet button is disabled", async () => {
            expect(await placeButtonSO.element.isEnabled()).toBe(false);
          });

          describe("When I add a stake value of 40000 in the Multiple", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(multiplesStakeInputField.numberField);
              await multiplesStakeInputField.numberField.click();
              await multiplesStakeInputField.numberField.setValue(40000);
              await browser.waitUntilDisplayed(alertSO.element, "Alert was not displayed");
              await browser.waitUntilEquals(alertSO.items[0], "Each sport has max payout limits per bet");
              await browser.waitUntilEquals(alertSO.detail, "Max daily payout is $1.40 millions. See T&C’s.");
            });

            it("[PRPI-3423] Should display the message 'Each sport has max payout limits per bet'", async () => {
              expect(await alertSO.items[0].getText()).toBe("Each sport has max payout limits per bet");
            });

            it("[PRPI-3423] Should display the url description 'Max daily payout is $1.40 millions. See T&C\u2019s.'", async () => {
              expect(await alertSO.detail.getText()).toBe("Max daily payout is $1.40 millions. See T&C’s.");
            });

            it("[PRPI-3423] And the place bet button is enabled", async () => {
              expect(await placeButtonSO.element.isEnabled()).toBe(true);
            });
          });
        });
      });
    });
  });
});
