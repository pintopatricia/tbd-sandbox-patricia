const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse, getCancelBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getAppContext, getSportsLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { hideKeyboard } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");

const {
  ExchangeInlineConfirmPanelSO,
  ExchangeInlineReceiptPanelSO,
  ExchangeMarketSO,
  SelectionSegmentSO,
  ExchangeUnmatchedCardSO,
  ActionButtonSO,
  BetSegmentsSO,
  NudgesNumberInputFieldSO,
  ExchangeInlinePlacePanelSO,
  ExchangeMatchedCardSO,
  InlinePanelSO,
  AlertSO,
  PrimaryButtonSO,
  RunnerSO,
  OddsSO,
  PNLAndWhatIfSO,
} = require("../../../../screen-objects");

const exchangeMarketSO = new ExchangeMarketSO();
const firstRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const exchangeInlineConfirmPanelSO = new ExchangeInlineConfirmPanelSO();
const placeButtonSO = new PrimaryButtonSO();
const confirmButtonSO = new ActionButtonSO(exchangeInlineConfirmPanelSO.confirm);
const exchangeStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const exchangeInlineReceiptPanelSO = new ExchangeInlineReceiptPanelSO();
const exchangeUnmatchedCardSO = new ExchangeUnmatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[0]);
const exchangeMatchedCardSO = new ExchangeMatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[1]);
const inlinePanelSO = new InlinePanelSO();
const unmatchedBetSegmentsSO = new BetSegmentsSO(exchangeUnmatchedCardSO.results);
const unmatchedBetOddsContainerSO = new SelectionSegmentSO(unmatchedBetSegmentsSO.leftSegment);
const unmatchedBetOddsSO = new OddsSO(unmatchedBetSegmentsSO.leftSegment);
const unmatchedBetStakeContainerSO = new SelectionSegmentSO(unmatchedBetSegmentsSO.midSegment);
const unmatchedBetStakeSO = new OddsSO(unmatchedBetSegmentsSO.midSegment);
const unmatchedBetProfitContainerSO = new SelectionSegmentSO(unmatchedBetSegmentsSO.rightSegment);
const unmatchedBetProfitSO = new PNLAndWhatIfSO(unmatchedBetSegmentsSO.rightSegment);
const matchedBetSegmentsSO = new BetSegmentsSO(exchangeMatchedCardSO.results);
const matchedBetOddsContainerSO = new SelectionSegmentSO(matchedBetSegmentsSO.leftSegment);
const matchedBetOddsSO = new OddsSO(matchedBetSegmentsSO.leftSegment);
const matchedBetStakeContainerSO = new SelectionSegmentSO(matchedBetSegmentsSO.midSegment);
const matchedBetStakeSO = new OddsSO(matchedBetSegmentsSO.midSegment);
const matchedBetProfitContainerSO = new SelectionSegmentSO(matchedBetSegmentsSO.rightSegment);
const matchedBetProfitSO = new PNLAndWhatIfSO(matchedBetSegmentsSO.rightSegment);
const cancelledAlertSO = new AlertSO(exchangeUnmatchedCardSO.notifications);

const mockService = new MockService();

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

const HOME_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  edges: [...BFF_MOCK.edges],
  partialEdges: [...BFF_MOCK.partialEdges],
};

const ERO_MOCK = [
  {
    marketId: EXCHANGE_MARKET_ID,
    runners: [
      {
        selectionId: 48044,
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.01, size: 110 }],
      },
      {
        selectionId: 48351,
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
    ],
  },
];

const ETX_MOCK_BACK = {
  marketId: "1.160337355",
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      status: "SUCCESS",
      price: 1.01,
      size: 7,
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

const APP_CONTEXT_MOCK = {
  exchangeConfirmBetPlacement: true,
};

xdescribe("Inline Betslip - Bet Placement (partially matched)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_BACK));
    await startApp("home");
  });

  describe("When placing a partially matched back bet successfully", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstRunnerSO.betButtons[1]);
      await firstRunnerSO.betButtons[1].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element, "Exchange place panel was not displayed");
      await exchangeStakeInputFieldSO.numberField.setValue(7);
      await browser.waitUntilEquals(exchangeStakeInputFieldSO.numberField, "7");
      await hideKeyboard();
      await browser.waitUntilClickableNative(placeButtonSO.element);
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(
        exchangeInlineConfirmPanelSO.element,
        "Exchange confirm panel was not displayed",
      );
      await browser.waitUntilClickableNative(confirmButtonSO.element);
      await confirmButtonSO.element.click();
      await browser.waitUntilDisplayed(
        exchangeInlineReceiptPanelSO.element,
        "Exchange receipt panel was not displayed",
      );
      await browser.waitUntilEquals(inlinePanelSO.title, "Back bet");
    });

    it("[PRPI-1717] the receipt should be displayed", async () => {
      expect(await exchangeInlineReceiptPanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1718] the 'Back (bet for)' title should be displayed", async () => {
      expect(await inlinePanelSO.title.getText()).toBe("Back (bet for)");
    });

    it("[PRPI-1719] the matched and unmatched should be displayed", async () => {
      expect(await exchangeUnmatchedCardSO.element.isDisplayed()).toBe(true);
      expect(await exchangeMatchedCardSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1720] the unmatched bet card subtitle should be 'Bet Unmatched'", async () => {
      expect(await exchangeUnmatchedCardSO.header.getText()).toBe("Bet Unmatched");
    });

    it("[PRPI-1721] the odds should be displayed as 'Odds 1.01'", async () => {
      expect(await unmatchedBetOddsContainerSO.term.getText()).toBe("Odds");
      expect(await unmatchedBetOddsSO.odds.getText()).toBe("1.01");
    });

    it("[PRPI-1722] the stake should be displayed as 'Stake $3.00'", async () => {
      expect(await unmatchedBetStakeContainerSO.term.getText()).toBe("Stake");
      expect(await unmatchedBetStakeSO.odds.getText()).toBe("$3.00");
    });

    it("[PRPI-1723] the profit should be displayed as 'Profit $0.03'", async () => {
      expect(await unmatchedBetProfitContainerSO.term.getText()).toBe("Profit");
      expect(await unmatchedBetProfitSO.pnl.getText()).toBe("$0.03");
    });

    it("[PRPI-1724] a cancel button should be displayed", async () => {
      expect(await exchangeUnmatchedCardSO.cancel.isDisplayed()).toBe(true);
    });

    it("[PRPI-1725] the matched bet card subtitle should be 'Matched'", async () => {
      expect(await exchangeMatchedCardSO.header.getText()).toBe("Matched");
    });

    it("[PRPI-1721] the odds should be displayed as 'Odds 1.01'", async () => {
      expect(await matchedBetOddsContainerSO.term.getText()).toBe("Odds");
      expect(await matchedBetOddsSO.odds.getText()).toBe("1.01");
    });

    it("[PRPI-1726] the stake should be displayed as 'Stake $4.00'", async () => {
      expect(await matchedBetStakeContainerSO.term.getText()).toBe("Stake");
      expect(await matchedBetStakeSO.odds.getText()).toBe("$4.00");
    });

    it("[PRPI-1727] the profit should be displayed as 'Profit $0.04'", async () => {
      expect(await matchedBetProfitContainerSO.term.getText()).toBe("Profit");
      expect(await matchedBetProfitSO.pnl.getText()).toBe("$0.04");
    });

    describe("And then when the user clicks on 'Cancel Bet'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCancelBetResponse(ETX_MOCK_CANCEL));
        await browser.waitUntilClickableNative(exchangeUnmatchedCardSO.cancel);
        await exchangeUnmatchedCardSO.cancel.click();
        await browser.waitUntilDisplayed(exchangeInlineReceiptPanelSO.element);
        await browser.waitUntilDisplayed(cancelledAlertSO.message);
      });

      it("[PRPI-1728] the cancel panel should be displayed", async () => {
        expect(await exchangeInlineReceiptPanelSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-1729] the 'Bet Cancelled' notification should be displayed", async () => {
        expect(await cancelledAlertSO.message.getText()).toBe("Bet Cancelled");
      });

      it("[PRPI-1730] the cancel and edit buttons should not be displayed", async () => {
        expect(await exchangeUnmatchedCardSO.cancel.isExisting()).toBe(false);
        expect(await exchangeUnmatchedCardSO.confirm.isExisting()).toBe(false);
      });

      describe("And then when clicking the Done button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(inlinePanelSO.action);
          await inlinePanelSO.action.click();
          await browser.waitUntilNotDisplayed(exchangeInlineReceiptPanelSO.element);
        });

        it("[PRPI-1731] the receipt should be dismissed", async () => {
          expect(await exchangeInlineReceiptPanelSO.element.isExisting()).toBe(false);
        });
      });
    });
  });
});
