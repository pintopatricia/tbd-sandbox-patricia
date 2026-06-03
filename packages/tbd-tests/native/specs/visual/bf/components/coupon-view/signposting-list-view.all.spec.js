const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getSportsLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, MarketPromoSO } = require("../../../../../screen-objects");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { swipeUp } = require("../../../../../helpers/gestures");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const marketPromoSO = new MarketPromoSO();

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
  competition: COMPETITION_MOCK(228, "Football", 1, "Football"),
  marketId: "924.193270000",
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
  competition: COMPETITION_MOCK(228, "Football", 1, "Football"),
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
    currentTeamBatting: null,
    currentTime: null,
  },
  competition: COMPETITION_MOCK(232, "Cricket In Play", 4, "Cricket"),
};

const EVENT_MARKET_CARD_MOCK = ({ id, competition, fixture, marketId = "924.193270252" }) => ({
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
        urn: `ppb:sbkMarket:${marketId}`,
        marketType: "MATCH_ODDS_90",
        noLiveData: true,
        name: "Match Odds",
        hierarchy: {
          __typename: "EventCompetitionHierarchy",
          sportevent: {
            __typename: "SportsEvent",
            name: "Real Madrid vs Barcelona",
            openDate: "2077-01-16T20:00:00Z",
            urn: `ppb:event:${id}`,
            eventId: id,
            competition,
          },
          competition,
        },
        runners: [{ runnerURN: `ppb:sbkRunner:${marketId}/48351` }, { runnerURN: `ppb:sbkRunner:${marketId}/48352` }],
      },
      runners: [{ runnerURN: `ppb:sbkRunner:${marketId}/48351` }, { runnerURN: `ppb:sbkRunner:${marketId}/48352` }],
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
        has90Min: false,
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
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359903",
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
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "CouponHeaderCard",
                columns: ["YES", "NO"],
                urn: "ppb:tbd:card:couponheader:x/s/1|228",
                competition: COMPETITION_MOCK(228, "Football", 1, "Football"),
              },
            },
            {
              node: EVENT_MARKET_CARD_MOCK(FOOTBALL_MOCK),
            },
            {
              node: EVENT_MARKET_CARD_MOCK(FOOTBALL_MOCK_HALF_TIME),
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

const BFF_MOCK_WITH_PAGE_BLURB = {
  ...BFF_MOCK,
  edges: [
    {
      node: {
        __typename: "BlurbCard",
        urn: "ppb:tbd:card:blurb:Z-1uQRAAAB8AZ8lB/s/1",
        blurb: {
          isCollapsed: false,
          title: { name: "Take a shot at the Daily Jackpot" },
          description: {
            name: "The Daily Jackpots are progressive jackpots that can occur on any eligible slot at any time between 8-11 pm.",
          },
          supplementaryInfo: {
            label: { name: "Play Here !!!" },
            viewLink: { viewUrl: "https://casino.betfair.com/c/daily-jackpot" },
          },
        },
      },
    },
    ...BFF_MOCK.edges,
  ],

  partialEdges: [
    {
      node: {
        __typename: "BlurbCard",
        urn: "ppb:tbd:card:blurb:Z-1uQRAAAB8AZ8lB/s/1",
      },
    },
    ...BFF_MOCK.partialEdges,
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.193270252",
      inplay: true,
    },
  ],
};

const MODULE_NAME = "signposting_list_view";

describe("Signposting Coupon List View: User navigates to the sport page", () => {
  const HOME_VIEW_LINK = getStartViewLink("football/s-1");

  beforeAll(async () => {
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));

    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(genericScreenSO.element);

    await swipeUp(0.5);
    await browser.waitUntilImageEquals(`${MODULE_NAME}__[PRPI-4903]_signposting_icon_should_be_displayed`);
  });

  it("[PRPI-4903]_signposting_icon_should_be_displayed", async () => {
    expect(
      (await browser.compareScreen(`${MODULE_NAME}__[PRPI-4903]_signposting_icon_should_be_displayed`))
        .misMatchPercentage,
    ).toEqual(0);
  });

  describe("and when there is page blurb", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK_WITH_PAGE_BLURB));
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, shouldTerminateAppBeforeStart: true });

      await browser.waitUntilDisplayed(genericScreenSO.element);
      await browser.waitUntilDisplayed(marketPromoSO.description);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4904]_should_be_displayed_with_page_blurb`);
    });

    it("[PRPI-4904]_should_be_displayed_with_page_blurb", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4904]_should_be_displayed_with_page_blurb`))
          .misMatchPercentage,
      ).toEqual(0);
    });
  });
});
