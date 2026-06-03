const {
  AlertPO,
  AppPO,
  BetControlsPO,
  CardPO,
  EventPagePO,
  BetslipDrawerPO,
  ExtraWalletCardGroupPO,
  ExtraWalletCardPO,
  GenerosityWalletPO,
  MinimizedPO,
  OptionPO,
  PromoButtonPO,
  PrimaryButtonPO,
  RunnerPO,
  SinglePO,
  SinglesCardPO,
  SportsbookMarketPO,
  SportsbookPlacePanelPO,
  SportsbookReceiptPanelPO,
} = require("../../../../../../page-objects");

const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  SPB: { getPlaceBet },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const {
  TEST_ID: BET_CONTROL_TEST_ID,
} = require("@ppb/the-wall-web/components/rooms/BetControls/BetControls.selectors");

const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../../utils/routes");

const mockService = new MockService();

const eventPagePO = new EventPagePO();

const firstSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[0]);
const secondSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[1]);

const firstMarketFirstRunnerPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);
const secondMarketFirstRunnerPO = new RunnerPO(secondSportsbookMarketPO.runnerList[0]);

const betslipDrawerPO = new BetslipDrawerPO();
const minimizedBetslipPO = new MinimizedPO();

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();

const multiplesCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[0]);
const singlesCardPO = new CardPO(sportsbookPlacePanelPO.collapsableSections[1]);

const doubleBetControlsPO = new BetControlsPO(multiplesCardPO.element.$(BET_CONTROL_TEST_ID));
const doubleGenerosityButtonPO = new PromoButtonPO(doubleBetControlsPO.generosityWalletButton);

const singlesCardContentPO = new SinglesCardPO(singlesCardPO.contentWrapper);
const firstSinglePO = new SinglePO(singlesCardContentPO.singles[0]);
const secondSinglePO = new SinglePO(singlesCardContentPO.singles[1]);

const firstSingleBetControlsPO = new BetControlsPO(firstSinglePO.element.$(BET_CONTROL_TEST_ID));
const firstSingleGenerosityButtonPO = new PromoButtonPO(firstSingleBetControlsPO.generosityWalletButton);

const secondSingleBetControlsPO = new BetControlsPO(secondSinglePO.element.$(BET_CONTROL_TEST_ID));
const secondSingleGenerosityButtonPO = new PromoButtonPO(secondSingleBetControlsPO.generosityWalletButton);

const placeButtonPO = new PrimaryButtonPO(sportsbookPlacePanelPO.place);

const generosityWalletPO = new GenerosityWalletPO();
const generosityWalletApplyButtonPO = new PrimaryButtonPO(generosityWalletPO.applyButton);

const extraWalletCardGroupPO = new ExtraWalletCardGroupPO();

const firstExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[0]);
const secondExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[1]);
const thirdExtraWalletCardPO = new ExtraWalletCardPO(extraWalletCardGroupPO.extraWalletCardItems[2]);

const firstExtraWalletCardOptionPO = new OptionPO(firstExtraWalletCardPO.walletOption);
const secondExtraWalletCardOptionPO = new OptionPO(secondExtraWalletCardPO.walletOption);
const thirdExtraWalletCardOptionPO = new OptionPO(thirdExtraWalletCardPO.walletOption);

const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();

const betBuildersFreeBetsWalletsAlertPO = new AlertPO(sportsbookReceiptPanelPO.betBuilders[0]);

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const MARKET_ID_2 = "924.33333333";

const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;
const SELECTION_ID_4 = 44444;
const SELECTION_ID_5 = 55555;
const SELECTION_ID_6 = 66666;

const CURRENT_MOCKED_DATE = "2025-02-02T00:00:00.000Z";

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

const SPB_MOCK_SUCCESS = {
  result: [
    {
      betModifiers: ["SGM"],
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
            betRunners: [
              { runner: { marketId: MARKET_ID_1, selectionId: SELECTION_ID_1 } },
              { runner: { marketId: MARKET_ID_2, selectionId: SELECTION_ID_4 } },
            ],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],

      wallets: [
        {
          amount: 2,
          type: "BONUS_CASH",
          nonRedeemableAmount: 2,
        },
      ],

      totalStake: 2,
      totalPotentialWin: 0.5,
    },
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
          amount: 3,
          type: "BONUS_CASH",
          nonRedeemableAmount: 3,
        },
      ],

      totalStake: 3,
      totalPotentialWin: 0.5,
    },
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
      runners: [
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
            betRunners: [{ runner: { marketId: MARKET_ID_2, selectionId: SELECTION_ID_4 } }],
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

describe("SBK Free Bets Wallets - Bet Builder Receipt", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_EVENT_PAGE_MOCK.urn, { date: CURRENT_MOCKED_DATE }));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_2_RUNNERS));
    await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));

    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );

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

    // Opens double generosity wallets
    await doubleGenerosityButtonPO.element.waitForClickable();
    await doubleGenerosityButtonPO.element.click();
    await browser.waitUntilDisplayed(generosityWalletPO.element, "Generosity Wallets Bottom Sheet is not displayed");

    // Adds the first wallet and apply
    await firstExtraWalletCardOptionPO.title.click();
    await browser.waitUntilResult(
      firstExtraWalletCardOptionPO.input.isSelected(),
      true,
      "First wallet was not selected",
    );
    await generosityWalletApplyButtonPO.element.waitForClickable();
    await generosityWalletApplyButtonPO.element.click();
    await browser.waitUntilNotDisplayed(extraWalletCardGroupPO.element, "Generosity Wallets are still displayed");

    // Collapses the BET BUILDER section
    await multiplesCardPO.headerWrapper.waitForClickable();
    await multiplesCardPO.headerWrapper.click();
    await browser.waitUntilNotDisplayed(multiplesCardPO.content, "BET BUILDER section is not collapsed");

    // Opens first single generosity wallets
    await firstSingleGenerosityButtonPO.element.waitForClickable();
    await firstSingleGenerosityButtonPO.element.click();
    await browser.waitUntilDisplayed(generosityWalletPO.element, "Generosity Wallets Bottom Sheet is not displayed");

    // Adds the second wallet and apply
    await secondExtraWalletCardPO.element.waitForClickable();
    await secondExtraWalletCardPO.element.click();
    await browser.waitUntilResult(
      secondExtraWalletCardOptionPO.input.isSelected(),
      true,
      "Second wallet was not selected",
    );
    await generosityWalletApplyButtonPO.element.waitForClickable();
    await generosityWalletApplyButtonPO.element.click();
    await browser.waitUntilNotDisplayed(extraWalletCardGroupPO.element, "Generosity Wallets are still displayed");

    // Opens second single generosity wallets
    await secondSingleGenerosityButtonPO.element.waitForClickable();
    await secondSingleGenerosityButtonPO.element.click();
    await browser.waitUntilDisplayed(generosityWalletPO.element, "Generosity Wallets Bottom Sheet is not displayed");

    // Adds the third wallet and apply
    await thirdExtraWalletCardPO.element.waitForClickable();
    await thirdExtraWalletCardPO.element.click();
    await browser.waitUntilResult(
      thirdExtraWalletCardOptionPO.input.isSelected(),
      true,
      "Third wallet was not selected",
    );
    await generosityWalletApplyButtonPO.element.waitForClickable();
    await generosityWalletApplyButtonPO.element.click();
    await browser.waitUntilNotDisplayed(extraWalletCardGroupPO.element, "Generosity Wallets are still displayed");
    // Place the bet
    await placeButtonPO.element.waitForClickable();
    await placeButtonPO.element.click();
    await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);
  });

  it("[PRPI-7875] should display for SGM the generosity alert with 'Includes $2.00 in Free Bets' message without any action available", async () => {
    expect(await betBuildersFreeBetsWalletsAlertPO.element.isDisplayed()).toBe(true);
    expect(await betBuildersFreeBetsWalletsAlertPO.actionLink.isDisplayed()).toBe(false);
    expect(await betBuildersFreeBetsWalletsAlertPO.message.getText()).toBe("Includes $2.00 in Free Bets");
  });
});
