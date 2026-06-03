const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const COMPETITION_MOCK = (id, name, sportId, sportName) => ({
  __typename: "Competition",
  urn: `ppb:competition:${id}`,
  name,
  competitionId: id,
  sport: {
    __typename: "Sport",
    urn: `ppb:eventType:${sportId}`,
    name: sportName,
    sportId,
  },
});

const BASKETBALL_FIXTURE = {
  id: 29359898,
  periodClock: "UNKNOWN_PERIOD",
  timeElapsedClock: 100,
  timeRemainingClock: 0,
  periodScores: [
    {
      score: { home: 13, away: 20 },
      period: "PERIOD_1",
      segment: null,
    },
    {
      score: { home: 26, away: 32 },
      period: "PERIOD_2",
      segment: null,
    },
    {
      score: { home: 20, away: 27 },
      period: "PERIOD_3",
      segment: null,
    },
    {
      score: { home: 21, away: 26 },
      period: "PERIOD_4",
      segment: null,
    },
  ],

  homeScore: 80,
  awayScore: 105,
};

const SCA_IN_RUNNING_MOCK = {
  match: [
    {
      id: 29359899,
      matchStatus: {
        status: "IN_RUNNING",
        reason: null,
      },
      teamAScore: "2",
      teamBScore: "3",
      currentSet: {
        teamAScore: "15",
        teamBScore: "0",
        currentGame: {
          teamAScore: "15",
          teamBScore: "30",
          teamServing: "HOME",
          type: "NORMAL",
        },
      },
    },
  ],
};

const SCA_TENNIS = {
  match: [
    {
      ...SCA_IN_RUNNING_MOCK.match[0],
      matchStatus: {
        status: "INTERRUPTED",
        reason: "RAIN_DELAY",
      },
      currentSet: {
        ...SCA_IN_RUNNING_MOCK.match[0].currentSet,
        currentGame: {
          ...SCA_IN_RUNNING_MOCK.match[0].currentSet.currentGame,
          teamAScore: "30",
          teamServing: "AWAY",
        },
      },
    },
  ],
};

const SCA_BASKETBALL = {
  fixture: [{ ...BASKETBALL_FIXTURE, periodClock: "END_PERIOD_2", segmentClock: "Q2", timeElapsedClock: 600 }],
};

const SCA_TABLE_TENNIS = {
  tableTennisFixture: [
    {
      urn: `ppb:fixture:${98765432}`,
      id: 98765432,
      currentSet: {
        currentServer: "AWAY",
        number: 5,
        tableTennisScore: { away: 10, home: 10 },
      },
      previousSets: [
        {
          number: 4,
          tableTennisScore: { away: 2, home: 8 },
        },
        {
          number: 3,
          tableTennisScore: { away: 8, home: 6 },
        },
        {
          number: 2,
          tableTennisScore: { away: 11, home: 8 },
        },
        {
          number: 1,
          tableTennisScore: { away: 9, home: 11 },
        },
      ],

      setsWon: { away: 2, home: 2 },
    },
  ],
};

const TENNIS_MOCK = {
  id: 29359899,
  fixture: {
    __typename: "TennisMatch",
    id: 29359899,
    urn: "ppb:fixture:29359899",
    runnerNames: {
      home: "Meera Jesudason",
      away: "Monique Woog",
    },
    matchStatus: {
      status: "INTERRUPTED",
      reason: null,
    },
    type: "SINGLES",
    teamA: {
      players: [
        {
          name: "Meera Jesudason",
          rank: 1,
        },
      ],

      side: "HOME",
    },
    teamB: {
      players: [
        {
          name: "Monique Woog",
          rank: 2,
        },
      ],

      side: "AWAY",
    },
  },
  competition: COMPETITION_MOCK(230, "Tennis View Interrupted", 2, "Tennis"),
};

const FOOTBALL_MOCK = {
  id: 29359897,
  fixture: {
    urn: `ppb:fixture:29359897`,
    id: 29359897,
    home: {
      name: "Real Madrid",
    },
    away: {
      name: "Barcelona",
    },
    duration: {
      period: "REGULAR",
      status: "PRE_MATCH",
      clock: null,
    },
    penaltyShootout: null,
  },
  competition: COMPETITION_MOCK(228, "Football Pre Play", 1, "Football"),
};

const FOOTBALL_MOCK_HALF_TIME = {
  id: 29359903,
  fixture: {
    urn: `ppb:fixture:29359903`,
    id: 29359903,
    home: {
      name: "Real Madrid",
    },
    away: {
      name: "Barcelona",
    },
    score: { home: 2, away: 2 },
    duration: {
      period: "REGULAR",
      status: "HALF",
      clock: {
        minute: 45,
        second: 0,
      },
    },
    penaltyShootout: null,
  },
  competition: COMPETITION_MOCK(233, "Football Half Time", 1, "Football"),
};

const BASKETBALL_MOCK = {
  id: 29359898,
  fixture: {
    __typename: "BasketballFixture",
    urn: "ppb:fixture:29359898",
    ...BASKETBALL_FIXTURE,
  },
  competition: COMPETITION_MOCK(229, "Basketball Half Time", 7522, "Basketball"),
};

const TABLE_TENNIS_MOCK = {
  id: 98765432,
  competition: COMPETITION_MOCK(231, "Table Tennis Full Time", 2593174, "Table Tennis"),
  fixture: {
    __typename: "TableTennisFixture",
    urn: `ppb:fixture:${98765432}`,
    id: 98765432,
    currentSet: {
      currentServer: "AWAY",
      number: 5,
      tableTennisScore: { away: 10, home: 10 },
    },
    previousSets: [
      {
        number: 4,
        tableTennisScore: { away: 2, home: 8 },
      },
      {
        number: 3,
        tableTennisScore: { away: 8, home: 6 },
      },
      {
        number: 2,
        tableTennisScore: { away: 11, home: 8 },
      },
      {
        number: 1,
        tableTennisScore: { away: 9, home: 11 },
      },
    ],

    setsWon: { away: 2, home: 2 },
  },
};

const EVENT_MARKET_CARD_MOCK = ({ id, competition, fixture }) => ({
  __typename: "EventMarketCard",
  urn: `ppb:tbd:card:eventPrimaryMarket:${id}`,
  title: "Real Madrid vs Barcelona",
  eventViewLink: {
    viewUrn: `ppb:tbd:view:event:${id}`,
    viewUrl: `football/portuguese-primeira-liga/braga-v-pacos-ferreira/e-${id}`,
  },
  fixture,
  sportevent: {
    name: "Real Madrid vs Barcelona",
    urn: `ppb:event:${id}`,
    __typename: "SportsEvent",
    eventId: id,
    competition,
  },
  videoAvailable: true,
  displayRunners: {
    exchange: null,
    sportsbook: {
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:924.193270252",
        noLiveData: true,
        name: "Match Odds",
        hierarchy: {
          __typename: "EventCompetitionHierarchy",
          sportevent: {
            __typename: "SportsEvent",
            name: "Real Madrid vs Barcelona",
            openDate: "2077-01-16T20:00:00Z",
            urn: `ppb:event:98765432`,
            competition: {
              urn: "ppb:competition:12345",
              name: "English Premier League",
              sport: { __typename: "Sport", urn: "ppb:eventType:2593174", name: "Table Tennis", sportId: 2593174 },
            },
          },
          competition: {
            urn: "ppb:competition:12345",
            name: "English Premier League",
            sport: { __typename: "Sport", urn: "ppb:eventType:2593174", name: "Table Tennis", sportId: 2593174 },
          },
        },
        runners: [
          { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
          { runnerURN: "ppb:sbkRunner:924.193270252/48352" },
        ],
      },
      runners: [{ runnerURN: "ppb:sbkRunner:924.193270252/48351" }, { runnerURN: "ppb:sbkRunner:924.193270252/48352" }],
    },
  },
});

const BFF_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        filteredCouponTitle: "Signposting Coupon",
        partials: {
          partialEdges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:x/s/1|228",
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
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:x/s/1|229",
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
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:x/s/1|230",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359899",
              },
            },
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:x/s/1|231",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:98765432",
              },
            },
            {
              node: {
                __typename: "CouponHeaderCard",
                urn: "ppb:tbd:card:couponheader:x/s/1|233",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359903",
              },
            },
          ],
        },
        defaultMarketTab: "Sportsbook",
        full: {
          edges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                columns: ["YES", "NO"],
                urn: "ppb:tbd:card:couponheader:x/s/1|228",
                competition: COMPETITION_MOCK(228, "Football Pre Play", 1, "Football"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(FOOTBALL_MOCK),
            },
            {
              node: {
                __typename: "CouponHeaderCard",
                columns: ["YES", "NO"],
                urn: "ppb:tbd:card:couponheader:x/s/1|229",
                competition: COMPETITION_MOCK(229, "Basketball Half Time", 7522, "Basketball"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(BASKETBALL_MOCK),
            },
            {
              node: {
                __typename: "CouponHeaderCard",
                columns: ["YES", "NO"],
                urn: "ppb:tbd:card:couponheader:x/s/1|230",
                competition: COMPETITION_MOCK(230, "Tennis View Interrupted", 2, "Tennis"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(TENNIS_MOCK),
            },
            {
              node: {
                __typename: "CouponHeaderCard",
                columns: ["YES", "NO"],
                urn: "ppb:tbd:card:couponheader:x/s/1|231",
                competition: COMPETITION_MOCK(231, "Table Tennis Full Time", 2593174, "Table Tennis"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(TABLE_TENNIS_MOCK),
            },
            {
              node: {
                __typename: "CouponHeaderCard",
                columns: ["YES", "NO"],
                urn: "ppb:tbd:card:couponheader:x/s/1|233",
                competition: COMPETITION_MOCK(233, "Football Half Time", 1, "Football"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(FOOTBALL_MOCK_HALF_TIME),
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
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const MODULE_NAME = "signposting_list_view";

describe("when user navigates to a page with a coupon list view with live video", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getScaResponse({ ...SCA_BASKETBALL, ...SCA_TABLE_TENNIS, ...SCA_TENNIS }));
    await browser.url(routes.getSportViewUrl(1));
    await browser.waitUntilImageEquals(`${MODULE_NAME}__[PRPI-1283]_signposting_icon_should_be_displayed`);
  });

  it("[PRPI-1283]_signposting_icon_should_be_displayed", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}__[PRPI-1283]_signposting_icon_should_be_displayed`)).toBe(0);
  });
});
