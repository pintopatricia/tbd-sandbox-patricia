const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  SportsbookPlacePanelSO,
  GenericViewSO,
  ExpandableCardGroupSO,
  CardSO,
  SportsbookBetButtonSO,
  FixedNumberInputFieldSO,
  HighlightedSelectionCardSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericViewSO();
const sportsbookPlaceSO = new SportsbookPlacePanelSO();
const sportsbookPriceInputSO = new FixedNumberInputFieldSO(sportsbookPlaceSO.element);
const firstExpandableCardGroupSO = new ExpandableCardGroupSO(genericScreenSO.items[0]);
const secondExpandableCardGroupSO = new ExpandableCardGroupSO(genericScreenSO.items[1]);
const secondExpandableCardGroupCardSO = new CardSO(secondExpandableCardGroupSO.element);
const firstHighlightedSelectionCards = firstExpandableCardGroupSO.highlightedSelectionCards;
const secondHighlightedSelectionCards = secondExpandableCardGroupSO.highlightedSelectionCards;

const firstHighlightedSelectionCardFirstExpandableCardGroupSO = new HighlightedSelectionCardSO(
  firstHighlightedSelectionCards[0],
);

const firstHighlightedSelectionCardSecondExpandableCardGroupSO = new HighlightedSelectionCardSO(
  secondHighlightedSelectionCards[0],
);

const runnerBetButtonSO = new SportsbookBetButtonSO(firstHighlightedSelectionCardSecondExpandableCardGroupSO.button);

const EVENT_ID = 29682729;

const RUNNERS_MOCK = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/1",
    name: "Porto and Porto B both to perform a massive win",
    selectionId: 1,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/2",
    name: "A simple name for testing purposes",
    selectionId: 2,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/3",
    name: "Marieta to win the cup",
    selectionId: 3,
    resultType: null,
  },
];

const IMPLY_MOCK = {
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
          decimalOdds: { decimalOdds: 3.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 3.2,
        },
      },
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  pageInfo: null,
  viewHeader: {
    title: "Football Oddsboost",
  },
  edges: [
    {
      node: {
        __typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:marketExpandable:1",
        expandableCardGroupTitle: "Cisco, the trout",
        isExpandable: true,
        isExpanded: true,
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:1|false",
                title: "Benfica to lose the match - high likely, bet now",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.2",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      __typename: "SportsEvent",
                      urn: `ppb:event:${EVENT_ID}`,
                    },
                  },
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:1",
                    name: "Football",
                    sportId: 7,
                  },
                  runners: [
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.2/1",
                      name: "Ju to the match and score 14 goals",
                      selectionId: 1,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.2/2",
                      name: "Benfica to lose the match - high likely, bet now",
                      selectionId: 2,
                      resultType: null,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.2/1",
                  name: "Ju to win the match and score 14 goals",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
                displayContext: null,
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:2|false",
                title: "Marieta Super League 2021",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:${EVENT_ID}`,
                    },
                  },
                  runners: RUNNERS_MOCK,
                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                  name: "Porto and Porto B both to perform a massive win",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
                displayContext: null,
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:1|false",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:2|false",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:marketExpandable:2",
        expandableCardGroupTitle: "Marieta Super League 2021",
        isExpandable: true,
        isExpanded: true,
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1|false",
                title: "Porto and Porto B both to perform a massive win",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: RUNNERS_MOCK,
                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/2|false",
                title: "A simple name for testing purposes",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: RUNNERS_MOCK,
                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/2",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/3|false",
                title: "Marieta to win the cup",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: RUNNERS_MOCK,
                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/3",
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
              },
            },
          ],
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/1|false",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/2|false",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.1/3|false",
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
        __typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:marketExpandable:1",
      },
    },
    {
      node: {
        __typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:marketExpandable:2",
      },
    },
  ],

  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
    ],
  },
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.1 },
            },
          ],
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.1 },
            },
          ],
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.1 },
            },
          ],
        },
      ],
    },
    {
      marketId: "924.2",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.1 },
            },
          ],
        },
      ],
    },
    {
      marketId: "924.3",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.2 },
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

describe("Expandable Card Group", () => {
  describe("When the user is on a generic view with an expandable card group", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(firstExpandableCardGroupSO.element);
      await browser.waitUntilDisplayed(secondExpandableCardGroupSO.element);
    });

    it("[PRPI-2882] the number of expandable card groups displayed should be 2", async () => {
      expect(await genericScreenSO.items.length).toBe(2);
    });

    it("[PRPI-2883] the 1st expandable card group should have the title 'Cisco, the trout'", async () => {
      expect(await firstExpandableCardGroupSO.headerTitle.getText()).toBe("Cisco, the trout");
    });

    it("[PRPI-2884] the 1st expandable card group should have 2 highlightedSelectionCards", async () => {
      expect(await firstHighlightedSelectionCards.length).toBe(2);
    });

    it("[PRPI-2885] the 2nd runner of the 1st expandable card group should be 'Benfica to lose the match - high likely, bet now'", async () => {
      expect(await firstHighlightedSelectionCardFirstExpandableCardGroupSO.text.getText()).toBe(
        "Benfica to lose the match - high likely, bet now",
      );
    });

    it("[PRPI-2886] the 2nd expandableCardGroup should have the title 'Marieta Super League 2021'", async () => {
      expect(await secondExpandableCardGroupSO.headerTitle.getText()).toBe("Marieta Super League 2021");
    });

    it("[PRPI-2887] the 2nd expandableCardGroup should have the chevron expanded", async () => {
      expect(await secondExpandableCardGroupCardSO.contentWrapper.isDisplayed()).toBe(true);
    });

    describe("When the user clicks on the 2nd expandableCardGroup accordion", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(secondExpandableCardGroupCardSO.header);
        await secondExpandableCardGroupCardSO.header.click();
        await browser.waitUntilNotDisplayed(secondExpandableCardGroupCardSO.contentWrapper);
      });

      it("[PRPI-2888] the chevron should be collapsed", async () => {
        expect(await secondExpandableCardGroupCardSO.contentWrapper.isDisplayed()).toBe(false);
      });

      describe("When the user clicks again on the 2nd expandableCardGroup accordion", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(secondExpandableCardGroupCardSO.header);
          await secondExpandableCardGroupCardSO.header.click();
          await browser.waitUntilDisplayed(secondExpandableCardGroupCardSO.contentWrapper);
        });

        it("[PRPI-2889] the chevron should be expanded", async () => {
          expect(await secondExpandableCardGroupCardSO.contentWrapper.isDisplayed()).toBe(true);
        });

        it("[PRPI-2890] the expandableCardGroup should display 3 highlightedSelectionCards", async () => {
          expect(await secondHighlightedSelectionCards.length).toBe(3);
        });

        it("[PRPI-2891] the first highlightedSelectionCard should have the title 'Porto and Porto B both to perform a massive win'", async () => {
          expect(await firstHighlightedSelectionCardSecondExpandableCardGroupSO.text.getText()).toBe(
            "Porto and Porto B both to perform a massive win",
          );
        });

        it("[PRPI-2891] the first runner should display a bet button", async () => {
          expect(await runnerBetButtonSO.element.isDisplayed()).toBe(true);
        });

        describe("When the user clicks on bet button of an oddsboost runner", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
            await runnerBetButtonSO.element.click();
            await browser.waitUntilDisplayed(sportsbookPlaceSO.element);
          });

          it("[PRPI-2892] the betslip should be displayed", async () => {
            expect(await sportsbookPlaceSO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-2892] the odds value should be 3.2", async () => {
            expect(await sportsbookPriceInputSO.numberField.getText()).toBe("3.2");
          });

          it("[PRPI-2892] the previous odds value should be 2.1", async () => {
            expect(await sportsbookPriceInputSO.previousValue.getText()).toBe("2.1");
          });
        });
      });
    });
  });
});
