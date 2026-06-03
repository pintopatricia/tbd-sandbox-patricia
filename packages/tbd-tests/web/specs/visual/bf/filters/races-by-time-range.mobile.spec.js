const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService(browser);
const EVENT_TYPE_ID = "7";

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
          title: "Belmont Park (US) 17th Jun",
          items: {
            edges: [
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.1905",
                  race: {
                    urn: "ppb:race:7|30622503.1905",
                    startTime: "2021-06-17T19:05:00.000Z",
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
                    urn: "ppb:race:7|30622503.1938",
                    startTime: "2021-06-17T19:38:00.000Z",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.1938",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.1938",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.2009",
                  race: {
                    urn: "ppb:race:7|30622503.2009",
                    startTime: "2021-06-17T20:09:00.000Z",
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
                    urn: "ppb:race:7|30622503.2040",
                    startTime: "2021-06-17T20:40:00.000Z",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.2040",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.2040",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.2113",
                  race: {
                    urn: "ppb:race:7|30622503.2113",
                    startTime: "2021-06-17T21:13:00.000Z",
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
      {
        node: {
          __typename: "SwimlaneIndexedCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeetingSwimlaneIndexed:7|30621828|5",
          title: "Belterra 17th Jun",
          hint: 1,
          items: {
            edges: [
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1635",
                  race: {
                    urn: "ppb:race:7|30621828.1635",
                    startTime: "2021-06-17T16:35:00.000Z",
                    details: {
                      resultType: "QUICK_RESULT",
                    },
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30621828.1635",
                    viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1635",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1704",
                  race: {
                    urn: "ppb:race:7|30621828.1704",
                    startTime: "2021-06-17T17:04:00.000Z",
                    details: {
                      resultType: "QUICK_RESULT",
                    },
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30621828.1704",
                    viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1704",
                  },
                },
              },
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30621828.1733",
                  race: {
                    urn: "ppb:race:7|30621828.1733",
                    startTime: "2021-06-17T17:33:00.000Z",
                  },
                  marketPromo: {
                    signposting: "EXTRA_PLACES",
                  },
                  blurbs: [],
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
                    urn: "ppb:race:7|30621828.1802",
                    startTime: "2021-06-17T18:02:00.000Z",
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
                    urn: "ppb:race:7|30621828.1831",
                    startTime: "2021-06-17T18:31:00.000Z",
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
          __typename: "SwimlaneIndexedCardGroup",
          urn: "ppb:tbd:cardgroup:byTimeRangeMeetingSwimlaneIndexed:7|30621828|5",
        },
      },
    ],

    pageInfo: {
      hasNextPage: true,
    },
  },
};

const BFF_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:allmatchesraces/7",
  url: "view/generic:allmatchesraces/7",
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

const BFF_MOCK_NO_RESULTS = {
  ...BFF_MOCK,
  edges: [
    {
      node: { ...RACES_BY_TIME_RANGE_CARD_MOCK, full: { edges: [] }, partials: { partialEdges: [] } },
    },
  ],
};

const MODULE_NAME = "all_races_by_time_range";

xdescribe("When user is on a Generic View with all races", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1307]_should_render_all_races_by_time_range`);
  });

  it("[PRPI-1307]_should_render_all_races_by_time_range", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1307]_should_render_all_races_by_time_range`)).toBe(0);
  });

  describe("when there are no results to be shown", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_NO_RESULTS.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_NO_RESULTS));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1308]_should_render_no_results_message`);
    });

    it("[PRPI-1308]_should_render_no_results_message", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1308]_should_render_no_results_message`)).toBe(0);
    });
  });
});
