const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp, openUrl } = require("../../../../helpers/urls");
const { getStartViewLinks } = require("../../../../helpers/view-link-start");

const {
  SportsbookPlacePanelSO,
  BottomBarSO,
  ScrollableSwimlaneSO,
  SportsbookBetButtonSO,
  FixedNumberInputFieldSO,
  HighlightedSelectionCardSO,
  BetslipDrawerSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const sportsbookPlaceSO = new SportsbookPlacePanelSO();
const fixedNumberFieldSO = new FixedNumberInputFieldSO();
const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const allHighlightedSelectionCards = scrollableSwimlaneSO.highlightedSelectionCards;
const firstHighlightedSelectionSO = new HighlightedSelectionCardSO(allHighlightedSelectionCards[0]);
const secondHighlightedSelectionSO = new HighlightedSelectionCardSO(allHighlightedSelectionCards[1]);
const firstCardBetButtonSO = new SportsbookBetButtonSO(firstHighlightedSelectionSO.button);
const betslipDrawerSO = new BetslipDrawerSO();

const EVENT_ID = 29682729;
const EVENT_ID_SECOND_MOCK = 29682730;
const SPORTSBOOK_MARKET_ID = "924.1";
const MARIETA_BUG_FINDER_ID = 1;
const MARIETA_TESTA_TU_BRANCH_ID = 2;
const FIRST_CARD_RUNNER_NAME = "One day Marieta will be out of patience. But not today.";

const HIGHLIGHTED_SELECTION_CARD_GROUP_EDGE = (withTitle) => ({
  node: {
    __typename: "SwimlaneCardGroup",
    urn: "ppb:tbd:cardgroup:swimlane:highlighted/mock",
    cardGroupTitle: withTitle ? "Football" : null,
    full: {
      edges: [
        {
          node: {
            __typename: "HighlightedSelectionCard",
            urn: `ppb:tbd:card:highlightedSelection:${SPORTSBOOK_MARKET_ID}/${MARIETA_BUG_FINDER_ID}`,
            title: FIRST_CARD_RUNNER_NAME,
            displayPreviousOdd: true,
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              name: "Betfair OddsBoost Mock",
              isOddsboostMarketType: true,
              marketType: "DAILY_POWER_PRICES",
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/${MARIETA_BUG_FINDER_ID}`,
                  selectionId: MARIETA_BUG_FINDER_ID,
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/${MARIETA_TESTA_TU_BRANCH_ID}`,
                  selectionId: MARIETA_TESTA_TU_BRANCH_ID,
                },
              ],
            },
            runner: {
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/${MARIETA_BUG_FINDER_ID}`,
              selectionId: MARIETA_BUG_FINDER_ID,
            },
          },
        },
        {
          node: {
            __typename: "HighlightedSelectionCard",
            urn: `ppb:tbd:card:highlightedSelection:${SPORTSBOOK_MARKET_ID}/${MARIETA_TESTA_TU_BRANCH_ID}`,
            title: "Quando Marieta testa tu branch... Marietaaaa, testa tu branch.",
            displayPreviousOdd: true,
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              name: "Betfair OddsBoost Mock",
              isOddsboostMarketType: true,
              marketType: "DAILY_POWER_PRICES",
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/${MARIETA_BUG_FINDER_ID}`,
                  selectionId: MARIETA_BUG_FINDER_ID,
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/${MARIETA_TESTA_TU_BRANCH_ID}`,
                  selectionId: MARIETA_TESTA_TU_BRANCH_ID,
                },
              ],
            },
            runner: {
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/${MARIETA_TESTA_TU_BRANCH_ID}`,
              selectionId: MARIETA_TESTA_TU_BRANCH_ID,
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          node: {
            __typename: "HighlightedSelectionCard",
            urn: `ppb:tbd:card:highlightedSelection:${SPORTSBOOK_MARKET_ID}/${MARIETA_BUG_FINDER_ID}`,
          },
        },
        {
          node: {
            __typename: "HighlightedSelectionCard",
            urn: `ppb:tbd:card:highlightedSelection:${SPORTSBOOK_MARKET_ID}/${MARIETA_TESTA_TU_BRANCH_ID}`,
          },
        },
      ],
    },
  },
});

const HIGHLIGHTED_SELECTION_CARD_GROUP_PARTIAL_EDGE = {
  node: {
    __typename: "SwimlaneCardGroup",
    urn: "ppb:tbd:cardgroup:swimlane:highlighted/mock",
  },
};

const BFF_MOCK_WITH_CARDGROUP_WITHOUT_TITLE = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  edges: [HIGHLIGHTED_SELECTION_CARD_GROUP_EDGE(false)],
  partialEdges: [HIGHLIGHTED_SELECTION_CARD_GROUP_PARTIAL_EDGE],
};

const BFF_MOCK_WITH_CARDGROUP_WITH_TITLE = {
  urn: `ppb:tbd:view:event:${EVENT_ID_SECOND_MOCK}`,
  edges: [HIGHLIGHTED_SELECTION_CARD_GROUP_EDGE(true)],
  partialEdges: [HIGHLIGHTED_SELECTION_CARD_GROUP_PARTIAL_EDGE],
};

const IMPLY_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: SPORTSBOOK_MARKET_ID,
              selectionId: 1,
            },
          ],
        },
      ],
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: SPORTSBOOK_MARKET_ID,
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.2,
        },
      },
    },
  ],
};

const SMP_MOCK_RUNNER_DETAILS = [
  {
    selectionId: MARIETA_BUG_FINDER_ID,
    runnerOdds: { decimalDisplayOdds: { decimalOdds: 1.2 } },
    previousWinRunnerOdds: [{ decimalDisplayOdds: { decimalOdds: 1.1 } }],
  },
  {
    selectionId: MARIETA_TESTA_TU_BRANCH_ID,
    runnerOdds: { decimalDisplayOdds: { decimalOdds: 150 } },
    previousWinRunnerOdds: [{ decimalDisplayOdds: { decimalOdds: 2 } }],
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: SMP_MOCK_RUNNER_DETAILS,
    },
  ],
};

const SMP_MOCK_SUSPENDED = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      marketStatus: "SUSPENDED",
      runnerDetails: [
        {
          selectionId: MARIETA_BUG_FINDER_ID,
          runnerOdds: { decimalDisplayOdds: { decimalOdds: 1.3 } },
          previousWinRunnerOdds: [{ decimalDisplayOdds: { decimalOdds: 1.1 } }],
        },
      ],
    },
  ],
};

const SMP_MOCK_OPEN_NO_SELECTION = {
  markets: [
    {
      marketId: "924.1",
      marketStatus: "OPEN",
      runnerDetails: [],
    },
  ],
};

const SMP_MOCK_CLOSED = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      noMarketInfo: true,
    },
  ],
};

describe("Highlighted Selection Card", () => {
  const urls = [`sport/competition/event/e-${EVENT_ID}`, `sport/competition/event/e-${EVENT_ID_SECOND_MOCK}`];
  const HOME_VIEW_LINKS = getStartViewLinks(urls);
  describe("When the user is in a view with Oddsboost or OddsOnThat markets available for different sports", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_WITH_CARDGROUP_WITHOUT_TITLE));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINKS));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINKS });
      await browser.waitUntilEquals(firstHighlightedSelectionSO.text, FIRST_CARD_RUNNER_NAME);
    });

    it("[PRPI-2975] the HighlightedSelectionCards should be displayed in a swimlane", async () => {
      expect(await allHighlightedSelectionCards.length).toBe(2);
      expect(await firstHighlightedSelectionSO.element.isDisplayed()).toBe(true);
      expect(await secondHighlightedSelectionSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2976] the swimlane should not have a title", async () => {
      expect(await scrollableSwimlaneSO.title.isDisplayed()).toBe(false);
    });

    it("[PRPI-2977] the 1st card should display a runner name", async () => {
      expect(await firstHighlightedSelectionSO.text.getText()).toBe(FIRST_CARD_RUNNER_NAME);
    });

    it("[PRPI-2978] the 1st card should have a bet button", async () => {
      expect(await firstHighlightedSelectionSO.button.isDisplayed()).toBe(true);
    });

    it("[PRPI-2979] the 1st card odds value should be 1.2", async () => {
      expect(await firstCardBetButtonSO.odd.getText()).toBe("1.2");
    });

    it("[PRPI-2980] the 1st card previous odds value should be 1.1", async () => {
      expect(await firstCardBetButtonSO.secondaryLabel.getText()).toBe("1.1");
    });

    describe("when the user clicks the 1st card bet button", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
        await browser.waitUntilClickableNative(firstCardBetButtonSO.element);
        await firstHighlightedSelectionSO.button.click();
        await browser.waitUntilDisplayed(fixedNumberFieldSO.element);
      });

      it("[PRPI-2981] the betslip should be displayed", async () => {
        expect(await sportsbookPlaceSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2982] the odds value should be 1.2", async () => {
        expect(await fixedNumberFieldSO.numberField.getText()).toBe("1.2");
      });

      it("[PRPI-2983] the previous odds value should be 1.1", async () => {
        expect(await fixedNumberFieldSO.previousValue.getText()).toBe("1.1");
      });

      describe("And then the market gets suspended", () => {
        beforeAll(async () => {
          // Action to close the betslip
          await browser.waitUntilClickableNative(betslipDrawerSO.header);
          await betslipDrawerSO.header.click();
          await browser.waitUntilNotDisplayed(
            sportsbookPlaceSO.element,
            "Sportsbook Single Place panel still displayed",
          );
          await mockService.mockHttpRequest(
            getMarketPrices(SMP_MOCK_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }),
          );
          await browser.waitUntilEquals(firstCardBetButtonSO.odd, "-");
          await firstCardBetButtonSO.element.click();
        });

        it("[PRPI-2984] the betslip should not be displayed", async () => {
          expect(await sportsbookPlaceSO.element.isDisplayed()).toBe(false);
        });

        describe("And then SMP stops returning selection", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_OPEN_NO_SELECTION, { ignoreRequestedMarketIdsMatch: true }),
            );
            await firstCardBetButtonSO.element.click();
          });

          it("[PRPI-2985] the betslip should not be displayed", async () => {
            expect(await sportsbookPlaceSO.element.isDisplayed()).toBe(false);
          });

          describe("And then the market closes", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getMarketPrices(SMP_MOCK_CLOSED, { ignoreRequestedMarketIdsMatch: true }),
              );
              await firstCardBetButtonSO.element.click();
            });

            it("[PRPI-2985] the betslip should not be displayed", async () => {
              expect(await sportsbookPlaceSO.element.isDisplayed()).toBe(false);
            });
          });
        });
      });
    });
  });

  describe("When the user is in a view with Oddsboost markets available for football And service is retrieving title", () => {
    // this describe should be removed when we have the ability to have visual tests in native
    beforeAll(async () => {
      await BottomBarSO.home.click();
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_WITH_CARDGROUP_WITH_TITLE));

      await openUrl(urls[1], { isViewLinkStartPage: !!HOME_VIEW_LINKS, nthViewLink: 1 });
    });

    it("[PRPI-2986] the swimlane should have 'Football' title", async () => {
      expect(await scrollableSwimlaneSO.title.getText()).toEqual("Football");
    });

    it("[PRPI-2987] the swimlane should display 2 HighlightedSelectionCards", async () => {
      expect(await allHighlightedSelectionCards.length).toBe(2);
    });
  });
});
