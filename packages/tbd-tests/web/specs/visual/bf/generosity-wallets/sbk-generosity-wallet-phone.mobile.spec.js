const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");
const {
  HeaderPO,
  AppPO,
  EventPagePO,
  GenerosityWalletPO,
  SportsbookMarketPO,
  RunnerPO,
  SportsbookPlacePanelPO,
  PromoButtonPO,
} = require("../../../../page-objects");
const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const MODULE_NAME = "generosity_wallet";

const mockService = new MockService(browser);

const eventPagePO = new EventPagePO();
const headerPO = new HeaderPO();
const generosityWalletPO = new GenerosityWalletPO();

const firstSportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[0]);

const firstMarketFirstRunnerPO = new RunnerPO(firstSportsbookMarketPO.runnerList[0]);

const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const generosityWalletButtonPO = new PromoButtonPO();

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";

const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;

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

const WALLET_MOCK = [
  { amount: "5.00", walletName: "MAIN" },
  { amount: "5.00", walletName: "SPORTSBOOK_BONUS" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
  { amount: "1.00", walletName: "ACCA_INSURANCE_TOKENS" },
];

describe("Sportsbook Generosity Wallet - Bottom Sheet", () => {
  describe("When the user has Free Bets Wallets, Price Boost tokens and Acca Insurance tokens and clicks on free bets balance in the header", () => {
    beforeAll(async () => {
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_EVENT_PAGE_MOCK.urn, {
          FREE_BETS_WALLET: { isActive: true },
          date: "2019-06-26T09:00:00.000Z",
        }),
      );
      await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
      await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));

      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_1_RUNNER));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({
          market: eventPagePO.markets[0],
          price: 1.1,
        }),
      );

      await headerPO.generosityWalletButton.waitForClickable();
      await headerPO.generosityWalletButton.click();

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1366]_should_be_displayed_the_generosity_wallet_with_all_pebbles_in_header_mode`,
      );
    });

    afterAll(async () => {
      await browser.execute(() => {
        const element = document.elementFromPoint(0, 0);
        if (element) element.click();
      });
      await browser.waitUntilNotDisplayed(generosityWalletPO.element);
    });

    it("[PRPI-1366]_should_be_displayed_the_generosity_wallet_with_all_pebbles_in_header_mode", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1366]_should_be_displayed_the_generosity_wallet_with_all_pebbles_in_header_mode`,
        ),
      ).toBe(0);
    });
  });

  describe("When the user opens the generosity wallet through the betslip", () => {
    beforeAll(async () => {
      // Add First Selection
      await firstMarketFirstRunnerPO.sportsbookBetButton.waitForClickable();
      await firstMarketFirstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element, "Sportsbook single betslip not displayed");

      // Open generosity wallet
      await generosityWalletButtonPO.element.click();

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1367]_should_be_displayed_the_generosity_wallet_with_all_pebbles_in_betslip_mode`,
      );
    });

    it("[PRPI-1367]_should_be_displayed_the_generosity_wallet_with_all_pebbles_in_betslip_mode", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1367]_should_be_displayed_the_generosity_wallet_with_all_pebbles_in_betslip_mode`,
        ),
      ).toBe(0);
    });
  });
});
