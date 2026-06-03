import normalizeObbFootballPlayerFragmentIntoObbFootballPlayer from "./obb-football-player-normalizer";

const BFF_RESPONSE = {
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
    jerseys: [
      {
        url: "jersey.png",
        __typename: "Jerseys",
      },
      {
        __typename: "Jerseys",
      },
    ],
    __typename: "FootballTeamDetails",
  },
};

describe("OBB football player normalizer", () => {
  describe("normalizeObbFootballPlayerFragmentIntoObbFootballPlayer", () => {
    describe("when receiving valid props", () => {
      describe("when have all the data", () => {
        it("should correctly transform and return the data", () => {
          const { data } = normalizeObbFootballPlayerFragmentIntoObbFootballPlayer(BFF_RESPONSE);

          expect(data).toEqual({
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
              jerseys: [
                {
                  url: "jersey.png",
                },
                {
                  url: null,
                },
              ],
            },
            incidentTypes: {},
            typename: "ObbFootballPlayer",
            urn: "ppb:obb:footballPlayer:35716/e/34278006",
          });
        });
      });

      describe("when does not have all the data", () => {
        it("should correctly transform and return the data", () => {
          BFF_RESPONSE.seasonStats = null;
          BFF_RESPONSE.team.jerseys = null;

          const { data } = normalizeObbFootballPlayerFragmentIntoObbFootballPlayer(BFF_RESPONSE);

          expect(data).toEqual({
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
          });
        });
      });
    });
  });
});
