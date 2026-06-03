const FavouriteMarketsEmptyStateSO = require("@ppb/tbd-shared/components/FavouriteMarketsEmptyState/FavouriteMarketsEmptyState.so");
const NavigationTabsListSO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.so");

const {
  getAppContext,
  getEventLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
  setFavouriteMarket,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const {
  CardSO,
  IconButtonSO,
  TooltipSO,
  TabsGroupSO,
  PebbleCardGroupSO,
  SportPageScreenSO,
} = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const navigationTabsListSO = new NavigationTabsListSO();
const tabsSO = new TabsGroupSO();

const cardSO = new CardSO();

const firstTabSO = new TabsGroupSO(tabsSO.tabButtons[0]);
const secondTabSO = new TabsGroupSO(tabsSO.tabButtons[1]);

const sportScreenSO = new SportPageScreenSO();
const pebbleCardGroupSO = new PebbleCardGroupSO(sportScreenSO.pebbleCardGroups[0]);
const pebbleMarketCard = new CardSO(pebbleCardGroupSO.element);
const pebbleMarketIconButton = new IconButtonSO(pebbleMarketCard.endElement);

const tooltipSO = new TooltipSO();

const favouriteMarketsEmptyStateSO = new FavouriteMarketsEmptyStateSO();

const mockService = new MockService();

const EVENT_ID = "34630163";
const MARKET_URN = "ppb:sbkMarket:924.1";

const createCorrectScoreRunners = () => {
  const result = [];

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const selectionId = `${i + 1}${j}`;

      result.push({
        runnerURN: `ppb:sbkRunner:924.1/${selectionId}`,
        selectionId,
        name: `${i} - ${j}`,
        marketURN: MARKET_URN,
      });
    }
  }

  return result;
};

const PEBBLE_CARD_GROUP_URN_1 = "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1";
const PEBBLE_CARD_GROUP_URN_2 = "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/2";

const METADATA_MOCK = {
  sport: {
    __typename: "FavouriteMarketsCountMetadata",
    urn: "ppb:tbd:favouriteMarkets:metadata:1",
    currentCount: 0,
    limit: 1,
  },
  total: {
    __typename: "FavouriteMarketsCountMetadata",
    urn: "ppb:tbd:favouriteMarkets:metadata:total",
    currentCount: 0,
    limit: 1,
  },
};

const METADATA_MOCK_UPDATE = {
  sport: {
    ...METADATA_MOCK.sport,
    currentCount: 1,
  },
  total: {
    ...METADATA_MOCK.total,
    currentCount: 1,
  },
};

const FAVOURITE_MARKETS_STATE_MOCK = {
  __typename: "FavouriteMarketsState",
  urn: "ppb:tbd:favouriteMarkets:state:YTncIhUAALdCAjWS/e/34630163",
  isFavourite: false,
  metadata: METADATA_MOCK,
};

const FAVOURITE_MARKETS_STATE_MOCK_UPDATE = {
  __typename: "FavouriteMarketsState",
  urn: "ppb:tbd:favouriteMarkets:state:YTncIhUAALdCAjWS/e/34630163",
  metadata: METADATA_MOCK_UPDATE,
  isFavourite: true,
};

const PEBBLE_CARD_GROUP_MOCK_FULL = {
  node: {
    __typename: "PebbleCardGroup",
    urn: PEBBLE_CARD_GROUP_URN_1,
    pebbleCardGroupTitle: { translated: "Pebble Card Group 1" },
    selectedItemUrn: "ppb:tbd:card:correctScore:924.1|5",
    favouriteMarketsState: FAVOURITE_MARKETS_STATE_MOCK,
    full: {
      edges: [
        {
          name: "Correct Score",
          node: {
            __typename: "CorrectScoreCard",
            urn: "ppb:tbd:card:correctScore:924.1|5",
            numberOfItemsToDisplay: 3,
            market: {
              __typename: "SportsbookMarket",
              urn: MARKET_URN,
              marketType: "CORRECT_SCORE",
              marketTypeName: null,
              name: "Correct Score",
              runners: createCorrectScoreRunners(),
              noLiveData: true,
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          name: "Correct Score",
          node: {
            __typename: "CorrectScoreCard",
            urn: "ppb:tbd:card:correctScore:924.1|5",
          },
        },
      ],
    },
  },
};

const PEBBLE_CARD_GROUP_MOCK_FULL_2 = {
  node: {
    __typename: "PebbleCardGroup",
    urn: PEBBLE_CARD_GROUP_URN_2,
    pebbleCardGroupTitle: { translated: "Pebble Card Group 2" },
    selectedItemUrn: "ppb:tbd:card:correctScore:924.1|5",
    favouriteMarketsState: FAVOURITE_MARKETS_STATE_MOCK,
    full: {
      edges: [
        {
          name: "Correct Score",
          node: {
            __typename: "CorrectScoreCard",
            urn: "ppb:tbd:card:correctScore:924.1|5",
            numberOfItemsToDisplay: 3,
            market: {
              __typename: "SportsbookMarket",
              urn: MARKET_URN,
              marketType: "CORRECT_SCORE",
              marketTypeName: null,
              name: "Correct Score",
              runners: createCorrectScoreRunners(),
              noLiveData: true,
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          name: "Correct Score",
          node: {
            __typename: "CorrectScoreCard",
            urn: "ppb:tbd:card:correctScore:924.1|5",
          },
        },
      ],
    },
  },
};

const PEBBLE_CARD_GROUP_MOCK_PARTIAL_1 = {
  node: {
    __typename: "PebbleCardGroup",
    urn: PEBBLE_CARD_GROUP_URN_1,
  },
};

const PEBBLE_CARD_GROUP_MOCK_PARTIAL_2 = {
  node: {
    __typename: "PebbleCardGroup",
    urn: PEBBLE_CARD_GROUP_URN_2,
  },
};

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:YJ6YkREAAP_8SOIv/e/34630163",
    tabsTitle: "Popular",
    full: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:YJ60_xEAAP_8SUKY/e/34630163?=v=cHBiOnRiZDp2aWV3OmV2ZW50OjM0NjMwMTYzPz10YWJJZD1ZSjYwX3hFQUFQXzhTVUtZ",
            tabTitle: {
              translated: "Popular",
            },
            full: {
              edges: [
                {
                  node: {
                    ...PEBBLE_CARD_GROUP_MOCK_FULL.node,
                    urn: PEBBLE_CARD_GROUP_URN_1,
                    pebbleCardGroupTitle: { translated: "Popular Pebble Card Group" },
                  },
                },
                {
                  node: {
                    ...PEBBLE_CARD_GROUP_MOCK_FULL_2.node,
                    urn: PEBBLE_CARD_GROUP_URN_2,
                    pebbleCardGroupTitle: { translated: "Popular Pebble Card Group 2" },
                  },
                },
              ],
            },
            partials: {
              partialEdges: [PEBBLE_CARD_GROUP_MOCK_PARTIAL_1, PEBBLE_CARD_GROUP_MOCK_PARTIAL_2],
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          node: {
            __typename: "FavouriteMarketsNavigationTab",
            urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/34630163",
            badgeText: {
              translated: null,
              translate: {
                key: "I18N.COMMON.NEW",
                __typename: "TranslateProps",
              },
              __typename: "TranslatableText",
            },
            metadata: {
              __typename: "FavouriteMarketsMetadata",
              total: {
                __typename: "FavouriteMarketsCountMetadata",
                urn: "ppb:tbd:favouriteMarkets:metadata:total",
                currentCount: 0,
                limit: 100,
              },
            },
          },
          __typename: "NavigationTabEdge",
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:YJ60_xEAAP_8SUKY/e/34630163?=v=cHBiOnRiZDp2aWV3OmV2ZW50OjM0NjMwMTYzPz10YWJJZD1ZSjYwX3hFQUFQXzhTVUtZ",
            tabTitle: {
              translated: "Popular",
              __typename: "TranslatableText",
            },
          },
          __typename: "NavigationTabEdge",
        },
      ],
    },
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: {
    urn: "ppb:tbd:card:navigationTabsList:YJ6YkREAAP_8SOIv/e/34630163",
    __typename: "NavigationTabsList",
  },
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  title: "Navigation Tabs Test",
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

const BFF_NAVIGATION_FAVOURITE_CARD_MOCK = {
  __typename: "FavouriteMarketsNavigationTab",
  urn: "ppb:tbd:favouriteMarkets:navigationTab:favourite-markets/e/34630163",
  badgeText: {
    translated: null,
    translate: {
      key: "I18N.COMMON.NEW",
      __typename: "TranslateProps",
    },
    __typename: "TranslatableText",
  },
  metadata: METADATA_MOCK,
  full: {
    edges: [],
  },
  partials: {
    partialEdges: [],
  },
};

const BFF_NAVIGATION_FAVOURITE_UPDATED_MOCK = {
  ...BFF_NAVIGATION_FAVOURITE_CARD_MOCK,
  metadata: METADATA_MOCK_UPDATE,
  partials: {
    partialEdges: [{ node: { ...PEBBLE_CARD_GROUP_MOCK_PARTIAL_1.node, urn: PEBBLE_CARD_GROUP_URN_1 } }],
  },
};

const BFF_NAVIGATION_FAVOURITE_MOCK = {
  cards: [BFF_NAVIGATION_FAVOURITE_CARD_MOCK],
};

const SET_FAVOURITE_MARKET_MOCK = {
  data: {
    setFavouriteMarket: {
      result: {
        favouriteMarketsState: FAVOURITE_MARKETS_STATE_MOCK_UPDATE,
        favouriteMarketsNavigationTab: BFF_NAVIGATION_FAVOURITE_UPDATED_MOCK,
      },
    },
  },
};

const APP_CONTEXT_MOCK = {
  throttles: {
    FAVOURITE_MARKETS_TOOLTIP: {
      isActive: true,
    },
  },
};

describe("Event Page - Favourite Markets", () => {
  describe("When the user opens the event page with the Favourites tab available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-${EVENT_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(navigationTabsListSO.element);

      await browser.waitUntilEquals(tabsSO.selectedTab, "Popular", {
        message: "Initial selected tab doesn't match",
      });
    });

    // tooltip is meant to be deleted in near future
    // this is a temporary way to hide it until final decision
    // cleanup in #INCGNT-633
    it("[PRPI-3734] Should not display the tooltip", async () => {
      expect(await tooltipSO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-3735] Should display an IconButton on the PebbleCardGroup", async () => {
      expect(await pebbleMarketIconButton.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-3736] Should display the favourite markets tab correctly", async () => {
      expect(await firstTabSO.tabsIcons[0].isDisplayed()).toBe(true);
      expect(await firstTabSO.tabsTitles.length).toBe(0);
    });

    // cleanup in #INCGNT-633
    /* describe("And the user clicks on the close button on the Tooltip", () => {
      beforeAll(async () => {
        await tooltipSO.closeButton.click();

        await browser.waitUntilNotDisplayed(tooltipSO.element, "Tooltip still visible");
      });

      it("[PRPI-3737] Should no longer display the Tooltip", async () => {
        expect(await tooltipSO.element.isDisplayed()).toBe(false);
      });
    }); */

    describe("When the user navigates to the Favourite tab", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getCardResults(BFF_NAVIGATION_FAVOURITE_MOCK));

        await firstTabSO.element.click();

        await browser.waitUntilDisplayed(favouriteMarketsEmptyStateSO.element, {
          message: "Favourite Tab not loaded",
        });
      });

      it("[PRPI-3738] Should display the Empty State with a title", async () => {
        expect(await favouriteMarketsEmptyStateSO.title.getText()).toBe("Looks like there are no favourite markets...");
      });

      it("[PRPI-3739] Should display the Empty State with a message", async () => {
        expect(await favouriteMarketsEmptyStateSO.message.getText()).toBe(
          "This could be because you have not added any yet, or previously favourited markets are not available on this event.",
        );
      });

      // TODO To be fixed on the scope of this US: https://jira.services.flutteruki.com/browse/HMMR-758
      xdescribe("And the user clicks on the Popular's tab and presses on the favourite icon on a PebbleCardGroup and navigates back to the Favourite Tab", () => {
        beforeAll(async () => {
          await secondTabSO.element.click();

          await browser.waitUntilEquals(cardSO.title, "Popular Pebble Card Group", {
            message: "Popular Pebble card group title doesn't match",
          });
          await mockService.mockHttpRequest(setFavouriteMarket(SET_FAVOURITE_MARKET_MOCK));

          await pebbleMarketIconButton.element.click();
          await firstTabSO.element.click();

          await browser.waitUntil(async () => (await sportScreenSO.pebbleCardGroups.length) === 1);
        });

        it("[PRPI-3740] Should display the favourited content section", async () => {
          expect(await pebbleCardGroupSO.element.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
