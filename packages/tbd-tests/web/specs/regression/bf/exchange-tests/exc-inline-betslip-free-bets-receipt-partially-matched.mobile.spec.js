const {
  AlertPO,
  AlertsPO,
  AppPO,
  CardPO,
  EventPagePO,
  ExchangeInlinePlacePanelPO,
  ExchangeInlineReceiptPanelPO,
  ExchangeMarketPO,
  ExchangeMatchedCardPO,
  ExchangeUnmatchedCardPO,
  FreeBetsPO,
  NumberInputFieldPO,
  PrimaryButtonPO,
  RunnerPO,
  SecondaryButtonPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getImplyBetResponse, getPlaceBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const runnerPO = new RunnerPO(exchangeMarketPO.runnerList[0]);

const placePanelPO = new ExchangeInlinePlacePanelPO();
const placeFreeBetsPO = new FreeBetsPO(placePanelPO.freeBets);
const placeButtonPO = new PrimaryButtonPO(placePanelPO.placeButton);
const stakeInputPO = new NumberInputFieldPO(placePanelPO.inputs[1]);

const receiptPO = new ExchangeInlineReceiptPanelPO();

const unmatchedCardPO = new ExchangeUnmatchedCardPO(receiptPO.placedBetCards[0]);
const unmatchedCardFreeBetsPO = new FreeBetsPO(unmatchedCardPO.freeBets);
const unmatchedCardAlertsPO = new AlertsPO(unmatchedCardPO.element);
const unmatchedCardAlertPO = new AlertPO(unmatchedCardAlertsPO.items[1]);
const unmatchedCancelButtonPO = new SecondaryButtonPO(unmatchedCardPO.cancel);

const matchedCardPO = new ExchangeMatchedCardPO(receiptPO.placedBetCards[1]);
const matchedCardFreeBetsPO = new FreeBetsPO(matchedCardPO.freeBets);

const EVENT_ID = "29359895";
const MARKET_ID = "1.160337355";

const ERO_MOCK = [
  {
    runners: [
      {
        selectionId: "48044",
        availableToBack: [{ price: 3.25, size: 100 }],
        availableToLay: [{ price: 4, size: 110 }],
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

const ETX_BACK_MOCK = {
  marketId: MARKET_ID,
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      selectionId: "48044",
      status: "SUCCESS",
      price: 3.25,
      size: 2,
      side: "BACK",
      averagePriceMatched: 3.25,
      sizeMatched: 1,
      orderStatus: "EXECUTABLE",
      bonusUsed: 2,
    },
  ],
};

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
            },
          ],
        },
      ],
    },
  ],
};

describe("Inline Betslip - Free Bets - Partially Matched Receipt", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        currencyCode: "EUR",
        localeCodeBcp47: "en-GB",
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

  describe("when the user places a bet using bonus, and it gets partially matched", () => {
    beforeAll(async () => {
      await runnerPO.exchangeBetButtons[0].waitForClickable();
      await runnerPO.exchangeBetButtons[0].click();

      await browser.waitUntilDisplayed(placePanelPO.element, "Place panel wasn't displayed");
      await browser.waitUntilDisplayed(placeFreeBetsPO.element, "Free bets component wasn't displayed");

      await stakeInputPO.setValue("2");

      await placeFreeBetsPO.element.waitForClickable();
      await placeFreeBetsPO.element.click();
      await browser.waitUntil(async () => placeFreeBetsPO.input.isSelected());

      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_BACK_MOCK));
      await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));

      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();
      await browser.waitUntilDisplayed(receiptPO.element, "Receipt panel wasn't displayed");
    });

    describe("unmatched card", () => {
      it("[PRPI-5347] the unmatched card should be displayed on receipt", async () => {
        await browser.waitUntilDisplayed(unmatchedCardPO.element, "Unmatched card panel wasn't displayed");
        await browser.waitUntilEquals(unmatchedCardPO.header, "Bet Unmatched");
      });

      it("[PRPI-5348] the free bets icon should be displayed", async () => {
        expect(await unmatchedCardFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
      });

      it("[PRPI-5349] the free bets label should be displayed", async () => {
        expect(await unmatchedCardFreeBetsPO.label.getText()).toBe("Used €1.00 Free Bet");
      });

      it("[PRPI-5350] the unable to edit bet notification should be displayed", async () => {
        expect(await unmatchedCardFreeBetsPO.element.isDisplayed()).toBe(true);
        expect(await unmatchedCardAlertPO.message.getText()).toBe("Unable to edit this Bonus Bet");
        expect(await unmatchedCardAlertPO.detail.getText()).toBe("Cancel and re-place the bet");
      });

      it("[PRPI-5351] the cancel bet button should be displayed", async () => {
        await browser.waitUntilDisplayed(unmatchedCancelButtonPO.element);
        expect(await unmatchedCancelButtonPO.element.isDisplayed()).toBe(true);
        expect(await unmatchedCancelButtonPO.element.getText()).toBe("Cancel Bet");
      });
    });

    describe("matched card", () => {
      it("[PRPI-5352] the matched card should be displayed on receipt", async () => {
        await browser.waitUntilDisplayed(matchedCardPO.element, "Matched card panel wasn't displayed");
        await browser.waitUntilEquals(matchedCardPO.header, "Bet Matched");
      });

      it("[PRPI-5353] the free bets icon should be displayed", async () => {
        expect(await matchedCardFreeBetsPO.bonusIcon.isDisplayed()).toBe(true);
      });

      it("[PRPI-5354] the free bets label should be displayed", async () => {
        expect(await matchedCardFreeBetsPO.label.getText()).toBe("Used €1.00 Free Bet");
      });
    });
  });
});
