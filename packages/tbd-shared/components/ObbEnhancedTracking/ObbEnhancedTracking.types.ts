import { FootballMatchStatus } from "@ppb/tbd-store";
import type { TrackingBarStatus } from "@ppb/the-wall-common/types/TrackingBar/TrackingBar.types";

export type EnhancedTrackingData = ProgressBarTrackingData | StatsListTrackingData;

export enum EnhancedTrackingDataType {
  PROGRESS = "PROGRESS",
  INDIVIDUAL_TRACKING = "INDIVIDUAL_TRACKING",
  SQUAD_TRACKING = "SQUAD_TRACKING",
}

export type Operand = { decimal: number } | { string: string };

export type ProgressBarTrackingData = {
  enhancedTrackingType: EnhancedTrackingDataType.PROGRESS;
  status: TrackingBarStatus;
  currentValue?: number;
  goal?: number;
  outcomeDefinitions: OutcomeDefinition[];
};

export type StatsListTrackingData = {
  enhancedTrackingType: EnhancedTrackingDataType.SQUAD_TRACKING | EnhancedTrackingDataType.INDIVIDUAL_TRACKING;
  statsListTrackingData: StatsListTrackingDataMap[];
};

export type StatsListTrackingDataMap = {
  outcome: string;
  label: string;
  stat?: number;
};
export type OutcomeDefinition = {
  outcome: string;
  participantId: string;
  periodStatus: string;
  period: string;
};

export const FootballPeriodScaMap: Record<string, string> = {
  MATCH: FootballMatchStatus.FULL,
  HALF1: FootballMatchStatus.INPLAY_FIRST_HALF,
  HALF2: FootballMatchStatus.INPLAY_SECOND_HALF,
};
