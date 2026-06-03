const {
  AppPO,
  EventPagePO,
  CardPO,
  RunnerPO,
  InlinePanelPO,
  ExchangeMarketPO,
  ExchangeInlinePlacePanelPO,
  ExchangeUnmatchedCardPO,
  NudgesNumberInputFieldPO,
  PrimaryButtonPO,
  BetSegmentsPO,
  ExchangeInlineReceiptPanelPO,
} = require("../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getPlaceBetResponse, getCancelBetResponse } =
  require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
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
const inlinePanelPO = new InlinePanelPO();
const unmatchedBetSegmentsPO = new BetSegmentsPO(exchangeUnmatchedCardPO.results);

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
  sizeCancelled: 7,
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

describe("Inline Betslip - Bet Placement (unmatched)", () => {
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

  describe("When placing a lay unmatched bet successfully", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_LAY));
      await firstRunnerExchangePO.exchangeBetButtons[1].waitForClickable();
      await firstRunnerExchangePO.exchangeBetButtons[1].click();
      await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element);

      await exchangeStakeInputFieldPO.setValue("7");

      await placeButtonPO.element.waitForClickable();
      await placeButtonPO.element.click();
      await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element);
    });

    it("[PRPI-5309] the receipt should be displayed", async () => {
      expect(await exchangeInlineReceiptPanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-8675] should have a title that follows the pattern 'Lay (bet against): Market - Selection'", async () => {
      expect(await inlinePanelPO.titlePrefix.getText()).toBe("Lay (bet against):");
      expect(await inlinePanelPO.title.getText()).toBe("Match Odds - Wolves");
    });

    it("[PRPI-5311] the bet card title should display as 'Bet Unmatched'", async () => {
      expect(await exchangeUnmatchedCardPO.header.getText()).toBe("Bet Unmatched");
    });

    it("[PRPI-5312] the odds label should be displayed as 'Odds'", async () => {
      expect(await unmatchedBetSegmentsPO.leftLabel.getText()).toBe("Odds");
    });

    it("[PRPI-5313] the odds value should be displayed as '1.01'", async () => {
      expect(await unmatchedBetSegmentsPO.leftValue.getText()).toBe("1.01");
    });

    it("[PRPI-5314] the stake label should be displayed as 'Stake'", async () => {
      expect(await unmatchedBetSegmentsPO.midLabel.getText()).toBe("Stake");
    });

    it("[PRPI-5315] the stake value should be displayed as '$7.00'", async () => {
      expect(await unmatchedBetSegmentsPO.midValue.getText()).toBe("$7.00");
    });

    it("[PRPI-5316] the liability label should be displayed as 'Liability'", async () => {
      expect(await unmatchedBetSegmentsPO.midRightLabel.getText()).toBe("Liability");
    });

    it("[PRPI-5317] the liability value should be displayed as '$0.07'", async () => {
      expect(await unmatchedBetSegmentsPO.midRightValue.getText()).toBe("$0.07");
    });

    it("[PRPI-10512] the profit label should be displayed as 'Profit'", async () => {
      expect(await unmatchedBetSegmentsPO.rightLabel.getText()).toBe("Profit");
    });

    it("[PRPI-10513] the profit value should be $7.00", async () => {
      expect(await unmatchedBetSegmentsPO.rightValue.getText()).toBe("$7.00");
    });

    describe("And then when the user clicks on 'Cancel Bet'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCancelBetResponse(ETX_MOCK_CANCEL));
        await exchangeUnmatchedCardPO.cancel.waitForClickable();
        await exchangeUnmatchedCardPO.cancel.click();
        await browser.waitUntilDisplayed(exchangeInlineReceiptPanelPO.element);
      });

      it("[PRPI-5318] the cancel panel should be displayed", async () => {
        expect(await exchangeInlineReceiptPanelPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-8676] should have a title that follows the pattern 'Bet Cancelled: Market - Selection'", async () => {
        expect(await inlinePanelPO.titlePrefix.getText()).toBe("Bet Cancelled:");
        expect(await inlinePanelPO.title.getText()).toBe("Match Odds - Wolves");
      });

      it("[PRPI-5320] the cancel and edit buttons should not be displayed", async () => {
        expect(await exchangeUnmatchedCardPO.cancel.isExisting()).toBe(false);
        expect(await exchangeUnmatchedCardPO.confirm.isExisting()).toBe(false);
      });

      describe("And then when clicking the Done button", () => {
        beforeAll(async () => {
          await inlinePanelPO.action.waitForClickable();
          await inlinePanelPO.action.click();
          await browser.waitUntilNotDisplayed(exchangeInlineReceiptPanelPO.element);
        });

        it("[PRPI-5321] the receipt should be dismissed", async () => {
          expect(await exchangeInlineReceiptPanelPO.element.isExisting()).toBe(false);
        });
      });
    });
  });
});
