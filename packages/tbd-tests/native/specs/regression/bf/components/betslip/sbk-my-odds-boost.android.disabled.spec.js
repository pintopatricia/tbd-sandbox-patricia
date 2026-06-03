const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard } = require("../../../../../helpers/gestures");

const { startApp } = require("../../../../../helpers/urls");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  MinimizedSO,
  PromoButtonSO,
  SportsbookPlacePanelSO,
  SportsbookReceiptPanelSO,
  BetSportsbookReceiptSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  CurrencyNumberInputFieldSO,
  FixedNumberInputFieldSO,
  BetSegmentsSO,
  BetControlsSO,
  OptionSO,
  OddsSO,
  PNLAndWhatIfSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[1]);
const thirdRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[2]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const secondSingleControlsSO = new BetControlsSO(secondSingleSO.controls);
const secondSingleReturnValuesSO = new PNLAndWhatIfSO(secondSingleControlsSO.returnsValueContainer);

const thirdSingleSO = new SingleSO(singlesCardSO.singles[2]);
const thirdSingleControlsSO = new BetControlsSO(thirdSingleSO.controls);

const firstSingleOddsInputField = new FixedNumberInputFieldSO(firstSingleControlsSO.fixedInput);
const firstSingleStakeInputField = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const firstSingleFreeBetsButton = new PromoButtonSO(firstSingleControlsSO.freeBetsButton);

const secondSingleStakeInputField = new CurrencyNumberInputFieldSO(secondSingleControlsSO.currencyInput);
const secondSingleFreeBetsButton = new PromoButtonSO(secondSingleControlsSO.freeBetsButton);

const thirdSingleStakeInputField = new CurrencyNumberInputFieldSO(thirdSingleControlsSO.currencyInput);
const thirdSingleFreeBetsButton = new PromoButtonSO(thirdSingleControlsSO.freeBetsButton);

const receiptPanel = new SportsbookReceiptPanelSO();
const receiptSingleSegments = new BetSegmentsSO(receiptPanel.singles[0]);
const receiptSingleOdds = new OddsSO(receiptSingleSegments.leftSegment);
const receiptSingleReturns = new PNLAndWhatIfSO(receiptSingleSegments.rightSegment);
const receiptSingleReceipt = new BetSportsbookReceiptSO(receiptPanel.singles[0]);
const oddsBoostSO = new OptionSO(receiptSingleReceipt.bonuses[0]);

const secondReceiptSingleReceipt = new BetSportsbookReceiptSO(receiptPanel.singles[1]);
const secondOddsBoostOptionPO = new OptionSO(secondReceiptSingleReceipt.bonuses[0]);

const thirdReceiptSingleReceipt = new BetSportsbookReceiptSO(receiptPanel.singles[2]);
const thirdOddsBoostOptionPO = new OptionSO(thirdReceiptSingleReceipt.bonuses[0]);

const EVENT_TYPE_ID = 1;
const EVENT_ID = 1;
const MARKET_ID = "924.1";
const FIRST_RUNNER = { marketId: MARKET_ID, selectionId: 1 };
const SECOND_RUNNER = { marketId: MARKET_ID, selectionId: 2 };
const THIRD_RUNNER = { marketId: MARKET_ID, selectionId: 3 };

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
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
        title: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
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
                    name: "Athletic Bilbao",
                  },
                  away: {
                    name: "Sociedad",
                  },
                },
                sportevent: {
                  name: "Athletic Bilbao v Sociedad",
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
                          name: "Athletic Bilbao v Sociedad",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Athletic Bilbao",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                          selectionId: 2,
                          name: "Sociedad",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Draw",
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
  ],
};

const HOME_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "/view/generic:home",
  edges: [...BFF_MOCK.edges],
  partialEdges: [...BFF_MOCK.partialEdges],
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
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
  tokens: {
    priceBoostTokens: [
      {
        id: "1234",
        numberOfTokens: 1,
        generosity: 2,
        boostPrice: {
          trueOdds: {
            decimalOdds: 1.2,
          },
        },
      },
    ],
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
    decimalDisplayOdds: { decimalOdds: 1.1 },
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

  betMinStake: 0.1,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
  tokens: {
    priceBoostTokens: [
      {
        id: "1234",
        numberOfTokens: 1,
        generosity: 2,
        boostPrice: {
          trueOdds: {
            decimalOdds: 1.2,
          },
        },
      },
    ],
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
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

  betMinStake: 0.1,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
  },
  tokens: {
    priceBoostTokens: [
      {
        id: "1234",
        numberOfTokens: 1,
        generosity: 2,
        boostPrice: {
          trueOdds: {
            decimalOdds: 1.2,
          },
        },
      },
    ],
  },
};

const THIRD_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 3,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: {
      decimalOdds: 1.1,
    },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const TREBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    {
      ...SECOND_SINGLE_MOCK,
      tokens: {
        priceBoostTokens: [
          {
            id: "1235",
            numberOfTokens: 1,
            generosity: 2,
            boostPrice: {
              trueOdds: {
                decimalOdds: 1.2,
              },
            },
          },
        ],
      },
    },
    THIRD_SINGLE_MOCK,
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK, THIRD_SINGLE_ODDS_MOCK],
};

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [{ runner: FIRST_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: FIRST_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2.5,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.5 } },
      originalTotalPotentialWin: 2,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
    {
      runners: [{ runner: SECOND_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: SECOND_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
  ],
};

const THREE_BETS_SPB_MOCK = {
  result: [
    {
      runners: [{ runner: FIRST_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: FIRST_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2.5,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.5 } },
    },
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [{ runner: SECOND_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: SECOND_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalTotalPotentialWin: 2,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [{ runner: THIRD_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: THIRD_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.5 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 2,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
      originalTotalPotentialWin: 2,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 2 } },
    },
  ],
};

describe("Betslip - My Odds Boost", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("with place panel opened with 2 selections", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.element);
      await firstRunnerSO.element.click();

      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Selection hasn't been added");

      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await browser.waitUntilClickableNative(secondRunnerSO.element);
      await secondRunnerSO.element.click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook place panel element");
    });

    it("[PRPI-3449] should display unselected MYOB button in each single", async () => {
      expect(await firstSingleFreeBetsButton.element.isDisplayed()).toBe(true);
      expect(await secondSingleFreeBetsButton.element.isDisplayed()).toBe(true);
    });

    describe("When user adds a stake value of 0.12 in the first selection", () => {
      beforeAll(async () => {
        await firstSingleStakeInputField.numberField.click();
        await firstSingleStakeInputField.numberField.setValue(0.12);
        await hideKeyboard();
        await browser.waitUntilEquals(firstSingleControlsSO.returns, "Returns $0.13");
      });

      it("[PRPI-3450] should have the returns value updated", async () => {
        expect(await firstSingleControlsSO.returns.getText()).toBe("Returns $0.13");
      });

      describe("And spends the only available MYOB token", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstSingleFreeBetsButton.element);
          await firstSingleFreeBetsButton.element.click();
        });

        it("[PRPI-3451] should update the odds field with the new odd", async () => {
          expect(await firstSingleOddsInputField.numberField.getText()).toBe("2.2");
        });

        it("[PRPI-3452] should display old odds", async () => {
          expect(await firstSingleOddsInputField.previousValue.getText()).toBe("1.1");
        });

        it("[PRPI-3453] should have the returns value updated", async () => {
          expect(await firstSingleControlsSO.returns.getText()).toBe("Returns $0.13 $0.26");
        });

        describe("When user unselects the MYOB button on the first selection", () => {
          beforeAll(async () => {
            await firstSingleFreeBetsButton.element.click();
            await browser.waitUntilDisplayed(
              secondSingleFreeBetsButton.element,
              "Waiting for second single price boost button to appear",
            );
          });

          it("[PRPI-3454] should display starter odd on the first selection", async () => {
            expect(await firstSingleOddsInputField.numberField.getText()).toBe("1.1");
          });

          it("[PRPI-3454] should display MYOB button on the second selection", async () => {
            expect(await secondSingleFreeBetsButton.element.isDisplayed()).toBe(true);
          });

          describe("when user clicks on place", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
              await sportsbookPlacePanelSO.place.click();
              await browser.waitUntilDisplayed(receiptPanel.element);
            });
            it("[PRPI-3455] the receipt should be displayed", async () => {
              expect(await receiptPanel.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-3455] the odds should show the old value", async () => {
              expect(await receiptSingleOdds.previousOdds.getText()).toBe("2");
            });

            it("[PRPI-3455] the odds should show the new value", async () => {
              expect(await receiptSingleOdds.odds.getText()).toBe("2.5");
            });

            it("[PRPI-3455] the returns should show the old", async () => {
              expect(await receiptSingleReturns.previousPnl.getText()).toBe("$2.00");
            });

            it("[PRPI-3455] the returns should show the new value", async () => {
              expect(await receiptSingleReturns.pnl.getText()).toBe("$2.50");
            });

            it("[PRPI-3455] the MYOB label should be 'My Bet Boost applied'", async () => {
              expect(await oddsBoostSO.title.getText()).toBe("My Bet Boost applied");
            });
          });
        });
      });
    });
  });

  describe("given the user has three selections on the Betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(TREBLE_MOCK));

      await browser.waitUntilClickableNative(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Selection hasn't been added");

      await browser.waitUntilClickableNative(secondRunnerSO.element);
      await secondRunnerSO.element.click();

      await browser.waitUntilClickableNative(thirdRunnerSO.element);
      await thirdRunnerSO.element.click();

      await browser.waitUntilEquals(minimizedSO.counter, "3");

      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook place panel element");
    });

    describe("and the user has two Price Boosts", () => {
      describe("and the first two rows have the Price Boost button selected", () => {
        beforeAll(async () => {
          await firstSingleStakeInputField.numberField.click();
          await firstSingleStakeInputField.numberField.setValue(0.12);
          await hideKeyboard();
          await firstSingleFreeBetsButton.element.click();

          await secondSingleStakeInputField.numberField.click();
          await secondSingleStakeInputField.numberField.setValue(0.12);
          await hideKeyboard();
          await secondSingleFreeBetsButton.element.click();

          await thirdSingleStakeInputField.numberField.click();
          await thirdSingleStakeInputField.numberField.setValue(0.12);
          await hideKeyboard();
        });

        it("[PRPI-3456] then the third selection has the button on the disable state and isn't clickable", async () => {
          expect(await thirdSingleFreeBetsButton.element.isDisplayed()).toBe(true);
          expect(await thirdSingleFreeBetsButton.element.isEnabled()).toBe(false);
        });
      });

      describe("when the user removes Price Boost on the first row", () => {
        beforeAll(async () => {
          await firstSingleFreeBetsButton.element.click();
        });

        it("[PRPI-3457] then on the first row I have the price boost available", async () => {
          expect(await firstSingleFreeBetsButton.element.isEnabled()).toBe(true);
        });

        it("[PRPI-3458] then on the second row I have the price boost selected", async () => {
          expect(await secondSingleControlsSO.returnsLabel.getText()).toBe("Returns ");
          expect(await secondSingleReturnValuesSO.previousPnl.getText()).toBe("$0.13");
          expect(await secondSingleReturnValuesSO.pnl.getText()).toBe("$0.26");
        });

        it("[PRPI-3459] then on the third row I have the price boost available", async () => {
          expect(await thirdSingleFreeBetsButton.element.isEnabled()).toBe(true);
        });
      });

      describe("when I select the Price Boost on the third row", () => {
        beforeAll(async () => {
          await thirdSingleFreeBetsButton.element.click();
        });

        it("[PRPI-3460] then the first selection has the Price Boost button on the disable state", async () => {
          expect(await firstSingleFreeBetsButton.element.isEnabled()).toBe(false);
        });

        it("[PRPI-3461] then the third selection has the Price Boost button selected", async () => {
          expect(await secondSingleControlsSO.returnsLabel.getText()).toBe("Returns ");
          expect(await secondSingleReturnValuesSO.previousPnl.getText()).toBe("$0.13");
          expect(await secondSingleReturnValuesSO.pnl.getText()).toBe("$0.26");
        });
      });

      describe("when I place bets", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getPlaceBet(THREE_BETS_SPB_MOCK));
          await sportsbookPlacePanelSO.place.click();
          await browser.waitUntilDisplayed(receiptPanel.element);
        });

        it("[PRPI-3462] then the first bet is placed without Price Boost", async () => {
          expect(await receiptSingleSegments.bonuses).toBeUndefined();
        });

        it("[PRPI-3463] then the second and third bets are placed with Price Boost", async () => {
          expect(await secondOddsBoostOptionPO.title.getText()).toBe("My Bet Boost applied");
          expect(await thirdOddsBoostOptionPO.title.getText()).toBe("My Bet Boost applied");
        });
      });
    });
  });
});
