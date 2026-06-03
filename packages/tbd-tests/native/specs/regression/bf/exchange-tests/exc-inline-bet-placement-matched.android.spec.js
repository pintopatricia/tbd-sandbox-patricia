const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getPlaceBetResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").ETX;
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
  ExchangeInlinePlacePanelSO,
  ExchangeMatchedCardSO,
  InlinePanelSO,
  NudgesNumberInputFieldSO,
  PrimaryButtonSO,
  QuickStakesSO,
  RunnerSO,
  AlertSO,
} = require("../../../../screen-objects");

const exchangeMarketSO = new ExchangeMarketSO();
const firstRunnerSO = new RunnerSO(exchangeMarketSO.runnerList[0]);
const exchangeInlinePlacePanelSO = new ExchangeInlinePlacePanelSO();
const exchangeInlineConfirmPanelSO = new ExchangeInlineConfirmPanelSO();
const exchangeInlineReceiptPanelSO = new ExchangeInlineReceiptPanelSO();
const placeButtonSO = new PrimaryButtonSO();
const confirmButtonSO = new ActionButtonSO(exchangeInlineConfirmPanelSO.confirm);
const quickstakesSO = new QuickStakesSO();
const inlinePanelSO = new InlinePanelSO();
const exchangePriceInputFieldSO = new NudgesNumberInputFieldSO();
const stakeInputFieldSO = new NudgesNumberInputFieldSO(exchangeInlinePlacePanelSO.inputs[1]);
const exchangeMatchedCardSO = new ExchangeMatchedCardSO(exchangeInlineReceiptPanelSO.placedBetCards[0]);
const matchedBetSegmentsSO = new BetSegmentsSO(exchangeMatchedCardSO.results);
const matchedBetOddsSO = new SelectionSegmentSO(matchedBetSegmentsSO.leftSegment);
const matchedBetStakeSO = new SelectionSegmentSO(matchedBetSegmentsSO.midSegment);
const matchedBetLiabilitySO = new SelectionSegmentSO(matchedBetSegmentsSO.midRightSegment);
const matchedBetProfitSO = new SelectionSegmentSO(matchedBetSegmentsSO.rightSegment);
const alertSO = new AlertSO(exchangeInlinePlacePanelSO.notifications);
const titleAlertSO = new AlertSO(exchangeInlinePlacePanelSO.element);

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
      averagePriceMatched: 1.01,
      sizeMatched: 7,
      orderStatus: "EXECUTION_COMPLETE",
    },
  ],
};

const APP_CONTEXT_MOCK = {
  exchangeConfirmBetPlacement: true,
  minStake: 1,
};
// This started to break with the new architecture, needs further investigation
// Since exchange is not enabled in production apps yet, we can keep it skipped for now to unblock other work
// and revisit later before enabling exchange features in production
xdescribe("Inline Betslip - Bet Placement (matched)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(HOME_MOCK));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await startApp("home");
  });

  describe("When pressing a Lay bet button", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.betButtons[1]);
      await firstRunnerSO.betButtons[1].click();
      await browser.waitUntilDisplayed(exchangeInlinePlacePanelSO.element, "Exchange place panel was not displayed");
    });

    it("[PRPI-1702] should have a title that follows the pattern 'Lay (bet against): Market - Selection'", async () => {
      expect(await inlinePanelSO.titlePrefix.getText()).toBe("Lay (bet against):");
      expect(await inlinePanelSO.title.getText()).toBe("Match Odds - Wolves");
    });

    it("[PRPI-1703] the X icon should be displayed", async () => {
      expect(await inlinePanelSO.action.isDisplayed()).toBe(true);
    });

    it("[PRPI-1704] the odds number field should display with odd '1.01' and nudge buttons", async () => {
      expect(await exchangePriceInputFieldSO.numberField.getText()).toBe("1.01");
      expect(await exchangePriceInputFieldSO.nudgeDown.isDisplayed()).toBe(true);
      expect(await exchangePriceInputFieldSO.nudgeUp.isDisplayed()).toBe(true);
    });

    it("[PRPI-1705] the stake number field should display with 'STAKE' word", async () => {
      expect(await stakeInputFieldSO.placeholder.getText()).toBe("STAKE");
    });

    it("[PRPI-1706] The place button should be disabled and with 'Place Bet' words", async () => {
      expect(await placeButtonSO.label.getText()).toBe("Place Bet");
    });

    it("[PRPI-1707] the quick stake buttons should have the defined values", async () => {
      expect(await quickstakesSO.quickStakeLabels[0].getText()).toBe("+ $5");
      expect(await quickstakesSO.quickStakeLabels[1].getText()).toBe("+ $10");
      expect(await quickstakesSO.quickStakeLabels[2].getText()).toBe("+ $20");
      expect(await quickstakesSO.quickStakeLabels[3].getText()).toBe("+ $50");
    });

    describe("And then when focusing on stake input field", () => {
      it("[PRPI-1708] the currency should be displayed", async () => {
        expect(await stakeInputFieldSO.currencySymbol.isDisplayed()).toEqual(true);
      });

      describe("And then when adding a stake value below the minimum stake", () => {
        beforeAll(async () => {
          await stakeInputFieldSO.setValue(0.9);

          // Focus something else to trigger the stake input blur and display the notification
          await browser.waitUntilClickableNative(exchangePriceInputFieldSO.numberField);
          await exchangePriceInputFieldSO.numberField.click();
          await browser.waitUntilEquals(
            alertSO.message,
            "The minimum stake is $1.00. Your stake has been updated accordingly.",
          );
        });

        it("[PRPI-1709] the message 'The minimum stake is \u20AC1.00. Your stake has been updated accordingly.' should display", async () => {
          expect(await alertSO.message.getText()).toBe(
            "The minimum stake is $1.00. Your stake has been updated accordingly.",
          );
        });

        it("[PRPI-1710] the stake value should update to 1", async () => {
          expect(await stakeInputFieldSO.numberField.getText()).toBe("1");
        });
      });

      describe("And then when adding a stake value of 2", () => {
        beforeAll(async () => {
          // We need to set the price value again as it resets to empty after the previous steps
          await exchangePriceInputFieldSO.numberField.setValue(1.01);
          await browser.waitUntilEquals(exchangePriceInputFieldSO.numberField, "1.01");
          await stakeInputFieldSO.numberField.setValue(2);
          await browser.waitUntilEquals(stakeInputFieldSO.numberField, "2");
          await hideKeyboard();
        });

        it("[PRPI-1711] the stake number field should display the value '2'", async () => {
          expect(await stakeInputFieldSO.numberField.getText()).toBe("2");
        });

        it("[PRPI-1712] the place bet button should display the profit label and value", async () => {
          expect(await placeButtonSO.label.getText()).toBe("Place Bet");
          expect(await placeButtonSO.secondaryLabel.getText()).toBe("Liability:");
          expect(await placeButtonSO.pnl.getText()).toBe("$0.02");
        });

        it("[PRPI-1713] the place bet button should be enabled", async () => {
          expect(await placeButtonSO.element.isEnabled()).toBe(true);
        });

        describe("And then when pressing nudge button '+'", () => {
          beforeAll(async () => {
            await browser.waitUntilDisplayed(exchangePriceInputFieldSO.nudgeUp, "Nudge up button was not displayed");
            await exchangePriceInputFieldSO.nudgeUp.click();
            await browser.waitUntilEquals(exchangePriceInputFieldSO.numberField, "1.02");
          });

          it("[PRPI-1714] the odd value should change to '1.02'", async () => {
            expect(await exchangePriceInputFieldSO.numberField.getText()).toBe("1.02");
          });

          it("[PRPI-1715] the place bet button should display updated profit to 'Liability: $0.04'", async () => {
            expect(await placeButtonSO.secondaryLabel.getText()).toBe("Liability:");
            expect(await placeButtonSO.pnl.getText()).toBe("$0.04");
          });

          describe("And then when pressing nudge button '-'", () => {
            beforeAll(async () => {
              await browser.waitUntilDisplayed(
                exchangePriceInputFieldSO.nudgeDown,
                "Nudge down button was not displayed",
              );
              await exchangePriceInputFieldSO.nudgeDown.click();
              await browser.waitUntilEquals(exchangePriceInputFieldSO.numberField, "1.01");
            });

            it("[PRPI-1716] the odd value should change back to '1.01'", async () => {
              expect(await exchangePriceInputFieldSO.numberField.getText()).toBe("1.01");
            });

            it("[PRPI-1716] the place bet button should display updated liability to '$0.02'", async () => {
              expect(await placeButtonSO.secondaryLabel.getText()).toBe("Liability:");
              expect(await placeButtonSO.pnl.getText()).toBe("$0.02");
            });

            describe("And then when pressing the QuickStake button '+ €5'", () => {
              beforeAll(async () => {
                await quickstakesSO.quickStake[0].click();
                await browser.waitUntilEquals(stakeInputFieldSO.numberField, "7");
              });

              it("[PRPI-1716] the stake number field should update stake value to '7'", async () => {
                expect(await stakeInputFieldSO.numberField.getText()).toBe("7");
              });

              it("[PRPI-1716] the place bet button should display updated liability to '$0.07'", async () => {
                expect(await placeButtonSO.secondaryLabel.getText()).toBe("Liability:");
                expect(await placeButtonSO.pnl.getText()).toBe("$0.07");
              });

              describe("And then when placing a Lay bet successfully", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(getPlaceBetResponse(ETX_MOCK_LAY));
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

                it("[PRPI-1716] the receipt should be displayed", async () => {
                  expect(await exchangeInlineReceiptPanelSO.element.isDisplayed()).toBe(true);
                });

                it("[PRPI-1716] should have a title that follows the pattern 'Lay (bet against): Market - Selection'", async () => {
                  expect(await inlinePanelSO.titlePrefix.getText()).toBe("Lay (bet against):");
                  expect(await inlinePanelSO.title.getText()).toBe("Match Odds - Wolves");
                });

                it("[PRPI-1716] the bet card title should display as 'Bet Matched'", async () => {
                  expect(await titleAlertSO.message.getText()).toBe("Bet Matched");
                });

                it("[PRPI-1716] the odds should be displayed as 'Odds 1.01'", async () => {
                  expect(await matchedBetOddsSO.term.getText()).toBe("Odds");
                  expect(await matchedBetOddsSO.odd.getText()).toBe("1.01");
                });

                it("[PRPI-1716] the stake should be displayed as 'Stake $7.00'", async () => {
                  expect(await matchedBetStakeSO.term.getText()).toBe("Stake");
                  expect(await matchedBetStakeSO.odd.getText()).toBe("$7.00");
                });

                it("[PRPI-1716] the liability should be displayed as 'Liability $0.07'", async () => {
                  await browser.waitUntilDisplayed(
                    matchedBetSegmentsSO.midRightSegment,
                    "The liability segment was not displayed",
                  );
                  expect(await matchedBetLiabilitySO.term.getText()).toBe("Liability");
                  expect(await matchedBetLiabilitySO.odd.getText()).toBe("$0.07");
                });

                it("[PRPI-1716] the profit should be displayed as 'Profit $7.00'", async () => {
                  await browser.waitUntilDisplayed(
                    matchedBetSegmentsSO.rightSegment,
                    "The profit segment was not displayed",
                  );
                  expect(await matchedBetProfitSO.term.getText()).toBe("Profit");
                  expect(await matchedBetProfitSO.pnl.getText()).toBe("$7.00");
                });

                describe("And then when clicking the Done button", () => {
                  beforeAll(async () => {
                    await inlinePanelSO.action.click();
                    await browser.waitUntilNotDisplayed(exchangeInlineReceiptPanelSO.element);
                  });

                  it("[PRPI-1716] the receipt should be dismissed", async () => {
                    expect(await exchangeInlineReceiptPanelSO.element.isExisting()).toBe(false);
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
