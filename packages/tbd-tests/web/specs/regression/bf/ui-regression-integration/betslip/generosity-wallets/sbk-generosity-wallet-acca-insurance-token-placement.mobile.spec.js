const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  SPB: { getPlaceBet },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");
const OneLineMultiplePO = require("@ppb/tbd-shared/components/Betslip/OneLineMultiple/OneLineMultiple.web.po");
const {
  AlertPO,
  GenerosityWalletPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  OptionPO,
  AppPO,
  EventPagePO,
  SportsbookMarketPO,
  RunnerPO,
  BetslipDrawerPO,
  MinimizedPO,
  SportsbookPlacePanelPO,
  BetControlsPO,
  PromoButtonPO,
  PrimaryButtonPO,
  AccaInsurancePO,
  BetLegsPO,
  BetSelectionDetailsPO,
  SportsbookReceiptPanelPO,
  CurrencyNumberInputFieldPO,
} = require("../../../../../../page-objects");
const routes = require("../../../../../../../utils/routes");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../../mock-essentials/controllers/fonts/fonts-controller");

const mockService = new MockService(browser);

const eventPagePO = new EventPagePO();

const firstSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[0]);
const secondSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[1]);

const firstMarketFirstRunnerPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketFirstRunnerPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);

const betslipDrawerPO = new BetslipDrawerPO();
const minimizedBetslipPO = new MinimizedPO();

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);
const oneLineMultiplePO = new OneLineMultiplePO(sportsbookPlacePanelPO.element);
const multipleBetSelectionsPO = new BetLegsPO(oneLineMultiplePO.element);
const secondSelectionDetailsPO = new BetSelectionDetailsPO(multipleBetSelectionsPO.selections[1]);

const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.collapsableSections[0]);
const stakePO = new CurrencyNumberInputFieldPO(multipleControlsPO.currencyInput);
const multipleGenerosityWalletButtonPO = new PromoButtonPO(multipleControlsPO.generosityWalletButton);
const multipleGenerosityWalletAlertPO = new AlertPO(multipleControlsPO.generosityAlertMessage);
const accaInsurancePO = new AccaInsurancePO(multipleControlsPO.accaInsurance);
const accaInsuranceOptionPO = new OptionPO(accaInsurancePO.element);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();
const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);

const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const multipleFreeBetsWalletsAlertPO = new AlertPO(sportsbookReceiptPanelPO.multiples[0]);

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const MARKET_ID_2 = "924.33333333";

const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;
const SELECTION_ID_4 = 44444;
const SELECTION_ID_5 = 55555;
const SELECTION_ID_6 = 66666;

const TOKENS = [
  {
    id: "1235",
    amount: 0,
    walletType: "ACCA_INSURANCE_TOKEN",
    lostLegs: 1,
    maxReturn: 10,
    expirationDate: "2019-06-30T10:50:00.000Z",
  },
  {
    id: "1236",
    amount: 0,
    walletType: "ACCA_INSURANCE_TOKEN",
    lostLegs: 1,
    maxReturn: 20,
    expirationDate: "2019-07-01T10:50:00.000Z",
  },
];

const BFF_EVENT_PAGE_MOCK = {
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
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS`,
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_1}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_2}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_3}`,
              },
            ],

            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID_1}`,
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
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_1}`,
                  selectionId: SELECTION_ID_1,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_2}`,
                  selectionId: SELECTION_ID_2,
                  name: "The Draw",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_1}/${SELECTION_ID_3}`,
                  selectionId: SELECTION_ID_3,
                  name: "Man Utd",
                },
              ],
            },
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS_V2`,
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            runners: [
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_4}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_5}`,
              },
              {
                runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_6}`,
              },
            ],

            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${MARKET_ID_2}`,
              noLiveData: true,
              name: "Match Odds V2",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  name: "Wolves v Man Utd",
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_4}`,
                  selectionId: SELECTION_ID_4,
                  name: "Wolves V2",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_5}`,
                  selectionId: SELECTION_ID_5,
                  name: "The Draw V2",
                },
                {
                  runnerURN: `ppb:sbkRunner:${MARKET_ID_2}/${SELECTION_ID_6}`,
                  selectionId: SELECTION_ID_6,
                  name: "Man Utd V2",
                },
              ],
            },
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS`,
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS_V2`,
      },
    },
  ],
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [
    {
      __typename: "ExtraWalletCardGroup",
      urn: "ppb:tbd:cardgroup:extraWalletCardGroup:extraWallets",
      amount: 0.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: TOKENS.map(({ id, amount, expirationDate, walletType, lostLegs, maxReturn }) => {
          const newId = `${id}#1`;
          return {
            node: {
              __typename: "ExtraWalletCard",
              urn: `ppb:tbd:card:extraWalletCard:${newId}`,
              badges: [],
              extraWallet: {
                __typename: "ExtraWallet",
                urn: `ppb:extraWallet:${newId}`,
                walletId: newId,
                indexedId: newId,
                amount,
                expirationDate,
                walletType,
                lostLegs,
                maxReturn,
              },
              restrictions: {
                __typename: "WalletRestrictions",
                single: "false",
                acca: "false",
                sameGameMulti: "false",
              },
            },
            __typename: "ExtraWalletCardGroupEdge",
          };
        }),
        __typename: "ExtraWalletCardGroupConnection",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID_1,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_1,
        },
      ],
    },
    {
      marketId: MARKET_ID_1,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_2,
        },
      ],
    },
    {
      marketId: MARKET_ID_1,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_3,
        },
      ],
    },
    {
      marketId: MARKET_ID_2,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_4,
        },
      ],
    },
    {
      marketId: MARKET_ID_2,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_5,
        },
      ],
    },
    {
      marketId: MARKET_ID_2,
      runnerDetails: [
        {
          runnerOdds: {
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
            decimalDisplayOdds: { decimalOdds: 1.1 },
          },
          selectionId: SELECTION_ID_6,
        },
      ],
    },
  ],
};

const SINGLE_BET_COMBINATION_MARKET_1 = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID_1,
          selectionId: SELECTION_ID_1,
        },
      ],
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  hasBonusMoney: true,
};

const SINGLE_BET_COMBINATION_MARKET_2 = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID_2,
          selectionId: SELECTION_ID_4,
        },
      ],
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  hasBonusMoney: true,
};

const DOUBLE_BET_COMBINATION_MARKET_1_2_ACCA_INSURANCE_OFFER = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID_1,
          selectionId: SELECTION_ID_1,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
    {
      runners: [
        {
          marketId: MARKET_ID_2,
          selectionId: SELECTION_ID_4,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  combinationGroup: 1,
  isSGM: true,
  features: ["SGM"],
  hasBonusMoney: true,
  accaInsuranceOffer: {
    decimalDisplayOdds: {
      decimalOdds: 2,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
  },
  betType: "DOUBLE",
};

const DOUBLE_BET_COMBINATION_MARKET_1_2_ACCA_INSURANCE_TOKENS = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID_1,
          selectionId: SELECTION_ID_1,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
    {
      runners: [
        {
          marketId: MARKET_ID_2,
          selectionId: SELECTION_ID_4,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  winAverageOdds: 1.2,
  winAvgOdds: {
    decimalDisplayOdds: { decimalOdds: 1.2 },
    trueOdds: {
      decimalOdds: { decimalOdds: 1.2 },
    },
  },
  averageOdds: 1.2,
  combinationGroup: 1,
  isSGM: true,
  features: ["SGM"],
  hasBonusMoney: true,
  accaInsuranceOffer: {
    decimalDisplayOdds: {
      decimalOdds: 2,
    },
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
  },
  tokens: {
    accaInsuranceTokens: TOKENS.map(({ id, maxReturn, lostLegs, expirationDate }) => ({
      id: `${id}`,
      numberOfTokens: 1,
      amount: maxReturn,
      numberOfLegs: lostLegs,
      expirationDate,
      betBuildersRestricted: false,
      spApplicable: true,
    })),
  },
  betType: "DOUBLE",
};

const FIRST_SELECTION_ODDS = {
  runner: {
    marketId: MARKET_ID_1,
    selectionId: SELECTION_ID_1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const FOURTH_SELECTION_ODDS = {
  runner: {
    marketId: MARKET_ID_2,
    selectionId: SELECTION_ID_4,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 1.1 },
    },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
};

const SIB_MOCK_1_RUNNER = {
  betCombinations: [SINGLE_BET_COMBINATION_MARKET_1],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS],
};

const SIB_MOCK_2_RUNNERS_ACCA_INSURANCE_OFFER = {
  betCombinations: [
    DOUBLE_BET_COMBINATION_MARKET_1_2_ACCA_INSURANCE_OFFER,
    SINGLE_BET_COMBINATION_MARKET_1,
    SINGLE_BET_COMBINATION_MARKET_2,
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS, FOURTH_SELECTION_ODDS],
};

const SIB_MOCK_2_RUNNERS_ACCA_INSURANCE_TOKENS = {
  betCombinations: [
    DOUBLE_BET_COMBINATION_MARKET_1_2_ACCA_INSURANCE_TOKENS,
    SINGLE_BET_COMBINATION_MARKET_1,
    SINGLE_BET_COMBINATION_MARKET_2,
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS, FOURTH_SELECTION_ODDS],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runners: [
        {
          runner: { marketId: MARKET_ID_1, selectionId: SELECTION_ID_1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          runner: { marketId: MARKET_ID_2, selectionId: SELECTION_ID_4 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID_1, selectionId: SELECTION_ID_1 } }],
            edgeContexts: [
              {
                tokenId: "1235#1",
                edge: "ACCA_INSURANCE",
              },
            ],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID_2, selectionId: SELECTION_ID_4 } }],
            edgeContexts: [
              {
                tokenId: "1235#1",
                edge: "ACCA_INSURANCE",
              },
            ],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      totalStake: 2,
      totalPotentialWin: 0.5,
    },
  ],
};

describe("Sportsbook Generosity Wallet - Acca Insurance Tokens vs ACCA Edge", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_EVENT_PAGE_MOCK.urn, {
        FREE_BETS_WALLET: { isActive: true },
        date: "2019-06-26T09:00:00.000Z",
      }),
    );
    await mockService.mockHttpRequest(
      getWallets([
        { amount: "5.00", walletName: "MAIN" },
        { amount: "2.00", walletName: "ACCA_INSURANCE_TOKENS" },
      ]),
    );
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_2_RUNNERS_ACCA_INSURANCE_OFFER));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("When the user adds a double with acca insurance offer (ACCA Edge) to the betslip", () => {
    beforeAll(async () => {
      // Add First Selection
      await firstMarketFirstRunnerPO.sportsbookBetButton.waitForClickable();
      await firstMarketFirstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook single betslip not displayed");

      // Minimize the betslip
      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedBetslipPO.element, "Sportsbook minimized betslip not displayed");

      // Add Second Selection
      await secondMarketFirstRunnerPO.sportsbookBetButton.waitForClickable();
      await secondMarketFirstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(minimizedBetslipPO.counter, "2", "Second Selection not added to betslip");

      // Expand the betslip
      await minimizedBetslipPO.element.waitForClickable();
      await minimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook betslip not expanded");
    });

    it("[PRPI-4728] should display the betslip with the double with the acca edge option below unselected", async () => {
      expect(await accaInsurancePO.element.isDisplayed()).toBe(true);
      expect(await accaInsuranceOptionPO.input.isSelected()).toBe(false);
    });
  });

  describe("and then the user adds a new double to the betslip, now with both acca insurance tokens and acca insurance offer", () => {
    beforeAll(async () => {
      // Remove first selection
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
      await secondSelectionDetailsPO.removeButton.waitForClickable();
      await secondSelectionDetailsPO.removeButton.click();

      // Minimize the betslip
      await betslipDrawerPO.header.waitForClickable();
      await betslipDrawerPO.header.click();
      await browser.waitUntilDisplayed(minimizedBetslipPO.element, "Sportsbook minimized betslip not displayed");

      // Add Second Selection again
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_2_RUNNERS_ACCA_INSURANCE_TOKENS));
      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
      await secondMarketFirstRunnerPO.sportsbookBetButton.waitForClickable();
      await secondMarketFirstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilEquals(minimizedBetslipPO.counter, "2", "Second Selection not added to betslip");

      // Expand the betslip
      await minimizedBetslipPO.element.waitForClickable();
      await minimizedBetslipPO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook betslip not expanded");
    });

    it("[PRPI-4729] should display the betslip with the double with the promo button available and unselected and no acca insurance offer (ACCA Edge) available", async () => {
      expect(await multipleGenerosityWalletButtonPO.element.isDisplayed()).toBe(true);
      expect(await browser.containsClass(multipleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected)).toBe(
        false,
      );

      expect(await accaInsurancePO.element.isDisplayed()).toBe(false);
    });

    describe("And then the user selects an acca insurance token and applies it to the betslip", () => {
      beforeAll(async () => {
        // Open Generosity Wallet
        await multipleGenerosityWalletButtonPO.element.waitForClickable();
        await multipleGenerosityWalletButtonPO.element.click();

        // Select first Acca Insurance Token
        await firstExtraWalletCardPO.element.waitForClickable();
        await firstExtraWalletCardPO.element.click();

        // Apply the selected token
        await generosityWalletApplyButtonPO.element.waitForClickable();
        await generosityWalletApplyButtonPO.element.click();
        await browser.waitUntilNotDisplayed(extraWalletCardGroupPO.element, "Generosity Wallets are still displayed");
      });

      it("[PRPI-4730] should display the promo button selected and should be displayed the alert message with 'If 1 leg lets you down, get up to $10.00 in Free Bets'", async () => {
        expect(
          await browser.containsClass(multipleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
        ).toBe(true);
        expect(await multipleGenerosityWalletAlertPO.message.getText()).toBe(
          "If 1 leg lets you down, get up to $10.00 in Free Bets",
        );
      });

      describe("and then the user adds a stake and places the bet", () => {
        beforeAll(async () => {
          await stakePO.numberField.waitForClickable();
          await stakePO.numberField.click();
          await stakePO.setValue("2");

          await placeButtonPO.element.waitForClickable();
          await placeButtonPO.element.click();
          await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);
        });

        it("[PRPI-4730] should display the generosity alert with 'Second Chance Applied' message on the receipt with no remove action", async () => {
          expect(await multipleFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
          expect(await multipleFreeBetsWalletsAlertPO.actionLink.isDisplayed()).toBe(false);
          expect(await multipleFreeBetsWalletsAlertPO.message.getText()).toBe("Second Chance Applied");
        });
      });
    });
  });
});
