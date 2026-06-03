const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const {
  getGenericLayout,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const filteredCouponCardGroupSO = new FilteredCouponCardGroupSO();

const CARD_NAME = "race-by-time-card";

const APP_CONTEXT_MOCK = {
  brandSettings: {
    RACES_BY_TIME_GRID: true,
  },
};

const RACES_BY_TIME_RANGE_CARD_MOCK = {
  __typename: "RacesByTimeRangeCardGroup",
  urn: "ppb:tbd:cardgroup:byTimeRange:YIA8IhEAACEAMOYI/s/7",
  filterOptions: {
    countriesFilter: {
      urn: "ppb:tbd:cardfilter:countries:YIA8IhEAACEAMOYI/s/7",
      defaultOptions: null,
      availableOptions: [
        {
          urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW",
          name: "USA",
        },
        {
          urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLB",
          name: "Portugal",
        },
        {
          urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLC",
          name: "Spain",
        },
      ],
    },
  },
  full: {
    edges: [
      {
        node: {
          __typename: "ByTimeRangeMeetingCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:7|30621828|5",
          cardGroupTitle: "Belterra 17th Jun",
          items: {
            edges: [
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1635",
                  race: {
                    startTime: "2021-06-17T16:35:00.000Z",
                    urn: "ppb::race:7|30621828.1635",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30621828.1635",
                    viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1635",
                  },
                  winner: "THE PRANCING PRETZEL CHOCOLATE",
                  winnerIsp: {
                    favourite: true,
                    decimal: 10,
                    fractional: {
                      numerator: 2,
                      denominator: 4,
                    },
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1704",
                  race: {
                    startTime: "2021-06-17T17:04:00.000Z",
                    urn: "ppb::race:7|30621828.1704",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30621828.1704",
                    viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1704",
                  },
                  marketPromo: {
                    signposting: "MONEY_BACK",
                    urn: "ppb::race:7|30621828.1802",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1733",
                  race: {
                    startTime: "2021-06-17T17:33:00.000Z",
                    urn: "ppb::race:7|30621828.1733",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30621828.1733",
                    viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1733",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1802",
                  race: {
                    startTime: "2021-06-17T18:02:00.000Z",
                    urn: "ppb::race:7|30621828.1802",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30621828.1802",
                    viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1802",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1831",
                  race: {
                    startTime: "2021-06-17T18:31:00.000Z",
                    urn: "ppb::race:7|30621828.1831",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30621828.1831",
                    viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1831",
                  },
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
          __typename: "SwimlaneIndexedCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeetingSwimlaneIndexed:7|30622503|5",
        },
      },
      {
        node: {
          __typename: "ByTimeRangeMeetingCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:7|30621828|5",
        },
      },
    ],
  },
};

const BFF_GRID_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:allmatchesraces:7",
  url: "view/amc-7",
  edges: [
    {
      node: RACES_BY_TIME_RANGE_CARD_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: RACES_BY_TIME_RANGE_CARD_MOCK.__typename,
        urn: RACES_BY_TIME_RANGE_CARD_MOCK.urn,
      },
    },
  ],
};

describe("Layout Entity - RaceByTimeRangeCard - Grid", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext(APP_CONTEXT_MOCK));

    await mockService.mockHttpRequest(getGenericLayout(BFF_GRID_MOCK));

    const HOME_VIEW_LINK = getStartViewLink("view/amc-7");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(filteredCouponCardGroupSO.byTimeRangeMeetingCardGroups[0]);
  });

  it("[PRPI-4549]_should_render_grid_with_races", async () => {
    expect(
      (await browser.compareScreen(`${CARD_NAME}_[PRPI-4549]_should_render_grid_with_races`)).misMatchPercentage,
    ).toEqual(0);
  });
});
