import normalizer from "./football-player-fixture-context-normalizer";
import footballFixtureNormalizer from "../football-fixture/football-fixture-normalizer";

const BFF_FIXTURE_PLAYER_DATA = {
  urn: "ppb:tbd:footballplayer:fixture:2960|35426570",
  __typename: "FootballPlayerFixtureContext",
  team: {
    id: "3843",
  },
  player: {
    urn: "ppb:tbd:player:2960|35426570",
    __typename: "FootballPlayerFixture",
    id: "2960",
    name: "Harry Kane",
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
    },
  },
};

const BFF_FIXTURE_JERSEYS_DATA = {
  urn: "ppb:tbd:footballplayer:fixture:2960|35426570",
  fixture: {
    urn: "ppb:fixture:35426570",
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
};

describe("FootballPlayerFixtureContext normalizer", () => {
  describe("when requesting player data", () => {
    it("should normalize the team fields correctly", () => {
      const normalizedData = normalizer(BFF_FIXTURE_PLAYER_DATA).data;

      expect(normalizedData.team).toEqual(expect.objectContaining(BFF_FIXTURE_PLAYER_DATA.team));
    });

    it("should normalize the player fields correctly", () => {
      const normalizedData = normalizer(BFF_FIXTURE_PLAYER_DATA).data;

      expect(normalizedData.player).toEqual(expect.objectContaining(BFF_FIXTURE_PLAYER_DATA.player));
    });

    it("should not fail normalizing the fixture fields", () => {
      const normalizedData = normalizer(BFF_FIXTURE_PLAYER_DATA).data;

      expect(normalizedData.fixture).toEqual(undefined);
    });
  });

  describe("when requesting fixture data", () => {
    it("should not fail normalizing the team fields", () => {
      const normalizedData = normalizer(BFF_FIXTURE_JERSEYS_DATA).data;

      expect(normalizedData.team).toEqual(undefined);
    });

    it("should not fail normalizing the player fields", () => {
      const normalizedData = normalizer(BFF_FIXTURE_JERSEYS_DATA).data;

      expect(normalizedData.player).toEqual(undefined);
    });

    it("should not fail normalizing the fixture fields", () => {
      const normalizedData = normalizer(BFF_FIXTURE_JERSEYS_DATA).data;

      expect(normalizedData.fixture).toEqual(undefined);
    });

    it("football fixture normalizer should normalize the sent data", () => {
      const footballFixtureNormalizedData = footballFixtureNormalizer(BFF_FIXTURE_JERSEYS_DATA.fixture).data;

      expect(footballFixtureNormalizedData).toEqual(
        expect.objectContaining({
          ...BFF_FIXTURE_JERSEYS_DATA.fixture,
          away: {
            ...BFF_FIXTURE_JERSEYS_DATA.fixture.away,
            id: Number.parseInt(BFF_FIXTURE_JERSEYS_DATA.fixture.away.id),
            jerseys: BFF_FIXTURE_JERSEYS_DATA.fixture.away.jerseys.map((jersey) => {
              return {
                ...jersey,
                color: jersey.color ? `#${jersey.color}` : null,
              };
            }),
          },
          home: {
            ...BFF_FIXTURE_JERSEYS_DATA.fixture.home,
            id: Number.parseInt(BFF_FIXTURE_JERSEYS_DATA.fixture.home.id),
            jerseys: BFF_FIXTURE_JERSEYS_DATA.fixture.home.jerseys.map((jersey) => {
              return {
                ...jersey,
                color: jersey.color ? `#${jersey.color}` : null,
              };
            }),
          },
        }),
      );
    });
  });
});
