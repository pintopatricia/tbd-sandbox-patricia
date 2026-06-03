const { SportPagePO } = require("../../../../../page-objects");
const { getSportsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const allCompetitionsLink = sportPagePO.quickLinksCards[0];

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
        cardGroupTitle: "Today",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170181973",
                      liveData: {
                        totalMatched: 21883.006497031536,
                        state: "SUSPENDED",
                        inplay: false,
                      },
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:12191691",
                          name: "Brazilian Brasiliense Matches",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753184",
                          name: "Gama v Real Futebol Clube",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/198140/0",
                          name: "Gama",
                          selectionId: 198140,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/22242266/0",
                          name: "Real Futebol Clube",
                          selectionId: 22242266,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181973/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170181973/198140/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/22242266/0" },
                      { runnerURN: "ppb:excRunner:1.170181973/58805/0" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753184",
                  home: {
                    name: "Gama",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Real Futebol Clube",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-17T23:00:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                  recentForm: null,
                  head2head: null,
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753184",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:1",
        cardGroupTitle: "In-Play",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753238",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170181877",
                      liveData: {
                        totalMatched: 59768.0349898696,
                        state: "OPEN",
                        inplay: true,
                      },
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:857992",
                          name: "Chilean Primera B",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753238",
                          name: "Union San Felipe v Club Deportes Santa Cruz",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181877/4966011/0",
                          name: "Union San Felipe",
                          selectionId: 4966011,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181877/11023627/0",
                          name: "Club Deportes Santa Cruz",
                          selectionId: 11023627,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170181877/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170181877/4966011/0" },
                      { runnerURN: "ppb:excRunner:1.170181877/11023627/0" },
                      { runnerURN: "ppb:excRunner:1.170181877/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228537087",
                      name: "Match Odds",
                      liveData: { inplay: true },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:857992",
                          name: "Chilean Primera B",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753238",
                          name: "Union San Felipe v Club Deportes Santa Cruz",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228537087/4966011",
                          name: "Union San Felipe",
                          selectionId: 4966011,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228537087/11023627",
                          name: "Club Deportes Santa Cruz",
                          selectionId: 11023627,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228537087/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.228537087/4966011" },
                      { runnerURN: "ppb:sbkRunner:924.228537087/11023627" },
                      { runnerURN: "ppb:sbkRunner:924.228537087/58805" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753238",
                  home: {
                    name: "Union San Felipe",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Club Deportes Santa Cruz",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-17T23:30:00Z",
                  startedAt: "2020-03-17T23:29:11Z",
                  score: { home: 0, away: 1 },
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "INPLAY_FIRST_HALF",
                    clock: { minute: 17, second: 45 },
                    stoppageMinutes: null,
                  },
                  penaltyShootout: {
                    firstTeamToShoot: null,
                    nextTeamToShoot: null,
                    penaltyFormat: "ABAB",
                    penaltyScores: [],
                  },
                  recentForm: null,
                  head2head: null,
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753238",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:833222",
        cardGroupTitle: "Turkish 2 Lig",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753358",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.170184696",
                      liveData: {
                        totalMatched: 1156.3838597477095,
                        state: "OPEN",
                        inplay: false,
                      },
                      name: "Match Odds",
                      marketType: "MATCH_ODDS",
                      bettingType: "ODDS",
                      eachWayDivisor: null,
                      numberOfWinners: 1,
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:833222",
                          name: "Turkish 2 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753358",
                          name: "Hekimoglu Trabzon v Kirklarelispor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/21174821/0",
                          name: "Hekimoglu Trabzon",
                          selectionId: 21174821,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/5340310/0",
                          name: "Kirklarelispor",
                          selectionId: 5340310,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.170184696/58805/0",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.170184696/21174821/0" },
                      { runnerURN: "ppb:excRunner:1.170184696/5340310/0" },
                      { runnerURN: "ppb:excRunner:1.170184696/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228538923",
                      name: "Match Odds",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:833222",
                          name: "Turkish 2 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753358",
                          name: "Hekimoglu Trabzon v Kirklarelispor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228538923/21174821",
                          name: "Hekimoglu Trabzon",
                          selectionId: 21174821,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228538923/5340310",
                          name: "Kirklarelispor",
                          selectionId: 5340310,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228538923/58805",
                          name: "The Draw",
                          selectionId: 58805,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.228538923/21174821" },
                      { runnerURN: "ppb:sbkRunner:924.228538923/5340310" },
                      { runnerURN: "ppb:sbkRunner:924.228538923/58805" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753358",
                  home: {
                    name: "Hekimoglu Trabzon",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Kirklarelispor",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-18T11:30:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                  recentForm: {
                    home: [
                      {
                        opponent: "Sanliurfaspor",
                        outcome: "WIN",
                        startAt: "2020-03-15T11:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 7 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Yeni Corumspor",
                        outcome: "DRAW",
                        startAt: "2020-03-08T11:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Hacettepe",
                        outcome: "WIN",
                        startAt: "2020-03-01T11:00:00Z",
                        side: "HOME",
                        score: { home: 1, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Zonguldak Komurspor",
                        outcome: "WIN",
                        startAt: "2020-02-23T10:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 3 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Sancaktepe",
                        outcome: "WIN",
                        startAt: "2020-02-19T10:00:00Z",
                        side: "HOME",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Inegolspor",
                        outcome: "LOSE",
                        startAt: "2020-02-15T10:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Manisa FK",
                        outcome: "DRAW",
                        startAt: "2020-01-26T10:00:00Z",
                        side: "HOME",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Tarsus Idman Yurdu",
                        outcome: "WIN",
                        startAt: "2020-01-11T10:00:00Z",
                        side: "HOME",
                        score: { home: 3, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Bakspor",
                        outcome: "WIN",
                        startAt: "2019-12-14T10:00:00Z",
                        side: "HOME",
                        score: { home: 2, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Basaksehir",
                        outcome: "LOSE",
                        startAt: "2019-12-04T10:00:00Z",
                        side: "HOME",
                        score: { home: 0, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],

                    away: [
                      {
                        opponent: "Pendikspor",
                        outcome: "DRAW",
                        startAt: "2020-03-14T12:00:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Gumushanespor",
                        outcome: "WIN",
                        startAt: "2020-03-08T11:30:00Z",
                        side: "HOME",
                        score: { home: 3, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "1922 Konyaspor",
                        outcome: "LOSE",
                        startAt: "2020-03-01T11:30:00Z",
                        side: "AWAY",
                        score: { home: 4, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Samsunspor",
                        outcome: "LOSE",
                        startAt: "2020-02-23T10:30:00Z",
                        side: "HOME",
                        score: { home: 0, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Sariyer",
                        outcome: "LOSE",
                        startAt: "2020-02-19T10:30:00Z",
                        side: "AWAY",
                        score: { home: 4, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Sanliurfaspor",
                        outcome: "WIN",
                        startAt: "2020-02-15T10:30:00Z",
                        side: "HOME",
                        score: { home: 2, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Fenerbahce",
                        outcome: "LOSE",
                        startAt: "2020-02-11T17:30:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Zonguldak Komurspor",
                        outcome: "LOSE",
                        startAt: "2020-01-26T10:30:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Basaksehir",
                        outcome: "DRAW",
                        startAt: "2020-01-14T13:00:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],
                  },
                  head2head: {
                    home: [
                      {
                        opponent: "Kirklarelispor",
                        outcome: "DRAW",
                        startAt: "2019-09-29T13:00:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Kirklarelispor",
                        outcome: "DRAW",
                        startAt: "2015-04-05T11:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Kirklarelispor",
                        outcome: "LOSE",
                        startAt: "2014-11-16T11:00:00Z",
                        side: "HOME",
                        score: { home: 0, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],

                    away: [
                      {
                        opponent: "Hekimoglu Trabzon",
                        outcome: "DRAW",
                        startAt: "2019-09-29T13:00:00Z",
                        side: "HOME",
                        score: { home: 1, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Hekimoglu Trabzon",
                        outcome: "DRAW",
                        startAt: "2015-04-05T11:30:00Z",
                        side: "HOME",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Hekimoglu Trabzon",
                        outcome: "WIN",
                        startAt: "2014-11-16T11:00:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753446",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228542189",
                      name: "Match Odds",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:833222",
                          name: "Turkish 2 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753446",
                          name: "Gumushanespor v Bugsasspor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542189/5209955",
                          name: "Gumushanespor",
                          selectionId: 5209955,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542189/151478",
                          name: "Draw",
                          selectionId: 151478,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542189/5377426",
                          name: "Bugsasspor",
                          selectionId: 5377426,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.228542189/5209955" },
                      { runnerURN: "ppb:sbkRunner:924.228542189/151478" },
                      { runnerURN: "ppb:sbkRunner:924.228542189/5377426" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753446",
                  home: {
                    name: "Gumushanespor",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Bugsasspor",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-18T11:30:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                  recentForm: { home: [], away: [] },
                  head2head: { home: [], away: [] },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753453",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228542359",
                      name: "Match Odds",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:833222",
                          name: "Turkish 2 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753453",
                          name: "Van Buyuksehir Belediyespor v Ergene Velimese SK",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542359/12049689",
                          name: "Van Buyuksehir Belediyespor",
                          selectionId: 12049689,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542359/151478",
                          name: "Draw",
                          selectionId: 151478,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542359/14568938",
                          name: "Ergene Velimese SK",
                          selectionId: 14568938,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.228542359/12049689" },
                      { runnerURN: "ppb:sbkRunner:924.228542359/151478" },
                      { runnerURN: "ppb:sbkRunner:924.228542359/14568938" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753453",
                  home: {
                    name: "Van Buyuksehir Belediyespor",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Ergene Velimese SK",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-18T11:30:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                  recentForm: { home: [], away: [] },
                  head2head: { home: [], away: [] },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753358",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753446",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753453",
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:818765",
        cardGroupTitle: "Turkish 3 Lig",
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753514",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                eventViewLink: {},
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228542984",
                      name: "Match Odds",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:818765",
                          name: "Turkish 3 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753514",
                          name: "Elazig Belediyespor v Cizrespor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542984/6250145",
                          name: "Elazig Belediyespor",
                          selectionId: 6250145,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542984/151478",
                          name: "Draw",
                          selectionId: 151478,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228542984/12527700",
                          name: "Cizrespor",
                          selectionId: 12527700,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.228542984/6250145" },
                      { runnerURN: "ppb:sbkRunner:924.228542984/151478" },
                      { runnerURN: "ppb:sbkRunner:924.228542984/12527700" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753514",
                  home: {
                    name: "Elazig Belediyespor",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Cizrespor",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-18T11:30:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                  recentForm: { home: [], away: [] },
                  head2head: { home: [], away: [] },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753555",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                eventViewLink: {},
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228543945",
                      name: "Match Odds",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:818765",
                          name: "Turkish 3 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753555",
                          name: "Yomraspor v Serik Belediyespor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228543945/10292631",
                          name: "Yomraspor",
                          selectionId: 10292631,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228543945/151478",
                          name: "Draw",
                          selectionId: 151478,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228543945/20601580",
                          name: "Serik Belediyespor",
                          selectionId: 20601580,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.228543945/10292631" },
                      { runnerURN: "ppb:sbkRunner:924.228543945/151478" },
                      { runnerURN: "ppb:sbkRunner:924.228543945/20601580" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753555",
                  home: {
                    name: "Yomraspor",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Serik Belediyespor",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-18T11:30:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                  recentForm: {
                    home: [
                      {
                        opponent: "Sile Yildizspor",
                        outcome: "WIN",
                        startAt: "2020-03-15T11:30:00Z",
                        side: "HOME",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Erzin Belediyespor",
                        outcome: "WIN",
                        startAt: "2020-03-08T11:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Cankaya FK",
                        outcome: "WIN",
                        startAt: "2020-03-01T11:00:00Z",
                        side: "HOME",
                        score: { home: 1, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Buca",
                        outcome: "LOSE",
                        startAt: "2020-02-23T10:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Silivrispor",
                        outcome: "DRAW",
                        startAt: "2020-02-19T10:00:00Z",
                        side: "HOME",
                        score: { home: 1, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Karbel Karakopru",
                        outcome: "LOSE",
                        startAt: "2020-02-15T10:00:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Sultanbeyli Belediyespor",
                        outcome: "LOSE",
                        startAt: "2020-01-25T10:00:00Z",
                        side: "HOME",
                        score: { home: 1, away: 4 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Artvin Hopaspor",
                        outcome: "LOSE",
                        startAt: "2020-01-12T10:00:00Z",
                        side: "HOME",
                        score: { home: 0, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Kizilcabolukspor",
                        outcome: "DRAW",
                        startAt: "2019-12-15T10:00:00Z",
                        side: "HOME",
                        score: { home: 2, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],

                    away: [
                      {
                        opponent: "Duzcespor",
                        outcome: "DRAW",
                        startAt: "2020-03-15T12:00:00Z",
                        side: "HOME",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Yeni Orduspor",
                        outcome: "WIN",
                        startAt: "2020-03-08T11:30:00Z",
                        side: "HOME",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Sultanbeyli Belediyespor",
                        outcome: "WIN",
                        startAt: "2020-02-29T11:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Tokatspor",
                        outcome: "WIN",
                        startAt: "2020-02-23T10:30:00Z",
                        side: "HOME",
                        score: { home: 5, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Artvin Hopaspor",
                        outcome: "DRAW",
                        startAt: "2020-02-19T10:00:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Kizilcabolukspor",
                        outcome: "WIN",
                        startAt: "2020-02-15T10:30:00Z",
                        side: "HOME",
                        score: { home: 3, away: 2 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Manisaspor",
                        outcome: "LOSE",
                        startAt: "2020-01-25T10:30:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "24Erzincanspor",
                        outcome: "WIN",
                        startAt: "2020-01-11T10:00:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 3 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Sile Yildizspor",
                        outcome: "DRAW",
                        startAt: "2019-12-15T10:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Cankaya FK",
                        outcome: "LOSE",
                        startAt: "2019-12-01T10:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],
                  },
                  head2head: {
                    home: [
                      {
                        opponent: "Serik Belediyespor",
                        outcome: "LOSE",
                        startAt: "2019-09-29T12:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],

                    away: [
                      {
                        opponent: "Yomraspor",
                        outcome: "WIN",
                        startAt: "2019-09-29T12:30:00Z",
                        side: "HOME",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753562",
                title: "Match Odds",
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                eventViewLink: {},
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.228544889",
                      name: "Match Odds",
                      liveData: { inplay: false },
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:1",
                        name: "Football",
                      },
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:818765",
                          name: "Turkish 3 Lig",
                        },
                        sportevent: {
                          __typename: "SportsEvent",
                          urn: "ppb:event:29753562",
                          name: "Fatsa Belediyespor v Kozan Belediyespor",
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228544889/20932209",
                          name: "Fatsa Belediyespor",
                          selectionId: 20932209,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228544889/151478",
                          name: "Draw",
                          selectionId: 151478,
                          handicap: 0,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.228544889/10390072",
                          name: "Kozan Belediyespor",
                          selectionId: 10390072,
                          handicap: 0,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.228544889/20932209" },
                      { runnerURN: "ppb:sbkRunner:924.228544889/151478" },
                      { runnerURN: "ppb:sbkRunner:924.228544889/10390072" },
                    ],
                  },
                },
                fixture: {
                  urn: "ppb:fixture:29753562",
                  home: {
                    name: "Fatsa Belediyespor",
                    color: null,
                    crest: null,
                  },
                  away: {
                    name: "Kozan Belediyespor",
                    color: null,
                    crest: null,
                  },
                  scheduledAt: "2020-03-18T11:30:00Z",
                  startedAt: null,
                  score: null,
                  firstLegScore: null,
                  duration: {
                    period: "REGULAR",
                    status: "PRE_MATCH",
                    clock: null,
                    stoppageMinutes: null,
                  },
                  penaltyShootout: null,
                  recentForm: {
                    home: [
                      {
                        opponent: "Erokspor",
                        outcome: "LOSE",
                        startAt: "2020-03-15T12:00:00Z",
                        side: "AWAY",
                        score: { home: 4, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Kemerspor",
                        outcome: "WIN",
                        startAt: "2020-03-08T11:00:00Z",
                        side: "HOME",
                        score: { home: 2, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "1877 Alemdag",
                        outcome: "LOSE",
                        startAt: "2020-02-23T10:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Erbaaspor",
                        outcome: "WIN",
                        startAt: "2020-02-19T10:00:00Z",
                        side: "HOME",
                        score: { home: 2, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Karsiyaka",
                        outcome: "LOSE",
                        startAt: "2020-02-15T10:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Buyukcekmece Tepecikspor",
                        outcome: "DRAW",
                        startAt: "2020-02-02T10:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Ofspor",
                        outcome: "WIN",
                        startAt: "2020-01-26T10:00:00Z",
                        side: "HOME",
                        score: { home: 3, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Turgutluspor",
                        outcome: "WIN",
                        startAt: "2020-01-12T10:00:00Z",
                        side: "HOME",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Cizre Spor",
                        outcome: "LOSE",
                        startAt: "2019-12-15T10:00:00Z",
                        side: "HOME",
                        score: { home: 0, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Payasspor",
                        outcome: "WIN",
                        startAt: "2019-12-01T10:00:00Z",
                        side: "HOME",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],

                    away: [
                      {
                        opponent: "Payasspor",
                        outcome: "WIN",
                        startAt: "2020-03-14T12:00:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Elaziz Belediyespor",
                        outcome: "WIN",
                        startAt: "2020-03-08T11:30:00Z",
                        side: "HOME",
                        score: { home: 2, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Agri 1970 Spor",
                        outcome: "LOSE",
                        startAt: "2020-03-01T11:00:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Kocaelispor",
                        outcome: "LOSE",
                        startAt: "2020-02-23T10:30:00Z",
                        side: "HOME",
                        score: { home: 0, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Erokspor",
                        outcome: "LOSE",
                        startAt: "2020-02-19T10:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Kemerspor",
                        outcome: "WIN",
                        startAt: "2020-02-15T10:30:00Z",
                        side: "HOME",
                        score: { home: 3, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Erbaaspor",
                        outcome: "DRAW",
                        startAt: "2020-01-26T10:30:00Z",
                        side: "AWAY",
                        score: { home: 0, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Ofspor",
                        outcome: "LOSE",
                        startAt: "2019-12-08T10:30:00Z",
                        side: "AWAY",
                        score: { home: 2, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                      {
                        opponent: "Turgutluspor",
                        outcome: "LOSE",
                        startAt: "2019-11-23T10:30:00Z",
                        side: "AWAY",
                        score: { home: 3, away: 0 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],
                  },
                  head2head: {
                    home: [
                      {
                        opponent: "Kozan Belediyespor",
                        outcome: "DRAW",
                        startAt: "2019-09-29T12:30:00Z",
                        side: "AWAY",
                        score: { home: 1, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],

                    away: [
                      {
                        opponent: "Fatsa Belediyespor",
                        outcome: "DRAW",
                        startAt: "2019-09-29T12:30:00Z",
                        side: "HOME",
                        score: { home: 1, away: 1 },
                        extraTimeScore: null,
                        penaltyShootoutScore: null,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753514",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753555",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753562",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29753809",
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29754112",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsTodayInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topInplayEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:833222",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:818765",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:848322",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetitionLink:2079376",
      },
    },
    { node: { __typename: "QuickLinksCard", urn: "ppb:tbd:card:quickLinks:allCompetitions:1" } },
  ],
};

const CARDS_MOCK = {
  cards: [
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:topEventsByCompetition:848322",
      cardGroupTitle: "Singapore S-League",
      full: {
        edges: [
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:29753257",
              title: "Match Odds",
              sportevent: {
                name: "Home Team vs Away Team",
                urn: "ppb:event:12345",
                __typename: "SportsEvent",
                competition: {
                  urn: "ppb:competition:12191691",
                  name: "Competition Name",
                },
              },
              eventViewLink: {},
              displayRunners: {
                exchange: {
                  market: {
                    __typename: "ExchangeMarket",
                    urn: "ppb:excMarket:1.170189797",
                    liveData: {
                      totalMatched: 509.08613078195276,
                      state: "OPEN",
                      inplay: false,
                    },
                    name: "Match Odds",
                    marketType: "MATCH_ODDS",
                    bettingType: "ODDS",
                    eachWayDivisor: null,
                    numberOfWinners: 1,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                    },
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:848322",
                        name: "Singapore S-League",
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:29753257",
                        name: "Balestier Khalsa v Hougang Utd",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170189797/5322891/0",
                        name: "Balestier Khalsa",
                        selectionId: 5322891,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170189797/5339978/0",
                        name: "Hougang Utd",
                        selectionId: 5339978,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170189797/58805/0",
                        name: "The Draw",
                        selectionId: 58805,
                        handicap: 0,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:excRunner:1.170189797/5322891/0" },
                    { runnerURN: "ppb:excRunner:1.170189797/5339978/0" },
                    { runnerURN: "ppb:excRunner:1.170189797/58805/0" },
                  ],
                },
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.228537619",
                    name: "Match Odds",
                    liveData: { inplay: false },
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                    },
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:848322",
                        name: "Singapore S-League",
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:29753257",
                        name: "Balestier Khalsa v Hougang Utd",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.228537619/5322891",
                        name: "Balestier Khalsa",
                        selectionId: 5322891,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.228537619/5339978",
                        name: "Hougang Utd",
                        selectionId: 5339978,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.228537619/58805",
                        name: "The Draw",
                        selectionId: 58805,
                        handicap: 0,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:sbkRunner:924.228537619/5322891" },
                    { runnerURN: "ppb:sbkRunner:924.228537619/5339978" },
                    { runnerURN: "ppb:sbkRunner:924.228537619/58805" },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:29753257",
                home: {
                  name: "Balestier Khalsa",
                  color: null,
                  crest: null,
                },
                away: {
                  name: "Hougang Utd",
                  color: null,
                  crest: null,
                },
                scheduledAt: "2020-03-18T11:45:00Z",
                startedAt: null,
                score: null,
                firstLegScore: null,
                duration: {
                  period: "REGULAR",
                  status: "PRE_MATCH",
                  clock: null,
                  stoppageMinutes: null,
                },
                penaltyShootout: null,
                recentForm: null,
                head2head: null,
              },
            },
          },
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:29753252",
              title: "Match Odds",
              sportevent: {
                name: "Home Team vs Away Team",
                urn: "ppb:event:12345",
                __typename: "SportsEvent",
                competition: {
                  urn: "ppb:competition:12191691",
                  name: "Competition Name",
                },
              },
              eventViewLink: {},
              displayRunners: {
                exchange: {
                  market: {
                    __typename: "ExchangeMarket",
                    urn: "ppb:excMarket:1.170189888",
                    liveData: {
                      totalMatched: 868.57960474729,
                      state: "OPEN",
                      inplay: false,
                    },
                    name: "Match Odds",
                    marketType: "MATCH_ODDS",
                    bettingType: "ODDS",
                    eachWayDivisor: null,
                    numberOfWinners: 1,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                    },
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:848322",
                        name: "Singapore S-League",
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:29753252",
                        name: "Tampines Rovers v Home Utd",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170189888/5305977/0",
                        name: "Tampines Rovers",
                        selectionId: 5305977,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170189888/4852330/0",
                        name: "Home Utd",
                        selectionId: 4852330,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:excRunner:1.170189888/58805/0",
                        name: "The Draw",
                        selectionId: 58805,
                        handicap: 0,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:excRunner:1.170189888/5305977/0" },
                    { runnerURN: "ppb:excRunner:1.170189888/4852330/0" },
                    { runnerURN: "ppb:excRunner:1.170189888/58805/0" },
                  ],
                },
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.228537552",
                    name: "Match Odds",
                    liveData: { inplay: false },
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                    },
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:848322",
                        name: "Singapore S-League",
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:29753252",
                        name: "Tampines Rovers v Home Utd",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.228537552/5305977",
                        name: "Tampines Rovers",
                        selectionId: 5305977,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.228537552/4852330",
                        name: "Home Utd",
                        selectionId: 4852330,
                        handicap: 0,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.228537552/58805",
                        name: "The Draw",
                        selectionId: 58805,
                        handicap: 0,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:sbkRunner:924.228537552/5305977" },
                    { runnerURN: "ppb:sbkRunner:924.228537552/4852330" },
                    { runnerURN: "ppb:sbkRunner:924.228537552/58805" },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:29753252",
                home: {
                  name: "Tampines Rovers",
                  color: null,
                  crest: null,
                },
                away: {
                  name: "Home Utd",
                  color: null,
                  crest: null,
                },
                scheduledAt: "2020-03-18T11:45:00Z",
                startedAt: null,
                score: null,
                firstLegScore: null,
                duration: {
                  period: "REGULAR",
                  status: "PRE_MATCH",
                  clock: null,
                  stoppageMinutes: null,
                },
                penaltyShootout: null,
                recentForm: { home: [], away: [] },
                head2head: { home: [], away: [] },
              },
            },
          },
        ],
      },
      partials: {
        edges: [
          { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29753257" } },
          { node: { __typename: "EventMarketCard", urn: "ppb:tbd:card:eventPrimaryMarket:29753252" } },
        ],
      },
    },
    {
      __typename: "SwimlaneCardGroup",
      urn: "ppb:tbd:card:group:topEventsByCompetitionLink:2079376",
      cardGroupTitle: "Costa Rican Primera Division",
      full: {
        edges: [
          {
            node: {
              __typename: "EventViewLinkCard",
              urn: "ppb:tbd:card:eventViewLink:29753837",
              viewLink: {},
              sportevent: {
                urn: "ppb:event:29753837",
                name: "Guadalupe F.C v Limon",
                eventId: 29753837,
                openDate: "2020-03-18T22:00:00.000Z",
                sport: { urn: "ppb:eventType:1", name: "Football" },
                competition: {
                  urn: "ppb:competition:2079376",
                  name: "Costa Rican Primera Division",
                },
              },
              fixture: {
                urn: "ppb:fixture:29753837",
                scheduledAt: "2020-03-18T22:00:00Z",
                startedAt: null,
                duration: {
                  period: "REGULAR",
                  status: "PRE_MATCH",
                  clock: null,
                  stoppageMinutes: null,
                },
                home: { name: "Guadalupe F.C" },
                away: { name: "Limon" },
              },
            },
          },
        ],
      },
      partials: {
        edges: [
          {
            node: {
              __typename: "EventViewLinkCard",
              urn: "ppb:tbd:card:eventViewLink:29753837",
            },
          },
        ],
      },
    },
    {
      quickLinksTitle: "All Competitions",
      urn: "ppb:tbd:card:quickLinks:allCompetitions:1",
      __typename: "QuickLinksCard",
      links: [
        {
          icon: null,
          label: "View All Competitions",
          target: "_self",
          viewLink: {
            viewUrn: "ppb:tbd:view:allCompetitions:1",
            viewUrl: routes.getAllCompetitionsViewUrl("1"),
          },
        },
      ],
    },
  ],
};

describe("Football Sports Page", () => {
  // And I have 4 full cards and 6 partial cards for primary and secondary swimlanes
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(CARDS_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.scrollableSwimlanes[0]);
  });

  it("[PRPI-7591] Then it should load a total of 4 primary swimlanes on the page", async () => {
    expect(await sportPagePO.scrollableSwimlanes.length).toBe(4);
  });

  it("[PRPI-7592] And I should see the first one on viewport", async () => {
    const firstPrimarySwimlane = await sportPagePO.scrollableSwimlanes[0];

    expect(await firstPrimarySwimlane.isDisplayedInViewport()).toBe(true);
  });

  describe("When I scroll down till the second swimlane", () => {
    beforeAll(async () => {
      await sportPagePO.scrollableSwimlanes[1].scrollIntoView();
    });

    it("[PRPI-7593] Then I should see the second primary swimlane", async () => {
      const secondPrimarySwimlane = await sportPagePO.scrollableSwimlanes[1];

      expect(await secondPrimarySwimlane.isDisplayedInViewport()).toBe(true);
    });
  });

  describe("When I scroll down till the third swimlane", () => {
    beforeAll(async () => {
      await sportPagePO.scrollableSwimlanes[2].scrollIntoView();
      await browser.waitUntilDisplayed(sportPagePO.scrollableSwimlanes[2]);
    });

    it("[PRPI-7594] Then I should see the third primary swimlane on viewport)", async () => {
      const thirdPrimarySwimlane = await sportPagePO.scrollableSwimlanes[2];

      expect(await thirdPrimarySwimlane.isDisplayedInViewport()).toBe(true);
    });

    xit("[628960] And I should see a total of 4 primary swimlanes", async () => {
      expect(await sportPagePO.scrollableSwimlanes.length).toBe(4);
    });
  });

  describe("When I scroll down till the fourth swimlane", () => {
    beforeAll(async () => {
      await sportPagePO.scrollableSwimlanes[3].scrollIntoView();
      await browser.waitUntilDisplayed(sportPagePO.scrollableSwimlanes[3]);
    });

    it("[PRPI-7595] Then I should see the fourth primary swimlane on viewport", async () => {
      const fourthPrimarySwimlane = await sportPagePO.scrollableSwimlanes[3];

      expect(await fourthPrimarySwimlane.isDisplayedInViewport()).toBe(true);
    });
  });

  describe("When I scroll down till the fifth swimlane", () => {
    beforeAll(async () => {
      await sportPagePO.cardGroups[4].scrollIntoView();
      await browser.waitUntilDisplayed(sportPagePO.scrollableSwimlanes[4]);
    });

    it("[PRPI-7596] Then I should see the fifth primary swimlane on viewport", async () => {
      const fifthPrimarySwimlane = await sportPagePO.scrollableSwimlanes[4];

      expect(await fifthPrimarySwimlane.isDisplayedInViewport()).toBe(true);
    });

    it("[PRPI-7597] I should see a total of 6 swimlanes", async () => {
      expect(await sportPagePO.scrollableSwimlanes.length).toBe(6);
    });
  });

  describe("When I scroll down till the sixth swimlane", () => {
    beforeAll(async () => {
      await sportPagePO.cardGroups[5].scrollIntoView();
    });

    it("[PRPI-7598] Then I should see the first secondary swimlane on viewport", async () => {
      const fistSecondarySwimlane = await sportPagePO.scrollableSwimlanes[5];

      expect(await fistSecondarySwimlane.isDisplayedInViewport()).toBe(true);
    });
  });

  describe("When I scroll down till the all competitions link", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(allCompetitionsLink);
      await allCompetitionsLink.scrollIntoView();
      await browser.waitUntilInViewport(allCompetitionsLink);
    });

    it("[PRPI-7599] Then I should see the all competitions link on viewport", async () => {
      expect(await allCompetitionsLink.isDisplayedInViewport()).toBe(true);
    });
  });
});
