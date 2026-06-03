const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const OutrightMarketListCardSO = require("@ppb/tbd-shared/components/OutrightMarketListCard/OutrightMarketListCard.native.so");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const outrightMarketListCardSO = new OutrightMarketListCardSO();
const MODULE_NAME = "outright_market_list_card-navigation-tab";

const mockService = new MockService();

const EVENT_ID = "29682729";
const COMPETITION_ID = "1234";

const SPORTSBOOK_MARKET_ID_1 = "924.123";
const SPORTSBOOK_MARKET_ID_2 = "924.124";
const SPORTSBOOK_MARKET_ID_3 = "924.125";

const SELECTION_ID_1 = 13528450;
const SELECTION_ID_2 = 14041984;
const SELECTION_ID_3 = 13485007;

const SPORT_MOCK = { __typename: "Sport", urn: "ppb:eventType:3", name: "Golf", sportId: 3 };

const COMPETITION_MOCK = {
  __typename: "Competition",
  urn: `ppb:competition:${COMPETITION_ID}`,
  name: "The Ryder Cup 2023",
  competitionId: COMPETITION_ID,
  sport: SPORT_MOCK,
};

const EVENT_COMPETITION_HIERARCHY_MOCK = {
  __typename: "EventCompetitionHierarchy",
  sportevent: {
    __typename: "SportsEvent",
    urn: "ppb:event:30951668",
    eventId: 30951668,
    name: "The Ryder Cup 2023",
    openDate: "2023-09-29T11:00:00.000Z",
    competition: COMPETITION_MOCK,
  },
  competition: COMPETITION_MOCK,
};

const MONDAY_TAB_CONTENT_MOCK = {
  partial: {
    node: {
      __typename: "OutrightMarketListCard",
      urn: "ppb:tbd:card:outrightMarketList:Y1FoEBEAADtSDlBF/c/1234",
    },
  },
  full: {
    node: {
      __typename: "OutrightMarketListCard",
      urn: "ppb:tbd:card:outrightMarketList:Y1FoEBEAADtSDlBF/c/1234",
      title: "Golf",
      numberOfRowsToDisplay: 2,
      markets: [
        {
          __typename: "SportsbookMarket",
          urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID_1}`,
          name: "Winner",
          hierarchy: EVENT_COMPETITION_HIERARCHY_MOCK,
          sport: SPORT_MOCK,
          runners: [
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_1}/${SELECTION_ID_1}`,
              name: "United States of America with the biggest name there is",
              selectionId: SELECTION_ID_1,
            },
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_1}/${SELECTION_ID_2}`,
              name: "Europe",
              selectionId: SELECTION_ID_2,
            },
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_1}/${SELECTION_ID_3}`,
              name: "Tie",
              selectionId: SELECTION_ID_3,
            },
          ],
        },
        {
          __typename: "SportsbookMarket",
          urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID_2}`,
          name: "Three Balls and also Two Balls but what if we had like just One Ball to show that this can have two lines?",
          hierarchy: EVENT_COMPETITION_HIERARCHY_MOCK,
          sport: SPORT_MOCK,
          runners: [
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_2}/${SELECTION_ID_1}`,
              name: "USA",
              selectionId: SELECTION_ID_1,
            },
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_2}/${SELECTION_ID_2}`,
              name: "Europe that has an even bigger name than the previous market",
              selectionId: SELECTION_ID_2,
            },
          ],
        },
        {
          __typename: "SportsbookMarket",
          urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID_3}`,
          name: "Two Balls",
          hierarchy: EVENT_COMPETITION_HIERARCHY_MOCK,
          sport: SPORT_MOCK,
          runners: [
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_3}/${SELECTION_ID_1}`,
              name: "USA",
              selectionId: SELECTION_ID_1,
            },
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_3}/${SELECTION_ID_2}`,
              name: "Europe",
              selectionId: SELECTION_ID_2,
            },
            {
              __typename: "Runner",
              runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID_3}/${SELECTION_ID_3}`,
              name: "Tie",
              selectionId: SELECTION_ID_3,
            },
          ],
        },
      ],
    },
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
              edges: [MONDAY_TAB_CONTENT_MOCK.full],
            },
            partials: {
              partialEdges: [MONDAY_TAB_CONTENT_MOCK.partial],
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

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  title: "Navigation Tabs Test - Outright Market List Card",
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

const SMP_MARKET_SELECTIONS = [
  {
    selectionId: SELECTION_ID_1,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 6.5 },
    },
  },
  {
    selectionId: SELECTION_ID_2,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 1.2 },
    },
  },
  {
    selectionId: SELECTION_ID_3,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: 2.9 },
    },
  },
];

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID_1,
      runnerDetails: SMP_MARKET_SELECTIONS,
    },
    {
      marketId: SPORTSBOOK_MARKET_ID_2,
      runnerDetails: SMP_MARKET_SELECTIONS,
    },
    {
      marketId: SPORTSBOOK_MARKET_ID_3,
      runnerDetails: SMP_MARKET_SELECTIONS,
    },
  ],
};

describe("Navigation Tabs List - Outright Market List Card", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    const HOME_VIEW_LINK = getStartViewLink(`football/whiskas/saquetas/e-${EVENT_ID}`);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilDisplayed(outrightMarketListCardSO.element);

    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-4925]_should_show_outright_market_list_card_in_navigation_tab`,
    );
  });

  it("[PRPI-4925]_should_show_outright_market_list_card_in_navigation_tab", async () => {
    expect(
      (
        await browser.compareScreen(
          `${MODULE_NAME}_[PRPI-4925]_should_show_outright_market_list_card_in_navigation_tab`,
        )
      ).misMatchPercentage,
    ).toEqual(0);
  });
});
