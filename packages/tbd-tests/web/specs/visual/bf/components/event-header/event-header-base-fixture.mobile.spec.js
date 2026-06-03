const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { EventHeaderPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const couponCardGroupPO = new CouponCardGroupPO();
const fixtureCardEventHeader = new EventHeaderPO();
const lastCoupon = couponCardGroupPO.eventCoupons[1];
const mockService = new MockService();
const EVENT_ID = "29465861";
const MODULE_NAME = "base-fixture";

const FIXTURE_CARD = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:29465861",
    away: "Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
    home: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
    sportevent: {
      name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
        name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
  },
};

const FIXTURE_CARD_SHORTER_NAME = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:29465861",
    away: "Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
    home: "Arsenal Lorem ipsum dolor",
    sportevent: {
      name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
        name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
  },
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    FIXTURE_CARD,
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
                  name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                    name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                  name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                    name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                sportevent: {
                  name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                    name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Team A 3 vs Team B 3",
                sportevent: {
                  name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                    name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
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
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
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
  ],
};

const BFF_MOCK_SHORTER_NAME = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: {
    eventId: EVENT_ID,
    name: "Ukraine v Portugal",
    competition: { urn: "ppb:competition:12345", name: "English Premier League" },
  },
  edges: [
    FIXTURE_CARD_SHORTER_NAME,
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
                  name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                    name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                  name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                    name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
              },
            },
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
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359899",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359896",
                title: "Team A 3 vs Team B 3",
                sportevent: {
                  name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                    name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359897",
                title: "Team A 3 vs Team B 3",
                sportevent: {
                  name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                    name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359898",
                title: "Team A 3 vs Team B 3",
                sportevent: {
                  name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                    name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359899",
                title: "Team A 3 vs Team B 3",
                sportevent: {
                  name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                    name: "Arsenal Lorem ipsum dolor v Chelsea Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor",
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
                eventViewLink: {
                  viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
                  viewUrl: routes.getEventViewUrl(EVENT_ID),
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
  ],
};

const SMP_MOCK = {
  markets: [],
};

describe("Event Header - Base Fixture", () => {
  describe("when the event name is longer than two lines", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { disableCSSAnimations: true }));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(fixtureCardEventHeader.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1595]_should_display_full_event_name`);
    });

    it("[PRPI-1595]_should_display_full_event_name", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1595]_should_display_full_event_name`)).toEqual(0);
    });

    describe("and then when scrolling and the event header becomes sticky", () => {
      beforeAll(async () => {
        await lastCoupon.scrollIntoView();
        await browser.waitUntilInViewport(lastCoupon, "last coupon not in viewport");

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1596]_should_display_event_name_with_ellipsis`);
      });

      it("[PRPI-1596]_should_display_event_name_with_ellipsis", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1596]_should_display_event_name_with_ellipsis`)).toEqual(
          0,
        );
      });
    });
  });

  describe("when the event name is sticky and shorter than two lines", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { disableCSSAnimations: true }));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK_SHORTER_NAME));
      await browser.url(routes.getEventViewUrl(EVENT_ID));
      await browser.waitUntilDisplayed(fixtureCardEventHeader.element);

      await lastCoupon.scrollIntoView();
      await browser.waitUntilInViewport(lastCoupon, "last coupon not in viewport");

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1597]_should_display_full_event_name_2_lines`);
    });

    it("[PRPI-1597]_should_display_full_event_name_2_lines", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1597]_should_display_full_event_name_2_lines`)).toEqual(0);
    });
  });
});
