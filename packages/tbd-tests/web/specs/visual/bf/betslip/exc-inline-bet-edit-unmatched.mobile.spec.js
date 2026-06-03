const {
  AppPO,
  CardPO,
  EventPagePO,
  ExchangeInlineEditPanelPO,
  ExchangeInlinePlacePanelPO,
  ExchangeMarketPO,
  ExchangeUnmatchedCardPO,
  InlinePanelPO,
  NudgesNumberInputFieldPO,
  RunnerPO,
  ExchangeInlineReceiptPanelPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { searchOrders, getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);

const mockService = new MockService();
const inlinePanelPO = new InlinePanelPO();
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const inlinePlaceStakeInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const exchangeInlineReceiptPanelPO = new ExchangeInlineReceiptPanelPO();
const exchangeInlineEditPanelPO = new ExchangeInlineEditPanelPO();
const persistenceCardPO = new CardPO(exchangeInlineEditPanelPO.persistence);
const exchangeUnmatchedCardPO = new ExchangeUnmatchedCardPO(exchangeInlineReceiptPanelPO.placedBetCards[0]);
const MODULE_NAME = "inline-betslip";

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
              urn: `ppb:excMarket:${MARKET_ID}`,
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
                  name: "Man Utd",
                },
                {
                  runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0`,
                  selectionId: 58805,
                  name: "The Draw",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48044/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/48351/0` },
              { runnerURN: `ppb:excRunner:${MARKET_ID}/58805/0` },
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

const ETX_UNMATCHED_MOCK = {
  marketId: MARKET_ID,
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      status: "SUCCESS",
      price: 5,
      size: 2,
      averagePriceMatched: 0,
      sizeMatched: 0,
      orderStatus: "EXECUTABLE",
    },
  ],
};

const POSITION_VIEWS = {
  marketPositions: [
    {
      marketId: MARKET_ID,
      selections: [
        {
          selectionId: 48044,
          orders: [
            {
              marketId: MARKET_ID,
              selectionId: 48044,
              betId: "1:11111111111",
              price: 5,
              size: 2,
              sizeRemaining: 2,
            },
          ],
        },
      ],
    },
  ],
};

describe("Inline Betslip - Edit Unmatched Bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getPlaceBetResponse(ETX_UNMATCHED_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(searchOrders());

    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);
    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.1,
      }),
    );
  });

  describe("when the user places an unmatched bet and clicks Edit Bet", () => {
    beforeAll(async () => {
      await firstRunnerExchangePO.exchangeBetButtons[0].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[0].click();
      await browser.waitUntilDisplayed(inlinePanelPO.element, "Selection hasn't been added");

      await inlinePlaceStakeInputFieldPO.setValue(2);
      await browser.waitUntilEquals(inlinePlaceStakeInputFieldPO.numberField, "2");

      await exchangeInlinePlacePanelPO.placeButton.waitForClickable();
      await exchangeInlinePlacePanelPO.placeButton.click();
      await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element, "Receipt panel wasn't displayed");

      await exchangeUnmatchedCardPO.confirm.waitForClickable();
      await exchangeUnmatchedCardPO.confirm.click();
      await browser.waitUntilDisplayed(exchangeInlineEditPanelPO.element, "Edit panel wasn't displayed");

      await persistenceCardPO.headerWrapper.waitForClickable();
      await persistenceCardPO.headerWrapper.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-10434]_should_display_the_edit_panel_for_unmatched_bet`);
    });

    it("[PRPI-10434]_should_display_the_edit_panel_for_unmatched_bet", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-10434]_should_display_the_edit_panel_for_unmatched_bet`),
      ).toBe(0);
    });
  });
});
