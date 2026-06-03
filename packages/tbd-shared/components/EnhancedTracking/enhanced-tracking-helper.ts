import { Fixture } from "@ppb/tbd-store/state/entities/Fixtures.types";
import {
  FootballFixture,
  FootballMatchStats,
  FootballParticipantStats,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import {
  PeriodDefinition,
  StatsThresholdDef,
  OutcomeDefinition,
  OutcomeDefinitionExp,
} from "@ppb/tbd-store/state/entities/OutcomeDefinition.types";
import { TrackingBarStatus } from "@ppb/the-wall-common/types";
import {
  FixtureStatus,
  FootballMatchStatus,
  Outcome,
  OutcomeDefinitionOperator,
  ParticipantType,
  Result,
} from "@ppb/tbd-store/state/constants";
import { OutcomeDefinitionTypeEnum } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { FootballPlayer } from "@ppb/tbd-store/state/entities/football-player-fixture-context/FootballPlayerFixtureContext.types";

export type EnhancedTrackingData = {
  status: TrackingBarStatus;
  currentValue?: number;
  goal: number;
  participantType: ParticipantType;
  participantId?: string;
};

type Outcomes = { operator?: OutcomeDefinitionOperator; outcomeDefinitions: OutcomeDefinition[] };

export const isPending = (fixtureStatus?: FixtureStatus, result?: Result): boolean => {
  const isPreplay = fixtureStatus === FixtureStatus.PRE_MATCH;
  const isVoid = result === Result.VOID;

  return isPreplay || isVoid;
};

const getPeriodStats = (
  stats: (FootballMatchStats | FootballParticipantStats)[],
  { period, periodStatus }: PeriodDefinition,
): FootballMatchStats | FootballParticipantStats | undefined =>
  stats.find(
    (stat: FootballMatchStats | FootballParticipantStats) =>
      stat.periodStatus === (periodStatus as unknown as FootballMatchStatus) &&
      ((!stat.period && !period) || stat.period === period),
  );

const getGoalValue = ({ threshold }: StatsThresholdDef): number => Math.round(threshold);

const getPlayerStats = (
  players: FootballPlayer[] | undefined,
  participantId: string,
  includeSubstitutions: boolean,
): FootballParticipantStats[] | undefined => {
  const player = players?.find(({ id }) => id === participantId);

  if (!player) {
    return undefined;
  }

  if (!includeSubstitutions || !player.substitutions) {
    return player.stats;
  }

  const subStats = player.substitutions.map((sub) => sub.player.stats);
  const playerAndSubStats = [player.stats, ...subStats];

  const outcomeKeys = Object.values(Outcome);
  const footballParticipantStatsMap: Record<string, FootballParticipantStats> = {};

  playerAndSubStats.flat().forEach((playerStats) => {
    if (!playerStats) {
      return;
    }

    const key = `${playerStats.periodStatus}_${playerStats.period}`;
    const combinedStats = footballParticipantStatsMap[key] || {};

    outcomeKeys.forEach((outcomeKey) => {
      combinedStats[outcomeKey] = (playerStats[outcomeKey] || 0) + (combinedStats[outcomeKey] || 0);
    });

    footballParticipantStatsMap[key] = { ...playerStats, ...combinedStats };
  });

  return Object.values(footballParticipantStatsMap);
};

const getFootballEnhancedTrackingDataByOutcomeDefinition = (
  fixture: FootballFixture,
  { query, statsThresholdDef }: OutcomeDefinition,
  includeSubstitutions: boolean,
  result?: Result,
): EnhancedTrackingData | undefined => {
  let status;
  switch (query.participant.type) {
    case ParticipantType.TEAM:
      status =
        (isPending(fixture?.fixtureStatus, result) && TrackingBarStatus.PENDING) ||
        (fixture.stats ? TrackingBarStatus.ACTIVE : TrackingBarStatus.PLACEHOLDER);
      if (!fixture.stats || status === TrackingBarStatus.PENDING) {
        return {
          status,
          goal: getGoalValue(statsThresholdDef),
          participantType: ParticipantType.TEAM,
          currentValue: 0,
        };
      }

      if (query.participant.side) {
        const stats = getPeriodStats(fixture.stats, query.periodDefinition) as FootballMatchStats | undefined;

        if (!stats) {
          return undefined;
        }

        const sideStats = stats[query.participant.side];

        if (!sideStats) {
          return undefined;
        }

        return {
          status,
          currentValue: sideStats[query.outcome] ?? undefined,
          goal: getGoalValue(statsThresholdDef),
          participantType: ParticipantType.TEAM,
        };
      }
      return undefined;
    case ParticipantType.PLAYER: {
      const { participantId } = query.participant;
      if (!participantId) {
        return undefined;
      }

      const playerStats = getPlayerStats(fixture.players, participantId, includeSubstitutions);

      const defaultData = {
        status:
          (isPending(fixture?.fixtureStatus, result) && TrackingBarStatus.PENDING) ||
          (playerStats?.length ? TrackingBarStatus.ACTIVE : TrackingBarStatus.PLACEHOLDER),
        currentValue: 0,
        goal: getGoalValue(statsThresholdDef),
        participantType: ParticipantType.PLAYER,
        participantId,
      };

      const stats = getPeriodStats(playerStats || [], query.periodDefinition) as FootballParticipantStats | undefined;

      if (!stats || defaultData.status === TrackingBarStatus.PENDING) {
        return defaultData;
      }

      return {
        ...defaultData,
        currentValue: stats[query.outcome] ?? undefined,
      };
    }
    default:
      return undefined;
  }
};

const getFootballEnhancedTrackingData = (
  fixture: FootballFixture,
  outcomeDefinitions: OutcomeDefinition[],
  operator: OutcomeDefinitionOperator | undefined,
  includeSubstitutions: boolean,
  result?: Result,
): EnhancedTrackingData[] => {
  const outcomes = outcomeDefinitions.reduce((acc: EnhancedTrackingData[], outcomeDefinition) => {
    const outcome = getFootballEnhancedTrackingDataByOutcomeDefinition(
      fixture,
      outcomeDefinition,
      includeSubstitutions,
      result,
    );

    if (outcome) {
      acc.push(outcome);
    }
    return acc;
  }, []);

  if (operator === OutcomeDefinitionOperator.OR && outcomes.length) {
    return [
      {
        ...outcomes[0],
        currentValue: Math.min(Math.max(...outcomes.map((x) => x.currentValue || 0)), outcomes[0].goal),
      },
    ];
  }

  return outcomes;
};

export const getOutcomeDefinitionParts = ({ outcomeDefinitionEntries }: OutcomeDefinitionExp) =>
  outcomeDefinitionEntries.reduce(
    (acc: Outcomes, outcomeDefinition) => {
      if (outcomeDefinition.outcomeDefinitionType === OutcomeDefinitionTypeEnum.Operator) {
        acc.operator = outcomeDefinition.operator;
        return acc;
      }

      if (outcomeDefinition.outcomeDefinition) {
        acc.outcomeDefinitions.push(outcomeDefinition.outcomeDefinition);
      }

      return acc;
    },

    {
      outcomeDefinitions: [],
    },
  );

export const getEnhancedTrackingData = (
  fixture: Fixture,
  outcomeDefinitionExp: OutcomeDefinitionExp,
  includeSubstitutions: boolean,
  result?: Result,
): EnhancedTrackingData[] => {
  const { operator, outcomeDefinitions } = getOutcomeDefinitionParts(outcomeDefinitionExp);

  switch (fixture?.typename) {
    case "FootballFixture":
      return getFootballEnhancedTrackingData(fixture, outcomeDefinitions, operator, includeSubstitutions, result);
    case "BasketballFixture":
    case "CricketFixture":
    case "TableTennisFixture":
    case "TennisMatch":
    default:
      return [];
  }
};
