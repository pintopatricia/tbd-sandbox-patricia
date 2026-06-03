const {
  AppPO,
  BetControlsPO,
  EventPagePO,
  ModalPO,
  RunnerPO,
  SportsbookMarketPO,
  SportsbookPlacePanelPO,
} = require("../../../../page-objects");

const {
  SIB: { getImplyBetsResponse },
  SMP: { getMarketPrices },
  WALLET: { getWallets },
} = require("@flutter-global/uki-channels-http-clients/mock-index");

const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");

const mockService = new MockService();

const eventPagePO = new EventPagePO();
const sportsbookMarketPO = new SportsbookMarketPO();
const firstRunnerPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const betControlsPO = new BetControlsPO();

const generosityWalletModalPO = new ModalPO();

const EVENT_ID = "22222222";
const MARKET_ID_1 = "924.22222222";
const SELECTION_ID_1 = 11111;
const SELECTION_ID_2 = 22222;
const SELECTION_ID_3 = 33333;

const CURRENT_MOCKED_DATE = "2025-02-02T00:00:00.000Z";

const WALLETS = [
  {
    // 50 seconds, NO badges, NO restrictions
    id: 20000000001,
    amount: 2,
    expirationDate: "2025-02-02T00:00:50.000Z",
    badges: [],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  {
    // 1 minute, 1 badge, NO restrictions
    id: 20000000002,
    amount: 3,
    expirationDate: "2025-02-02T00:01:00.000Z",
    badges: ["Football"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  {
    // 1 hour, 2 badges, NO restrictions
    id: 20000000003,
    amount: 5,
    expirationDate: "2025-02-02T01:01:00.000Z",
    badges: ["Football", "Basketball"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
  },
  {
    // 1 day, 1 badged, single
    id: 20000000004,
    amount: 7,
    expirationDate: "2025-02-03T00:01:00.000Z",
    badges: ["Football"],
    restrictions: { single: true, acca: false, sameGameMulti: false },
  },
  {
    // 1 month, 1 badge, acca
    id: 20000000005,
    amount: 10,
    expirationDate: "2025-04-02T00:01:00.000Z",
    badges: ["Football"],
    restrictions: { single: false, acca: true, sameGameMulti: false },
  },
  {
    // 1 year, NO badges, sameGameMulti
    id: 20000000006,
    amount: 13,
    expirationDate: "2026-02-02T00:01:00.000Z",
    badges: [],
    restrictions: { single: false, acca: false, sameGameMulti: true },
  },
  {
    // no expiration date, NO badges, acca and sameGameMulti
    id: 20000000007,
    amount: 1,
    acca: true,
    badges: [],
    restrictions: { single: false, acca: true, sameGameMulti: true },
  },
  {
    // 2 years, NO badges, NO restrictions
    id: 20000000008,
    amount: 20,
    expirationDate: "2027-02-02T00:01:00.000Z",
    badges: ["Football"],
    restrictions: { single: false, acca: false, sameGameMulti: false },
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
      amount: 10.0,
      helpUrl: "thisisahelpurl",
      full: {
        edges: WALLETS.map(({ id, amount, expirationDate, badges, restrictions }) => ({
          node: {
            __typename: "ExtraWalletCard",
            urn: `ppb:tbd:card:extraWalletCard:${id}`,
            badges,
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
              single: `${restrictions?.single || false}`,
              acca: `${restrictions?.acca || false}`,
              sameGameMulti: `${restrictions?.sameGameMulti || false}`,
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

const SIB_MOCK = {
  betCombinations: [SINGLE_BET_COMBINATION],
  hasBonusMoney: true,
  runnerOdds: [FIRST_SELECTION_ODDS],
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

const MODULE_NAME = "modal";

describe("Modal", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_EVENT_PAGE_MOCK.urn, { date: CURRENT_MOCKED_DATE }));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_PAGE_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));

    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("when a user with available generosity wallets/tokens opens a betslip", () => {
    beforeAll(async () => {
      await firstRunnerPO.sportsbookBetButton.waitForClickable();
      await firstRunnerPO.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(placePanelPO.element, "Sportsbook betslip not displayed");
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1412]_should_display_the_free_bets_wallets_generosity_promo_button`,
      );
    });

    it("[PRPI-1412]_should_display_the_free_bets_wallets_generosity_promo_button", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1412]_should_display_the_free_bets_wallets_generosity_promo_button`,
        ),
      ).toBe(0);
    });

    describe("and clicks on the generosity promo button", () => {
      beforeAll(async () => {
        await betControlsPO.generosityWalletButton.waitForClickable();
        await betControlsPO.generosityWalletButton.click();
        await browser.waitUntilDisplayed(generosityWalletModalPO.element, "Generosity Wallet Modal is not displayed");
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1413]_should_display_the_free_bets_wallets_modal`);
      });

      it("[PRPI-1413]_should_display_the_free_bets_wallets_modal", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1413]_should_display_the_free_bets_wallets_modal`)).toBe(
          0,
        );
      });
    });
  });
});
