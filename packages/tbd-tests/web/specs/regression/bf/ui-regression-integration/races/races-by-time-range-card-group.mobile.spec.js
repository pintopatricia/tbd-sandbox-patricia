const {
  ScrollableSwimlanePO,
  RaceLinkPO,
  FilterByPO,
  OptionListPO,
  AlertPO,
  FilterCriteriaPO,
  ByTimeRangeMeetingCardGroupPO,
} = require("../../../../../page-objects");
const { getGenericLayout, getFilteredCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const FilteredCouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const alertPO = new AlertPO();
const filteredCardGroupPO = new FilteredCouponCardGroupPO();
const swimlanePO = new ScrollableSwimlanePO(filteredCardGroupPO.swimlanes[0]);
const byTimeRangeMeetingCardPO = new ByTimeRangeMeetingCardGroupPO(filteredCardGroupPO.byTimeRangeMeetingCardGroups[0]);
const firstRaceLinkPO = new RaceLinkPO(swimlanePO.scrollItems[0]);
const secondRaceLinkPO = new RaceLinkPO(swimlanePO.scrollItems[1]);
const firstMeetingCardRaceLinkPO = new RaceLinkPO(byTimeRangeMeetingCardPO.gridItems[0]);
const filterByPO = new FilterByPO();
const filterCriteriaPO = new FilterCriteriaPO();
const optionListPO = new OptionListPO(filterCriteriaPO.element);
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
          cardGroupTitle: "Belmont Park (US) 17th Jun",
          hint: 1,
          items: {
            edges: [
              {
                node: {
                  __typename: "RaceByTimeRangeCard",
                  urn: "ppb:tbd:card:byTimeRange:7|30622503.1905",
                  race: {
                    startTime: "2021-06-17T19:05:00.000Z",
                    details: {
                      resultType: "QUICK_RESULT",
                    },
                    urn: "ppb::race:7|30622503.1905",
                  },
                  viewLink: {
                    viewUrn: "ppb:tbd:view:race:7|30622503.1905",
                    viewUrl: "horse-racing/belmont-park-(us)-17th-jun/r-7%7C30622503.1905",
                  },
                  winner: "SENSE OF WORTH",
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
                  winner: "SENSE OF WORTH",
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

const COUNTRIES_FILTERED_CARD_MOCK = {
  cards: [
    {
      __typename: "RacesByTimeRangeCardGroup",
      urn: "ppb:tbd:cardgroup:byTimeRange:YIA8IhEAACEAMOYI/s/7",
      full: {
        edges: [
          {
            node: {
              __typename: "SwimlaneCardGroup",
              urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:30621828|5",
              cardGroupTitle: "Belterra 17th Jun",
              viewAll: null,
              full: {
                edges: [
                  {
                    node: {
                      __typename: "RaceByTimeRangeCard",
                      urn: "ppb:tbd:card:byTimeRange:7|30621828.1635",
                      race: {
                        startTime: "2021-06-17T16:35:00.000Z",
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
                        startTime: "2021-06-17T12:37:00.000Z",
                      },
                      viewLink: {
                        viewUrn: "ppb:tbd:view:race:7|30621828.1704",
                        viewUrl: "horse-racing/belterra-17th-jun/r-7%7C30621828.1704",
                      },
                    },
                  },
                ],
              },
              partials: {
                edges: [
                  {
                    node: {
                      __typename: "RaceByTimeRangeCard",
                      urn: "ppb:tbd:card:byTimeRange:7|30621828.1635",
                    },
                  },
                  {
                    node: {
                      __typename: "RaceByTimeRangeCard",
                      urn: "ppb:tbd:card:byTimeRange:7|30621828.1704",
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
              __typename: "SwimlaneCardGroup",
              urn: "ppb:tbd:cardgroup:byTimeRangeMeeting:30621828|5",
            },
          },
        ],
      },
    },
  ],
};

const RESET_FILTERED_CARD_MOCK = {
  cards: [RACES_BY_TIME_RANGE_CARD_MOCK],
};

describe("When the user is on a Generic View with all daily races", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { sportsbookOddsDisplay: "FRACTIONAL" }));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
    await browser.waitUntilDisplayed(filteredCardGroupPO.swimlanes[0]);
    await browser.waitUntilDisplayed(filteredCardGroupPO.byTimeRangeMeetingCardGroups[0]);
  });

  it("[PRPI-7335] The view should display a swimlane and a grid with all race links", async () => {
    expect(await filteredCardGroupPO.swimlanes.length).toBe(1);
    expect(await filteredCardGroupPO.byTimeRangeMeetingCardGroups.length).toBe(1);
  });

  it("[PRPI-7336] The 1st racelink on the swimlane should be 'Winner: Sense Of Worth @ 2/4' and the lollipop should not be visible on the viewport", async () => {
    expect(await firstRaceLinkPO.icons[0].isDisplayedInViewport()).toBe(false);
    expect(await firstRaceLinkPO.subtitle.getText()).toEqual("Winner: Sense Of Worth @ 2/4");
  });

  it("[PRPI-7337] The 2nd racelink on the swimlane should have a lollipop visible on the viewport and no title should be displayed", async () => {
    expect(await secondRaceLinkPO.icons[0].isDisplayedInViewport()).toBe(true);
    expect(await secondRaceLinkPO.subtitle.isDisplayedInViewport()).toBe(false);
  });

  it("[PRPI-5259]The 1st grid race link winner should be 'Sense Of Worth @ 2/4 (Fav)' and the lollipop should be visible on the viewport", async () => {
    expect(await firstMeetingCardRaceLinkPO.icons[0].isDisplayedInViewport()).toBe(true);
    expect(await firstMeetingCardRaceLinkPO.subtitle.getText()).toEqual("Winner: Sense Of Worth @ 2/4 (Fav)");
  });

  it("[PRPI-7338] the notification info should not be displayed", async () => {
    expect(await alertPO.element.isExisting()).toBe(false);
  });

  describe("when the user clicks on Countries filter", () => {
    beforeAll(async () => {
      await filterByPO.filters[0].click();
      await browser.waitUntilDisplayed(filterCriteriaPO.element);
    });

    it("[PRPI-7339] \u200Bthe pop-up should be displayed", async () => {
      expect(await filterCriteriaPO.element.isDisplayedInViewport()).toEqual(true);
    });

    it("[PRPI-7340] the title 'Countries' should be displayed", async () => {
      expect(await filterCriteriaPO.headerTitle.getText()).toEqual("Countries");
    });
  });

  describe("when the user selects some countries and click on apply", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getFilteredCardResults(COUNTRIES_FILTERED_CARD_MOCK));
      await optionListPO.itemInput[1].click();
      await optionListPO.itemInput[2].click();
      await filterCriteriaPO.applyButton.click();
      await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
      await browser.waitUntilEquals(swimlanePO.header, "Belterra 17th Jun");
    });

    it("[PRPI-7341] the pop-up should be closed", async () => {
      expect(await filterCriteriaPO.element.isDisplayedInViewport()).toBe(false);
    });

    it("[PRPI-7342] the events list should be updated", async () => {
      expect(await filteredCardGroupPO.swimlanes.length).toBe(1);
      expect(await filteredCardGroupPO.byTimeRangeMeetingCardGroups.length).toBe(0);
      expect(await swimlanePO.scrollItems.length).toBe(2);
      expect(await secondRaceLinkPO.raceText.getText()).toEqual("13:37");
    });
  });

  describe("when the user clicks on Reset option", () => {
    beforeEach(async () => {
      await mockService.mockHttpRequest(getFilteredCardResults(RESET_FILTERED_CARD_MOCK));
      await filterByPO.resetButton.scrollIntoView({ block: "center" });
      await browser.waitUntilInViewport(filterByPO.resetButton);
      await filterByPO.resetButton.click();
      await browser.waitUntilEquals(swimlanePO.header, "Belmont Park (US) 17th Jun");
    });

    it("[PRPI-7343] The view should update the event list with default values", async () => {
      expect(await filteredCardGroupPO.swimlanes.length).toBe(1);
      expect(await filteredCardGroupPO.byTimeRangeMeetingCardGroups.length).toBe(1);
      expect(await swimlanePO.scrollItems.length).toBe(5);
      expect(await secondRaceLinkPO.raceText.getText()).toEqual("20:38");
      expect(await byTimeRangeMeetingCardPO.gridItems.length).toBe(5);
      expect(await firstMeetingCardRaceLinkPO.raceText.getText()).toEqual("17:35");
    });
  });
});
