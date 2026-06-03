const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const {
  getAppContext,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");
const { hideKeyboard, swipeUpElement } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  QuickStakesSO,
  BetsSummarySO,
  CurrencyNumberInputFieldSO,
  BetDetailsSO,
  KeyboardSO,
  BetControlsSO,
  PrimaryButtonSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const cardSO = new CardSO(genericScreenSO.element);
const placePanelSO = new SportsbookPlacePanelSO();
const sportsbookMarketSO = new InlineSportsbookMarketSO(cardSO.contentWrapper);
const minimizedSO = new MinimizedSO();
const firstRunnerSO = new SportsbookBetButtonSO(sportsbookMarketSO.sbkBetButtons[0]);
const thirdRunnerSO = new InlineSportsbookMarketSO(sportsbookMarketSO.sbkBetButtons[2]);
const betslipDrawerSO = new BetslipDrawerSO();
const betDetailsSO = new BetDetailsSO();
const quickStakesSO = new QuickStakesSO();
const singleSO = new SingleSO(placePanelSO.element);
const singleControlsSO = new BetControlsSO(singleSO.controls);
const sportsbookSinglePlaceSizeInputField = new CurrencyNumberInputFieldSO(singleControlsSO.currencyInput);

const keyboardSO = new KeyboardSO();
const singlesCardSO = new SinglesCardSO(placePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const secondSingleControlsSO = new BetControlsSO(secondSingleSO.controls);
const firstSingleBetDetailsSO = new BetDetailsSO(firstSingleSO.element);
const secondSingleBetDetailsSO = new BetDetailsSO(secondSingleSO.element);
const firstSingleInputSO = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const secondSingleInputSO = new CurrencyNumberInputFieldSO(secondSingleControlsSO.currencyInput);
const betsSummarySO = new BetsSummarySO(placePanelSO.element);
const placeButtonSO = new PrimaryButtonSO(placePanelSO.place);

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const MARKET_ID = "924.193270252";

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5 },
            },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: 2,
          noOdds: true,
        },
        {
          selectionId: 3,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.55 },
            },
            decimalDisplayOdds: { decimalOdds: 1.55 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
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

  betMinStake: 0.1,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
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
      decimalOdds: { decimalOdds: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 5 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
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

  betMinStake: 0.1,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.55 },
    },
    decimalDisplayOdds: { decimalOdds: 1.55 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 3,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.55 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.55,
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const TWO_SINGLES_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Sporting v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                          selectionId: 2,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                      },
                    ],
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
        cardGroupTitle: "Second Card",
        urn: "ppb:tbd:card:group:topEventsInSport:2",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Sporting",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Sporting v Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                          selectionId: 2,
                          name: "The Draw",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Man Utd",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                      },
                    ],
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

describe("Betslip - SBK single panel interactions", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when the user taps on a given bet button with odd 5", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(placePanelSO.element, "Waiting for Sportsbook single place panel element");
    });

    describe("when the user taps on +5 stake", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(quickStakesSO.quickStake[0]);
        await quickStakesSO.quickStake[0].click();
      });

      it("[PRPI-3540] should show currency symbol and stake in the size input field", async () => {
        expect(await sportsbookSinglePlaceSizeInputField.currencySymbol.getText()).toBe("$");
        expect(await sportsbookSinglePlaceSizeInputField.numberField.getText()).toBe("5");
      });

      it("[PRPI-3541] should show the returns", async () => {
        expect(await singleControlsSO.returns.getText()).toBe("Returns $25.00");
      });

      describe("when the user edits the stake to 6 and taps +10 quickstake", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(keyboardSO.delete);
          await keyboardSO.delete.click();
          await browser.waitUntilClickableNative(keyboardSO.six);
          await keyboardSO.six.click();
          await browser.waitUntilDisplayed(quickStakesSO.quickStake[1]);
          await quickStakesSO.quickStake[1].click();
          await browser.waitUntilEquals(sportsbookSinglePlaceSizeInputField.numberField, "16");
        });

        it("[PRPI-3542] should show 16 in the stake field", async () => {
          expect(await sportsbookSinglePlaceSizeInputField.numberField.getText()).toBe("16");
        });

        it("[PRPI-3543] should update the returns to $80", async () => {
          expect(await singleControlsSO.returns.getText()).toBe("Returns $80.00");
        });

        describe("when the user adds another selection from the same market and expands Betslip", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(betslipDrawerSO.header);
            await betslipDrawerSO.header.click();
            await mockService.mockHttpRequest(getImplyBetsResponse(TWO_SINGLES_MOCK));
            await browser.waitUntilDisplayed(thirdRunnerSO.element);
            await thirdRunnerSO.element.click();
            await browser.waitUntilEquals(minimizedSO.counter, "2");

            await browser.waitUntilClickableNative(minimizedSO.element);
            await minimizedSO.element.click();
            await browser.waitUntilDisplayed(placePanelSO.element, "Waiting for Sportsbook place panel element");
          });

          it("[PRPI-3544] should show the two singles", async () => {
            expect(await singlesCardSO.singles.length).toBe(2);
            expect(await firstSingleBetDetailsSO.title.getText()).toBe("Sporting");
            expect(await secondSingleBetDetailsSO.title.getText()).toBe("Man Utd");
          });

          it("[PRPI-3544] should keep the stake on the first single", async () => {
            expect(await firstSingleInputSO.numberField.getText()).toBe("16");
          });

          describe("When user inserts a 0.1 stake on second selection", () => {
            beforeAll(async () => {
              await secondSingleInputSO.setValue(0.1);
              await hideKeyboard();
              await swipeUpElement(secondSingleSO.element, 200);
            });

            it("[PRPI-3544] should show $0.16 returns for the second selection", async () => {
              expect(await secondSingleControlsSO.returns.getText()).toBe("Returns $0.16");
            });

            it("[PRPI-3544] should show a total stake of $16.10", async () => {
              expect(await placeButtonSO.label.getText()).toContain("$16.10");
            });

            it("[PRPI-3544] should update total returns to $80.16", async () => {
              expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$80.16");
            });

            describe("When user taps on trash bin of both selections", () => {
              beforeAll(async () => {
                await browser.waitUntilDisplayed(firstSingleBetDetailsSO.remove);
                await firstSingleBetDetailsSO.remove.click();
                await browser.waitUntilDisplayed(betDetailsSO.remove);
                await betDetailsSO.remove.click();
                await browser.waitUntilNotDisplayed(betslipDrawerSO.header);
              });

              it("[PRPI-3544] should close Betslip", async () => {
                expect(await betslipDrawerSO.header.isDisplayed()).toBe(false);
              });

              describe("When user taps on given selection", () => {
                beforeAll(async () => {
                  await browser.waitUntilDisplayed(firstRunnerSO.element);
                  await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
                  await browser.waitUntilDisplayed(firstRunnerSO.element);
                  await firstRunnerSO.element.click();
                  await browser.waitUntilDisplayed(
                    placePanelSO.element,
                    "Waiting for Sportsbook single place panel element",
                  );
                });

                describe("and user taps on the expandable header", () => {
                  beforeAll(async () => {
                    await browser.waitUntilClickableNative(betslipDrawerSO.header);
                    await betslipDrawerSO.header.click();
                    await browser.waitUntilEquals(minimizedSO.counter, "1");
                  });

                  it("[PRPI-3544] should collapse Betslip", async () => {
                    expect(await minimizedSO.element.isDisplayed()).toBe(true);
                  });

                  describe("when the user swipes up Betslip handle button", () => {
                    beforeAll(async () => {
                      await browser.waitUntilClickableNative(minimizedSO.element);
                      await minimizedSO.element.click();
                      await browser.waitUntilDisplayed(
                        placePanelSO.element,
                        "Waiting for Sportsbook single place panel element",
                      );
                    });

                    it("[PRPI-3544] should open Betslip", async () => {
                      expect(await placePanelSO.element.isDisplayed()).toBe(true);
                    });

                    describe("when the user adds another selection", () => {
                      beforeAll(async () => {
                        await browser.waitUntilClickableNative(betslipDrawerSO.header);
                        await betslipDrawerSO.header.click();
                        await browser.waitUntilDisplayed(thirdRunnerSO.element);
                        await thirdRunnerSO.element.click();
                        await browser.waitUntilEquals(minimizedSO.counter, "2");

                        await browser.waitUntilClickableNative(minimizedSO.element);
                        await minimizedSO.element.click();
                        await browser.waitUntilDisplayed(
                          placePanelSO.element,
                          "Waiting for Sportsbook place panel element",
                        );
                      });

                      it("[PRPI-3544] should open Betslip and show just the place button", async () => {
                        expect(await placePanelSO.element.isDisplayed()).toBe(true);
                        expect(await placePanelSO.actions.length).toBe(1);
                        expect(await placePanelSO.actions[0].getText()).toBe("Place Bet");
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
