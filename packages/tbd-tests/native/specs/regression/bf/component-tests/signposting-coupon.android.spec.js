const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const CouponSO = require("@ppb/tbd-shared/components/Coupon/Coupon.so");
const { InlineSportsbookMarketSO, GenericScreenSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const MockService = require("../../../../mock-essentials/mocking-service");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const eventMarketsCardCouponSO = new FilteredCouponCardGroupSO();
const footballCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[0]);
const basketballCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[1]);
const tennisCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[2]);
const tableTennisCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[3]);
const cricketCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[4]);
const iceHockeyCoupon = new CouponSO(eventMarketsCardCouponSO.coupons[5]);
const inlineSportsbookMarketSO = new InlineSportsbookMarketSO(footballCoupon.element);

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

const ICE_HOCKEY_FIXTURE = {
  id: 34967318,
  periodClock: "PERIOD_1",
  periodScores: [
    {
      score: { home: 3, away: 2 },
      period: "PERIOD_1",
    },
    {
      score: { home: 6, away: 2 },
      period: "PERIOD_2",
    },
    {
      score: { home: 0, away: 2 },
      period: "PERIOD_3",
    },
  ],

  homeScore: 8,
  awayScore: 5,
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

const SCA_CRICKET = {
  cricketFixture: [
    {
      currentTeamBatting: "AWAY",
      currentTime: {
        inning: 2,
      },
      cricketScore: {
        home: [
          {
            inningNumber: 1,
            runs: 150,
            wickets: 1,
          },
          {
            inningNumber: 2,
            runs: 250,
            wickets: 3,
          },
        ],

        away: [
          {
            inningNumber: 1,
            runs: 340,
            wickets: 2,
          },
          {
            inningNumber: 2,
            runs: 240,
            wickets: 4,
          },
        ],
      },
      urn: "ppb:fixture:31950699",
      id: 31951560,
    },
  ],
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

const SCA_ICE_HOCKEY = {
  fixture: [{ ...ICE_HOCKEY_FIXTURE, periodClock: "END_PERIOD_2" }],
};

const TENNIS_MOCK = {
  id: 29359899,
  fixture: {
    __typename: "TennisMatch",
    id: 29359899,
    urn: "ppb:fixture:29359899",
    runnerNames: {
      home: "Jesudason",
      away: "Woog",
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

const CRICKET_MOCK = {
  id: 31950699,
  fixture: {
    __typename: "CricketFixture",
    id: 31950699,
    urn: "ppb:fixture:31950699",
    cricketScore: {
      home: [
        {
          runs: 271,
          wickets: 7,
          inningNumber: 1,
        },
      ],

      away: [
        {
          runs: 74,
          wickets: 4,
          inningNumber: 1,
        },
      ],
    },
    currentTeamBatting: "AWAY",
    currentTime: {
      inning: 1,
      over: null,
    },
  },
  competition: COMPETITION_MOCK(232, "Cricket In Play", 4, "Cricket"),
};

const ICE_HOCKEY_MOCK = {
  id: 34967318,
  fixture: {
    __typename: "IceHockeyFixture",
    urn: "ppb:fixture:34967318",
    ...ICE_HOCKEY_FIXTURE,
  },
  competition: COMPETITION_MOCK(233, "Ice Hockey In Play", 7524, "Ice Hockey"),
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
          { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
        ],
      },
      runners: [{ runnerURN: "ppb:sbkRunner:924.193270252/48351" }, { runnerURN: "ppb:sbkRunner:924.193270252/48351" }],
    },
  },
});

const BFF_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
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
                urn: "ppb:tbd:card:couponheader:x/s/1|232",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:31950699",
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
                urn: "ppb:tbd:card:eventPrimaryMarket:34967318",
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
                urn: "ppb:tbd:card:couponheader:x/s/1|232",
                competition: COMPETITION_MOCK(232, "Cricket In Play", 4, "Cricket"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(CRICKET_MOCK),
            },
            {
              node: {
                __typename: "CouponHeaderCard",
                columns: ["YES", "NO"],
                urn: "ppb:tbd:card:couponheader:x/s/1|233",
                competition: COMPETITION_MOCK(233, "Ice Hockey In Play", 7524, "Ice Hockey"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(ICE_HOCKEY_MOCK),
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
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
  ],
};

describe("Native Coupons", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(
      getScaResponse({ ...SCA_TABLE_TENNIS, ...SCA_BASKETBALL, ...SCA_CRICKET, ...SCA_TENNIS, ...SCA_ICE_HOCKEY }),
    );
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);
    await browser.waitUntilDisplayed(footballCoupon.element);
  });

  describe("When the user is on a Generic View with coupons", () => {
    it("[PRPI-2632] the sportsbook tab should be activated", async () => {
      expect(await inlineSportsbookMarketSO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2633] the title of the coupon should be displayed", async () => {
      expect(await eventMarketsCardCouponSO.title.getText()).toEqual("Signposting Coupon");
    });

    it("[PRPI-2634] the live video icon of the football coupon should be displayed", async () => {
      expect(await footballCoupon.videoAvailable.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2635] the live video icon of the basketball coupon should be displayed", async () => {
      expect(await basketballCoupon.videoAvailable.isDisplayed()).toEqual(true);
    });

    // the element is displayed. skipped to further investigation
    xit("[1109090] the live video icon of the tennis coupon should be displayed", async () => {
      expect(await tennisCoupon.videoAvailable.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2636] the live video icon of the tableTennis coupon should be displayed", async () => {
      expect(await tableTennisCoupon.videoAvailable.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2637] the live video icon of the cricket coupon should be displayed", async () => {
      expect(await cricketCoupon.videoAvailable.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2638] the live video icon of the ice hockey coupon should be displayed", async () => {
      expect(await iceHockeyCoupon.videoAvailable.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2639] the link `View All` should be displayed", async () => {
      expect(await eventMarketsCardCouponSO.viewAllButton.getText()).toEqual("View All");
    });
  });
});
