const {
  AppPO,
  CardPO,
  ExchangeBetButtonPO,
  ExchangeMarketPO,
  FreeBetsPO,
  InlinePanelPO,
  MarketPagePO,
  RunnerPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getImplyBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const marketCardPO = new CardPO(marketPagePO.market);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const firstRunnerBackButton = new ExchangeBetButtonPO(firstRunnerExchangePO.exchangeBetButtons[0]);
const thirdRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[2]);
const thirdRunnerBackButton = new ExchangeBetButtonPO(thirdRunnerExchangePO.exchangeBetButtons[0]);

const freeBetsPO = new FreeBetsPO();
const inlinePanelPO = new InlinePanelPO();

const mockService = new MockService();

const EVENT_ID = "29359895";
const MARKET_ID = "1.123456789";

const WALLET_MOCK = {
  conditions: [],
  walletType: "BONUS_CASH",
};

const FIXTURE = {
  node: {
    urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
    __typename: "FixtureCard",
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      away: { name: "Wolves" },
      home: { name: "Man Utd" },
    },
    sportevent: { urn: `ppb:event:${EVENT_ID}` },
  },
};

const EVENT_LINK = {
  node: {
    __typename: "QuickLinksCard",
    urn: `ppb:tbd:card:quickLinks:view:event;${EVENT_ID}`,
    viewLink: {
      viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
    },
  },
};

const EXCHANGE_MARKET = {
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${MARKET_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
    },
  },
  runners: [
    {
      runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
      selectionId: 55190,
    },
    {
      runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0`,
      selectionId: 48224,
    },
    {
      runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0`,
      selectionId: 58805,
    },
  ],
};

const MARKET_CARD = {
  node: {
    __typename: "MarketExtendedCard",
    urn: `ppb:tbd:card:marketExtended:${MARKET_ID}`,
    displayRunners: {
      exchange: {
        runners: [
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
          },
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/48224/0`,
          },
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0`,
          },
        ],

        market: EXCHANGE_MARKET,
      },
    },
  },
};

const BFF_MATCH_ODDS_MARKET_PAGE_MOCK = {
  __typename: "MarketView",
  urn: `ppb:tbd:view:market:${MARKET_ID}`,
  edges: [FIXTURE, MARKET_CARD, EVENT_LINK],
  partialEdges: [
    {
      node: {
        urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
        __typename: "FixtureCard",
      },
    },
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended:${MARKET_ID}`,
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: `ppb:tbd:card:quickLinks:view:event;${EVENT_ID}`,
      },
    },
  ],

  mainMarket: EXCHANGE_MARKET,
};

const ERO_RUNNERS_MOCK = [
  {
    availableToBack: [{ price: 2.5, size: 100 }],
    availableToLay: [{ price: 5.8, size: 110 }],
    selectionId: "55190",
  },
  {
    availableToBack: [{ price: 3.5, size: 100 }],
    availableToLay: [{ price: 6.8, size: 110 }],
    selectionId: "48224",
  },
  {
    availableToBack: [{ price: 1.5, size: 100 }],
    availableToLay: [{ price: 1.8, size: 110 }],
    selectionId: "58805",
  },
];

const MATCH_ODDS_ERO_MOCK = [
  {
    marketId: MARKET_ID,
    runners: ERO_RUNNERS_MOCK,
  },
];

const ETX_MOCK = {
  hasBonusMoney: true,
  marketId: MARKET_ID,
};

const ETX_SINGLE_WALLET_MOCK = {
  ...ETX_MOCK,
  wallets: [
    {
      ...WALLET_MOCK,
      amount: 3,
    },
  ],
};

const ETX_SINGLE_WALLET_WITH_SELECTION_MOCK = {
  ...ETX_MOCK,
  wallets: [
    {
      ...WALLET_MOCK,
      amount: 3,
      conditions: [
        {
          type: "SELECTION_ID",
          value: "55190",
        },
      ],
    },
  ],
};

const ETX_TWO_WALLETS_MOCK = {
  ...ETX_MOCK,
  wallets: [
    {
      ...WALLET_MOCK,
      amount: 3,
    },
    {
      ...WALLET_MOCK,
      amount: 2.5,
    },
  ],
};

const ETX_TWO_WALLETS_WITH_SELECTION_MOCK = {
  ...ETX_MOCK,
  wallets: [
    {
      ...WALLET_MOCK,
      amount: 3,
    },
    {
      ...WALLET_MOCK,
      amount: 1.5,
      conditions: [
        {
          type: "SELECTION_ID",
          value: "58805",
        },
      ],
    },
  ],
};

const ETX_ERROR_MOCK = {
  error: {
    errorCode: "UNKNOWN_ERROR_CODE",
  },
};

describe("Inline Betslip - Free Bets - Imply", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK.urn, { currencyCode: "EUR", localeCodeBcp47: "en-GB" }),
    );
    await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
    await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK));
    await mockService.mockHttpRequest(getWallets([{ amount: "10.00", walletName: "EXCHANGE_BONUS_CASH" }]));
  });

  describe("when the user has available bonus and clicks on a bet button in a match odds market", () => {
    describe("with a single bonus wallet", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetResponse(ETX_SINGLE_WALLET_MOCK));

        await browser.url(routes.getMarketViewUrl(MARKET_ID));
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({
            market: marketPagePO.market,
            price: 2.5,
          }),
        );

        await firstRunnerBackButton.element.click();
        await browser.waitUntilDisplayed(freeBetsPO.element, "Free bets component wasn't displayed");
      });

      it("[PRPI-5322] the free bets label should be displayed", async () => {
        expect(await freeBetsPO.label.getText()).toBe("Use Free Bet Balance (€3.00)");
      });
    });

    describe("with two bonus wallets", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetResponse(ETX_TWO_WALLETS_MOCK));

        await browser.url(routes.getMarketViewUrl(MARKET_ID));
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({
            market: marketPagePO.market,
            price: 2.5,
          }),
        );

        await firstRunnerBackButton.element.click();
        await browser.waitUntilDisplayed(freeBetsPO.element, "Free bets component wasn't displayed");
      });

      it("[PRPI-5323] the free bets label should display the cumulative value of both wallets", async () => {
        expect(await freeBetsPO.label.getText()).toBe("Use Free Bet Balance (€5.50)");
      });
    });

    describe("with bonus wallets for market and 'Draw' selection", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetResponse(ETX_TWO_WALLETS_WITH_SELECTION_MOCK));

        await browser.url(routes.getMarketViewUrl(MARKET_ID));
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({
            market: marketPagePO.market,
            price: 2.5,
          }),
        );
      });

      describe("on the 'Home' selection", () => {
        beforeAll(async () => {
          await firstRunnerBackButton.element.click();
          await browser.waitUntilDisplayed(freeBetsPO.element, "Free bets component wasn't displayed");
        });

        it("[PRPI-5324] the free bets label should display the value of only one wallet", async () => {
          expect(await freeBetsPO.label.getText()).toBe("Use Free Bet Balance (€3.00)");
        });

        describe("and then on the 'Draw' selection", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getImplyBetResponse(ETX_TWO_WALLETS_WITH_SELECTION_MOCK));
            await browser.tickFakeClock();

            await browser.waitUntilDisplayed(inlinePanelPO.action, "Close button wasn't displayed");
            await inlinePanelPO.action.waitForClickable();
            await inlinePanelPO.action.click();
            await browser.waitUntilNotDisplayed(inlinePanelPO.element, "Inline betslip wasn0t closed");

            await thirdRunnerBackButton.element.scrollIntoView();
            await browser.waitUntilInViewport(thirdRunnerBackButton.element, "Runner bet button not in viewport");
            await thirdRunnerBackButton.element.click();
            await browser.waitUntilDisplayed(freeBetsPO.element, "Free bets component wasn't displayed");
          });

          it("[PRPI-5325] the free bets label should display the cumulative value of both wallets", async () => {
            expect(await freeBetsPO.label.getText()).toBe("Use Free Bet Balance (€4.50)");
          });
        });
      });
    });

    describe("with bonus wallet for 'Home' selection", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetResponse(ETX_SINGLE_WALLET_WITH_SELECTION_MOCK));

        await browser.url(routes.getMarketViewUrl(MARKET_ID));
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({
            market: marketPagePO.market,
            price: 2.5,
          }),
        );
      });

      describe("on the 'Home' selection", () => {
        beforeAll(async () => {
          await firstRunnerBackButton.element.click();
          await browser.waitUntilDisplayed(freeBetsPO.element, "Free bets component wasn't displayed");
        });

        it("[PRPI-5326] the free bets label should be displayed", async () => {
          expect(await freeBetsPO.label.getText()).toBe("Use Free Bet Balance (€3.00)");
        });

        describe("and then on the 'Draw' selection", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getImplyBetResponse(ETX_SINGLE_WALLET_WITH_SELECTION_MOCK));
            await browser.tickFakeClock();

            await browser.waitUntilDisplayed(inlinePanelPO.action, "Close button wasn't displayed");
            await inlinePanelPO.action.waitForClickable();
            await inlinePanelPO.action.click();
            await browser.waitUntilNotDisplayed(inlinePanelPO.element, "Inline betslip wasn't closed");

            await thirdRunnerBackButton.element.scrollIntoView();
            await browser.waitUntilInViewport(thirdRunnerBackButton.element, "Runner bet button not in viewport");
            await thirdRunnerBackButton.element.click();
          });

          it("[PRPI-5327] should no longer display the free bets component", async () => {
            await browser.waitUntilNotDisplayed(freeBetsPO.element, "Free bets component was still displayed");
          });
        });
      });
    });

    describe("and when ETX imply returns an error", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetResponse(ETX_ERROR_MOCK));

        await browser.url(routes.getMarketViewUrl(MARKET_ID));
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({
            market: marketPagePO.market,
            price: 2.5,
          }),
        );

        await firstRunnerBackButton.element.click();
        await browser.waitUntilDisplayed(inlinePanelPO.element, "Place panel wasn't displayed");
      });

      it("[PRPI-5328] the free bets component should not be displayed", async () => {
        expect(await freeBetsPO.element.isDisplayed()).toBe(false);
      });
    });
  });
});
