const {
  getAppContext,
  getMyBetsLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.native.so");
const MarketBetSelectionCardGroupSO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.native.so");
const MarketBetSelectionCardSO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.native.so");
const MarketBetCardGroupSO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.native.so");
const MarketBetCardSO = require("@ppb/tbd-shared/components/MarketBetCard/MarketBetCard.native.so");
const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  BetSegmentsSO,
  BetSelectionDetailsSO,
  CardSO,
  CounterAggregatorSO,
  FootballScoreboardSO,
  InfoLabelSO,
  MyBetsHeaderSO,
  MyBetsScreenSO,
  PNLAndWhatIfSO,
  PrimaryButtonSO,
  ReceiptPanelSO,
  ReceiptTitleSO,
  SegmentedControlSO,
  SelectionSegmentSO,
  OddsSO,
} = require("../../../../screen-objects");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsSO = new MyBetsScreenSO();

const betCardGroupSO = new BetCardGroupSO(myBetsSO.betCardGroups[0]);

const footballScoreboardSO = new FootballScoreboardSO(betCardGroupSO.groupItems[0]);

const marketBetCardGroupSO = new MarketBetCardGroupSO(betCardGroupSO.groupItems[1]);
const marketBetCardSO = new MarketBetCardSO(marketBetCardGroupSO.groupItems[0]);

const betSegmentsSO = new BetSegmentsSO(marketBetCardSO.liabilityContainer);
const liabilityLabelSO = new SelectionSegmentSO(betSegmentsSO.leftSegment);
const liabilityValueSO = new OddsSO(betSegmentsSO.leftSegment);

const primaryButtonSO = new PrimaryButtonSO();
const primaryButtonProfitSO = new PNLAndWhatIfSO(primaryButtonSO.element);

const cashoutReceiptSO = new ReceiptPanelSO();
const cashoutReceiptTitleSO = new ReceiptTitleSO();

const collapseSO = new CardSO(marketBetCardGroupSO.groupItems[1]);
const counterAggregatorSO = new CounterAggregatorSO(marketBetCardSO.counterAggregator);

const marketBetSelectionCardGroupSO = new MarketBetSelectionCardGroupSO(marketBetCardGroupSO.groupItems[1]);
const marketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[0]);

const betSelectionDetailsSO = new BetSelectionDetailsSO(marketBetSelectionCardSO.betSelectionDetails);

const newMarketBetSelectionCardSO = new MarketBetSelectionCardSO(marketBetSelectionCardGroupSO.groupItems[1]);
const newMarketBetSelectionCardInfoLabelSO = new InfoLabelSO(newMarketBetSelectionCardSO.infoLabel);

const CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK = [
  {
    marketId: "1.11111111",
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
    value: 1,
    currentLiability: 1,
    profit: "0",
  },
];

const CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK = [
  {
    marketId: "1.11111111",
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
    value: 1.1,
    currentLiability: 1,
    profit: 0.1,
  },
];

const CASHOUT_QUOTE_NEGATIVE_PROFIT_MOCK = [
  {
    marketId: "1.11111111",
    status: "AVAILABLE",
    algorithm: "ZERO_BACK",
    value: 0.9,
    currentLiability: 1,
    profit: -0.1,
  },
];

const CASHOUT_QUOTE_SUSPENDED_MOCK = [
  {
    marketId: "1.11111111",
    status: "SUSPENDED",
  },
];

const CASHOUT_QUOTE_UNAVAILABLE_MOCK = [
  {
    marketId: "1.11111111",
    status: "UNAVAILABLE",
  },
];

const generateBetCardGroupMock = ({ isUnmatched, numBets, numOfUnmatched = 0, isQuoteUnavailable }) => {
  const BETS = [
    {
      __typename: "MarketBetSelectionCard",
      id: "111111111111",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: (isUnmatched && "1970-01-01T00:00:00.000Z") || "2023-09-25T16:44:09.000Z",
      price: 2.0,
      runnerDesc: "Rio Ave",
      side: "BACK",
      size: 1,
      profit: 1,
      currentLiability: 1,
      selectionId: 44444444,
      isUnmatched: isUnmatched || "false",
    },
    {
      __typename: "MarketBetSelectionCard",
      id: "2222222222222",
      handicap: 0,
      placedDate: "2023-09-25T16:44:09.000Z",
      settledDate: null,
      matchedDate: (isUnmatched && "1970-01-01T00:00:00.000Z") || "2023-09-25T16:44:09.000Z",
      price: 2.0,
      runnerDesc: "Rio Ave",
      side: "LAY",
      size: 0.9,
      profit: 1.1,
      currentLiability: 1,
      selectionId: 44444444,
      isUnmatched: isUnmatched || "false",
      isCashout: true,
    },
  ];

  return [
    {
      aggregatorDesc: "Sporting Lisbon v Rio Ave",
      edges: [
        {
          __typename: "FixtureCard",
          homeName: "Sporting Lisbon",
          awayName: "Rio Ave",
          scheduledAt: "2023-09-25T19:15:00Z",
        },
        {
          __typename: "MarketBetCardGroup",
          edges:
            (numBets && [
              {
                __typename: "MarketBetCard",
                description: "Match Odds",
                numOfOrders: numBets,
                numOfUnmatched,
                ...((!isUnmatched && { liability: isQuoteUnavailable ? 0 : 1 }) || {}),
                ...((!isUnmatched && {
                  cashoutQuotes: isQuoteUnavailable
                    ? CASHOUT_QUOTE_UNAVAILABLE_MOCK
                    : CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK,
                }) ||
                  {}),
              },
              {
                __typename: "MarketBetExpandableCardGroup",
                isOpen: !!isUnmatched,
                edges: [
                  {
                    __typename: "MarketBetSelectionCardGroup",
                    edges: BETS.slice(0, numBets),
                  },
                ],
              },
            ]) ||
            [],
        },
      ],
    },
  ];
};

const myBetsHeaderSO = new MyBetsHeaderSO(myBetsSO.header);
const segmentedControlSO = new SegmentedControlSO(myBetsHeaderSO.orderStatusFilter);

const UNMATCHED_FOOTBALL_EVENT_MOCK = generateBetCardGroupMock({ isUnmatched: true, numBets: 1, numOfUnmatched: 1 });

const MATCHED_FOOTBALL_EVENT_1_BET_MOCK = generateBetCardGroupMock({
  isUnmatched: false,
  numBets: 1,
});

const MATCHED_FOOTBALL_EVENT_2_BET_MOCK = generateBetCardGroupMock({
  isUnmatched: false,
  numBets: 2,
  isQuoteUnavailable: true,
});

const VIEW_UNMATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(UNMATCHED_FOOTBALL_EVENT_MOCK, {
  isOpen: true,
  hasFooter: true,
});

const VIEW_MATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_1_BET_MOCK, {
  isOpenMatched: true,
});

const MY_BETS_URL = routes.getMyBetsViewUrl("open");

describe("My Bets Page - Cash Out", () => {
  describe("when the user has 2 bets on the same market (1 unmatched & 1 matched) with cash out available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(MY_BETS_URL);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(betCardGroupSO.element, "Bet card group wasn't displayed");
      await browser.waitUntilDisplayed(footballScoreboardSO.element, "Football scoreboard wasn't displayed");
      await browser.waitUntilDisplayed(marketBetCardGroupSO.element, "Market bet card group wasn't displayed");
    });

    describe("and when the unmatched status filter is selected", () => {
      beforeAll(async () => {
        await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Unmatched");
      });

      it("[PRPI-1808] the unmatched bet should be displayed", async () => {
        expect(await marketBetSelectionCardGroupSO.groupItems.length).toBe(1);
        expect(await betSelectionDetailsSO.editButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-1809] the cash out button should not be displayed", async () => {
        expect(await primaryButtonSO.element.isDisplayed()).toBe(false);
      });

      describe("and when the user clicks on matched filter", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));

          await browser.waitUntilClickableNative(segmentedControlSO.options[1], "Order status filter wasn't clickable");
          await segmentedControlSO.options[1].click();

          await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Matched");
          await browser.waitUntilDisplayed(primaryButtonSO.element, "Cash out button wasn't not visible");
        });

        it("[PRPI-1810] the match odds market should be displayed with counter '1'", async () => {
          expect(await counterAggregatorSO.title.getText()).toBe("Match Odds");
          expect(await counterAggregatorSO.counter.getText()).toBe("1");
        });

        it("[PRPI-10349] the liability info should be displayed", async () => {
          expect(await liabilityLabelSO.term.getText()).toBe("Liability");
          expect(await liabilityValueSO.odds.getText()).toBe("$1.00");
        });

        it("[PRPI-1811] the cash out button should display the label and PnL", async () => {
          expect(await primaryButtonSO.label.getText()).toBe("Cash Out: $1.00");
          expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
          expect(await primaryButtonProfitSO.pnl.getText()).toBe("$0.00");
        });

        describe("and when the cash out profit is updated to a negative value", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEGATIVE_PROFIT_MOCK));
          });

          it("[PRPI-1812] the cash out button label and PnL should be updated", async () => {
            await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $0.90");
            await browser.waitUntilEquals(primaryButtonSO.pnl, "-$0.10");

            expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
          });
        });

        describe("and when the quote becomes suspended", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_SUSPENDED_MOCK));
          });

          it("[PRPI-1813] the cash out button should display the 'Market Suspended' label", async () => {
            await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out");
            await browser.waitUntilEquals(primaryButtonSO.secondaryLabel, "Market Suspended");
          });
        });

        describe("and when the cash out profit is updated to a positive value", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK));
          });

          it("[PRPI-1812] the cash out button label and PnL should be updated", async () => {
            await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out: $1.10");
            await browser.waitUntilEquals(primaryButtonSO.pnl, "$0.10");

            expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
          });
        });

        describe("and when the user clicks on cash out button and it fails", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK));
            await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "CASHOUT_FAILED" }));

            await browser.waitUntilClickableNative(primaryButtonSO.element, "My bets button wasn't clickable");
            await primaryButtonSO.element.click();

            await browser.waitUntilDisplayed(cashoutReceiptSO.element, "Receipt wasn't displayed");
          });

          afterAll(async () => {
            if ((await cashoutReceiptSO.element.isDisplayed()) === true) {
              await browser.waitUntilClickableNative(
                cashoutReceiptTitleSO.dismissButton,
                "Receipt dismiss button wasn't clickable",
              );
              await cashoutReceiptTitleSO.dismissButton.click();
              await browser.waitUntilNotDisplayed(cashoutReceiptSO.element, "Receipt wasn't dismissed");
            }
          });

          it("[PRPI-1814] the cash out receipt should display the 'Cash Out' title", async () => {
            expect(await cashoutReceiptTitleSO.label.getText()).toBe("Cash Out");
          });

          it("[PRPI-1814] the cash out receipt should display the dismiss button", async () => {
            expect(await cashoutReceiptTitleSO.dismissButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-1814] the cash out receipt should display the notification icon and message", async () => {
            expect(await cashoutReceiptSO.notificationIcon.isDisplayed()).toBe(true);
            expect(await cashoutReceiptSO.notificationMessage.getText()).toBe("Cash Out failed. Please try again.");
          });

          // Android can't validate the cash out button under the overlay
          if (driver.isIOS) {
            it("[PRPI-1814] the cash out button should display the label and PnL", async () => {
              expect(await primaryButtonSO.label.getText()).toBe("Cash Out: $1.10");
              expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
              expect(await primaryButtonProfitSO.pnl.getText()).toBe("$0.10");
            });
          }
        });

        describe("and when the user clicks on cash out button and it succeeds", () => {
          beforeAll(async () => {
            const [
              {
                edges: [, MARKET_BET_CARD_GROUP],
              },
            ] = MATCHED_FOOTBALL_EVENT_2_BET_MOCK;

            const BFF_CARDS_UPDATES = getMyBetsEXCCardResults([MARKET_BET_CARD_GROUP], {
              eventId: 1111111111,
              marketId: "1.11111111",
              isOpenMatched: true,
            });

            await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }));
            await mockService.mockHttpRequest(getCardResults(BFF_CARDS_UPDATES));

            await browser.waitUntilClickableNative(primaryButtonSO.element, "Cash out button wasn't clickable");
            await primaryButtonSO.element.click();

            await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));
          });

          // Android can't validate the cash out button under the overlay
          if (driver.isIOS) {
            it("[PRPI-5516] the liability info should be displayed", async () => {
              expect(await liabilityLabelSO.term.getText()).toBe("Liability");
              expect(await liabilityValueSO.odds.getText()).toBe("$0.00");
            });

            it("[PRPI-1814] the cash out button should display the success message and profit", async () => {
              await browser.waitUntilEquals(primaryButtonSO.label, "Cash Out Successful");

              expect(await primaryButtonSO.secondaryLabel.getText()).toBe("Profit");
              expect(await primaryButtonProfitSO.pnl.getText()).toBe("$0.10");
            });
          }

          it("[PRPI-1814] the cash out receipt should not be displayed", async () => {
            expect(await cashoutReceiptSO.element.isDisplayed()).toBe(false);
          });

          describe("and the user clicks on 'Show Selection Info'", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(collapseSO.title, "Collapse is not clickable");
              await collapseSO.title.click();

              await browser.waitUntilDisplayed(newMarketBetSelectionCardSO.element, "New Selection is not displayed");
            });

            it("[PRPI-1814] should display a bet selection with the cashout info label", async () => {
              expect(await newMarketBetSelectionCardInfoLabelSO.label.getText()).toBe(
                "Bet placed as a result of you cashing out",
              );
            });
          });
        });
      });
    });
  });
});
