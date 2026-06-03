const {
  RunnerPO,
  AppPO,
  EventPagePO,
  HighlightedSelectionCardPO,
  SportsbookPlacePanelPO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
  SportsbookMarketPO,
  SingleTabPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const eventPagePO = new EventPagePO();

const navigationTabsListPO = new NavigationTabsListPO();
const oddsboostFirstTabPO = navigationTabsListPO.tabs[0];
const firstSingleTabPO = new SingleTabPO(oddsboostFirstTabPO);

const sportsbookMarketPO = new SportsbookMarketPO(eventPagePO.markets[0]);
const firstRunnerSportsbookPO = new RunnerPO(sportsbookMarketPO.runnerList[0]);
const firstRunnerBetButton = new SportsbookBetButtonPO(firstRunnerSportsbookPO.sportsbookBetButton);

const oddsboostSwimlanePO = new ScrollableSwimlanePO(eventPagePO.scrollableSwimlanes[0]);
const oddsboostSwimlaneFirstCard = new HighlightedSelectionCardPO(oddsboostSwimlanePO.scrollItems[0]);
const oddsboostSwimlaneSecondCard = new HighlightedSelectionCardPO(oddsboostSwimlanePO.scrollItems[1]);
const oddsboostSwimlaneThirdCard = new HighlightedSelectionCardPO(oddsboostSwimlanePO.scrollItems[2]);
const oddsboostSwimlaneFirstCardBetButtonPO = new SportsbookBetButtonPO(oddsboostSwimlaneFirstCard.sportsbookBetButton);

const placePanelPO = new SportsbookPlacePanelPO();

const mockService = new MockService();

const EVENT_ID = "29682729";
const MARKET_ID = "924.342274939";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  title: "Navigation Tabs Test",
  edges: [
    {
      node: {
        __typename: "NavigationTabsList",
        urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
        tabsTitle: "All Football",
        full: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: "ppb:tbd:view:navigationTab:##monday##",
                tabTitle: {
                  translated: "Oddsboost",
                },
                full: {
                  edges: [
                    {
                      node: {
                        __typename: "PebbleCardGroup",
                        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:Y7cQdREAABd_41Aw/e/29682729",
                        pebbleCardGroupTitle: { translated: "OddsBoosts" },
                        selectedItemUrn: `ppb:tbd:card:market:${MARKET_ID}|0|true|false|true|4`,
                        full: {
                          edges: [
                            {
                              name: "OddsBoosts",
                              node: {
                                __typename: "MarketCard",
                                urn: `ppb:tbd:card:market:${MARKET_ID}|0|true|false|true|4`,
                                numberOfItemsToDisplay: 4,
                                viewLinks: [],
                                marketsHierarchy: {},
                                displayRunners: {
                                  sportsbook: {
                                    market: {
                                      __typename: "SportsbookMarket",
                                      urn: `ppb:sbkMarket:${MARKET_ID}`,
                                      name: "OddsBoost",
                                      marketType: "ODDSBOOST",
                                      marketTypeName: null,
                                      bettingType: "ODDS",
                                      runners: [
                                        {
                                          __typename: "Runner",
                                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/37511202`,
                                          name: "Each Team to Have 2+ Corners in Each Half",
                                          selectionId: 37511202,
                                          handicap: 0,
                                          resultType: null,
                                        },
                                        {
                                          __typename: "Runner",
                                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/36634703`,
                                          name: "Both teams to score & 3+ corners for each team & 2+ cards for each team",
                                          selectionId: 36634703,
                                          handicap: 0,
                                          resultType: null,
                                        },
                                        {
                                          __typename: "Runner",
                                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/51725848`,
                                          name: "Ellis Harrison to score first",
                                          selectionId: 51725848,
                                          handicap: 0,
                                          resultType: null,
                                        },
                                        {
                                          __typename: "Runner",
                                          runnerURN: `ppb:sbkRunner:${MARKET_ID}/38915495`,
                                          name: "Jonson Clarke-Harris to score 2 or more",
                                          selectionId: 38915495,
                                          handicap: 0,
                                          resultType: null,
                                        },
                                      ],

                                      isOddsboostMarketType: true,
                                    },
                                    runners: [
                                      {
                                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/37511202`,
                                      },
                                      {
                                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/36634703`,
                                      },
                                      {
                                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/51725848`,
                                      },
                                      {
                                        runnerURN: `ppb:sbkRunner:${MARKET_ID}/38915495`,
                                      },
                                    ],
                                  },
                                },
                              },
                            },
                          ],
                        },
                        partials: {
                          edges: [
                            {
                              name: "OddsBoosts",
                              node: {
                                __typename: "MarketCard",
                                urn: `ppb:tbd:card:market:${MARKET_ID}|0|true|false|true|4`,
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
                partials: {
                  partialEdges: [
                    {
                      node: {
                        __typename: "PebbleCardGroup",
                        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:Y7cQdREAABd_41Aw/e/29682729",
                      },
                    },
                  ],
                },
              },
            },
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
                              urn: `ppb:event:12345`,
                            },
                          },
                          runners: [
                            {
                              runnerURN: "ppb:sbkRunner:924.1/1",
                              selectionId: 1,
                            },
                          ],

                          isOddsboostMarketType: true,
                        },
                        runner: {
                          runnerURN: "ppb:sbkRunner:924.1/1",
                        },
                        displayPreviousOdd: true,
                      },
                    },
                    {
                      node: {
                        __typename: "HighlightedSelectionCard",
                        urn: "ppb:tbd:card:highlightedSelection:924.2/2",
                        title: "SMR - Zenit to beat Rotor Volograd",
                        market: {
                          __typename: "SportsbookMarket",
                          urn: "ppb:sbkMarket:924.2",
                          name: "Daily OddsBoost",
                          marketType: "DAILY_POWER_PRICES",
                          hierarchy: {
                            __typename: "EventHierarchy",
                            sportevent: {
                              urn: `ppb:event:12345`,
                            },
                          },
                          runners: [
                            {
                              runnerURN: "ppb:sbkRunner:924.2/2",
                              selectionId: 2,
                            },
                          ],

                          isOddsboostMarketType: true,
                        },
                        runner: {
                          runnerURN: "ppb:sbkRunner:924.2/2",
                        },
                        displayPreviousOdd: true,
                      },
                    },
                    {
                      node: {
                        __typename: "HighlightedSelectionCard",
                        urn: "ppb:tbd:card:highlightedSelection:924.3/3",
                        title: "Waterford and Sligo Rovers",
                        market: {
                          __typename: "SportsbookMarket",
                          urn: "ppb:sbkMarket:924.3",
                          name: "Daily OddsBoost",
                          marketType: "DAILY_POWER_PRICES",
                          hierarchy: {
                            __typename: "EventHierarchy",
                            sportevent: {
                              urn: `ppb:event:12345`,
                            },
                          },
                          runners: [
                            {
                              runnerURN: "ppb:sbkRunner:924.3/3",
                              selectionId: 3,
                            },
                          ],

                          isOddsboostMarketType: true,
                        },
                        runner: {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                        },
                        displayPreviousOdd: true,
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
                    {
                      node: {
                        __typename: "HighlightedSelectionCard",
                        urn: "ppb:tbd:card:highlightedSelection:924.2/2",
                      },
                    },
                    {
                      node: {
                        __typename: "HighlightedSelectionCard",
                        urn: "ppb:tbd:card:highlightedSelection:924.3/3",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "NavigationTab",
                urn: "ppb:tbd:view:navigationTab:##monday##",
                tabTitle: {
                  translated: "Oddsboost",
                },
              },
            },
            {
              node: {
                __typename: "SwimlaneCardGroup",
                urn: "ppb:tbd:cardgroup:swimlane:1",
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
        urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
        __typename: "NavigationTabsList",
      },
    },
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
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: "37511202",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
          ],
        },
        {
          selectionId: "36634703",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
          ],
        },
        {
          selectionId: "51725848",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.3 },
            },
          ],
        },
        {
          selectionId: "38915495",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.5 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.4 },
            },
          ],
        },
      ],
    },
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: "1",
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

describe("Oddsboost", () => {
  describe("When the user is on Event view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(navigationTabsListPO.element);
      await browser.waitUntil(
        AppPO.sportsbookRunnerBetButtonHasPrice({
          market: eventPagePO.markets[0],
          price: 1.2,
        }),
      );
    });

    describe("When there are Oddsboost markets available on tabs", () => {
      it("[PRPI-6248] The navigation tab list should be displayed", async () => {
        expect(await navigationTabsListPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-6249] The default tab should be selected", async () => {
        expect(await browser.containsClass(oddsboostFirstTabPO, NavigationTabsListPO.states.selected)).toBe(true);
      });

      it("[PRPI-6250] The number of items rendered should be 1", async () => {
        expect(await navigationTabsListPO.tabItems.length).toBe(1);
      });

      it("[PRPI-6251] The tab name should be: 'Oddsboost'", async () => {
        expect(await firstSingleTabPO.title.getText()).toBe("Oddsboost");
      });

      it("[PRPI-6252] the 1st selection should display the runner name:'Each Team to Have 2+ Corners in Each Half'", async () => {
        expect(await firstRunnerSportsbookPO.runnerName.getText()).toBe("Each Team to Have 2+ Corners in Each Half");
      });

      it("[PRPI-6253] the 1st selection should have a bet button", async () => {
        expect(await firstRunnerBetButton.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-6254] the 1st selection bet button should display the odds and the previous odds", async () => {
        expect(await firstRunnerBetButton.odd.isDisplayed()).toBe(true);
        expect(await firstRunnerBetButton.secondaryLabel.isDisplayed()).toBe(true);
      });

      it("[PRPI-6255] the 1st selection odds value should be 1.2", async () => {
        expect(await firstRunnerBetButton.odd.getText()).toBe("1.2");
      });

      it("[PRPI-6256] the 1st selection previous odds value should be 1.1", async () => {
        expect(await firstRunnerBetButton.secondaryLabel.getText()).toBe("1.1");
      });
    });

    describe("When there are Oddsboost markets available on a swimlane", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(oddsboostSwimlaneFirstCardBetButtonPO.secondaryLabel);
        await browser.waitUntilDisplayed(oddsboostSwimlaneFirstCard.element);
      });

      it("[PRPI-6257] the swimlane for Oddsboost markets should be displayed", async () => {
        expect(await oddsboostSwimlanePO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-6258] the swimlane for Oddsboost markets should have a title:'Oddsboost'", async () => {
        expect(await oddsboostSwimlanePO.title.getText()).toBe("Oddsboost");
      });

      it("[PRPI-6259] the swimlane for Oddsboost markets should display 3 cards", async () => {
        expect(await oddsboostSwimlanePO.scrollItems.length).toBe(3);
      });

      it("[PRPI-6260] the 1st and the 2nd cards should be displayed on viewport", async () => {
        expect(await oddsboostSwimlaneFirstCard.element.isDisplayedInViewport()).toBe(true);
        expect(await oddsboostSwimlaneSecondCard.element.isDisplayedInViewport()).toBe(true);
        expect(await oddsboostSwimlaneThirdCard.element.isDisplayedInViewport()).toBe(false);
      });

      it("[PRPI-6261] the 1st card should display the runner name:'All teams to score in the UEFA Champions League (in 90 mins)'", async () => {
        expect(await oddsboostSwimlaneFirstCard.text.getText()).toBe(
          "All teams to score in the UEFA Champions League (in 90 mins)",
        );
      });

      it("[PRPI-6262] the 1st card should have a bet button", async () => {
        expect(await oddsboostSwimlaneFirstCardBetButtonPO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-6263] the 1st card bet button should display the odds and the previous odds", async () => {
        expect(await oddsboostSwimlaneFirstCardBetButtonPO.odd.isDisplayed()).toBe(true);
        expect(await oddsboostSwimlaneFirstCardBetButtonPO.secondaryLabel.isDisplayed()).toBe(true);
      });

      it("[PRPI-6264] the 1st card odds value should be 1.2", async () => {
        expect(await oddsboostSwimlaneFirstCardBetButtonPO.odd.getText()).toBe("1.2");
      });

      it("[PRPI-6265] the 1st card previous odds value should be 1.1", async () => {
        expect(await oddsboostSwimlaneFirstCardBetButtonPO.secondaryLabel.getText()).toBe("1.1");
      });

      describe("And the user clicks on bet button of an Oddsboost market", () => {
        beforeAll(async () => {
          await oddsboostSwimlaneFirstCardBetButtonPO.element.click();
          await browser.waitUntilDisplayed(placePanelPO.element);
        });

        it("[PRPI-6266] the betslip should be displayed", async () => {
          expect(await placePanelPO.element.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
