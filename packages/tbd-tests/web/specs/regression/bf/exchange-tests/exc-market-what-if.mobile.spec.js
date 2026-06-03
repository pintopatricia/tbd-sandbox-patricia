const {
  EventPagePO,
  AppPO,
  ExchangeMarketPO,
  RunnerPO,
  CardPO,
  PNLAndWhatIfPO,
  ExchangeInlinePlacePanelPO,
  NudgesNumberInputFieldPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const exchangePriceInputField = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[0]);
const exchangeStakeInputField = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const runnerExchangePO = {
  first: new RunnerPO(exchangeMarketPO.runnerList[0]),
  second: new RunnerPO(exchangeMarketPO.runnerList[1]),
  third: new RunnerPO(exchangeMarketPO.runnerList[2]),
};
const pnlPO = {
  first: new PNLAndWhatIfPO(runnerExchangePO.first.pnlAndWhatIf).pnl,
  second: new PNLAndWhatIfPO(runnerExchangePO.second.pnlAndWhatIf).pnl,
  third: new PNLAndWhatIfPO(runnerExchangePO.third.pnlAndWhatIf).pnl,
};
const whatIfPO = {
  first: new PNLAndWhatIfPO(runnerExchangePO.first.pnlAndWhatIf).whatIf,
  second: new PNLAndWhatIfPO(runnerExchangePO.second.pnlAndWhatIf).whatIf,
  third: new PNLAndWhatIfPO(runnerExchangePO.third.pnlAndWhatIf).whatIf,
};
const whatIfSeparatorPO = {
  first: new PNLAndWhatIfPO(runnerExchangePO.first.pnlAndWhatIf).separator,
  second: new PNLAndWhatIfPO(runnerExchangePO.second.pnlAndWhatIf).separator,
  third: new PNLAndWhatIfPO(runnerExchangePO.third.pnlAndWhatIf).separator,
};

const mockService = new MockService();

const EVENT_ID = "29359895";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
  },
  edges: [
    {
      node: {
        urn: "ppb:tbd:card:29436223##MATCH_ODDS",
        title: "Match Odds",
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

  partialEdges: [{ node: { urn: "ppb:tbd:card:29436223##MATCH_ODDS", __typename: "MarketCard" } }],
};

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 2.1, size: 100 }],
        availableToLay: [{ price: 2.2, size: 110 }],
      },
      {
        selectionId: "48351",
        availableToBack: [{ price: 3.4, size: 200 }],
        availableToLay: [{ price: 3.5, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 2.5, size: 300 }],
        availableToLay: [{ price: 5.8, size: 310 }],
      },
    ],
  },
];

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
              price: 6,
              size: 3,
              averagePriceMatched: 6,
              sizeMatched: 3,
              sizeRemaining: 0,
              status: "EXECUTION_COMPLETE",
            },
          ],
        },
      ],
    },
  ],
};

describe("Market runner what-ifs", () => {
  describe("[645682] when the user opens the event page with an exchange market and open bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
      await browser.url(routes.getEventViewUrl(EVENT_ID));

      await browser.waitUntilDisplayed(pnlPO.first);
      await browser.waitUntilDisplayed(pnlPO.second);
      await browser.waitUntilDisplayed(pnlPO.third);
    });

    describe("[645682] when setting the size of a potential bet", () => {
      beforeAll(async () => {
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({
            market: eventPagePO.markets[0],
            runnerIndex: 2,
            price: 2.5,
          }),
        );
        await runnerExchangePO.third.exchangeBetButtons[0].click();
        await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element);

        await exchangeStakeInputField.setValue(2);

        await browser.waitUntilDisplayed(whatIfPO.first);
        await browser.waitUntilDisplayed(whatIfPO.second);
        await browser.waitUntilDisplayed(whatIfPO.third);
      });

      it("[PRPI-5488] should have correct What-if value for first runner", async () => {
        expect(await whatIfPO.first.getText()).toBe("$13.00");
      });

      it("[PRPI-5489] should have correct What-if profit state for first runner", async () => {
        expect(await browser.containsClass(whatIfPO.first, PNLAndWhatIfPO.states.profit)).toBe(true);
      });

      it("[PRPI-5490] should display PnL and What-if separator for first runner", async () => {
        expect(await whatIfSeparatorPO.first.isDisplayed()).toBe(true);
      });

      it("[PRPI-5491] should have correct What-if value for second runner", async () => {
        expect(await whatIfPO.second.getText()).toBe("-$5.00");
      });

      it("[PRPI-5492] should have correct What-if loss state for second runner", async () => {
        expect(await browser.containsClass(whatIfPO.second, PNLAndWhatIfPO.states.loss)).toBe(true);
      });

      it("[PRPI-5493] should display PnL and What-if separator for second runner", async () => {
        expect(await whatIfSeparatorPO.second.isDisplayed()).toBe(true);
      });

      it("[PRPI-5494] should have correct What-if value for third runner", async () => {
        expect(await whatIfPO.third.getText()).toBe("$0.00");
      });

      it("[PRPI-5495] should have correct What-if neutral state for third runner", async () => {
        expect(await browser.containsClass(whatIfPO.third, PNLAndWhatIfPO.states.neutral)).toBe(true);
      });

      it("[PRPI-5496] should display PnL and What-if separator for third runner", async () => {
        expect(await whatIfSeparatorPO.third.isDisplayed()).toBe(true);
      });

      describe("[645682] when setting the price of a potential bet", () => {
        beforeAll(async () => {
          await exchangePriceInputField.setValue(3.5);

          await browser.waitUntilDisplayed(whatIfPO.first);
          await browser.waitUntilDisplayed(whatIfPO.second);
          await browser.waitUntilDisplayed(whatIfPO.third);
        });

        it("[PRPI-5497] should have correct What-if value for first runner", async () => {
          expect(await whatIfPO.first.getText()).toBe("$13.00");
        });

        it("[PRPI-5497] should have correct What-if profit state for first runner", async () => {
          expect(await browser.containsClass(whatIfPO.first, PNLAndWhatIfPO.states.profit)).toBe(true);
        });

        it("[PRPI-5497] should have correct What-if value for second runner", async () => {
          expect(await whatIfPO.second.getText()).toBe("-$5.00");
        });

        it("[PRPI-5497] should have correct What-if loss state for second runner", async () => {
          expect(await browser.containsClass(whatIfPO.second, PNLAndWhatIfPO.states.loss)).toBe(true);
        });

        it("[PRPI-5497] should have correct What-if value for third runner", async () => {
          expect(await whatIfPO.third.getText()).toBe("$2.00");
        });

        it("[PRPI-5497] should have correct What-if profit state for third runner", async () => {
          expect(await browser.containsClass(whatIfPO.third, PNLAndWhatIfPO.states.profit)).toBe(true);
        });
      });
    });
  });

  describe("[645680] when the user opens the event page with an exchange market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_MOCK.urn, { currencyCode: "USD", localeCodeBcp47: "en-US" }),
      );
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews({}));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
    });

    describe("[645680] when setting the size of a potential bet", () => {
      beforeAll(async () => {
        await browser.waitUntil(
          AppPO.exchangeRunnerBetButtonHasPrice({
            market: eventPagePO.markets[0],
            runnerIndex: 2,
            price: 2.5,
          }),
        );
        await runnerExchangePO.third.exchangeBetButtons[0].click();
        await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element);

        await exchangeStakeInputField.setValue(2);

        await browser.waitUntilDisplayed(whatIfPO.first);
        await browser.waitUntilDisplayed(whatIfPO.second);
        await browser.waitUntilDisplayed(whatIfPO.third);
      });

      it("[PRPI-5498] should have correct What-if value for first runner", async () => {
        expect(await whatIfPO.first.getText()).toBe("-$2.00");
      });

      it("[PRPI-5499] should have correct What-if loss state for first runner", async () => {
        expect(await browser.containsClass(whatIfPO.first, PNLAndWhatIfPO.states.loss)).toBe(true);
      });

      it("[PRPI-5500] should not display PnL and What-if separator for first runner", async () => {
        expect(await whatIfSeparatorPO.first.isDisplayed()).toBe(false);
      });

      it("[PRPI-5501] should have correct What-if value for second runner", async () => {
        expect(await whatIfPO.second.getText()).toBe("-$2.00");
      });

      it("[PRPI-5502] should have correct What-if loss state for second runner", async () => {
        expect(await browser.containsClass(whatIfPO.second, PNLAndWhatIfPO.states.loss)).toBe(true);
      });

      it("[PRPI-5503] should not display PnL and What-if separator for second runner", async () => {
        expect(await whatIfSeparatorPO.second.isDisplayed()).toBe(false);
      });

      it("[PRPI-5504] should have correct What-if value for third runner", async () => {
        expect(await whatIfPO.third.getText()).toBe("$3.00");
      });

      it("[PRPI-5505] should have correct What-if profit state for third runner", async () => {
        expect(await browser.containsClass(whatIfPO.third, PNLAndWhatIfPO.states.profit)).toBe(true);
      });

      it("[PRPI-5506] should not display PnL and What-if separator for third runner", async () => {
        expect(await whatIfSeparatorPO.third.isDisplayed()).toBe(false);
      });

      describe("[645680] when setting the price of a potential bet", () => {
        beforeAll(async () => {
          await exchangePriceInputField.setValue(3.5);

          await browser.waitUntilDisplayed(whatIfPO.first);
          await browser.waitUntilDisplayed(whatIfPO.second);
          await browser.waitUntilDisplayed(whatIfPO.third);
        });

        it("[PRPI-5507] should have correct What-if value for first runner", async () => {
          expect(await whatIfPO.first.getText()).toBe("-$2.00");
        });

        it("[PRPI-5508] should have correct What-if loss state for first runner", async () => {
          expect(await browser.containsClass(whatIfPO.first, PNLAndWhatIfPO.states.loss)).toBe(true);
        });

        it("[PRPI-5509] should have correct What-if value for second runner", async () => {
          expect(await whatIfPO.second.getText()).toBe("-$2.00");
        });

        it("[PRPI-5508] should have correct What-if loss state for second runner", async () => {
          expect(await browser.containsClass(whatIfPO.second, PNLAndWhatIfPO.states.loss)).toBe(true);
        });

        it("[PRPI-5510] should have correct What-if value for third runner", async () => {
          expect(await whatIfPO.third.getText()).toBe("$5.00");
        });

        it("[PRPI-5511] should have correct What-if profit state for third runner", async () => {
          expect(await browser.containsClass(whatIfPO.third, PNLAndWhatIfPO.states.profit)).toBe(true);
        });
      });
    });
  });
});
