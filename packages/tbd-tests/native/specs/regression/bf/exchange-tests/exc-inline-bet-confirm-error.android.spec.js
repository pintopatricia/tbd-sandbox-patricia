const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const {
  getAppContext,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  ExchangeMarketSO,
  ExchangeInlineConfirmPanelSO,
  PrimaryButtonSO,
  RunnerSO,
  NudgesNumberInputFieldSO,
  ExchangeInlinePlacePanelSO,
  AlertSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const exchangeMarketSO = new ExchangeMarketSO();
const firstExchangeRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);

const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const placeStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const placeButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.place);
const exchangeInlineConfirmPanelSO = new ExchangeInlineConfirmPanelSO();
const confirmButtonSO = new PrimaryButtonSO(exchangeInlineConfirmPanelSO.confirm);
const confirmPanelAlertSO = new AlertSO(exchangeInlineConfirmPanelSO.element);

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

const ERO_MOCK = [
  {
    marketId: "1.160337355",
    runners: [
      {
        selectionId: 48044,
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: 48351,
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const APP_CONTEXT_MOCK_PLACE = {};

const APP_CONTEXT_MOCK_CONFIRM = {
  exchangeConfirmBetPlacement: true,
  ...APP_CONTEXT_MOCK_PLACE,
};

const POSITION_VIEWS = {
  marketPositions: [],
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

xdescribe("Exchange Inline Bet Confirm Panel Errors", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK_CONFIRM));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));

    const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(firstExchangeRunnerSO.betButtons[1]);
    await firstExchangeRunnerSO.betButtons[1].click();

    await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element);
    await placeStakeInputFieldSO.numberField.setValue(2);
    await hideKeyboard();
    await browser.waitUntilDisplayed(placeButtonSO.element);
    await placeButtonSO.element.click();
    await browser.waitUntilDisplayed(exchangeInlineConfirmPanelSO.element, "Confirm panel was not displayed");
  });

  describe("When confirming a bet with an account that exceeds the self imposed loss limit (LOSS_LIMIT_EXCEEDED)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_LOSS_LIMIT_EXCEEDED));
      await browser.waitUntilDisplayed(confirmButtonSO.element);
      await confirmButtonSO.element.click();
      await browser.waitUntilDisplayed(confirmPanelAlertSO.element, "Confirm failure notification was not displayed");
    });

    it("[PRPI-1698] The error message 'You have exceeded your loss limit.' should be displayed", async () => {
      expect(await confirmPanelAlertSO.message.getText()).toEqual("You have exceeded your loss limit.");
    });

    describe("When confirming a bet with a runner that was removed from the event (RUNNER_REMOVED)", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_LOSS_RUNNER_REMOVED));
        await browser.waitUntilDisplayed(confirmButtonSO.element);
        await confirmButtonSO.element.click();
        await browser.waitUntilDisplayed(confirmPanelAlertSO.element, "Confirm failure notification was not displayed");
      });

      it("[PRPI-1699] The error message 'This selection was removed from the market.", async () => {
        expect(await confirmPanelAlertSO.message.getText()).toEqual("This selection was removed from the market.");
      });
    });
  });
});
