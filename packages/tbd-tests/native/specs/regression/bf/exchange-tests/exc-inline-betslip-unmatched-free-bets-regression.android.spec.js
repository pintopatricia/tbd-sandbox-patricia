const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse, getImplyBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getAppContext, getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { hideKeyboard } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");

const {
  ExchangeInlineConfirmPanelSO,
  ExchangeInlineReceiptPanelSO,
  SelectionSegmentSO,
  BetSegmentsSO,
  CardSO,
  ExchangeInlinePlacePanelSO,
  FreeBetsSO,
  NumberInputFieldSO,
  PrimaryButtonSO,
  RunnerSO,
  SportsbookMarketSO,
  PNLAndWhatIfSO,
} = require("../../../../screen-objects");

const firstCardSO = new CardSO();
const sportsbookMarketSO = new SportsbookMarketSO(firstCardSO.exchangeMarket);
const firstRunnerSO = new RunnerSO(sportsbookMarketSO.runnerList[0]);
const firstRunnerPnlSO = new PNLAndWhatIfSO(firstRunnerSO.pnlAndWhatIf);

const mockService = new MockService();
const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const exchangeInlineConfirmPanelSO = new ExchangeInlineConfirmPanelSO();
const exchangeInlineReceiptPanelSO = new ExchangeInlineReceiptPanelSO();
const placeFreeBetsSO = new FreeBetsSO(exchangeInlinePlacePanelSO.freeBets);
const confirmFreeBetsSO = new FreeBetsSO(exchangeInlineConfirmPanelSO.freeBets);
const receiptFreeBetsSO = new FreeBetsSO(exchangeInlineReceiptPanelSO.element);
const placePrimaryButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.placeButton);
const placePrimaryButtonProfitSO = new PNLAndWhatIfSO(placePrimaryButtonSO.element);
const confirmPrimaryButtonSO = new PrimaryButtonSO(exchangeInlineConfirmPanelSO.confirm);
const confirmPrimaryButtonProfitSO = new PNLAndWhatIfSO(confirmPrimaryButtonSO.element);
const exchangeStakeInputFieldSO = new NumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const betSegmentsSO = new BetSegmentsSO(exchangeInlineReceiptPanelSO.element);
const betSegmentsProfitContainerSO = new SelectionSegmentSO(betSegmentsSO.rightSegment);
const betSegmentsProfitSO = new PNLAndWhatIfSO(betSegmentsSO.rightSegment);

const EVENT_ID = "29682729";
const MARKET_ID = "1.160337355";

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
        urn: `ppb:tbd:card:market:${MARKET_ID}`,
        __typename: "MarketCard",
        cardTitle: "Match Odds - Wolves v Man Utd",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:${MARKET_ID}`,
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
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                  name: "Wolves",
                },
                {
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
                  selectionId: 48351,
                  name: "Draw",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0` },
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
        urn: `ppb:tbd:card:market:${MARKET_ID}`,
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

const APP_CONTEXT_MOCK = {
  exchangeConfirmBetPlacement: true,
};

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 3.25, size: 100 }],
        availableToLay: [{ price: 4, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const IMPLY_MOCK = {
  hasBonusMoney: true,
  wallets: [
    {
      amount: 20,
      conditions: [],
      walletType: "BONUS_CASH",
    },
  ],
};

const ETX_MOCK_BACK = {
  marketId: MARKET_ID,
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      selectionId: "48044",
      status: "SUCCESS",
      price: 3.25,
      size: 2,
      side: "BACK",
      averagePriceMatched: 0,
      sizeMatched: 0,
      orderStatus: "EXECUTABLE",
      bonusUsed: 4.5,
    },
  ],
};

xdescribe("Freebets - Inline betslip - Unmatched bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getImplyBetResponse(IMPLY_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("when the user clicks in a back bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.betButtons[0]);
      await firstRunnerSO.betButtons[0].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element);
      await browser.waitUntilDisplayed(placeFreeBetsSO.element);
    });

    it("[PRPI-1760] The inline place panel should be displayed", async () => {
      expect(await exchangeInlinePlacePanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1761] The freebets icon should be displayed", async () => {
      expect(await placeFreeBetsSO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-1762] The freebets label should display the text 'Use Free Bet Balance ($20.00)'", async () => {
      expect(await placeFreeBetsSO.label.getText()).toBe("Use Free Bet Balance ($20.00)");
    });

    it("[PRPI-1763] The freebets checkbox should be unchecked", async () => {
      expect(await placeFreeBetsSO.input.isSelected()).toBe(false);
    });

    describe("When the user clicks on freebets checkbox and inserts a $2 stake", () => {
      beforeAll(async () => {
        await exchangeStakeInputFieldSO.setValue(2);
        await hideKeyboard();
        await browser.waitUntilClickableNative(placeFreeBetsSO.element);
        await placeFreeBetsSO.input.click();
      });

      it("[PRPI-1764] The secondary text of place button should display the text 'Profit: $4.50'", async () => {
        expect(await placePrimaryButtonSO.secondaryLabel.getText()).toBe("Profit:");
        expect(await placePrimaryButtonProfitSO.pnl.getText()).toBe("$4.50");
      });

      describe("When the user clicks again on freebets checkbox", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(placeFreeBetsSO.element);
          await placeFreeBetsSO.input.click();
          await browser.waitUntilEquals(placePrimaryButtonSO.secondaryLabel, "Profit:");
          await browser.waitUntilEquals(placePrimaryButtonProfitSO.pnl, "$4.50");
        });

        it("[PRPI-1765] The secondary text of place button should remain 'Profit: $4.50'", async () => {
          expect(await placePrimaryButtonSO.secondaryLabel.getText()).toBe("Profit:");
          expect(await placePrimaryButtonProfitSO.pnl.getText()).toBe("$4.50");
        });

        it("[PRPI-1766] The PnL should be '$4.50'", async () => {
          expect(await firstRunnerPnlSO.whatIf.getText()).toBe("$4.50");
        });

        describe("When the user clicks on freebets checkbox again and clicks on place button", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(placeFreeBetsSO.element);
            await placeFreeBetsSO.input.click();

            await browser.waitUntilClickableNative(placePrimaryButtonSO.element);
            await placePrimaryButtonSO.element.click();

            await browser.waitUntilDisplayed(exchangeInlineConfirmPanelSO.element);
          });

          it("[PRPI-1767] The inline confirm panel should be displayed", async () => {
            expect(await exchangeInlineConfirmPanelSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-1767] The freebets icon should be displayed", async () => {
            expect(await confirmFreeBetsSO.icon.isDisplayed()).toBe(true);
          });

          it("[PRPI-1767] The freebets label should display the text 'Using $2.00 Free Bet'", async () => {
            expect(await confirmFreeBetsSO.label.getText()).toBe("Using $2.00 Free Bet");
          });

          it("[PRPI-1767] The freebets signposting should be checked and in readonly state", async () => {
            expect(await confirmFreeBetsSO.checkboxReadonly.isDisplayed()).toBe(true);
          });

          it("[PRPI-1767] The secondary text of confirm button should display the text 'Profit: $4.50'", async () => {
            expect(await confirmPrimaryButtonSO.secondaryLabel.getText()).toBe("Profit:");
            expect(await confirmPrimaryButtonProfitSO.pnl.getText()).toBe("$4.50");
          });

          describe("When the user clicks on confirm button", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_BACK));
              await browser.waitUntilClickableNative(confirmPrimaryButtonSO.element);
              await confirmPrimaryButtonSO.element.click();
              await browser.waitUntilDisplayed(exchangeInlineReceiptPanelSO.element);
              await browser.waitUntilEquals(receiptFreeBetsSO.label, "Used $2.00 Free Bet");
            });

            it("[PRPI-1768] The inline receipt should be displayed", async () => {
              expect(await exchangeInlineReceiptPanelSO.element.isDisplayed()).toBe(true);
            });

            it("[PRPI-1768] The freebets icon should be displayed", async () => {
              expect(await receiptFreeBetsSO.icon.isDisplayed()).toBe(true);
            });

            it("[PRPI-1768] The freebets label should display the text 'Used $2.00 Free Bet'", async () => {
              expect(await receiptFreeBetsSO.label.getText()).toBe("Used $2.00 Free Bet");
            });

            it("[PRPI-1768] The profit should be '$4.50'", async () => {
              expect(await betSegmentsProfitContainerSO.term.getText()).toBe("Profit");
              expect(await betSegmentsProfitSO.pnl.getText()).toBe("$4.50");
            });
          });
        });
      });
    });
  });
});
