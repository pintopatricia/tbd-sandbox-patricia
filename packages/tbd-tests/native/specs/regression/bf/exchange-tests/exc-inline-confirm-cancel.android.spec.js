const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
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
  ExchangeBetButtonSO,
  PrimaryButtonSO,
  RunnerSO,
  NudgesNumberInputFieldSO,
  ExchangeInlinePlacePanelSO,
  InlinePanelSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const exchangeMarketSO = new ExchangeMarketSO();
const firstExchangeRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const firstExchangeBetButtonSO = new ExchangeBetButtonSO(firstExchangeRunnerSO.betButtons[0]);

const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const placeStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const placeButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.place);

const exchangeInlineConfirmPanelSO = new ExchangeInlineConfirmPanelSO();
const inlinePanelSO = new InlinePanelSO();

const EVENT_ID = "29682729";

const EXCHANGE_MARKET_ID = "1.160337355";

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
        __typename: "MarketCard",
        urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`,
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
                  eventId: EVENT_ID,
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                    competitionId: 12345,
                  },
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
        urn: `ppb:tbd:card:${EVENT_ID}##MATCH_ODDS`,
      },
    },
  ],
};

const ERO_MOCK = [
  {
    marketId: EXCHANGE_MARKET_ID,
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

const APP_CONTEXT_MOCK = {
  exchangeConfirmBetPlacement: true,
};

const POSITION_VIEWS = {
  marketPositions: [],
};

xdescribe("Exchange Inline Confirm Cancel", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    const url = `sport/competition/event/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilEquals(firstExchangeBetButtonSO.odd, "1.1");

    await browser.waitUntilClickableNative(firstExchangeRunnerSO.betButtons[0]);
    await firstExchangeRunnerSO.betButtons[0].click();

    await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element);
  });

  describe("When user press place bet button on place panel", () => {
    beforeAll(async () => {
      await placeStakeInputFieldSO.numberField.setValue(2);
      await hideKeyboard();

      await browser.waitUntilClickableNative(placeButtonSO.element);
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(exchangeInlineConfirmPanelSO.element);
    });

    it("[PRPI-1769] the confirm panel should be displayed", async () => {
      expect(await exchangeInlineConfirmPanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1770] the 'Cancel' button should be displayed", async () => {
      expect(await inlinePanelSO.action.isDisplayed()).toEqual(true);
    });

    describe("When user press cancel button on confirm panel", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(inlinePanelSO.action);
        await inlinePanelSO.action.click();
        await browser.waitUntilNotDisplayed(exchangeInlineConfirmPanelSO.element);
      });

      it("[PRPI-1771] the betslip should close", async () => {
        expect(await inlinePanelSO.element.isExisting()).toBe(false);
      });
    });
  });
});
