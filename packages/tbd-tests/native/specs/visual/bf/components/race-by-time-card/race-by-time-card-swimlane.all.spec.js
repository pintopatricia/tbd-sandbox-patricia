const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const { getGenericLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const MockService = require("../../../../../mock-essentials/mocking-service");

const mockService = new MockService();

const filteredCouponCardGroupSO = new FilteredCouponCardGroupSO();

const CARD_NAME = "race-by-time-card";

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
          __typename: "SwimlaneIndexedCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeetingSwimlaneIndexed:7|30622503|5",
          cardGroupTitle: "Belmont Park (US) 17th Jun",
          items: {
            edges: [
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.1905",
                  race: {
                    startTime: "2021-06-17T19:05:00.000Z",
                    urn: "ppb::race:7|30622503.1905",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.1905",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.1905",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.1938",
                  race: {
                    startTime: "2021-06-17T19:38:00.000Z",
                    details: {
                      resultType: "QUICK_RESULT",
                    },
                    urn: "ppb::race:7|30622503.1938",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.1938",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.1938",
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
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.2009",
                  race: {
                    startTime: "2021-06-17T20:09:00.000Z",
                    urn: "ppb:tbd::race:7|30622503.2009",
                  },
                  marketPromo: {
                    signposting: "MONEY_BACK",
                    urn: "ppb::race:7|30622503.2009",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.2009",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.2009",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.2040",
                  race: {
                    startTime: "2021-06-17T20:40:00.000Z",
                    urn: "ppb::race:7|30622503.2040",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.2040",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.2040",
                  },
                  winner: "THE PRANCING PRETZEL CHOCOLATE",
                  winnerIsp: {
                    favourite: false,
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
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.2113",
                  race: {
                    startTime: "2021-06-17T21:13:00.000Z",
                    urn: "ppb::race:7|30622503.2113",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.2113",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.2113",
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
    ],
  },
};

const BFF_SWIMLANE_MOCK = {
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

describe("Layout Entity - RaceByTimeRangeCard - swimlane", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_SWIMLANE_MOCK));

    const HOME_VIEW_LINK = getStartViewLink("view/amc-7");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });

    await browser.waitUntilDisplayed(filteredCouponCardGroupSO.swimlanes[0]);
  });

  it("[PRPI-4933]_should_render_swimlane_with_races", async () => {
    expect(
      (await browser.compareScreen(`${CARD_NAME}_[PRPI-4933]_should_render_swimlane_with_races`)).misMatchPercentage,
    ).toEqual(0);
  });
});
