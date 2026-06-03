import normalizeObbCreatedBetsCardFragmentIntoObbCreatedBetsCard from "./obb-created-bets-card-normalizer";

const BFF_RESPONSE = {
  __typename: "ObbCreatedBetsCard",
  urn: "createdBetsCard:urn:1",
  fixture: { urn: "fixture:urn:1", __typename: "FootballFixture", sportevent: { urn: "event:urn:1" } },
  eventViewLink: {
    viewUrl: "/event1",
    viewUrn: "view:urn:event1",
    __typename: "ObbViewLink",
  },
  footerViewLink: {
    viewUrl: "/footer1",
    viewUrn: "view:urn:footer1",
    __typename: "ObbViewLink",
  },
  bettingOpportunities: [
    {
      participants: [
        {
          urn: "ppb:participant:1",
          player: {
            id: "1",
            name: "Player 1",
            position: "FORWARD",
            shirtNumber: 10,
            seasonStats: {
              matchesPlayed: 1,
              averages: {
                goals: 0.5,
                redCards: 0,
                yellowCards: 0,
                yellowRedCards: 2,
                shotsOnTarget: 1,
                totalShots: 2,
                fouls: null,
                foulsWon: null,
                assists: 0.2,
                passes: 10,
                __typename: "FootballPlayerStat",
              },
            },
          },
          __typename: "ObbFootballPlayer",
          team: {
            name: "Benfica",
            id: "1",
            color: "11111",
          },
        },
        {
          urn: "ppb:participant:2",
          __typename: "ObbFootballPlayer",
          player: {
            id: "2",
            name: "Player 2",
            position: "FORWARD",
            shirtNumber: 9,
            seasonStats: {
              matchesPlayed: 1,
              averages: {
                goals: 0.5,
                redCards: 0,
                yellowCards: 0,
                yellowRedCards: 2,
                shotsOnTarget: 1,
                totalShots: 2,
                fouls: null,
                foulsWon: null,
                assists: 0.2,
                passes: 10,
                __typename: "FootballPlayerStat",
              },
            },
          },
          team: {
            name: "Braga",
            color: "22222",
            id: "2",
          },
        },
      ],
      leg: {
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
          eventId: 34278006,
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
    },
  ],
};

describe("OBB created bets card normalizer", () => {
  describe("normalizeObbCreatedBetsCardFragmentIntoObbCreatedBetsCard", () => {
    it("should correctly transform and return the data object when receiving valid props", () => {
      const { data } = normalizeObbCreatedBetsCardFragmentIntoObbCreatedBetsCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "ObbCreatedBetsCard",
        urn: "createdBetsCard:urn:1",
        eventViewLink: {
          viewUrl: "/event1",
          viewUrn: "view:urn:event1",
        },
        footerViewLink: {
          viewUrl: "/footer1",
          viewUrn: "view:urn:footer1",
        },
        fixture: "fixture:urn:1",
        sportEvent: "event:urn:1",
        bettingOpportunities: [
          {
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
                    matchesPlayed: 1,
                    averages: {
                      goals: 0.5,
                      redCards: 0,
                      yellowCards: 0,
                      yellowRedCards: 2,
                      shotsOnTarget: 1,
                      totalShots: 2,
                      fouls: null,
                      foulsWon: null,
                      assists: 0.2,
                      passes: 10,
                    },
                  },
                },
                team: { name: "Benfica", color: "11111", id: "1" },
              },
              {
                urn: "ppb:participant:2",
                typename: "ObbFootballPlayer",
                incidentTypes: {},
                player: {
                  id: "2",
                  name: "Player 2",
                  position: "FORWARD",
                  shirtNumber: 9,
                  seasonStats: {
                    matchesPlayed: 1,
                    averages: {
                      goals: 0.5,
                      redCards: 0,
                      yellowCards: 0,
                      yellowRedCards: 2,
                      shotsOnTarget: 1,
                      totalShots: 2,
                      fouls: null,
                      foulsWon: null,
                      assists: 0.2,
                      passes: 10,
                    },
                  },
                },
                team: { name: "Braga", color: "22222", id: "2" },
              },
            ],
            leg: {
              id: "51e135acea898650",
              event: {
                typename: "SportsEvent",
                name: "Man Utd v Athletic Bilbao",
                urn: "ppb:event:34278006",
                eventId: 34278006,
              },
              quote: {
                price: {
                  decimal: 1.5,
                  fractional: {
                    numerator: 3,
                    denominator: 2,
                    typename: "FractionalOdds",
                  },
                  typename: "ObbOdds",
                },
                typename: "ObbQuoteSuccess",
              },
              templateId: "templateId",
              templateParams: {
                outcomeIds: ["GOALS"],
                participantIds: [
                  { urn: "ppb:obb:footballPlayer:35716/e/34278006", typename: "ObbFootballPlayer" },
                  { urn: "ppb:obb:footballPlayer:35716/e/34278006", typename: "ObbFootballPlayer" },
                  { urn: "ppb:obb:footballPlayer:35716/e/34278006", typename: "ObbFootballPlayer" },
                  { urn: "ppb:obb:footballPlayer:35716/e/34278006", typename: "ObbFootballPlayer" },
                ],
                value: 2,
                timePeriodId: "TimePeriodId",
                quantifier: "quantifier",
              },
            },
          },
        ],
      });
    });
  });
});
