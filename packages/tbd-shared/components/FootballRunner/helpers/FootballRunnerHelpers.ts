import { Entities, FeatureThrottle, FixtureTeamSide, Throttles } from "@ppb/tbd-store";
import {
  createFootballFixtureByURNSelector,
  createFootballPlayerFixtureContextByURNSelector,
} from "@ppb/tbd-store/state/entities/entities-selectors";
import { GridCard, MarketCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { parseURN, playerCodec, fixtureCodec } from "@ppb/tbd-urn-codecs";
import { ParametricSelector } from "reselect";
import {
  FootballPlayerSeasonStats,
  FootballPlayerSeasonStatsDetails,
} from "@ppb/tbd-store/state/entities/football-player-fixture-context/FootballPlayerFixtureContext.types";
import URN from "@ppb/tbd-store/state/layout/URN";

const FALLBACK_STAT_VALUE = "-";

const STAT_KEY_TO_FIELD: Partial<Record<string, keyof FootballPlayerSeasonStatsDetails>> = {
  GOALS: "goals",
  ASSISTS: "assists",
  FOULS: "fouls",
  FOULS_WON: "foulsWon",
  FOUL_INVOLVEMENTS: "foulInvolvements",
  SHOTS: "totalShots",
  SHOTS_ON_TARGET: "shotsOnTarget",
};

export const STAT_LABEL_I18N_KEY: Partial<Record<string, string>> = {
  TOTAL_YELLOW_RED_CARDS: "I18N.IN_LINE_STATS_TOTAL_CARDS",
};

type StatValueResult = {
  value: string;
  interpolation?: Record<string, string | number>;
};

export const getPlayerStatValue = (
  footballPlayerStats: FootballPlayerSeasonStats | undefined,
  statId: string | undefined,
): StatValueResult | undefined => {
  if (!statId) return undefined;
  if (!footballPlayerStats || (footballPlayerStats?.matchesPlayed ?? 0) === 0) return { value: FALLBACK_STAT_VALUE };

  const underscoreIndex = statId.indexOf("_");
  const aggregationType = statId.slice(0, underscoreIndex);
  const statKey = statId.slice(underscoreIndex + 1);
  const statsDetails = aggregationType === "TOTAL" ? footballPlayerStats.totals : footballPlayerStats.averages;

  if (!statsDetails) return { value: FALLBACK_STAT_VALUE };

  if (statKey === "GOALS_ASSISTS") {
    if (aggregationType === "TOTAL") {
      const total = (statsDetails.goals ?? 0) + (statsDetails.assists ?? 0);
      /* reusing I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES as a temporary key — its {{cards}} placeholder
         carries the goals+assists total here. If TOTAL_GOALS_ASSISTS is ever actively used,
         a dedicated i18n key with a {{goalsAssists}} interpolation should replace this. */
      return {
        value: "I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES",
        interpolation: { cards: total, matches: footballPlayerStats.matchesPlayed ?? 0 },
      };
    }
    return { value: ((statsDetails.goals ?? 0) + (statsDetails.assists ?? 0)).toFixed(1) };
  }

  /* despite existing a yellowRedCards stat, what we want here is the average of yellow and red cards,
  so we calculate it based on the available stats */
  if (statKey === "YELLOW_RED_CARDS") {
    if (aggregationType === "TOTAL") {
      const total = (statsDetails.yellowCards ?? 0) + (statsDetails.redCards ?? 0);
      return {
        value: "I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES",
        interpolation: { cards: total, matches: footballPlayerStats.matchesPlayed ?? 0 },
      };
    }
    return { value: ((statsDetails.yellowCards ?? 0) + (statsDetails.redCards ?? 0)).toFixed(1) };
  }

  const field = STAT_KEY_TO_FIELD[statKey];
  return field !== undefined ? { value: statsDetails[field]?.toFixed(1) ?? FALLBACK_STAT_VALUE } : undefined;
};

export const resolveFixtureUrn = (playerUrn: string): string | null => {
  const parsedUrn = parseURN(playerUrn);
  if (!parsedUrn) return null;
  const { eventURN } = playerCodec.extract(parsedUrn);
  return fixtureCodec.encode(eventURN.referenceId).uid ?? null;
};

type FootballFixtureEntity = Extract<
  ReturnType<ReturnType<typeof createFootballFixtureByURNSelector>>,
  { typename: "FootballFixture" }
>;

export const resolveJerseys = (fixture: FootballFixtureEntity): Record<string, { url?: string }> | null => {
  const jerseys = {
    [FixtureTeamSide.AWAY]: fixture.away?.jerseys?.find((j) => j.type === FixtureTeamSide.AWAY) ?? {},
    [FixtureTeamSide.HOME]: fixture.home?.jerseys?.find((j) => j.type === FixtureTeamSide.HOME) ?? {},
  };
  // If both teams have same jersey URL, SCA likely returned the fallback for both — don't show jerseys
  return jerseys[FixtureTeamSide.AWAY].url === jerseys[FixtureTeamSide.HOME].url ? null : jerseys;
};

export const buildPlayerContextMaps = (
  players: (GridCard | MarketCard)["players"],
  fixture: FootballFixtureEntity,
  getFootballPlayerFixtureContextByURN: ReturnType<typeof createFootballPlayerFixtureContextByURNSelector>,
  footballPlayerFixtures: Entities["footballplayerfixturecontexts"],
  includeStats: boolean,
): {
  playerHomeAwayMap: Record<string, FixtureTeamSide | undefined>;
  playerStats: Record<string, FootballPlayerSeasonStats | undefined> | null;
} => {
  const homeTeamId = fixture.home?.id;
  const awayTeamId = fixture.away?.id;
  const playerHomeAwayMap: Record<string, FixtureTeamSide | undefined> = {};
  const playerStats: Record<string, FootballPlayerSeasonStats | undefined> | null = includeStats ? {} : null;
  const isFirstGameOfCompetition =
    (fixture.home?.statsAllSeason?.matchesPlayed ?? 0) === 0 &&
    (fixture.away?.statsAllSeason?.matchesPlayed ?? 0) === 0;

  players?.forEach((playerEdge: { urn: URN; typename: string }) => {
    const context = getFootballPlayerFixtureContextByURN(footballPlayerFixtures, playerEdge.urn);
    if (context?.typename === "FootballPlayerFixtureContext" && context.player?.urn) {
      const { player, team } = context;
      if (player.id && team?.id) {
        if (team.id === homeTeamId?.toString()) {
          playerHomeAwayMap[player.id] = FixtureTeamSide.HOME;
        } else if (team.id === awayTeamId?.toString()) {
          playerHomeAwayMap[player.id] = FixtureTeamSide.AWAY;
        }
        if (playerStats && !isFirstGameOfCompetition) {
          playerStats[player.id] = player.seasonStats;
        }
      }
    }
  });

  return { playerHomeAwayMap, playerStats };
};

export const extractFootballPlayerRunnerContext = (
  getThrottle: ParametricSelector<Throttles, string, FeatureThrottle | undefined>,
  getFootballFixtureByURN: ReturnType<typeof createFootballFixtureByURNSelector>,
  getFootballPlayerFixtureContextByURN: ReturnType<typeof createFootballPlayerFixtureContextByURNSelector>,
  throttles: Throttles,
  card: GridCard | MarketCard,
  footballFixtures: Entities["footballfixtures"],
  footballPlayerFixtures: Entities["footballplayerfixturecontexts"],
) => {
  const playerMarketsJerseysActive = !!getThrottle(throttles, "PLAYER_MARKETS_JERSEYS")?.isActive;
  const playerMarketsJerseysAndStatsActive = !!getThrottle(throttles, "PLAYER_MARKETS_JERSEYS_AND_STATS")?.isActive;

  const NULL_RESULT = { jerseys: null, playerHomeAwayMap: null, playerStats: null };

  if (!playerMarketsJerseysActive && !playerMarketsJerseysAndStatsActive) return NULL_RESULT;

  const firstPlayerUrn = card.firstPlayer?.urn;
  if (!firstPlayerUrn) return NULL_RESULT;

  const fixtureUrn = resolveFixtureUrn(firstPlayerUrn);
  if (!fixtureUrn) return NULL_RESULT;

  const footballFixture = getFootballFixtureByURN(footballFixtures, fixtureUrn);
  if (footballFixture?.typename !== "FootballFixture") return NULL_RESULT;

  const jerseys = resolveJerseys(footballFixture);

  const { playerHomeAwayMap, playerStats } = buildPlayerContextMaps(
    card.players,
    footballFixture,
    getFootballPlayerFixtureContextByURN,
    footballPlayerFixtures,
    playerMarketsJerseysAndStatsActive,
  );

  return { jerseys, playerHomeAwayMap, playerStats };
};

export const getRunnerJersey = (
  jerseys: Record<string, { url?: string }> | null,
  playerHomeAwayMap: Record<string, FixtureTeamSide | undefined> | null,
  participantId?: string | null,
) => {
  if (!jerseys || !playerHomeAwayMap || !participantId) {
    return { jerseyUrl: undefined, useFallbackJersey: false };
  }

  const playerType = playerHomeAwayMap[participantId];
  return playerType
    ? { jerseyUrl: jerseys[playerType]?.url, useFallbackJersey: false }
    : { jerseyUrl: undefined, useFallbackJersey: true };
};
