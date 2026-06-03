const {
  AppPO,
  EventPagePO,
  CardPO,
  RunnerPO,
  InlinePanelPO,
  ExchangeInlinePlacePanelPO,
  ExchangeInlineEditPanelPO,
  ExchangeUnmatchedCardPO,
  NudgesNumberInputFieldPO,
  AlertsPO,
  AlertPO,
  ExchangeMarketPO,
  ExchangeInlineReceiptPanelPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse, getReplaceBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { searchOrders, getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const inlinePanelPO = new InlinePanelPO();
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const inlinePlaceStakeInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const exchangeInlineEditPanelPO = new ExchangeInlineEditPanelPO();
const inlineEditOddInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlineEditPanelPO.inputs[0]);
const inlineEditStakeInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlineEditPanelPO.inputs[1]);
const alertsPO = new AlertsPO();
const alertPO = new AlertPO(alertsPO.items[0]);
const secondAlertPO = new AlertPO(alertsPO.items[1]);
const exchangeInlineReceiptPanelPO = new ExchangeInlineReceiptPanelPO();
const exchangeUnmatchedCardPO = new ExchangeUnmatchedCardPO(exchangeInlineReceiptPanelPO.placedBetCards[0]);

const mockService = new MockService();

const EVENT_ID = "29359895";

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.01, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      { selectionId: "58805", availableToBack: [], availableToLay: [] },
    ],
  },
];

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      sport: {
        name: "Football",
        urn: "ppb:eventType:1",
      },
    },
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: "ppb:excMarket:1.160337355",
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
                  runnerURN: "ppb:excRunner:1.160337355/48044/0",
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/48351/0",
                  selectionId: 48351,
                  name: "Man Utd",
                },
                {
                  runnerURN: "ppb:excRunner:1.160337355/58805/0",
                  selectionId: 58805,
                  name: "The Draw",
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
              { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
              { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223:MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

const ETX_MOCK = {
  marketId: "1.160337355",
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      status: "SUCCESS",
      price: 5,
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
              price: 5,
              size: 1,
              sizeRemaining: 1,
            },
          ],
        },
      ],
    },
  ],
};

describe("Betslip - Exchange Inline Edit Notifications", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { minStake: 1 }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(searchOrders());
    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );

    await firstRunnerExchangePO.exchangeBetButtons[0].waitForClickable();
    await firstRunnerExchangePO.exchangeBetButtons[0].click();
    await browser.waitUntilDisplayed(inlinePanelPO.element, "Selection hasn't been added");

    await inlinePlaceStakeInputFieldPO.setValue(2);
    await browser.waitUntilEquals(inlinePlaceStakeInputFieldPO.numberField, "2");

    await exchangeInlinePlacePanelPO.placeButton.waitForClickable();
    await exchangeInlinePlacePanelPO.placeButton.click();
    await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element);

    await exchangeUnmatchedCardPO.confirm.waitForClickable();
    await exchangeUnmatchedCardPO.confirm.click();
    await browser.waitUntilDisplayed(exchangeInlineEditPanelPO.element);
  });

  describe("When on edit panel and adding a stake value below the minimum stake", () => {
    beforeAll(async () => {
      await inlineEditStakeInputFieldPO.setValue(0.9);
      await browser.waitUntilEquals(inlineEditStakeInputFieldPO.numberField, "0.9");

      // Just blurring out of stake field (not waiting for clickable on purpose since it's disabled)
      await inlineEditOddInputFieldPO.numberField.click();

      await browser.waitUntilEquals(
        alertPO.message,
        "The minimum stake is $1.00. Your stake has been updated accordingly.",
      );
    });

    it("[PRPI-5380] The message 'The minimum stake is \u20AC1.00. Your stake has been updated accordingly.' should display", async () => {
      expect(await alertPO.icon.isDisplayed()).toBe(true);
      expect(await alertPO.message.getText()).toBe(
        "The minimum stake is $1.00. Your stake has been updated accordingly.",
      );
    });

    it("[PRPI-5381] The stake value should update to 1", async () => {
      expect(await inlineEditStakeInputFieldPO.numberField.getValue()).toBe("1");
    });

    describe("When changing the odd to an invalid increment", () => {
      beforeAll(async () => {
        await inlineEditOddInputFieldPO.setValue(52);
        await browser.waitUntilEquals(inlineEditOddInputFieldPO.numberField, "52");

        // Just blurring out of odds field (not waiting for clickable on purpose since it's disabled)
        await inlineEditStakeInputFieldPO.numberField.click();

        await browser.waitUntilEquals(secondAlertPO.message, "Odds between 50 and 100 must be in increments of 5.");
      });

      it("[PRPI-5382] The message 'Odds between 50 and 100 must be in increments of 5. Your odds have been changed accordingly.' should display", async () => {
        expect(await secondAlertPO.icon.isDisplayed()).toBe(true);
        expect(await secondAlertPO.message.getText()).toBe("Odds between 50 and 100 must be in increments of 5.");
        expect(await secondAlertPO.detail.getText()).toBe("Your odds have been changed accordingly.");
      });

      it("[PRPI-5383] The odds field should auto correct to 50", async () => {
        expect(await inlineEditOddInputFieldPO.numberField.getValue()).toBe("50");
      });
    });

    describe("When pressing place button to edit bet and a generic error is triggered", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getReplaceBetResponse(ETX_MOCK_FAILURE));

        await exchangeInlineEditPanelPO.place.waitForClickable();
        await exchangeInlineEditPanelPO.place.click();

        await browser.waitUntilEquals(
          alertPO.message,
          "There was an error placing your bet. Please check your open bets to confirm.",
        );
      });

      it("[PRPI-5384] The message 'There was an error placing your bet. Please check your open bets to confirm.' should display", async () => {
        expect(await alertPO.icon.isDisplayed()).toBe(true);
        expect(await alertPO.message.getText()).toBe(
          "There was an error placing your bet. Please check your open bets to confirm.",
        );
      });
    });
  });
});
