import normalizeObbSquadBetCardFragmentIntoObbSquadBetCard from "./obb-squad-bet-card-normalizer";

const BFF_RESPONSE = {
  __typename: "ObbSquadBetCard",
  urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
  icon: {
    category: "Rich_Content",
    id: "penalty-scored",
    __typename: "PackIcon",
  },
  title: {
    __typename: "DisplayNameTitle",
    name: "Squad Bet Card Title",
  },
  outcomesLabel: {
    __typename: "DisplayNameTitle",
    name: "Squad Bet Card Subtitle",
  },
  showModalEntryPoint: true,
  entryPointLabel: {
    __typename: "DisplayNameTitle",
    name: "Entry Point Label",
  },
  participantInfo: {
    __typename: "DisplayNameTitle",
    name: "Participant Info",
  },
  filterTags: [
    {
      label: {
        __typename: "DisplayNameTitle",
        name: "Shots On Target",
      },
      type: "TAG",
      __typename: "FilterTag",
    },
  ],
  event: {
    __typename: "SportsEvent",
    urn: "ppb:event:34278006",
    name: "Man Utd v Athletic Bilbao",
  },
  eventParticipants: [
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        shirtNumber: 10,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 0,
            shotsOnTarget: 0,
            totalShots: 0.2,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
            foulInvolvements: 0.2,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        shirtNumber: 10,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 0,
            shotsOnTarget: 0,
            totalShots: 0.2,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
            foulInvolvements: 0.2,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        shirtNumber: 10,
        position: null,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 0,
            shotsOnTarget: 0,
            totalShots: 0.2,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
            foulInvolvements: 0.2,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        shirtNumber: 10,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 0,
            shotsOnTarget: 0,
            totalShots: 0.2,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
            foulInvolvements: 0.2,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        shirtNumber: 10,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 0,
            shotsOnTarget: 0,
            totalShots: 0.2,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
            foulInvolvements: 0.2,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
        __typename: "FootballTeamDetails",
      },
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
      player: {
        id: "35716",
        name: "Victor Lindelof",
        position: null,
        shirtNumber: 10,
        seasonStats: {
          matchesPlayed: 1,
          averages: {
            goals: 0,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 0,
            shotsOnTarget: 0,
            totalShots: 0.2,
            fouls: 0.2,
            foulsWon: null,
            assists: null,
            passes: null,
            foulInvolvements: 0.2,
            __typename: "FootballPlayerStat",
          },
          __typename: "FootballPlayerSeasonStats",
        },
        __typename: "FootballPlayer",
      },
      team: {
        id: "13",
        name: "Man Utd",
        color: "DA291C",
        __typename: "FootballTeamDetails",
      },
    },
  ],
  squadParticipants: [
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
    },
    {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:35716/e/34278006",
    },
  ],
  incidentType: {
    id: "GOALS",
  },
  defaultLegs: [
    {
      __typename: "ObbSquadBetLeg",
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          __typename: "ObbOdds",
          decimal: 1.5,
          fractional: {
            __typename: "FractionalOdds",
            numerator: 3,
            denominator: 2,
          },
        },
      },
      event: {
        __typename: "SportsEvent",
        urn: "ppb:event:34278006",
        name: "Man Utd v Athletic Bilbao",
      },
      templateId: "templateId",
      templateParams: {
        __typename: "ObbSquadBetParams",
        participantIds: [
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
        ],
        outcomeIds: ["GOALS"],
        value: 2,
        timePeriodId: "TimePeriodId",
        quantifier: "quantifier",
      },
    },
    {
      __typename: "ObbSquadBetLeg",
      quote: {
        __typename: "ObbQuoteSuccess",
        price: {
          __typename: "ObbOdds",
          decimal: 1.5,
          fractional: {
            __typename: "FractionalOdds",
            numerator: 3,
            denominator: 2,
          },
        },
      },
      participants: [
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
        },
        {
          __typename: "ObbFootballPlayer",
          urn: "ppb:obb:footballPlayer:35716/e/34278006",
        },
      ],
      outcome: {
        __typename: "ObbOutcome",
        operator: "AT_LEAST",
        period: "MATCH",
        value: {
          __typename: "ObbNumericOutcomeValue",
          numericValue: 4,
        },
        incidentType: "GOALS",
      },
      event: {
        __typename: "SportsEvent",
        urn: "ppb:event:34278006",
        name: "Man Utd v Athletic Bilbao",
      },
      templateId: "templateId",
      templateParams: {
        __typename: "ObbSquadBetParams",
        participantIds: [
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
          {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          },
        ],
        outcomeIds: ["GOALS"],
        value: 2,
        timePeriodId: "TimePeriodId",
        quantifier: "quantifier",
      },
    },
  ],
  defaultOutcomeIndex: 2,
  statsLabel: {
    __typename: "DisplayNameTitle",
    name: "statsLabel",
  },
};

describe("OBB squad bet card normalizer", () => {
  describe("normalizeObbSquadBetCardFragmentIntoObbSquadBetCard", () => {
    describe("when receiving valid props", () => {
      it("should correctly transform and return the data", () => {
        const { data } = normalizeObbSquadBetCardFragmentIntoObbSquadBetCard(BFF_RESPONSE);

        expect(data).toEqual({
          defaultLegs: [
            {
              event: {
                name: "Man Utd v Athletic Bilbao",
                typename: "SportsEvent",
                urn: "ppb:event:34278006",
                eventId: undefined,
              },
              id: "5bbfe14833ca055e",
              templateParams: {
                outcomeIds: ["GOALS"],
                value: 2,
                timePeriodId: "TimePeriodId",
                quantifier: "quantifier",
                participantIds: [
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                ],
              },
              quote: {
                price: {
                  decimal: 1.5,
                  fractional: {
                    denominator: 2,
                    numerator: 3,
                    typename: "FractionalOdds",
                  },
                  typename: "ObbOdds",
                },
                typename: "ObbQuoteSuccess",
              },
              templateId: "templateId",
            },
            {
              event: {
                name: "Man Utd v Athletic Bilbao",
                typename: "SportsEvent",
                urn: "ppb:event:34278006",
                eventId: undefined,
              },
              id: "5bbfe14833ca055e",
              quote: {
                price: {
                  decimal: 1.5,
                  fractional: {
                    denominator: 2,
                    numerator: 3,
                    typename: "FractionalOdds",
                  },
                  typename: "ObbOdds",
                },
                typename: "ObbQuoteSuccess",
              },
              templateId: "templateId",
              templateParams: {
                outcomeIds: ["GOALS"],
                value: 2,
                timePeriodId: "TimePeriodId",
                quantifier: "quantifier",
                participantIds: [
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                  {
                    typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:35716/e/34278006",
                  },
                ],
              },
            },
          ],
          incidentType: "GOALS",
          eventParticipants: [
            {
              player: {
                id: "35716",
                name: "Victor Lindelof",
                position: null,
                shirtNumber: 10,
                seasonStats: {
                  matchesPlayed: 1,
                  averages: {
                    assists: null,
                    fouls: 0.2,
                    foulsWon: null,
                    goals: 0,
                    passes: null,
                    redCards: 0,
                    shotsOnTarget: 0,
                    totalShots: 0.2,
                    yellowCards: 0,
                    yellowRedCards: 0,
                    foulInvolvements: 0.2,
                  },
                },
              },
              team: {
                color: "DA291C",
                id: "13",
                name: "Man Utd",
              },
              incidentTypes: {},
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              incidentTypes: {},
              player: {
                id: "35716",
                name: "Victor Lindelof",
                position: null,
                shirtNumber: 10,
                seasonStats: {
                  matchesPlayed: 1,
                  averages: {
                    assists: null,
                    fouls: 0.2,
                    foulsWon: null,
                    goals: 0,
                    passes: null,
                    redCards: 0,
                    shotsOnTarget: 0,
                    totalShots: 0.2,
                    yellowCards: 0,
                    yellowRedCards: 0,
                    foulInvolvements: 0.2,
                  },
                },
              },
              team: {
                color: "DA291C",
                id: "13",
                name: "Man Utd",
              },
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              incidentTypes: {},
              player: {
                id: "35716",
                name: "Victor Lindelof",
                position: null,
                shirtNumber: 10,
                seasonStats: {
                  matchesPlayed: 1,
                  averages: {
                    assists: null,
                    fouls: 0.2,
                    foulsWon: null,
                    goals: 0,
                    passes: null,
                    redCards: 0,
                    shotsOnTarget: 0,
                    totalShots: 0.2,
                    yellowCards: 0,
                    yellowRedCards: 0,
                    foulInvolvements: 0.2,
                  },
                },
              },
              team: {
                color: "DA291C",
                id: "13",
                name: "Man Utd",
              },
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              incidentTypes: {},
              player: {
                id: "35716",
                name: "Victor Lindelof",
                position: null,
                shirtNumber: 10,
                seasonStats: {
                  matchesPlayed: 1,
                  averages: {
                    assists: null,
                    fouls: 0.2,
                    foulsWon: null,
                    goals: 0,
                    passes: null,
                    redCards: 0,
                    shotsOnTarget: 0,
                    totalShots: 0.2,
                    yellowCards: 0,
                    yellowRedCards: 0,
                    foulInvolvements: 0.2,
                  },
                },
              },
              team: {
                color: "DA291C",
                id: "13",
                name: "Man Utd",
              },
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              incidentTypes: {},
              player: {
                id: "35716",
                name: "Victor Lindelof",
                position: null,
                shirtNumber: 10,
                seasonStats: {
                  matchesPlayed: 1,
                  averages: {
                    assists: null,
                    fouls: 0.2,
                    foulsWon: null,
                    goals: 0,
                    passes: null,
                    redCards: 0,
                    shotsOnTarget: 0,
                    totalShots: 0.2,
                    yellowCards: 0,
                    yellowRedCards: 0,
                    foulInvolvements: 0.2,
                  },
                },
              },
              team: {
                color: "DA291C",
                id: "13",
                name: "Man Utd",
              },
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              incidentTypes: {},
              player: {
                id: "35716",
                name: "Victor Lindelof",
                position: null,
                shirtNumber: 10,
                seasonStats: {
                  matchesPlayed: 1,
                  averages: {
                    assists: null,
                    fouls: 0.2,
                    foulsWon: null,
                    goals: 0,
                    passes: null,
                    redCards: 0,
                    shotsOnTarget: 0,
                    totalShots: 0.2,
                    yellowCards: 0,
                    yellowRedCards: 0,
                    foulInvolvements: 0.2,
                  },
                },
              },
              team: {
                color: "DA291C",
                id: "13",
                name: "Man Utd",
              },
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
          ],
          squadParticipants: [
            {
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              typename: "ObbFootballPlayer",
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
          ],
          sportevent: {
            name: "Man Utd v Athletic Bilbao",
            typename: "SportsEvent",
            urn: "ppb:event:34278006",
            eventId: undefined,
          },
          outcomesLabel: "Squad Bet Card Subtitle",
          title: "Squad Bet Card Title",
          typename: "ObbSquadBetCard",
          urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
          defaultOutcomeIndex: 2,
          statsLabel: "statsLabel",
          showModalEntryPoint: true,
          entryPointLabel: "Entry Point Label",
          participantInfo: "Participant Info",
          filterTags: [
            {
              label: "Shots On Target",
              type: "TAG",
            },
          ],
        });
      });

      it("should handle jerseys with missing or undefined url fallback", () => {
        const inputWithJerseys = {
          ...BFF_RESPONSE,
          eventParticipants: [
            {
              ...BFF_RESPONSE.eventParticipants[0],
              team: {
                ...BFF_RESPONSE.eventParticipants[0].team,
                jerseys: [{ url: "https://example.com/jersey1.png" }],
              },
            },
          ],
        };

        const { data } = normalizeObbSquadBetCardFragmentIntoObbSquadBetCard(inputWithJerseys);
        const jerseysOutput = data.eventParticipants[0].team.jerseys;

        expect(jerseysOutput).toEqual([{ url: "https://example.com/jersey1.png" }]);
      });
    });
  });
});
