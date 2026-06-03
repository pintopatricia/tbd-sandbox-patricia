import { FixtureStatus } from "../../constants";
import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export enum BaseballPeriod {
  PRE_MATCH = "PRE_MATCH",
  INNING_1 = "INNING_1",
  INNING_2 = "INNING_2",
  INNING_3 = "INNING_3",
  INNING_4 = "INNING_4",
  INNING_5 = "INNING_5",
  INNING_6 = "INNING_6",
  INNING_7 = "INNING_7",
  INNING_8 = "INNING_8",
  INNING_9 = "INNING_9",
  EXTRA_INNINGS = "EXTRA_INNINGS",
  END = "END",
  UNKNOWN = "UNKNOWN",
}

export const BaseballFixtureStatusMap = {
  [BaseballPeriod.PRE_MATCH]: FixtureStatus.PRE_MATCH,
  [BaseballPeriod.INNING_1]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_2]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_3]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_4]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_5]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_6]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_7]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_8]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.INNING_9]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.EXTRA_INNINGS]: FixtureStatus.IN_PLAY,
  [BaseballPeriod.END]: FixtureStatus.END,
  [BaseballPeriod.UNKNOWN]: FixtureStatus.IN_PLAY,
};

export type BaseballScore = {
  home: number;
  away: number;
};

export type BaseballClock = {
  period?: BaseballPeriod;
};

export type BaseballInningScore = {
  score?: BaseballScore;
  period?: BaseballPeriod;
};

export type BaseballFixture = FixtureCommon & {
  typename: "BaseballFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: BaseballScore;
  clock?: BaseballClock;
  scorePerInning?: BaseballInningScore[];
  opponentsNames?: FixtureOpponentNames;
};

export type BaseballFixtures = {
  [urn: string]: BaseballFixture;
};
