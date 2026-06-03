const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const mockService = new MockService();
const { swipeUpElement, hideKeyboard } = require("../../../../../helpers/gestures");

const {
  MinimizedSO,
  SportsbookPlacePanelSO,
  PromoButtonSO,
  SportsbookReceiptPanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  BetLegsSO,
  CardSO,
  InlineSportsbookMarketSO,
  FixedNumberInputFieldSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  BetControlsSO,
  CurrencyNumberInputFieldSO,
  BetSelectionDetailsSO,
  BetSelectionsSO,
  BetSegmentsSO,
  PrimaryButtonSO,
  OddsSO,
  PNLAndWhatIfSO,
} = require("../../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const secondCardSO = new CardSO(genericScreenSO.cards[1]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const secondSportsbookMarketSO = new InlineSportsbookMarketSO(secondCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(secondSportsbookMarketSO.sbkBetButtons[0]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();

const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const sportsbookMultiplesControlsSO = new BetControlsSO(sportsbookPlacePanelSO.collapsableSections[0]);
const multipleStakeInputFieldSO = new CurrencyNumberInputFieldSO(sportsbookMultiplesControlsSO.currencyInput);
const singlesCardSO = new SinglesCardSO();
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);

const firstSingleOddsInputFieldSO = new FixedNumberInputFieldSO(firstSingleControlsSO.fixedInput);
const firstSinglePromoButtonSO = new PromoButtonSO(firstSingleControlsSO.freeBetsButton);
const firstSingleStakeInputFieldSO = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const firstSingleReturnValuesSO = new PNLAndWhatIfSO(firstSingleControlsSO.returnsValueContainer);
const multiplesBetLegsSO = new BetLegsSO();
const firstSelectionPlaceMultipleCompositionSO = new BetSelectionDetailsSO(multiplesBetLegsSO.selections[0]);
const secondSelectionPlaceMultipleCompositionSO = new BetSelectionDetailsSO(multiplesBetLegsSO.selections[1]);
const firstSelectionPlaceMultipleCompositionOddsSO = new OddsSO(firstSelectionPlaceMultipleCompositionSO.element);
const secondSelectionPlaceMultipleCompositionOddsSO = new OddsSO(secondSelectionPlaceMultipleCompositionSO.element);
const primaryButtonSO = new PrimaryButtonSO();

const receiptPanelSO = new SportsbookReceiptPanelSO();
const receiptSingleSegmentsSO = new BetSegmentsSO(receiptPanelSO.singles[0]);
const receiptMultiplesCompositionSO = new BetSelectionsSO(receiptPanelSO.element);
const firstSelectionReceiptMultiplesCompositionSO = new BetSelectionDetailsSO(
  receiptMultiplesCompositionSO.selections[0],
);
const secondSelectionReceiptMultiplesCompositionSO = new BetSelectionDetailsSO(
  receiptMultiplesCompositionSO.selections[1],
);

const EVENT_ID = "29682729";
const SECOND_EVENT_ID = "29359896";
const FIRST_MARKET_ID = "924.11111111";
const SECOND_MARKET_ID = "924.22222222";
const FIRST_SELECTION_ID = 11111;
const SECOND_SELECTION_ID = 44444;

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
            trueOdds: {
              decimalOdds: { decimalOdds: 1.1 },
            },
            decimalDisplayOdds: { decimalOdds: 1.1 },
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
    eventId: EVENT_ID,
    name: "Wolves v Man Utd",
    competition: { urn: "ppb:competition:1234561", name: "English Premier League" },
  },
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
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Wolves v Man Utd",
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
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${FIRST_SELECTION_ID}`,
                          selectionId: FIRST_SELECTION_ID,
                          name: "Wolves",
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
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Wolves v Man Utd",
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
                      name: "Half Time",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:${SECOND_EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/${SECOND_SELECTION_ID}`,
                          selectionId: SECOND_SELECTION_ID,
                          name: "Wolves",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Wolves1",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                          selectionId: 2,
                          name: "Wolves2",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/3`,
                          selectionId: 3,
                          name: "Wolves3",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/${SECOND_SELECTION_ID}`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${SECOND_MARKET_ID}/3`,
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

const FIRST_RUNNER = { marketId: FIRST_MARKET_ID, selectionId: FIRST_SELECTION_ID };
const SECOND_RUNNER = { marketId: SECOND_MARKET_ID, selectionId: SECOND_SELECTION_ID };

const FIRST_SINGLE_MOCK = {
  legCombinations: [{ runners: [FIRST_RUNNER] }],
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
      {
        id: "5678",
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
  runner: FIRST_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [{ runners: [SECOND_RUNNER] }],
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

const SECOND_SINGLE_ODDS_MOCK = {
  runner: SECOND_RUNNER,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    decimalDisplayOdds: { decimalOdds: 1.1 },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const DOUBLE_MOCK = {
  betCombinations: [
    FIRST_SINGLE_MOCK,
    SECOND_SINGLE_MOCK,
    {
      betType: "DOUBLE",
      legCombinations: [],
      betMinStake: 0.12,
      betMaxStake: 1000,
      averageOdds: 1.1,
      winAverageOdds: 1.1,
      betMinStakeIncrement: 0.01,
      winAvgOdds: {
        decimalDisplayOdds: {
          decimalOdds: 2.4,
        },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.4 },
        },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
  ],

  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
];

const SINGLE_MOCK = { betCombinations: [FIRST_SINGLE_MOCK], runnerOdds: [FIRST_SINGLE_ODDS_MOCK] };

const SPB_MOCK = {
  result: [
    {
      betModifiers: ["PRICE_BOOST"],
      runners: [{ runner: FIRST_RUNNER }],
      legs: [
        {
          leg: { betRunners: [{ runner: FIRST_RUNNER }] },
          winOdds: { decimalDisplayOdds: { decimalOdds: 2.2 } },
        },
      ],

      totalStake: 0.12,
      totalPotentialWin: 0.26,
      betPrice: { decimalDisplayOdds: { decimalOdds: 2.2 } },
      originalTotalPotentialWin: 0.13,
      originalBetPrice: { decimalDisplayOdds: { decimalOdds: 1.1 } },
    },
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2.4 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      betType: "DOUBLE",
      runners: [
        {
          runner: FIRST_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          runner: SECOND_RUNNER,
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: FIRST_RUNNER }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: SECOND_RUNNER }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalStake: 0.14,
      totalPotentialWin: 0.34,
    },
  ],
};

describe("Sportsbook My Odds Boost - multiple and single", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
  });

  describe("when the user adds two selections to betslip", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilDisplayed(
        sportsbookPlacePanelSO.element,
        "Sportsbook single place panel element was not displayed",
      );
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await browser.waitUntilDisplayed(minimizedSO.element, "Minimized Betslip was not displayed");
      await swipeUpElement(firstRunnerSO.element);
      await browser.waitUntilDisplayed(secondRunnerSO.element);
      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await secondRunnerSO.element.click();
      await browser.waitUntilEquals(minimizedSO.counter, "2");
      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook place panel was not displayed");
    });

    describe("and when he inserts a 0.14 stake on multiple", () => {
      beforeAll(async () => {
        await multipleStakeInputFieldSO.setValue(0.14);
        await hideKeyboard();
        await browser.waitUntilEquals(multipleStakeInputFieldSO.numberField, "0.14");
      });

      describe("and when he clicks on MYOB button and inserts a 0.12 stake on first single", () => {
        beforeAll(async () => {
          await swipeUpElement(multipleStakeInputFieldSO.element, 200);
          await browser.waitUntilDisplayed(firstSinglePromoButtonSO.element);
          await firstSinglePromoButtonSO.element.click();
          await firstSingleStakeInputFieldSO.setValue(0.12);
          await hideKeyboard();
          await browser.waitUntilEquals(firstSingleStakeInputFieldSO.numberField, "0.12");
          await browser.waitUntilEquals(firstSingleOddsInputFieldSO.previousValue, "1.1");
        });

        it("[PRPI-3445] the previous odds of the single should be 1.1", async () => {
          expect(await firstSingleOddsInputFieldSO.previousValue.getText()).toBe("1.1");
        });

        it("[PRPI-3446] the current odds of the single should be 2.2", async () => {
          expect(await firstSingleOddsInputFieldSO.numberField.getValue()).toBe("2.2");
        });

        it("[PRPI-3445] the previous returns of the single should be $0.13 and the current returns should be $0.26", async () => {
          expect(await firstSingleControlsSO.returnsLabel.getText()).toBe("Returns ");
          expect(await firstSingleReturnValuesSO.previousPnl.getText()).toBe("$0.13");
          expect(await firstSingleReturnValuesSO.pnl.getText()).toBe("$0.26");
        });

        it("[PRPI-3447] the odds on accordion should be the previous ones in both selections", async () => {
          expect(await firstSelectionPlaceMultipleCompositionOddsSO.odds.getText()).toBe("1.1");
          expect(await secondSelectionPlaceMultipleCompositionOddsSO.odds.getText()).toBe("1.1");
        });

        describe("when the user clicks on place button", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
            await primaryButtonSO.element.click();
            await browser.waitUntilEquals(receiptSingleSegmentsSO.leftSegment, "Odds 1.1 2.2");
          });

          it("[PRPI-3448] the receipt should be displayed", async () => {
            expect(await receiptPanelSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-3448] the previous odds of the single should be 1.1 and the current should be 2.2", async () => {
            expect(await receiptSingleSegmentsSO.leftSegment.getText()).toBe("Odds 1.1 2.2");
          });

          it("[PRPI-3448] the previous returns of the single should be $0.13 and the current should be $0.26", async () => {
            expect(await receiptSingleSegmentsSO.rightSegment.getText()).toBe("Returns $0.13 $0.26");
          });

          it("[PRPI-3448] the odds on accordion should be the previous ones in both selections", async () => {
            expect(await firstSelectionReceiptMultiplesCompositionSO.odd.getText()).toBe("1.1");
            expect(await secondSelectionReceiptMultiplesCompositionSO.odd.getText()).toBe("1.1");
          });
        });
      });
    });
  });
});
