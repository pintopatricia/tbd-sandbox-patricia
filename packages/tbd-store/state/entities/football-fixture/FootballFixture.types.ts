import { FootballTeamStatsDetails } from "../../../clients/catalogue/catalogue-response-types";
import { FixtureCommon } from "../Fixture.types";
import { FootballPlayer } from "../football-player-fixture-context/FootballPlayerFixtureContext.types";

export type TeamDetails = {
  id?: number;
  name?: string;
  color?: string;
  crest?: Crest;
  squad?: FootballSquad;
  jerseys?: Jersey[];
  statsAllSeason?: Pick<FootballTeamStatsDetails, "matchesPlayed">;
};

export type Jersey = {
  color?: string;
  url?: string;
  type?: string;
};

export type Crest = {
  vector?: string;
  small?: string;
  medium?: string;
  large?: string;
};

export type AvBScore = {
  home: number;
  away: number;
};

export type Clock = {
  __typename: string;
  minute: number;
  second?: number | null;
};

export enum FootballMatchStatus {
  PRE_MATCH = "PRE_MATCH",
  HALF = "HALF",
  FULL = "FULL",
  INPLAY_FIRST_HALF = "INPLAY_FIRST_HALF",
  INPLAY_SECOND_HALF = "INPLAY_SECOND_HALF",
  PENALTY_SHOOTOUT = "PENALTY_SHOOTOUT",
  END = "END",
}

export enum FootballMatchPeriod {
  REGULAR = "REGULAR",
  EXTRA = "EXTRA",
}

export type FootballMatchDuration = {
  period?: FootballMatchPeriod;
  status?: FootballMatchStatus;
  clock?: Clock;
  stoppageMinutes?: number;
};

export type FixtureForm = {
  home: TeamForm[];
  away: TeamForm[];
};

export type TeamForm = {
  opponent: string;
  score?: AvBScore;
  extraTimeScore?: AvBScore;
  penaltyShootoutScore?: AvBScore;
  outcome: FixtureOutcome;
  startAt: Date;
  side: FixtureTeamSide;
};

export enum FixtureOutcome {
  WIN = "WIN",
  DRAW = "DRAW",
  LOSE = "LOSE",
}

export enum FixtureTeamSide {
  HOME = "HOME",
  AWAY = "AWAY",
}

export type FootballPlayerSub = {
  __typename: "FootballPlayerSub";
  player: FootballPlayer;
};

export enum FootballPlayerPosition {
  GOALKEEPER = "GOALKEEPER",
  DEFENDER = "DEFENDER",
  MIDFIELDER = "MIDFIELDER",
  FORWARD = "FORWARD",
}

export enum FootballPlayerStartingType {
  LINEUP = "LINEUP",
  BENCH = "BENCH",
  NOT_AVAILABLE = "NOT_AVAILABLE",
}

export type FootballSquad = {
  manager?: string;
  players?: FootballPlayer[];
};

/**
 * Football Fixture data model type
 */
export type FootballFixture = FixtureCommon & {
  typename: "FootballFixture";
  home?: TeamDetails;
  away?: TeamDetails;
  isAmericanFormat?: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  scheduledAt?: Date;
  startedAt?: Date;
  score?: AvBScore;
  firstLegScore?: AvBScore;
  duration?: FootballMatchDuration;
  recentForm?: FixtureForm;
  head2head?: FixtureForm;
  penaltyShootout?: PenaltyShootout;
  stats?: FootballMatchStats[];
  incidents?: FootballIncident[];
  players?: FootballPlayer[];
};

export type FootballIncident = {
  __typename: string;
  clock: Clock;
  clockExtraMinutes?: string;
  period: FootballMatchPeriod;
  periodStatus: FootballMatchStatus;
  type: string;
  details: FootballIncidentDetails;
};

export type FootballIncidentDetails =
  | GoalIncident
  | CardIncident
  | SubstitutionIncident
  | PenaltyIncident
  | PenaltyShootoutIncident
  | PeriodIncident
  | ShotIncident
  | SetPieceIncident
  | FoulIncident
  | AttackIncident;

export type GoalIncident = {
  __typename: "GoalIncident";
  goalType: GoalIncidentType;
  side: FixtureTeamSide;
  goalScorer?: FootballPlayer;
  assist?: FootballPlayer;
};

export enum GoalIncidentType {
  NORMAL = "NORMAL",
  OWN = "OWN",
  PENALTY = "PENALTY",
  POSSIBLE = "POSSIBLE",
  CANCELLED = "CANCELLED",
}

export type CardIncident = {
  __typename: "CardIncident";
  cardType: CardIncidentType;
  side: FixtureTeamSide;
  player?: FootballPlayer;
};

export enum CardIncidentType {
  YELLOW = "YELLOW",
  YELLOW_RED = "YELLOW_RED",
  RED = "RED",
}

export type SubstitutionIncident = {
  __typename: "SubstitutionIncident";
  side: FixtureTeamSide;
  playerIn?: FootballPlayer;
  playerOut?: FootballPlayer;
};

export type PenaltyIncident = {
  __typename: "PenaltyIncident";
  penaltyType: PenaltyIncidentType;
  side: FixtureTeamSide;
};

export enum PenaltyIncidentType {
  AWARDED = "AWARDED",
  MISSED = "MISSED",
}

export type PenaltyShootoutIncident = {
  __typename: "PenaltyShootoutIncident";
  penaltyShootoutType: PenaltyShootoutIncidentType;
  side: FixtureTeamSide;
  player?: FootballPlayer;
};

export enum PenaltyShootoutIncidentType {
  SCORED = "SCORED",
  MISSED = "MISSED",
  CANCELLED = "CANCELLED",
  FIRST_TEAM_TO_SHOOT = "FIRST_TEAM_TO_SHOOT",
}

export type PeriodIncident = {
  __typename: "PeriodIncident";
  periodType: PeriodIncidentType;
  period: FootballMatchPeriod;
  status: FootballMatchStatus;
  injuryTime?: number;
};

export enum PeriodIncidentType {
  PERIOD_TRANSITION = "PERIOD_TRANSITION",
  INJURY_TIME_UPDATE = "INJURY_TIME_UPDATED",
}

export type ShotIncident = {
  __typename: "ShotIncident";
  shotType: ShotIncidentType;
  side: FixtureTeamSide;
  player?: FootballPlayer;
};

export enum ShotIncidentType {
  OFF_TARGET = "OFF_TARGET",
  OFF_TARGET_BLOCKED = "OFF_TARGET_BLOCKED",
  SAVED = "SAVED",
  SAVED_BLOCKED = "SAVED_BLOCKED",
}

export type SetPieceIncident = {
  __typename: "SetPieceIncident";
  setPieceType: SetPieceIncidentType;
  side: FixtureTeamSide;
};

export enum SetPieceIncidentType {
  CORNER = "CORNER",
  THROW_IN = "THROW_IN",
  GOAL_KICK = "GOAL_KICK",
  FREE_KICK = "FREE_KICK",
}

export type FoulIncident = {
  __typename: "FoulIncident";
  foulType: FoulIncidentType;
  side: FixtureTeamSide;
  player?: FootballPlayer;
};

export enum FoulIncidentType {
  FOUL = "FOUL",
  OFFSIDE = "OFFSIDE",
}

export type AttackIncident = {
  __typename: "AttackIncident";
  attackType: AttackIncidentType;
  side: FixtureTeamSide;
};

export enum AttackIncidentType {
  DANGEROUS_ATTACK,
}

export type FootballMatchStats = {
  __typename: string;
  periodStatus: FootballMatchStatus;
  period?: FootballMatchPeriod | null;
  home?: FootballParticipantStats;
  away?: FootballParticipantStats;
  both?: FootballParticipantStats;
};

export type FootballParticipantStats = {
  __typename: string;
  periodStatus?: FootballMatchStatus;
  period?: FootballMatchPeriod;
  possession?: number | null;
  corners?: number | null;
  yellowCards?: number | null;
  redCards?: number | null;
  totalCards?: number;
  offsides?: number;
  fouls?: number;
  foulsWon?: number;
  throwIns?: number;
  freeKicks?: number;
  goalKicks?: number;
  blockedShots?: number;
  dangerousAttacks?: number | null;
  attacks?: number | null;
  shotsOnTarget?: number | null;
  shotsOffTarget?: number | null;
  totalShots?: number;
  goals?: number;
  passes?: number;
  assists?: number;
  foulInvolvements?: number;
};

export type PenaltyShootout = {
  firstTeamToShoot?: FixtureTeamSide;
  penaltyFormat?: string;
  nextTeamToShoot?: FixtureTeamSide;
  penaltyScores?: PenaltyScore[];
};

export type PenaltyScore = {
  penaltyNumber?: number;
  side: FixtureTeamSide;
  shotResult: PenaltyStatus;
};

export enum PenaltyStatus {
  SCORE = "SCORE",
  MISS = "MISS",
}

/**
 * Data model holding a key-value structure where the key is a unique identifier (event URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type FootballFixtures = {
  [urn: string]: FootballFixture;
};
