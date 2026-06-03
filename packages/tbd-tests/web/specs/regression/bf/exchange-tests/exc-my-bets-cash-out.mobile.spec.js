const {
  BetSegmentsPO,
  BetSelectionDetailsPO,
  CounterAggregatorPO,
  CardPO,
  MyBetsPagePO,
  MyBetsHeaderPO,
  PNLAndWhatIfPO,
  PrimaryButtonPO,
  ReceiptPanelPO,
  SegmentedControlPO,
} = require("../../../../page-objects");

const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;

const BetCardGroupPO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const MarketBetSelectionCardGroupPO = require("@ppb/tbd-shared/components/MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web.po");
const MarketBetSelectionCardPO = require("@ppb/tbd-shared/components/MarketBetSelectionCard/MarketBetSelectionCard.web.po");
const MarketBetCardGroupPO = require("@ppb/tbd-shared/components/MarketBetCardGroup/MarketBetCardGroup.web.po");
const MarketBetCardPO = require("@ppb/tbd-shared/components/MarketBetCard/MarketBetCard.web.po");

const { getMyBetsEXCViewMock, getMyBetsEXCCardResults } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const routes = require("../../../../../utils/routes");
const { waitForClickable } = require("../../../../helpers/cashout.util");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const betCardGroupPO = new BetCardGroupPO(myBetsPO.betCardGroups[0]);

const marketBetCardGroupPO = new MarketBetCardGroupPO(betCardGroupPO.groupItems[1]);
const marketBetCardPO = new MarketBetCardPO(marketBetCardGroupPO.groupItems[0]);

const liabilityInfoPO = new BetSegmentsPO(marketBetCardPO.liabilityContainer);
const primaryButtonPO = new PrimaryButtonPO();
const primaryButtonPnlPO = new PNLAndWhatIfPO(primaryButtonPO.element);
const cashoutReceiptPO = new ReceiptPanelPO();

const collapseCardPO = new CardPO(marketBetCardGroupPO.groupItems[1]);
const counterAggregatorPO = new CounterAggregatorPO(marketBetCardPO.counterAggregator);

const marketBetSelectionCardGroupPO = new MarketBetSelectionCardGroupPO(marketBetCardGroupPO.groupItems[1]);
const marketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[0]);

const betSelectionDetailsPO = new BetSelectionDetailsPO(marketBetSelectionCardPO.betSelectionDetails);

const newMarketBetSelectionCardPO = new MarketBetSelectionCardPO(marketBetSelectionCardGroupPO.groupItems[1]);

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

const myBetsHeaderPO = new MyBetsHeaderPO(myBetsPO.header);
const segmentedControlPO = new SegmentedControlPO(myBetsHeaderPO.orderStatusFilter);

const UNMATCHED_FOOTBALL_EVENT_MOCK = generateBetCardGroupMock({ isUnmatched: true, numBets: 1, numOfUnmatched: 1 });

const MATCHED_FOOTBALL_EVENT_1_BET_MOCK = generateBetCardGroupMock({
  isUnmatched: false,
  numBets: 1,
});

const VIEW_UNMATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(UNMATCHED_FOOTBALL_EVENT_MOCK, {
  isOpen: true,
  hasFooter: true,
});

const VIEW_MATCHED_FOOTBALL_MOCK = getMyBetsEXCViewMock(MATCHED_FOOTBALL_EVENT_1_BET_MOCK, {
  isOpenMatched: true,
});

const MATCHED_FOOTBALL_EVENT_2_BET_MOCK = generateBetCardGroupMock({
  isUnmatched: false,
  numBets: 2,
  isQuoteUnavailable: true,
});

describe("My Bets Page - Cash Out", () => {
  describe("when the user has 2 bets on the same market (1 matched with cash out available & 1 unmatched)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_UNMATCHED_FOOTBALL_MOCK.urn));
      await mockService.mockHttpRequest(getMyBetsLayout(VIEW_UNMATCHED_FOOTBALL_MOCK));
      await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
      await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEUTRAL_PROFIT_MOCK));

      await browser.url(routes.getMyBetsViewUrl("open"));

      await browser.waitUntilDisplayed(betCardGroupPO.element, "Bet card group wasn't displayed");
      await browser.waitUntilDisplayed(marketBetCardGroupPO.element, "Market bet card wasn't displayed");
    });

    describe("and when the unmatched status filter is selected", () => {
      beforeAll(async () => {
        await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Unmatched");
      });

      it("[PRPI-5512] the unmatched bet should be displayed", async () => {
        expect(await marketBetSelectionCardGroupPO.groupItems.length).toBe(1);
        expect(await betSelectionDetailsPO.editButton.isDisplayed()).toBe(true);
      });

      it("[PRPI-5513] the cash out button should not be displayed", async () => {
        expect(await primaryButtonPO.element.isDisplayed()).toBe(false);
      });

      describe("and when the user clicks on matched filter", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMyBetsLayout(VIEW_MATCHED_FOOTBALL_MOCK));

          await segmentedControlPO.options[1].waitForClickable();
          await segmentedControlPO.options[1].click();
          await browser.waitUntilEquals(segmentedControlPO.selectedOption, "Matched");

          await browser.waitUntilDisplayed(primaryButtonPO.element, "Cash out button wasn't displayed");
        });

        it("[PRPI-10349] the liability info should be displayed", async () => {
          expect(await liabilityInfoPO.leftLabel.getText()).toBe("Liability");
          expect(await liabilityInfoPO.leftValue.getText()).toBe("$1.00");
        });

        it("[PRPI-5514] the match odds market should be displayed with counter '1'", async () => {
          expect(await counterAggregatorPO.title.getText()).toBe("Match Odds");
          expect(await counterAggregatorPO.counter.getText()).toBe("1");
        });

        it("[PRPI-5515] the cash out button should display the label and PnL", async () => {
          expect(await primaryButtonPO.label.getText()).toBe("Cash Out: $1.00");
          expect(await primaryButtonPnlPO.pnl.getText()).toBe("$0.00");

          expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
        });

        describe("and when the cash out profit is updated to a negative value", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_NEGATIVE_PROFIT_MOCK));
            await browser.tickFakeClock();
          });

          it("[PRPI-5516] the cash out button label and PnL should be updated", async () => {
            await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: $0.90");
            await browser.waitUntilEquals(primaryButtonPO.pnl, "-$0.10");

            expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
          });

          describe("and when the quote becomes suspended", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_SUSPENDED_MOCK));
              await browser.tickFakeClock();
            });

            it("[PRPI-5516] the cash out button should display the 'Market Suspended' label", async () => {
              await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out");
              await browser.waitUntilEquals(primaryButtonPO.secondaryLabel, "Market Suspended");
            });

            describe("and when the cash out profit is updated to a positive value", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK));
                await browser.tickFakeClock();
              });

              it("[PRPI-5516] the cash out button label and PnL should be updated", async () => {
                await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out: $1.10");
                await browser.waitUntilEquals(primaryButtonPO.pnl, "$0.10");

                expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
              });

              describe("and when the user clicks on cash out button and it fails", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_POSITIVE_PROFIT_MOCK));
                  await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "CASHOUT_FAILED" }));

                  await browser.tickFakeClock();

                  await waitForClickable(primaryButtonPO.element);
                  await primaryButtonPO.element.click();

                  await browser.waitUntilDisplayed(cashoutReceiptPO.element, "Cash out receipt wasn't displayed");
                });

                it("[PRPI-5516] the cash out receipt should display the 'Cash Out' title", async () => {
                  expect(await cashoutReceiptPO.element.isDisplayed()).toBe(true);
                  expect(await cashoutReceiptPO.receiptTitle.getText()).toBe("Cash Out");
                });

                it("[PRPI-5516] the cash out receipt should display the dismiss button", async () => {
                  expect(await cashoutReceiptPO.dismissButton.isDisplayed()).toBe(true);
                });

                it("[PRPI-5516] the cash out receipt should display the notification icon and message", async () => {
                  expect(await cashoutReceiptPO.notificationIcon.isDisplayed()).toBe(true);
                  expect(await cashoutReceiptPO.notificationMessage.getText()).toBe(
                    "Cash Out failed. Please try again.",
                  );
                });

                it("[PRPI-5516] the cash out button be enabled", async () => {
                  expect(await primaryButtonPO.element.isEnabled()).toBe(true);
                });

                it("[PRPI-5516] the cash out button should display the label and PnL", async () => {
                  expect(await primaryButtonPO.label.getText()).toBe("Cash Out: $1.10");
                  expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
                  expect(await primaryButtonPnlPO.pnl.getText()).toBe("$0.10");
                });

                describe("and when the user clicks on cash out button again and it succeeds", () => {
                  beforeAll(async () => {
                    // Dismiss cash out receipt
                    await cashoutReceiptPO.dismissButton.waitForClickable();
                    await cashoutReceiptPO.dismissButton.click();
                    await browser.waitUntilNotDisplayed(cashoutReceiptPO.element, "Cash out receipt wasn't dismissed");

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

                    await waitForClickable(primaryButtonPO.element);
                    await primaryButtonPO.element.click();

                    await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE_UNAVAILABLE_MOCK));
                    await browser.tickFakeClock();
                  });

                  it("[PRPI-5516] the cash out button should display the success message and profit", async () => {
                    await browser.waitUntilEquals(primaryButtonPO.label, "Cash Out Successful");

                    expect(await primaryButtonPO.secondaryLabel.getText()).toBe("Profit");
                    expect(await primaryButtonPnlPO.pnl.getText()).toBe("$0.10");
                  });

                  it("[PRPI-5516] the cash out button should now be disabled", async () => {
                    expect(await primaryButtonPO.element.isEnabled()).toBe(false);
                  });

                  it("[PRPI-5516] the cash out receipt should not be displayed", async () => {
                    expect(await cashoutReceiptPO.element.isDisplayed()).toBe(false);
                  });

                  describe("and the user clicks on the 'Show Selection Info'", () => {
                    beforeAll(async () => {
                      await collapseCardPO.element.waitForClickable();
                      await collapseCardPO.element.click();
                      await betCardGroupPO.element.scrollIntoView();

                      await browser.waitUntilDisplayed(
                        newMarketBetSelectionCardPO.element,
                        "New Selection is not displayed",
                      );
                    });

                    it("[PRPI-5516] should display a bet selection with the cashout info label", async () => {
                      expect(await newMarketBetSelectionCardPO.infoLabel.getText()).toBe(
                        "Bet placed as a result of you cashing out",
                      );
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
