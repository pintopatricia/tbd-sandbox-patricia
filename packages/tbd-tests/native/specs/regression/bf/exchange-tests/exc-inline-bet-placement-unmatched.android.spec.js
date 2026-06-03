const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse, getCancelBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getSportsLayout, getGenericLayout, getAppContext } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { hideKeyboard } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");

const {
  ExchangeInlineConfirmPanelSO,
  ExchangeInlineReceiptPanelSO,
  ExchangeMarketSO,
  SelectionSegmentSO,
  ActionButtonSO,
  BetSegmentsSO,
  NudgesNumberInputFieldSO,
  ExchangeInlinePlacePanelSO,
  ExchangeUnmatchedCardSO,
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
const placeButtonSO = new PrimaryButtonSO(exchangeInlinePlacePanelSO.placeButton);
const confirmButtonSO = new ActionButtonSO(exchangeInlineConfirmPanelSO.confirm);
const exchangeStakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const exchangeInlineReceiptPanelSO = new ExchangeInlineReceiptPanelSO();
const exchangeUnmatchedCardSO = new ExchangeUnmatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[0]);
const inlinePanelSO = new InlinePanelSO();
const unmatchedBetSegmentsSO = new BetSegmentsSO(exchangeUnmatchedCardSO.results);
const unmatchedBetOddsContainerSO = new SelectionSegmentSO(unmatchedBetSegmentsSO.leftSegment);
const unmatchedBetOddsSO = new OddsSO(unmatchedBetSegmentsSO.leftSegment);
const unmatchedBetStakeContainerSO = new SelectionSegmentSO(unmatchedBetSegmentsSO.midSegment);
const unmatchedBetStakeSO = new OddsSO(unmatchedBetSegmentsSO.midSegment);
const unmatchedBetLiabilityContainerSO = new SelectionSegmentSO(unmatchedBetSegmentsSO.midRightSegment);
const unmatchedBetLiabilitySO = new PNLAndWhatIfSO(unmatchedBetSegmentsSO.midRightSegment);
const unmatchedBetProfitContainerSO = new SelectionSegmentSO(unmatchedBetSegmentsSO.rightSegment);
const unmatchedBetProfitSO = new OddsSO(unmatchedBetSegmentsSO.rightSegment);
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

const ETX_MOCK_LAY = {
  marketId: "1.160337355",
  status: "SUCCESS",
  instructionReports: [
    {
      betId: "11111111111",
      status: "SUCCESS",
      price: 1.01,
      size: 7,
      side: "LAY",
      averagePriceMatched: 0,
      sizeMatched: 0,
      orderStatus: "EXECUTABLE",
    },
  ],
};

const ETX_MOCK_CANCEL = {
  marketId: "1.160337355",
  status: "SUCCESS",
  sizeCancelled: 2,
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

xdescribe("Inline Betslip - Bet Placement (unmatched)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("When placing a lay unmatched bet successfully", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_LAY));
      await browser.waitUntilDisplayed(firstRunnerSO.betButtons[1]);
      await firstRunnerSO.betButtons[1].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element, "Exchange place panel was not displayed");
      await exchangeStakeInputFieldSO.numberField.setValue(7);
      await browser.waitUntilEquals(exchangeStakeInputFieldSO.numberField, "7");
      await hideKeyboard();
      await placeButtonSO.element.click();
      await browser.waitUntilDisplayed(
        exchangeInlineConfirmPanelSO.element,
        "Exchange confirm panel was not displayed",
      );
      await confirmButtonSO.element.click();
      await browser.waitUntilDisplayed(
        exchangeInlineReceiptPanelSO.element,
        "Exchange receipt panel was not displayed",
      );
    });

    it("[PRPI-1732] the receipt should be displayed", async () => {
      expect(await exchangeInlineReceiptPanelSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-1733] the 'Lay bet' title should be displayed", async () => {
      expect(await inlinePanelSO.title.getText()).toBe("Lay bet");
    });

    it("[PRPI-1734] the bet card title should display as 'Unmatched'", async () => {
      expect(await exchangeUnmatchedCardSO.header.getText()).toBe("Unmatched");
    });

    it("[PRPI-1735] the odds should be displayed as 'Odds 1.01'", async () => {
      expect(await unmatchedBetOddsContainerSO.term.getText()).toBe("Odds");
      expect(await unmatchedBetOddsSO.odds.getText()).toBe("1.01");
    });

    it("[PRPI-1736] the stake should be displayed as 'Stake $7.00'", async () => {
      expect(await unmatchedBetStakeContainerSO.term.getText()).toBe("Stake");
      expect(await unmatchedBetStakeSO.odds.getText()).toBe("$7.00");
    });

    it("[PRPI-1737] the liability should be displayed as 'Liability $0.07'", async () => {
      expect(await unmatchedBetLiabilityContainerSO.term.getText()).toBe("Liability");
      expect(await unmatchedBetLiabilitySO.pnl.getText()).toBe("$0.07");
    });

    it("[PRPI-10569] the profit should be displayed as 'Profit $7.00'", async () => {
      expect(await unmatchedBetProfitContainerSO.term.getText()).toBe("Profit");
      expect(await unmatchedBetProfitSO.odds.getText()).toBe("$7.00");
    });

    describe("And then when the user clicks on 'Cancel Bet'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCancelBetResponse(ETX_MOCK_CANCEL));
        await exchangeUnmatchedCardSO.cancel.click();
        await browser.waitUntilEquals(cancelledAlertSO.message, "Bet Cancelled");
      });

      it("[PRPI-1738] the cancel panel should be displayed", async () => {
        expect(await exchangeInlineReceiptPanelSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-1739] the 'Bet Cancelled' notification should be displayed", async () => {
        expect(await cancelledAlertSO.message.getText()).toBe("Bet Cancelled");
      });

      it("[PRPI-1740] the cancel and edit buttons should not be displayed", async () => {
        expect(await exchangeUnmatchedCardSO.cancel.isExisting()).toBe(false);
        expect(await exchangeUnmatchedCardSO.confirm.isExisting()).toBe(false);
      });

      describe("And then when clicking the Done button", () => {
        beforeAll(async () => {
          await inlinePanelSO.action.click();
          await browser.waitUntilNotDisplayed(exchangeInlineReceiptPanelSO.element);
        });

        it("[PRPI-1741] the receipt should be dismissed", async () => {
          expect(await exchangeInlineReceiptPanelSO.element.isExisting()).toBe(false);
        });
      });
    });
  });
});
