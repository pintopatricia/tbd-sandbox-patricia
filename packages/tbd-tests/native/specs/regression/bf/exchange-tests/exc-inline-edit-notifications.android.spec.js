const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { searchOrders, getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getAppContext, getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const {
  ExchangeMarketSO,
  ExchangeInlineReceiptPanelSO,
  RunnerSO,
  ExchangeInlinePlacePanelSO,
  ActionButtonSO,
  NudgesNumberInputFieldSO,
  AlertSO,
  ExchangeInlineEditPanelSO,
  ExchangeUnmatchedCardSO,
} = require("../../../../screen-objects");

const exchangeMarketSO = new ExchangeMarketSO();
const firstRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const inlinePlaceStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const exchangeInlineEditPanelSO = new ExchangeInlineEditPanelSO();
const inlineEditOddInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlineEditPanelSO.inputs[0]);
const inlineEditStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlineEditPanelSO.inputs[1]);
const placeButtonSO = new ActionButtonSO(exchangeInlinePlacePanelSO.placeButton);
const inlineEditPanelPlaceButtonSO = new ActionButtonSO(exchangeInlineEditPanelSO.placeButton);
const alertSO = new AlertSO(exchangeInlineEditPanelSO.notifications);
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

const ETX_MOCK_FAILURE = {
  marketId: "1.160337355",
  instructionReports: [
    {
      status: "FAILURE",
      errorCode: "UNKNOWN_ERROR_CODE",
    },
  ],

  status: "FAILURE",
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
              size: 1,
              sizeRemaining: 1,
            },
          ],
        },
      ],
    },
  ],
};

const APP_CONTEXT_MOCK = {
  minStake: 1,
};

// TODO:
// feature is broken for a while, the test was passing because it was not enabling the CUSTOM_KEYBOARD throttle
// now that the custom keyboard is always enabled, we noticed we have a bug in this functionality
// enable this spec as soon the bug is fixed
// TODO: failing tests to be fixed in another US
xdescribe("Betslip - Exchange Inline Edit Notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(searchOrders());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");

    await browser.waitUntilClickableNative(firstRunnerSO.betButtons[0]);
    await firstRunnerSO.betButtons[0].click();
    await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element, "Selection hasn't been added");

    await inlinePlaceStakeInputFieldSO.numberField.setValue(2);
    await browser.waitUntilEquals(inlinePlaceStakeInputFieldSO.numberField, "2");

    await browser.waitUntilClickableNative(placeButtonSO.element);
    await placeButtonSO.element.click();
    await browser.waitUntilDisplayed(exchangeInlineReceiptPanelSO.element);

    await browser.waitUntilClickableNative(exchangeUnmatchedCardSO.confirm);
    await exchangeUnmatchedCardSO.confirm.click();
    await browser.waitUntilDisplayed(exchangeInlineEditPanelSO.element);
  });

  describe("When on edit panel and adding a stake value below the minimum stake", () => {
    beforeAll(async () => {
      await inlineEditStakeInputFieldSO.numberField.setValue(0.9);
      await browser.waitUntilEquals(inlineEditStakeInputFieldSO.numberField, "0.9");

      // Just blurring out of stake field (not waiting for clickable on purpose since it's disabled)
      await inlineEditOddInputFieldSO.numberField.click();

      await browser.waitUntilEquals(
        alertSO.message,
        "The minimum stake is $1.00. Your stake has been updated accordingly.",
      );
    });

    it("[PRPI-1781] The message 'The minimum stake is \u20AC1.00. Your stake has been updated accordingly.' should display", async () => {
      expect(await alertSO.message.getText()).toBe(
        "The minimum stake is $1.00. Your stake has been updated accordingly.",
      );
    });

    it("[PRPI-1782] The stake value should update to 1", async () => {
      expect(await inlineEditStakeInputFieldSO.numberField.getText()).toBe("1");
    });
  });

  describe("When changing the odd to an invalid increment", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(inlineEditOddInputFieldSO.numberField);
      await inlineEditOddInputFieldSO.numberField.click();
      await inlineEditOddInputFieldSO.numberField.setValue(52);
      await browser.waitUntilEquals(inlineEditOddInputFieldSO.numberField, "52");

      // Just blurring out of odds field (not waiting for clickable on purpose since it's disabled)
      await inlineEditStakeInputFieldSO.numberField.click();

      await browser.waitUntilEquals(alertSO.message, "Odds between 50 and 100 must be in increments of 5.");
    });

    it("[PRPI-1783] The message 'Odds between 50 and 100 must be in increments of 5. Your odds have been changed accordingly.' should display", async () => {
      expect(await alertSO.message.getText()).toBe("Odds between 50 and 100 must be in increments of 5.");
      expect(await alertSO.detail.getText()).toBe("Your odds have been changed accordingly.");
    });

    it("[PRPI-1784] The odds field should auto correct to 50", async () => {
      expect(await inlineEditOddInputFieldSO.numberField.getText()).toBe("50");
    });

    describe("When pressing place button to edit bet and a generic error is triggered", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE));

        await browser.waitUntilClickableNative(inlineEditOddInputFieldSO.element);
        await inlineEditOddInputFieldSO.numberField.click();

        await browser.waitUntilClickableNative(inlineEditPanelPlaceButtonSO.element);
        await inlineEditPanelPlaceButtonSO.element.click();

        await browser.waitUntilEquals(
          alertSO.message,
          "There was an error placing your bet. Please check your open bets to confirm.",
        );
      });

      it("[PRPI-1785] The message 'There was an error placing your bet. Please check your open bets to confirm.' should display", async () => {
        expect(await alertSO.message.getText()).toBe(
          "There was an error placing your bet. Please check your open bets to confirm.",
        );
      });
    });
  });
});
