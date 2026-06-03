const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse, getImplyBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getAppContext, getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const {
  ExchangeInlineConfirmPanelSO,
  ExchangeInlineReceiptPanelSO,
  ExchangeUnmatchedCardSO,
  RunnerSO,
  ExchangeInlinePlacePanelSO,
  PrimaryButtonSO,
  NumberInputFieldSO,
  CardSO,
  FreeBetsSO,
  SportsbookMarketSO,
  ExchangeMatchedCardSO,
  AlertSO,
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
const placePrimaryButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.placeButton);
const placePrimaryButtonProfitSO = new PNLAndWhatIfSO(placePrimaryButtonSO.element);
const confirmPrimaryButtonSO = new PrimaryButtonSO(exchangeInlineConfirmPanelSO.confirm);
const confirmPrimaryButtonProfitSO = new PNLAndWhatIfSO(confirmPrimaryButtonSO.element);
const exchangeStakeInputFieldSO = new NumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const unmatchedCardSO = new ExchangeUnmatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[0]);
const matchedCardSO = new ExchangeMatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[1]);
const unmatchedCardFreeBetsSO = new FreeBetsSO(unmatchedCardSO.freeBets);
const matchedCardFreeBetsSO = new FreeBetsSO(matchedCardSO.freeBets);
const unmatchedCardAlertSO = new AlertSO(unmatchedCardSO.notifications);

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
      averagePriceMatched: 3.25,
      sizeMatched: 1,
      orderStatus: "EXECUTABLE",
      bonusUsed: 2,
    },
  ],
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
            },
          ],
        },
      ],
    },
  ],
};

xdescribe("Freebets - Inline betslip - Partially matched bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(getImplyBetResponse(IMPLY_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("when the user clicks on a back bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.betButtons[0]);
      await firstRunnerSO.betButtons[0].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element);
      await browser.waitUntilDisplayed(placeFreeBetsSO.element);
    });

    it("[PRPI-1751] The inline place panel should be displayed", async () => {
      expect(await exchangeInlinePlacePanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1752] The freebets icon should be displayed", async () => {
      expect(await placeFreeBetsSO.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-1753] The freebets label should display the text 'Use Free Bet Balance ($20.00)'", async () => {
      expect(await placeFreeBetsSO.label.getText()).toBe("Use Free Bet Balance ($20.00)");
    });

    it("[PRPI-1754] The freebets checkbox should be unchecked", async () => {
      expect(await placeFreeBetsSO.input.isSelected()).toBe(false);
    });

    describe("When the user clicks on freebets checkbox and inserts a $2 stake", () => {
      beforeAll(async () => {
        await exchangeStakeInputFieldSO.setValue(2);
        await browser.waitUntilDisplayed(placeFreeBetsSO.element);
        await browser.waitUntilClickableNative(placeFreeBetsSO.input);
        await placeFreeBetsSO.input.click();
        await browser.waitUntilEquals(placePrimaryButtonProfitSO.pnl, "$4.50");
      });

      it("[PRPI-1755] The secondary text of place button should display the text 'Profit: $4.50'", async () => {
        expect(await placePrimaryButtonSO.secondaryLabel.getText()).toBe("Profit:");
        expect(await placePrimaryButtonProfitSO.pnl.getText()).toBe("$4.50");
      });

      describe("When the user clicks again on freebets checkbox", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(placeFreeBetsSO.element);
          await browser.waitUntilClickableNative(placeFreeBetsSO.input);
          await placeFreeBetsSO.input.click();
          await browser.waitUntilEquals(placePrimaryButtonProfitSO.pnl, "$4.50");
        });

        it("[PRPI-1756] The secondary text of place button should remain 'Profit: $4.50'", async () => {
          expect(await placePrimaryButtonSO.secondaryLabel.getText()).toBe("Profit:");
          expect(await placePrimaryButtonProfitSO.pnl.getText()).toBe("$4.50");
        });

        it("[PRPI-1757] The PnL should be '$4.50'", async () => {
          expect(await firstRunnerPnlSO.whatIf.getText()).toBe("$4.50");
        });

        describe("When the user clicks on freebets checkbox again and clicks on place button", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(placeFreeBetsSO.input);
            await placeFreeBetsSO.input.click();

            await browser.waitUntilClickableNative(placePrimaryButtonSO.element);
            await placePrimaryButtonSO.element.click();

            await browser.waitUntilDisplayed(exchangeInlineConfirmPanelSO.element);
          });

          it("[PRPI-1758] The inline confirm panel should be displayed", async () => {
            expect(await exchangeInlineConfirmPanelSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-1758] The freebets icon should be displayed", async () => {
            expect(await confirmFreeBetsSO.icon.isDisplayed()).toBe(true);
          });

          it("[PRPI-1758] The freebets label should display the text 'Using $2.00 Free Bet'", async () => {
            expect(await confirmFreeBetsSO.label.getText()).toBe("Using $2.00 Free Bet");
          });

          it("[PRPI-1758] The freebets signposting should be checked and in readonly state", async () => {
            expect(await confirmFreeBetsSO.checkboxReadonly.isDisplayed()).toBe(true);
          });

          it("[PRPI-1758] The secondary text of confirm button should display the text 'Profit: $4.50'", async () => {
            expect(await confirmPrimaryButtonSO.secondaryLabel.getText()).toBe("Profit:");
            expect(await confirmPrimaryButtonProfitSO.pnl.getText()).toBe("$4.50");
          });

          describe("When the user clicks on confirm button and it gets partially matched", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_BACK));
              await browser.waitUntilDisplayed(confirmPrimaryButtonSO.element);
              await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
              await browser.waitUntilClickableNative(confirmPrimaryButtonSO.element);
              await confirmPrimaryButtonSO.element.click();
              await browser.waitUntilDisplayed(exchangeInlineReceiptPanelSO.element);
              await browser.waitUntilEquals(unmatchedCardAlertSO.message, "Unable to edit this Bonus Bet");
            });

            it("[PRPI-1759] The inline receipt should be displayed", async () => {
              expect(await exchangeInlineReceiptPanelSO.element.isDisplayed()).toBe(true);
            });

            describe("unmatched card", () => {
              it("[PRPI-1759] The inline unmatched card should be displayed on receipt", async () => {
                expect(await unmatchedCardSO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-1759] The freebets icon should be displayed", async () => {
                expect(await unmatchedCardFreeBetsSO.icon.isDisplayed()).toBe(true);
              });

              it("[PRPI-1759] The freebets label should display the text 'Used $1.00 Free Bet'", async () => {
                expect(await unmatchedCardFreeBetsSO.label.getText()).toBe("Used $1.00 Free Bet");
              });

              it("[PRPI-1759] The 'Unable to edit this Bonus Bet' notification should be displayed", async () => {
                expect(await unmatchedCardFreeBetsSO.element.isDisplayed()).toBe(true);
                expect(await unmatchedCardAlertSO.message.getText()).toBe("Unable to edit this Bonus Bet");
                expect(await unmatchedCardAlertSO.detail.getText()).toBe("Cancel and re-place the bet");
              });
            });

            describe("matched card", () => {
              it("[PRPI-1759] The inline matched card should be displayed on receipt", async () => {
                expect(await matchedCardSO.element.isDisplayed()).toBe(true);
              });

              it("[PRPI-1759] The freebets icon should be displayed", async () => {
                expect(await matchedCardFreeBetsSO.icon.isDisplayed()).toBe(true);
              });

              it("[PRPI-1759] The freebets label should display the text 'Used $1.00 Free Bet'", async () => {
                expect(await matchedCardFreeBetsSO.label.getText()).toBe("Used $1.00 Free Bet");
              });
            });
          });
        });
      });
    });
  });
});
