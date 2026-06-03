import { default as normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard } from "./obb-event-populars-card-normalizer";

const BFF_RESPONSE = {
  __typename: "ObbEventPopularsCard",
  urn: "eventPopularsCard:urn:1",
  obbEventPopularsCardTitle: {
    name: "Popular Bets",
    __typename: "DisplayNameTitle",
  },
  badgeLabel: {
    name: "Hot",
    __typename: "DisplayNameTitle",
  },
  event: {
    urn: "event:urn:1",
    __typename: "SportsEvent",
  },
  showPopularEvidence: true,
  showStats: true,
  numberOfVisibleBettingOpportunities: 5,
  popularBettingOpportunities: [
    {
      betCount: 150,
      participants: [
        {
          urn: "ppb:participant:1",
          player: {
            id: "1",
            name: "Player 1",
            position: "FORWARD",
            shirtNumber: 10,
            seasonStats: {
              matchesPlayed: 10,
              averages: {
                goals: 0.5,
                redCards: 0,
                yellowCards: 0.1,
                yellowRedCards: 0,
                shotsOnTarget: 2.5,
                totalShots: 4.0,
                fouls: 1.2,
                foulsWon: 0.8,
                assists: 0.3,
                passes: 25.5,
                __typename: "FootballPlayerStat",
              },
            },
          },
          __typename: "ObbFootballPlayer",
          team: {
            name: "Team A",
            id: "1",
            color: "FF0000",
          },
        },
        {
          urn: "ppb:participant:2",
          __typename: "ObbFootballPlayer",
          player: {
            id: "2",
            name: "Player 2",
            position: "MIDFIELDER",
            shirtNumber: 8,
            seasonStats: {
              matchesPlayed: 12,
              averages: {
                goals: 0.3,
                redCards: 0,
                yellowCards: 0.2,
                yellowRedCards: 0,
                shotsOnTarget: 1.5,
                totalShots: 3.0,
                fouls: 1.0,
                foulsWon: 1.5,
                assists: 0.5,
                passes: 35.0,
                __typename: "FootballPlayerStat",
              },
            },
          },
          team: {
            name: "Team B",
            color: "0000FF",
            id: "2",
          },
        },
      ],
      leg: {
        __typename: "ObbLeg",
        quote: {
          __typename: "ObbQuoteSuccess",
          price: {
            decimal: 7.5,
            fractional: {
              numerator: 13,
              denominator: 2,
              __typename: "FractionalOdds",
            },
            __typename: "SportsbookOdds",
          },
        },
        event: {
          __typename: "SportsEvent",
          urn: "ppb:event:33639890",
          name: "Peterborough v Stevenage",
          eventId: "123",
        },
        templateId: "playerVsPlayer",
        templateParams: {
          __typename: "ObbPvpParams",
          outcomeId: "GOALS",
          participantIdA: {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:6975/e/33639890",
          },
          participantIdB: {
            __typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:1234/e/33639890",
          },
          timePeriodId: "MATCH",
        },
      },
    },
  ],
};

describe("OBB event populars card normalizer", () => {
  describe("normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard", () => {
    it("should correctly transform and return the data object when receiving valid props", () => {
      const { data } = normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard(BFF_RESPONSE);

      expect(data).toStrictEqual({
        typename: "ObbEventPopularsCard",
        urn: "eventPopularsCard:urn:1",
        title: "Popular Bets",
        badgeLabel: "Hot",
        sportEvent: "event:urn:1",
        showPopularEvidence: true,
        showStats: true,
        numberOfVisibleBettingOpportunities: 5,
        popularBettingOpportunities: [
          {
            betCount: 150,
            participants: [
              {
                urn: "ppb:participant:1",
                typename: "ObbFootballPlayer",
                incidentTypes: {},
                player: {
                  id: "1",
                  name: "Player 1",
                  position: "FORWARD",
                  shirtNumber: 10,
                  seasonStats: {
                    matchesPlayed: 10,
                    averages: {
                      goals: 0.5,
                      redCards: 0,
                      yellowCards: 0.1,
                      yellowRedCards: 0,
                      shotsOnTarget: 2.5,
                      totalShots: 4.0,
                      fouls: 1.2,
                      foulsWon: 0.8,
                      assists: 0.3,
                      passes: 25.5,
                      foulInvolvements: undefined,
                    },
                  },
                },
                team: { name: "Team A", color: "FF0000", id: "1", jerseys: undefined },
              },
              {
                urn: "ppb:participant:2",
                typename: "ObbFootballPlayer",
                incidentTypes: {},
                player: {
                  id: "2",
                  name: "Player 2",
                  position: "MIDFIELDER",
                  shirtNumber: 8,
                  seasonStats: {
                    matchesPlayed: 12,
                    averages: {
                      goals: 0.3,
                      redCards: 0,
                      yellowCards: 0.2,
                      yellowRedCards: 0,
                      shotsOnTarget: 1.5,
                      totalShots: 3.0,
                      fouls: 1.0,
                      foulsWon: 1.5,
                      assists: 0.5,
                      passes: 35.0,
                      foulInvolvements: undefined,
                    },
                  },
                },
                team: { name: "Team B", color: "0000FF", id: "2", jerseys: undefined },
              },
            ],
            leg: {
              id: "325f7010501b4a4",
              event: {
                typename: "SportsEvent",
                name: "Peterborough v Stevenage",
                urn: "ppb:event:33639890",
                eventId: "123",
              },
              quote: {
                price: {
                  decimal: 7.5,
                  fractional: {
                    numerator: 13,
                    denominator: 2,
                    typename: "FractionalOdds",
                  },
                  typename: "SportsbookOdds",
                },
                typename: "ObbQuoteSuccess",
              },
              templateId: "playerVsPlayer",
              templateParams: {
                outcomeId: "GOALS",
                participantIdA: { urn: "ppb:obb:footballPlayer:6975/e/33639890", typename: "ObbFootballPlayer" },
                participantIdB: { urn: "ppb:obb:footballPlayer:1234/e/33639890", typename: "ObbFootballPlayer" },
                timePeriodId: "MATCH",
              },
            },
          },
        ],
      });
    });

    it("should fallback badgeLabel to undefined when missing", () => {
      const responseWithMissingBadgeLabel = {
        ...BFF_RESPONSE,
        badgeLabel: null,
      };

      const { data } = normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard(responseWithMissingBadgeLabel);

      expect(data.badgeLabel).toBeUndefined();
    });

    it("should fallback to undefined when shirtNumber is missing", () => {
      const responseWithMissingShirtNumber = {
        ...BFF_RESPONSE,
        popularBettingOpportunities: [
          {
            betCount: 100,
            leg: { ...BFF_RESPONSE.popularBettingOpportunities[0].leg },
            participants: [
              {
                urn: "ppb:participant:1",
                player: {
                  id: "1",
                  name: "Player 1",
                  position: "DEFENDER",
                  shirtNumber: undefined,
                  seasonStats: {
                    matchesPlayed: 5,
                    averages: {
                      goals: 0.2,
                      redCards: 0,
                      yellowCards: 0.3,
                      yellowRedCards: 0,
                      shotsOnTarget: 0.5,
                      totalShots: 1.0,
                      fouls: 2.0,
                      foulsWon: 0.5,
                      assists: 0.1,
                      passes: 40.0,
                    },
                  },
                },
                __typename: "ObbFootballPlayer",
                team: {
                  name: "Team C",
                  id: "3",
                  color: "00FF00",
                },
              },
            ],
          },
        ],
      };

      const { data } = normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard(responseWithMissingShirtNumber);

      expect(data.popularBettingOpportunities[0].participants[0].player.shirtNumber).toBeUndefined();
    });

    it("should fallback position to undefined when missing", () => {
      const response = {
        ...BFF_RESPONSE,
        popularBettingOpportunities: [
          {
            betCount: 200,
            leg: { ...BFF_RESPONSE.popularBettingOpportunities[0].leg },
            participants: [
              {
                urn: "ppb:participant:1",
                __typename: "ObbFootballPlayer",
                player: {
                  id: "1",
                  name: "Player 1",
                  position: undefined,
                  shirtNumber: 7,
                  seasonStats: {
                    matchesPlayed: 8,
                    averages: {
                      goals: 0.4,
                      redCards: 0,
                      yellowCards: 0.1,
                      yellowRedCards: 0,
                      shotsOnTarget: 2.0,
                      totalShots: 3.5,
                      fouls: 1.5,
                      foulsWon: 1.0,
                      assists: 0.2,
                      passes: 30.0,
                    },
                  },
                },
                team: {
                  id: "1",
                  name: "Team A",
                  color: "FF0000",
                },
              },
            ],
          },
        ],
      };

      const { data } = normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard(response);

      expect(data.popularBettingOpportunities[0].participants[0].player.position).toBeUndefined();
    });

    it("should fallback the season stats to null when missing", () => {
      const responseWithMissingSeasonStats = {
        ...BFF_RESPONSE,
        popularBettingOpportunities: [
          {
            betCount: 75,
            leg: { ...BFF_RESPONSE.popularBettingOpportunities[0].leg },
            participants: [
              {
                urn: "ppb:participant:1",
                player: {
                  id: "1",
                  name: "Player 1",
                  position: "FORWARD",
                  shirtNumber: 10,
                  seasonStats: null,
                },
                __typename: "ObbFootballPlayer",
                team: {
                  name: "Team A",
                  id: "1",
                  color: "FF0000",
                  __typename: "FootballTeamDetails",
                },
              },
            ],
          },
        ],
      };

      const { data } = normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard(responseWithMissingSeasonStats);

      expect(data.popularBettingOpportunities[0].participants[0].player.seasonStats).toBeNull();
    });

    it("should handle multiple betting opportunities correctly", () => {
      const responseWithMultipleOpportunities = {
        ...BFF_RESPONSE,
        popularBettingOpportunities: [
          BFF_RESPONSE.popularBettingOpportunities[0],
          {
            betCount: 95,
            participants: [
              {
                urn: "ppb:participant:3",
                __typename: "ObbFootballPlayer",
                player: {
                  id: "3",
                  name: "Player 3",
                  position: "GOALKEEPER",
                  shirtNumber: 1,
                  seasonStats: null,
                },
                team: {
                  name: "Team C",
                  id: "3",
                  color: "00FF00",
                },
              },
            ],
            leg: {
              __typename: "ObbSquadBetLeg",
              quote: {
                __typename: "ObbQuoteSuccess",
                price: {
                  __typename: "ObbOdds",
                  decimal: 3.0,
                  fractional: {
                    __typename: "FractionalOdds",
                    numerator: 2,
                    denominator: 1,
                  },
                },
              },
              event: {
                __typename: "SportsEvent",
                urn: "ppb:event:67890",
                name: "Team C v Team D",
                eventId: 67890,
              },
              templateId: "templateId2",
              templateParams: {
                __typename: "ObbSquadBetParams",
                participantIds: [
                  {
                    __typename: "ObbFootballPlayer",
                    urn: "ppb:obb:footballPlayer:3/e/67890",
                  },
                ],
                outcomeIds: ["SAVES"],
                value: 5,
                timePeriodId: "FULL_TIME",
                quantifier: "OVER",
              },
            },
          },
        ],
      };

      const { data } = normalizeObbEventPopularsCardFragmentIntoObbEventPopularsCard(responseWithMultipleOpportunities);

      expect(data).toEqual({
        badgeLabel: "Hot",
        numberOfVisibleBettingOpportunities: 5,
        popularBettingOpportunities: [
          {
            betCount: 150,
            leg: {
              event: {
                eventId: "123",
                name: "Peterborough v Stevenage",
                typename: "SportsEvent",
                urn: "ppb:event:33639890",
              },
              id: "325f7010501b4a4",
              quote: {
                price: {
                  decimal: 7.5,
                  fractional: { denominator: 2, numerator: 13, typename: "FractionalOdds" },
                  typename: "SportsbookOdds",
                },
                typename: "ObbQuoteSuccess",
              },
              templateId: "playerVsPlayer",
              templateParams: {
                outcomeId: "GOALS",
                participantIdA: { typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:6975/e/33639890" },
                participantIdB: { typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:1234/e/33639890" },
                timePeriodId: "MATCH",
              },
            },
            participants: [
              {
                incidentTypes: {},
                player: {
                  id: "1",
                  name: "Player 1",
                  position: "FORWARD",
                  seasonStats: {
                    averages: {
                      assists: 0.3,
                      fouls: 1.2,
                      foulsWon: 0.8,
                      goals: 0.5,
                      passes: 25.5,
                      redCards: 0,
                      shotsOnTarget: 2.5,
                      totalShots: 4,
                      yellowCards: 0.1,
                      yellowRedCards: 0,
                    },
                    matchesPlayed: 10,
                  },
                  shirtNumber: 10,
                },
                team: { color: "FF0000", id: "1", name: "Team A" },
                typename: "ObbFootballPlayer",
                urn: "ppb:participant:1",
              },
              {
                incidentTypes: {},
                player: {
                  id: "2",
                  name: "Player 2",
                  position: "MIDFIELDER",
                  seasonStats: {
                    averages: {
                      assists: 0.5,
                      fouls: 1,
                      foulsWon: 1.5,
                      goals: 0.3,
                      passes: 35,
                      redCards: 0,
                      shotsOnTarget: 1.5,
                      totalShots: 3,
                      yellowCards: 0.2,
                      yellowRedCards: 0,
                    },
                    matchesPlayed: 12,
                  },
                  shirtNumber: 8,
                },
                team: { color: "0000FF", id: "2", name: "Team B" },
                typename: "ObbFootballPlayer",
                urn: "ppb:participant:2",
              },
            ],
          },
          {
            betCount: 95,
            leg: {
              event: { eventId: 67890, name: "Team C v Team D", typename: "SportsEvent", urn: "ppb:event:67890" },
              id: "dbe1fc38dc838e54",
              quote: {
                price: {
                  decimal: 3,
                  fractional: { denominator: 1, numerator: 2, typename: "FractionalOdds" },
                  typename: "ObbOdds",
                },
                typename: "ObbQuoteSuccess",
              },
              templateId: "templateId2",
              templateParams: {
                outcomeIds: ["SAVES"],
                participantIds: [{ typename: "ObbFootballPlayer", urn: "ppb:obb:footballPlayer:3/e/67890" }],
                quantifier: "OVER",
                timePeriodId: "FULL_TIME",
                value: 5,
              },
            },
            participants: [
              {
                incidentTypes: {},
                player: { id: "3", name: "Player 3", position: "GOALKEEPER", seasonStats: null, shirtNumber: 1 },
                team: { color: "00FF00", id: "3", name: "Team C" },
                typename: "ObbFootballPlayer",
                urn: "ppb:participant:3",
              },
            ],
          },
        ],
        showPopularEvidence: true,
        showStats: true,
        sportEvent: "event:urn:1",
        title: "Popular Bets",
        typename: "ObbEventPopularsCard",
        urn: "eventPopularsCard:urn:1",
      });
    });
  });
});
