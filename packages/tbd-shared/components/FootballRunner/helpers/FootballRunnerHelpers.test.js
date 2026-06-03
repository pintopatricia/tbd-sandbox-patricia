import {
  buildPlayerContextMaps,
  extractFootballPlayerRunnerContext,
  getPlayerStatValue,
  getRunnerJersey,
  resolveFixtureUrn,
  resolveJerseys,
} from "./FootballRunnerHelpers";

const mockGetFootballFixtureByURN = jest.fn();
const mockGetFootballPlayerFixtureContextByURN = jest.fn();

jest.mock("@ppb/tbd-store", () => ({
  FixtureTeamSide: { HOME: "HOME", AWAY: "AWAY" },
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createFootballFixtureByURNSelector: jest.fn(),
  createFootballPlayerFixtureContextByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  parseURN: jest.fn(() => ({ referenceId: "fixture|12345|player1" })),
  playerCodec: { extract: jest.fn(() => ({ eventURN: { referenceId: "12345" } })) },
  fixtureCodec: { encode: jest.fn(() => ({ uid: "ppb:tbd:fixture:11111" })) },
}));

const HOME_JERSEY_URL = "https://example.com/home-jersey.png";
const AWAY_JERSEY_URL = "https://example.com/away-jersey.png";
const PLAYER_URN_1 = "ppb:tbd:player:fixture|12345|player1";
const PLAYER_URN_2 = "ppb:tbd:player:fixture|12345|player2";
const HOME_TEAM_ID = "100";
const AWAY_TEAM_ID = "200";
const PLAYER_1_ID = "player1";
const PLAYER_2_ID = "player2";

const FOOTBALL_FIXTURE = {
  typename: "FootballFixture",
  home: { id: HOME_TEAM_ID, jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }] },
  away: { id: AWAY_TEAM_ID, jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }] },
};

const CARD = {
  firstPlayer: { urn: PLAYER_URN_1 },
  players: [{ urn: PLAYER_URN_1 }, { urn: PLAYER_URN_2 }],
};

const NULL_RESULT = { jerseys: null, playerHomeAwayMap: null, playerStats: null };

describe("FootballRunnerHelpers", () => {
  describe("extractFootballPlayerRunnerContext", () => {
    const getThrottle = jest.fn();
    const throttles = {};
    const footballFixtures = {};
    const footballPlayerFixtures = {};

    beforeEach(() => {
      jest.clearAllMocks();
      getThrottle.mockImplementation(() => ({ isActive: true }));
      mockGetFootballFixtureByURN.mockImplementation(() => FOOTBALL_FIXTURE);
      mockGetFootballPlayerFixtureContextByURN.mockImplementation(() => null);
    });

    describe("throttle gating", () => {
      it("returns null when both throttles are inactive", () => {
        getThrottle.mockReturnValue({ isActive: false });

        expect(
          extractFootballPlayerRunnerContext(
            getThrottle,
            mockGetFootballFixtureByURN,
            mockGetFootballPlayerFixtureContextByURN,
            throttles,
            CARD,
            footballFixtures,
            footballPlayerFixtures,
          ),
        ).toEqual(NULL_RESULT);
      });

      it("proceeds when only PLAYER_MARKETS_JERSEYS is active", () => {
        getThrottle.mockImplementation((_, key) =>
          key === "PLAYER_MARKETS_JERSEYS" ? { isActive: true } : { isActive: false },
        );

        const result = extractFootballPlayerRunnerContext(
          getThrottle,
          mockGetFootballFixtureByURN,
          mockGetFootballPlayerFixtureContextByURN,
          throttles,
          CARD,
          footballFixtures,
          footballPlayerFixtures,
        );

        expect(result.jerseys).not.toBeNull();
      });

      it("proceeds when only PLAYER_MARKETS_JERSEYS_AND_STATS is active", () => {
        getThrottle.mockImplementation((_, key) =>
          key === "PLAYER_MARKETS_JERSEYS_AND_STATS" ? { isActive: true } : { isActive: false },
        );

        const result = extractFootballPlayerRunnerContext(
          getThrottle,
          mockGetFootballFixtureByURN,
          mockGetFootballPlayerFixtureContextByURN,
          throttles,
          CARD,
          footballFixtures,
          footballPlayerFixtures,
        );

        expect(result.jerseys).not.toBeNull();
      });
    });

    describe("early returns", () => {
      it("returns null when card has no firstPlayer", () => {
        expect(
          extractFootballPlayerRunnerContext(
            getThrottle,
            mockGetFootballFixtureByURN,
            mockGetFootballPlayerFixtureContextByURN,
            throttles,
            {},
            footballFixtures,
            footballPlayerFixtures,
          ),
        ).toEqual(NULL_RESULT);
      });

      it("returns null when URN cannot be parsed", () => {
        const { parseURN } = require("@ppb/tbd-urn-codecs");
        parseURN.mockReturnValueOnce(null);

        expect(
          extractFootballPlayerRunnerContext(
            getThrottle,
            mockGetFootballFixtureByURN,
            mockGetFootballPlayerFixtureContextByURN,
            throttles,
            CARD,
            footballFixtures,
            footballPlayerFixtures,
          ),
        ).toEqual(NULL_RESULT);
      });

      it("returns null when fixture URN cannot be encoded", () => {
        const { fixtureCodec } = require("@ppb/tbd-urn-codecs");
        fixtureCodec.encode.mockReturnValueOnce({ uid: null });

        expect(
          extractFootballPlayerRunnerContext(
            getThrottle,
            mockGetFootballFixtureByURN,
            mockGetFootballPlayerFixtureContextByURN,
            throttles,
            CARD,
            footballFixtures,
            footballPlayerFixtures,
          ),
        ).toEqual(NULL_RESULT);
      });

      it("returns null when football fixture is not found", () => {
        mockGetFootballFixtureByURN.mockReturnValueOnce(undefined);

        expect(
          extractFootballPlayerRunnerContext(
            getThrottle,
            mockGetFootballFixtureByURN,
            mockGetFootballPlayerFixtureContextByURN,
            throttles,
            CARD,
            footballFixtures,
            footballPlayerFixtures,
          ),
        ).toEqual(NULL_RESULT);
      });

      it("returns null when fixture has a different typename", () => {
        mockGetFootballFixtureByURN.mockReturnValueOnce({ typename: "OtherFixture" });

        expect(
          extractFootballPlayerRunnerContext(
            getThrottle,
            mockGetFootballFixtureByURN,
            mockGetFootballPlayerFixtureContextByURN,
            throttles,
            CARD,
            footballFixtures,
            footballPlayerFixtures,
          ),
        ).toEqual(NULL_RESULT);
      });

      it("it does not return null for everything when jerseys are null", () => {
        const FALLBACK_URL = "https://content-s3.betfair.com/jic/uki/bf/Fallback_Jersey.png";
        mockGetFootballFixtureByURN.mockReturnValueOnce({
          ...FOOTBALL_FIXTURE,
          home: { ...FOOTBALL_FIXTURE.home, jerseys: [{ type: "HOME", url: FALLBACK_URL }] },
          away: { ...FOOTBALL_FIXTURE.away, jerseys: [{ type: "AWAY", url: FALLBACK_URL }] },
        });

        expect(
          extractFootballPlayerRunnerContext(
            getThrottle,
            mockGetFootballFixtureByURN,
            mockGetFootballPlayerFixtureContextByURN,
            throttles,
            CARD,
            footballFixtures,
            footballPlayerFixtures,
          ),
        ).toEqual({
          jerseys: null,
          playerHomeAwayMap: {},
          playerStats: {},
        });
      });
    });

    describe("jersey and player mapping", () => {
      it("returns correct home and away jerseys", () => {
        const { jerseys } = extractFootballPlayerRunnerContext(
          getThrottle,
          mockGetFootballFixtureByURN,
          mockGetFootballPlayerFixtureContextByURN,
          throttles,
          CARD,
          footballFixtures,
          footballPlayerFixtures,
        );

        expect(jerseys).toEqual({
          HOME: { type: "HOME", url: HOME_JERSEY_URL },
          AWAY: { type: "AWAY", url: AWAY_JERSEY_URL },
        });
      });

      it("returns empty playerHomeAwayMap when no player fixture contexts exist", () => {
        const { playerHomeAwayMap } = extractFootballPlayerRunnerContext(
          getThrottle,
          mockGetFootballFixtureByURN,
          mockGetFootballPlayerFixtureContextByURN,
          throttles,
          CARD,
          footballFixtures,
          footballPlayerFixtures,
        );

        expect(playerHomeAwayMap).toEqual({});
      });

      it("maps a home player correctly", () => {
        mockGetFootballPlayerFixtureContextByURN.mockImplementation((_, urn) =>
          urn === PLAYER_URN_1
            ? {
                typename: "FootballPlayerFixtureContext",
                player: { urn: PLAYER_URN_1, id: PLAYER_1_ID },
                team: { id: HOME_TEAM_ID },
              }
            : null,
        );

        const { playerHomeAwayMap } = extractFootballPlayerRunnerContext(
          getThrottle,
          mockGetFootballFixtureByURN,
          mockGetFootballPlayerFixtureContextByURN,
          throttles,
          CARD,
          footballFixtures,
          footballPlayerFixtures,
        );

        expect(playerHomeAwayMap).toEqual({ [PLAYER_1_ID]: "HOME" });
      });

      it("maps an away player correctly", () => {
        mockGetFootballPlayerFixtureContextByURN.mockImplementation((_, urn) =>
          urn === PLAYER_URN_1
            ? {
                typename: "FootballPlayerFixtureContext",
                player: { urn: PLAYER_URN_1, id: PLAYER_1_ID },
                team: { id: AWAY_TEAM_ID },
              }
            : null,
        );

        const { playerHomeAwayMap } = extractFootballPlayerRunnerContext(
          getThrottle,
          mockGetFootballFixtureByURN,
          mockGetFootballPlayerFixtureContextByURN,
          throttles,
          CARD,
          footballFixtures,
          footballPlayerFixtures,
        );

        expect(playerHomeAwayMap).toEqual({ [PLAYER_1_ID]: "AWAY" });
      });

      it("maps players from both teams", () => {
        mockGetFootballPlayerFixtureContextByURN.mockImplementation((_, urn) => {
          if (urn === PLAYER_URN_1)
            return {
              typename: "FootballPlayerFixtureContext",
              player: { urn: PLAYER_URN_1, id: PLAYER_1_ID },
              team: { id: HOME_TEAM_ID },
            };
          if (urn === PLAYER_URN_2)
            return {
              typename: "FootballPlayerFixtureContext",
              player: { urn: PLAYER_URN_2, id: PLAYER_2_ID },
              team: { id: AWAY_TEAM_ID },
            };
          return null;
        });

        const { playerHomeAwayMap } = extractFootballPlayerRunnerContext(
          getThrottle,
          mockGetFootballFixtureByURN,
          mockGetFootballPlayerFixtureContextByURN,
          throttles,
          CARD,
          footballFixtures,
          footballPlayerFixtures,
        );

        expect(playerHomeAwayMap).toEqual({ [PLAYER_1_ID]: "HOME", [PLAYER_2_ID]: "AWAY" });
      });
    });
  });

  describe("getRunnerJersey", () => {
    const jerseys = { HOME: { url: HOME_JERSEY_URL }, AWAY: { url: AWAY_JERSEY_URL } };
    const playerHomeAwayMap = { [PLAYER_1_ID]: "HOME", [PLAYER_2_ID]: "AWAY" };

    it("returns no jersey when jerseys is null", () => {
      expect(getRunnerJersey(null, playerHomeAwayMap, PLAYER_1_ID)).toEqual({
        jerseyUrl: undefined,
        useFallbackJersey: false,
      });
    });

    it("returns no jersey when playerHomeAwayMap is null", () => {
      expect(getRunnerJersey(jerseys, null, PLAYER_1_ID)).toEqual({
        jerseyUrl: undefined,
        useFallbackJersey: false,
      });
    });

    it("returns no jersey when participantId is undefined", () => {
      expect(getRunnerJersey(jerseys, playerHomeAwayMap, undefined)).toEqual({
        jerseyUrl: undefined,
        useFallbackJersey: false,
      });
    });

    it("returns no jersey when participantId is null", () => {
      expect(getRunnerJersey(jerseys, playerHomeAwayMap, null)).toEqual({
        jerseyUrl: undefined,
        useFallbackJersey: false,
      });
    });

    it("returns the home jersey URL for a home player", () => {
      expect(getRunnerJersey(jerseys, playerHomeAwayMap, PLAYER_1_ID)).toEqual({
        jerseyUrl: HOME_JERSEY_URL,
        useFallbackJersey: false,
      });
    });

    it("returns the away jersey URL for an away player", () => {
      expect(getRunnerJersey(jerseys, playerHomeAwayMap, PLAYER_2_ID)).toEqual({
        jerseyUrl: AWAY_JERSEY_URL,
        useFallbackJersey: false,
      });
    });

    it("returns useFallbackJersey=true when player is not in the home/away map", () => {
      expect(getRunnerJersey(jerseys, playerHomeAwayMap, "unknown-player-id")).toEqual({
        jerseyUrl: undefined,
        useFallbackJersey: true,
      });
    });
  });

  describe("resolveFixtureUrn", () => {
    const { parseURN, fixtureCodec } = require("@ppb/tbd-urn-codecs");

    it("returns null when parseURN cannot parse the player URN", () => {
      parseURN.mockReturnValueOnce(null);
      expect(resolveFixtureUrn("invalid-urn")).toBeNull();
    });

    it("returns null when fixtureCodec produces no uid", () => {
      fixtureCodec.encode.mockReturnValueOnce({ uid: null });
      expect(resolveFixtureUrn(PLAYER_URN_1)).toBeNull();
    });

    it("returns the fixture URN string on success", () => {
      expect(resolveFixtureUrn(PLAYER_URN_1)).toBe("ppb:tbd:fixture:11111");
    });
  });

  describe("resolveJerseys", () => {
    it("returns null when both team jersey URLs are undefined (no jerseys configured)", () => {
      expect(resolveJerseys({ home: { jerseys: [] }, away: { jerseys: [] } })).toBeNull();
    });

    it("returns null when both teams share the same jersey URL (SCA fallback scenario)", () => {
      const fallbackUrl = "https://example.com/fallback.png";
      expect(
        resolveJerseys({
          home: { jerseys: [{ type: "HOME", url: fallbackUrl }] },
          away: { jerseys: [{ type: "AWAY", url: fallbackUrl }] },
        }),
      ).toBeNull();
    });

    it("returns the jersey map when home and away URLs differ", () => {
      const homeJersey = { type: "HOME", url: HOME_JERSEY_URL };
      const awayJersey = { type: "AWAY", url: AWAY_JERSEY_URL };
      expect(
        resolveJerseys({
          home: { jerseys: [homeJersey] },
          away: { jerseys: [awayJersey] },
        }),
      ).toEqual({ HOME: homeJersey, AWAY: awayJersey });
    });
  });

  describe("buildPlayerContextMaps", () => {
    const FIXTURE = {
      home: { id: HOME_TEAM_ID, statsAllSeason: { matchesPlayed: 10 } },
      away: { id: AWAY_TEAM_ID, statsAllSeason: { matchesPlayed: 10 } },
    };
    const FIRST_GAME_FIXTURE = {
      home: { id: HOME_TEAM_ID, statsAllSeason: { matchesPlayed: 0 } },
      away: { id: AWAY_TEAM_ID, statsAllSeason: { matchesPlayed: 0 } },
    };
    const PLAYERS = [{ urn: PLAYER_URN_1, typename: "Player" }];
    const HOME_SEASON_STATS = { matchesPlayed: 10, totals: { goals: 5 } };

    beforeEach(() => {
      mockGetFootballPlayerFixtureContextByURN.mockReturnValue({
        typename: "FootballPlayerFixtureContext",
        player: { urn: PLAYER_URN_1, id: PLAYER_1_ID, seasonStats: HOME_SEASON_STATS },
        team: { id: HOME_TEAM_ID },
      });
    });

    it("maps a home player to FixtureTeamSide.HOME", () => {
      const { playerHomeAwayMap } = buildPlayerContextMaps(
        PLAYERS,
        FIXTURE,
        mockGetFootballPlayerFixtureContextByURN,
        {},
        true,
      );
      expect(playerHomeAwayMap[PLAYER_1_ID]).toBe("HOME");
    });

    it("maps an away player to FixtureTeamSide.AWAY", () => {
      mockGetFootballPlayerFixtureContextByURN.mockReturnValueOnce({
        typename: "FootballPlayerFixtureContext",
        player: { urn: PLAYER_URN_2, id: PLAYER_2_ID, seasonStats: HOME_SEASON_STATS },
        team: { id: AWAY_TEAM_ID },
      });
      const { playerHomeAwayMap } = buildPlayerContextMaps(
        PLAYERS,
        FIXTURE,
        mockGetFootballPlayerFixtureContextByURN,
        {},
        true,
      );
      expect(playerHomeAwayMap[PLAYER_2_ID]).toBe("AWAY");
    });

    it("returns playerStats: null when includeStats is false", () => {
      const { playerStats } = buildPlayerContextMaps(
        PLAYERS,
        FIXTURE,
        mockGetFootballPlayerFixtureContextByURN,
        {},
        false,
      );
      expect(playerStats).toBeNull();
    });

    it("populates playerStats when includeStats is true", () => {
      const { playerStats } = buildPlayerContextMaps(
        PLAYERS,
        FIXTURE,
        mockGetFootballPlayerFixtureContextByURN,
        {},
        true,
      );
      expect(playerStats[PLAYER_1_ID]).toEqual(HOME_SEASON_STATS);
    });

    it("omits playerStats when it is the first game of the competition", () => {
      const { playerStats } = buildPlayerContextMaps(
        PLAYERS,
        FIRST_GAME_FIXTURE,
        mockGetFootballPlayerFixtureContextByURN,
        {},
        true,
      );
      expect(playerStats).toEqual({});
    });
  });

  describe("getPlayerStatValue", () => {
    describe("AVG_YELLOW_RED_CARDS", () => {
      it("returns the fallback value when no stats are found", () => {
        expect(getPlayerStatValue(null, "AVG_GOALS")).toEqual({ value: "-" });
      });

      it("returns the sum of yellow and red card averages, not the average of the two", () => {
        const stats = { matchesPlayed: 10, averages: { yellowCards: 0.4, redCards: 0.1 } };
        expect(getPlayerStatValue(stats, "AVG_YELLOW_RED_CARDS")).toEqual({ value: "0.5" });
      });
    });
  });
});
