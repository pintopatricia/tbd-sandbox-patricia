import { ParticipantSide, ParticipantType, Comparison, Outcome, OutcomeDefinitionOperator } from "../constants";

type Period = "REGULAR";
type PeriodStatus = "FULL" | "INPLAY_FIRST_HALF" | "INPLAY_SECOND_HALF";
type OutcomeDefinitionTypeEnum = "OPERAND" | "OPERATOR";

export type OutcomeDefinitionExp = {
  outcomeDefinitionEntries: OutcomeDefinitionEntry[];
};

export type OutcomeDefinitionEntry = {
  outcomeDefinitionType: OutcomeDefinitionTypeEnum;
  operator?: OutcomeDefinitionOperator;
  outcomeDefinition?: OutcomeDefinition;
};

export type OutcomeDefinition = {
  query: Query;
  statsThresholdDef: StatsThresholdDef;
};

export type Participant = {
  side?: ParticipantSide;
  type: ParticipantType;
  participantId?: string;
};

export type PeriodDefinition = {
  period?: Period;
  periodStatus: PeriodStatus;
};

export type Query = {
  outcome: Outcome;
  participant: Participant;
  periodDefinition: PeriodDefinition;
  sport: string;
};

export type StatsThresholdDef = {
  threshold: number;
  comparison?: Comparison;
};
