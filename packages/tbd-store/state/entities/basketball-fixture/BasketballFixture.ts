import { FixtureStatus } from "../../constants";
import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export enum BasketballPeriod {
  UNKNOWN_PERIOD = "UNKNOWN_PERIOD",
  PERIOD_1 = "PERIOD_1",
  END_PERIOD_1 = "END_PERIOD_1",
  PERIOD_2 = "PERIOD_2",
  END_PERIOD_2 = "END_PERIOD_2",
  PERIOD_3 = "PERIOD_3",
  END_PERIOD_3 = "END_PERIOD_3",
  PERIOD_4 = "PERIOD_4",
  END_PERIOD_4 = "END_PERIOD_4",
  OVERTIME = "OVERTIME",
  END_OVERTIME = "END_OVERTIME",
  END = "END",
}

export const BasketballFixtureStatusMap = {
  [BasketballPeriod.UNKNOWN_PERIOD]: FixtureStatus.UNKNOWN,
  [BasketballPeriod.PERIOD_1]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.END_PERIOD_1]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.PERIOD_2]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.END_PERIOD_2]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.PERIOD_3]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.END_PERIOD_3]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.PERIOD_4]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.END_PERIOD_4]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.OVERTIME]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.END_OVERTIME]: FixtureStatus.IN_PLAY,
  [BasketballPeriod.END]: FixtureStatus.END,
};

export enum BasketballSegment {
  UNKNOWN_SEGMENT = "UNKNOWN_SEGMENT",
  H1 = "H1",
  H2 = "H2",
  Q1 = "Q1",
  Q2 = "Q2",
  Q3 = "Q3",
  Q4 = "Q4",
  OT = "OT",
}

export type BasketballScore = {
  home: number;
  away: number;
};

export type BasketballClock = {
  period?: BasketballPeriod;
  segment?: BasketballSegment;
  timeElapsed?: number;
  timeRemaining?: number;
};

export type BasketballPeriodScore = {
  score?: BasketballScore;
  period?: BasketballPeriod;
  segment?: BasketballSegment;
};

export type BasketballFixture = FixtureCommon & {
  typename: "BasketballFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: BasketballScore;
  clock?: BasketballClock;
  periodScores?: BasketballPeriodScore[];
  opponentsNames?: FixtureOpponentNames;
};

export type BasketballFixtures = {
  [urn: string]: BasketballFixture;
};
