const {
  GenericPagePO,
  SportsbookPlacePanelPO,
  SportsbookBetButtonPO,
  FixedNumberInputFieldPO,
  BetControlsPO,
  HighlightedSelectionCardPO,
  CardPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;

const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const ExpandableCardGroupPO = require("@ppb/tbd-shared/components/ExpandableCardGroup/ExpandableCardGroup.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const genericPagePO = new GenericPagePO();

const firstExpandableCardGroupPO = new ExpandableCardGroupPO(genericPagePO.genericViewCards[0]);
const secondHighlightedCardFirstCardGroupPO = new HighlightedSelectionCardPO(firstExpandableCardGroupPO.items[1]);

const secondExpandableCardGroupPO = new ExpandableCardGroupPO(genericPagePO.genericViewCards[1]);
const secondExpandableCardGroupCardPO = new CardPO(secondExpandableCardGroupPO.element);

const firstHighlightedSelectionCardSecondCardGroupPO = new HighlightedSelectionCardPO(
  secondExpandableCardGroupPO.items[0],
);
const runnerBetButtonPO = new SportsbookBetButtonPO(firstHighlightedSelectionCardSecondCardGroupPO.sportsbookBetButton);

const placePanelPO = new SportsbookPlacePanelPO();
const controlsPO = new BetControlsPO(placePanelPO.element);
const sportsbookPriceInputPO = new FixedNumberInputFieldPO(controlsPO.fixedInput);

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
  urn: "ppb:tbd:view:generic:X9D5ERIAACkAw11J/cv/home",
  url: "view/generic:X9D5ERIAACkAw11J/cv/home",
  pageInfo: null,
  viewHeader: {
    title: "Football Oddsboost",
  },
  edges: [
    {
      node: {
        __typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:marketExpandable:924.2|0|0",
        expandableCardGroupTitle: "Cisco, the trout",
        isExpandable: true,
        isExpanded: true,
        full: {
          edges: [
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.2/1|false",
                title: "Ju to win the match and score 14 goals",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.2",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
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
                },
                displayPreviousOdd: true,
                badge: "ODDSBOOST",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/1|false",
                title: "Benfica to lose the match - high likely, bet now",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.3",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:12345`,
                    },
                  },
                  runners: [
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.3/1",
                      name: "Benfica to lose the match - high likely, bet now",
                      selectionId: 1,
                      resultType: null,
                    },
                  ],

                  isOddsboostMarketType: true,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.3/1",
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
                urn: "ppb:tbd:card:highlightedSelection:924.2/1|false",
              },
            },
            {
              node: {
                __typename: "HighlightedSelectionCard",
                urn: "ppb:tbd:card:highlightedSelection:924.3/1|false",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:marketExpandable:924.1|1|1",
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
        urn: "ppb:tbd:cardgroup:marketExpandable:924.2|0|0",
      },
    },
    {
      node: {
        __typename: "ExpandableCardGroup",
        urn: "ppb:tbd:cardgroup:marketExpandable:924.1|1|1",
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
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await browser.url(routes.getGenericViewUrl(`X9D5ERIAACkAw11J/cv/home`));
  });

  describe("When the user is on a generic view with an expandable card group", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(firstExpandableCardGroupPO.headerTitle, "Cisco, the trout");
    });

    it("[PRPI-6775] the number of expandable card groups displayed should be 2", async () => {
      expect(await genericPagePO.genericViewCards.length).toBe(2);
    });

    it("[PRPI-6776] the 1st expandable card group should have the title 'Cisco, the trout'", async () => {
      expect(await firstExpandableCardGroupPO.headerTitle.getText()).toBe("Cisco, the trout");
    });

    it("[PRPI-6777] the 1st expandable card group should have 2 runners", async () => {
      expect(await firstExpandableCardGroupPO.items.length).toBe(2);
    });

    it("[PRPI-6778] the 2nd runner of the 1st expandable card group should be 'Benfica to lose the match - high likely, bet now'", async () => {
      expect(await secondHighlightedCardFirstCardGroupPO.text.getText()).toBe(
        "Benfica to lose the match - high likely, bet now",
      );
    });

    it("[PRPI-6779] the 2nd expandable card group should have the title 'Marieta Super League 2021'", async () => {
      expect(await secondExpandableCardGroupPO.headerTitle.getText()).toBe("Marieta Super League 2021");
    });

    it("[PRPI-6780] the 2nd expandable card group should have be open", async () => {
      expect(await secondExpandableCardGroupCardPO.content.isDisplayed()).toBe(true);
    });

    describe("When the user clicks on the 2nd expandable card group accordion", () => {
      beforeAll(async () => {
        await secondExpandableCardGroupCardPO.headerWrapper.waitForClickable();
        await secondExpandableCardGroupCardPO.headerWrapper.click();
        await browser.waitUntilNotDisplayed(secondExpandableCardGroupCardPO.content);
      });

      it("[PRPI-6781] the chevron should be collapsed", async () => {
        expect(await secondExpandableCardGroupCardPO.content.isDisplayed()).toBe(false);
      });

      it("[PRPI-6782] the runners should not be displayed", async () => {
        expect(await secondExpandableCardGroupPO.card.isDisplayed()).toBe(true);
        expect(await secondExpandableCardGroupPO.cardContent.isDisplayed()).toBe(false);
        expect(await secondExpandableCardGroupPO.items.length).toBe(0);
      });

      describe("When the user clicks again on the 2nd expandable card group accordion", () => {
        beforeAll(async () => {
          await secondExpandableCardGroupCardPO.headerWrapper.waitForClickable();
          await secondExpandableCardGroupCardPO.headerWrapper.click();
          await browser.waitUntilDisplayed(runnerBetButtonPO.element);
        });

        it("[PRPI-6783] the content should be visible expanded", async () => {
          expect(await secondExpandableCardGroupCardPO.content.isDisplayed()).toBe(true);
        });

        it("[PRPI-6784] the expandable card group should display 3 runners", async () => {
          expect(await secondExpandableCardGroupPO.items.length).toBe(3);
        });

        it("[PRPI-6785] the first runner should have the title 'Porto and Porto B both to perform a massive win'", async () => {
          expect(await firstHighlightedSelectionCardSecondCardGroupPO.text.getText()).toBe(
            "Porto and Porto B both to perform a massive win",
          );
        });

        it("[PRPI-6785] the first runner should display a bet button", async () => {
          expect(await runnerBetButtonPO.element.isDisplayed()).toBe(true);
        });

        describe("When the user clicks on bet button of an oddsboost runner", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK));
            await runnerBetButtonPO.element.waitForClickable();
            await runnerBetButtonPO.element.click();
            await browser.waitUntilDisplayed(placePanelPO.element);
          });

          it("[PRPI-6786] the betslip should be displayed", async () => {
            expect(await placePanelPO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-6786] the oddsboost icon should be displayed", async () => {
            expect(await placePanelPO.element.isDisplayed()).toBe(true);
          });

          it("[PRPI-6786] the odds value should be 3.2", async () => {
            expect(await sportsbookPriceInputPO.numberField.getValue()).toBe("3.2");
          });

          it("[PRPI-6786] the previous odds value should be 2.1", async () => {
            expect(await sportsbookPriceInputPO.previousValue.getText()).toBe("2.1");
          });
        });
      });
    });
  });
});
