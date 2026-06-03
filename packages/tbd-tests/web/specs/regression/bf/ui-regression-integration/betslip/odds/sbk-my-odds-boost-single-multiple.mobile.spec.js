const {
  AppPO,
  MinimizedPO,
  EventPagePO,
  SportsbookReceiptPanelPO,
  SinglesCardPO,
  SinglePO,
  BetLegsPO,
  HeaderPO,
  RunnerPO,
  CardPO,
  SportsbookMarketPO,
  FixedNumberInputFieldPO,
  BetslipDrawerPO,
  BetControlsPO,
  PrimaryButtonPO,
  CurrencyNumberInputFieldPO,
  BetSelectionDetailsPO,
  BetSelectionsPO,
  BetSegmentsPO,
  OddsPO,
  PNLAndWhatIfPO,
  SportsbookPlacePanelPO,
  PromoButtonPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  GenerosityWalletPO,
} = require("../../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const secondCardPO = new CardPO(eventPagePO.markets[1]);
const firstSportsbookMarketPO = new SportsbookMarketPO(firstCardPO.sportsbookMarket);
const secondSportsbookMarketPO = new SportsbookMarketPO(secondCardPO.sportsbookMarket);
const firstMarketRunnerSportsbookPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketRunnerSportsbookPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);
const sportsbookMinimizedBetslipPO = new MinimizedPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const sportsbookMultiplesControlsPO = new BetControlsPO(sportsbookPlacePanelPO.collapsableSections[0]);
const betslipDrawerPO = new BetslipDrawerPO();
const multiplesBetLegsPO = new BetLegsPO();
const firstSelectionPlaceMultipleCompositionPO = new BetSelectionDetailsPO(multiplesBetLegsPO.selections[0]);
const secondSelectionPlaceMultipleCompositionPO = new BetSelectionDetailsPO(multiplesBetLegsPO.selections[1]);
const singlesCardPO = new SinglesCardPO();
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.element);
const primaryButtonPO = new PrimaryButtonPO();
const headerPO = new HeaderPO();
const multipleStakeInputFieldPO = new CurrencyNumberInputFieldPO(sportsbookMultiplesControlsPO.currencyInput);
const firstSingleOddsInputFieldPO = new FixedNumberInputFieldPO(firstSingleControlsPO.fixedInput);
const firstSingleStakeInputFieldPO = new CurrencyNumberInputFieldPO(firstSingleControlsPO.currencyInput);

const firstSingleGenerosityButtonPO = new PromoButtonPO(firstSingleControlsPO.generosityWalletButton);
const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();
const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const firstSingleReturnValues = new PNLAndWhatIfPO(firstSingleControlsPO.returnsValueContainer);

const receiptPanelPO = new SportsbookReceiptPanelPO();
const receiptSingleSegmentsPO = new BetSegmentsPO(receiptPanelPO.singles[0]);
const receiptSingleOddsSegment = new OddsPO(receiptSingleSegmentsPO.leftValue);
const receiptSingleReturnsSegments = new PNLAndWhatIfPO(receiptSingleSegmentsPO.rightValue);
const receiptMultiplesCompositionPO = new BetSelectionsPO(receiptPanelPO.element);
const firstSelectionReceiptMultiplesCompositionPO = new BetSelectionDetailsPO(
  receiptMultiplesCompositionPO.selections[0],
);
const secondSelectionReceiptMultiplesCompositionPO = new BetSelectionDetailsPO(
  receiptMultiplesCompositionPO.selections[1],
);

const mockService = new MockService();

const EVENT_ID = "29359895";

const TOKENS = [
  { id: 20000000001, amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" },
  { id: 20000000002, amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.11111111",
      runnerDetails: [
        {
          selectionId: "11111",
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
      marketId: "924.22222222",
      runnerDetails: [
        {
          selectionId: "44444",
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
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Wolves v Man Utd",
  },
  edges: [
    {
      node: {
        urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`,
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
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.11111111/11111",
                  selectionId: 11111,
                  name: "Wolves",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.11111111/11111" }],
          },
        },
      },
    },
    {
      node: {
        urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`,
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
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.22222222/44444",
                  selectionId: 44444,
                  name: "Wolves",
                },
              ],
            },
            runners: [{ runnerURN: "ppb:sbkRunner:924.22222222/44444" }],
          },
        },
      },
    },
  ],

  partialEdges: [
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`, __typename: "MarketCard" } },
    { node: { urn: `ppb:tbd:card:${EVENT_ID}##HALF_TIME`, __typename: "MarketCard" } },
  ],
};

const FIRST_RUNNER = { marketId: "924.11111111", selectionId: 11111 };

const SECOND_RUNNER = { marketId: "924.22222222", selectionId: 44444 };

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
    priceBoostTokens: TOKENS.map(({ id, amount }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      generosity: amount,
      boostPrice: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 2.2,
        },
        fractionalDisplayOdds: {
          numerator: 1,
          denominator: 2,
        },
      },
      maxStake: 10,
    })),
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
  { amount: "2.00", walletName: "BOOST_TOKENS" },
  { amount: "0.00", walletName: "SPORTSBOOK_BONUS_WAGERING" },
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

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: TOKENS.map(({ id, amount, expirationDate }) => ({
          node: {
            __typename: "ExtraWalletCard",
            urn: `ppb:tbd:card:extraWalletCard:${id}#1`,
            badges: [],
            extraWallet: {
              __typename: "ExtraWallet",
              urn: `ppb:extraWallet:${id}`,
              walletId: `${id}`,
              indexedId: `${id}#1`,
              amount,
              expirationDate,
              walletType: "PRICE_BOOST_TOKEN",
            },
            restrictions: {
              __typename: "WalletRestrictions",
              single: "false",
              acca: "false",
              sameGameMulti: "false",
            },
          },
          __typename: "ExtraWalletCardGroupEdge",
        })),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

describe("Sportsbook My Odds Boost - multiple and single", () => {
  describe("when the user adds two selections to betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, {
          PRICE_BOOST_OFFERS: { isActive: true },
        }),
      );
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));

      await browser.waitUntil(AppPO.sportsbookRunnerBetButtonHasPrice({ market: eventPagePO.markets[0], price: 1.1 }));
      await browser.waitUntil(async () => (await headerPO.balanceLabel.getText()) === "$25.00");
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
      await firstMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "First selection hasn't been added");

      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(sportsbookMinimizedBetslipPO.counter, "Betslip was not minimized");

      await secondMarketRunnerSportsbookPO.sportsbookBetButton.scrollIntoView();
      await browser.waitUntilDisplayed(secondMarketRunnerSportsbookPO.sportsbookBetButton, "Bet button is not visible");

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.waitForClickable();
      await secondMarketRunnerSportsbookPO.sportsbookBetButton.click();
      await browser.waitUntil(async () => (await sportsbookMinimizedBetslipPO.title.getText()).includes("Double"), {
        timeoutMsg: "Combinable selection wasn't added",
      });

      await sportsbookMinimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Place panel is not displayed");
    });

    describe("and when he inserts a 0.14 stake on multiple", () => {
      beforeAll(async () => {
        await multipleStakeInputFieldPO.element.waitForClickable();
        await multipleStakeInputFieldPO.element.click();

        await multipleStakeInputFieldPO.setValue("0.14");
      });

      describe("and when he clicks on MYOB button and inserts a 0.12 stake on first single", () => {
        beforeAll(async () => {
          await firstSingleGenerosityButtonPO.element.waitForClickable();
          await firstSingleGenerosityButtonPO.element.click();
          await firstExtraWalletCardPO.element.click();
          await generosityWalletApplyButtonPO.element.click();

          await browser.waitUntilAttributeContains(
            firstSingleGenerosityButtonPO.element,
            "class",
            PromoButtonPO.states.selected,
          );
          await firstSingleStakeInputFieldPO.element.waitForClickable();
          await firstSingleStakeInputFieldPO.element.click();
          await firstSingleStakeInputFieldPO.setValue("0.12");
          await browser.waitUntilEquals(firstSingleOddsInputFieldPO.previousValue, "1.1");
        });

        it("[PRPI-8033] the previous odds of the single should be 1.1", async () => {
          expect(await firstSingleOddsInputFieldPO.previousValue.getText()).toBe("1.1");
        });

        it("[PRPI-8034] the current odds of the single should be 2.2", async () => {
          expect(await firstSingleOddsInputFieldPO.numberField.getValue()).toBe("2.2");
        });

        it("[PRPI-8035] the previous returns of the single should be $0.13 and the current returns should be $0.26 ", async () => {
          expect(await firstSingleControlsPO.returnsLabel.getText()).toBe("Returns");
          expect(await firstSingleReturnValues.previousPnl.getText()).toBe("$0.13");
          expect(await firstSingleReturnValues.pnl.getText()).toBe("$0.26");
        });

        it("[PRPI-8036] the odds on accordion should be the previous ones in both selections", async () => {
          expect(await firstSelectionPlaceMultipleCompositionPO.odd.getText()).toBe("1.1");
          expect(await secondSelectionPlaceMultipleCompositionPO.odd.getText()).toBe("1.1");
        });

        describe("when the user clicks on place button", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
            await primaryButtonPO.element.waitForClickable();
            await primaryButtonPO.element.click();
            await browser.waitUntilEquals(receiptSingleOddsSegment.previousValue, "1.1");
          });

          it("[PRPI-3448] the receipt should be displayed", async () => {
            expect(await receiptPanelPO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-3448] the previous odds of the single should be 1.1", async () => {
            expect(await receiptSingleOddsSegment.previousValue.getText()).toBe("1.1");
          });

          it("[PRPI-3448] the current odds of the single should be 2.2", async () => {
            expect(await receiptSingleOddsSegment.value.getText()).toBe("2.2");
          });

          it("[PRPI-3448] the previous returns of the single should be $0.13", async () => {
            expect(await receiptSingleReturnsSegments.previousPnl.getText()).toBe("$0.13");
          });

          it("[PRPI-3448] the current returns of the single should be $0.26", async () => {
            expect(await receiptSingleReturnsSegments.pnl.getText()).toBe("$0.26");
          });

          it("[PRPI-3448] the odds on accordion should be the previous ones in both selections", async () => {
            expect(await firstSelectionReceiptMultiplesCompositionPO.odd.getText()).toBe("1.1");
            expect(await secondSelectionReceiptMultiplesCompositionPO.odd.getText()).toBe("1.1");
          });
        });
      });
    });
  });
});
