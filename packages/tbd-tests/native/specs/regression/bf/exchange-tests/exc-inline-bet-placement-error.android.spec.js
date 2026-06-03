const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const {
  getEventLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  ExchangeMarketSO,
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
const placeButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.placeButton);
const firstAlertSO = new AlertSO(exchangeInlinePlacePanelSO.notifications);

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
      {
        selectionId: 58805,
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
];

const APP_CONTEXT_MOCK_PLACE = {};

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

xdescribe("Exchange Inline Bet Place Panel Errors", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK_PLACE));
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
  });

  describe("When the user taps the place bet button", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_INSUFFICIENT_FUNDS));
      await placeStakeInputFieldSO.numberField.setValue(3);
      await hideKeyboard();
      await browser.waitUntilDisplayed(placeButtonSO.element);
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(firstAlertSO.element, "Place failure notification was not displayed");
    });

    it("[PRPI-1700] The error message 'You have insufficient funds to place this bet or you have exceeded your exposure limit.' should be displayed", async () => {
      expect(await firstAlertSO.message.getText()).toEqual(
        "You have insufficient funds to place this bet or you have exceeded your exposure limit.",
      );
    });

    describe("When placing a bet on a runner that doesn't exist (INVALID_RUNNER)", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_FAILURE_WITH_INVALID_RUNNER));
        await placeStakeInputFieldSO.numberField.setValue(2);
        await browser.waitUntilDisplayed(placeButtonSO.element);
        await placeButtonSO.element.click();
        await browser.waitUntilDisplayed(firstAlertSO.element, "Place failure notification was not displayed");
      });

      it("[PRPI-1701] The error message 'The selection is not available for betting' should be displayed", async () => {
        expect(await firstAlertSO.message.getText()).toEqual("The selection is not available for betting.");
      });
    });
  });
});
