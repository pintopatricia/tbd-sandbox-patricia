const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getImplyBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const {
  AppPO,
  CardPO,
  EventPagePO,
  ExchangeInlineConfirmPanelPO,
  ExchangeMarketPO,
  ExchangeInlinePlacePanelPO,
  FreeBetsPO,
  NumberInputFieldPO,
  PNLAndWhatIfPO,
  PrimaryButtonPO,
  RunnerPO,
} = require("../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);

const runnerPO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const pnlAndWhatIfPO = new PNLAndWhatIfPO(runnerPO.pnlAndWhatIf);

const placePanelPO = new ExchangeInlinePlacePanelPO();
const placeFreeBetsPO = new FreeBetsPO(placePanelPO.freeBets);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.placeButton);
const stakeInputPO = new NumberInputFieldPO(placePanelPO.inputs[1]);

const confirmPanelPO = new ExchangeInlineConfirmPanelPO();
const confirmFreeBetsPO = new FreeBetsPO(confirmPanelPO.freeBets);
const confirmButtonPO = new PrimaryButtonPO(confirmPanelPO.confirm);

const EVENT_ID = "29359895";
const MARKET_ID = "1.160337355";

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 3.25, size: 100 }],
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

describe("Inline Betslip - Free Bets - Potential Bets", () => {
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
        betButtonIndex: 0,
        price: 3.25,
      }),
    );
  });

  describe("when the user has available bonus and clicks on a back bet button", () => {
    beforeAll(async () => {
      await runnerPO.exchangeBetButtons[0].waitForClickable();
      await runnerPO.exchangeBetButtons[0].click();

      await browser.waitUntilDisplayed(placePanelPO.element, "Place panel wasn't displayed");
      await browser.waitUntilDisplayed(placeFreeBetsPO.element, "Free bets component wasn't displayed");
    });

    it("[PRPI-5329] the free bets icon should be displayed", async () => {
      expect(await placeFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-5330] the free bets label should be displayed", async () => {
      expect(await placeFreeBetsPO.label.getText()).toBe("Use Free Bet Balance (€20.00)");
    });

    it("[PRPI-5331] the free bets checkbox should be unchecked", async () => {
      expect(await placeFreeBetsPO.input.isSelected()).toBe(false);
    });

    describe("and when checking the free bets checkbox", () => {
      beforeAll(async () => {
        await stakeInputPO.setValue("2");

        await placeFreeBetsPO.element.waitForClickable();
        await placeFreeBetsPO.element.click();
        await browser.waitUntil(async () => placeFreeBetsPO.input.isSelected());
      });

      it("[PRPI-5332] the place button should display \u20AC4.50 profit", async () => {
        await browser.waitUntilEquals(placeButtonPO.secondaryLabel, "Profit:");
        await browser.waitUntilEquals(placeButtonPO.pnl, "€4.50");
      });

      describe("and when unchecking the free bets checkbox", () => {
        beforeAll(async () => {
          await placeFreeBetsPO.element.waitForClickable();
          await placeFreeBetsPO.element.click();
          await browser.waitUntil(async () => (await placeFreeBetsPO.input.isSelected()) === false);
        });

        it("[PRPI-5333] the place button should still display \u20AC4.50 profit", async () => {
          expect(await placeButtonPO.secondaryLabel.getText()).toBe("Profit:");
          expect(await placeButtonPO.pnl.getText()).toBe("€4.50");
        });

        it("[PRPI-5334] the PnL should be \u20AC4.50", async () => {
          expect(await pnlAndWhatIfPO.element.getText()).toBe("€4.50");
        });

        describe("and when navigating to the confirmation panel with free bets checked", () => {
          beforeAll(async () => {
            await placeFreeBetsPO.element.waitForClickable();
            await placeFreeBetsPO.element.click();
            await browser.waitUntil(async () => placeFreeBetsPO.input.isSelected());

            await placeButtonPO.element.waitForClickable();
            await placeButtonPO.element.click();
            await browser.waitUntilDisplayed(confirmPanelPO.element, "Confirmation panel wasn't displayed");
          });

          it("[PRPI-5335] the free bets icon should be displayed", async () => {
            expect(await confirmFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
          });

          it("[PRPI-5335] the free bets label should be displayed", async () => {
            expect(await confirmFreeBetsPO.label.getText()).toBe("Using €2.00 Free Bet");
          });

          it("[PRPI-5335] the free bets signposting should be checked and in readonly state", async () => {
            expect(await confirmFreeBetsPO.checkboxReadonly.isDisplayed()).toBe(true);
          });

          it("[PRPI-5335] the confirm button should display \u20AC4.50 profit", async () => {
            expect(await confirmButtonPO.secondaryLabel.getText()).toBe("Profit:");
            expect(await confirmButtonPO.pnl.getText()).toBe("€4.50");
          });
        });
      });
    });
  });

  describe("when the user has available bonus and clicks on a lay bet button", () => {
    beforeAll(async () => {
      await runnerPO.exchangeBetButtons[1].waitForClickable();
      await runnerPO.exchangeBetButtons[1].click();

      await browser.waitUntilDisplayed(placePanelPO.element, "Place panel wasn't displayed");
      await browser.waitUntilDisplayed(placeFreeBetsPO.element, "Free bets component wasn't displayed");
    });

    it("[PRPI-5336] the free bets icon should be displayed", async () => {
      expect(await placeFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-5337] the free bets label should be displayed", async () => {
      expect(await placeFreeBetsPO.label.getText()).toBe("Use your €20.00 Free Bet Balance to reduce liability");
    });

    it("[PRPI-5338] the free bets checkbox should be unchecked", async () => {
      expect(await placeFreeBetsPO.input.isSelected()).toBe(false);
    });

    describe("and when checking the free bets checkbox", () => {
      beforeAll(async () => {
        await stakeInputPO.setValue("2");

        await placeFreeBetsPO.element.waitForClickable();
        await placeFreeBetsPO.element.click();
        await browser.waitUntil(async () => placeFreeBetsPO.input.isSelected());
      });

      it("[PRPI-5339] the place button should display \u20AC0.50 liability", async () => {
        await browser.waitUntilEquals(placeButtonPO.secondaryLabel, "Liability:");
        await browser.waitUntilEquals(placeButtonPO.pnl, "€0.00");
      });

      describe("and when unchecking the free bets checkbox", () => {
        beforeAll(async () => {
          await placeFreeBetsPO.element.waitForClickable();
          await placeFreeBetsPO.element.click();
          await browser.waitUntil(async () => (await placeFreeBetsPO.input.isSelected()) === false);
        });

        it("[PRPI-5340] the place button should display \u20AC4.50 liability", async () => {
          expect(await placeButtonPO.secondaryLabel.getText()).toBe("Liability:");
          expect(await placeButtonPO.pnl.getText()).toBe("€4.50");
        });

        it("[PRPI-5341] the PnL should be -\u20AC4.50", async () => {
          expect(await pnlAndWhatIfPO.element.getText()).toBe("-€4.50");
        });

        describe("and when navigating to the confirmation panel with free bets checked", () => {
          beforeAll(async () => {
            await placeFreeBetsPO.element.waitForClickable();
            await placeFreeBetsPO.element.click();
            await browser.waitUntil(async () => placeFreeBetsPO.input.isSelected());

            await placeButtonPO.element.waitForClickable();
            await placeButtonPO.element.click();
            await browser.waitUntilDisplayed(confirmPanelPO.element, "Confirmation panel wasn't displayed");
          });

          it("[PRPI-5342] the free bets icon should be displayed", async () => {
            expect(await confirmFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
          });

          it("[PRPI-5342] the free bets label should be displayed", async () => {
            expect(await confirmFreeBetsPO.label.getText()).toBe("Using €4.50 Free Bet");
          });

          it("[PRPI-5342] the free bets signposting should be checked and in readonly state", async () => {
            expect(await confirmFreeBetsPO.checkboxReadonly.isDisplayed()).toBe(true);
          });

          it("[PRPI-5342] the confirm button should display \u20AC0.00 liability", async () => {
            expect(await confirmButtonPO.secondaryLabel.getText()).toBe("Liability:");
            expect(await confirmButtonPO.pnl.getText()).toBe("€0.00");
          });
        });
      });
    });
  });
});
