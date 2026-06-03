const {
  AppPO,
  CardPO,
  EventPagePO,
  ExchangeInlineConfirmPanelPO,
  ExchangeInlinePlacePanelPO,
  ExchangeMarketPO,
  NumberInputFieldPO,
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

const mockService = new MockService();
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const exchangeInlineConfirmPanelPO = new ExchangeInlineConfirmPanelPO();
const exchangeInlineReceiptPanelPO = new ExchangeInlineReceiptPanelPO();
const placeButtonPO = new PrimaryButtonPO(exchangeInlinePlacePanelPO.placeButton);
const confirmButtonPO = new PrimaryButtonPO(exchangeInlineConfirmPanelPO.confirm);
const exchangeStakeInputFieldPO = new NumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const MODULE_NAME = "inline-betslip";

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

const ETX_BACK_PARTIALLY_MATCHED_MOCK = {
  marketId: MARKET_ID,
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      selectionId: "48044",
      status: "SUCCESS",
      price: 3,
      size: 2,
      side: "BACK",
      averagePriceMatched: 3,
      sizeMatched: 1,
      orderStatus: "EXECUTABLE",
    },
  ],
};

describe("Inline Betslip - Partially Matched Receipt", () => {
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

  describe("when the user places a back bet and it is partially matched", () => {
    beforeAll(async () => {
      await firstRunnerExchangePO.exchangeBetButtons[0].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[0].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelPO.element, "Place panel wasn't displayed");

      await exchangeStakeInputFieldPO.setValue("2");

      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();
      await browser.waitUntilDisplayed(exchangeInlineConfirmPanelPO.element, "Confirmation panel wasn't displayed");

      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_BACK_PARTIALLY_MATCHED_MOCK));
      await confirmButtonPO.element.waitForClickable();
      await confirmButtonPO.element.click();

      await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element, "Receipt panel wasn't displayed");
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-10439]_should_display_the_partially_matched_receipt`);
    });

    it("[PRPI-10439]_should_display_the_partially_matched_receipt", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-10439]_should_display_the_partially_matched_receipt`),
      ).toBe(0);
    });
  });
});
