const {
  AppPO,
  BetSegmentsPO,
  CardPO,
  EventPagePO,
  ExchangeInlineConfirmPanelPO,
  ExchangeInlinePlacePanelPO,
  ExchangeMarketPO,
  ExchangeMatchedCardPO,
  FreeBetsPO,
  NumberInputFieldPO,
  PNLAndWhatIfPO,
  PrimaryButtonPO,
  RunnerPO,
  ExchangeInlineReceiptPanelPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getImplyBetResponse, getPlaceBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const pnlAndWhatIfPO = new PNLAndWhatIfPO(firstRunnerExchangePO.pnlAndWhatIf);

const mockService = new MockService();
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const exchangeInlineConfirmPanelPO = new ExchangeInlineConfirmPanelPO();
const exchangeInlineReceiptPanelPO = new ExchangeInlineReceiptPanelPO();
const matchedCardPO = new ExchangeMatchedCardPO(exchangeInlineReceiptPanelPO.placedBetCards[0]);
const freeBetsPO = new FreeBetsPO(exchangeInlinePlacePanelPO.freeBets);
const confirmFreeBetsPO = new FreeBetsPO(exchangeInlineConfirmPanelPO.freeBets);
const receiptFreeBetsPO = new FreeBetsPO(exchangeInlineReceiptPanelPO.element);
const placeButtonPO = new PrimaryButtonPO(exchangeInlinePlacePanelPO.placeButton);
const confirmButtonPO = new PrimaryButtonPO(exchangeInlineConfirmPanelPO.confirm);
const exchangeStakeInputFieldPO = new NumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const betSegmentsPO = new BetSegmentsPO(exchangeInlineReceiptPanelPO.element);

const EVENT_ID = "29359895";
const MARKET_ID = "1.160337355";

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 3, size: 100 }],
        availableToLay: [{ price: 3.25, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        displayRunners: {
          exchange: {
            runners: [
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
              },
              {
                runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
              },
            ],

            market: {
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
                  name: "Wolves",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0`,
                  selectionId: 48044,
                },
                {
                  name: "Man Utd",
                  runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0`,
                  selectionId: 48351,
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
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        __typename: "MarketCard",
      },
    },
  ],
};

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

const ETX_LAY_MOCK = {
  marketId: MARKET_ID,
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      selectionId: "48044",
      status: "SUCCESS",
      price: 3.25,
      size: 2,
      side: "LAY",
      averagePriceMatched: 3.25,
      sizeMatched: 2,
      orderStatus: "EXECUTION_COMPLETE",
      bonusUsed: 4.5,
    },
  ],
};

describe("Inline Betslip - Free Bets - Matched Receipt", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        currencyCode: "EUR",
        localeCodeBcp47: "en-GB",
        exchangeConfirmBetPlacement: true,
      }),
    );
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getImplyBetResponse(IMPLY_MOCK));

    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        betButtonIndex: 1,
        price: 3.25,
      }),
    );
  });

  describe("when the user clicks on a lay bet button", () => {
    beforeAll(async () => {
      await firstRunnerExchangePO.exchangeBetButtons[1].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[1].click();

      await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element, "Place panel wasn't displayed");
      await browser.waitUntilDisplayed(freeBetsPO.element, "Free bets component wasn't displayed");
    });

    it("[PRPI-5286] the free bets icon should be displayed", async () => {
      expect(await freeBetsPO.bonusIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-5287] the free bets label should be displayed", async () => {
      expect(await freeBetsPO.label.getText()).toBe("Use your €20.00 Free Bet Balance to reduce liability");
    });

    it("[PRPI-5288] the free bets checkbox should be unchecked", async () => {
      expect(await freeBetsPO.input.isSelected()).toBe(false);
    });

    describe("when the user checks the free bets checkbox", () => {
      beforeAll(async () => {
        await exchangeStakeInputFieldPO.setValue("2");

        await freeBetsPO.element.waitForClickable();
        await freeBetsPO.element.click();
        await browser.waitUntil(async () => freeBetsPO.input.isSelected());
      });

      it("[PRPI-5289] the place button should display \u20AC0.00 liability", async () => {
        await browser.waitUntilEquals(placeButtonPO.secondaryLabel, "Liability:");
        await browser.waitUntilEquals(placeButtonPO.pnl, "€0.00");
      });

      describe("when the user unchecks the free bets checkbox", () => {
        beforeAll(async () => {
          await freeBetsPO.element.waitForClickable();
          await freeBetsPO.element.click();
          await browser.waitUntil(async () => (await freeBetsPO.input.isSelected()) === false);
        });

        it("[PRPI-5290] the place button should display \u20AC4.50 liability", async () => {
          await browser.waitUntilEquals(placeButtonPO.secondaryLabel, "Liability:");
          await browser.waitUntilEquals(placeButtonPO.pnl, "€4.50");
        });

        it("[PRPI-5291] the PnL should be -\u20AC4.50", async () => {
          expect(await pnlAndWhatIfPO.element.getText()).toBe("-€4.50");
        });

        describe("when the user navigates to the confirmation panel with free bets checked", () => {
          beforeAll(async () => {
            await freeBetsPO.element.waitForClickable();
            await freeBetsPO.element.click();
            await browser.waitUntil(async () => freeBetsPO.input.isSelected());

            await placeButtonPO.element.waitForClickable();
            await placeButtonPO.element.click();
            await browser.waitUntilDisplayed(
              exchangeInlineConfirmPanelPO.element,
              "Confirmation panel wasn't displayed",
            );
          });

          it("[PRPI-5292] the free bets icon should be displayed", async () => {
            expect(await confirmFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
          });

          it("[PRPI-5292] the free bets label should be displayed", async () => {
            expect(await confirmFreeBetsPO.label.getText()).toBe("Using €4.50 Free Bet");
          });

          it("[PRPI-5292] the free bets signposting should be checked and in readonly state", async () => {
            expect(await confirmFreeBetsPO.checkboxReadonly.isDisplayed()).toBe(true);
          });

          it("[PRPI-5292] the confirm button should display \u20AC0.00 liability", async () => {
            expect(await confirmButtonPO.secondaryLabel.getText()).toBe("Liability:");
            expect(await confirmButtonPO.pnl.getText()).toBe("€0.00");
          });

          describe("when the user confirms the bet, and the bet gets matched", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getPlaceBetResponse(ETX_LAY_MOCK));
              await confirmButtonPO.element.waitForClickable();
              await confirmButtonPO.element.click();
            });

            it("[PRPI-5292] the unmatched bet receipt should be displayed", async () => {
              await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element, "Receipt panel wasn't displayed");
              await browser.waitUntilEquals(matchedCardPO.header, "Bet Matched");
            });

            it("[PRPI-5292] the free bets icon should be displayed", async () => {
              expect(await receiptFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
            });

            it("[PRPI-5292] the free bets label should be displayed", async () => {
              expect(await receiptFreeBetsPO.label.getText()).toBe("Used €4.50 Free Bet");
            });

            it("[PRPI-5292] the liability should be \u20AC0.00", async () => {
              expect(await betSegmentsPO.midRightLabel.getText()).toBe("Liability");
              expect(await betSegmentsPO.midRightValue.getText()).toBe("€0.00");
            });

            it("[PRPI-5292] the profit should be €2.00", async () => {
              expect(await betSegmentsPO.rightLabel.getText()).toBe("Profit");
              expect(await betSegmentsPO.rightValue.getText()).toBe("€2.00");
            });
          });
        });
      });
    });
  });
});
