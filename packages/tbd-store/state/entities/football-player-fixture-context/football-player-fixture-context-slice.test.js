import { fetchCatalogueSuccessAction } from "../../../actions/catalogue";

import footballPlayerFixtureContext from "./football-player-fixture-context-slice";

const footballPlayerFixtureContextData = {
  urn: "ppb:tbd:footballplayer:fixture:2960|35426570",
  fixture: {
    urn: "ppb:fixture:35426570",
    scheduledAt: "2026-03-31T18:45:00Z",
    startedAt: null,
    home: {
      id: "3843",
      jerseys: [
        {
          color: "2D4781",
          url: "https://content-s3.betfair.com/jic/uki/bf/England_Home_Jersey.png",
          type: "HOME",
        },
        {
          color: "605168",
          url: "https://content-s3.betfair.com/jic/uki/bf/England_Away_Jersey.png",
          type: "AWAY",
        },
      ],
    },
    away: {
      id: "5000",
      jerseys: [
        {
          color: "908D8B",
          url: "https://content-s3.betfair.com/jic/uki/bf/Fallback_Jersey.png",
          type: "HOME",
        },
        {
          color: "908D8B",
          url: "https://content-s3.betfair.com/jic/uki/bf/Fallback_Jersey.png",
          type: "AWAY",
        },
      ],
    },
  },
  team: {
    urn: "ppb:footballTeam:3843|35426570",
    id: "3843",
    name: "England",
    color: null,
    formation: null,
    abbreviation: null,
    crest: null,
    jerseys: [
      {
        type: "HOME",
        color: "2D4781",
        url: "https://content-s3.betfair.com/jic/uki/bf/England_Home_Jersey.png",
      },
      {
        type: "AWAY",
        color: "605168",
        url: "https://content-s3.betfair.com/jic/uki/bf/England_Away_Jersey.png",
      },
    ],
  },
  player: {
    urn: "ppb:tbd:player:2960|35426570",
    id: "2960",
    name: "Harry Kane",
    position: null,
    positionDescription: "",
    shirtNumber: null,
    startingType: null,
    formationPlace: null,
    seasonStats: {
      matchesPlayed: 0,
      averages: {
        shotsOnTarget: 0,
        totalShots: 0,
        goals: 0,
        yellowCards: 0,
        redCards: 0,
        yellowRedCards: 0,
        firstGoalScored: 0,
        lastGoalScored: 0,
        foulsPerMatch: null,
        fouls: 0,
        foulsWon: 0,
        passes: 0,
        assists: 0,
      },
      totals: {
        shotsOnTarget: 0,
        totalShots: 0,
        goals: 0,
        yellowCards: 0,
        redCards: 0,
        yellowRedCards: 0,
        firstGoalScored: 4,
        lastGoalScored: 2,
        foulsPerMatch: null,
        fouls: 0,
        foulsWon: 0,
        passes: 0,
        assists: 0,
      },
    },
  },
};

const payload = {
  data: {
    FootballPlayerFixtureContext: [footballPlayerFixtureContextData],
  },
};

describe('"footballPlayerFixtureContextSlice" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = footballPlayerFixtureContext.reducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    it("should return the new fixtures", () => {
      const action = { type: fetchCatalogueSuccessAction.type, payload };
      const state = footballPlayerFixtureContext.reducer({}, action);

      expect(state).toEqual({
        [footballPlayerFixtureContextData.urn]: footballPlayerFixtureContextData,
      });
    });

    it("should not delete props if they come undefined", () => {
      const action = {
        type: fetchCatalogueSuccessAction.type,
        payload: {
          data: {
            FootballPlayerFixtureContext: [
              {
                urn: footballPlayerFixtureContextData.urn,
                team: undefined,
                player: undefined,
              },
            ],
          },
        },
      };
      const state = footballPlayerFixtureContext.reducer(
        {
          [footballPlayerFixtureContextData.urn]: footballPlayerFixtureContextData,
        },
        action,
      );

      expect(state).toEqual({
        [footballPlayerFixtureContextData.urn]: footballPlayerFixtureContextData,
      });
    });
  });
});
