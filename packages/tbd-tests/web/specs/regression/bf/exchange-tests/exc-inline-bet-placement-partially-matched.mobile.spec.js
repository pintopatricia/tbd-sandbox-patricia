const {
  AppPO,
  EventPagePO,
  CardPO,
  RunnerPO,
  InlinePanelPO,
  ExchangeMarketPO,
  ExchangeInlinePlacePanelPO,
  NudgesNumberInputFieldPO,
  PrimaryButtonPO,
  ExchangeMatchedCardPO,
  ExchangeUnmatchedCardPO,
  BetSegmentsPO,
  ExchangeInlineReceiptPanelPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse, getCancelBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const eventPagePO = new EventPagePO();
const firstCardPO = new CardPO(eventPagePO.markets[0]);
const exchangeMarketPO = new ExchangeMarketPO(firstCardPO.exchangeMarket);
const firstRunnerExchangePO = new RunnerPO(exchangeMarketPO.runnerList[0]);
const exchangeInlinePlacePanelPO = new ExchangeInlinePlacePanelPO();
const placeButtonPO = new PrimaryButtonPO();
const exchangeStakeInputFieldPO = new NudgesNumberInputFieldPO(exchangeInlinePlacePanelPO.inputs[1]);
const exchangeInlineReceiptPanelPO = new ExchangeInlineReceiptPanelPO();
const exchangeUnmatchedCardPO = new ExchangeUnmatchedCardPO(exchangeInlineReceiptPanelPO.placedBetCards[0]);
const unmatchedBetSegmentsPO = new BetSegmentsPO(exchangeUnmatchedCardPO.results);
const exchangeMatchedCardPO = new ExchangeMatchedCardPO(exchangeInlineReceiptPanelPO.placedBetCards[1]);
const matchedBetSegmentsPO = new BetSegmentsPO(exchangeMatchedCardPO.results);
const inlinePanelPO = new InlinePanelPO();

const mockService = new MockService();

const EVENT_ID = "29359895";

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

const ETX_MOCK_BACK = {
  marketId: "1.160337355",
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      status: "SUCCESS",
      size: 7,
      price: 1.01,
      side: "BACK",
      averagePriceMatched: 1.01,
      sizeMatched: 4,
      orderStatus: "EXECUTABLE",
    },
  ],
};

const ETX_MOCK_CANCEL = {
  marketId: "1.160337355",
  status: "SUCCESS",
  sizeCancelled: 3,
  cancelledDate: "2020-01-21T13:43:32.000Z",
  instructionReports: { betId: "11111111111" },
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

describe("Inline Betslip - Bet Placement Partially Matched", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));

    await browser.url(`${routes.getEventViewUrl(EVENT_ID)}`);

    await browser.waitUntil(
      AppPO.exchangeRunnerBetButtonHasPrice({
        market: eventPagePO.markets[0],
        price: 1.01,
        betButtonIndex: 1,
      }),
    );
  });

  describe("Press Back bet button", () => {
    beforeAll(async () => {
      await firstRunnerExchangePO.exchangeBetButtons[0].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[0].click();
      await browser.waitUntilDisplayed(inlinePanelPO.element, "Inline panel hasn't been displayed");

      await exchangeStakeInputFieldPO.setValue("7");
    });

    describe("and when the user places a bet and it was partially matched", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_BACK));
        await placeButtonPO.element.waitForClickable();
        await placeButtonPO.element.click();
        await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element);
      });

      it("[PRPI-5293] the receipt should be displayed", async () => {
        expect(await exchangeInlineReceiptPanelPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-8673] should have a title that follows the pattern 'Back (bet for): Market - Selection'", async () => {
        expect(await inlinePanelPO.titlePrefix.getText()).toBe("Back (bet for):");
        expect(await inlinePanelPO.title.getText()).toBe("Match Odds - Wolves");
      });

      it("[PRPI-5295] the matched and unmatched should be displayed", async () => {
        expect(await exchangeUnmatchedCardPO.element.isDisplayed()).toBe(true);
        expect(await exchangeMatchedCardPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-5296] the unmatched bet card subtitle should be 'Bet Unmatched'", async () => {
        expect(await exchangeUnmatchedCardPO.header.getText()).toBe("Bet Unmatched");
      });

      it("[PRPI-5297] the unmatched odds value should be displayed as '1.01'", async () => {
        expect(await unmatchedBetSegmentsPO.leftValue.getText()).toBe("1.01");
      });

      it("[PRPI-5298] the stake value should be displayed as '$3.00'", async () => {
        expect(await unmatchedBetSegmentsPO.midValue.getText()).toBe("$3.00");
      });

      it("[PRPI-5299] the unmatched profit label should be displayed as 'Profit'", async () => {
        expect(await unmatchedBetSegmentsPO.rightLabel.getText()).toBe("Profit");
      });

      it("[PRPI-5300] the profit value should be displayed as '$0.03'", async () => {
        expect(await unmatchedBetSegmentsPO.rightValue.getText()).toBe("$0.03");
      });

      it("[PRPI-5301] a cancel button should be displayed", async () => {
        expect(await exchangeUnmatchedCardPO.cancel.isDisplayed()).toBe(true);
      });

      it("[PRPI-5302] the matched bet card subtitle should be 'Bet Matched'", async () => {
        expect(await exchangeMatchedCardPO.header.getText()).toBe("Bet Matched");
      });

      it("[PRPI-8354]the matched odds value should be displayed as '1.01'", async () => {
        expect(await matchedBetSegmentsPO.leftValue.getText()).toBe("1.01");
      });

      it("[PRPI-5303] the stake value should be displayed as '$4.00'", async () => {
        expect(await matchedBetSegmentsPO.midValue.getText()).toBe("$4.00");
      });

      it("[PRPI-8355]the matched profit label should be displayed as 'Profit'", async () => {
        expect(await matchedBetSegmentsPO.rightLabel.getText()).toBe("Profit");
      });

      it("[PRPI-5304] the profit value should be displayed as '$0.04'", async () => {
        expect(await matchedBetSegmentsPO.rightValue.getText()).toBe("$0.04");
      });

      describe("when the user clicks on 'Cancel Bet'", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getCancelBetResponse(ETX_MOCK_CANCEL));
          await exchangeUnmatchedCardPO.cancel.waitForClickable();
          await exchangeUnmatchedCardPO.cancel.click();
          await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element);
        });

        it("[PRPI-5305] the cancel panel should be displayed", async () => {
          expect(await exchangeInlineReceiptPanelPO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-8674] should have a title that follows the `Bet Cancelled: market - selection` pattern", async () => {
          expect(await inlinePanelPO.titlePrefix.getText()).toBe("Bet Cancelled:");
          expect(await inlinePanelPO.title.getText()).toBe("Match Odds - Wolves");
        });

        it("[PRPI-5307] the cancel and edit buttons should not be displayed", async () => {
          expect(await exchangeUnmatchedCardPO.cancel.isExisting()).toBe(false);
          expect(await exchangeUnmatchedCardPO.confirm.isExisting()).toBe(false);
        });

        describe("when the user clicks on done button", () => {
          beforeAll(async () => {
            await inlinePanelPO.action.waitForClickable();
            await inlinePanelPO.action.click();
            await browser.waitUntilNotDisplayed(exchangeInlineReceiptPanelPO.element);
          });

          it("[PRPI-5308] the receipt should be dismissed", async () => {
            expect(await exchangeInlineReceiptPanelPO.element.isExisting()).toBe(false);
          });
        });
      });
    });
  });
});
