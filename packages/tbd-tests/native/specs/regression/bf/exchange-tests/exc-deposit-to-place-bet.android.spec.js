const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { searchOrders, getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getSportsLayout, getGenericLayout, getAppContext } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { hideKeyboard } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");

const {
  ExchangeMarketSO,
  ExchangeInlineReceiptPanelSO,
  ExchangeBetButtonSO,
  HeaderSO,
  ExchangeUnmatchedCardSO,
  RunnerSO,
  ExchangeInlinePlacePanelSO,
  PrimaryButtonSO,
  NudgesNumberInputFieldSO,
  AlertSO,
  ExchangeInlineEditPanelSO,
} = require("../../../../screen-objects");

const headerSO = new HeaderSO();
const exchangeMarketSO = new ExchangeMarketSO();
const firstRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const firstBetButtonSO = new ExchangeBetButtonSO(firstRunnerSO.betButtons[0]);
const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const inlinePlaceStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const exchangeInlineEditPanelSO = new ExchangeInlineEditPanelSO();
const inlineEditStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlineEditPanelSO.inputs[1]);
const exchangeInlinePlaceButtonSO = new PrimaryButtonSO(exchangeInlineEditPanelSO.placeButton);
const placeButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.placeButton);
const alertPlacePanelSO = new AlertSO(exchangeInlinePlacePanelSO.notifications);
const alertEditPanelSO = new AlertSO(exchangeInlineEditPanelSO.notifications);
const exchangeInlineReceiptPanelSO = new ExchangeInlineReceiptPanelSO();
const exchangeUnmatchedCardSO = new ExchangeUnmatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[0]);

const mockService = new MockService();

const EVENT_ID = "29682729";

const EXCHANGE_MARKET_ID = "1.160337355";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Wolves v Man Utd",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        urn: `ppb:tbd:card:market:${EXCHANGE_MARKET_ID}`,
        __typename: "MarketCard",
        cardTitle: "Match Odds - Wolves v Man Utd",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${EXCHANGE_MARKET_ID}`,
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
                  runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48044/0`,
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48351/0`,
                  selectionId: 48351,
                  name: "Draw",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48044/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48351/0` },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: `ppb:tbd:card:market:${EXCHANGE_MARKET_ID}`,
      },
    },
  ],
};

const HOME_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  edges: [...BFF_MOCK.edges],
  partialEdges: [...BFF_MOCK.partialEdges],
};

const ERO_MOCK = [
  {
    marketId: EXCHANGE_MARKET_ID,
    runners: [
      {
        selectionId: 48044,
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.01, size: 110 }],
      },
      {
        selectionId: 48351,
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const WALLET_MOCK = [{ amount: "5.00", walletName: "MAIN" }];

const ETX_MOCK = {
  marketId: "1.160337355",
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      status: "SUCCESS",
      price: 10,
      size: 2,
      averagePriceMatched: 0,
      sizeMatched: 0,
      orderStatus: "EXECUTABLE",
    },
  ],
};
const ETX_FAILURE_MOCK_WITH_INSUFFICIENT_FUNDS = {
  marketId: "1.160337355",
  instructionReports: [
    {
      selectionId: 48044,
      status: "FAILURE",
      instructionErrorCode: "ERROR_IN_ORDER",
      side: "LAY",
    },
  ],

  status: "FAILURE",
  orderErrorCode: "INSUFFICIENT_FUNDS",
};

const POSITION_VIEWS = {
  marketPositions: [
    {
      marketId: "1.160337355",
      selections: [
        {
          selectionId: 48044,
          orders: [
            {
              marketId: "1.160337355",
              selectionId: 48044,
              betId: "1:11111111111",
              size: 2,
              sizeRemaining: 2,
            },
          ],
        },
      ],
    },
  ],
};

const APP_CONTEXT_MOCK = {};

xdescribe("Betslip - Exchange Deposit to Place Bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getPlaceBetResponse(ETX_FAILURE_MOCK_WITH_INSUFFICIENT_FUNDS));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(searchOrders());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("When I try to place a bet with an amount higher than the available wallet funds", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(headerSO.balance, "$5.00");
      await browser.waitUntilEquals(firstBetButtonSO.odd, "1.1");
      await firstRunnerSO.betButtons[0].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element, "Selection hasn't been added");

      await inlinePlaceStakeInputFieldSO.numberField.setValue(9);
      await browser.waitUntilEquals(inlinePlaceStakeInputFieldSO.numberField, "9");
      await hideKeyboard();

      await browser.waitUntilClickableNative(placeButtonSO.element);
      await placeButtonSO.element.click();

      await browser.waitUntilEquals(placeButtonSO.label, "Deposit to Place Bet");
    });

    it("[PRPI-1694] The betslip should display CTA button with the text `Deposit to Place Bet`", async () => {
      expect(await placeButtonSO.label.getText()).toBe("Deposit to Place Bet");
    });

    it("[PRPI-1695] The betslip should display an insufficient funds notification", async () => {
      expect(await alertPlacePanelSO.message.getText()).toBe(
        "You have insufficient funds to place this bet or you have exceeded your exposure limit.",
      );
    });

    describe("When I try to edit an unmatched bet with an amount higher than the available wallet funds", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK));

        await inlinePlaceStakeInputFieldSO.numberField.setValue(2);
        await browser.waitUntilEquals(inlinePlaceStakeInputFieldSO.numberField, "2");
        await hideKeyboard();

        await browser.waitUntilClickableNative(placeButtonSO.element);
        await placeButtonSO.element.click();
        await browser.waitUntilDisplayed(exchangeInlineReceiptPanelSO.element);

        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_FAILURE_MOCK_WITH_INSUFFICIENT_FUNDS));

        await browser.waitUntilClickableNative(exchangeUnmatchedCardSO.confirm);
        await exchangeUnmatchedCardSO.confirm.click();
        await browser.waitUntilDisplayed(exchangeInlineEditPanelSO.element);

        await inlineEditStakeInputFieldSO.numberField.setValue(25);
        await browser.waitUntilEquals(inlineEditStakeInputFieldSO.numberField, "25");
        await hideKeyboard();

        await browser.waitUntilClickableNative(exchangeInlinePlaceButtonSO.element);
        await exchangeInlinePlaceButtonSO.element.click();

        await browser.waitUntilEquals(exchangeInlinePlaceButtonSO.label, "Deposit to Place Bet");
      });

      it("[PRPI-1696] The betslip should display CTA button with the text `Deposit to Place Bet`", async () => {
        expect(await exchangeInlinePlaceButtonSO.label.getText()).toBe("Deposit to Place Bet");
      });

      it("[PRPI-1697] The betslip should display an insufficient funds notification", async () => {
        expect(await alertEditPanelSO.message.getText()).toBe(
          "You have insufficient funds to place this bet or you have exceeded your exposure limit.",
        );
      });
    });
  });
});
