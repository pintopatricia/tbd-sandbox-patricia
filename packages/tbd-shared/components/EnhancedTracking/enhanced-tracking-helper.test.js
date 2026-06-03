import { getEnhancedTrackingData } from "./enhanced-tracking-helper";

const RESULT = "PLACED";

const INCLUDE_SUBSTITUTIONS = false;

const FOOTBALL_FIXTURE = {
  typename: "FootballFixture",
  home: {
    name: "Aston Villa",
  },
  away: {
    name: "Liverpool",
  },
  score: {
    home: 4,
    away: 2,
  },
  duration: {
    period: "REGULAR",
    status: "INPLAY_SECOND_HALF",
    clock: {
      minute: 85,
      second: 41,
    },
  },
};

const FOOTBALL_FIXTURE_WITH_PLAYER_STATS = {
  ...FOOTBALL_FIXTURE,
  players: [
    {
      id: "playerId_no_stats_mock",
      name: "playerId No Stats Name Mock",
      startingType: "LINEUP",
    },
    {
      id: "playerId_with_stats_mock",
      name: "playerId With Stats Name Mock",
      startingType: "LINEUP",
      stats: [
        {
          periodStatus: "FULL",
          period: undefined,
          corners: 17,
        },
        {
          periodStatus: "INPLAY_FIRST_HALF",
          period: "EXTRA",
          corners: 2,
        },
        {
          periodStatus: "INPLAY_SECOND_HALF",
          period: "EXTRA",
          corners: 1,
        },
        {
          periodStatus: "FULL",
          period: "REGULAR",
          corners: 14,
        },
        {
          periodStatus: "INPLAY_FIRST_HALF",
          period: "REGULAR",
          corners: 6,
        },
        {
          periodStatus: "INPLAY_SECOND_HALF",
          period: "REGULAR",
          corners: 8,
        },
      ],
    },
  ],
};

const FOOTBALL_PLAYER_STATS = [
  {
    periodStatus: "FULL",
    period: undefined,
    corners: 17,
  },
  {
    periodStatus: "INPLAY_FIRST_HALF",
    period: "EXTRA",
    corners: 2,
  },
  {
    periodStatus: "INPLAY_SECOND_HALF",
    period: "EXTRA",
    corners: 1,
  },
  {
    periodStatus: "FULL",
    period: "REGULAR",
    corners: 14,
  },
  {
    periodStatus: "INPLAY_FIRST_HALF",
    period: "REGULAR",
    corners: 6,
  },
  {
    periodStatus: "INPLAY_SECOND_HALF",
    period: "REGULAR",
    corners: 8,
  },
];

const FOOTBALL_PLAYER_SUB_STATS = FOOTBALL_PLAYER_STATS.map((stat) => ({
  ...stat,
  corners: 2,
}));

const FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS = {
  ...FOOTBALL_FIXTURE,
  players: [
    {
      id: "playerId_no_stats_mock",
      name: "playerId No Stats Name Mock",
      startingType: "LINEUP",
      substitutions: [
        {
          __typename: "FootballPlayerSub",
          player: {
            __typename: "FootballPlayer",
            id: 1234,
            name: "Substitute 1",
            stats: [],
          },
        },
        {
          __typename: "FootballPlayerSub",
          player: {
            __typename: "FootballPlayer",
            id: 2345,
            name: "Substitute 2",
            stats: [],
          },
        },
      ],
    },
    {
      id: "playerId_with_stats_mock",
      name: "playerId With Stats Name Mock",
      startingType: "LINEUP",
      stats: FOOTBALL_PLAYER_STATS,
      substitutions: [
        {
          __typename: "FootballPlayerSub",
          player: {
            __typename: "FootballPlayer",
            id: 1234,
            name: "Substitute 1",
            stats: FOOTBALL_PLAYER_SUB_STATS,
          },
        },
        {
          __typename: "FootballPlayerSub",
          player: {
            __typename: "FootballPlayer",
            id: 2345,
            name: "Substitute 2",
            stats: FOOTBALL_PLAYER_SUB_STATS,
          },
        },
      ],
    },
  ],
};

const FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS_WITH_NO_STATS = {
  ...FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS,
  players: FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS.players.map((player) => {
    if (player.substitutions) {
      return {
        ...player,
        substitutions: player.substitutions.map((sub) => ({
          ...sub,
          player: {
            ...sub.player,
            stats: [],
          },
        })),
      };
    }
    return player;
  }),
};

const FOOTBALL_FIXTURE_WITH_STATS = {
  ...FOOTBALL_FIXTURE,
  stats: [
    {
      period: null,
      periodStatus: "FULL",
      home: {
        corners: 11,
        goals: 4,
        totalCards: 6,
      },
      away: {
        corners: 9,
        goals: 2,
        totalCards: 8,
      },
      both: {
        corners: 20,
        goals: 6,
        totalCards: 14,
      },
    },
    {
      period: "EXTRA",
      periodStatus: "INPLAY_FIRST_HALF",
      home: {
        corners: 2,
        goals: 0,
        totalCards: 0,
      },
      away: {
        corners: 0,
        goals: 0,
        totalCards: 0,
      },
      both: {
        corners: 2,
        goals: 0,
        totalCards: 0,
      },
    },
    {
      period: "EXTRA",
      periodStatus: "INPLAY_SECOND_HALF",
      home: null,
      away: null,
      both: null,
    },
    {
      period: "REGULAR",
      periodStatus: "FULL",
      home: {
        corners: 9,
        goals: 4,
        totalCards: 6,
      },
      away: {
        corners: 9,
        goals: 2,
        totalCards: 8,
      },
      both: {
        corners: 18,
        goals: 6,
        totalCards: 14,
      },
    },
    {
      period: "REGULAR",
      periodStatus: "INPLAY_FIRST_HALF",
      home: {
        corners: 5,
        goals: 3,
        totalCards: 2,
      },
      away: {
        corners: 3,
        goals: 0,
        totalCards: 2,
      },
      both: {
        corners: 8,
        goals: 3,
        totalCards: 4,
      },
    },
    {
      period: "REGULAR",
      periodStatus: "INPLAY_SECOND_HALF",
      home: {
        corners: 4,
        goals: 1,
        totalCards: 4,
      },
      away: {
        corners: 6,
        goals: 2,
        totalCards: 6,
      },
      both: {
        corners: 10,
        goals: 3,
        totalCards: 10,
      },
    },
  ],
};

const STATS_THRESHOLD_DEF = {
  threshold: 3.5,
  comparison: "GREATER_THAN",
};

const FOOTBALL_QUERY_DEFAULT = {
  outcome: "corners",
  participant: {
    side: "home",
    type: "TEAM",
  },
  periodDefinition: {
    period: undefined,
    periodStatus: "FULL",
  },
  sport: "football",
};

const OUTCOME_DEFINITION_EXP_SINGULAR = {
  outcomeDefinitionEntries: [
    {
      outcomeDefinitionType: "OPERAND",
      outcomeDefinition: {
        query: FOOTBALL_QUERY_DEFAULT,
        statsThresholdDef: STATS_THRESHOLD_DEF,
      },
    },
  ],
};

const OUTCOME_DEFINITION_EXP_OR = {
  outcomeDefinitionEntries: [
    {
      outcomeDefinitionType: "OPERAND",
      outcomeDefinition: {
        query: FOOTBALL_QUERY_DEFAULT,
        statsThresholdDef: {
          ...STATS_THRESHOLD_DEF,
          threshold: 10.5,
        },
      },
    },
    {
      outcomeDefinitionType: "OPERAND",
      outcomeDefinition: {
        query: FOOTBALL_QUERY_DEFAULT,
        statsThresholdDef: STATS_THRESHOLD_DEF,
      },
    },
    {
      outcomeDefinitionType: "OPERATOR",
      operator: "OR",
    },
  ],
};

const OUTCOME_DEFINITION_EXP_AND = {
  outcomeDefinitionEntries: [
    {
      outcomeDefinitionType: "OPERAND",
      outcomeDefinition: {
        query: FOOTBALL_QUERY_DEFAULT,
        statsThresholdDef: {
          ...STATS_THRESHOLD_DEF,
          threshold: 10.5,
        },
      },
    },
    {
      outcomeDefinitionType: "OPERAND",
      outcomeDefinition: {
        query: FOOTBALL_QUERY_DEFAULT,
        statsThresholdDef: STATS_THRESHOLD_DEF,
      },
    },
    {
      outcomeDefinitionType: "OPERATOR",
      operator: "AND",
    },
  ],
};

const getFootballQuery = ({ outcome, type, playerId }) => ({
  outcome,
  participant: {
    side: "home",
    type,
    participantId: playerId,
  },
  periodDefinition: {
    period: undefined,
    periodStatus: "FULL",
  },
  sport: "football",
});

const BASKETBALL_FIXTURE = {
  typename: "BasketballFixture",
};

const CRICKET_FIXTURE = {
  typename: "CricketFixture",
};

const TABLE_TENNIS_FIXTURE = {
  typename: "TableTennisFixture",
};

const TENNIS_FIXTURE = {
  typename: "TennisFixture",
};

describe("Enhanced Tracking Helper", () => {
  describe("getEnhancedTrackingData", () => {
    describe("when the fixture is Preplay", () => {
      it("should return status as PENDING and currentValue as zero", () => {
        const result = getEnhancedTrackingData(
          { ...FOOTBALL_FIXTURE, fixtureStatus: "PRE_MATCH" },
          OUTCOME_DEFINITION_EXP_SINGULAR,
          INCLUDE_SUBSTITUTIONS,
          RESULT,
        );
        expect(result).toEqual([{ currentValue: 0, goal: 4, status: "PENDING", participantType: "TEAM" }]);
      });
    });

    describe("when bet result is Void", () => {
      it("should return status as PENDING and currentValue as zero", () => {
        const result = getEnhancedTrackingData(FOOTBALL_FIXTURE, OUTCOME_DEFINITION_EXP_SINGULAR, false, "VOID");

        expect(result).toEqual([{ currentValue: 0, goal: 4, status: "PENDING", participantType: "TEAM" }]);
      });
    });

    describe("when the fixture's typename is FootballFixture", () => {
      describe("when the participant type is TEAM", () => {
        describe("when the fixture doesn't have stats", () => {
          it("should return an array with one element with its goal and the status as PLACEHOLDER", () => {
            const result = getEnhancedTrackingData(
              FOOTBALL_FIXTURE,
              {
                outcomeDefinitionEntries: [
                  {
                    ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                    outcomeDefinition: {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                      query: getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                    },
                  },
                ],
              },
              INCLUDE_SUBSTITUTIONS,
              RESULT,
            );

            expect(result).toEqual([{ currentValue: 0, goal: 4, status: "PLACEHOLDER", participantType: "TEAM" }]);
          });
        });
        describe("when the fixture has stats", () => {
          describe("and when the query's participant type is not expected", () => {
            it("should return an empty array", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                          participant: {
                            ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }).participant,
                            type: "none",
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([]);
            });
          });

          describe("and when query's participant side is not defined", () => {
            it("should return an empty array", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                          participant: {
                            ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }).participant,
                            side: undefined,
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([]);
            });
          });

          describe("and when the query's participant side does not exist in fixture stats", () => {
            it("should return an empty array", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                          participant: {
                            ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }).participant,
                            side: "none",
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([]);
            });
          });

          describe("and when the query's periodStatus does not exist in the fixture stats", () => {
            it("should return an empty array", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                          periodDefinition: {
                            ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined })
                              .periodDefinition,
                            periodStatus: undefined,
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([]);
            });
          });

          describe("and when the query's periodDefinition does not exist in the fixture stats", () => {
            it("should return an empty array", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                          periodDefinition: {
                            period: undefined,
                            periodStatus: "INPLAY_FIRST_HALF",
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([]);
            });
          });

          describe("and when the query's outcome does not exist in fixture stats", () => {
            it("should return the currentValue as undefined", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                          outcome: "none",
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                {
                  currentValue: undefined,
                  goal: 4,
                  status: "ACTIVE",
                  participantType: "TEAM",
                },
              ]);
            });
          });

          describe("when the outcomeDefinitionExp only has one OPERAND with no OPERATOR", () => {
            it("should return an array with one element with the correct values", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([{ currentValue: 11, goal: 4, status: "ACTIVE", participantType: "TEAM" }]);
            });
          });
          describe("when the outcomeDefinitionExp has two OPERANDS and an OR", () => {
            it("should return an array with one element with the correct values from the first outcomeDefinition", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[1],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[1].outcomeDefinition,
                        query: getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[2],
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([{ currentValue: 11, goal: 11, status: "ACTIVE", participantType: "TEAM" }]);
            });
          });

          describe("when the outcomeDefinitionExp has two OPERANDS and an AND", () => {
            it("should return an array with two elements with the correct values", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({ outcome: "corners", type: "TEAM", playerId: undefined }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[1],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[1].outcomeDefinition,
                        query: getFootballQuery({ outcome: "goals", type: "TEAM", playerId: undefined }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[2],
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                { currentValue: 11, goal: 11, status: "ACTIVE", participantType: "TEAM" },
                { currentValue: 4, goal: 4, status: "ACTIVE", participantType: "TEAM" },
              ]);
            });
          });
        });
      });

      describe("when the participant type is PLAYER", () => {
        describe("when there is no player", () => {
          it("should return the default value for that operand", () => {
            const result = getEnhancedTrackingData(
              FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
              {
                outcomeDefinitionEntries: [
                  {
                    ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                    outcomeDefinition: {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                      query: getFootballQuery({
                        outcome: "corners",
                        type: "PLAYER",
                        playerId: "playerId_not_existing_mock",
                      }),
                    },
                  },
                ],
              },
              INCLUDE_SUBSTITUTIONS,
              RESULT,
            );

            expect(result).toEqual([
              {
                currentValue: 0,
                goal: 4,
                participantId: "playerId_not_existing_mock",
                participantType: "PLAYER",
                status: "PLACEHOLDER",
              },
            ]);
          });
        });

        describe("when there is no player stats", () => {
          it("should return the default value for that operand", () => {
            const result = getEnhancedTrackingData(
              FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
              {
                outcomeDefinitionEntries: [
                  {
                    ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                    outcomeDefinition: {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                      query: getFootballQuery({
                        outcome: "corners",
                        type: "PLAYER",
                        playerId: "playerId_no_stats_mock",
                      }),
                    },
                  },
                ],
              },
              INCLUDE_SUBSTITUTIONS,
              RESULT,
            );

            expect(result).toEqual([
              {
                currentValue: 0,
                goal: 4,
                participantId: "playerId_no_stats_mock",
                participantType: "PLAYER",
                status: "PLACEHOLDER",
              },
            ]);
          });
        });

        describe("when the player has stats", () => {
          describe("and when the query's participant type is not expected", () => {
            it("should return an empty array", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({
                            outcome: "corners",
                            type: "PLAYER",
                            playerId: "playerId_with_stats_mock",
                          }),
                          participant: {
                            ...getFootballQuery({
                              outcome: "corners",
                              type: "PLAYER",
                              playerId: "playerId_with_stats_mock",
                            }).participant,
                            type: "none",
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([]);
            });
          });

          describe("and when the query's periodStatus does not exist in the player stats", () => {
            it("should return the default value for that operand", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({
                            outcome: "corners",
                            type: "PLAYER",
                            playerId: "playerId_with_stats_mock",
                          }),
                          periodDefinition: {
                            ...getFootballQuery({
                              outcome: "corners",
                              type: "PLAYER",
                              playerId: "playerId_with_stats_mock",
                            }).periodDefinition,
                            periodStatus: undefined,
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                {
                  status: "ACTIVE",
                  goal: 4,
                  currentValue: 0,
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });

          describe("and when the query's periodDefinition does not exist in the player stats", () => {
            it("should return the default value for that operand", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({
                            outcome: "corners",
                            type: "PLAYER",
                            playerId: "playerId_with_stats_mock",
                          }),
                          periodDefinition: {
                            period: undefined,
                            periodStatus: "INPLAY_FIRST_HALF",
                          },
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                {
                  status: "ACTIVE",
                  goal: 4,
                  currentValue: 0,
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });

          describe("and when the query's outcome does not exist in player stats", () => {
            it("should return the currentValue as undefined", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: {
                          ...getFootballQuery({
                            outcome: "corners",
                            type: "PLAYER",
                            playerId: "playerId_with_stats_mock",
                          }),
                          outcome: "none",
                        },
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                {
                  currentValue: undefined,
                  goal: 4,
                  status: "ACTIVE",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });

          describe("when the outcomeDefinitionExp only has one OPERAND with no OPERATOR", () => {
            it("should return an array with one element with the correct values", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                {
                  currentValue: 17,
                  goal: 4,
                  status: "ACTIVE",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });

          describe("when the outcomeDefinitionExp has two OPERANDS and an OR", () => {
            it("should return an array with one element with the correct values from the first outcomeDefinition", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[1],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[1].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_OR.outcomeDefinitionEntries[2],
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                {
                  currentValue: 11,
                  goal: 11,
                  status: "ACTIVE",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });

          describe("when the outcomeDefinitionExp has two OPERANDS and an AND", () => {
            it("should return an array with two elements with the correct values", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[1],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[1].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[2],
                    },
                  ],
                },
                INCLUDE_SUBSTITUTIONS,
                RESULT,
              );

              expect(result).toEqual([
                {
                  currentValue: 17,
                  goal: 11,
                  status: "ACTIVE",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
                {
                  currentValue: 17,
                  goal: 4,
                  status: "ACTIVE",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });

          describe("when bet result is Void", () => {
            it("should return status as PENDING and currentValue as zero", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[1],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[1].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                    {
                      ...OUTCOME_DEFINITION_EXP_AND.outcomeDefinitionEntries[2],
                    },
                  ],
                },
                false,
                "VOID",
              );

              expect(result).toEqual([
                {
                  currentValue: 0,
                  goal: 11,
                  status: "PENDING",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
                {
                  currentValue: 0,
                  goal: 4,
                  status: "PENDING",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });
        });
      });

      describe("when the flag includeSubstitutions is true", () => {
        describe("and there are no players in the fixture", () => {
          it("should return an array with one element with the correct values", () => {
            const result = getEnhancedTrackingData(
              FOOTBALL_FIXTURE,
              {
                outcomeDefinitionEntries: [
                  {
                    ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                    outcomeDefinition: {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                      query: getFootballQuery({
                        outcome: "corners",
                        type: "PLAYER",
                        playerId: "player_does_not_exist",
                      }),
                    },
                  },
                ],
              },
              true,
              RESULT,
            );

            expect(result).toEqual([
              {
                currentValue: 0,
                goal: 4,
                status: "PLACEHOLDER",
                participantId: "player_does_not_exist",
                participantType: "PLAYER",
              },
            ]);
          });
        });

        describe("and the player id does not exist on the fixture stats", () => {
          it("should return an array with one element with the correct values", () => {
            const result = getEnhancedTrackingData(
              FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS,
              {
                outcomeDefinitionEntries: [
                  {
                    ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                    outcomeDefinition: {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                      query: getFootballQuery({
                        outcome: "corners",
                        type: "PLAYER",
                        playerId: "player_does_not_exist",
                      }),
                    },
                  },
                ],
              },
              true,
              RESULT,
            );

            expect(result).toEqual([
              {
                currentValue: 0,
                goal: 4,
                status: "PLACEHOLDER",
                participantId: "player_does_not_exist",
                participantType: "PLAYER",
              },
            ]);
          });
        });

        describe("and neither the player nor its subs have stats", () => {
          it("should return an array with one element with the correct values", () => {
            const result = getEnhancedTrackingData(
              FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS_WITH_NO_STATS,
              {
                outcomeDefinitionEntries: [
                  {
                    ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                    outcomeDefinition: {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                      query: getFootballQuery({
                        outcome: "corners",
                        type: "PLAYER",
                        playerId: "playerId_no_stats_mock",
                      }),
                    },
                  },
                ],
              },
              true,
              RESULT,
            );

            expect(result).toEqual([
              {
                currentValue: 0,
                goal: 4,
                status: "PLACEHOLDER",
                participantId: "playerId_no_stats_mock",
                participantType: "PLAYER",
              },
            ]);
          });
        });

        describe("and the player have stats but not its subs", () => {
          describe("when the outcomeDefinitionExp only has one OPERAND with no OPERATOR", () => {
            it("should return an array with one element with the correct values", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS_WITH_NO_STATS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                  ],
                },
                true,
                RESULT,
              );

              expect(result).toEqual([
                {
                  currentValue: 17,
                  goal: 4,
                  status: "ACTIVE",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });
        });

        describe("and the player and its subs have stats", () => {
          describe("when the outcomeDefinitionExp only has one OPERAND with no OPERATOR", () => {
            it("should return an array with one element with the correct values", () => {
              const result = getEnhancedTrackingData(
                FOOTBALL_FIXTURE_WITH_PLAYER_STATS_AND_SUBSTITUTIONS,
                {
                  outcomeDefinitionEntries: [
                    {
                      ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0],
                      outcomeDefinition: {
                        ...OUTCOME_DEFINITION_EXP_SINGULAR.outcomeDefinitionEntries[0].outcomeDefinition,
                        query: getFootballQuery({
                          outcome: "corners",
                          type: "PLAYER",
                          playerId: "playerId_with_stats_mock",
                        }),
                      },
                    },
                  ],
                },
                true,
                RESULT,
              );

              expect(result).toEqual([
                {
                  currentValue: 21,
                  goal: 4,
                  status: "ACTIVE",
                  participantId: "playerId_with_stats_mock",
                  participantType: "PLAYER",
                },
              ]);
            });
          });
        });
      });
    });

    describe("when the fixture's typename is BasketballFixture", () => {
      it("should return an empty array", () => {
        const result = getEnhancedTrackingData(
          BASKETBALL_FIXTURE,
          OUTCOME_DEFINITION_EXP_SINGULAR,
          INCLUDE_SUBSTITUTIONS,
          RESULT,
        );

        expect(result).toEqual([]);
      });
    });

    describe("when the fixture's typename is CricketFixture", () => {
      it("should return an empty array", () => {
        const result = getEnhancedTrackingData(
          CRICKET_FIXTURE,
          OUTCOME_DEFINITION_EXP_SINGULAR,
          INCLUDE_SUBSTITUTIONS,
          RESULT,
        );

        expect(result).toEqual([]);
      });
    });

    describe("when the fixture's typename is TableTennisFixture", () => {
      it("should return an empty array", () => {
        const result = getEnhancedTrackingData(
          TABLE_TENNIS_FIXTURE,
          OUTCOME_DEFINITION_EXP_SINGULAR,
          INCLUDE_SUBSTITUTIONS,
          RESULT,
        );

        expect(result).toEqual([]);
      });
    });

    describe("when the fixture's typename is TennisMatch", () => {
      it("should return an empty array", () => {
        const result = getEnhancedTrackingData(
          TENNIS_FIXTURE,
          OUTCOME_DEFINITION_EXP_SINGULAR,
          INCLUDE_SUBSTITUTIONS,
          RESULT,
        );

        expect(result).toEqual([]);
      });
    });

    describe("when the fixture's typename is not expected", () => {
      it("should return an empty array", () => {
        const result = getEnhancedTrackingData(
          { typename: undefined },
          OUTCOME_DEFINITION_EXP_SINGULAR,
          INCLUDE_SUBSTITUTIONS,
          RESULT,
        );

        expect(result).toEqual([]);
      });
    });
  });
});
