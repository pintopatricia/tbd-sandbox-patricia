const {
  ScrollableSwimlanePO,
  EventHeaderPO,
  AvBFixturePO,
  TeamsPO,
  DurationPO,
  GenericSwitcherCardPO,
} = require("../../../../../page-objects");
const FilteredCouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportSwitcherPO = new GenericSwitcherCardPO();
const scrollableSwimlanePO = new ScrollableSwimlanePO();
const couponCardGroupPO = new FilteredCouponCardGroupPO();
const fixtureCardEventHeader = new EventHeaderPO();
const fixtureCardAVBFixtureHeader = new AvBFixturePO(fixtureCardEventHeader.avbFixture);
const cardGroupEventHeader = new EventHeaderPO(scrollableSwimlanePO.scrollItems[0]);
const cardGroupAVBFixtureEventHeader = new AvBFixturePO(cardGroupEventHeader.avbFixture);
const couponCardGroupEventHeader = new EventHeaderPO(couponCardGroupPO.eventCoupons[0]);
const teamsPO = new TeamsPO(couponCardGroupPO.eventCoupons[0]);
const durationPO = new DurationPO(couponCardGroupPO.eventCoupons[0]);
const lastCoupon = couponCardGroupPO.eventCoupons[1];

const mockService = new MockService();

const EVENT_ID = "29465861";

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: {
      urn: "ppb:competition:12345",
      name: "English Premier League",
    },
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:7",
        selectedViewLink: {
          label: "Horse Racing",
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:7",
            viewUrl: "horse-racing/s-7",
          },
        },
        headerTheming: null,
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29465861",
        away: "Chelsea",
        home: "Arsenal",
        fixture: {
          __typename: "BaseFixture",
          sportevent: {
            name: "Arsenal v Chelsea",
            openDate: "2010-10-14T18:45Z",
            urn: "ppb:event:29465861",
            __typename: "SportsEvent",
            competition: {
              urn: "ppb:competition:12345",
              name: "English Premier League",
            },
          },
          mainMarket: {},
        },
        sportevent: {
          name: "Arsenal v Chelsea",
          openDate: "2010-10-14T18:45Z",
          urn: "ppb:event:29465861",
          __typename: "SportsEvent",
          competition: {
            urn: "ppb:competition:12345",
            name: "English Premier League",
          },
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
        cardGroupTitle: "League 3",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:29465861",
                  name: "Arsenal v Chelsea",
                  openDate: "2010-10-14T18:45Z",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:29465861",
                    name: "Arsenal v Chelsea",
                    openDate: "2010-10-14T18:45Z",
                    competition: {
                      urn: "ppb:competition:12345",
                      name: "English Premier League",
                    },
                  },
                  mainMarket: {},
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/1" },
                      { runnerURN: "ppb:sbkRunner:924.3/2" },
                      { runnerURN: "ppb:sbkRunner:924.3/3" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Team A 3 vs Team B 3",
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:29465861",
                  name: "Arsenal v Chelsea",
                  openDate: "2010-10-14T18:45Z",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:29465861",
                    name: "Arsenal v Chelsea",
                    openDate: "2010-10-14T18:45Z",
                    competition: {
                      urn: "ppb:competition:12345",
                      name: "English Premier League",
                    },
                  },
                  mainMarket: {},
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team A 3",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/1" },
                      { runnerURN: "ppb:sbkRunner:924.3/2" },
                      { runnerURN: "ppb:sbkRunner:924.3/3" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        filteredCouponTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        has90Min: false,
        filterOptions: {
          sortOption: {
            defaultOption: "RANK",
            availableOptions: ["RANK", "TIME"],
          },
          dateRangeFilter: {},
          marketTypeFilter: {},
          competitionsFilter: {},
        },
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:29359897`,
                  viewUrl: routes.getEventViewUrl("29359897"),
                },
                sportevent: {
                  name: "Arsenal v Chelsea",
                  openDate: "2010-10-14T18:45Z",
                  urn: "ppb:event:29465861",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    name: "Arsenal v Chelsea",
                    openDate: "2010-10-14T18:45Z",
                    urn: "ppb:event:29465861",
                    __typename: "SportsEvent",
                    competition: {
                      urn: "ppb:competition:12345",
                      name: "English Premier League",
                    },
                  },
                  mainMarket: { sportsbook: { urn: "ppb:sbkMarket:924.3" } },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team A 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/1" },
                      { runnerURN: "ppb:sbkRunner:924.3/2" },
                      { runnerURN: "ppb:sbkRunner:924.3/3" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Team A 3 vs Team B 3",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:29359898`,
                  viewUrl: routes.getEventViewUrl("29359898"),
                },
                sportevent: {
                  name: "Arsenal v Chelsea",
                  openDate: "2010-10-14T18:45Z",
                  urn: "ppb:event:29465861",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    name: "Arsenal v Chelsea",
                    openDate: "2010-10-14T18:45Z",
                    urn: "ppb:event:29465861",
                    __typename: "SportsEvent",
                    competition: {
                      urn: "ppb:competition:12345",
                      name: "English Premier League",
                    },
                  },
                  mainMarket: { sportsbook: { urn: "ppb:sbkMarket:924.3" } },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.3",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          name: "Team B 3 v Team A 3",
                          urn: "ppb:event:29359897",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.3/1",
                          selectionId: 1,
                          name: "Team B 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/3",
                          selectionId: 3,
                          name: "Team A 3",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.3/2",
                          selectionId: 2,
                          name: "Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.3/1" },
                      { runnerURN: "ppb:sbkRunner:924.3/2" },
                      { runnerURN: "ppb:sbkRunner:924.3/3" },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
            items: [
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Text Item on Footer.",
              },
              {
                __typename: "RegulatoryLinkItem",
                alignment: "LEFT",
                text: "Gambling can be addictive, please play responsibly",
                url: "http://responsiblegambling.betfair.com/",
                target: "BLANK",
              },
            ],
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:7",
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29465861",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:3",
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
    },
  ],
};

describe("Event Header", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(fixtureCardEventHeader.element);
  });

  describe("When the user is at a given page and a Fixture Header is retrieved without SCA info", () => {
    it("[PRPI-5712] The competition name should be visible", async () => {
      expect(await fixtureCardAVBFixtureHeader.avbFixtureTitle.getText()).toBe("English Premier League");
    });

    it("[PRPI-5713] The event start date and time should be visible", async () => {
      expect(await fixtureCardEventHeader.subtitle.getText()).toBe("Oct 14, 19:45");
    });

    it("[PRPI-5714] The Event name should be visible", async () => {
      expect(await fixtureCardEventHeader.title.getText()).toBe("Arsenal v Chelsea");
    });
  });

  describe("When the user scrolls down", () => {
    beforeAll(async () => {
      await lastCoupon.scrollIntoView();
      await browser.waitUntilInViewport(lastCoupon, "last coupon not in viewport");
    });

    it("[PRPI-5715] The competition name should not be visible", async () => {
      expect(await fixtureCardAVBFixtureHeader.element.isExisting()).toBe(false);
    });

    it("[PRPI-5716] The event start date and time should be visible", async () => {
      expect(await fixtureCardEventHeader.subtitle.getText()).toBe("Oct 14, 19:45");
    });

    it("[PRPI-5717] The Event name should be visible", async () => {
      expect(await fixtureCardEventHeader.title.getText()).toBe("Arsenal v Chelsea");
    });
  });

  describe("When the user scrolls till the first eventMarketCard swimlane", () => {
    beforeAll(async () => {
      await cardGroupEventHeader.element.scrollIntoView();
      await browser.waitUntilInViewport(cardGroupEventHeader.element, "first EventMarketCard swimlane not in viewport");
    });

    it("[PRPI-5718] The competition name should be visible", async () => {
      expect(await cardGroupAVBFixtureEventHeader.avbFixtureTitle.getText()).toBe("English Premier League");
    });
    it("[PRPI-5719] The event start date and time should be visible", async () => {
      expect(await cardGroupEventHeader.subtitle.getText()).toBe("Oct 14, 19:45");
    });

    it("[PRPI-5720] The Event name should be visible", async () => {
      expect(await cardGroupEventHeader.title.getText()).toBe("Arsenal v Chelsea");
    });
  });

  describe("When the user scrolls again till the coupon swimlane (cardgroup)", () => {
    beforeAll(async () => {
      await couponCardGroupEventHeader.element.scrollIntoView();
      await browser.waitUntilInViewport(couponCardGroupEventHeader.element, "coupon swimlane not in viewport");
    });

    it("[PRPI-5721] The event start date and time should be visible", async () => {
      expect(await durationPO.datetime.getText()).toBe("Oct 14\n19:45");
    });

    it("[PRPI-5722] The first team name should be visible", async () => {
      expect(await teamsPO.firstTeam.getText()).toBe("Team B 3");
    });

    it("[PRPI-5723] The second team name should be visible", async () => {
      expect(await teamsPO.secondTeam.getText()).toBe("Team A 3");
    });
  });

  describe("When the user scrolls to the top of the page", () => {
    beforeAll(async () => {
      await browser.execute(() => window.scrollTo(0, 0));
      await sportSwitcherPO.element.scrollIntoView(false);
      await browser.waitUntil(async () => await fixtureCardAVBFixtureHeader.avbFixtureTitle.isDisplayedInViewport(), {
        timeout: 1000,
        timeoutMsg: "Fixture header title not in viewport after scrolling to top",
      });
    });

    it("[PRPI-5724] The competition name should be visible", async () => {
      expect(await fixtureCardAVBFixtureHeader.avbFixtureTitle.getText()).toBe("English Premier League");
    });

    it("[PRPI-5725] The event start date and time should be visible", async () => {
      expect(await fixtureCardEventHeader.subtitle.getText()).toBe("Oct 14, 19:45");
    });

    it("[PRPI-5726] The Event name should be visible", async () => {
      expect(await fixtureCardEventHeader.title.getText()).toBe("Arsenal v Chelsea");
    });
  });
});
