const {
  ScrollableSwimlanePO,
  CreatedBetsCardPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  MinimizedPO,
} = require("../../../../../page-objects");
const { getGenericLayout, getObbImply } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const swimlanePO = new ScrollableSwimlanePO();
const firstCreatedBetsCard = new CreatedBetsCardPO(swimlanePO.scrollItems[0]);
const secondCreatedBetsCard = new CreatedBetsCardPO(swimlanePO.scrollItems[1]);
const betslipDrawerPO = new BetslipDrawerPO();
const minimizedBetslipPO = new MinimizedPO();

const BOTTOM_BAR_PROPERTY = {
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/browse:sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: "mybets/myBets-open",
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
  ],
};

const VIEW_PARTIAL_EDGES = [
  {
    node: {
      __typename: "ObbCreatedBetsCardGroup",
      urn: "ppb:obb:createdBetsCardGroup:aMvBuBIAACIAVFHA/cv/home",
    },
  },
];

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  bottomBar: BOTTOM_BAR_PROPERTY,
  edges: [
    {
      node: {
        __typename: "ObbCreatedBetsCardGroup",
        urn: "ppb:obb:createdBetsCardGroup:aMvBuBIAACIAVFHA/cv/home",
        obbCreatedBetsCardGroupTitle: {
          name: "Race To X Points",
          __typename: "DisplayNameTitle",
        },
        headerBadgeLabel: {
          name: "NEW",
          __typename: "DisplayNameTitle",
        },
        headerViewLink: {
          viewUrn: "ppb:tbd:view:obbLandingPage:olp",
          viewUrl: "olp",
          viewDisplayMode: null,
          __typename: "ViewLink",
        },
        cards: {
          edges: [
            {
              cursor:
                "ppb:obb:card:createdBets:aMvBuBIAACIAVFHA|obb_created_bets_card$de0a930c-c325-4b6c-9637-0b4725dd9159/cv/home",
              node: {
                urn: "ppb:obb:card:createdBets:aMvBuBIAACIAVFHA|obb_created_bets_card$de0a930c-c325-4b6c-9637-0b4725dd9159/cv/home",
                fixture: {
                  urn: "ppb:fixture:2222222",
                  runnerNames: {
                    home: "Oud-Heverlee Leuven",
                    away: "Club Brugge",
                    __typename: "FixtureRunnerNames",
                  },
                  home: {
                    name: "Oud-Heverlee Leuven",
                    __typename: "FootballTeamDetails",
                  },
                  away: {
                    name: "Club Brugge",
                    __typename: "FootballTeamDetails",
                  },
                  sportevent: {
                    urn: "ppb:event:2222222",
                    openDate: "2025-10-21T16:15:00.000Z",
                    __typename: "SportsEvent",
                  },
                  __typename: "FootballFixture",
                },
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:2222222",
                  viewUrl: "football/belgian-pro-league/oud-heverlee-leuven-v-club-brugge/e-2222222",
                  viewDisplayMode: null,
                  __typename: "ViewLink",
                },
                footerViewLink: {
                  viewUrn: "ppb:tbd:view:event:2222222?=tabId=aFFKkREAAB4AmQM1",
                  viewUrl:
                    "football/belgian-pro-league/oud-heverlee-leuven-v-club-brugge/e-2222222?tabId=aFFKkREAAB4AmQM1",
                  viewDisplayMode: null,
                  __typename: "ViewLink",
                },
                bettingOpportunities: [
                  {
                    participants: [
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:160341/e/2222222",
                        player: {
                          id: "160341",
                          name: "Shandre Campbell",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0.33,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.67,
                              foulsWon: 0,
                              passes: 5.67,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "3334",
                          name: "Club Brugge",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:54502/e/2222222",
                        player: {
                          id: "54502",
                          name: "Thibault Vlietinck",
                          seasonStats: {
                            matchesPlayed: 5,
                            averages: {
                              shotsOnTarget: 0,
                              totalShots: 0,
                              goals: 0,
                              yellowCards: 0.6,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.6,
                              foulsWon: 0.4,
                              passes: 10,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:148278/e/2222222",
                        player: {
                          id: "148278",
                          name: "Roggerio Nyakossi",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0,
                              foulsWon: 0,
                              passes: 31,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:56941/e/2222222",
                        player: {
                          id: "56941",
                          name: "Sory Kaba",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.67,
                              totalShots: 2.33,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 2,
                              foulsWon: 0.33,
                              passes: 15.67,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:97003/e/2222222",
                        player: {
                          id: "97003",
                          name: "Christos Tzolis",
                          seasonStats: {
                            matchesPlayed: 10,
                            averages: {
                              shotsOnTarget: 1.1,
                              totalShots: 4,
                              goals: 0.3,
                              yellowCards: 0.2,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 1.1,
                              foulsWon: 1.8,
                              passes: 35.1,
                              assists: 0.3,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "3334",
                          name: "Club Brugge",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                    ],

                    leg: {
                      templateId: "participantsCombined",
                      templateParams: {
                        participantIds: [
                          {
                            urn: "ppb:obb:footballPlayer:160341/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:54502/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:148278/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:56941/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:97003/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                        ],

                        outcomeIds: ["GOALS"],
                        value: 1,
                        timePeriodId: "MATCH",
                        quantifier: "AT_LEAST",
                        __typename: "ObbSquadBetParams",
                      },
                      quote: {
                        __typename: "ObbQuoteSuccess",
                        price: {
                          decimal: 1.36,
                          fractional: {
                            numerator: 4,
                            denominator: 11,
                            __typename: "FractionalOdds",
                          },
                          __typename: "ObbOdds",
                        },
                      },
                      event: {
                        eventId: 2222222,
                        urn: "ppb:event:2222222",
                        name: "Oud-Heverlee Leuven v Club Brugge",
                        __typename: "SportsEvent",
                      },
                      __typename: "ObbLeg",
                    },
                    __typename: "ObbBettingOpportunity",
                  },
                  {
                    participants: [
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:160341/e/2222222",
                        player: {
                          id: "160341",
                          name: "Shandre Campbell",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0.33,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.67,
                              foulsWon: 0,
                              passes: 5.67,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "3334",
                          name: "Club Brugge",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:54502/e/2222222",
                        player: {
                          id: "54502",
                          name: "Thibault Vlietinck",
                          seasonStats: {
                            matchesPlayed: 5,
                            averages: {
                              shotsOnTarget: 0,
                              totalShots: 0,
                              goals: 0,
                              yellowCards: 0.6,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.6,
                              foulsWon: 0.4,
                              passes: 10,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:148278/e/2222222",
                        player: {
                          id: "148278",
                          name: "Roggerio Nyakossi",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0,
                              foulsWon: 0,
                              passes: 31,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:56941/e/2222222",
                        player: {
                          id: "56941",
                          name: "Sory Kaba",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.67,
                              totalShots: 2.33,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 2,
                              foulsWon: 0.33,
                              passes: 15.67,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:97003/e/2222222",
                        player: {
                          id: "97003",
                          name: "Christos Tzolis",
                          seasonStats: {
                            matchesPlayed: 10,
                            averages: {
                              shotsOnTarget: 1.1,
                              totalShots: 4,
                              goals: 0.3,
                              yellowCards: 0.2,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 1.1,
                              foulsWon: 1.8,
                              passes: 35.1,
                              assists: 0.3,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "3334",
                          name: "Club Brugge",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                    ],

                    leg: {
                      templateId: "participantsCombined",
                      templateParams: {
                        participantIds: [
                          {
                            urn: "ppb:obb:footballPlayer:160341/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:54502/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:148278/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:56941/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:97003/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                        ],

                        outcomeIds: ["GOALS"],
                        value: 4,
                        timePeriodId: "MATCH",
                        quantifier: "AT_LEAST",
                        __typename: "ObbSquadBetParams",
                      },
                      quote: {
                        __typename: "ObbQuoteSuccess",
                        price: {
                          decimal: 2.12,
                          fractional: {
                            numerator: 4,
                            denominator: 11,
                            __typename: "FractionalOdds",
                          },
                          __typename: "ObbOdds",
                        },
                      },
                      event: {
                        eventId: 2222222,
                        urn: "ppb:event:2222222",
                        name: "Oud-Heverlee Leuven v Club Brugge",
                        __typename: "SportsEvent",
                      },
                      __typename: "ObbLeg",
                    },
                    __typename: "ObbBettingOpportunity",
                  },
                  {
                    participants: [
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:160341/e/2222222",
                        player: {
                          id: "160341",
                          name: "Shandre Campbell",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0.33,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.67,
                              foulsWon: 0,
                              passes: 5.67,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "3334",
                          name: "Club Brugge",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:54502/e/2222222",
                        player: {
                          id: "54502",
                          name: "Thibault Vlietinck",
                          seasonStats: {
                            matchesPlayed: 5,
                            averages: {
                              shotsOnTarget: 0,
                              totalShots: 0,
                              goals: 0,
                              yellowCards: 0.6,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.6,
                              foulsWon: 0.4,
                              passes: 10,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:148278/e/2222222",
                        player: {
                          id: "148278",
                          name: "Roggerio Nyakossi",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0,
                              foulsWon: 0,
                              passes: 31,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:56941/e/2222222",
                        player: {
                          id: "56941",
                          name: "Sory Kaba",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.67,
                              totalShots: 2.33,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 2,
                              foulsWon: 0.33,
                              passes: 15.67,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:97003/e/2222222",
                        player: {
                          id: "97003",
                          name: "Christos Tzolis",
                          seasonStats: {
                            matchesPlayed: 10,
                            averages: {
                              shotsOnTarget: 1.1,
                              totalShots: 4,
                              goals: 0.3,
                              yellowCards: 0.2,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 1.1,
                              foulsWon: 1.8,
                              passes: 35.1,
                              assists: 0.3,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "3334",
                          name: "Club Brugge",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                    ],

                    leg: {
                      templateId: "squadVsSquad",
                      templateParams: {
                        squadAParticipantIds: [
                          {
                            urn: "ppb:obb:footballPlayer:160341/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:54502/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                        ],

                        squadBParticipantIds: [
                          {
                            urn: "ppb:obb:footballPlayer:148278/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:56941/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:97003/e/2222222",
                            __typename: "ObbFootballPlayer",
                          },
                        ],

                        outcomeIds: ["GOALS_TIME_ADJUSTED"],
                        timePeriodId: "MATCH",
                        quantifier: "AT_LEAST",
                        __typename: "ObbSquadVsSquadParams",
                      },
                      quote: {
                        __typename: "ObbQuoteSuccess",
                        price: {
                          decimal: 1.01,
                          fractional: {
                            numerator: 1,
                            denominator: 1,
                            __typename: "FractionalOdds",
                          },
                          __typename: "ObbOdds",
                        },
                      },
                      event: {
                        eventId: 2222222,
                        urn: "ppb:event:2222222",
                        name: "Oud-Heverlee Leuven v Club Brugge",
                        __typename: "SportsEvent",
                      },
                      __typename: "ObbLeg",
                    },
                    __typename: "ObbBettingOpportunity",
                  },
                  {
                    participants: [
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:160341/e/2222222",
                        player: {
                          id: "160341",
                          name: "Shandre Campbell",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0.33,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.67,
                              foulsWon: 0,
                              passes: 5.67,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "3334",
                          name: "Club Brugge",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:148278/e/2222222",
                        player: {
                          id: "148278",
                          name: "Roggerio Nyakossi",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.33,
                              totalShots: 0.33,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0,
                              foulsWon: 0,
                              passes: 31,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "6239",
                          name: "Oud-Heverlee Leuven",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                    ],

                    leg: {
                      templateId: "playerVsPlayer",
                      templateParams: {
                        participantIdA: {
                          urn: "ppb:obb:footballPlayer:160341/e/2222222",
                          __typename: "ObbFootballPlayer",
                        },

                        participantIdB: {
                          urn: "ppb:obb:footballPlayer:148278/e/2222222",
                          __typename: "ObbFootballPlayer",
                        },
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        __typename: "ObbPvpParams",
                      },
                      quote: {
                        __typename: "ObbQuoteSuccess",
                        price: {
                          decimal: 2.01,
                          fractional: {
                            numerator: 2,
                            denominator: 1,
                            __typename: "FractionalOdds",
                          },
                          __typename: "ObbOdds",
                        },
                      },
                      event: {
                        eventId: 2222222,
                        urn: "ppb:event:2222222",
                        name: "Oud-Heverlee Leuven v Club Brugge",
                        __typename: "SportsEvent",
                      },
                      __typename: "ObbLeg",
                    },
                    __typename: "ObbBettingOpportunity",
                  },
                ],

                __typename: "ObbCreatedBetsCard",
              },
              __typename: "ObbCreatedBetsCardEdge",
            },
            {
              cursor:
                "ppb:obb:card:createdBets:aMvBuBIAACIAVFHA|obb_created_bets_card$18ec3d68-06cc-4110-9884-0ec0eb31edff/cv/home",
              node: {
                urn: "ppb:obb:card:createdBets:aMvBuBIAACIAVFHA|obb_created_bets_card$18ec3d68-06cc-4110-9884-0ec0eb31edff/cv/home",
                fixture: {
                  urn: "ppb:fixture:3333333",
                  runnerNames: {
                    home: "Torino",
                    away: "Napoli",
                    __typename: "FixtureRunnerNames",
                  },
                  home: {
                    name: "Torino",
                    __typename: "FootballTeamDetails",
                  },
                  away: {
                    name: "Napoli",
                    __typename: "FootballTeamDetails",
                  },
                  sportevent: {
                    urn: "ppb:event:3333333",
                    openDate: "2025-10-21T16:16:00.000Z",
                    __typename: "SportsEvent",
                  },
                  __typename: "FootballFixture",
                },
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:3333333",
                  viewUrl: "football/italian-serie-a/torino-v-napoli/e-3333333",
                  viewDisplayMode: null,
                  __typename: "ViewLink",
                },
                footerViewLink: {
                  viewUrn: "ppb:tbd:view:event:3333333?=tabId=aFFKkREAAB4AmQM1",
                  viewUrl: "football/italian-serie-a/torino-v-napoli/e-3333333?tabId=aFFKkREAAB4AmQM1",
                  viewDisplayMode: null,
                  __typename: "ViewLink",
                },
                bettingOpportunities: [
                  {
                    participants: [
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:8954/e/3333333",
                        player: {
                          id: "8954",
                          name: "Kevin De Bruyne",
                          seasonStats: {
                            matchesPlayed: 6,
                            averages: {
                              shotsOnTarget: 0.83,
                              totalShots: 1.83,
                              goals: 0.5,
                              yellowCards: 0.17,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 0.5,
                              foulsWon: 0.33,
                              passes: 51,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5949",
                          name: "Napoli",
                          color: "158ec6",
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "SHOTS_ON_TARGET",
                            resultType: {
                              min: 0,
                              max: 7,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "BOOKED",
                            resultType: {
                              value: "YES_NO",
                              __typename: "ObbBooleanResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS",
                            resultType: {
                              min: 0,
                              max: 9,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "FOULS_COMMITTED",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:147339/e/3333333",
                        player: {
                          id: "147339",
                          name: "Alieu Njie",
                          seasonStats: {
                            matchesPlayed: 1,
                            averages: {
                              shotsOnTarget: 0,
                              totalShots: 0,
                              goals: 0,
                              yellowCards: 1,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 2,
                              foulsWon: 0,
                              passes: 0,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "7602",
                          name: "Torino",
                          color: "881f19",
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "FOULS_COMMITTED",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "BOOKED",
                            resultType: {
                              value: "YES_NO",
                              __typename: "ObbBooleanResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS_ON_TARGET",
                            resultType: {
                              min: 0,
                              max: 8,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS",
                            resultType: {
                              min: 0,
                              max: 11,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:112244/e/3333333",
                        player: {
                          id: "112244",
                          name: "Rasmus Hojlund",
                          seasonStats: {
                            matchesPlayed: 4,
                            averages: {
                              shotsOnTarget: 0.75,
                              totalShots: 1,
                              goals: 0.5,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 1.25,
                              foulsWon: 2.25,
                              passes: 13.25,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5949",
                          name: "Napoli",
                          color: "158ec6",
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "FOULS_COMMITTED",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS_ON_TARGET",
                            resultType: {
                              min: 0,
                              max: 7,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "BOOKED",
                            resultType: {
                              value: "YES_NO",
                              __typename: "ObbBooleanResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS",
                            resultType: {
                              min: 0,
                              max: 10,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:42771/e/3333333",
                        player: {
                          id: "42771",
                          name: "Frank Anguissa",
                          seasonStats: {
                            matchesPlayed: 6,
                            averages: {
                              shotsOnTarget: 0.83,
                              totalShots: 2.17,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 1,
                              foulsWon: 0.83,
                              passes: 44.17,
                              assists: 0.17,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5949",
                          name: "Napoli",
                          color: "158ec6",
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS_ON_TARGET",
                            resultType: {
                              min: 0,
                              max: 7,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "BOOKED",
                            resultType: {
                              value: "YES_NO",
                              __typename: "ObbBooleanResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS",
                            resultType: {
                              min: 0,
                              max: 12,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "FOULS_COMMITTED",
                            resultType: {
                              min: 0,
                              max: 7,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:111763/e/3333333",
                        player: {
                          id: "111763",
                          name: "Sam Beukema",
                          seasonStats: {
                            matchesPlayed: 3,
                            averages: {
                              shotsOnTarget: 0.67,
                              totalShots: 0.67,
                              goals: 0.33,
                              yellowCards: 0,
                              redCards: 0,
                              yellowRedCards: 0,
                              fouls: 1,
                              foulsWon: 0.67,
                              passes: 69,
                              assists: 0,
                              __typename: "FootballPlayerStat",
                            },
                            __typename: "FootballPlayerSeasonStats",
                          },
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5949",
                          name: "Napoli",
                          color: "158ec6",
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "SHOTS",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "SHOTS_ON_TARGET",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "BOOKED",
                            resultType: {
                              value: "YES_NO",
                              __typename: "ObbBooleanResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "FOULS_COMMITTED",
                            resultType: {
                              min: 0,
                              max: 6,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 3,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                    ],

                    leg: {
                      templateId: "participantsCombined",
                      templateParams: {
                        participantIds: [
                          {
                            urn: "ppb:obb:footballPlayer:8954/e/3333333",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:147339/e/3333333",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:112244/e/3333333",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:42771/e/3333333",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:111763/e/3333333",
                            __typename: "ObbFootballPlayer",
                          },
                        ],

                        outcomeIds: ["GOALS"],
                        value: 1,
                        timePeriodId: "MATCH",
                        quantifier: "AT_LEAST",
                        __typename: "ObbSquadBetParams",
                      },
                      quote: {
                        __typename: "ObbQuoteSuccess",
                        price: {
                          decimal: 1.44,
                          fractional: {
                            numerator: 4,
                            denominator: 9,
                            __typename: "FractionalOdds",
                          },
                          __typename: "ObbOdds",
                        },
                      },
                      event: {
                        eventId: 3333333,
                        urn: "ppb:event:3333333",
                        name: "Torino v Napoli",
                        __typename: "SportsEvent",
                      },
                      __typename: "ObbLeg",
                    },
                    __typename: "ObbBettingOpportunity",
                  },
                ],

                __typename: "ObbCreatedBetsCard",
              },
              __typename: "ObbCreatedBetsCardEdge",
            },
            {
              cursor:
                "ppb:obb:card:createdBets:aMvBuBIAACIAVFHA|obb_created_bets_card$b993bfca-9581-4488-a934-1192e42b4de1/cv/home",
              node: {
                urn: "ppb:obb:card:createdBets:aMvBuBIAACIAVFHA|obb_created_bets_card$b993bfca-9581-4488-a934-1192e42b4de1/cv/home",
                fixture: {
                  urn: "ppb:fixture:34812732",
                  runnerNames: {
                    home: "Juve Stabia",
                    away: "Calcio Avellino SSD",
                    __typename: "FixtureRunnerNames",
                  },
                  home: {
                    name: "Juve Stabia",
                    __typename: "FootballTeamDetails",
                  },
                  away: {
                    name: "Calcio Avellino SSD",
                    __typename: "FootballTeamDetails",
                  },
                  sportevent: {
                    urn: "ppb:event:34812732",
                    openDate: "2025-10-25T15:15:00.000Z",
                    __typename: "SportsEvent",
                  },
                  __typename: "FootballFixture",
                },
                eventViewLink: {
                  viewUrn: "ppb:tbd:view:event:34812732",
                  viewUrl: "football/italian-serie-b/juve-stabia-v-calcio-avellino-ssd/e-34812732",
                  viewDisplayMode: null,
                  __typename: "ViewLink",
                },
                footerViewLink: {
                  viewUrn: "ppb:tbd:view:event:34812732?=tabId=aFFKkREAAB4AmQM1",
                  viewUrl:
                    "football/italian-serie-b/juve-stabia-v-calcio-avellino-ssd/e-34812732?tabId=aFFKkREAAB4AmQM1",
                  viewDisplayMode: null,
                  __typename: "ViewLink",
                },
                bettingOpportunities: [
                  {
                    participants: [
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:42456/e/34812732",
                        player: {
                          id: "42456",
                          name: "Alessandro Gabrielloni",
                          seasonStats: null,
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5055",
                          name: "Juve Stabia",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:49791/e/34812732",
                        player: {
                          id: "49791",
                          name: "Leonardo Candellone",
                          seasonStats: null,
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5055",
                          name: "Juve Stabia",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 5,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:49857/e/34812732",
                        player: {
                          id: "49857",
                          name: "Nicola Mosti",
                          seasonStats: null,
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5055",
                          name: "Juve Stabia",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:55297/e/34812732",
                        player: {
                          id: "55297",
                          name: "Marco Varnier",
                          seasonStats: null,
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5055",
                          name: "Juve Stabia",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 2,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                      {
                        __typename: "ObbFootballPlayer",
                        urn: "ppb:obb:footballPlayer:55348/e/34812732",
                        player: {
                          id: "55348",
                          name: "Lorenzo Carissoni",
                          seasonStats: null,
                          __typename: "FootballPlayer",
                        },
                        team: {
                          id: "5055",
                          name: "Juve Stabia",
                          color: null,
                          __typename: "FootballTeamDetails",
                        },
                        incidentTypes: [
                          {
                            id: "GOALS",
                            resultType: {
                              min: 0,
                              max: 4,
                              __typename: "ObbRangeResultType",
                            },
                            __typename: "ObbIncidentType",
                          },
                        ],
                      },
                    ],

                    leg: {
                      templateId: "participantsCombined",
                      templateParams: {
                        participantIds: [
                          {
                            urn: "ppb:obb:footballPlayer:42456/e/34812732",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:49791/e/34812732",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:49857/e/34812732",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:55297/e/34812732",
                            __typename: "ObbFootballPlayer",
                          },
                          {
                            urn: "ppb:obb:footballPlayer:55348/e/34812732",
                            __typename: "ObbFootballPlayer",
                          },
                        ],

                        outcomeIds: ["GOALS"],
                        value: 1,
                        timePeriodId: "MATCH",
                        quantifier: "AT_LEAST",
                        __typename: "ObbSquadBetParams",
                      },
                      quote: {
                        __typename: "ObbQuoteSuccess",
                        price: {
                          decimal: 1.57,
                          fractional: {
                            numerator: 4,
                            denominator: 7,
                            __typename: "FractionalOdds",
                          },
                          __typename: "ObbOdds",
                        },
                      },
                      event: {
                        eventId: 34812732,
                        urn: "ppb:event:34812732",
                        name: "Juve Stabia v Calcio Avellino SSD",
                        __typename: "SportsEvent",
                      },
                      __typename: "ObbLeg",
                    },
                    __typename: "ObbBettingOpportunity",
                  },
                ],

                __typename: "ObbCreatedBetsCard",
              },
              __typename: "ObbCreatedBetsCardEdge",
            },
          ],

          __typename: "ObbCreatedBetsCardConnection",
        },
      },
      theme: null,
      __typename: "ViewItemEdge",
    },
  ],

  partialEdges: VIEW_PARTIAL_EDGES,
};

const IMPLY_BETS_RESPONSE = {
  betDefinitions: [
    {
      id: "90fc2c8e45ae0bb",
      details: {
        minStake: 0.1,
        maxStake: 12.0,
        maxPayout: 100000,
        minStakeIncrement: 0.01,
        price: {
          fractional: {
            numerator: 14,
            denominator: 10,
          },
          decimal: 1.36,
        },
      },
      result: {
        resultCode: "SUCCESS",
        errorDetails: null,
      },
    },
  ],

  combinedBetDefinitions: [],
  result: {
    resultCode: "SUCCESS",
    errorDetails: null,
  },
};

const SCA_INPLAY_FIRST_HALF_MOCK = {
  fixture: [
    {
      eventId: 2222222,
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
    {
      eventId: 3333333,
      score: {},
      duration: {
        period: "REGULAR",
        status: "INPLAY_FIRST_HALF",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      eventId: 2222222,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
    {
      eventId: 3333333,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
        clock: {
          minute: 0,
          second: 1,
        },
      },
    },
  ],
};

describe("OBB Created Bets", () => {
  describe("when opening homepage and there are 3 cards for created bets", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getObbImply(IMPLY_BETS_RESPONSE));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await browser.url(routes.getGenericViewUrl("home"));
    });

    it("[PRPI-7011] should see 3 cards", async () => {
      expect(await swimlanePO.scrollItems.length).toBe(3);

      // first card details
      expect(await firstCreatedBetsCard.header.getText()).toBe("Feb 1,\n12:30\nOud-Heverlee Leuven\nClub Brugge");
      expect(await firstCreatedBetsCard.seeAllContainer.getText()).toBe("See All Match Ups");
      expect(await firstCreatedBetsCard.betButtons[0].getText()).toBe("1.36");
      expect(await firstCreatedBetsCard.betButtons[1].getText()).toBe("2.12");
      expect(await firstCreatedBetsCard.betButtons[2].getText()).toBe("1.01");
      expect(await firstCreatedBetsCard.betButtons[3].getText()).toBe("2.01");
    });

    it("[PRPI-7012] should display a title and subtitle for each betting opportunity", async () => {
      const visibleMatchStatTitle = await firstCreatedBetsCard.matchStatTitle;
      const visibleMatchStatSubtitle = await firstCreatedBetsCard.matchStatSubtitle;
      const count = await visibleMatchStatTitle.length;
      const titles = [];
      const subtitles = [];

      for (let i = 0; i < count; i++) {
        titles.push(await visibleMatchStatTitle[i].getText());
        subtitles.push(await visibleMatchStatSubtitle[i].getText());
      }

      expect(titles).toEqual([
        "Shandre Campbell, Thibault Vlietinck, Roggerio Nyakossi, Sory Kaba & Christos Tzolis",
        "Shandre Campbell, Thibault Vlietinck, Roggerio Nyakossi, Sory Kaba & Christos Tzolis",
        "Roggerio Nyakossi, Sory Kaba & Christos Tzolis",
        "Shandre Campbell",
      ]);
      expect(subtitles).toEqual([
        "To Score 1+ Goals Between Them",
        "To Score 4+ Goals Between Them",
        "To Score More Goals Than Shandre Campbell & Thibault Vlietinck",
        "To Score More Goals Than Roggerio Nyakossi",
      ]);
    });

    it("[PRPI-7013] should display Contextual Stats with correct texts", async () => {
      const visibleContextualStats = await firstCreatedBetsCard.contextualStats;
      const texts = [];
      const count = await visibleContextualStats.length;

      for (let i = 0; i < count; i++) {
        texts.push(await visibleContextualStats[i].getText());
      }

      expect(texts).toEqual([
        "1.3 Avg goals, combined",
        "1.3 Avg goals, combined",
        "Avg goals - S. Campbell: 0.3 | R. Nyakossi: 0.3",
      ]);
      expect(count).toBe(3);
    });

    describe("and when clicking on odd on first card", () => {
      beforeAll(async () => {
        await firstCreatedBetsCard.betButtons[0].click();
      });

      it("[PRPI-7014] should add to betslip", async () => {
        expect(await betslipDrawerPO.header.isDisplayed()).toBe(true);
      });

      it("[PRPI-7015] bet button should be selected", async () => {
        await betslipDrawerPO.header.click();

        expect(
          await browser.containsClass(firstCreatedBetsCard.betButtons[0], SportsbookBetButtonPO.states.selected),
        ).toBe(true);

        expect(await minimizedBetslipPO.counter.getText()).toBe("1");
      });
    });

    describe("and when clicking on odd on second card (disabled)", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_INPLAY_FIRST_HALF_MOCK));
        await secondCreatedBetsCard.outcomesContainer.scrollIntoView({ block: "center", inline: "center" });
        await browser.waitUntilInViewport(secondCreatedBetsCard.outcomesContainer);
        await browser.waitUntil(async () => (await secondCreatedBetsCard.seeAllButton.isEnabled()) === false, 5000);
        await secondCreatedBetsCard.betButtons[0].click();
      });

      it("[PRPI-7016] see all button is disabled", async () => {
        expect(await secondCreatedBetsCard.seeAllButton.isEnabled()).toBe(false);
      });

      it("[PRPI-7017] bet button is now closed", async () => {
        expect(await secondCreatedBetsCard.betButtons[0].getText()).toBe("1.44");
      });

      it("[PRPI-7018] betslip counter remains 1", async () => {
        // I would like to test the snackbar but it disappears too quickly to be tested reliably
        expect(await minimizedBetslipPO.counter.getText()).toBe("1");
      });
    });
  });
});
