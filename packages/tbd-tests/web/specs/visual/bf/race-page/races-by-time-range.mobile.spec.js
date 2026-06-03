const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const FilteredCouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const filteredCardGroupPO = new FilteredCouponCardGroupPO();

const mockService = new MockService();
const MODULE_NAME = "races_by_time";

const EVENT_TYPE_ID = "7";

const RACES_BY_TIME_RANGE_CARD_SWIMLANE_MOCK = {
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

const RACES_BY_TIME_RANGE_CARD_GRID_MOCK = {
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
          __typename: "ByTimeRangeMeetingCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:7|30621828|5",
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
      node: RACES_BY_TIME_RANGE_CARD_SWIMLANE_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: RACES_BY_TIME_RANGE_CARD_SWIMLANE_MOCK.__typename,
        urn: RACES_BY_TIME_RANGE_CARD_SWIMLANE_MOCK.urn,
      },
    },
  ],
};

const BFF_GRID_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:allmatchesraces:7",
  url: "view/amc-7",
  edges: [
    {
      node: RACES_BY_TIME_RANGE_CARD_GRID_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: RACES_BY_TIME_RANGE_CARD_GRID_MOCK.__typename,
        urn: RACES_BY_TIME_RANGE_CARD_GRID_MOCK.urn,
      },
    },
  ],
};

describe("Layout Entity - RaceByTimeRangeCard", () => {
  describe("Swimlane", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_SWIMLANE_MOCK.urn, { sportsbookOddsDisplay: "FRACTIONAL" }),
      );
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGenericLayout(BFF_SWIMLANE_MOCK));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await browser.waitUntilDisplayed(filteredCardGroupPO.swimlanes[0]);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1531]_should_display_swimlane_with_races`);
    });

    it("[PRPI-1531]_should_display_swimlane_with_races", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1531]_should_display_swimlane_with_races`)).toEqual(0);
    });
  });

  describe("Grid", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_GRID_MOCK.urn, {
          sportsbookOddsDisplay: "FRACTIONAL",
          brandSettings: {
            RACES_BY_TIME_GRID: true,
          },
        }),
      );

      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGenericLayout(BFF_GRID_MOCK));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await browser.waitUntilDisplayed(filteredCardGroupPO.byTimeRangeMeetingCardGroups[0]);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1532]_should_display_grid_with_races`);
    });

    it("[PRPI-1532]_should_render_grid_with_races", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1532]_should_display_grid_with_races`)).toEqual(0);
    });
  });
});
