const {
  SportPagePO,
  SportsbookPlacePanelPO,
  ScrollableSwimlanePO,
  SportsbookReceiptPanelPO,
  SportsbookBetButtonPO,
  BetDetailsPO,
  FixedNumberInputFieldPO,
  CurrencyNumberInputFieldPO,
  BetSegmentsPO,
  BetControlsPO,
  OddsPO,
  HighlightedSelectionCardPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const sportPagePO = new SportPagePO();
const oddsboostSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const oddsboostCard = new HighlightedSelectionCardPO(oddsboostSwimlanePO.highlightedSelectionCards[0]);
const oddsboostBetButtonPO = new SportsbookBetButtonPO(oddsboostCard.sportsbookBetButton);

const placePanelPO = new SportsbookPlacePanelPO();
const selectionPO = new BetDetailsPO(placePanelPO.element);
const controlsPO = new BetControlsPO(placePanelPO.element);
const sportsbookPriceInputPO = new FixedNumberInputFieldPO(controlsPO.fixedInput);
const sportsbookStakeInputPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);

const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();
const firstSingleSegmentsPO = new BetSegmentsPO(sportsbookReceiptPanelPO.singles[0]);
const firstSingleOddsSegmentPO = new OddsPO(firstSingleSegmentsPO.leftValue);

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  sportevent: {
    sport: {
      name: "Football",
      urn: "ppb:eventType:1",
    },
    name: "Oddsboost market",
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
        cardGroupTitle: "Oddsboost",
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1",
                title: "All teams to score in the UEFA Champions League (in 90 mins)",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  name: "Friday Featured OddsBoosts",
                  marketType: "DAILY_POWER_PRICES",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      name: "OddsBoost",
                      urn: "ppb:event:1",
                    },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.1/1",
                      selectionId: 1,
                      name: "Runner",
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:1",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_MOCK_CHANGE = {
  markets: [
    {
      marketId: "924.1",
      marketStatus: "OPEN",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.1 },
            },
          ],
        },
      ],
    },
  ],
};

const SIB_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: "924.1",
              selectionId: 1,
            },
          ],
        },
      ],

      winAverageOdds: 1.2,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
      },
      averageOdds: 1.2,
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: "924.1",
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.2,
        },
      },
    },
  ],
};

const SIB_MOCK_CHANGE = {
  betCombinations: [
    {
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 2.2 },
        trueOdds: {
          decimalOdds: { decimalOdds: 2.2 },
        },
      },
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: "924.1",
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 2.1 },
        },
      },
    },
  ],
};

const SPB_MOCK = {
  result: [
    {
      totalStake: 1.01,
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 2.2 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

describe("Oddsboost single betting journey panel", () => {
  describe("When the user clicks on bet button of an oddsboost market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(oddsboostBetButtonPO.element);
      await oddsboostBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
    });

    it("[PRPI-7196] The place panel should be displayed", async () => {
      expect(await placePanelPO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-7197] The runner name should be displayed", async () => {
      expect(await selectionPO.title.getText()).toBe("Runner");
    });

    it("[PRPI-7198] The market\xA0name should be displayed", async () => {
      expect(await selectionPO.subtitle.getText()).toBe("Friday Featured OddsBoosts - OddsBoost");
    });

    it("[PRPI-7199] The odds value should be 1.2", async () => {
      expect(await sportsbookPriceInputPO.numberField.getValue()).toBe("1.2");
    });

    it("[PRPI-7200] The previous odds value should be 1.1", async () => {
      expect(await sportsbookPriceInputPO.previousValue.getText()).toBe("1.1");
    });

    describe("And when the smp polling request returns different previous odds", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_CHANGE));
        await browser.tickFakeClock();
        await browser.waitUntilEquals(sportsbookPriceInputPO.previousValue, "2.1");
      });

      it("[PRPI-7201] The odds value should remain the same", async () => {
        expect(await sportsbookPriceInputPO.numberField.getValue()).toBe("1.2");
      });

      it("[PRPI-7202] The previous odds value should be 2.1", async () => {
        expect(await sportsbookPriceInputPO.previousValue.getText()).toBe("2.1");
      });

      describe("And when the imply service request returns different odds", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK_CHANGE));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(sportsbookPriceInputPO.numberField, "2.2");
        });

        it("[PRPI-7203] The odds value should be 2.2", async () => {
          expect(await sportsbookPriceInputPO.numberField.getValue()).toBe("2.2");
        });

        it("[PRPI-7204] The previous odds should remain the same", async () => {
          expect(await sportsbookPriceInputPO.previousValue.getText()).toBe("2.1");
        });

        describe("And when the user clicks on the 'Place Bet' button", () => {
          beforeAll(async () => {
            await sportsbookStakeInputPO.setValue("1.01");
            await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
            await placePanelPO.place.click();
            await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);
          });

          it("[PRPI-7205] The oddsboost icon should be displayed", async () => {
            expect(await firstSingleOddsSegmentPO.icon.isDisplayed()).toBe(true);
          });

          it("[PRPI-7205] The odds value should be 2.2", async () => {
            expect(await firstSingleOddsSegmentPO.value.getText()).toBe("2.2");
          });

          it("[PRPI-7205] The previous odds value should be 2.1", async () => {
            expect(await firstSingleOddsSegmentPO.previousValue.getText()).toBe("2.1");
          });
        });
      });
    });
  });
});
