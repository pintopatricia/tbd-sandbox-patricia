const {
  AlertsPO,
  AlertPO,
  AppPO,
  CardPO,
  NudgesNumberInputFieldPO,
  EventPagePO,
  ExchangeInlineConfirmPanelPO,
  ExchangeInlinePlacePanelPO,
  ExchangeMarketPO,
  PrimaryButtonPO,
  RunnerPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const exchangeInlineConfirmPanelPO = new ExchangeInlineConfirmPanelPO();
const alertsPO = new AlertsPO();
const firstAlertPO = new AlertPO(alertsPO.items[0]);
const placeButtonPO = new PrimaryButtonPO(exchangeInlinePlacePanelPO.placeButton);
const confirmButtonPO = new PrimaryButtonPO(exchangeInlineConfirmPanelPO.confirm);
const confirmPanelAlertPO = new AlertPO(exchangeInlineConfirmPanelPO.element);
const exchangeStakeInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);

const mockService = new MockService();

const EVENT_ID = "29359895";
const MARKET_ID = "1.160337355";

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

const ETX_MOCK_FAILURE = {
  marketId: MARKET_ID,
  instructionReports: [
    {
      selectionId: 48044,
      status: "FAILURE",
      instructionErrorCode: "ERROR_IN_ORDER",
      side: "LAY",
    },
  ],

  status: "FAILURE",
};

const ETX_MOCK_FAILURE_WITH_INSUFFICIENT_FUNDS = {
  ...ETX_MOCK_FAILURE,
  orderErrorCode: "INSUFFICIENT_FUNDS",
};

const ETX_MOCK_FAILURE_WITH_INVALID_RUNNER = {
  ...ETX_MOCK_FAILURE,
  instructionReports: [
    {
      ...ETX_MOCK_FAILURE.instructionReports[0],
      instructionErrorCode: "INVALID_RUNNER",
    },
  ],
};

const ETX_MOCK_FAILURE_WITH_LOSS_LIMIT_EXCEEDED = {
  ...ETX_MOCK_FAILURE,
  instructionReports: [
    {
      ...ETX_MOCK_FAILURE.instructionReports[0],
      instructionErrorCode: "LOSS_LIMIT_EXCEEDED",
    },
  ],
};

const ETX_MOCK_FAILURE_WITH_LOSS_RUNNER_REMOVED = {
  ...ETX_MOCK_FAILURE,
  instructionReports: [
    {
      ...ETX_MOCK_FAILURE.instructionReports[0],
      instructionErrorCode: "RUNNER_REMOVED",
    },
  ],
};

describe("Inline Betslip - Place error messages", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);

    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.01,
        betButtonIndex: 1,
      }),
    );
  });

  describe("When placing a bet with an amount above than the one available in the wallet (INSUFFICIENT_FUNDS)", () => {
    beforeAll(async () => {
      await firstRunnerExchangePO.exchangeBetButtons[1].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[1].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element);

      await exchangeStakeInputFieldPO.setValue("3");

      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_INSUFFICIENT_FUNDS));
      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();
      await browser.waitUntilDisplayed(firstAlertPO.element, "Place failure notification was not displayed");
    });

    it("[PRPI-5282] The error message 'You have insufficient funds to place this bet or you have exceeded your exposure limit.' should be displayed", async () => {
      expect(await firstAlertPO.message.getText()).toEqual(
        "You have insufficient funds to place this bet or you have exceeded your exposure limit.",
      );
    });

    describe("When placing a bet on a runner that doesn't exist (INVALID_RUNNER)", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_INVALID_RUNNER));
        await exchangeStakeInputFieldPO.setValue("2");
        await placeButtonPO.element.waitForClickable();
        await placeButtonPO.element.click();
        await browser.waitUntilDisplayed(firstAlertPO.element, "Place failure notification was not displayed");
      });

      it("[PRPI-5283] The error message 'The selection is not available for betting' should be displayed", async () => {
        expect(await firstAlertPO.message.getText()).toEqual("The selection is not available for betting.");
      });
    });
  });
});

describe("Inline Betslip - Confirm error messages", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { exchangeConfirmBetPlacement: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);

    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.01,
        betButtonIndex: 1,
      }),
    );
  });

  describe("When confirming a bet with an account that exceeds the self imposed loss limit (LOSS_LIMIT_EXCEEDED)", () => {
    beforeAll(async () => {
      await firstRunnerExchangePO.exchangeBetButtons[1].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[1].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element);

      await exchangeStakeInputFieldPO.setValue("2");

      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_LOSS_LIMIT_EXCEEDED));
      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();
      await browser.waitUntilDisplayed(exchangeInlineConfirmPanelPO.element, "Confirm panel was not displayed");
      await confirmButtonPO.element.waitForClickable();
      await confirmButtonPO.element.click();
      await browser.waitUntilDisplayed(confirmPanelAlertPO.element, "Confirm failure notification was not displayed");
    });

    it("[PRPI-5284] The error message 'You have exceeded your loss limit.' should be displayed", async () => {
      expect(await confirmPanelAlertPO.message.getText()).toEqual("You have exceeded your loss limit.");
    });

    describe("When confirming a bet with a runner that was removed from the event (RUNNER_REMOVED)", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_LOSS_RUNNER_REMOVED));
        await confirmButtonPO.element.waitForClickable();
        await confirmButtonPO.element.click();
        await browser.waitUntilDisplayed(confirmPanelAlertPO.element, "Confirm failure notification was not displayed");
      });

      it("[PRPI-5285] The error message 'This selection was removed from the market.", async () => {
        expect(await confirmPanelAlertPO.message.getText()).toEqual("This selection was removed from the market.");
      });
    });
  });
});
