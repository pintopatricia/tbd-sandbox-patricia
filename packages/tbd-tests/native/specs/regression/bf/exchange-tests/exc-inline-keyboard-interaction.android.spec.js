const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { searchOrders, getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getAppContext, getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const {
  ExchangeInlineConfirmPanelSO,
  ExchangeInlineReceiptPanelSO,
  ExchangeMarketSO,
  ExchangeUnmatchedCardSO,
  ActionButtonSO,
  ExchangeInlineEditPanelSO,
  ExchangeInlinePlacePanelSO,
  InlinePanelSO,
  KeyboardSO,
  NudgesNumberInputFieldSO,
  PrimaryButtonSO,
  RunnerSO,
} = require("../../../../screen-objects");

const exchangeMarketSO = new ExchangeMarketSO();
const firstRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);

const inlinePanelSO = new InlinePanelSO();
const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO(inlinePanelSO.element);
const exchangeInlineConfirmPanelSO = new ExchangeInlineConfirmPanelSO();
const exchangeInlineReceiptPanelSO = new ExchangeInlineReceiptPanelSO();
const exchangeInlineEditPanelSO = new ExchangeInlineEditPanelSO();
const exchangeUnmatchedCardSO = new ExchangeUnmatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[0]);
const keyboardSO = new KeyboardSO(exchangeInlinePlacePanelSO.element);
const placePriceInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[0]);
const placeSizeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const placeButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.placeButton);
const confirmButtonSO = new ActionButtonSO(exchangeInlineConfirmPanelSO.confirm);
const editSizeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlineEditPanelSO.inputs[1]);

const mockService = new MockService();

const EVENT_ID = "29682729";

const EXCHANGE_MARKET_ID = "1.160337355";

const APP_CONTEXT_MOCK = {
  exchangeConfirmBetPlacement: true,
};

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

const ETX_PLACE_LAY_MOCK = {
  marketId: EXCHANGE_MARKET_ID,
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      status: "SUCCESS",
      price: 2.5,
      size: 2.5,
      side: "LAY",
      averagePriceMatched: 0,
      sizeMatched: 0,
      orderStatus: "EXECUTABLE",
    },
  ],
};

const LBR_POSITION_VIEWS_MOCK = {
  marketPositions: [
    {
      marketId: EXCHANGE_MARKET_ID,
      selections: [
        {
          selectionId: 48044,
          orders: [
            {
              marketId: EXCHANGE_MARKET_ID,
              selectionId: 48044,
              betId: "1:11111111111",
              price: 2.5,
              size: 2.5,
              side: "LAY",
            },
          ],
        },
      ],
    },
  ],
};

xdescribe("Exchange Inline Betslip - Keyboard Interaction", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getPlaceBetResponse(ETX_PLACE_LAY_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(LBR_POSITION_VIEWS_MOCK));
    await mockService.mockHttpRequest(searchOrders());
    await startApp("home");
  });

  describe("When tap a given EXC bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.betButtons[1]);
      await firstRunnerSO.betButtons[1].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element);
    });

    it("[PRPI-1786] The inline betslip with keyboard should be displayed", async () => {
      expect(await exchangeInlinePlacePanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1787] And the keyboard should be displayed", async () => {
      expect(await keyboardSO.element.isDisplayed()).toBe(true);
    });

    describe("When tap 2.50 in keyboard", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(keyboardSO.two);
        await keyboardSO.two.click();
        await keyboardSO.separator.click();
        await keyboardSO.five.click();
        await keyboardSO.zero.click();

        await browser.waitUntilEquals(placeSizeInputFieldSO.numberField, "2.50");
      });

      it("[PRPI-1788] The stake field should stay populated with 2.50", async () => {
        expect(await placeSizeInputFieldSO.numberField.getText()).toEqual("2.50");
      });

      describe("When tap on backspace key one time", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(keyboardSO.delete);
          await keyboardSO.delete.click();
          await browser.waitUntilEquals(placeSizeInputFieldSO.numberField, "2.5");
        });

        it("[PRPI-1789] The stake field should stay populated with 2.5", async () => {
          expect(await placeSizeInputFieldSO.numberField.getText()).toEqual("2.5");
        });

        describe("When the odds field is focused and the price of 2.50 is added", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(placePriceInputFieldSO.numberField);
            await placePriceInputFieldSO.numberField.click();
            await browser.waitUntilDisplayed(keyboardSO.element);

            await keyboardSO.clearInputField(placePriceInputFieldSO.numberField);

            await browser.waitUntilClickableNative(keyboardSO.two);
            await keyboardSO.two.click();
            await keyboardSO.separator.click();
            await keyboardSO.five.click();
            await keyboardSO.zero.click();

            await browser.waitUntilEquals(placePriceInputFieldSO.numberField, "2.50");
          });

          it("[PRPI-1790] The odds field should stay populated with 2.50", async () => {
            expect(await placePriceInputFieldSO.numberField.getText()).toEqual("2.50");
          });

          describe("When open the edit panel", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(placeButtonSO.element);
              await placeButtonSO.element.click();
              await browser.waitUntilDisplayed(
                exchangeInlineConfirmPanelSO.element,
                "Exchange confirm panel was not displayed",
              );

              await browser.waitUntilClickableNative(confirmButtonSO.element);
              await confirmButtonSO.element.click();
              await browser.waitUntilDisplayed(
                exchangeInlineReceiptPanelSO.element,
                "Exchange receipt panel was not displayed",
              );

              await browser.waitUntilClickableNative(exchangeUnmatchedCardSO.confirm);
              await exchangeUnmatchedCardSO.confirm.click();
              await browser.waitUntilDisplayed(exchangeInlineEditPanelSO.element);
            });

            it("[PRPI-1791] The keyboard should display", async () => {
              expect(await keyboardSO.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-1792] And the stake field should be focused and populated with 2.5", async () => {
              expect(await editSizeInputFieldSO.numberField.getText()).toEqual("2.5");
            });

            describe("When tap on backspace key two times", () => {
              beforeAll(async () => {
                await browser.waitUntilClickableNative(keyboardSO.delete);
                await keyboardSO.delete.click();
                await browser.waitUntilEquals(editSizeInputFieldSO.numberField, "2.");
                await keyboardSO.delete.click();
                await browser.waitUntilEquals(editSizeInputFieldSO.numberField, "2");
              });

              it("[PRPI-1793] The stake field should be focused and populated with 2", async () => {
                expect(await editSizeInputFieldSO.numberField.getText()).toEqual("2");
              });
            });
          });
        });
      });
    });
  });
});
