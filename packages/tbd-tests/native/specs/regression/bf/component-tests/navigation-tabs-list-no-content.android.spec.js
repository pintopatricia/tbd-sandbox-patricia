const NavigationTabsSO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.so");
const NoContentAvailableCardSO = require("@ppb/tbd-shared/components/NoContentAvailableCard/NoContentAvailableCard.so");

const {
  getEventLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { TabsGroupSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();

const navigationTabsSO = new NavigationTabsSO();
const tabsSO = new TabsGroupSO();
const noContentAvailableCardSO = new NoContentAvailableCardSO();

const secondTabSO = new TabsGroupSO(tabsSO.tabButtons[1]);

const EVENT_ID = "29682729";

const CARD_GROUP_MOCK_1 = {
  node: {
    __typename: "SwimlaneCardGroup",
    urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29682729",
    cardGroupTitle: "Match Odds Markets",
    full: {
      edges: [
        {
          node: {
            __typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.170259755;924.228826155",
            cardTitle: "Match Odds",
            displayRunners: {
              sportsbook: {
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.228826155",
                  hierarchy: {
                    __typename: "EventHierarchy",
                    sportevent: {
                      urn: `ppb:event:${EVENT_ID}`,
                    },
                  },
                },
                runners: [{ runnerURN: "ppb:sbkRunner:924.228826155/0/0" }],
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
            __typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.170259755;924.228826155",
          },
        },
      ],
    },
  },
};

const CARD_GROUP_PARTIAL_1 = {
  node: {
    __typename: "SwimlaneCardGroup",
    urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29682729",
  },
};

const NAVIGATION_TABS_LIST_MOCK = {
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
              translate: {
                key: "I18N.DATE.MONDAY",
              },
            },
            full: {
              edges: [{ ...CARD_GROUP_MOCK_1 }],
            },
            partials: {
              partialEdges: [{ ...CARD_GROUP_PARTIAL_1 }],
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
              translate: {
                key: "I18N.DATE.MONDAY",
              },
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##tuesday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.TUESDAY",
              },
            },
          },
        },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: { urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##", __typename: "NavigationTabsList" },
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  title: "Navigation Tabs Test",
  edges: [{ ...NAVIGATION_TABS_LIST_MOCK }],
  partialEdges: [{ ...NAVIGATION_TABS_LIST_PARTIAL }],
};

const BFF_CARDS_MOCK = {
  cards: [
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup#29359895",
      cardGroupTitle: "Both Teams to Score",
      full: {
        edges: [
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826594",
              cardTitle: "Both Teams to Score",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.228826594",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                  },
                  runners: [{ runnerURN: "ppb:sbkRunner:924.228826594/1" }],
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
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826594",
            },
          },
        ],
      },
    },
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:halfTimeFullTimeMarketGroup#29359895",
      cardGroupTitle: "Half Time / Full Time",
      full: {
        edges: [
          {
            node: {
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826395",
              cardTitle: "Half Time / Full Time",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.228826395",
                    hierarchy: {
                      __typename: "EventHierarchy",
                      sportevent: {
                        urn: `ppb:event:${EVENT_ID}`,
                      },
                    },
                  },
                  runners: [{ runnerURN: "ppb:sbkRunner:924.228826395/0" }],
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
              __typename: "MarketCard",
              urn: "ppb:tbd:card:market:924.228826395",
            },
          },
        ],
      },
    },
  ],
};

const BFF_NAVIGATION_MOCK = {
  cards: [
    {
      __typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:##tuesday##",
      tabTitle: {
        translate: {
          key: "I18N.DATE.TUESDAY",
        },
      },
      full: {
        edges: [null],
      },
      partials: {
        partialEdges: [],
      },
    },
  ],
};

describe("Navigation Tabs List", () => {
  describe("When user enters an event view containing Tabs", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      const url = `football/whiskas/saquetas/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(navigationTabsSO.element);
    });

    it("[PRPI-2342] The navigation tab list should be displayed", async () => {
      expect(await navigationTabsSO.element.isDisplayed()).toBe(true);
    });
  });

  describe("When the user taps on the last tab and has no content", () => {
    beforeEach(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_NAVIGATION_MOCK));
      await browser.waitUntilDisplayed(secondTabSO.element);
      await secondTabSO.element.click();
      await browser.waitUntilDisplayed(noContentAvailableCardSO.element);
    });

    it("[PRPI-2343] The message 'Sorry! This hasnt been priced' and 'Please try another option or come back later' should be displayed", async () => {
      expect(await noContentAvailableCardSO.firstLabel.getText()).toContain("Sorry! This hasn't been priced");
      expect(await noContentAvailableCardSO.secondLabel.getText()).toContain(
        "Please try another option or come back later",
      );
    });
  });
});
