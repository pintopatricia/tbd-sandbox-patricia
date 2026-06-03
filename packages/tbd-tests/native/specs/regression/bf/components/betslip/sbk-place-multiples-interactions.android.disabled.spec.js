const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const OneLineMultipleSO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.native.so");
const MultiLinesMultiplesSO = require("@ppb/tbd-shared/components/Betslip/MultiLinesMultiples/MultiLinesMultiples.native.so");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const { swipeUpElement, swipeDownElement, hideKeyboard, swipeUp } = require("../../../../../helpers/gestures");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SinglesCardSO,
  BetLegsSO,
  InlineSportsbookMarketSO,
  CardSO,
  SportsbookBetButtonSO,
  CurrencyNumberInputFieldSO,
  BetControlsSO,
  BetDetailsSO,
  BetSelectionDetailsSO,
  BetsSummarySO,
  SelectionsBoardSO,
  PrimaryButtonSO,
  BetslipDrawerSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[1]);
const thirdRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[2]);
const fourthRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[3]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const betsSummarySO = new BetsSummarySO(sportsbookPlacePanelSO.element);
const oneLineMultipleSO = new OneLineMultipleSO(sportsbookPlacePanelSO.element);
const multiLinesMultiplesSO = new MultiLinesMultiplesSO(sportsbookPlacePanelSO.element);
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleBetDetailsSO = new BetDetailsSO(singlesCardSO.singles[0]);
const betLegsSO = new BetLegsSO(oneLineMultipleSO.element);
const selectionsBoardSO = new SelectionsBoardSO();
const firstSelectionSO = new BetSelectionDetailsSO(betLegsSO.selections[0]);
const multipleControlsSO = new BetControlsSO(oneLineMultipleSO.element);
const doubleMultipleControlsSO = new BetControlsSO(multiLinesMultiplesSO.multiples[0]);
const doubleMultipleStakeFieldSO = new CurrencyNumberInputFieldSO(doubleMultipleControlsSO.currencyInput);
const stakeInputFieldSO = new CurrencyNumberInputFieldSO(multipleControlsSO.currencyInput);
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.placeBtn);

const FIRST_MARKET_ID = "924.1";

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48044,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48041,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 2 } },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48042,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 2 } },
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 48045,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 2 } },
            decimalDisplayOdds: { decimalOdds: 2 },
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
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
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
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                          selectionId: 48044,
                          name: "Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48041`,
                          selectionId: 48041,
                          name: "2 Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48042`,
                          selectionId: 48042,
                          name: "3 Sporting",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48045`,
                          selectionId: 48045,
                          name: "4 Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48044`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48041`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48042`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/48045`,
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
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 48044,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
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
    marketId: FIRST_MARKET_ID,
    selectionId: 48044,
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
          marketId: FIRST_MARKET_ID,
          selectionId: 48041,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 48041,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: 48042,
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
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: 48042,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    THIRD_SINGLE_MOCK,
    {
      betType: "TREBLE",
      legCombinations: [],
      betMinStake: 0.1,
      betMaxStake: 1000,
      averageOdds: 4,
      winAverageOdds: 4,
      canPlaceEachwayBet: true,
      hasBonusMoney: true,
      betMinStakeIncrement: 0.01,
      numLines: 1,
      bonusWalletConditions: [{ value: 2, type: "NON_REDEEMABLE_AMOUNT" }],
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.81,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.81 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      canPlaceEachwayBet: true,
      betMinStakeIncrement: 0.01,
      numLines: 3,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.01,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.01 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      betType: "TRIXIE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      canPlaceEachwayBet: true,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.23,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.23 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 4,
    },
    {
      betType: "PATENT",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      canPlaceEachwayBet: true,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 1.23,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.23 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      numLines: 7,
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

describe("[787406] Place panel interactions - multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("[787406] when user make a multiple with 4 combinable selections", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Waiting for Sportsbook single place panel element",
      );
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilDisplayed(minimizedSO.element, "Minimized Betslip was not displayed");

      await secondRunnerSO.element.click();
      await thirdRunnerSO.element.click();
      await fourthRunnerSO.element.click();

      await browser.waitUntilEquals(minimizedSO.counter, "4");
    });

    describe("And when the user expands the betslip", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(minimizedSO.element);
        await minimizedSO.element.click();
        await browser.waitUntilDisplayed(oneLineMultipleSO.element, "One line multiple was not displayed");
      });

      it("[PRPI-3507] The selections board title should display '4 Selections'", async () => {
        expect(await selectionsBoardSO.title.getText()).toEqual("4 Selections");
      });

      it("[PRPI-3508] The selections board should have 4 selections", async () => {
        expect(await betLegsSO.selections.length).toEqual(4);
      });

      describe("when user taps on trash bin button of one selection on selections board", () => {
        beforeAll(async () => {
          await firstSelectionSO.removeButton.click();

          await browser.waitUntilEquals(selectionsBoardSO.title, "3 Selections");
        });

        it("[PRPI-3509] The selection should be removed from the selections board", async () => {
          expect(await firstSelectionSO.title.getText()).toEqual("2 Sporting");
          expect(await betLegsSO.selections.length).toEqual(3);
        });

        describe("when checking singles", () => {
          beforeAll(async () => {
            await swipeUpElement(selectionsBoardSO.element, 1400);
            await browser.waitUntilDisplayed(singlesCardSO.element, "Singles not visible");
          });

          it("[PRPI-3510] The single selection should be removed from the singles", async () => {
            expect(await singlesCardSO.singles.length).toEqual(3);
          });

          it("[PRPI-3510] The first single displayed should be the second runner added", async () => {
            expect(await firstSingleBetDetailsSO.title.getText()).toEqual("2 Sporting");
          });

          describe("when user inserts a '0.1' on the trebble multiple stake field ", () => {
            beforeAll(async () => {
              await swipeDownElement(singlesCardSO.singles[0], 1800);
              await browser.waitUntilDisplayed(stakeInputFieldSO.element, "Stake input field not visible");

              await stakeInputFieldSO.numberField.setValue(0.1);
              await hideKeyboard();
            });

            describe("when user inserts a '0.2' on the Double multiple stake field", () => {
              beforeAll(async () => {
                await swipeUp(0.8);
                await doubleMultipleStakeFieldSO.numberField.setValue(0.2);
                await hideKeyboard();
              });

              it("[PRPI-3510] The lines value should be updated to 3", async () => {
                expect(await doubleMultipleControlsSO.lines.getText()).toEqual("Double (x3)");
              });

              it("[PRPI-3510] The Returns should be updated to 1.21", async () => {
                expect(await doubleMultipleControlsSO.returns.getText()).toEqual("Returns $1.21");
              });

              it("[PRPI-3510] Then the total stake should be updated to 0.70", async () => {
                expect(await placeButtonSO.label.getText()).toContain("$0.70");
              });

              it("[PRPI-3510] Then the total returns should be updated to 1.49", async () => {
                expect(await betsSummarySO.totalReturnsValue.getText()).toEqual("$1.49");
              });
            });
          });
        });
      });
    });
  });
});
