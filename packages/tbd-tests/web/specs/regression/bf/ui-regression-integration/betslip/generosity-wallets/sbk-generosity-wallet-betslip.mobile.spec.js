const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");
const {
  AlertPO,
  GenerosityWalletPO,
  PebbleListPO,
  PebblePO,
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
  SinglesCardPO,
  SinglePO,
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

const multipleControlsPO = new BetControlsPO(sportsbookPlacePanelPO.collapsableSections[0]);
const multipleGenerosityWalletButtonPO = new PromoButtonPO(multipleControlsPO.generosityWalletButton);
const multipleGenerosityWalletAlertPO = new AlertPO(multipleControlsPO.generosityAlertMessage);

const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.collapsableSections[1]);
const firstSinglePO = new SinglePO(singlesCardPO.singles[0]);
const firstSingleControlsPO = new BetControlsPO(firstSinglePO.singleControls);
const firstSingleGenerosityWalletButtonPO = new PromoButtonPO(firstSingleControlsPO.generosityWalletButton);
const firstSingleGenerosityWalletAlertPO = new AlertPO(firstSingleControlsPO.generosityAlertMessage);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);
const generosityWalletFooterAlertPO = new AlertPO(generosityWalletPO.footerAlert);

const generosityWalletPebbleListPO = new PebbleListPO(generosityWalletPO.headerContent);
const secondPebblePO = new PebblePO(generosityWalletPebbleListPO.pebbles[1]);
const thirdPebblePO = new PebblePO(generosityWalletPebbleListPO.pebbles[2]);
const fourthPebblePO = new PebblePO(generosityWalletPebbleListPO.pebbles[3]);
const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();
const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);
const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);
const secondExtraWalletCardOptionPO = new OptionPO(secondExtraWalletCardPO.walletOption);
const thirdExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[2]);
const thirdExtraWalletCardOptionPO = new OptionPO(thirdExtraWalletCardPO.walletOption);
const fourthExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[3]);
const fourthExtraWalletCardOptionPO = new OptionPO(fourthExtraWalletCardPO.walletOption);
const fifthExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[4]);
const fifthExtraWalletCardOptionPO = new OptionPO(fifthExtraWalletCardPO.walletOption);
const sixthExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[5]);
const sixthExtraWalletCardOptionPO = new OptionPO(sixthExtraWalletCardPO.walletOption);

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
  { id: "1231", amount: 2, walletType: "BONUS_CASH", expirationDate: "2019-06-26T09:50:00.000Z" },
  { id: "1232", amount: 3, walletType: "BONUS_CASH", expirationDate: "2019-06-26T10:50:00.000Z" },
  { id: "1233", amount: 10, walletType: "PRICE_BOOST_TOKEN", expirationDate: "2019-06-26T12:50:00.000Z" },
  { id: "1234", amount: 10, walletType: "PRICE_BOOST_TOKEN" },
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
      amount: 5.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: TOKENS.map(({ id, amount, expirationDate, walletType, lostLegs, maxReturn }) => {
          const newId = walletType !== "BONUS_CASH" ? `${id}#1` : `${id}`;
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

// Additional cards to be filtered out by SIB when opening the Generosity Wallet
const ADDITIONAL_BFF_EXTRA_WALLET_CARDS_MOCK = [
  {
    node: {
      __typename: "ExtraWalletCard",
      urn: `ppb:tbd:card:extraWalletCard:7`,
      badges: [],
      extraWallet: {
        __typename: "ExtraWallet",
        urn: `ppb:extraWallet:7`,
        walletId: "7",
        indexedId: "7",
        amount: 10,
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
  },
  {
    node: {
      __typename: "ExtraWalletCard",
      urn: `ppb:tbd:card:extraWalletCard:8`,
      badges: [],
      extraWallet: {
        __typename: "ExtraWallet",
        urn: `ppb:extraWallet:8`,
        walletId: "8",
        indexedId: "8",
        amount: 10,
        walletType: "BONUS_CASH",
      },
      restrictions: {
        __typename: "WalletRestrictions",
        single: "false",
        acca: "false",
        sameGameMulti: "false",
      },
    },
    __typename: "ExtraWalletCardGroupEdge",
  },
  {
    node: {
      __typename: "ExtraWalletCard",
      urn: `ppb:tbd:card:extraWalletCard:9`,
      badges: [],
      extraWallet: {
        __typename: "ExtraWallet",
        urn: `ppb:extraWallet:9`,
        walletId: "9",
        indexedId: "9",
        amount: 0,
        lostLegs: 1,
        maxReturn: 10,
        walletType: "ACCA_INSURANCE_TOKEN",
      },
      restrictions: {
        __typename: "WalletRestrictions",
        single: "false",
        acca: "false",
        sameGameMulti: "false",
      },
    },
    __typename: "ExtraWalletCardGroupEdge",
  },
];

ADDITIONAL_BFF_EXTRA_WALLET_CARDS_MOCK.forEach((card) => BFF_FETCH_CARDS_MOCK.cards[0].full.edges.push(card));

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
  applicableWallets: TOKENS.filter(({ walletType }) => walletType === "BONUS_CASH").map(({ id }) => id),
  tokens: {
    priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(({ id, amount }) => ({
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
    accaInsuranceTokens: TOKENS.filter(({ walletType }) => walletType === "ACCA_INSURANCE_TOKEN").map(
      ({ id, maxReturn, lostLegs, expirationDate }) => ({
        id: `${id}`,
        numberOfTokens: 1,
        amount: maxReturn,
        numberOfLegs: lostLegs,
        expirationDate,
        betBuildersRestricted: false,
        spApplicable: true,
      }),
    ),
  },
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
  applicableWallets: TOKENS.filter(({ walletType }) => walletType === "BONUS_CASH").map(({ id }) => id),
};

const DOUBLE_BET_COMBINATION_MARKET_1_2 = {
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
  applicableWallets: TOKENS.filter(({ walletType }) => walletType === "BONUS_CASH").map(({ id }) => id),
  tokens: {
    priceBoostTokens: TOKENS.filter(({ walletType }) => walletType === "PRICE_BOOST_TOKEN").map(({ id, amount }) => ({
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
    accaInsuranceTokens: TOKENS.filter(({ walletType }) => walletType === "ACCA_INSURANCE_TOKEN").map(
      ({ id, maxReturn, lostLegs, expirationDate }) => ({
        id: `${id}`,
        numberOfTokens: 1,
        amount: maxReturn,
        numberOfLegs: lostLegs,
        expirationDate,
        betBuildersRestricted: false,
        spApplicable: true,
      }),
    ),
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
  wallets: TOKENS.filter(({ walletType }) => walletType === "BONUS_CASH").map(({ id, amount }) => ({
    walletId: id,
    amount,
    redeemable: "false",
    type: "BONUS_CASH",
  })),
};

const SIB_MOCK_2_RUNNERS = {
  betCombinations: [
    DOUBLE_BET_COMBINATION_MARKET_1_2,
    SINGLE_BET_COMBINATION_MARKET_1,
    SINGLE_BET_COMBINATION_MARKET_2,
  ],

  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS, FOURTH_SELECTION_ODDS],
  wallets: TOKENS.filter(({ walletType }) => walletType === "BONUS_CASH").map(({ id, amount }) => ({
    walletId: id,
    amount,
    redeemable: "false",
    type: "BONUS_CASH",
  })),
};

describe("Sportsbook Generosity Wallet Betslip", () => {
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
        { amount: "5.00", walletName: "SPORTSBOOK_BONUS" },
        { amount: "2.00", walletName: "BOOST_TOKENS" },
        { amount: "1.00", walletName: "ACCA_INSURANCE_TOKENS" },
      ]),
    );
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_2_RUNNERS));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("When the user adds a double to the betslip", () => {
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

    describe("And clicks on the generosity icon on the double", () => {
      beforeAll(async () => {
        // Open Generosity Wallet
        await multipleGenerosityWalletButtonPO.element.click();

        await browser.waitUntilDisplayed(generosityWalletPO.element, "Bottom sheet not displayed");
      });

      it("[PRPI-4731] should display the generosity wallet bottom sheet", async () => {
        expect(await generosityWalletPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-4732] should display the generosity wallet apply button disabled with the 'Apply' label", async () => {
        expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(false);
        expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply");
      });

      it("[PRPI-4733] should not display the bonus URL on the generosity wallet footer", async () => {
        expect(await generosityWalletFooterAlertPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-4734] should be displayed 6 from the total of 9 wallets ", async () => {
        expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(6);
      });

      describe("And then the user selects one Free Bet Wallet under the 'All' pebble", () => {
        beforeAll(async () => {
          await firstExtraWalletCardPO.element.waitForClickable();
          await firstExtraWalletCardPO.element.click();
        });

        it("[PRPI-4735] should display the first Free Bet Wallet as selected", async () => {
          expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
          expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
        });

        it("[PRPI-4736] should display the apply button enabled with the 'Apply $2.00 Free Bet' label", async () => {
          expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
          expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $2.00 Free Bet");
        });

        describe("And then the user clicks on the 'Free Bets' pebble", () => {
          beforeAll(async () => {
            await secondPebblePO.element.waitForClickable();
            await secondPebblePO.element.click();

            await browser.waitUntilContainsClass(secondPebblePO.element, PebblePO.states.active);
          });

          it("[PRPI-4737] should display the first Free Bet Wallet as still selected", async () => {
            expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
            expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
          });

          it("[PRPI-4737] should display the apply button as still enabled with the 'Apply $2.00 Free Bet' label", async () => {
            expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
            expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $2.00 Free Bet");
          });

          describe("And then the user selects another Free Bet Wallet", () => {
            beforeAll(async () => {
              await secondExtraWalletCardPO.element.waitForClickable();
              await secondExtraWalletCardPO.element.click();
            });

            it("[PRPI-4737] should display the first and second Free Bet Wallets as selected", async () => {
              expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
              expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
              expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
              expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
            });

            it("[PRPI-4737] should display the apply button as still enabled but now with the 'Apply $5.00 Free Bet' label", async () => {
              expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
              expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $5.00 Free Bet");
            });

            describe("And then the user applies the Free Bets Wallets", () => {
              beforeAll(async () => {
                await generosityWalletApplyButtonPO.element.waitForClickable();
                await generosityWalletApplyButtonPO.element.click();
              });

              it("[PRPI-4737] should display the promo button as selected and should display the alert message with 'Includes $5.00 in Free Bets'", async () => {
                expect(
                  await browser.containsClass(multipleGenerosityWalletButtonPO.element, PromoButtonPO.states.selected),
                ).toBe(true);
                expect(await multipleGenerosityWalletAlertPO.message.getText()).toBe("Includes $5.00 in Free Bets");
              });

              describe("And opens the generosity wallet on the single to apply Price Boost tokens", () => {
                beforeAll(async () => {
                  // Open Generosity Wallet
                  await firstSingleGenerosityWalletButtonPO.element.click();

                  await browser.waitUntilDisplayed(generosityWalletPO.element, "Bottom sheet not displayed");
                });

                it("[PRPI-4737] should display the generosity wallet apply button as disabled with the 'Apply' label", async () => {
                  expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(false);
                  expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply");
                });

                it("[PRPI-4737] should display the alert on the generosity wallet footer with the correct label", async () => {
                  expect(await generosityWalletFooterAlertPO.element.isDisplayed()).toBe(true);
                  expect(await generosityWalletFooterAlertPO.message.getText()).toBe(
                    "Bonus(es) applied to another selection",
                  );
                  expect(await generosityWalletFooterAlertPO.detail.getText()).toBe(
                    "Remove in the Betslip to use here",
                  );
                });

                it("[PRPI-4737] should display 6 from the total of 9 wallets ", async () => {
                  expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(6);
                });

                it("[PRPI-4737] should display the first and second Free Bet Wallets as still selected but disabled", async () => {
                  expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                  expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                  expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                  expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                });

                describe("And then the user selects one Price Boost token under the 'All' pebble", () => {
                  beforeAll(async () => {
                    await thirdExtraWalletCardPO.element.waitForClickable();
                    await thirdExtraWalletCardPO.element.click();
                  });

                  it("[PRPI-4737] should display the third wallet as selected and the other two free bet wallets should still be selected and disabled", async () => {
                    expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                    expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                    expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                    expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(false);

                    expect(await thirdExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                    expect(await thirdExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                  });

                  it("[PRPI-4737] should display the apply button as enabled with the 'Apply Bet Boost' label", async () => {
                    expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                    expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply Bet Boost");
                  });

                  describe("And then the user clicks on the 'Bet Boost' pebble", () => {
                    beforeAll(async () => {
                      await thirdPebblePO.element.waitForClickable();
                      await thirdPebblePO.element.click();

                      await browser.waitUntilContainsClass(thirdPebblePO.element, PebblePO.states.active);
                    });

                    it("[PRPI-4737] should display the first Price Boost token as still selected", async () => {
                      expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                    });

                    it("[PRPI-4737] should display the apply button as still enabled with the 'Apply Bet Boost' label", async () => {
                      expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                      expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply Bet Boost");
                    });

                    describe("And then the user selects another Price Boost token", () => {
                      beforeAll(async () => {
                        await secondExtraWalletCardPO.element.waitForClickable();
                        await secondExtraWalletCardPO.element.click();
                      });

                      it("[PRPI-4737] should display the second Price Boost token as selected and the first one as unselected", async () => {
                        expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                        expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                        expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                        expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                      });

                      it("[PRPI-4737] should display the apply button as still enabled with the 'Apply Bet Boost' label", async () => {
                        expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                        expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply Bet Boost");
                      });

                      describe("And then the user applies the Price Boost token", () => {
                        beforeAll(async () => {
                          await generosityWalletApplyButtonPO.element.waitForClickable();
                          await generosityWalletApplyButtonPO.element.click();
                        });

                        it("[PRPI-4737] should display the single's promo button as selected and should display the alert message with '10% Bet Boost Applied'", async () => {
                          expect(
                            await browser.containsClass(
                              firstSingleGenerosityWalletButtonPO.element,
                              PromoButtonPO.states.selected,
                            ),
                          ).toBe(true);
                          expect(await firstSingleGenerosityWalletAlertPO.message.getText()).toBe(
                            "10% Bet Boost Applied",
                          );
                        });

                        describe("And opens the generosity wallet on the Double again to apply Acca Insurance tokens", () => {
                          beforeAll(async () => {
                            // Open Generosity Wallet
                            await multipleGenerosityWalletButtonPO.element.click();

                            await browser.waitUntilDisplayed(generosityWalletPO.element, "Bottom sheet not displayed");
                          });

                          it("[PRPI-4737] should display the generosity wallet apply button as disabled with the 'Apply $5.00 Free Bets' label", async () => {
                            expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(false);
                            expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply $5.00 Free Bet");
                          });

                          it("[PRPI-4737] should display the alert on the generosity wallet footer with the correct label", async () => {
                            expect(await generosityWalletFooterAlertPO.element.isDisplayed()).toBe(true);
                            expect(await generosityWalletFooterAlertPO.message.getText()).toBe(
                              "Bonus(es) applied to another selection",
                            );
                            expect(await generosityWalletFooterAlertPO.detail.getText()).toBe(
                              "Remove in the Betslip to use here",
                            );
                          });

                          it("[PRPI-4737] should display 6 from the total of 9 wallets ", async () => {
                            expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(6);
                          });

                          it("[PRPI-4737] should display the first and second Free Bet Wallets as selected and enabled and the fourth (boost) as selected and disabled", async () => {
                            expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                            expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                            expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                            expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(true);

                            expect(await fourthExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                            expect(await fourthExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                          });

                          describe("And then the user selects one Acca Insurance token under the 'All' pebble", () => {
                            beforeAll(async () => {
                              await fifthExtraWalletCardPO.element.waitForClickable();
                              await fifthExtraWalletCardPO.element.click();
                            });

                            it("[PRPI-4737] should display the fifth wallet (acca) as selected and the other two free bet wallets as unselected and enabled and the fourth (boost) as selected and disabled", async () => {
                              expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                              expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                              expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                              expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(true);

                              expect(await fourthExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                              expect(await fourthExtraWalletCardOptionPO.input.isEnabled()).toBe(false);

                              expect(await fifthExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                              expect(await fifthExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                            });

                            it("[PRPI-4737] should display the apply button as enabled with the 'Apply Second Chance' label", async () => {
                              expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                              expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply Second Chance");
                            });

                            describe("And then the user clicks on the 'Second Chance' pebble", () => {
                              beforeAll(async () => {
                                await fourthPebblePO.element.waitForClickable();
                                await fourthPebblePO.element.click();

                                await browser.waitUntilContainsClass(fourthPebblePO.element, PebblePO.states.active);
                              });

                              it("[PRPI-4737] should display the first Acca Insurance token as still selected", async () => {
                                expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                              });

                              it("[PRPI-4737] should display the apply button as still enabled with the 'Apply Second Chance' label", async () => {
                                expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                                expect(await generosityWalletApplyButtonPO.label.getText()).toBe("Apply Second Chance");
                              });

                              describe("And then the user selects another Acca Insurance token", () => {
                                beforeAll(async () => {
                                  await secondExtraWalletCardPO.element.waitForClickable();
                                  await secondExtraWalletCardPO.element.click();
                                });

                                it("[PRPI-4737] should display the second Acca Insurance token as selected and the first one as unselected", async () => {
                                  expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                                  expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                                  expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                                  expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                                });

                                it("[PRPI-4737] should display the apply button as still enabled with the 'Apply Second Chance' label", async () => {
                                  expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                                  expect(await generosityWalletApplyButtonPO.label.getText()).toBe(
                                    "Apply Second Chance",
                                  );
                                });

                                describe("And then the user applies the Acca Insurance token", () => {
                                  beforeAll(async () => {
                                    await generosityWalletApplyButtonPO.element.waitForClickable();
                                    await generosityWalletApplyButtonPO.element.click();
                                  });

                                  it("[PRPI-4737] should display the double's promo button as selected and should display the alert message with 'If 1 leg lets you down, get up to $20.00 in Free Bets'", async () => {
                                    expect(
                                      await browser.containsClass(
                                        multipleGenerosityWalletButtonPO.element,
                                        PromoButtonPO.states.selected,
                                      ),
                                    ).toBe(true);
                                    expect(await multipleGenerosityWalletAlertPO.message.getText()).toBe(
                                      "If 1 leg lets you down, get up to $20.00 in Free Bets",
                                    );
                                  });

                                  describe("And opens the generosity wallet on the single again to apply Acca Insurance tokens", () => {
                                    beforeAll(async () => {
                                      // Open Generosity Wallet
                                      await firstSingleGenerosityWalletButtonPO.element.click();

                                      await browser.waitUntilDisplayed(
                                        generosityWalletPO.element,
                                        "Bottom sheet not displayed",
                                      );
                                    });

                                    it("[PRPI-4737] should display the generosity wallet apply button as disabled with the 'Apply Bet Boost' label", async () => {
                                      expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(false);
                                      expect(await generosityWalletApplyButtonPO.label.getText()).toBe(
                                        "Apply Bet Boost",
                                      );
                                    });

                                    it("[PRPI-4737] should display the alert on the generosity wallet footer with the correct label", async () => {
                                      expect(await generosityWalletFooterAlertPO.element.isDisplayed()).toBe(true);
                                      expect(await generosityWalletFooterAlertPO.message.getText()).toBe(
                                        "Bonus(es) applied to another selection",
                                      );
                                      expect(await generosityWalletFooterAlertPO.detail.getText()).toBe(
                                        "Remove in the Betslip to use here",
                                      );
                                    });

                                    it("[PRPI-4737] should display 6 from the total of 9 wallets ", async () => {
                                      expect(await extraWalletCardGroupPO.extraWalletCardItems.length).toBe(6);
                                    });

                                    it("[PRPI-4737] should display the fourth wallet as still selected and enabled and the sixth as selected and disabled", async () => {
                                      expect(await fourthExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                                      expect(await fourthExtraWalletCardOptionPO.input.isEnabled()).toBe(true);

                                      expect(await sixthExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                                      expect(await sixthExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                                    });

                                    describe("And then the user navigates to the 'Second Chance' pebble", () => {
                                      beforeAll(async () => {
                                        await fourthPebblePO.element.waitForClickable();
                                        await fourthPebblePO.element.click();
                                      });

                                      it("[PRPI-4737] should display the apply button as still disabled with the 'Apply Bet Boost' label", async () => {
                                        expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(false);
                                        expect(await generosityWalletApplyButtonPO.label.getText()).toBe(
                                          "Apply Bet Boost",
                                        );
                                      });

                                      describe("And then the user selects an acca insurance token", () => {
                                        beforeAll(async () => {
                                          await firstExtraWalletCardPO.element.waitForClickable();
                                          await firstExtraWalletCardPO.element.click();
                                        });

                                        it("[PRPI-4737] should display the first acca insurance token as selected and enabled and the second as selected and disabled", async () => {
                                          expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                                          expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);

                                          expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(true);
                                          expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(false);
                                        });

                                        it("[PRPI-4737] should display the apply button as enabled with the 'Apply Second Chance' label", async () => {
                                          expect(await generosityWalletApplyButtonPO.element.isEnabled()).toBe(true);
                                          expect(await generosityWalletApplyButtonPO.label.getText()).toBe(
                                            "Apply Second Chance",
                                          );
                                        });

                                        describe("And then the user goes back to the 'Boost pebble'", () => {
                                          beforeAll(async () => {
                                            await thirdPebblePO.element.waitForClickable();
                                            await thirdPebblePO.element.click();
                                          });

                                          it("[PRPI-4737] should display the first and second boost tokens as unselected and enabled and the apply button keeps the same label - 'Apply Second Chance'", async () => {
                                            expect(await firstExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                                            expect(await firstExtraWalletCardOptionPO.input.isEnabled()).toBe(true);

                                            expect(await secondExtraWalletCardOptionPO.input.isSelected()).toBe(false);
                                            expect(await secondExtraWalletCardOptionPO.input.isEnabled()).toBe(true);
                                          });

                                          describe("And then the user clicks on the 'Apply Second Chance' button", () => {
                                            beforeAll(async () => {
                                              await generosityWalletApplyButtonPO.element.waitForClickable();
                                              await generosityWalletApplyButtonPO.element.click();
                                            });

                                            it("[PRPI-4737] should display the double's promo button as selected and should display the alert message with 'If 1 leg lets you down, get up to $20.00 in Free Bets'", async () => {
                                              expect(
                                                await browser.containsClass(
                                                  multipleGenerosityWalletButtonPO.element,
                                                  PromoButtonPO.states.selected,
                                                ),
                                              ).toBe(true);
                                              expect(await multipleGenerosityWalletAlertPO.message.getText()).toBe(
                                                "If 1 leg lets you down, get up to $20.00 in Free Bets",
                                              );
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
