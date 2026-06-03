const { getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { SportsbookBetButtonSO } = require("../../../../screen-objects");

const mockService = new MockService();
const sportsbookBetButtonSO = new SportsbookBetButtonSO();
const MODULE_NAME = "obb_created_bets";

const VIEW_PARTIAL_EDGES = [
  {
    node: {
      __typename: "ObbCreatedBetsCardGroup",
      urn: "ppb:obb:createdBetsCardGroup:aMvBuBIAACIAVFHA/cv/home",
    },
  },
];

const EVENT_OPEN_DATE = "2070-05-05T18:00:00Z";

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
                  scheduledAt: EVENT_OPEN_DATE,
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
                    openDate: EVENT_OPEN_DATE,
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

const SCA_PRE_MATCH_MOCK = {
  fixture: [
    {
      eventId: 2222222,
      scheduledAt: EVENT_OPEN_DATE,
      score: {},
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
      },
    },
  ],
};

describe("OBB - Created bets", () => {
  describe("when I open home page", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_PRE_MATCH_MOCK));
      await startApp("home");
      await browser.waitUntilEquals(sportsbookBetButtonSO.odd, "1.36");
    });

    it("[PRPI-4870]_should_render_created_bets_card", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4870]_should_render_created_bets_card`)).misMatchPercentage,
      ).toBe(0);
    });
  });
});
