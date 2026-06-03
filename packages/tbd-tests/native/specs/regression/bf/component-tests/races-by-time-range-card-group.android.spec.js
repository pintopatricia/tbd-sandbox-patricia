const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const FilteredSwimlaneSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredRacesByTimeRangeList/FilteredRacesByTimeRangeList.so");
const {
  getGenericLayout,
  getFilteredCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  FilterBySO,
  OptionListSO,
  PrimaryButtonSO,
  FilterCriteriaSO,
  RaceLinkSO,
  PebbleSO,
  ByTimeRangeMeetingCardGroupSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const filteredCouponCardGroupSO = new FilteredCouponCardGroupSO();
const filterBySO = new FilterBySO();
const swimlaneSO = new FilteredSwimlaneSO(filteredCouponCardGroupSO.swimlanes[0]);

const byTimeRangeMeetingCardSO = new ByTimeRangeMeetingCardGroupSO(
  filteredCouponCardGroupSO.byTimeRangeMeetingCardGroups[0],
);

const firstSwimlaneFirstRacelinkSO = new RaceLinkSO(swimlaneSO.racelinks[0]);
const firstSwimlaneSecondRacelinkSO = new RaceLinkSO(swimlaneSO.racelinks[1]);
const firstSwimlaneThirdRacelinkSO = new RaceLinkSO(swimlaneSO.racelinks[2]);

const firstMeetingCardRaceLinkSO = new RaceLinkSO(byTimeRangeMeetingCardSO.racelinks[0]);

const countriesPebbleSO = new PebbleSO(filterBySO.filters[0]);

const filterCriteriaSO = new FilterCriteriaSO();
const optionListSO = new OptionListSO();
const primaryButtonSO = new PrimaryButtonSO();

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

describe("When the user is on a Generic View with all daily races", () => {
  describe("When the user is on a Generic View with all races, and the second swimlane has 2 resulted races", () => {
    describe("And one race with associated promos", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
        const url = "view/amc-7";
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
        await browser.waitUntilDisplayed(genericScreenSO.element);
        await browser.waitUntilDisplayed(filteredCouponCardGroupSO.swimlanes[0]);
        await browser.waitUntilDisplayed(filteredCouponCardGroupSO.byTimeRangeMeetingCardGroups[0]);
      });

      it("[PRPI-2467] the view should display a swimlane and a grid with all race links", async () => {
        expect(await filteredCouponCardGroupSO.swimlanes.length).toBe(1);
        expect(await filteredCouponCardGroupSO.byTimeRangeMeetingCardGroups.length).toBe(1);
      });

      it("[PRPI-2468] the swimlane's tittle should be 'Belmont Park (US) 17th Jun'", async () => {
        expect(await swimlaneSO.title.getText()).toBe("Belmont Park (US) 17th Jun");
      });

      it("[PRPI-2469] the 2nd swimlane racelinks should have the correct race time", async () => {
        expect(await firstSwimlaneSecondRacelinkSO.raceTitle.getText()).toBe("20:38");
      });
      it("[PRPI-2470] the 1st swimlane race link shouldn't be visible", async () => {
        expect(await firstSwimlaneFirstRacelinkSO.raceTitle.isDisplayed()).toBe(false);
        expect(await firstSwimlaneFirstRacelinkSO.icons.length).toBe(0);
      });

      it("[PRPI-2471] the 2nd swimlane race link should have a lollipop visible on the viewport", async () => {
        expect(await firstSwimlaneSecondRacelinkSO.icons[0].isDisplayed()).toBe(true);
      });

      it("[PRPI-2472] the 3rd swimlane race link should have money back icon visible on the view port", async () => {
        expect(await firstSwimlaneThirdRacelinkSO.icons[0].isDisplayed()).toBe(true);
      });

      it("[PRPI-2473] the first grid's race link card should have the correct time", async () => {
        expect(await firstMeetingCardRaceLinkSO.raceTitle.getText()).toBe("17:35");
      });

      it("[PRPI-2474] the 1st grid race link winner should be 'Sense Of Worth @ 10 (Fav)' and the lollipop should be visible on the viewport", async () => {
        expect(await firstMeetingCardRaceLinkSO.icons[0].isDisplayed()).toBe(true);
        expect(await firstMeetingCardRaceLinkSO.subtitle.getText()).toEqual("Winner: Sense Of Worth @\u00A010 (Fav)");
      });

      it("[PRPI-2475] the country filter and the reset button should be displayed", async () => {
        expect(await countriesPebbleSO.title.getText()).toBe("Countries");
        expect(await filterBySO.resetButton.getText()).toBe("Reset");
      });
    });
  });

  describe("When the user clicks Countries filter", () => {
    beforeAll(async () => {
      await countriesPebbleSO.element.click();
      await browser.waitUntilDisplayed(filterCriteriaSO.element);
    });

    it("[PRPI-2476] The pop-up should be displayed", async () => {
      expect(await filterCriteriaSO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2477] The title 'Countries' should be displayed.", async () => {
      expect(await filterCriteriaSO.headerTitle.getText()).toEqual("Countries");
    });

    it("[PRPI-2478] Should have competition options", async () => {
      expect(await optionListSO.optionsText.length).toEqual(3);
      expect(await optionListSO.optionsText[0].getText()).toEqual("USA");
      expect(await optionListSO.optionsText[1].getText()).toEqual("Portugal");
      expect(await optionListSO.optionsText[2].getText()).toEqual("Spain");
    });

    describe("When user selects a country option", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredCardResults(COUNTRIES_FILTERED_CARD_MOCK));
        await optionListSO.options[1].click();
        await browser.waitUntil(async () => (await optionListSO.options[1].getAttribute("selected")) === "true");
        await primaryButtonSO.element.click();
        await browser.waitUntilDisplayed(swimlaneSO.title);
        await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
      });

      it("[PRPI-2479] the pop-up should be closed", async () => {
        expect(await filterCriteriaSO.element.isDisplayed()).toEqual(false);
      });

      it("[PRPI-2480] the events list should be updated", async () => {
        expect(await swimlaneSO.title.getText()).toBe("Belterra 17th Jun");
        expect(await filteredCouponCardGroupSO.swimlanes.length).toBe(1);
        expect(await filteredCouponCardGroupSO.byTimeRangeMeetingCardGroups.length).toBe(0);
      });
    });
  });
});
