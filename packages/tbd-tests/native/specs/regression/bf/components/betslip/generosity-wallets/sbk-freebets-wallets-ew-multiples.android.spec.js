const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const {
  getEventLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { ALERT } = require("@ppb/the-wall-native/components/Alert/Alert.selectors");
const {
  AlertSO,
  BetControlsSO,
  ExtraWalletCardGroupSO,
  ExtraWalletCardSO,
  GenerosityWalletSO,
  OptionSO,
  PlaceFooterSO,
  PrimaryButtonSO,
  RunnerSO,
  SportsbookMarketSO,
  SportsbookBetButtonSO,
  BetslipDrawerSO,
  MinimizedSO,
  GenericScreenSO,
  SportsbookPlacePanelSO,
  PromoButtonSO,
  CardSO,
} = require("../../../../../../screen-objects");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const { getStartViewLink } = require("../../../../../../helpers/view-link-start");
const { startApp } = require("../../../../../../helpers/urls");

const mockService = new MockService();

const eventPageSO = new GenericScreenSO();

const betslipDrawerSO = new BetslipDrawerSO();
const minimizedBetslipSO = new MinimizedSO();

const firstSportsbookMarketSO = new SportsbookMarketSO(eventPageSO.cards[0]);
const secondSportsbookMarketSO = new SportsbookMarketSO(eventPageSO.cards[1]);

const firstRunnerSO = new RunnerSO(firstSportsbookMarketSO.runnerList[0]);
const secondRunnerSO = new RunnerSO(secondSportsbookMarketSO.runnerList[0]);

const firstSbkRunnerButtonSO = new SportsbookBetButtonSO(firstRunnerSO.sbkBetButtons[0]);
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();

const multiplesCardSO = new CardSO(sportsbookPlacePanelSO.collapsableSections[0]);

const doubleBetControlsSO = new BetControlsSO(multiplesCardSO.element);
const doubleGenerosityWalletButtonSO = new PromoButtonSO(doubleBetControlsSO.generosityWalletButton);
const doubleFreeBetsWalletsAlertSO = new AlertSO(multiplesCardSO.element.$(`~${ALERT}`));

const placeFooterSO = new PlaceFooterSO();
const freeBetsWalletsAlertPlaceFooterSO = new AlertSO(placeFooterSO.freeBetsWalletsAlert);

const generosityWalletSO = new GenerosityWalletSO();
const generosityWalletApplyButtonSO = new PrimaryButtonSO();

const extraWalletCardGroupSO = new ExtraWalletCardGroupSO();

const firstExtraWalletCardSO = new ExtraWalletCardSO(extraWalletCardGroupSO.extraWalletCardItems[0]);

const firstExtraWalletCardOptionSO = new OptionSO(firstExtraWalletCardSO.walletOption);

const ewOptionSO = new OptionSO(sportsbookPlacePanelSO.element);

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const MARKET_ID_2 = "924.33333333";

const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;
const SELECTION_ID_4 = 44444;
const SELECTION_ID_5 = 55555;
const SELECTION_ID_6 = 66666;

const WALLETS = [
  { id: 20000000001, amount: 2, expirationDate: "2025-02-02T00:00:50.000Z" }, // 50 seconds
  { id: 20000000002, amount: 3, expirationDate: "2025-02-02T00:01:00.000Z" }, // 1 minute
  { id: 20000000003, amount: 5, expirationDate: "2025-02-02T01:01:00.000Z" }, // 1 hour
  { id: 20000000004, amount: 7, expirationDate: "2025-02-03T00:01:00.000Z" }, // 1 day
  { id: 20000000005, amount: 10, expirationDate: "2025-04-02T00:01:00.000Z" }, // 1 month
  { id: 20000000006, amount: 13, expirationDate: "2026-02-02T00:01:00.000Z" }, // 1 year
  { id: 20000000007, amount: 1 }, // no expiration date
  { id: 20000000008, amount: 20, expirationDate: "2027-02-02T00:01:00.000Z" }, // 2 years
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
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
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
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 1),
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
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 3),
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
  applicableWallets: WALLETS.map(({ id }) => id).slice(0, WALLETS.length - 4),
  betType: "DOUBLE",
  canPlaceEachwayBet: true,
  eachwayAvgOdds: {
    trueOdds: {
      decimalOdds: {
        decimalOdds: 1.5,
      },
    },
  },
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
  wallets: WALLETS.map(({ id, amount }) => ({
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
  wallets: WALLETS.map(({ id, amount }) => ({
    walletId: id,
    amount,
    redeemable: "false",
    type: "BONUS_CASH",
  })),
};

const WALLET_MOCK = [
  { amount: "100.00", walletName: "MAIN" },
  { amount: "61.00", walletName: "SPORTSBOOK_BONUS" },
];

describe("SBK Free Bets Wallets - Each Way Multiples", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_2_RUNNERS));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));

    const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    // Add First Selection
    await browser.waitUntilEquals(firstSbkRunnerButtonSO.odd, "1.1");
    await browser.waitUntilClickableNative(firstRunnerSO.sbkBetButtons[0]);
    await firstRunnerSO.sbkBetButtons[0].click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook betslip not displayed");

    // Minimize the betslip
    await browser.waitUntilClickableNative(betslipDrawerSO.header);
    await betslipDrawerSO.header.click();
    await browser.waitUntilDisplayed(minimizedBetslipSO.element, "Sportsbook minimized betslip not displayed");

    // Add Second Selection
    await browser.waitUntilClickableNative(secondRunnerSO.sbkBetButtons[0]);
    await secondRunnerSO.sbkBetButtons[0].click();
    await browser.waitUntilEquals(minimizedBetslipSO.counter, "2", "Second Selection not added to betslip");

    // Expand the betslip
    await browser.waitUntilClickableNative(minimizedBetslipSO.element);
    await minimizedBetslipSO.element.click();
    await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Sportsbook betslip not expanded");

    // Open DOUBLE Free Bets Wallets
    await browser.waitUntilClickableNative(doubleGenerosityWalletButtonSO.element);
    await doubleGenerosityWalletButtonSO.element.click();
    await browser.waitUntilDisplayed(generosityWalletSO.element, "Generosity Wallets Bottom Sheet is not displayed");

    // // Selected the first wallet
    await browser.waitUntilClickableNative(firstExtraWalletCardOptionSO.checkbox);
    await firstExtraWalletCardOptionSO.checkbox.click();
    await browser.waitUntil(
      async () => (await firstExtraWalletCardOptionSO.checkbox.getAttribute("selected")) === "true",
    );

    // Apply the selected wallet
    await browser.waitUntilClickableNative(generosityWalletApplyButtonSO.element);
    await generosityWalletApplyButtonSO.element.click();
    await browser.waitUntilNotDisplayed(extraWalletCardGroupSO.element, "Free Bets Wallets are still displayed");

    // Select E/W option
    await ewOptionSO.title.click();
    await browser.waitUntil(async () => (await ewOptionSO.checkbox.getAttribute("selected")) === "true");
  });

  it("[PRPI-4162] should display a generosity alert on double with the correct amount of free bets and a remove action", async () => {
    expect(await doubleFreeBetsWalletsAlertSO.element.isDisplayed()).toBe(true);
    expect(await doubleFreeBetsWalletsAlertSO.message.getText()).toBe("Includes 2 x $1.00 in Free Bets");
    expect(await doubleFreeBetsWalletsAlertSO.actionLinkText.getText()).toBe("Remove");
  });

  it("[PRPI-4163] should display a generosity alert on place footer with the correct amount of free bets and a remove action", async () => {
    expect(await freeBetsWalletsAlertPlaceFooterSO.element.isDisplayed()).toBe(true);
    expect(await freeBetsWalletsAlertPlaceFooterSO.message.getText()).toBe("Includes $2.00 in Free Bets");
    expect(await freeBetsWalletsAlertPlaceFooterSO.actionLinkText.getText()).toBe("Remove");
  });
});
