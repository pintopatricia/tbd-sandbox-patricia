const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;

const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { hideKeyboard } = require("../../../../../helpers/gestures");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

// mock controllers
const MockService = require("../../../../../mock-essentials/mocking-service");

const {
  SportsbookReceiptPanelSO,
  SportsbookPlacePanelSO,
  GenericScreenSO,
  SinglesCardSO,
  SingleSO,
  CardSO,
  InlineSportsbookMarketSO,
  SportsbookBetButtonSO,
  PrimaryButtonSO,
  ReceiptTitleSO,
  MinimizedSO,
  BetslipDrawerSO,
  BetSegmentsSO,
  BetsSummarySO,
  CurrencyNumberInputFieldSO,
  BetDetailsSO,
  SubHeaderSO,
  BetControlsSO,
} = require("../../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const firstCardSO = new CardSO(genericScreenSO.cards[0]);
const firstSportsbookMarketSO = new InlineSportsbookMarketSO(firstCardSO.contentWrapper);
const firstRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[0]);
const secondRunnerSO = new SportsbookBetButtonSO(firstSportsbookMarketSO.sbkBetButtons[1]);
const betslipDrawerSO = new BetslipDrawerSO();
const minimizedSO = new MinimizedSO();
const sportsbookPlacePanelSO = new SportsbookPlacePanelSO();
const singlesSubHeaderSO = new SubHeaderSO(sportsbookPlacePanelSO.collapsableSections[0].title);
const singlesCardSO = new SinglesCardSO(sportsbookPlacePanelSO.element);
const firstSingleSO = new SingleSO(singlesCardSO.singles[0]);
const secondSingleSO = new SingleSO(singlesCardSO.singles[1]);
const firstSingleControlsSO = new BetControlsSO(firstSingleSO.controls);
const secondSingleControlsSO = new BetControlsSO(secondSingleSO.controls);
const firstSinglePriceField = new CurrencyNumberInputFieldSO(firstSingleControlsSO.fixedInput);
const firstSizeInputField = new CurrencyNumberInputFieldSO(firstSingleControlsSO.currencyInput);
const secondSinglePriceField = new CurrencyNumberInputFieldSO(secondSingleControlsSO.fixedInput);
const secondSizeInputField = new CurrencyNumberInputFieldSO(secondSingleControlsSO.currencyInput);
const firstBetDetailsSO = new BetDetailsSO(firstSingleSO.element);
const secondBetDetailsSO = new BetDetailsSO(secondSingleSO.element);
const betsSummarySO = new BetsSummarySO(sportsbookPlacePanelSO.element);

const sportsbookReceiptPanelSO = new SportsbookReceiptPanelSO();
const receiptTitleSO = new ReceiptTitleSO();
const receiptFirstBetDetailsSO = new BetDetailsSO(sportsbookReceiptPanelSO.singles[0]);
const receiptFirstBetSegmentsSO = new BetSegmentsSO(sportsbookReceiptPanelSO.singles[0]);
const receiptSecondBetDetailsSO = new BetDetailsSO(sportsbookReceiptPanelSO.singles[1]);
const receiptSecondBetSegmentsSO = new BetSegmentsSO(sportsbookReceiptPanelSO.singles[1]);
const receiptBetsSummarySO = new BetsSummarySO(sportsbookReceiptPanelSO.element);

const primaryButtonSO = new PrimaryButtonSO();

const EVENT_TYPE_ID = 1;
const EVENT_ID = 1;
const MARKET_ID = "924.1";

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.1 },
            fractionalDisplayOdds: { numerator: 1, denominator: 2 },
          },
        },
      ],
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: `ppb:tbd:card:group:topEventsInSport:1`,
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
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
                fixture: {
                  urn: `ppb:fixture:${EVENT_ID}`,
                  home: {
                    name: "Athletic Bilbao",
                  },
                  away: {
                    name: "Sociedad",
                  },
                },
                sportevent: {
                  name: "Athletic Bilbao v Sociedad",
                  openDate: "2010-10-14T18:45Z",
                  urn: `ppb:event:${EVENT_ID}`,
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:1234561",
                    name: "English Premier League",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Athletic Bilbao v Sociedad",
                          urn: `ppb:event:${EVENT_ID}`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                          selectionId: 1,
                          name: "Athletic Bilbao",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                          selectionId: 2,
                          name: "Sociedad",
                        },
                        {
                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                          selectionId: 3,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/1`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/2`,
                      },
                      {
                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/3`,
                      },
                    ],
                  },
                },
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
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const FIRST_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 1,
        },
      ],
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: { decimalOdds: 6.5 },
  },
};

const FIRST_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 6.5 },
    },
    decimalDisplayOdds: { decimalOdds: 6.5 },
  },
};

const SECOND_SINGLE_MOCK = {
  legCombinations: [
    {
      runners: [
        {
          marketId: MARKET_ID,
          selectionId: 2,
        },
      ],
    },
  ],

  betMinStake: 0.1,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
    decimalDisplayOdds: { decimalOdds: 2.4 },
  },
};

const SECOND_SINGLE_ODDS_MOCK = {
  runner: {
    marketId: MARKET_ID,
    selectionId: 2,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2.4 },
    },
    decimalDisplayOdds: {
      decimalOdds: 2.4,
    },
  },
};

const SINGLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK],
};

const DOUBLE_MOCK = {
  betCombinations: [FIRST_SINGLE_MOCK, SECOND_SINGLE_MOCK],
  runnerOdds: [FIRST_SINGLE_ODDS_MOCK, SECOND_SINGLE_ODDS_MOCK],
};

const SPB_MOCK_SUCCESS = {
  result: [
    {
      totalStake: 0.1,
      totalPotentialWin: 0.65,
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 6.5 },
      },
      runners: [
        {
          runner: { marketId: MARKET_ID, selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID, selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 6.5 },
          },
        },
      ],
    },
    {
      totalStake: 0.1,
      totalPotentialWin: 0.24,
      betPrice: {
        decimalDisplayOdds: { decimalOdds: 2.4 },
      },
      runners: [
        {
          runner: { marketId: MARKET_ID, selectionId: 2 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: MARKET_ID, selectionId: 2 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
          },
        },
      ],
    },
  ],
};

describe("Betslip - SBK place multiple single bet", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getImplyBetsResponse(SINGLE_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(genericScreenSO.element);
  });

  describe("when the user adds two non-combinable selections", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(firstRunnerSO.element);
      await firstRunnerSO.element.click();
      await browser.waitUntilClickableNative(betslipDrawerSO.header);
      await betslipDrawerSO.header.click();
      await secondRunnerSO.element.click();

      await mockService.mockHttpRequest(getImplyBetsResponse(DOUBLE_MOCK));
      await browser.waitUntilClickableNative(minimizedSO.element);
      await minimizedSO.element.click();
      await browser.waitUntilDisplayed(sportsbookPlacePanelSO.element, "Waiting for Sportsbook place panel element");
    });

    it("[PRPI-3478] should show singles title", async () => {
      expect(await singlesSubHeaderSO.element.getText()).toBe("SINGLES");
    });

    it("[PRPI-3479] should show 2 singles", async () => {
      expect(await singlesCardSO.singles.length).toBe(2);
    });

    describe("first selection", () => {
      it("[PRPI-3480] should show first selection title", async () => {
        expect(await firstBetDetailsSO.title.getText()).toBe("Athletic Bilbao");
      });

      it("[PRPI-3481] should show first selection subtitle", async () => {
        expect(await firstBetDetailsSO.subtitle.getText()).toBe("Match Odds - Athletic Bilbao v Sociedad");
      });

      it("[PRPI-3482] should show first selection odd", async () => {
        expect(await firstSinglePriceField.numberField.getText()).toBe("6.5");
      });

      it("[PRPI-3483] should show first selection stake input with only placeholder", async () => {
        // "Stake" placeholder is always visible
        expect(await firstSizeInputField.numberField.getText()).toBe("");
      });

      it("[PRPI-3484] should show the returns at $0.00", async () => {
        expect(await firstSingleControlsSO.returns.getText()).toBe("Returns $0.00");
      });
    });

    describe("second selection", () => {
      it("[PRPI-3485] should show second selection title", async () => {
        expect(await secondBetDetailsSO.title.getText()).toBe("Sociedad");
      });

      it("[PRPI-3486] should show second selection subtitle", async () => {
        expect(await secondBetDetailsSO.subtitle.getText()).toBe("Match Odds - Athletic Bilbao v Sociedad");
      });

      it("[PRPI-3487] should show second selection odd", async () => {
        expect(await secondSinglePriceField.numberField.getText()).toBe("2.4");
      });

      it("[PRPI-3488] should show second selection stake input with only placeholder", async () => {
        // "Stake" placeholder is always visible
        expect(await secondSizeInputField.numberField.getText()).toBe("");
      });

      it("[PRPI-3489] should show the returns at $0.00", async () => {
        expect(await secondSingleControlsSO.returns.getText()).toBe("Returns $0.00");
      });
    });

    it("[PRPI-3490] should show the total stake", async () => {
      expect(await primaryButtonSO.label.getText()).toContain("$0.00");
    });

    it("[PRPI-3491] should show the total returns", async () => {
      expect(await betsSummarySO.totalReturnsLabel.getText()).toBe("Total Returns");
      expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.00");
    });

    it("[PRPI-3492] should show the place bet button", async () => {
      expect(await primaryButtonSO.element.isDisplayed()).toBe(true);
    });

    describe("when the user adds a $0.1 stake to the first selection", () => {
      beforeAll(async () => {
        await firstSizeInputField.numberField.setValue(0.1);
        await hideKeyboard();
        await browser.waitUntilEquals(firstSingleControlsSO.returns, "Returns $0.65");
      });

      it("[PRPI-3493] should show returns for first selection", async () => {
        expect(await firstSingleControlsSO.returns.getText()).toBe("Returns $0.65");
      });

      it("[PRPI-3494] should show the total stake", async () => {
        expect(await primaryButtonSO.label.getText()).toContain("$0.10");
      });

      it("[PRPI-3495] should show the total returns", async () => {
        expect(await betsSummarySO.totalReturnsLabel.getText()).toBe("Total Returns");
        expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.65");
      });

      it("[PRPI-3496] should show the place bet button", async () => {
        expect(await primaryButtonSO.element.isDisplayed()).toBe(true);
      });

      describe("when the user set a $0.1 stake in second selection", () => {
        beforeAll(async () => {
          await secondSizeInputField.numberField.setValue(0.1);
          await hideKeyboard();
          await browser.waitUntilEquals(secondSingleControlsSO.returns, "Returns $0.24");
        });

        it("[PRPI-3497] should show returns for second selection", async () => {
          expect(await secondSingleControlsSO.returns.getText()).toBe("Returns $0.24");
        });

        it("[PRPI-3498] should show the total stake", async () => {
          expect(await primaryButtonSO.label.getText()).toContain("$0.20");
        });

        it("[PRPI-3499] should show the total returns", async () => {
          expect(await betsSummarySO.totalReturnsValue.getText()).toBe("$0.89");
        });

        it("[PRPI-3500] should show the place bet button", async () => {
          expect(await primaryButtonSO.element.isDisplayed()).toBe(true);
        });

        describe("when the user taps the place button", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK_SUCCESS));
            await primaryButtonSO.element.click();
            await browser.waitUntilDisplayed(sportsbookReceiptPanelSO.element, "Waiting for receipt panel element");
          });

          it("[PRPI-3501] should show the 'Bet Placed' title", async () => {
            expect(await receiptTitleSO.label.getText()).toBe("Bet Placed");
          });

          it("[PRPI-3501] should show the dismiss button", async () => {
            expect(await receiptTitleSO.dismissButton.isDisplayed()).toBe(true);
          });

          it("[PRPI-3501] should show singles title", async () => {
            expect(await sportsbookReceiptPanelSO.singlesTitle.getText()).toBe("SINGLES");
          });

          describe("1st selection", () => {
            it("[PRPI-3501] should show the title", async () => {
              expect(await receiptFirstBetDetailsSO.title.getText()).toBe("Athletic Bilbao");
            });

            it("[PRPI-3501] should show the subtitle", async () => {
              expect(await receiptFirstBetDetailsSO.subtitle.getText()).toBe("Match Odds - Athletic Bilbao v Sociedad");
            });

            it("[PRPI-3501] should show odds", async () => {
              expect(await receiptFirstBetSegmentsSO.leftSegment.getText()).toBe("Odds 6.5");
            });

            it("[PRPI-3501] should show stake", async () => {
              expect(await receiptFirstBetSegmentsSO.midSegment.getText()).toBe("Stake $0.10");
            });

            it("[PRPI-3501] should show returns", async () => {
              expect(await receiptFirstBetSegmentsSO.rightSegment.getText()).toBe("Returns $0.65");
            });
          });

          describe("2nd selection", () => {
            it("[PRPI-3501] should show the title", async () => {
              expect(await receiptSecondBetDetailsSO.title.getText()).toBe("Sociedad");
            });

            it("[PRPI-3501] should show the subtitle", async () => {
              expect(await receiptSecondBetDetailsSO.subtitle.getText()).toBe(
                "Match Odds - Athletic Bilbao v Sociedad",
              );
            });

            it("[PRPI-3501] should show odds", async () => {
              expect(await receiptSecondBetSegmentsSO.leftSegment.getText()).toBe("Odds 2.4");
            });

            it("[PRPI-3501] should show stake", async () => {
              expect(await receiptSecondBetSegmentsSO.midSegment.getText()).toBe("Stake $0.10");
            });

            it("[PRPI-3501] should show returns", async () => {
              expect(await receiptSecondBetSegmentsSO.rightSegment.getText()).toBe("Returns $0.24");
            });
          });

          it("[PRPI-3501] should show total stake with 0.20", async () => {
            expect(await primaryButtonSO.label.getText()).toContain("$0.20");
          });

          it("[PRPI-3501] should show potential returns with 0.89", async () => {
            expect(await receiptBetsSummarySO.totalReturnsValue.getText()).toBe("$0.89");
          });
        });
      });
    });
  });
});
