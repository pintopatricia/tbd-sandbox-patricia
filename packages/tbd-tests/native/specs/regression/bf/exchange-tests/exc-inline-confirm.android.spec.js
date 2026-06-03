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
  PrimaryButtonSO,
  RunnerSO,
  CurrencyNumberInputFieldSO,
  NudgesNumberInputFieldSO,
  FixedNumberInputFieldSO,
  ExchangeInlinePlacePanelSO,
  InlinePanelSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const exchangeMarketSO = new ExchangeMarketSO();
const firstExchangeRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);

const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const placeStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const placeButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.placeButton);

const exchangeInlineConfirmPanelSO = new ExchangeInlineConfirmPanelSO();
const inlinePanelSO = new InlinePanelSO();
const confirmOddsSO = new FixedNumberInputFieldSO(exchangeInlineConfirmPanelSO.price);
const confirmStakeSO = new CurrencyNumberInputFieldSO(exchangeInlineConfirmPanelSO.size);
const confirmButtonSO = new PrimaryButtonSO(exchangeInlineConfirmPanelSO.confirm);

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

const APP_CONTEXT_MOCK = {
  exchangeConfirmBetPlacement: true,
};

const POSITION_VIEWS = {
  marketPositions: [],
};

xdescribe("Exchange Inline Confirm", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(firstExchangeRunnerSO.betButtons[0]);
    await firstExchangeRunnerSO.betButtons[0].click();

    await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element);
  });

  describe("When the user taps the place bet button", () => {
    beforeAll(async () => {
      await placeStakeInputFieldSO.numberField.setValue(2);
      await hideKeyboard();
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(exchangeInlineConfirmPanelSO.element);
    });

    it("[PRPI-1772] the confirm panel should be displayed", async () => {
      expect(await exchangeInlineConfirmPanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1773] the 'Back bet' information should be displayed", async () => {
      expect(await inlinePanelSO.title.getText()).toEqual("Back bet");
    });

    it("[PRPI-1774] the 'Cancel' button should be displayed", async () => {
      expect(await inlinePanelSO.action.isDisplayed()).toEqual(true);
    });

    it("[PRPI-1775] the odds field populated should be displayed", async () => {
      expect(await confirmOddsSO.numberField.getText()).toEqual("1.1");
    });

    it("[PRPI-1776] the stake field populated should be displayed", async () => {
      expect(await confirmStakeSO.numberField.getText()).toEqual("2");
    });

    it("[PRPI-1777] the edit button should be displayed", async () => {
      expect(await exchangeInlineConfirmPanelSO.edit.isDisplayed()).toEqual(true);
    });

    it("[PRPI-1778] the confirm button with 2 lines should be displayed", async () => {
      expect(await confirmButtonSO.label.isDisplayed()).toEqual(true);
      expect(await confirmButtonSO.secondaryLabel.isDisplayed()).toEqual(true);
    });

    describe("When the user taps the edit bet button", () => {
      beforeAll(async () => {
        await exchangeInlineConfirmPanelSO.edit.click();
        await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element);
      });

      it("[PRPI-1779] the place panel should be displayed", async () => {
        expect(await exchangeInlinePlacePanelSO.element.isDisplayed()).toBe(true);
      });

      describe("When the user taps the place bet button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(placeButtonSO.element);
          await placeButtonSO.element.click();
          await browser.waitUntilDisplayed(exchangeInlineConfirmPanelSO.element);
        });

        it("[PRPI-1780] the confirm panel should be displayed", async () => {
          expect(await exchangeInlineConfirmPanelSO.element.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
