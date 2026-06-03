import {
  mapAmericanFootballFixtureUpdates,
  mapBaseballFixtureUpdates,
  mapBasketballFixtureUpdates,
  mapFootballFixtureUpdates,
  mapRacesStatusAndResultTypeUpdates,
  mapTennisFixtureUpdates,
  mapCricketFixtureUpdates,
  mapTableTennisFixtureUpdates,
  mapIceHockeyFixtureUpdates,
  mapRugbyUnionFixtureUpdates,
  mapRugbyLeagueFixtureUpdates,
  mapSnookerFixtureUpdates,
  mapAustralianRulesFixtureUpdates,
  mapDartsFixtureUpdates,
} from "./sports-content-api-service-mapper";

jest.mock("../helpers/clock-extra-minutes", () => ({
  getClockExtraMinutes: jest.fn((minute, period) => (period === "REGULAR" ? `${minute + 1}` : undefined)),
}));

describe("Sports Content API Service Mapper", () => {
  describe("mapFootballFixtureUpdates", () => {
    const UPDATES_MOCK = {
      football: {
        fixture: [
          {
            id: "12345",
            score: {
              home: 3,
              away: 3,
            },
            duration: {
              period: "EXTRA",
              status: "PENALTY_SHOOTOUT",
              clock: {
                __typename: "Clock",
                minute: 120,
                second: 0,
              },
              stoppageMinutes: 4,
            },
            stats: [
              {
                __typename: "FootballStats",
                periodStatus: "PRE_MATCH",
                period: "REGULAR",
                home: {
                  __typename: "FootballGameStats",
                  attacks: undefined,
                  possession: 1,
                  corners: 2,
                  yellowCards: 3,
                  redCards: 4,
                  totalCards: 7,
                  offsides: 5,
                  fouls: 6,
                  throwIns: 7,
                  freeKicks: 8,
                  goalKicks: 9,
                  blockedShots: 10,
                  dangerousAttacks: 11,
                  shotsOnTarget: 12,
                  shotsOffTarget: 13,
                  goals: 2,
                  totalShots: 25,
                },
                away: {
                  __typename: "FootballGameStats",
                  attacks: undefined,
                  possession: 2,
                  corners: 2,
                  yellowCards: 3,
                  redCards: 4,
                  totalCards: 7,
                  offsides: 5,
                  fouls: 6,
                  throwIns: 7,
                  freeKicks: 8,
                  goalKicks: 9,
                  blockedShots: 10,
                  dangerousAttacks: 11,
                  shotsOnTarget: 12,
                  shotsOffTarget: 13,
                  goals: 1,
                  totalShots: 25,
                },
                both: {
                  __typename: "FootballGameStats",
                  attacks: undefined,
                  possession: 3,
                  corners: 4,
                  yellowCards: 6,
                  redCards: 8,
                  totalCards: 14,
                  offsides: 10,
                  fouls: 12,
                  throwIns: 14,
                  freeKicks: 16,
                  goalKicks: 18,
                  blockedShots: 20,
                  dangerousAttacks: 22,
                  shotsOnTarget: 24,
                  shotsOffTarget: 26,
                  goals: 3,
                  totalShots: 50,
                },
              },
            ],
            penaltyShootout: {
              firstTeamToShoot: "HOME",
              nextTeamToShoot: "AWAY",
              penaltyScores: [
                {
                  penaltyNumber: 3,
                  side: "HOME",
                  shotResult: "SCORE",
                },
                {
                  penaltyNumber: 2,
                  side: "AWAY",
                  shotResult: "MISS",
                },
                {
                  penaltyNumber: 1,
                  side: "HOME",
                  shotResult: "MISS",
                },
              ],
            },
            players: [
              {
                __typename: "FootballPlayer",
                id: "playerId1",
                name: "Reinaldo",
                stats: [
                  {
                    periodDetails: {
                      periodStatus: "INPLAY_FIRST_HALF",
                      period: "REGULAR",
                      __typename: "FootballStats",
                    },
                    stats: {
                      __typename: "FootballPlayerStats",
                      yellowCards: 1,
                      redCards: 0,
                      totalCards: 1,
                      offsides: 5,
                      fouls: 0,
                      foulsWon: 1,
                      shotsOnTarget: 12,
                      shotsOffTarget: 13,
                      goals: 1,
                      passes: 22,
                      totalShots: 25,
                      assists: 3,
                      foulInvolvements: 1,
                    },
                  },
                  {
                    periodDetails: {
                      periodStatus: "INPLAY_SECOND_HALF",
                      period: "REGULAR",
                      __typename: "FootballStats",
                    },
                    stats: {
                      __typename: "FootballPlayerStats",
                      yellowCards: 2,
                      redCards: 1,
                      totalCards: 3,
                      offsides: 12,
                      fouls: 8,
                      foulsWon: 2,
                      shotsOnTarget: 16,
                      shotsOffTarget: 13,
                      goals: 4,
                      assists: 8,
                      passes: 35,
                      totalShots: 29,
                      foulInvolvements: 10,
                    },
                  },
                ],
                substitutions: [
                  {
                    __typename: "FootballPlayerSub",
                    player: {
                      __typename: "FootballPlayer",
                      id: "2",
                      name: "William Osula",
                      stats: [
                        {
                          periodDetails: {
                            periodStatus: "INPLAY_FIRST_HALF",
                            period: "REGULAR",
                            __typename: "FootballStats",
                          },
                          stats: {
                            __typename: "FootballPlayerStats",
                            yellowCards: 1,
                            redCards: 0,
                            totalCards: 1,
                            offsides: 5,
                            fouls: 0,
                            foulsWon: 1,
                            shotsOnTarget: 12,
                            shotsOffTarget: 13,
                            goals: 1,
                            passes: 22,
                            totalShots: 25,
                            assists: 3,
                            foulInvolvements: 1,
                          },
                        },
                        {
                          periodDetails: {
                            periodStatus: "INPLAY_SECOND_HALF",
                            period: "REGULAR",
                            __typename: "FootballStats",
                          },
                          stats: {
                            __typename: "FootballPlayerStats",
                            yellowCards: 2,
                            redCards: 1,
                            totalCards: 3,
                            offsides: 12,
                            fouls: 8,
                            foulsWon: 2,
                            shotsOnTarget: 16,
                            shotsOffTarget: 13,
                            goals: 4,
                            assists: 8,
                            passes: 35,
                            totalShots: 29,
                            foulInvolvements: 10,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    describe("when the optional fields are null", () => {
      it("should be mapped accordingly", () => {
        const updates = {
          football: {
            fixture: [
              {
                id: "12345",
                duration: null,
                stats: null,
                penaltyShootout: null,
                incidents: null,
              },
            ],
          },
        };

        const mappedUpdates = mapFootballFixtureUpdates(updates)["ppb:fixture:12345"];

        expect(mappedUpdates.score).toStrictEqual(undefined);
        expect(mappedUpdates.duration).toStrictEqual(undefined);
        expect(mappedUpdates.penaltyShootout).toStrictEqual(undefined);
        expect(mappedUpdates.stats).toStrictEqual([]);
        expect(mappedUpdates.incidents).toStrictEqual([]);
        expect(mappedUpdates.players).toStrictEqual(undefined);
      });
    });

    describe("when the stats field is undefined", () => {
      it("should be mapped accordingly", () => {
        const updates = {
          football: {
            fixture: [
              {
                id: "12345",
                duration: null,
                penaltyShootout: null,
                incidents: null,
              },
            ],
          },
        };

        const mappedUpdates = mapFootballFixtureUpdates(updates)["ppb:fixture:12345"];

        expect(mappedUpdates.score).toStrictEqual(undefined);
        expect(mappedUpdates.duration).toStrictEqual(undefined);
        expect(mappedUpdates.penaltyShootout).toStrictEqual(undefined);
        expect(mappedUpdates.stats).toStrictEqual(undefined);
        expect(mappedUpdates.incidents).toStrictEqual([]);
        expect(mappedUpdates.players).toStrictEqual(undefined);
      });
    });

    describe("when there are football incidents", () => {
      it("should be mapped accordingly", () => {
        const updates = {
          football: {
            fixture: [
              {
                id: "12345",
                duration: null,
                stats: null,
                penaltyShootout: null,
                incidents: [
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "EXTRA",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "AttackIncident",
                      side: "AWAY",
                      attackType: "DANGEROUS_ATTACK",
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "FoulIncident",
                      side: "AWAY",
                      foulType: "FOUL",
                      player: {
                        id: "1",
                        matchName: "Messi",
                        name: "Lionel Messi",
                        formationPlace: "10",
                        shirtNumber: 10,
                        position: "MIDFIELDER",
                        startingType: "LINEUP",
                      },
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "SetPieceIncident",
                      side: "AWAY",
                      setPieceType: "FREE_KICK",
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "ShotIncident",
                      side: "AWAY",
                      shotType: "SAVED",
                      player: {
                        id: "1",
                        name: "Lionel Messi",
                        formationPlace: "10",
                        matchName: "Messi",
                        shirtNumber: 10,
                        position: "MIDFIELDER",
                        startingType: "LINEUP",
                      },
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "PeriodIncident",
                      injuryTime: 2,
                      period: "REGULAR",
                      status: "INPLAY_SECOND_HALF",
                      periodType: "INJURY_TIME_UPDATE",
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "PenaltyShootoutIncident",
                      side: "HOME",
                      penaltyShootoutType: "SCORED",
                      player: {
                        id: "1",
                        matchName: "Messi",
                        name: "Lionel Messi",
                        formationPlace: "10",
                        shirtNumber: 10,
                        position: "MIDFIELDER",
                        startingType: "LINEUP",
                      },
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "PenaltyIncident",
                      side: "HOME",
                      penaltyType: "AWARDED",
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "SubstitutionIncident",
                      side: "HOME",
                      playerIn: {
                        id: "1",
                        name: "Lionel Messi",
                        formationPlace: "10",
                        matchName: "Messi",
                        shirtNumber: 10,
                        position: "MIDFIELDER",
                        startingType: "LINEUP",
                      },
                      playerOut: {
                        id: "2",
                        name: "Cristiano Ronaldo",
                        formationPlace: "7",
                        matchName: "Ronaldo",
                        shirtNumber: 7,
                        position: "FORWARD",
                        startingType: "LINEUP",
                      },
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "CardIncident",
                      cardType: "YELLOW",
                      side: "HOME",
                      player: {
                        id: "1",
                        matchName: "Messi",
                        name: "Lionel Messi",
                        formationPlace: "10",
                        shirtNumber: 10,
                        position: "MIDFIELDER",
                        startingType: "LINEUP",
                      },
                    },
                  },
                  {
                    clock: {
                      minute: 15,
                      second: 12,
                    },
                    period: "REGULAR",
                    periodStatus: "INPLAY_SECOND_HALF",
                    details: {
                      __typename: "GoalIncident",
                      goalType: "NORMAL",
                      side: "HOME",
                      goalScorer: {
                        id: "1",
                        name: "Lionel Messi",
                        formationPlace: "10",
                        matchName: "Messi",
                        shirtNumber: 10,
                        position: "MIDFIELDER",
                        startingType: "LINEUP",
                      },
                      assist: {
                        id: "2",
                        name: "Cristiano Ronaldo",
                        matchName: "Ronaldo",
                        formationPlace: "7",
                        shirtNumber: 7,
                        position: "FORWARD",
                        startingType: "LINEUP",
                      },
                    },
                  },
                ],
              },
            ],
          },
        };

        const mappedUpdates = mapFootballFixtureUpdates(updates)["ppb:fixture:12345"];

        expect(mappedUpdates.incidents.reverse()).toStrictEqual([
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "GoalIncident",
            details: {
              __typename: "GoalIncident",
              goalType: "NORMAL",
              side: "HOME",
              goalScorer: {
                __typename: "FootballPlayer",
                id: "1",
                name: "Lionel Messi",
                formationPlace: "10",
                matchName: "Messi",
                shirtNumber: 10,
                position: "MIDFIELDER",
                startingType: "LINEUP",
              },
              assist: {
                __typename: "FootballPlayer",
                id: "2",
                name: "Cristiano Ronaldo",
                matchName: "Ronaldo",
                formationPlace: "7",
                shirtNumber: 7,
                position: "FORWARD",
                startingType: "LINEUP",
              },
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "CardIncident",
            details: {
              __typename: "CardIncident",
              cardType: "YELLOW",
              side: "HOME",
              player: {
                __typename: "FootballPlayer",
                id: "1",
                name: "Lionel Messi",
                formationPlace: "10",
                matchName: "Messi",
                shirtNumber: 10,
                position: "MIDFIELDER",
                startingType: "LINEUP",
              },
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "SubstitutionIncident",
            details: {
              __typename: "SubstitutionIncident",
              side: "HOME",
              playerIn: {
                __typename: "FootballPlayer",
                id: "1",
                name: "Lionel Messi",
                formationPlace: "10",
                matchName: "Messi",
                shirtNumber: 10,
                position: "MIDFIELDER",
                startingType: "LINEUP",
              },
              playerOut: {
                __typename: "FootballPlayer",
                id: "2",
                name: "Cristiano Ronaldo",
                matchName: "Ronaldo",
                formationPlace: "7",
                shirtNumber: 7,
                position: "FORWARD",
                startingType: "LINEUP",
              },
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "PenaltyIncident",
            details: {
              __typename: "PenaltyIncident",
              side: "HOME",
              penaltyType: "AWARDED",
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "PenaltyShootoutIncident",
            details: {
              __typename: "PenaltyShootoutIncident",
              side: "HOME",
              penaltyShootoutType: "SCORED",
              player: {
                __typename: "FootballPlayer",
                id: "1",
                name: "Lionel Messi",
                formationPlace: "10",
                matchName: "Messi",
                shirtNumber: 10,
                position: "MIDFIELDER",
                startingType: "LINEUP",
              },
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "PeriodIncident",
            details: {
              __typename: "PeriodIncident",
              injuryTime: 2,
              period: "REGULAR",
              status: "INPLAY_SECOND_HALF",
              periodType: "INJURY_TIME_UPDATED",
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "ShotIncident",
            details: {
              __typename: "ShotIncident",
              side: "AWAY",
              shotType: "SAVED",
              player: {
                __typename: "FootballPlayer",
                id: "1",
                name: "Lionel Messi",
                formationPlace: "10",
                matchName: "Messi",
                shirtNumber: 10,
                position: "MIDFIELDER",
                startingType: "LINEUP",
              },
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "SetPieceIncident",
            details: {
              __typename: "SetPieceIncident",
              side: "AWAY",
              setPieceType: "FREE_KICK",
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: "16",
            period: "REGULAR",
            type: "FoulIncident",
            periodStatus: "INPLAY_SECOND_HALF",
            details: {
              __typename: "FoulIncident",
              side: "AWAY",
              foulType: "FOUL",
              player: {
                __typename: "FootballPlayer",
                id: "1",
                name: "Lionel Messi",
                formationPlace: "10",
                matchName: "Messi",
                shirtNumber: 10,
                position: "MIDFIELDER",
                startingType: "LINEUP",
              },
            },
          },
          {
            __typename: "FootballIncident",
            clock: {
              __typename: "Clock",
              minute: 15,
              second: 12,
            },
            clockExtraMinutes: undefined,
            period: "EXTRA",
            periodStatus: "INPLAY_SECOND_HALF",
            type: "AttackIncident",
            details: {
              __typename: "AttackIncident",
              side: "AWAY",
              attackType: 0,
            },
          },
        ]);
      });
    });

    describe("when there are no players", () => {
      const updates = {
        ...UPDATES_MOCK,
        football: {
          fixture: [
            {
              ...UPDATES_MOCK.football.fixture[0],
              players: [null],
            },
          ],
        },
      };

      it("should be mapped accordingly with no players", () => {
        const mappedUpdates = mapFootballFixtureUpdates(updates)["ppb:fixture:12345"];

        expect(mappedUpdates.players).toStrictEqual([]);
      });
    });

    describe("when there are players with no stats updates", () => {
      const updates = {
        ...UPDATES_MOCK,
        football: {
          fixture: [
            {
              ...UPDATES_MOCK.football.fixture[0],
              players: [
                {
                  ...UPDATES_MOCK.football.fixture[0].players[0],
                  name: null,
                  stats: undefined,
                },
              ],
            },
          ],
        },
      };

      it("should be mapped accordingly with no player stats", () => {
        const mappedUpdates = mapFootballFixtureUpdates(updates)["ppb:fixture:12345"];

        expect(mappedUpdates.players).toStrictEqual([
          {
            __typename: "FootballPlayer",
            id: "playerId1",
            name: undefined,
            stats: undefined,
            substitutions: [
              {
                __typename: "FootballPlayerSub",
                player: {
                  __typename: "FootballPlayer",
                  id: "2",
                  name: "William Osula",
                  stats: [
                    {
                      __typename: "FootballPlayerStats",
                      period: "REGULAR",
                      periodStatus: "INPLAY_FIRST_HALF",
                      goals: 1,
                      fouls: 0,
                      foulsWon: 1,
                      foulInvolvements: 1,
                      totalCards: 1,
                      passes: 22,
                      shotsOnTarget: 12,
                      totalShots: 25,
                      assists: 3,
                    },
                    {
                      __typename: "FootballPlayerStats",
                      period: "REGULAR",
                      periodStatus: "INPLAY_SECOND_HALF",
                      goals: 4,
                      fouls: 8,
                      foulsWon: 2,
                      foulInvolvements: 10,
                      totalCards: 3,
                      passes: 35,
                      shotsOnTarget: 16,
                      totalShots: 29,
                      assists: 8,
                    },
                  ],
                },
              },
            ],
          },
        ]);
      });
    });

    describe("when there are players with no substitutions updates", () => {
      const updates = {
        ...UPDATES_MOCK,
        football: {
          fixture: [
            {
              ...UPDATES_MOCK.football.fixture[0],
              players: [
                {
                  ...UPDATES_MOCK.football.fixture[0].players[0],
                  substitutions: [null],
                },
              ],
            },
          ],
        },
      };

      it("should be mapped accordingly with no substitutions", () => {
        const mappedUpdates = mapFootballFixtureUpdates(updates)["ppb:fixture:12345"];

        expect(mappedUpdates.players).toStrictEqual([
          {
            __typename: "FootballPlayer",
            id: "playerId1",
            name: "Reinaldo",
            stats: [
              {
                __typename: "FootballPlayerStats",
                period: "REGULAR",
                periodStatus: "INPLAY_FIRST_HALF",
                goals: 1,
                fouls: 0,
                foulsWon: 1,
                foulInvolvements: 1,
                totalCards: 1,
                passes: 22,
                shotsOnTarget: 12,
                totalShots: 25,
                assists: 3,
              },
              {
                __typename: "FootballPlayerStats",
                period: "REGULAR",
                periodStatus: "INPLAY_SECOND_HALF",
                goals: 4,
                fouls: 8,
                foulsWon: 2,
                foulInvolvements: 10,
                totalCards: 3,
                passes: 35,
                shotsOnTarget: 16,
                totalShots: 29,
                assists: 8,
              },
            ],
            substitutions: [],
          },
        ]);
      });
    });

    describe("when there are substitutions with no stats updates", () => {
      const updates = {
        ...UPDATES_MOCK,
        football: {
          fixture: [
            {
              ...UPDATES_MOCK.football.fixture[0],
              players: [
                {
                  ...UPDATES_MOCK.football.fixture[0].players[0],
                  substitutions: [
                    {
                      ...UPDATES_MOCK.football.fixture[0].players[0].substitutions[0],
                      player: {
                        ...UPDATES_MOCK.football.fixture[0].players[0].substitutions[0].player,
                        stats: undefined,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      it("should be mapped accordingly with no substitution stats", () => {
        const mappedUpdates = mapFootballFixtureUpdates(updates)["ppb:fixture:12345"];

        expect(mappedUpdates.players).toStrictEqual([
          {
            __typename: "FootballPlayer",
            id: "playerId1",
            name: "Reinaldo",
            stats: [
              {
                __typename: "FootballPlayerStats",
                period: "REGULAR",
                periodStatus: "INPLAY_FIRST_HALF",
                goals: 1,
                fouls: 0,
                foulsWon: 1,
                foulInvolvements: 1,
                totalCards: 1,
                passes: 22,
                shotsOnTarget: 12,
                totalShots: 25,
                assists: 3,
              },
              {
                __typename: "FootballPlayerStats",
                period: "REGULAR",
                periodStatus: "INPLAY_SECOND_HALF",
                goals: 4,
                fouls: 8,
                foulsWon: 2,
                foulInvolvements: 10,
                totalCards: 3,
                passes: 35,
                shotsOnTarget: 16,
                totalShots: 29,
                assists: 8,
              },
            ],
            substitutions: [
              {
                __typename: "FootballPlayerSub",
                player: {
                  __typename: "FootballPlayer",
                  id: "2",
                  name: "William Osula",
                  stats: undefined,
                },
              },
            ],
          },
        ]);
      });
    });

    describe("when there are all types of updates", () => {
      it("should be mapped accordingly", () => {
        const mappedUpdates = mapFootballFixtureUpdates(UPDATES_MOCK)["ppb:fixture:12345"];

        expect(mappedUpdates.score).toStrictEqual({ home: 3, away: 3 });
        expect(mappedUpdates.duration).toStrictEqual({
          clock: { __typename: "Clock", minute: 120, second: undefined },
          period: "EXTRA",
          status: "PENALTY_SHOOTOUT",
          stoppageMinutes: 4,
        });
        expect(mappedUpdates.penaltyShootout).toStrictEqual({
          firstTeamToShoot: "HOME",
          nextTeamToShoot: "AWAY",
          penaltyFormat: undefined,
          penaltyScores: [
            { penaltyNumber: 3, shotResult: "SCORE", side: "HOME" },
            { penaltyNumber: 2, shotResult: "MISS", side: "AWAY" },
            { penaltyNumber: 1, shotResult: "MISS", side: "HOME" },
          ],
        });
        expect(mappedUpdates.incidents).toStrictEqual([]);
        expect(mappedUpdates.stats).toStrictEqual([
          {
            __typename: "FootballStats",
            periodStatus: "PRE_MATCH",
            period: "REGULAR",
            home: {
              __typename: "FootballGameStats",
              attacks: undefined,
              possession: 1,
              corners: 2,
              yellowCards: 3,
              redCards: 4,
              totalCards: 7,
              offsides: 5,
              fouls: 6,
              throwIns: 7,
              freeKicks: 8,
              goalKicks: 9,
              blockedShots: 10,
              dangerousAttacks: 11,
              shotsOnTarget: 12,
              shotsOffTarget: 13,
              goals: 2,
              totalShots: 25,
            },
            away: {
              __typename: "FootballGameStats",
              attacks: undefined,
              possession: 2,
              corners: 2,
              yellowCards: 3,
              redCards: 4,
              totalCards: 7,
              offsides: 5,
              fouls: 6,
              throwIns: 7,
              freeKicks: 8,
              goalKicks: 9,
              blockedShots: 10,
              dangerousAttacks: 11,
              shotsOnTarget: 12,
              shotsOffTarget: 13,
              goals: 1,
              totalShots: 25,
            },
            both: {
              __typename: "FootballGameStats",
              attacks: undefined,
              possession: 3,
              corners: 4,
              yellowCards: 6,
              redCards: 8,
              totalCards: 14,
              offsides: 10,
              fouls: 12,
              throwIns: 14,
              freeKicks: 16,
              goalKicks: 18,
              blockedShots: 20,
              dangerousAttacks: 22,
              shotsOnTarget: 24,
              shotsOffTarget: 26,
              totalShots: 50,
              goals: 3,
            },
          },
        ]);
        expect(mappedUpdates.players).toStrictEqual([
          {
            __typename: "FootballPlayer",
            id: "playerId1",
            name: "Reinaldo",
            stats: [
              {
                __typename: "FootballPlayerStats",
                period: "REGULAR",
                periodStatus: "INPLAY_FIRST_HALF",
                goals: 1,
                fouls: 0,
                foulsWon: 1,
                foulInvolvements: 1,
                totalCards: 1,
                passes: 22,
                shotsOnTarget: 12,
                totalShots: 25,
                assists: 3,
              },
              {
                __typename: "FootballPlayerStats",
                period: "REGULAR",
                periodStatus: "INPLAY_SECOND_HALF",
                goals: 4,
                fouls: 8,
                foulsWon: 2,
                foulInvolvements: 10,
                totalCards: 3,
                passes: 35,
                shotsOnTarget: 16,
                totalShots: 29,
                assists: 8,
              },
            ],
            substitutions: [
              {
                __typename: "FootballPlayerSub",
                player: {
                  __typename: "FootballPlayer",
                  id: "2",
                  name: "William Osula",
                  stats: [
                    {
                      __typename: "FootballPlayerStats",
                      period: "REGULAR",
                      periodStatus: "INPLAY_FIRST_HALF",
                      goals: 1,
                      fouls: 0,
                      foulsWon: 1,
                      foulInvolvements: 1,
                      totalCards: 1,
                      passes: 22,
                      shotsOnTarget: 12,
                      totalShots: 25,
                      assists: 3,
                    },
                    {
                      __typename: "FootballPlayerStats",
                      period: "REGULAR",
                      periodStatus: "INPLAY_SECOND_HALF",
                      goals: 4,
                      fouls: 8,
                      foulsWon: 2,
                      foulInvolvements: 10,
                      totalCards: 3,
                      passes: 35,
                      shotsOnTarget: 16,
                      totalShots: 29,
                      assists: 8,
                    },
                  ],
                },
              },
            ],
          },
        ]);
      });
    });
  });

  describe("mapRacesStatusAndResultTypeUpdates", () => {
    describe("when there are updates with status and resultType", () => {
      it("should return the mapped stated accordingly", () => {
        const updates = {
          horseRacing: {
            race: [
              {
                id: "12345",
                details: {
                  status: "ABANDONED",
                  resultType: "QUICK_RESULT",
                },
              },
            ],
          },
        };

        const mappedUpdates = mapRacesStatusAndResultTypeUpdates(updates);

        expect(mappedUpdates).toStrictEqual({
          "ppb:race:12345": {
            status: "ABANDONED",
            resultType: "QUICK_RESULT",
          },
        });
      });
    });

    describe("when there are updates with status but the resultType is null", () => {
      it("should return the mapped stated accordingly", () => {
        const updates = {
          horseRacing: {
            race: [
              {
                id: "12345",
                details: {
                  status: "ABANDONED",
                  resultType: null,
                },
              },
            ],
          },
        };

        const mappedUpdates = mapRacesStatusAndResultTypeUpdates(updates);

        expect(mappedUpdates).toStrictEqual({
          "ppb:race:12345": {
            status: "ABANDONED",
          },
        });
      });
    });
  });

  describe("mapTennisFixtureUpdates", () => {
    describe("when there are all types of updates", () => {
      it("should be mapped accordingly", () => {
        const updates = {
          tennis: {
            match: [
              {
                id: "98765",
                teamAScore: 2,
                teamBScore: 3,
                scheduledStartTime: "2022-01-16T20:00:00Z",
                actualStartTime: null,
                type: "SINGLES",
                gender: null,
                surface: "LAVA",
                status: {
                  __typename: "TennisMatchStatus",
                  status: "INTERRUPTED",
                  reason: "SAVAGE_MONKEY_ATTACK",
                },
                currentSet: {
                  __typename: "TennisSet",
                  number: 1,
                  teamAScore: 2,
                  teamBScore: 3,
                  currentGame: {
                    __typename: "TennisGame",
                    type: "NORMAL",
                    number: 1,
                    teamAScore: 2,
                    teamBScore: 3,
                    pointNumber: null,
                    teamServing: null,
                    pointWinner: null,
                    serveNumber: null,
                  },
                  previousGames: null,
                },
              },
            ],
          },
        };

        const mappedUpdates = mapTennisFixtureUpdates(updates)["ppb:fixture:98765"];

        expect(mappedUpdates.scheduledStartTime).toStrictEqual(new Date("2022-01-16T20:00:00.000Z"));
        expect(mappedUpdates.actualStartTime).toStrictEqual(undefined);
        expect(mappedUpdates.teamAScore).toStrictEqual(2);
        expect(mappedUpdates.teamBScore).toStrictEqual(3);
        expect(mappedUpdates.currentSet).toStrictEqual({
          currentGame: {
            teamAScore: 2,
            teamBScore: 3,
            teamServing: undefined,
            type: "NORMAL",
          },
          teamAScore: 2,
          teamBScore: 3,
        });
        expect(mappedUpdates.status).toStrictEqual({
          status: "INTERRUPTED",
          reason: undefined,
        });
      });
    });
  });

  describe("mapBaseballFixtureUpdates", () => {
    describe("when there is no baseballFixture in the updates", () => {
      const updates = {
        baseball: {},
      };

      it("should return null", () => {
        expect(mapBaseballFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is baseballFixture with empty array", () => {
      const updates = {
        baseball: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapBaseballFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is baseballFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return null", () => {
          const updates = {
            baseball: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapBaseballFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no clock information", () => {
        it("should return clock information as undefined", () => {
          const updates = {
            baseball: {
              fixture: [
                {
                  id: "123456",
                  clock: null,
                  scorePerInning: [
                    {
                      score: {
                        home: 1,
                        away: 0,
                      },
                      period: "INNING_1",
                    },
                  ],
                  score: {
                    home: 1,
                    away: 0,
                  },
                },
              ],
            },
          };

          expect(mapBaseballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:123456": {
              clock: undefined,
              scorePerInning: [
                {
                  score: {
                    home: 1,
                    away: 0,
                  },
                  period: "INNING_1",
                },
              ],
              score: {
                home: 1,
                away: 0,
              },
            },
          });
        });
      });

      describe("and clock information is an empty array (or object without period)", () => {
        it("should return clock information as an empty object (or undefined period)", () => {
          const updates = {
            baseball: {
              fixture: [
                {
                  id: "123456",
                  clock: {}, // Assuming empty object from GQL partial
                  scorePerInning: [],
                  score: {
                    home: 1,
                    away: 0,
                  },
                },
              ],
            },
          };

          expect(mapBaseballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:123456": {
              clock: { period: undefined }, // Based on extractor logic: period || undefined
              scorePerInning: [],
              score: {
                home: 1,
                away: 0,
              },
            },
          });
        });
      });

      describe("and there is no scorePerInning", () => {
        it("should return scorePerInning as undefined", () => {
          const updates = {
            baseball: {
              fixture: [
                {
                  id: "123456",
                  score: {
                    home: 5,
                    away: 2,
                  },
                  clock: {
                    period: "INNING_5",
                  },
                },
              ],
            },
          };

          expect(mapBaseballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:123456": {
              clock: { period: "INNING_5" },
              scorePerInning: undefined,
              score: { home: 5, away: 2 },
            },
          });
        });
      });

      describe("and scorePerInning has empty object", () => {
        it("should return scorePerInning with mapped undefined values", () => {
          const updates = {
            baseball: {
              fixture: [
                {
                  id: "123456",
                  score: {
                    home: 5,
                    away: 2,
                  },
                  clock: {
                    period: "INNING_5",
                  },
                  scorePerInning: [{}],
                },
              ],
            },
          };

          expect(mapBaseballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:123456": {
              clock: { period: "INNING_5" },
              scorePerInning: [{ period: undefined, score: undefined }],
              score: { home: 5, away: 2 },
            },
          });
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            baseball: {
              fixture: [
                {
                  id: "123456",
                  clock: {
                    period: "INNING_5",
                  },
                  scorePerInning: [],
                },
              ],
            },
          };

          expect(mapBaseballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:123456": {
              clock: { period: "INNING_5" },
              scorePerInning: [],
              score: undefined,
            },
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          baseball: {
            fixture: [
              {
                id: "123456",
                score: {
                  home: 2,
                  away: 1,
                },
                clock: {
                  period: "INNING_3",
                },
                scorePerInning: [
                  {
                    score: {
                      home: 0,
                      away: 0,
                    },
                    period: "INNING_1",
                  },
                  {
                    score: {
                      home: 1,
                      away: 1,
                    },
                    period: "INNING_2",
                  },
                  {
                    score: {
                      home: 1,
                      away: 0,
                    },
                    period: "INNING_3",
                  },
                ],
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapBaseballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:123456": {
              clock: { period: "INNING_3" },
              scorePerInning: [
                { period: "INNING_1", score: { home: 0, away: 0 } },
                { period: "INNING_2", score: { home: 1, away: 1 } },
                { period: "INNING_3", score: { home: 1, away: 0 } },
              ],
              score: { home: 2, away: 1 },
            },
          });
        });
      });
    });
  });

  describe("mapBasketballFixtureUpdates", () => {
    describe("when there is no basketballFixture in the updates", () => {
      const updates = {
        basketball: {},
      };

      it("should return null", () => {
        expect(mapBasketballFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is basketballFixture with empty array", () => {
      const updates = {
        basketball: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapBasketballFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is basketballFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return null", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no clock informaiton", () => {
        it("should return clock information as undefined", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: "31195168",
                  clock: null,
                  periodScores: [
                    {
                      score: {
                        home: 8,
                        away: 14,
                      },
                      period: "PERIOD_1",
                    },
                  ],
                  score: {
                    home: 65,
                    away: 73,
                  },
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: undefined,
              periodScores: [
                {
                  score: {
                    home: 8,
                    away: 14,
                  },
                  period: "PERIOD_1",
                },
              ],
              score: {
                away: 73,
                home: 65,
              },
            },
          });
        });
      });

      describe("and clock informaiton is an empty array", () => {
        it("should return clock information as an empty object", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: "31195168",
                  clock: [],
                  periodScores: [
                    {
                      score: {
                        home: 8,
                        away: 14,
                      },
                      period: "PERIOD_1",
                    },
                  ],
                  score: {
                    home: 65,
                    away: 73,
                  },
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: {},
              periodScores: [
                {
                  score: {
                    home: 8,
                    away: 14,
                  },
                  period: "PERIOD_1",
                },
              ],
              score: {
                away: 73,
                home: 65,
              },
            },
          });
        });
      });

      describe("and clock informaiton does't contain timeRemaining neither timeElapsed", () => {
        it("should return clock information with timeElapsed and timeRemaining undefined", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: "31195168",
                  clock: {
                    timeElapsed: null,
                    timeRemaining: null,
                    period: "PERIOD_1",
                    segment: "Q1",
                  },
                  periodScores: [
                    {
                      score: {
                        home: 8,
                        away: 14,
                      },
                      period: "PERIOD_1",
                    },
                  ],
                  score: {
                    home: 65,
                    away: 73,
                  },
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: {
                period: "PERIOD_1",
                segment: "Q1",
              },
              periodScores: [
                {
                  score: {
                    home: 8,
                    away: 14,
                  },
                  period: "PERIOD_1",
                },
              ],
              score: {
                away: 73,
                home: 65,
              },
            },
          });
        });
      });

      describe("and clock informaiton contains timeRemaining set to zero", () => {
        it("should return clock information containing timeRemaining set to zero", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: "31195168",
                  clock: {
                    timeRemaining: 0,
                    period: "PERIOD_1",
                    segment: "Q1",
                  },
                  periodScores: [
                    {
                      score: {
                        home: 8,
                        away: 14,
                      },
                      period: "PERIOD_1",
                    },
                  ],
                  score: {
                    home: 65,
                    away: 73,
                  },
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: {
                period: "PERIOD_1",
                segment: "Q1",
                timeRemaining: 0,
              },
              periodScores: [
                {
                  score: {
                    home: 8,
                    away: 14,
                  },
                  period: "PERIOD_1",
                },
              ],
              score: {
                away: 73,
                home: 65,
              },
            },
          });
        });
      });

      describe("and there is no pedriod scores", () => {
        it("should return period scores as an empty array", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: "31195168",
                  score: {
                    home: 65,
                    away: 73,
                  },
                  clock: {
                    period: "END_OVERTIME",
                    segment: "OT",
                    timeElapsed: 300,
                    timeRemaining: 300,
                  },
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: { period: "END_OVERTIME", segment: "OT", timeElapsed: 300, timeRemaining: 300 },
              periodScores: [],
              score: { away: 73, home: 65 },
            },
          });
        });
      });

      describe("and pedriod scores is has empty object", () => {
        it("should return period scores with an empty object", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: "31195168",
                  score: {
                    home: 65,
                    away: 73,
                  },
                  clock: {
                    period: "END_OVERTIME",
                    segment: "OT",
                    timeElapsed: 300,
                    timeRemaining: 300,
                  },
                  periodScores: [{}],
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: { period: "END_OVERTIME", segment: "OT", timeElapsed: 300, timeRemaining: 300 },
              periodScores: [{}],
              score: { away: 73, home: 65 },
            },
          });
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            basketball: {
              fixture: [
                {
                  id: "31195168",

                  clock: {
                    period: "END_OVERTIME",
                    segment: "OT",
                    timeElapsed: 300,
                    timeRemaining: 300,
                  },
                  periodScores: [{}],
                },
              ],
            },
          };

          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: { period: "END_OVERTIME", segment: "OT", timeElapsed: 300, timeRemaining: 300 },
              periodScores: [{}],
            },
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          basketball: {
            fixture: [
              {
                id: "31195168",
                score: {
                  home: 65,
                  away: 73,
                },
                clock: {
                  period: "END_OVERTIME",
                  segment: "OT",
                  timeElapsed: 300,
                  timeRemaining: 300,
                },
                periodScores: [
                  {
                    score: {
                      home: 8,
                      away: 14,
                    },
                    period: "PERIOD_1",
                  },
                  {
                    score: {
                      home: 13,
                      away: 10,
                    },
                    period: "PERIOD_2",
                  },
                  {
                    score: {
                      home: 16,
                      away: 20,
                    },
                    period: "PERIOD_3",
                  },
                  {
                    score: {
                      home: 22,
                      away: 15,
                    },
                    period: "PERIOD_4",
                  },
                  {
                    score: {
                      home: 6,
                      away: 14,
                    },
                    period: "OVERTIME",
                  },
                ],
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapBasketballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              clock: { period: "END_OVERTIME", segment: "OT", timeElapsed: 300, timeRemaining: 300 },
              periodScores: [
                { period: "PERIOD_1", score: { away: 14, home: 8 } },
                { period: "PERIOD_2", score: { away: 10, home: 13 } },
                { period: "PERIOD_3", score: { away: 20, home: 16 } },
                { period: "PERIOD_4", score: { away: 15, home: 22 } },
                { period: "OVERTIME", score: { away: 14, home: 6 } },
              ],
              score: { away: 73, home: 65 },
            },
          });
        });
      });
    });
  });

  describe("mapCricketFixtureUpdates", () => {
    let mappedUpdates;
    describe("when there are all types of updates", () => {
      beforeEach(() => {
        const updates = {
          cricket: {
            fixture: [
              {
                id: "123456",
                score: {
                  home: [
                    {
                      inningNumber: 1,
                      runs: 100,
                      wickets: 8,
                    },
                    {
                      inningNumber: 2,
                      runs: 50,
                      wickets: 6,
                    },
                  ],
                  away: [
                    {
                      inningNumber: 1,
                      runs: 95,
                      wickets: 5,
                    },
                    {
                      inningNumber: 2,
                      runs: 75,
                      wickets: 9,
                    },
                  ],
                },
                currentTeamBatting: "AWAY",
                currentTime: {
                  inning: 2,
                  over: null,
                },
              },
            ],
          },
        };

        mappedUpdates = mapCricketFixtureUpdates(updates)["ppb:fixture:123456"];
      });

      it("should return scores accordingly", () => {
        expect(mappedUpdates.score).toStrictEqual({
          home: [
            {
              inningNumber: 1,
              runs: 100,
              wickets: 8,
            },
            {
              inningNumber: 2,
              runs: 50,
              wickets: 6,
            },
          ],
          away: [
            {
              inningNumber: 1,
              runs: 95,
              wickets: 5,
            },
            {
              inningNumber: 2,
              runs: 75,
              wickets: 9,
            },
          ],
        });
      });

      it("should return currentTeamBatting as 'AWAY'", () => {
        expect(mappedUpdates.currentTeamBatting).toStrictEqual("AWAY");
      });

      it("should return currentTime accordingly", () => {
        expect(mappedUpdates.currentTime).toStrictEqual({
          inning: 2,
          over: 0,
        });
      });
    });
  });

  describe("mapTableTennisFixtureUpdates", () => {
    describe("when there is no tableTennisFixture in the updates", () => {
      describe("when updates are undefined", () => {
        it("should return null", () => {
          expect(mapTableTennisFixtureUpdates(undefined)).toEqual(null);
        });
      });

      describe("when fixture is undefined", () => {
        it("should return null", () => {
          expect(mapTableTennisFixtureUpdates({ tabletennis: { fixture: undefined } })).toEqual(null);
        });
      });

      describe("when fixture available is null", () => {
        it("should return emtpy array", () => {
          const SCA_UPDATE = {
            tableTennis: {
              fixture: [null],
            },
          };

          expect(mapTableTennisFixtureUpdates(SCA_UPDATE)).toEqual({});
        });
      });

      describe("when fixture id is null", () => {
        it("should return empty object", () => {
          const updates = {
            tableTennis: {
              fixture: [{ id: null }],
            },
          };

          expect(mapTableTennisFixtureUpdates(updates)).toEqual({});
        });
      });
    });

    describe("when there is tableTennisFixture with updates", () => {
      const FIXTURE = {
        id: "31307145",
        currentSet: {
          currentServer: null,
          number: 2,
          score: {
            away: 0,
            home: 0,
          },
        },
        previousSets: [
          {
            currentServer: null,
            number: 1,
            score: {
              away: 11,
              home: 7,
            },
          },
          null,
        ],
        setsWon: {
          away: 1,
          home: 0,
        },
      };

      describe("and currentSet has no information", () => {
        it("should return fixture with currentSet as an empty object", () => {
          expect(
            mapTableTennisFixtureUpdates({
              tableTennis: {
                fixture: [{ ...FIXTURE, currentSet: {} }],
              },
            }),
          ).toEqual({
            "ppb:fixture:31307145": {
              currentSet: {},
              previousSets: [
                {
                  number: 1,
                  score: {
                    away: 11,
                    home: 7,
                  },
                },
                {},
              ],
              setsWon: {
                away: 1,
                home: 0,
              },
            },
          });
        });
      });

      describe("and previous sets have no information", () => {
        it("should return fixture with previousSets as an empty array", () => {
          expect(
            mapTableTennisFixtureUpdates({
              tableTennis: {
                fixture: [{ ...FIXTURE, previousSets: null }],
              },
            }),
          ).toEqual({
            "ppb:fixture:31307145": {
              currentSet: {
                number: 2,
                score: {
                  away: 0,
                  home: 0,
                },
              },
              previousSets: [],
              setsWon: {
                away: 1,
                home: 0,
              },
            },
          });
        });
      });

      describe("all information is available", () => {
        it("should return fixture with correct data", () => {
          expect(
            mapTableTennisFixtureUpdates({
              tableTennis: {
                fixture: [FIXTURE],
              },
            }),
          ).toEqual({
            "ppb:fixture:31307145": {
              currentSet: {
                number: 2,
                score: {
                  away: 0,
                  home: 0,
                },
              },
              previousSets: [
                {
                  number: 1,
                  score: {
                    away: 11,
                    home: 7,
                  },
                },
                {},
              ],
              setsWon: {
                away: 1,
                home: 0,
              },
            },
          });
        });
      });
    });
  });

  describe("mapIceHockeyFixtureUpdates", () => {
    describe("when there is no iceHockeyballFixture in the updates", () => {
      const updates = {
        iceHockey: {},
      };

      it("should return null", () => {
        expect(mapIceHockeyFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is iceHockeyFixture with empty array", () => {
      const updates = {
        iceHockey: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapIceHockeyFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is iceHockeyFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return null", () => {
          const updates = {
            iceHockey: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapIceHockeyFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no clock information", () => {
        it("should return clock information as undefined", () => {
          const updates = {
            iceHockey: {
              fixture: [
                {
                  id: "31195169",
                  clock: null,
                  periodScores: [
                    {
                      score: {
                        home: 8,
                        away: 1,
                      },
                      period: "PERIOD_1",
                    },
                  ],
                  score: {
                    home: 6,
                    away: 7,
                  },
                },
              ],
            },
          };

          expect(mapIceHockeyFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              clock: undefined,
              periodScores: [
                {
                  score: {
                    home: 8,
                    away: 1,
                  },
                  period: "PERIOD_1",
                },
              ],
              score: {
                away: 7,
                home: 6,
              },
            },
          });
        });
      });

      describe("and clock information is an empty array", () => {
        it("should return clock information as an empty object", () => {
          const updates = {
            iceHockey: {
              fixture: [
                {
                  id: "31195169",
                  clock: [],
                  periodScores: [
                    {
                      score: {
                        home: 8,
                        away: 1,
                      },
                      period: "PERIOD_1",
                    },
                  ],
                  score: {
                    home: 6,
                    away: 7,
                  },
                },
              ],
            },
          };

          expect(mapIceHockeyFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              clock: {},
              periodScores: [
                {
                  score: {
                    home: 8,
                    away: 1,
                  },
                  period: "PERIOD_1",
                },
              ],
              score: {
                away: 7,
                home: 6,
              },
            },
          });
        });
      });

      describe("and there is no period scores", () => {
        it("should return period scores as an empty array", () => {
          const updates = {
            iceHockey: {
              fixture: [
                {
                  id: "31195169",
                  score: {
                    home: 6,
                    away: 7,
                  },
                  clock: {
                    period: "END_OVERTIME",
                  },
                },
              ],
            },
          };

          expect(mapIceHockeyFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              clock: { period: "END_OVERTIME" },
              periodScores: [],
              score: { away: 7, home: 6 },
            },
          });
        });
      });

      describe("and pedriod scores is has empty object", () => {
        it("should return period scores with an empty object", () => {
          const updates = {
            iceHockey: {
              fixture: [
                {
                  id: "31195169",
                  score: {
                    home: 6,
                    away: 7,
                  },
                  clock: {
                    period: "END_OVERTIME",
                  },
                  periodScores: [{}],
                },
              ],
            },
          };

          expect(mapIceHockeyFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              clock: { period: "END_OVERTIME" },
              periodScores: [{}],
              score: { away: 7, home: 6 },
            },
          });
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            iceHockey: {
              fixture: [
                {
                  id: "31195169",

                  clock: {
                    period: "END_OVERTIME",
                  },
                  periodScores: [{}],
                },
              ],
            },
          };

          expect(mapIceHockeyFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              clock: { period: "END_OVERTIME" },
              periodScores: [{}],
            },
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          iceHockey: {
            fixture: [
              {
                id: "31195169",
                score: {
                  home: 6,
                  away: 7,
                },
                clock: {
                  period: "END_OVERTIME",
                },
                periodScores: [
                  {
                    score: {
                      home: 8,
                      away: 1,
                    },
                    period: "PERIOD_1",
                  },
                  {
                    score: {
                      home: 5,
                      away: 5,
                    },
                    period: "PERIOD_2",
                  },
                  {
                    score: {
                      home: 1,
                      away: 2,
                    },
                    period: "PERIOD_3",
                  },
                  {
                    score: {
                      home: 1,
                      away: 1,
                    },
                    period: "OVERTIME",
                  },
                  {
                    score: {
                      home: 2,
                      away: 2,
                    },
                    period: "PENALTIES",
                  },
                ],
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapIceHockeyFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              clock: { period: "END_OVERTIME" },
              periodScores: [
                { period: "PERIOD_1", score: { away: 1, home: 8 } },
                { period: "PERIOD_2", score: { away: 5, home: 5 } },
                { period: "PERIOD_3", score: { away: 2, home: 1 } },
                { period: "OVERTIME", score: { away: 1, home: 1 } },
                { period: "PENALTIES", score: { away: 2, home: 2 } },
              ],
              score: { away: 7, home: 6 },
            },
          });
        });
      });
    });
  });

  describe("mapDartsFixtureUpdates", () => {
    describe("when there is no dartsFixture in the updates", () => {
      const updates = {
        darts: {},
      };

      it("should return null", () => {
        expect(mapDartsFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is dartsFixture with empty array", () => {
      const updates = {
        darts: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapDartsFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is dartsFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return null", () => {
          const updates = {
            darts: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapDartsFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and it is a LEGS based match", () => {
        it("should return correct score structure", () => {
          const updates = {
            darts: {
              fixture: [
                {
                  id: "31195168",
                  type: "LEGS",
                  score: {
                    __typename: "DartsScore",
                    home: 5,
                    away: 3,
                  },
                },
              ],
            },
          };

          expect(mapDartsFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195168": {
              type: "LEGS",
              score: {
                home: 5,
                away: 3,
              },
              currentSet: undefined,
              previousSets: undefined,
            },
          });
        });
      });

      describe("and it is a SETS based match", () => {
        it("should return correct sets score structure flattened", () => {
          const updates = {
            darts: {
              fixture: [
                {
                  id: "31195169",
                  type: "SETS",
                  score: {
                    __typename: "DartsFixtureSetsScore",
                    setsWon: { home: 2, away: 1 },
                    currentSet: { number: 4, score: { home: 2, away: 2 } },
                    previousSets: [{ number: 1, score: { home: 3, away: 0 } }],
                  },
                },
              ],
            },
          };

          expect(mapDartsFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              type: "SETS",
              score: {
                home: 2,
                away: 1,
              },
              currentSet: {
                number: 4,
                score: { home: 2, away: 2 },
              },
              previousSets: [{ number: 1, score: { home: 3, away: 0 } }],
            },
          });
        });
      });

      describe("and score is null", () => {
        it("should return undefined fields", () => {
          const updates = {
            darts: {
              fixture: [
                {
                  id: "31195170",
                  type: "LEGS",
                  score: null,
                },
              ],
            },
          };

          expect(mapDartsFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195170": {
              type: "LEGS",
              score: undefined,
              currentSet: undefined,
              previousSets: undefined,
            },
          });
        });
      });
    });
  });

  describe("mapRugbyUnionFixtureUpdates", () => {
    describe("when there is no rugbyUnionFixture in the updates", () => {
      const updates = {
        rugbyUnion: {},
      };

      it("should return null", () => {
        expect(mapRugbyUnionFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is rugbyUnionFixture with empty array", () => {
      const updates = {
        rugbyUnion: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapRugbyUnionFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is rugbyUnionFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return null", () => {
          const updates = {
            rugbyUnion: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapRugbyUnionFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            rugbyUnion: {
              fixture: [
                {
                  id: "31195161",
                },
              ],
            },
          };

          expect(mapRugbyUnionFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195161": {},
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          rugbyUnion: {
            fixture: [
              {
                id: "31195161",
                score: {
                  home: 14,
                  away: 20,
                },
                halfTimeScore: {
                  home: 5,
                  away: 10,
                },
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapRugbyUnionFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195161": {
              score: { away: 20, home: 14 },
              halfTimeScore: { away: 10, home: 5 },
            },
          });
        });
      });
    });
  });

  describe("mapRugbyLeagueFixtureUpdates", () => {
    describe("when there is no rugbyLeagueFixture in the updates", () => {
      const updates = {
        rugbyLeague: {},
      };

      it("should return null", () => {
        expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is rugbyLeagueFixture with empty array", () => {
      const updates = {
        rugbyLeague: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is rugbyLeagueFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return empty object", () => {
          const updates = {
            rugbyLeague: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and fixture is null", () => {
        it("should return empty object", () => {
          const updates = {
            rugbyLeague: {
              fixture: [null],
            },
          };

          expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            rugbyLeague: {
              fixture: [
                {
                  id: "31195162",
                },
              ],
            },
          };

          expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195162": {},
          });
        });
      });

      describe("and there is only score without halfTimeScore", () => {
        const updates = {
          rugbyLeague: {
            fixture: [
              {
                id: "31195162",
                score: {
                  home: 18,
                  away: 24,
                },
                halfTimeScore: null,
              },
            ],
          },
        };

        it("should return score and undefined halfTimeScore", () => {
          expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195162": {
              score: { away: 24, home: 18 },
              halfTimeScore: undefined,
            },
          });
        });
      });

      describe("and there is only halfTimeScore without score", () => {
        const updates = {
          rugbyLeague: {
            fixture: [
              {
                id: "31195162",
                score: null,
                halfTimeScore: {
                  home: 6,
                  away: 12,
                },
              },
            ],
          },
        };

        it("should return halfTimeScore and undefined score", () => {
          expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195162": {
              score: undefined,
              halfTimeScore: { away: 12, home: 6 },
            },
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          rugbyLeague: {
            fixture: [
              {
                id: "31195162",
                score: {
                  home: 18,
                  away: 24,
                },
                halfTimeScore: {
                  home: 6,
                  away: 12,
                },
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195162": {
              score: { away: 24, home: 18 },
              halfTimeScore: { away: 12, home: 6 },
            },
          });
        });
      });

      describe("and there are multiple fixtures", () => {
        const updates = {
          rugbyLeague: {
            fixture: [
              {
                id: "31195162",
                score: {
                  home: 18,
                  away: 24,
                },
                halfTimeScore: {
                  home: 6,
                  away: 12,
                },
              },
              {
                id: "31195163",
                score: {
                  home: 30,
                  away: 22,
                },
                halfTimeScore: {
                  home: 14,
                  away: 10,
                },
              },
            ],
          },
        };

        it("should return all fixtures correctly formatted", () => {
          expect(mapRugbyLeagueFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195162": {
              score: { away: 24, home: 18 },
              halfTimeScore: { away: 12, home: 6 },
            },
            "ppb:fixture:31195163": {
              score: { away: 22, home: 30 },
              halfTimeScore: { away: 10, home: 14 },
            },
          });
        });
      });
    });
  });

  describe("mapAmericanFootballFixtureUpdates", () => {
    describe("when there is no americanFootballFixture in the updates", () => {
      const updates = {
        americanFootball: {},
      };

      it("should return null", () => {
        expect(mapAmericanFootballFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is americanFootballFixture with empty array", () => {
      const updates = {
        americanFootball: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is americanFootballFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return empty object", () => {
          const updates = {
            americanFootball: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and fixture is null", () => {
        it("should return empty object", () => {
          const updates = {
            americanFootball: {
              fixture: [null],
            },
          };

          expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no clock information", () => {
        it("should return clock information as undefined", () => {
          const updates = {
            americanFootball: {
              fixture: [
                {
                  id: "31195170",
                  clock: null,
                  score: {
                    home: 21,
                    away: 14,
                  },
                },
              ],
            },
          };

          expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195170": {
              clock: undefined,
              score: {
                away: 14,
                home: 21,
              },
            },
          });
        });
      });

      describe("and clock information is an empty array", () => {
        it("should return clock information as an empty object", () => {
          const updates = {
            americanFootball: {
              fixture: [
                {
                  id: "31195170",
                  clock: [],
                  score: {
                    home: 21,
                    away: 14,
                  },
                },
              ],
            },
          };

          expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195170": {
              clock: {},
              score: {
                away: 14,
                home: 21,
              },
            },
          });
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            americanFootball: {
              fixture: [
                {
                  id: "31195170",
                  clock: {
                    period: "PERIOD_2",
                  },
                },
              ],
            },
          };

          expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195170": {
              clock: { period: "PERIOD_2" },
            },
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          americanFootball: {
            fixture: [
              {
                id: "31195170",
                score: {
                  home: 28,
                  away: 21,
                },
                clock: {
                  period: "PERIOD_4",
                },
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195170": {
              clock: { period: "PERIOD_4" },
              score: { away: 21, home: 28 },
            },
          });
        });
      });

      describe("and there are multiple fixtures", () => {
        const updates = {
          americanFootball: {
            fixture: [
              {
                id: "31195170",
                score: {
                  home: 28,
                  away: 21,
                },
                clock: {
                  period: "PERIOD_4",
                },
              },
              {
                id: "31195171",
                score: {
                  home: 14,
                  away: 35,
                },
                clock: {
                  period: "PERIOD_3",
                },
              },
            ],
          },
        };

        it("should return all fixtures correctly formatted", () => {
          expect(mapAmericanFootballFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195170": {
              clock: { period: "PERIOD_4" },
              score: { away: 21, home: 28 },
            },
            "ppb:fixture:31195171": {
              clock: { period: "PERIOD_3" },
              score: { away: 35, home: 14 },
            },
          });
        });
      });
    });
  });

  describe("mapSnookerFixtureUpdates", () => {
    describe("when there is no snookerFixture in the updates", () => {
      const updates = {
        snooker: {},
      };

      it("should return null", () => {
        expect(mapSnookerFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is snookerFixture with empty array", () => {
      const updates = {
        snooker: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapSnookerFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is snookerFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return empty object", () => {
          const updates = {
            snooker: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapSnookerFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and fixture is null", () => {
        it("should return empty object", () => {
          const updates = {
            snooker: {
              fixture: [null],
            },
          };

          expect(mapSnookerFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            snooker: {
              fixture: [
                {
                  id: "31195175",
                },
              ],
            },
          };

          expect(mapSnookerFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195175": {
              score: undefined,
            },
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          snooker: {
            fixture: [
              {
                id: "31195175",
                score: {
                  home: 5,
                  away: 6,
                },
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapSnookerFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195175": {
              score: { away: 6, home: 5 },
            },
          });
        });
      });

      describe("and there are multiple fixtures", () => {
        const updates = {
          snooker: {
            fixture: [
              {
                id: "31195175",
                score: {
                  home: 1,
                  away: 1,
                },
              },
              {
                id: "31195176",
                score: {
                  home: 2,
                  away: 2,
                },
              },
            ],
          },
        };

        it("should return all fixtures correctly formatted", () => {
          expect(mapSnookerFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195175": {
              score: { away: 1, home: 1 },
            },
            "ppb:fixture:31195176": {
              score: { away: 2, home: 2 },
            },
          });
        });
      });
    });
  });

  describe("mapAustralianRulesFixtureUpdates", () => {
    describe("when there is no australianRulesFixture in the updates", () => {
      const updates = {
        australianRules: {},
      };

      it("should return null", () => {
        expect(mapAustralianRulesFixtureUpdates(updates)).toEqual(null);
      });
    });

    describe("when there is australianRulesFixture with empty array", () => {
      const updates = {
        australianRules: {
          fixture: [],
        },
      };

      it("should return empty object", () => {
        expect(mapAustralianRulesFixtureUpdates(updates)).toEqual({});
      });
    });

    describe("when there is australianRulesFixture with updates", () => {
      describe("and there is no fixture id", () => {
        it("should return null", () => {
          const updates = {
            australianRules: {
              fixture: [
                {
                  id: null,
                },
              ],
            },
          };

          expect(mapAustralianRulesFixtureUpdates(updates)).toEqual({});
        });
      });

      describe("and there is no period scores", () => {
        it("should return period scores as an empty array", () => {
          const updates = {
            australianRules: {
              fixture: [
                {
                  id: "31195169",
                  score: {
                    goals: {
                      home: 5,
                      away: 3,
                    },
                    behinds: {
                      home: 1,
                      away: 1,
                    },
                    points: {
                      home: 4,
                      away: 4,
                    },
                  },
                },
              ],
            },
          };

          expect(mapAustralianRulesFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              periodScores: [],
              score: {
                goals: {
                  home: 5,
                  away: 3,
                },
                behinds: {
                  home: 1,
                  away: 1,
                },
                points: {
                  home: 4,
                  away: 4,
                },
              },
            },
          });
        });
      });

      describe("and period scores is has empty object", () => {
        it("should return period scores with an empty object", () => {
          const updates = {
            australianRules: {
              fixture: [
                {
                  id: "31195169",
                  score: {
                    goals: {
                      home: 5,
                      away: 3,
                    },
                    behinds: {
                      home: 1,
                      away: 1,
                    },
                    points: {
                      home: 4,
                      away: 4,
                    },
                  },
                  periodScores: [{}],
                },
              ],
            },
          };

          expect(mapAustralianRulesFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              periodScores: [{}],
              score: {
                goals: {
                  home: 5,
                  away: 3,
                },
                behinds: {
                  home: 1,
                  away: 1,
                },
                points: {
                  home: 4,
                  away: 4,
                },
              },
            },
          });
        });
      });

      describe("and there is no score", () => {
        it("should return score as undefined", () => {
          const updates = {
            australianRules: {
              fixture: [
                {
                  id: "31195169",
                  periodScores: [{}],
                },
              ],
            },
          };

          expect(mapAustralianRulesFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              periodScores: [{}],
            },
          });
        });
      });

      describe("and data is ok", () => {
        const updates = {
          australianRules: {
            fixture: [
              {
                id: "31195169",
                score: {
                  goals: {
                    home: 22,
                    away: 20,
                  },
                  behinds: {
                    home: 10,
                    away: 6,
                  },
                  points: {
                    home: 25,
                    away: 25,
                  },
                },
                periodScores: [
                  {
                    score: {
                      goals: {
                        home: 5,
                        away: 3,
                      },
                      behinds: {
                        home: 1,
                        away: 1,
                      },
                      points: {
                        home: 4,
                        away: 4,
                      },
                    },
                    australianRulesPeriod: "PERIOD_1",
                  },
                  {
                    score: {
                      goals: {
                        home: 0,
                        away: 0,
                      },
                      behinds: {
                        home: 0,
                        away: 0,
                      },
                      points: {
                        home: 0,
                        away: 0,
                      },
                    },
                    australianRulesPeriod: "PERIOD_2",
                  },
                  {
                    score: {
                      goals: {
                        home: 7,
                        away: 7,
                      },
                      behinds: {
                        home: 1,
                        away: 1,
                      },
                      points: {
                        home: 10,
                        away: 9,
                      },
                    },
                    australianRulesPeriod: "PERIOD_3",
                  },
                  {
                    score: {
                      goals: {
                        home: 11,
                        away: 13,
                      },
                      behinds: {
                        home: 4,
                        away: 1,
                      },
                      points: {
                        home: 10,
                        away: 10,
                      },
                    },
                    australianRulesPeriod: "PERIOD_4",
                  },
                ],
              },
            ],
          },
        };

        it("should return a correctly formatted object", () => {
          expect(mapAustralianRulesFixtureUpdates(updates)).toEqual({
            "ppb:fixture:31195169": {
              periodScores: [
                {
                  period: "PERIOD_1",
                  score: {
                    goals: {
                      home: 5,
                      away: 3,
                    },
                    behinds: {
                      home: 1,
                      away: 1,
                    },
                    points: {
                      home: 4,
                      away: 4,
                    },
                  },
                },
                {
                  period: "PERIOD_2",
                  score: {
                    goals: {
                      home: 0,
                      away: 0,
                    },
                    behinds: {
                      home: 0,
                      away: 0,
                    },
                    points: {
                      home: 0,
                      away: 0,
                    },
                  },
                },
                {
                  period: "PERIOD_3",
                  score: {
                    goals: {
                      home: 7,
                      away: 7,
                    },
                    behinds: {
                      home: 1,
                      away: 1,
                    },
                    points: {
                      home: 10,
                      away: 9,
                    },
                  },
                },
                {
                  period: "PERIOD_4",
                  score: {
                    goals: {
                      home: 11,
                      away: 13,
                    },
                    behinds: {
                      home: 4,
                      away: 1,
                    },
                    points: {
                      home: 10,
                      away: 10,
                    },
                  },
                },
              ],
              score: {
                goals: {
                  home: 22,
                  away: 20,
                },
                behinds: {
                  home: 10,
                  away: 6,
                },
                points: {
                  home: 25,
                  away: 25,
                },
              },
            },
          });
        });
      });
    });
  });
});
