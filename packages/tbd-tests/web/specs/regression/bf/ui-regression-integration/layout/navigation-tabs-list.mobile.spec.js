const {
  HeaderPO,
  ScrollableSwimlanePO,
  BottomBarPO,
  HighlightedSelectionCardPO,
} = require("../../../../../page-objects");
const { getEventLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");
const NoContentAvailableCardPO = require("@ppb/tbd-shared/components/NoContentAvailableCard/NoContentAvailableCard.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const headerPO = new HeaderPO();
const bottomBarPO = new BottomBarPO();
const navigationTabsListPO = new NavigationTabsListPO();
const firstTabPO = navigationTabsListPO.tabs[0];
const secondTabPO = navigationTabsListPO.tabs[1];
const thirdTabPO = navigationTabsListPO.tabs[2];
const fourthTabPO = navigationTabsListPO.tabs[3];
const lastTabPO = navigationTabsListPO.tabs[4];

const firstTabItem = new ScrollableSwimlanePO(navigationTabsListPO.tabItems[0]);
const firstTabSecondItemPO = new ScrollableSwimlanePO(navigationTabsListPO.tabItems[1]);
const highlightedItemPO = new HighlightedSelectionCardPO(navigationTabsListPO.tabItems[0]);
const noContentItemPO = new NoContentAvailableCardPO(navigationTabsListPO.tabNoContent);

const mockService = new MockService();

const EVENT_ID = "29682729";
const MARKET_ID = "1.170259755";

const MARKET_CARD_PARTIAL = {
  __typename: "MarketCard",
  urn: "ppb:tbd:card:market:1.170259755;924.228826155",
};

const MARKET_CARD = {
  ...MARKET_CARD_PARTIAL,
  cardTitle: "Match Odds",
  displayRunners: {
    exchange: {
      market: {
        __typename: "ExchangeMarket",
        urn: `ppb:excMarket:${MARKET_ID}`,
        hierarchy: {
          __typename: "EventHierarchy",
          sportevent: {
            urn: `ppb:event:${EVENT_ID}`,
          },
        },
        runners: [
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
            selectionId: 55190,
          },
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
            selectionId: 55190,
          },
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
            selectionId: 55190,
          },
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
            selectionId: 55190,
          },
          {
            runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
            selectionId: 55190,
          },
        ],
      },
      runners: [
        {
          runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
        },
        {
          runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
        },
        {
          runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
        },
        {
          runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
        },
        {
          runnerURN: `ppb:excRunner:${MARKET_ID}/55190/0`,
        },
      ],
    },
  },
};

const CARD_GROUP_PARTIAL = {
  node: {
    __typename: "SwimlaneCardGroup",
    urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29682729",
  },
};

const HIGHLIGHTED_SELECTION_CARD = {
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
};

const HIGHLIGHTED_SELECTION_CARD_PARTIAL = {
  __typename: "HighlightedSelectionCard",
  urn: "ppb:tbd:card:highlightedSelection:924.1/1",
};

const CARD_GROUP_MOCK = {
  node: {
    ...CARD_GROUP_PARTIAL.node,
    cardGroupTitle: "Match Odds Markets",
    full: {
      edges: [
        {
          node: MARKET_CARD,
        },
      ],
    },
    partials: {
      edges: [
        {
          node: MARKET_CARD_PARTIAL,
        },
      ],
    },
  },
};

const CARD_GROUP_PARTIAL_2 = {
  node: {
    ...CARD_GROUP_PARTIAL.node,
    urn: "ppb:tbd:card:group:marketsByEventAndMarketType:bothTeamsToScoreMarketGroup#29359895",
  },
};

const CARD_GROUP_MOCK_2 = {
  node: {
    ...CARD_GROUP_MOCK.node,
    ...CARD_GROUP_PARTIAL_2.node,
    cardGroupTitle: "No team will score",
  },
};

const CARD_GROUP_PARTIAL_3 = {
  node: {
    ...CARD_GROUP_PARTIAL.node,
    urn: "ppb:tbd:card:group:marketsByEventAndMarketType:halfTimeFullTimeMarketGroup#29359895",
  },
};

const CARD_GROUP_MOCK_3 = {
  node: {
    ...CARD_GROUP_MOCK.node,
    ...CARD_GROUP_PARTIAL_3.node,
    cardGroupTitle: "Some team will score",
  },
};

const CARD_GROUP_PARTIAL_4 = [
  {
    node: {
      __typename: "SwimlaneCardGroup",
      urn: "invalid0",
    },
  },
  {
    node: {
      __typename: "SwimlaneCardGroup",
      urn: "invalid1",
    },
  },
  {
    node: {
      __typename: "SwimlaneCardGroup",
      urn: "invalid2",
    },
  },
  {
    node: {
      __typename: "SwimlaneCardGroup",
      urn: "invalid3",
    },
  },
  {
    node: {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:marketsByEventAndMarketType:primaryMarketGroup#29682739",
    },
  },
];

const BFF_5_CARD_REQUEST_MOCK = {
  cards: [
    {
      ...CARD_GROUP_PARTIAL_4[4].node,
      cardGroupTitle: "Match Odds Markets",
      full: {
        edges: [
          {
            node: HIGHLIGHTED_SELECTION_CARD,
          },
        ],
      },
      partials: {
        edges: [
          {
            node: HIGHLIGHTED_SELECTION_CARD_PARTIAL,
          },
        ],
      },
    },
  ],
};

const BFF_CARDS_MOCK = {
  cards: [CARD_GROUP_MOCK_2.node],
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
              edges: [CARD_GROUP_MOCK],
            },
            partials: {
              partialEdges: [CARD_GROUP_PARTIAL, CARD_GROUP_PARTIAL_2],
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
            tabViewLink: {
              viewUrl: "football/e-29682729?tabId=YIGX-RAAACIAeejV",
              viewUrn: "ppb:tbd:view:event:29682729?=tabId=YIGX-RAAACIAeejV",
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##wednesday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.WEDNESDAY",
              },
            },
            tabViewLink: {
              viewUrl: "football/e-29682729",
              viewUrn: "ppb:tbd:view:event:29682729",
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##thursday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.THURSDAY",
              },
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##friday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.FRIDAY",
              },
            },
          },
        },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_LAST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
    selectedTabUrn: "ppb:tbd:view:navigationTab:##friday##",
    tabsTitle: "All Football",
    full: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##friday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.FRIDAY",
              },
            },
            full: {
              edges: [CARD_GROUP_MOCK],
            },
            partials: {
              partialEdges: [CARD_GROUP_PARTIAL, CARD_GROUP_PARTIAL_2],
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
            tabViewLink: {
              viewUrl: "football/e-29682729?tabId=YIGX-RAAACIAeejV",
              viewUrn: "ppb:tbd:view:event:29682729?=tabId=YIGX-RAAACIAeejV",
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##wednesday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.WEDNESDAY",
              },
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##thursday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.THURSDAY",
              },
            },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:##friday##",
            tabTitle: {
              translate: {
                key: "I18N.DATE.FRIDAY",
              },
            },
          },
        },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: {
    urn: "ppb:tbd:card:navigationTabsList:##navigationTabsList##",
    __typename: "NavigationTabsList",
  },
};

const BFF_SECOND_TAB_MOCK = {
  cards: [
    {
      __typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:##tuesday##",
      tabTitle: {
        translate: {
          key: "I18N.DATE.TUESDAY",
        },
      },
      tabViewLink: {
        viewUrl: "football/e-29682729?tabId=YIGX-RAAACIAeejV",
        viewUrn: "ppb:tbd:view:event:29682729?=tabId=YIGX-RAAACIAeejV",
      },
      full: {
        edges: [CARD_GROUP_MOCK_3],
      },
      partials: {
        partialEdges: [CARD_GROUP_PARTIAL_3],
      },
    },
  ],
};

const BFF_THIRD_TAB_MOCK = {
  cards: [
    {
      __typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:##wednesday##",
      tabTitle: {
        translate: {
          key: "I18N.DATE.WEDNESDAY",
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

const BFF_FOURTH_TAB_MOCK = {
  cards: [
    {
      __typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:##thursday##",
      tabTitle: {
        translate: {
          key: "I18N.DATE.THURSDAY",
        },
      },
      full: {
        edges: [null, null, null, null],
      },
      partials: {
        partialEdges: CARD_GROUP_PARTIAL_4,
      },
    },
  ],
};

const BFF_BOTTOM_BAR_PROPERTY = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        // viewUrn must be different than home, mybets, gaming, browse for the back btn to render
        viewUrn: `ppb:tbd:view:event:999`,
        viewUrl: "",
      },
    },
  ],
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  title: "Navigation Tabs Test",
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
  bottomBar: BFF_BOTTOM_BAR_PROPERTY,
};

const BFF_LAST_MOCK = {
  urn: `ppb:tbd:view:event:999`,
  title: "Navigation Tabs Test",
  edges: [NAVIGATION_TABS_LIST_LAST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
  bottomBar: BFF_BOTTOM_BAR_PROPERTY,
};

describe("Navigation - NavigationTabsList", () => {
  describe("When the default tab is the first one", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(navigationTabsListPO.element);
    });

    describe("When user enters an event view containing Tabs", () => {
      it("[PRPI-6678] The navigation tab list should be displayed", async () => {
        expect(await navigationTabsListPO.element.isDisplayed()).toBe(true);
      });
      it("[PRPI-6679] The default tab should be selected", async () => {
        expect(await browser.containsClass(firstTabPO, NavigationTabsListPO.states.selected)).toBe(true);
      });
      it("[PRPI-6680] The number of items rendered should be 2", async () => {
        expect(await navigationTabsListPO.tabItems.length).toBe(2);
      });

      it("[PRPI-6681] The first item title\xA0should be 'Match Odds Markets'", async () => {
        expect(await firstTabItem.title.getText()).toBe("Match Odds Markets");
      });
    });

    describe("When user scrolls down to reveal more content", () => {
      beforeAll(async () => {
        await firstTabSecondItemPO.element.scrollIntoView();
        await browser.waitUntilEquals(firstTabSecondItemPO.title, "No team will score");
      });

      it("[PRPI-6682] The loaded content should be rendered in page", async () => {
        expect(await firstTabSecondItemPO.title.getText()).toBe("No team will score");
      });
    });

    describe("When user taps on the second tab", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_SECOND_TAB_MOCK));
        await browser.tickFakeClock();
        await secondTabPO.scrollIntoView({
          block: "end",
        });
        await browser.waitUntilInViewport(secondTabPO);
        await secondTabPO.click();
        await browser.containsClass(secondTabPO, NavigationTabsListPO.states.selected);
        await browser.waitUntilEquals(firstTabItem.title, "Some team will score");
      });

      it("[PRPI-6683] The second tab should be selected", async () => {
        expect(await browser.containsClass(secondTabPO, NavigationTabsListPO.states.selected)).toBe(true);
      });
      it("[PRPI-6684] The second tab content should be displayed", async () => {
        expect(await firstTabItem.title.getText()).toBe("Some team will score");
      });
      it("[PRPI-6685] The url should be updated with the correct tabId", async () => {
        expect(await browser.getUrl()).toContain("tabId=YIGX-RAAACIAeejV");
      });
    });

    describe("When user scrolls until last tab", () => {
      beforeAll(async () => {
        await lastTabPO.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(lastTabPO);
      });
      it("[PRPI-6686] The last tab should be displayed", async () => {
        expect(await lastTabPO.getText()).toBe("Friday");
      });
      it("[PRPI-6687] The last tab should not be selected", async () => {
        expect(await browser.containsClass(lastTabPO, NavigationTabsListPO.states.selected)).toBe(false);
      });
    });

    describe("When the user taps on the third tab and hasContent = false", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_THIRD_TAB_MOCK));
        await browser.waitUntilInViewport(thirdTabPO);
        await thirdTabPO.scrollIntoView({
          block: "center",
        });
        await thirdTabPO.click();
        await browser.waitUntilEquals(noContentItemPO.firstLabel, "Sorry! This hasn't been priced");
      });

      it("[PRPI-6688] The third tab should be selected", async () => {
        expect(await browser.containsClass(thirdTabPO, NavigationTabsListPO.states.selected)).toBe(true);
      });

      it("[PRPI-6689] The message 'Sorry! This hasn't been priced' and 'Please try another option or come back later", async () => {
        expect(await noContentItemPO.firstLabel.getText()).toBe("Sorry! This hasn't been priced");
        expect(await noContentItemPO.secondLabel.getText()).toBe("Please try another option or come back later");
      });
    });

    describe("When the user taps on the fourth tab", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_FOURTH_TAB_MOCK));
        await mockService.mockHttpRequest(getCardResults(BFF_5_CARD_REQUEST_MOCK));
        await browser.tickFakeClock();
        await fourthTabPO.scrollIntoView({
          block: "center",
        });
        await browser.waitUntilInViewport(fourthTabPO);
        await fourthTabPO.click();
        await browser.containsClass(fourthTabPO, NavigationTabsListPO.states.selected);
        await browser.waitUntilDisplayed(highlightedItemPO.element);
      });

      it("[PRPI-6690] The fourth tab should be selected", async () => {
        expect(await browser.containsClass(fourthTabPO, NavigationTabsListPO.states.selected)).toBe(true);
      });

      it("[PRPI-6691] The no content card should not be visible", async () => {
        expect(await noContentItemPO.element.isDisplayed()).toBe(false);
      });

      it("[PRPI-6692] The card text should be 'All teams to score in the UEFA Champions League (in 90 mins)'", async () => {
        expect(await highlightedItemPO.text.getText()).toBe(
          "All teams to score in the UEFA Champions League (in 90 mins)",
        );
      });
    });

    describe("When the user navigates to another page and returns to event view containing tabs", () => {
      beforeAll(async () => {
        await bottomBarPO.tiles[0].click();
        await browser.waitUntilDisplayed(headerPO.backButtonIcon);
        await headerPO.backButton.waitForClickable();
        await headerPO.backButton.click();
        await browser.waitUntilEquals(firstTabItem.title, "Match Odds Markets");
      });

      it("[PRPI-6693] The last selected tab should still be selected.", async () => {
        expect(await browser.containsClass(fourthTabPO, NavigationTabsListPO.states.selected)).toBe(true);
      });
    });
  });

  describe("When the default tab is the last one", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_LAST_MOCK.urn));
      await mockService.mockHttpRequest(getEventLayout(BFF_LAST_MOCK));
      await mockService.mockHttpRequest(getCardResults(BFF_CARDS_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(navigationTabsListPO.element);
      await browser.waitUntilEquals(firstTabItem.title, "Match Odds Markets");
    });

    describe("When user enters an event view containing Tabs", () => {
      it("[PRPI-6694] The navigation tab list should be displayed", async () => {
        expect(await navigationTabsListPO.element.isDisplayed()).toBe(true);
      });
      it("[PRPI-6695] The last tab should be selected", async () => {
        expect(await browser.containsClass(lastTabPO, NavigationTabsListPO.states.selected)).toBe(true);
      });
      it("[PRPI-6696] The number of items rendered should be 2", async () => {
        expect(await navigationTabsListPO.tabItems.length).toBe(2);
      });
    });
  });
});
