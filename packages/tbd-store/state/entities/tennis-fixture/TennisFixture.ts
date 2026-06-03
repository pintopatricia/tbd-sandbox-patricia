import { FixtureStatus } from "../../constants";
import { FixtureCommon } from "../Fixture.types";

export enum TeamSide {
  AWAY = "AWAY",
  HOME = "HOME",
  BOTH = "BOTH",
}

export enum TennisStatus {
  FINISHED = "FINISHED",
  INTERRUPTED = "INTERRUPTED",
  IN_RUNNING = "IN_RUNNING",
  PRE_MATCH = "PRE_MATCH",
}

export const TennisFixtureStatusMap = {
  [TennisStatus.PRE_MATCH]: FixtureStatus.PRE_MATCH,
  [TennisStatus.INTERRUPTED]: FixtureStatus.IN_PLAY,
  [TennisStatus.IN_RUNNING]: FixtureStatus.IN_PLAY,
  [TennisStatus.FINISHED]: FixtureStatus.END,
};

export enum TennisStatusReason {
  DISQUALIFICATION = "DISQUALIFICATION",
  FINISHED = "FINISHED",
  HEAT_DELAY = "HEAT_DELAY",
  ON_COURT_COACHING = "ON_COURT_COACHING",
  RAIN_DELAY = "RAIN_DELAY",
  RETIREMENT = "RETIREMENT",
  TOILET_BREAK = "TOILET_BREAK",
}

export enum TennisSurface {
  CLAY = "CLAY",
  GRASS = "GRASS",
  HARD = "HARD",
  INDOOR_HARD = "INDOOR HARD",
}

export enum TennisMatchType {
  DOUBLES = "DOUBLES",
  SINGLES = "SINGLES",
}

export enum TennisGameType {
  NORMAL = "NORMAL",
  TIEBREAK = "TIEBREAK",
}

export type TennisGame = {
  teamAScore: string;
  teamBScore: string;
  teamServing?: TeamSide;
  type?: TennisGameType;
};

export type TennisSet = {
  number?: number;
  duration?: number;
  currentGame?: TennisGame;
  previousGames?: TennisGame[];
  teamAScore: number;
  teamBScore: number;
};

export type TennisMatchStatus = {
  status?: TennisStatus;
  reason?: TennisStatusReason;
};

export type TennisRunnerNames = {
  home: string;
  away: string;
};

export type TennisMatch = FixtureCommon & {
  typename: "TennisMatch";
  isAmericanFormat: boolean;
  runnerNames?: TennisRunnerNames;
  actualStartTime?: Date;
  scheduledStartTime?: Date;
  teamAScore?: number;
  teamBScore?: number;
  currentSet?: TennisSet;
  status?: TennisMatchStatus;
  surface?: TennisSurface;
  type?: TennisMatchType;
};

export type TennisGameStats = {
  aces: number;
  breakPointConversionPoints: number;
  doubleFaults: number;
  firstServes: number;
  firstServiceReturnPointsWon: number;
  firstServicesWon: number;
  secondServiceReturnPointsWon: number;
  secondServicesWon: number;
  totalServiceReturnPointsWon: number;
  totalServicesWon: number;
};

export type TennisTeamsStats = {
  aggregatedStats: TennisGameStats;
  teamAStats: TennisGameStats;
  teamBStats: TennisGameStats;
};

export type TennisStats = {
  setsStats: TennisSetStats[];
  teamsStats: TennisTeamsStats;
};

export type TennisSetStats = {
  number: number;
  teamsStats: TennisTeamsStats;
};

export type TennisFixtures = {
  [urn: string]: TennisMatch;
};

export type TennisScore = {
  home: number | string;
  away: number | string;
};

export type TennisMatchScore = {
  currentMatch: TennisScore;
  currentSet: TennisScore;
  currentGame: TennisScore;
};
