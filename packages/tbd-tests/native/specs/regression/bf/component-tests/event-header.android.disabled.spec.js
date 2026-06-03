const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeUp, swipeDownElement } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const { ScrollableSwimlaneSO, EventHeaderSO } = require("../../../../screen-objects");

const mockService = new MockService();

const scrollableSwimlaneSO = new ScrollableSwimlaneSO();
const couponCardGroupSO = new FilteredCouponCardGroupSO();
const fixtureCardEventHeader = new EventHeaderSO();

const cardGroupEventHeader = new EventHeaderSO(scrollableSwimlaneSO.element);

const EVENT_ID = "29682729";
const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcher",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
        sport: {
          __typename: "Sport",
          urn: "ppb:eventType:1",
          name: "Football",
          sportId: 1,
        },
      },
    },
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29682729",
        away: "Chelsea",
        home: "Arsenal",
        sportevent: {
          name: "Arsenal v Chelsea",
          openDate: "2010-11-22T18:45:00Z",
          urn: "ppb:event:29682729",
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
            openDate: "2010-11-22T18:45:00Z",
            urn: "ppb:event:29682729",
            __typename: "SportsEvent",
            competition: {
              urn: "ppb:competition:12345",
              name: "English Premier League",
            },
          },
          mainMarket: {},
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
                  name: "Arsenal v Chelsea",
                  openDate: "2010-11-22T18:45:00Z",
                  urn: "ppb:event:296827291",
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
                    openDate: "2010-11-22T18:45:00Z",
                    urn: "ppb:event:296827291",
                    __typename: "SportsEvent",
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
      },
    },
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
        filteredCouponTitle: "What is on Today",
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:39999999`,
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:${29999999}`,
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:29999921`,
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:29999922`,
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:29999923`,
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:39999999`,
                title: "Man Utd vs Wolves",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:39999999`,
                  viewUrl: `/event/39999999`,
                },
                sportevent: {
                  name: "Wolves v Man Utd",
                  openDate: "2010-11-22T18:45:00Z",
                  urn: "ppb:event:39999999",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    name: "Wolves v Man Utd",
                    openDate: "2010-11-22T18:45:00Z",
                    urn: "ppb:event:39999999",
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
                      urn: "ppb:sbkMarket:924.193270252",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Wolves v Man Utd",
                          urn: `ppb:event:39999999`,
                        },
                        competition: {
                          urn: "ppb:competition:1234561",
                          name: "First Competition Name",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                          name: "Wolves",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 48351,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 58805,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:29999999`,
                title: "Man Utd vs Sporting",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:29999999`,
                  viewUrl: `/event/29999999`,
                },
                sportevent: {
                  name: "Man Utd vs Sporting",
                  openDate: "2010-11-22T18:45:00Z",
                  urn: "ppb:event:29999999",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    name: "Man Utd vs Sporting",
                    openDate: "2010-11-22T18:45:00Z",
                    urn: "ppb:event:29999999",
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
                      urn: "ppb:sbkMarket:924.222222222",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:29999999`,
                        },
                        competition: {
                          urn: "ppb:competition:1234562",
                          name: "Second Competition Name",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/33333",
                          selectionId: 33333,
                          name: "Sporting",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/22222",
                          selectionId: 22222,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/55555",
                          selectionId: 55555,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1111111/33333" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/22222" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/55555" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:29999921`,
                title: "Man Utd vs Sporting",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:29999921`,
                  viewUrl: `/event/29999921`,
                },
                sportevent: {
                  name: "Man Utd vs Sporting",
                  openDate: "2010-11-22T18:45:00Z",
                  urn: "ppb:event:29999921",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    name: "Man Utd vs Sporting",
                    openDate: "2010-11-22T18:45:00Z",
                    urn: "ppb:event:29999921",
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
                      urn: "ppb:sbkMarket:924.222222222",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:29999921`,
                        },
                        competition: {
                          urn: "ppb:competition:1234562",
                          name: "Second Competition Name",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/33333",
                          selectionId: 33333,
                          name: "Sporting",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/22222",
                          selectionId: 22222,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/55555",
                          selectionId: 55555,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1111111/33333" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/22222" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/55555" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:29999922`,
                title: "Man Utd vs Sporting",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:29999922`,
                  viewUrl: `/event/29999922`,
                },
                sportevent: {
                  name: "Man Utd vs Sporting",
                  openDate: "2010-11-22T18:45:00Z",
                  urn: "ppb:event:29999922",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    name: "Man Utd vs Sporting",
                    openDate: "2010-11-22T18:45:00Z",
                    urn: "ppb:event:29999922",
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
                      urn: "ppb:sbkMarket:924.222222222",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:29999922`,
                        },
                        competition: {
                          urn: "ppb:competition:1234562",
                          name: "Second Competition Name",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/33333",
                          selectionId: 33333,
                          name: "Sporting",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/22222",
                          selectionId: 22222,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/55555",
                          selectionId: 55555,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1111111/33333" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/22222" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/55555" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: `ppb:tbd:card:eventPrimaryMarket:29999923`,
                title: "Man Utd vs Sporting",
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:29999923`,
                  viewUrl: `/event/29999923`,
                },
                sportevent: {
                  name: "Man Utd vs Sporting",
                  openDate: "2010-11-22T18:45:00Z",
                  urn: "ppb:event:29999923",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12345",
                    name: "English Premier League",
                  },
                },
                fixture: {
                  __typename: "BaseFixture",
                  sportevent: {
                    name: "Man Utd vs Sporting",
                    openDate: "2010-11-22T18:45:00Z",
                    urn: "ppb:event:29999923",
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
                      urn: "ppb:sbkMarket:924.222222222",
                      noLiveData: true,
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          name: "Sporting v Man Utd",
                          urn: `ppb:event:29999923`,
                        },
                        competition: {
                          urn: "ppb:competition:1234562",
                          name: "Second Competition Name",
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/33333",
                          selectionId: 33333,
                          name: "Sporting",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/22222",
                          selectionId: 22222,
                          name: "Man Utd",
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.1111111/55555",
                          selectionId: 55555,
                          name: "The Draw",
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.1111111/33333" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/22222" },
                      { runnerURN: "ppb:sbkRunner:924.1111111/55555" },
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
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcher",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
      },
    },

    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture:29682729",
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
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
  ],
};

const iosDate = "November 22 at 18:45";
const androidDate = "November 22, 18:45";

describe("Event Header", () => {
  describe("When the user is at a given screen and a Fixture Header is retrieved without SCA info", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices({ markets: [] }));
      const url = `sport/competition/event/e-${EVENT_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilEquals(fixtureCardEventHeader.tertiaryTitle, "English Premier League");
    });

    it("[PRPI-1928] The competition name should be visible", async () => {
      expect(await fixtureCardEventHeader.tertiaryTitle.getText()).toBe("English Premier League");
    });

    it("[PRPI-1929] The event start date and time should be visible", async () => {
      expect(await [iosDate, androidDate]).toContain(iosDate);
    });

    it("[PRPI-1930] The Event name should be visible", async () => {
      expect(await fixtureCardEventHeader.title.getText()).toBe("Arsenal v Chelsea");
    });

    describe("When the user scrolls down", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(couponCardGroupSO.element);

        await swipeUp();

        await browser.waitUntilNotDisplayed(fixtureCardEventHeader.tertiaryTitle);
      });

      it("[PRPI-1931] The competition name should not be visible", async () => {
        expect(await fixtureCardEventHeader.tertiaryTitle.isDisplayed()).toBe(false);
      });

      it("[PRPI-1932] The event start date and time should be visible", async () => {
        expect(await [iosDate, androidDate]).toContain(iosDate);
      });

      it("[PRPI-1933] The Event name should be visible", async () => {
        expect(await fixtureCardEventHeader.title.getText()).toBe("Arsenal v Chelsea");
      });

      describe("When the user scrolls till the first eventMarketCard swimlane again", () => {
        beforeAll(async () => {
          await swipeDownElement(couponCardGroupSO.title);
          await swipeDownElement(cardGroupEventHeader.element);
          await browser.waitUntilEquals(cardGroupEventHeader.tertiaryTitle, "English Premier League");
        });

        it("[PRPI-1934] The competition name should be visible", async () => {
          expect(await cardGroupEventHeader.tertiaryTitle.getText()).toBe("English Premier League");
        });

        it("[PRPI-1935] The event start date and time should be visible", async () => {
          expect(await [iosDate, androidDate]).toContain(iosDate);
        });

        it("[PRPI-1936] The Event name should be visible", async () => {
          expect(await cardGroupEventHeader.title.getText()).toBe("Arsenal v Chelsea");
        });
      });
    });
  });
});
