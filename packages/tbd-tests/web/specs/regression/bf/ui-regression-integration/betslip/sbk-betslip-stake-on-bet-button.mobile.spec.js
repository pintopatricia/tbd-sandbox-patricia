const {
  MinimizedPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  BetControlsPO,
  CurrencyNumberInputFieldPO,
  PrimaryButtonPO,
  SportsbookPlacePanelPO,
  BetsSummaryPO,
  PlaceFooterPO,
  SportPagePO,
  CardPO,
  AlertPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const firstCardPO = new CardPO(sportPagePO.primaryEventCards[0]);
const firstSportsbookMarketPO = new InlineSportsbookMarketPO(firstCardPO.inlineSportsbookMarket);
const firstRunnerPO = new SportsbookBetButtonPO(firstSportsbookMarketPO.betButtons[0]);
const secondRunnerPO = new SportsbookBetButtonPO(firstSportsbookMarketPO.betButtons[1]);

const sportsbookMinimizedBetslipPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const sbkPlacePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(sbkPlacePanelPO.element);
const singleStakeInputFieldPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const multipleBetsSummaryPO = new BetsSummaryPO(sbkPlacePanelPO.element);
const multiplePlaceButtonPO = new PrimaryButtonPO(sbkPlacePanelPO.place);
const placeFooterPO = new PlaceFooterPO();
const placeNotificationPO = new AlertPO(sbkPlacePanelPO.element);

const SPORT_ID = 1;
const COMPETITION_ID = 12191691;
const EVENT_ID = 29899897;
const FIRST_MARKET_ID = "924.1";
const FIRST_SELECTION_ID = 1;
const SECOND_SELECTION_ID = 2;
const THIRD_SELECTION_ID = 3;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:${SPORT_ID}`,
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${FIRST_MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:${EVENT_ID}`,
                          name: "Man City v Real Madrid",
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${FIRST_SELECTION_ID}`,
                          name: "Man City",
                          selectionId: FIRST_SELECTION_ID,
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${SECOND_SELECTION_ID}`,
                          name: "Real Madrid",
                          selectionId: SECOND_SELECTION_ID,
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${THIRD_SELECTION_ID}`,
                          name: "The Draw",
                          selectionId: THIRD_SELECTION_ID,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${FIRST_SELECTION_ID}` },
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${SECOND_SELECTION_ID}` },
                      { runnerURN: `ppb:sbkRunner:${FIRST_MARKET_ID}/${THIRD_SELECTION_ID}` },
                    ],
                  },
                },
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: { name: "Man City" },
                  away: { name: "Real Madrid" },
                },
                sportevent: {
                  name: "Man City vs Real Madrid",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: `ppb:competition:${COMPETITION_ID}`,
                    name: "Competition Name",
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: `ppb:tbd:card:group:topEventsInSport:${SPORT_ID}`,
      },
    },
  ],
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

const SMP_MOCK = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 2.1 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 2.1 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
      ],
    },
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
      ],
    },
  ],
};

const SMP_MOCK_ONE_SUSPENDED_RUNNER = {
  markets: [
    {
      ...SMP_MOCK.markets[0],
      runnerDetails: [{ ...SMP_MOCK.markets[0].runnerDetails[0], runnerStatus: "SUSPENDED" }],
    },
    SMP_MOCK.markets[1],
  ],
};

const SMP_MOCK_SUSPENDED_RUNNERS = {
  markets: [
    {
      ...SMP_MOCK.markets[0],
      runnerDetails: [{ ...SMP_MOCK.markets[0].runnerDetails[0], runnerStatus: "SUSPENDED" }],
    },
    {
      ...SMP_MOCK.markets[1],
      runnerDetails: [{ ...SMP_MOCK.markets[1].runnerDetails[0], runnerStatus: "SUSPENDED" }],
    },
  ],
};

const FIRST_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: FIRST_SELECTION_ID,
        },
      ],
    },
  ],

  averageOdds: 2.1,
  winAverageOdds: 2.1,
  betType: "SINGLE",
};

const FIRST_COMBINATION_ODDS = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: FIRST_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.1 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 2.1 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SIB_SINGLE_MOCK = {
  betCombinations: [FIRST_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_ODDS],
};

const SIB_SINGLE_MOCK_SUSPENDED = {
  ...SIB_SINGLE_MOCK,
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: FIRST_SELECTION_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const FIRST_COMBINATION_CHANGED_ODDS = {
  ...FIRST_COMBINATION,
  averageOdds: 4,
  winAverageOdds: 4,
};

const FIRST_COMBINATION_CHANGED_ODDS_RUNNERS = {
  ...FIRST_COMBINATION_ODDS,
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 4 },
      fractionalDisplayOdds: { numerator: 8, denominator: 11 },
    },
    decimalDisplayOdds: { decimalOdds: 4 },
    fractionalDisplayOdds: { numerator: 8, denominator: 11 },
  },
};

const SMP_MOCK_CHANGED_ODDS = {
  markets: [
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: FIRST_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 4 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 8, denominator: 11 },
          },
        },
      ],
    },
    {
      marketId: FIRST_MARKET_ID,
      runnerDetails: [
        {
          selectionId: SECOND_SELECTION_ID,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 3 },
              fractionalDisplayOdds: { numerator: 8, denominator: 11 },
            },
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 2, denominator: 5 },
          },
        },
      ],
    },
  ],
};

const SIB_SINGLE_MOCK_CHANGED_ODDS = {
  betCombinations: [FIRST_COMBINATION_CHANGED_ODDS],
  runnerOdds: [FIRST_COMBINATION_CHANGED_ODDS_RUNNERS],
};

const SECOND_COMBINATION = {
  legCombinations: [
    {
      runners: [
        {
          marketId: FIRST_MARKET_ID,
          selectionId: SECOND_SELECTION_ID,
        },
      ],

      legType: "SIMPLE_SELECTION",
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 500,
  averageOdds: 3,
  winAverageOdds: 3,
  betType: "SINGLE",
};

const SECOND_COMBINATION_ODDS = {
  runner: {
    marketId: FIRST_MARKET_ID,
    selectionId: SECOND_SELECTION_ID,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 3 },
      fractionalOdds: { numerator: 2, denominator: 5 },
    },
    decimalDisplayOdds: { decimalOdds: 3 },
    fractionalDisplayOdds: { numerator: 2, denominator: 5 },
  },
};

const DOUBLE_ONELINE_COMBINATION = {
  legCombinations: [],
  numLines: 1,
  averageOdds: 10,
  winAverageOdds: 10,
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 10 } },
    decimalDisplayOdds: { decimalOdds: 10 },
  },
  betType: "DOUBLE",
};

const SIB_DOUBLE_MOCK = {
  betCombinations: [FIRST_COMBINATION_CHANGED_ODDS, SECOND_COMBINATION, DOUBLE_ONELINE_COMBINATION],
  runnerOdds: [FIRST_COMBINATION_CHANGED_ODDS_RUNNERS, SECOND_COMBINATION_ODDS],
};

const SIB_DOUBLE_MOCK_PARTIAL_SUSPENDED = {
  ...SIB_DOUBLE_MOCK,
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: FIRST_SELECTION_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const SIB_DOUBLE_MOCK_SUSPENDED = {
  ...SIB_DOUBLE_MOCK,
  betFailures: [
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: FIRST_SELECTION_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
    {
      failedRunner: {
        marketId: FIRST_MARKET_ID,
        selectionId: SECOND_SELECTION_ID,
      },
      failureCode: "MARKET_SUSPENDED",
    },
  ],
};

const PLACE_SUCCESS = {
  result: [
    {
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 1.23 },
      },
      betType: "DOUBLE",
      runners: [
        {
          runner: { marketId: FIRST_MARKET_ID, selectionId: FIRST_SELECTION_ID },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          runner: { marketId: FIRST_MARKET_ID, selectionId: SECOND_SELECTION_ID },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: FIRST_MARKET_ID, selectionId: FIRST_SELECTION_ID } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
        {
          leg: {
            betRunners: [{ runner: { marketId: FIRST_MARKET_ID, selectionId: SECOND_SELECTION_ID } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
        },
      ],

      totalStake: 2.0,
      totalPotentialWin: 4.12,
    },
  ],
};

describe("Betslip - Stake on Bet Button", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { oddsMovement: "false" }));
    await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
    await browser.waitUntilEquals(firstRunnerPO.odd, "2.1");
  });

  describe("when the user adds a bet to betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK));
      await firstRunnerPO.element.waitForClickable();
      await firstRunnerPO.element.click();

      await browser.waitUntilDisplayed(sbkPlacePanelPO.element);
      await browser.waitUntilEquals(multiplePlaceButtonPO.label, "Please Enter Stake");
    });

    it("[PRPI-3996] should display 'Balance After Bet' with the correct value", async () => {
      expect(await multipleBetsSummaryPO.leftSegmentLabel.getText()).toBe("Balance After Bet");
      expect(await multipleBetsSummaryPO.leftSegmentValue.getText()).toBe("$123.00");
    });

    it("[PRPI-3997] should display 'Please Enter Stake' on the place button", async () => {
      expect(await multiplePlaceButtonPO.label.getText()).toBe("Please Enter Stake");
    });

    describe("and the user enters a stake", () => {
      beforeAll(async () => {
        await singleStakeInputFieldPO.element.waitForClickable();
        await singleStakeInputFieldPO.element.click();
        await singleStakeInputFieldPO.setValue("2");
        await browser.waitUntilEquals(singleStakeInputFieldPO.numberField, "2");
      });

      it("[PRPI-3998] should display 'Balance After Bet' with the correct value", async () => {
        expect(await multipleBetsSummaryPO.leftSegmentValue.getText()).toBe("$121.00");
      });

      it("[PRPI-3999] should display 'Place $2.00 Bet' on the place button", async () => {
        expect(await multiplePlaceButtonPO.label.getText()).toBe("Place $2.00 Bet");
        expect(await multiplePlaceButtonPO.secondaryLabel.isDisplayed()).toBe(false);
      });

      describe("and the odds change", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_CHANGED_ODDS, { ignoreRequestedMarketIdsMatch: true }),
          );
          await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK_CHANGED_ODDS));

          await browser.waitUntilEquals(multiplePlaceButtonPO.secondaryLabel, "Accept @4 &");
        });

        it("[PRPI-4000] should display odds movement message on the place button", async () => {
          expect(await multiplePlaceButtonPO.secondaryLabel.getText()).toBe("Accept @4 &");
          expect(await multiplePlaceButtonPO.label.getText()).toBe("Place $2.00 Bet");
        });

        describe("and the market gets suspended", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_SUSPENDED_RUNNERS, { ignoreRequestedMarketIdsMatch: true }),
            );
            await mockService.mockHttpRequest(getImplyBetsResponse(SIB_SINGLE_MOCK_SUSPENDED));

            await browser.waitUntilEquals(multiplePlaceButtonPO.label, "Suspended");
          });

          it("[PRPI-4001] should display 'Suspended' on the place button and the remove all trash icon should be enabled", async () => {
            expect(await multiplePlaceButtonPO.element.isEnabled()).toBe(false);
            expect(await multiplePlaceButtonPO.label.getText()).toBe("Suspended");
            expect(await placeFooterPO.removeAllButton.isEnabled()).toBe(true);
          });

          describe("and the user adds another selection", () => {
            beforeAll(async () => {
              // Make the markets no longer suspended
              await mockService.mockHttpRequest(
                getMarketPrices(SMP_MOCK_CHANGED_ODDS, { ignoreRequestedMarketIdsMatch: true }),
              );

              // close betslip
              await betslipDrawerPO.header.click();
              await browser.waitUntilNotDisplayed(sbkPlacePanelPO.element, "Single panel hasn't been minimized");
              await browser.waitUntilEquals(secondRunnerPO.odd, "3");

              // add second selection
              await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
              await secondRunnerPO.element.click();
              await browser.waitUntilContainsText(
                sportsbookMinimizedBetslipPO.title,
                "10",
                "2 Leg multiple was not combined",
              );

              // open betslip
              await sportsbookMinimizedBetslipPO.element.waitForClickable();
              await sportsbookMinimizedBetslipPO.element.click();
              await browser.waitUntilDisplayed(sbkPlacePanelPO.element, "Place panel hasn't been expanded");
            });

            it("[PRPI-4002] should display 'Balance After Bet' with the correct value", async () => {
              expect(await multipleBetsSummaryPO.leftSegmentValue.getText()).toBe("$121.00");
            });

            it("[PRPI-4003] should display odds movement message on the place button", async () => {
              expect(await multiplePlaceButtonPO.secondaryLabel.getText()).toBe("Accept odds change and");
              expect(await multiplePlaceButtonPO.label.getText()).toBe("Place $2.00 Bet");
            });

            describe("and one combinations gets suspended", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(
                  getMarketPrices(SMP_MOCK_ONE_SUSPENDED_RUNNER, { ignoreRequestedMarketIdsMatch: true }),
                );
                await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK_PARTIAL_SUSPENDED));

                await browser.waitUntilEquals(placeNotificationPO.message, "Odds and availability have changed");
              });

              it("[PRPI-6330] should display the same message on the place button but should be disabled and the remove all trash icon should be enabled", async () => {
                expect(await multiplePlaceButtonPO.element.isEnabled()).toBe(false);
                expect(await multiplePlaceButtonPO.secondaryLabel.getText()).toBe("Accept odds change and");
                expect(await multiplePlaceButtonPO.label.getText()).toBe("Place $2.00 Bet");
                expect(await placeFooterPO.removeAllButton.isEnabled()).toBe(true);
              });

              describe("and all combinations get suspended", () => {
                beforeAll(async () => {
                  await mockService.mockHttpRequest(
                    getMarketPrices(SMP_MOCK_SUSPENDED_RUNNERS, { ignoreRequestedMarketIdsMatch: true }),
                  );
                  await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK_SUSPENDED));

                  await browser.waitUntilEquals(multiplePlaceButtonPO.label, "Suspended");
                });

                it("[PRPI-6331] should display 'Suspended' on the place button and the remove all trash icon should be enabled", async () => {
                  expect(await multiplePlaceButtonPO.element.isEnabled()).toBe(false);
                  expect(await multiplePlaceButtonPO.secondaryLabel.isDisplayed()).toBe(false);
                  expect(await multiplePlaceButtonPO.label.getText()).toBe("Suspended");
                  expect(await placeFooterPO.removeAllButton.isEnabled()).toBe(true);
                });

                describe("and the combinations are no longer suspended and the user places the bet", () => {
                  beforeAll(async () => {
                    await mockService.mockHttpRequest(
                      getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }),
                    );
                    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_DOUBLE_MOCK));
                    // Add delay to the SPB mock so we can see the 'Placing Bet' label on the place button
                    await mockService.mockHttpRequest(getPlaceBet(PLACE_SUCCESS, 5000));

                    await browser.waitUntilEquals(multiplePlaceButtonPO.label, "Place $2.00 Bet");

                    await multiplePlaceButtonPO.element.waitForClickable();
                    await multiplePlaceButtonPO.element.click();

                    await browser.waitUntilEquals(multiplePlaceButtonPO.label, "Placing Bet...");
                  });

                  it("[PRPI-6331] should display 'Placing Bet...' on the place button", async () => {
                    expect(await multiplePlaceButtonPO.element.isEnabled()).toBe(false);
                    expect(await multiplePlaceButtonPO.label.getText()).toBe("Placing Bet...");
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
