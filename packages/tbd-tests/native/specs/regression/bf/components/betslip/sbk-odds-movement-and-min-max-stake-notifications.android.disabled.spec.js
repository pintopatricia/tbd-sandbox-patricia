const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeDownElement, swipeUpElement, hideKeyboard } = require("../../../../../helpers/gestures");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
  GenericScreenSO,
  MultiplesCardSO,
  SinglesCardSO,
  SingleSO,
  BetLegsSO,
  SportsbookMarketSO,
  CardSO,
  RunnerSO,
  BetslipDrawerSO,
  PrimaryButtonSO,
  CurrencyNumberInputFieldSO,
  AlertSO,
  FixedNumberInputFieldSO,
  OddsMovementSO,
  BetSelectionDetailsSO,
  ReceiptTitleSO,
  BetControlsSO,
  OddsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService(driver.capabilities.deviceName);
const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSportsbookMarketSO = new SportsbookMarketSO(firstCardSO.sportsbookMarket);
const secondSportsbookMarketSO = new SportsbookMarketSO(secondCardSO.sportsbookMarket);
const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

// single place panel
const firstSingleOddsFieldSO = new FixedNumberInputFieldSO(sportsbookPlacePanelSO.element);
const firstSingleInputOddsMovementSO = new OddsMovementSO(firstSingleOddsFieldSO.element);
const placePanelAlertSO = new AlertSO();
const placeMultiplesBetLegsSO = new BetLegsSO(sportsbookPlacePanelSO.element);
const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);

// multiples accordion
const firstSelectionDetailsSO = new BetSelectionDetailsSO(placeMultiplesBetLegsSO.selections[0]);
const firstSelectionDetailsOddsMovementSO = new OddsMovementSO(firstSelectionDetailsSO.element);
const secondSelectionDetailsSO = new BetSelectionDetailsSO(placeMultiplesBetLegsSO.selections[1]);
const secondSelectionOddsSO = new OddsSO(secondSelectionDetailsSO.element);
const secondSelectionDetailsOddsMovementSO = new OddsMovementSO(secondSelectionDetailsSO.element);

// multiples place panel
const multiplesCardSO = new MultiplesCardSO(sportsbookPlacePanelSO.element);
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const secondSingleControlsSO = new BetControlsSO(secondSingleSO.controls);
const firstSelectionOddsFieldSO = new FixedNumberInputFieldSO(firstSingleControlsSO.fixedInput);
const secondSelectionStakeInputFieldSO = new CurrencyNumberInputFieldSO(secondSingleControlsSO.currencyInput);
const secondSelectionOddsFieldSO = new FixedNumberInputFieldSO(secondSingleControlsSO.fixedInput);
const secondSelectionInputOddsMovementSO = new OddsMovementSO(secondSelectionOddsFieldSO.oddsMovement);

const receiptPanelSO = new SportsbookReceiptPanelSO();
const receiptTitleSO = new ReceiptTitleSO();

const FIRST_MARKET_ID = "924.1";
const SECOND_MARKET_ID = "924.2";

const EVENT_TYPE_ID = 1;
const EVENT_ID = 29359895;
const SECOND_EVENT_ID = 29359891;

const FIRST_SELECTION_ID = 48044;
const SECOND_SELECTION_ID = 48041;

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: { decimalOdds: { decimalOdds: 5 } },
            decimalDisplayOdds: { decimalOdds: 5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
    {
      marketId: SECOND_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
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
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${FIRST_SELECTION_ID}`,
                          selectionId: FIRST_SELECTION_ID,
                          name: "Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${FIRST_SELECTION_ID}`,
                      },
                    ],
                  },
                },
              },
            },
          ],
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
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${SECOND_EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${SECOND_EVENT_ID}`,
                  home: {
                    name: "2 Sporting",
                  },
                  away: {
                    name: "2 Man Utd",
                  },
                },
                sportevent: {
                  name: "2 Sporting v 2 Man Utd",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${SECOND_EVENT_ID}`,
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
                      urn: `ppb:sbkMarket:${SECOND_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "2 Sporting v Man Utd",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/${SECOND_SELECTION_ID}`,
                          selectionId: SECOND_SELECTION_ID,
                          name: "2 Sporting",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/${SECOND_SELECTION_ID}`,
                      },
                    ],
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
          marketId: FIRST_MARKET_ID,
          selectionId: FIRST_SELECTION_ID,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 500,
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

const FIRST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: FIRST_SELECTION_ID,
        },
      ],
    },
  ],

  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betType: "SINGLE",
};
const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: FIRST_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const FIRST_COMBINATION_MOVEMENT = {
  ...FIRST_COMBINATION,
  averageOdds: 4,
  winAverageOdds: 4,
};
const FIRST_COMBINATION_ODDS_MOVEMENT = {
  ...FIRST_COMBINATION_ODDS,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 4 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: SECOND_SELECTION_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 500,
  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betType: "SINGLE",
};

const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: SECOND_MARKET_ID,
    selectionId: SECOND_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SECOND_COMBINATION_MOVEMENT = {
  ...SECOND_COMBINATION,
  averageOdds: 3,
  winAverageOdds: 3,
};

const SECOND_COMBINATION_ODDS_MOVEMENT = {
  ...SECOND_COMBINATION_ODDS,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SINGLE_MOCK_MOVEMENT = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT],
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: SECOND_MARKET_ID,
          selectionId: SECOND_SELECTION_ID,
        },
      ],
    },
  ],

  hasBonusMoney: true,
  betMinStake: 0.12,
  betMaxStake: 500,
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
    marketId: SECOND_MARKET_ID,
    selectionId: SECOND_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    decimalDisplayOdds: { decimalOdds: 2 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_COMBINATION_MOVEMENT,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 500,
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
  ],

  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_SINGLE_ODDS_MOCK],
};

const DOUBLE_ONELINE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: 10,
  winAverageOdds: 10,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 10 } },
    decimalDisplayOdds: { decimalOdds: 10 },
  },
  betType: "DOUBLE",
};

const DOUBLE_ONELINE_COMBINATION_MOVEMENT = {
  ...DOUBLE_ONELINE_COMBINATION,
  averageOdds: 5.5,
  winAverageOdds: 5.5,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 5.5 } },
    decimalDisplayOdds: { decimalOdds: 5.5 },
  },
};

const DOUBLE_ODDS_MOVEMENT_MOCK = {
  betCombinations: [FIRST_COMBINATION_MOVEMENT, SECOND_COMBINATION_MOVEMENT, DOUBLE_ONELINE_COMBINATION_MOVEMENT],
  runnerOdds: [FIRST_COMBINATION_ODDS_MOVEMENT, SECOND_COMBINATION_ODDS_MOVEMENT],
};

const FIRST_PLACE_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 3.0 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      betType: "SINGLE",
      runners: [
        {
          runner: { marketId: SECOND_MARKET_ID, selectionId: SECOND_SELECTION_ID },
          odds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: SECOND_MARKET_ID, selectionId: SECOND_SELECTION_ID } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalStake: 500,
      totalPotentialWin: 15000,
    },
  ],
};

describe("Betslip - Odds movement and min/max stake notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(FIRST_SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when the user adds one selection to betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.sbkBetButtons[0]);
      await firstRunnerSO.sbkBetButtons[0].click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Sportsbook single place panel element was not displayed",
      );
    });

    describe("and when the odd changes to 4", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK_MOVEMENT));
        await browser.waitUntilDisplayed(firstSingleInputOddsMovementSO.arrow);
      });

      it("[PRPI-3464] an arrow should appear in the price input field", async () => {
        expect(await firstSingleInputOddsMovementSO.arrow.isDisplayed()).toBe(true);
      });

      it("[PRPI-3465] the notification 'Odds have changed' should be displayed", async () => {
        expect(await placePanelAlertSO.message.getText()).toBe("Odds have changed");
      });

      it("[PRPI-3466] the CTA button change the message to 'Accept odds change and Place Bet'", async () => {
        expect(await placeButtonSO.label.getText()).toBe("Accept odds change and Place Bet");
      });

      describe("when the user adds another selection with odd 2", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(betslipDrawerSO.header);
          await betslipDrawerSO.header.click();
          await browser.waitUntilDisplayed(minimizedSO.element, "Minimized Betslip was not displayed");
          await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
          await browser.waitUntilDisplayed(
            secondRunnerSO.sbkBetButtons[0],
            "Second runner bet button was not displayed",
          );
          await secondRunnerSO.sbkBetButtons[0].click();
          await browser.waitUntilEquals(minimizedSO.counter, "2");
        });

        describe("and when the user opens the betslip", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(minimizedSO.element);
            await minimizedSO.element.click();
            await browser.waitUntilDisplayed(multiplesCardSO.element, "Multiples Card was not displayed");
          });

          it("[PRPI-3467] an arrow should be displayed in first selection in the accordion", async () => {
            expect(await firstSelectionDetailsOddsMovementSO.arrow.isDisplayed()).toBe(true);
          });

          describe("when the odd of second selection changes to 3", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_ODDS_MOVEMENT_MOCK));
              await browser.waitUntilEquals(secondSelectionOddsSO.odds, "3");
              await swipeUpElement(firstSelectionOddsFieldSO.element, 500);
              await browser.waitUntilDisplayed(secondSelectionOddsFieldSO.element);
            });

            it("[PRPI-3468] an arrow should be displayed in second selection single input field", async () => {
              expect(await secondSelectionInputOddsMovementSO.arrow.isDisplayed()).toBe(true);
            });

            describe("scrolling to let the accordion be visible", () => {
              beforeAll(async () => {
                await swipeDownElement(firstSelectionOddsFieldSO.element, 500);
              });

              it("[PRPI-3468] an arrow should be displayed in second selection in the accordion", async () => {
                expect(await secondSelectionDetailsOddsMovementSO.arrow.isDisplayed()).toBe(true);
              });

              describe("when the user add a stake value 0.0009 in second selection", () => {
                beforeAll(async () => {
                  await secondSelectionStakeInputFieldSO.numberField.setValue(0.0009);
                  await hideKeyboard();
                  await browser.waitUntilEquals(secondSelectionStakeInputFieldSO.numberField, "0.1");
                });

                it("[PRPI-3468] the notification 'Odds have changed' should be displayed", async () => {
                  expect(await placePanelAlertSO.message.getText()).toBe("Odds have changed");
                });

                it("[PRPI-3468] the size value should be corrected to 0.1", async () => {
                  expect(await secondSelectionStakeInputFieldSO.numberField.getValue()).toBe("0.1");
                });

                describe("when the user add a stake value 521 in second selection", () => {
                  beforeAll(async () => {
                    await secondSelectionStakeInputFieldSO.numberField.setValue(521);
                    await hideKeyboard();
                    await browser.waitUntilEquals(secondSelectionStakeInputFieldSO.numberField, "500");
                  });

                  it("[PRPI-3468] the notification 'Odds have changed' should be displayed", async () => {
                    expect(await placePanelAlertSO.message.getText()).toBe("Odds have changed");
                  });

                  it("[PRPI-3468] the size value should be updated to 500", async () => {
                    expect(await secondSelectionStakeInputFieldSO.numberField.getValue()).toBe("500");
                  });

                  describe("when  the user taps on 'Accept changes and place bet' and he taps on place button ", () => {
                    beforeAll(async () => {
                      await mockService.mockHttpRequest(getPlaceBet(FIRST_PLACE_SUCCESS));
                      await sportsbookPlacePanelSO.place.click();
                      await browser.waitUntilDisplayed(receiptPanelSO.element, "Receipt was not displayed");
                    });

                    it("[PRPI-3468] the receipt should be displayed", async () => {
                      expect(await receiptPanelSO.element.isDisplayed()).toBe(true);
                    });

                    it("[PRPI-3468] the bet should be successfully placed", async () => {
                      expect(await receiptTitleSO.label.getText()).toBe("Bet Placed");
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
