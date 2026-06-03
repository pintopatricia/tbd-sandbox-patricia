import type {
  Operand,
  Outcome,
  ExpressionComponents,
  FootballFixture,
  ExpressionMetadata,
  ExpressionParticipant,
} from "@ppb/tbd-store";
import { FootballPlayer } from "@ppb/tbd-store/state/entities/football-player-fixture-context/FootballPlayerFixtureContext.types";
import { TrackingBarStatus } from "@ppb/the-wall-common/types/TrackingBar/TrackingBar.types";
import { FixtureStatus, type Result } from "@ppb/tbd-store/state/constants";
import {
  type EnhancedTrackingData,
  EnhancedTrackingDataType,
  FootballPeriodScaMap,
  type OutcomeDefinition,
  type ProgressBarTrackingData,
  StatsListTrackingData,
} from "./ObbEnhancedTracking.types";
import { isPending } from "../EnhancedTracking/enhanced-tracking-helper";

const outcomeToSCAStat: { [key: string]: string } = {
  SHOTS: "totalShots",
  SHOTS_TIME_ADJUSTED: "totalShots",
  SHOTS_ON_TARGET: "shotsOnTarget",
  SHOTS_ON_TARGET_TIME_ADJUSTED: "shotsOnTarget",
  GOALS: "goals",
  GOALS_TIME_ADJUSTED: "goals",
  FOULS_COMMITTED: "fouls",
  FOULS_COMMITTED_TIME_ADJUSTED: "fouls",
  BOOKED: "booked",
  PASSES_TIME_ADJUSTED: "passes",
  FOULS_WON: "foulsWon",
  FOULS_WON_TIME_ADJUSTED: "foulsWon",
  ASSISTS: "assists",
  ASSISTS_TIME_ADJUSTED: "assists",
  FOUL_INVOLVEMENTS: "foulInvolvements",
  FOUL_INVOLVEMENTS_TIME_ADJUSTED: "foulInvolvements",
};

const getStatValue = (
  footballPlayers: FootballPlayer[],
  participantId: string,
  period: string,
  periodStatus: string,
  outcome: string,
): number | undefined => {
  const player = footballPlayers.find((p) => p.id === participantId);

  if (!player?.stats) return undefined;

  const statsArray = Array.isArray(player.stats) ? player.stats : [player.stats];

  const matchingStat = statsArray.find((item) => item.period === period && item.periodStatus === periodStatus);

  const value = matchingStat?.[outcomeToSCAStat[outcome] as keyof typeof matchingStat];

  return typeof value === "number" ? value : undefined;
};

const getParticipantsCombinedCurrentValue = (
  footballPlayers: FootballPlayer[] | undefined,
  outcomeDefinitions: OutcomeDefinition[],
): number | undefined => {
  let sum: number | undefined = 0;

  for (const outcome of outcomeDefinitions) {
    const statValue = getStatValue(
      footballPlayers ?? [],
      outcome.participantId,
      "REGULAR",
      outcome.periodStatus,
      outcome.outcome,
    );

    if (statValue === undefined) {
      sum = undefined;
      break;
    }

    sum += statValue;
  }

  return sum;
};

const getPlayerName = (participants: ExpressionParticipant[], participantId: string): string | undefined => {
  const player = participants.find((participant) => participant.id === participantId);
  return player?.name ?? undefined;
};

const isLiteralOperand = (rightOperand: Operand[]): boolean =>
  rightOperand.length === 1 && "decimal" in rightOperand[0];

const mapOutcomeToDefinition = (outcome: Outcome): OutcomeDefinition => ({
  outcome: outcome.outcomeId,
  participantId: outcome.participantId,
  periodStatus: FootballPeriodScaMap[outcome.timePeriodId],
  period: "REGULAR",
});

const getOutcomeDefinition = (operands: Operand[]): OutcomeDefinition[] =>
  operands.filter((outcome) => "outcomeId" in outcome).map((outcome) => mapOutcomeToDefinition(outcome as Outcome));

const buildTrackingBarData = (
  outcomeDefinitions: OutcomeDefinition[],
  status: TrackingBarStatus,
  goal: number | undefined,
  fixture: FootballFixture,
): ProgressBarTrackingData | undefined => {
  const currentValue =
    fixture.fixtureStatus === FixtureStatus.PRE_MATCH
      ? 0
      : getParticipantsCombinedCurrentValue(fixture.players, outcomeDefinitions);

  if (currentValue === undefined) {
    return undefined;
  }
  return {
    status,
    enhancedTrackingType: EnhancedTrackingDataType.PROGRESS,
    goal,
    outcomeDefinitions,
    currentValue,
  };
};

const buildIndividualTrackingData = (
  outcomeDefinitions: OutcomeDefinition[],
  fixture: FootballFixture,
  participants: ExpressionParticipant[] | undefined,
): StatsListTrackingData => {
  const individualTrackingData: StatsListTrackingData = {
    enhancedTrackingType: EnhancedTrackingDataType.INDIVIDUAL_TRACKING,
    statsListTrackingData: [],
  };

  outcomeDefinitions.forEach((outcomeDefinition) => {
    const label = getPlayerName(participants ?? [], outcomeDefinition.participantId);

    const stat =
      fixture.fixtureStatus !== FixtureStatus.PRE_MATCH
        ? getStatValue(
            fixture.players ?? [],
            outcomeDefinition.participantId,
            outcomeDefinition.period,
            outcomeDefinition.periodStatus,
            outcomeDefinition.outcome,
          )
        : 0;

    if (label !== undefined) {
      individualTrackingData.statsListTrackingData.push({
        outcome: outcomeDefinition.outcome,
        label,
        stat,
      });
    }
  });
  const somePlayerDontHaveStats = individualTrackingData.statsListTrackingData.some(
    (individualTracking) => individualTracking.stat === undefined,
  );

  if (somePlayerDontHaveStats) {
    individualTrackingData.statsListTrackingData = [];
  }
  return individualTrackingData;
};

const buildSquadTrackingData = (
  leftOperandOutcomeDefinitions: OutcomeDefinition[],
  rightOperandOutcomeDefinitions: OutcomeDefinition[],
  fixture: FootballFixture,
  participants: ExpressionParticipant[] | undefined,
  isPvP?: boolean,
): StatsListTrackingData => {
  const isPreMatch = fixture.fixtureStatus === FixtureStatus.PRE_MATCH;
  const playerList = fixture.players ?? [];
  const participantList = participants ?? [];

  const buildOperandData = (outcomeDefinitions: OutcomeDefinition[]) => {
    const players = outcomeDefinitions
      .map((outcomeDefinition) => getPlayerName(participantList, outcomeDefinition.participantId))
      .filter(Boolean) as string[];

    const stats = isPreMatch
      ? Array(players.length).fill(0)
      : outcomeDefinitions.map((outcomeDefinition) =>
          getStatValue(
            playerList,
            outcomeDefinition.participantId,
            outcomeDefinition.period,
            outcomeDefinition.periodStatus,
            outcomeDefinition.outcome,
          ),
        );

    if (stats.some((stat) => stat === undefined)) {
      return undefined;
    }

    const label =
      players.length > 1 ? `${players.slice(0, -1).join(", ")} & ${players[players.length - 1]}` : players[0] || "";

    return {
      label,
      stat: stats.reduce((sum, stat) => sum + stat, 0),
      outcome: outcomeDefinitions[0]?.outcome,
    };
  };

  const leftOperandData = buildOperandData(leftOperandOutcomeDefinitions);
  const rightOperandData = buildOperandData(rightOperandOutcomeDefinitions);
  const someOperandHasNoStatsData = leftOperandData === undefined || rightOperandData === undefined;

  if (someOperandHasNoStatsData) {
    return {
      enhancedTrackingType: isPvP
        ? EnhancedTrackingDataType.INDIVIDUAL_TRACKING
        : EnhancedTrackingDataType.SQUAD_TRACKING,
      statsListTrackingData: [],
    };
  }

  return {
    enhancedTrackingType: isPvP
      ? EnhancedTrackingDataType.INDIVIDUAL_TRACKING
      : EnhancedTrackingDataType.SQUAD_TRACKING,
    statsListTrackingData: [leftOperandData, rightOperandData],
  };
};

export const getEnhancedTrackingData = (
  fixture: FootballFixture,
  expressionComponents: ExpressionComponents,
  expressionMetadata?: ExpressionMetadata,
  result?: Result,
): EnhancedTrackingData[] => {
  const { operator, rightOperand, leftOperand } = expressionComponents;
  const participants = expressionMetadata?.participants;
  const enhancedTrackingData: EnhancedTrackingData[] = [];
  const goal = "decimal" in rightOperand[0] ? rightOperand[0].decimal : undefined;

  const isParticipantsCombined = isLiteralOperand(rightOperand) && [">", ">="].includes(operator);
  const isPvpOrSquadVsSquad =
    !isLiteralOperand(rightOperand) && !isLiteralOperand(leftOperand) && [">", "<"].includes(operator);

  if (isParticipantsCombined) {
    const status =
      (isPending(fixture?.fixtureStatus, result) && TrackingBarStatus.PENDING) ||
      (fixture.stats ? TrackingBarStatus.ACTIVE : TrackingBarStatus.PLACEHOLDER);

    const outcomeDefinitions = getOutcomeDefinition(leftOperand);

    const progressBarData = buildTrackingBarData(outcomeDefinitions, status, goal, fixture);

    if (progressBarData) {
      enhancedTrackingData.push(progressBarData);
    }

    const individualTrackingData = buildIndividualTrackingData(outcomeDefinitions, fixture, participants);

    enhancedTrackingData.push(individualTrackingData);
  }

  if (isPvpOrSquadVsSquad) {
    const isPvP = leftOperand.length === 1 && rightOperand.length === 1;
    const leftOperandOutcomeDefinitions = getOutcomeDefinition(leftOperand);
    const rightOperandOutcomeDefinitions = getOutcomeDefinition(rightOperand);

    const outcomeDefinitions =
      operator === "<"
        ? [rightOperandOutcomeDefinitions, leftOperandOutcomeDefinitions]
        : [leftOperandOutcomeDefinitions, rightOperandOutcomeDefinitions];

    const squadTrackingData: StatsListTrackingData = buildSquadTrackingData(
      outcomeDefinitions[0],
      outcomeDefinitions[1],
      fixture,
      participants,
      isPvP,
    );

    enhancedTrackingData.push(squadTrackingData);
  }

  return enhancedTrackingData;
};
