const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  SPB: { getPlaceBet },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const {
  getAppContext,
  getEventLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  BetControlsSO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  GenerosityWalletSO,
  OptionSO,
  PrimaryButtonSO,
  RunnerSO,
  SportsbookMarketSO,
  SportsbookPlacePanelSO,
  SecondaryButtonSO,
  BetSportsbookReceiptSO,
} = require("../../../../../../screen-objects");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../../../helpers/view-link-start");
const { startApp } = require("../../../../../../helpers/urls");
const { advanceToConfirmStep } = require("../../../../../../helpers/confirm-bets");

const mockService = new MockService();

const sportsbookMarketSO = new SportsbookMarketSO();
const firstRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const betControlsSO = new BetControlsSO();

const generosityWalletSO = new GenerosityWalletSO();
const generosityWalletApplyButtonSO = new PrimaryButtonSO();

const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();

const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);
const secondExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[1]);

const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);
const secondExtraWalletCardOptionSO = new OptionSO(secondExtraWalletCardSO.walletOption);

const placeButtonSO = new PrimaryButtonSO(sportsbookPlacePanelSO.place);
const editButtonSO = new SecondaryButtonSO(sportsbookPlacePanelSO.actions[0]);

const betSportsbookReceiptSO = new BetSportsbookReceiptSO();

const confirmButtonsElements = {
  placeButtonElement: placeButtonSO.element,
  editButtonElement: editButtonSO.element,
};

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;

const APP_CONTEXT_MOCK = {
  loggedIn: "true",
  products: ["sportsbook"],
  throttles: {
    BET_CONFIRMATION_STEP: { isActive: true },
  },
};

const WALLETS = [
  { id: 20000000001, amount: 2 },
  { id: 20000000002, amount: 3 },
  { id: 20000000003, amount: 5 },
  { id: 20000000004, amount: 7 },
  { id: 20000000005, amount: 10 },
  { id: 20000000006, amount: 13 },
  { id: 20000000007, amount: 1 },
  { id: 20000000008, amount: 20 },
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
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}:MATCH_ODDS`,
      },
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
        edges: WALLETS.map(({ id, amount, expirationDate }) => ({
          node: {
            __typename: "ExtraWalletCard",
            urn: `ppb:tbd:card:extraWalletCard:${id}`,
            badges: [],
            extraWallet: {
              __typename: "ExtraWallet",
              urn: `ppb:extraWallet:${id}`,
              walletId: `${id}`,
              indexedId: `${id}`,
              amount,
              expirationDate,
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
        })),
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
  ],
};

const SINGLE_BET_COMBINATION = {
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
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 1),
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

const SECOND_SELECTION_ODDS = {
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

const THIRD_SELECTION_ODDS = {
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

const SIB_MOCK = {
  betCombinations: [SINGLE_BET_COMBINATION],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS, SECOND_SELECTION_ODDS, THIRD_SELECTION_ODDS],
  wallets: WALLETS.map(({ id, amount }) => ({
    walletId: id,
    amount,
    redeemable: "false",
    type: "BONUS_CASH",
  })),
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
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID_1, selectionId: SELECTION_ID_1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      wallets: [
        {
          amount: 5,
          type: "BONUS_CASH",
          nonRedeemableAmount: 5,
        },
      ],

      totalStake: 5,
      totalPotentialWin: 0.5,
    },
  ],
};

const WALLET_MOCK = [
  { amount: "100.00", walletName: "MAIN" },
  { amount: "61.00", walletName: "SPORTSBOOK_BONUS" },
];

const MODULE_NAME = "freebets_wallets";

describe("SBK Free Bets Wallets - Singles Confirm and Receipt", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));

    const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    // Selection bet button
    await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
    await firstRunnerSO.sbkBetButtons[0].click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook betslip not displayed");

    // Open Free Bets Wallets
    await browser.waitUntilClickableNative(betControlsSO.generosityWalletButton);
    await betControlsSO.generosityWalletButton.click();
    await browser.waitUntilDisplayed(generosityWalletSO.element, "Generosity Wallets Bottom Sheet is not displayed");

    // Selects the first wallet
    await browser.waitUntilClickableNative(firstExtraWalletCardOptionSO.checkbox);
    await firstExtraWalletCardOptionSO.checkbox.click();
    await browser.waitUntil(
      async () => (await firstExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
    );

    // Selects the second wallet
    await browser.waitUntilClickableNative(secondExtraWalletCardOptionSO.checkbox);
    await secondExtraWalletCardOptionSO.checkbox.click();
    await browser.waitUntil(
      async () => (await secondExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
    );

    // Applies the wallets
    await browser.waitUntilClickableNative(generosityWalletApplyButtonSO.element);
    await generosityWalletApplyButtonSO.element.click();
    await browser.waitUntilNotDisplayed(extraWalletCardGroupSO.element, "Generosity Wallets are still displayed");

    // Confirm the bet
    await advanceToConfirmStep(confirmButtonsElements);
    await browser.waitUntilEquals(placeButtonSO.label, "Confirm $5.00 Selection");
  });

  it("[PRPI-4960]_should_display_the_confirm_step_combinations_with_the_selected_wallets_amount", async () => {
    expect(
      (
        await browser.compareScreen(
          `${MODULE_NAME}_[PRPI-4960]_should_display_the_confirm_step_combinations_with_the_selected_wallets_amount`,
        )
      ).misMatchPercentage,
    ).toEqual(0);
  });

  describe("and then the user places the bet", () => {
    beforeAll(async () => {
      // place the bet
      await browser.waitUntilClickableNative(placeButtonSO.element);
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(betSportsbookReceiptSO.element);
    });

    it("[PRPI-4961]_should_display_the_receipt_free_bets_wallets_generosity_alert", async () => {
      expect(
        (
          await browser.compareScreen(
            `${MODULE_NAME}_[PRPI-4961]_should_display_the_receipt_free_bets_wallets_generosity_alert`,
          )
        ).misMatchPercentage,
      ).toEqual(0);
    });
  });
});
