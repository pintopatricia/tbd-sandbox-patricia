import { FixtureStatus } from "../../constants";
import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export enum IceHockeyPeriod {
  PERIOD_1 = "PERIOD_1",
  END_PERIOD_1 = "END_PERIOD_1",
  PERIOD_2 = "PERIOD_2",
  END_PERIOD_2 = "END_PERIOD_2",
  PERIOD_3 = "PERIOD_3",
  END_PERIOD_3 = "END_PERIOD_3",
  OVERTIME = "OVERTIME",
  END_OVERTIME = "END_OVERTIME",
  PENALTIES = "PENALTIES",
  END = "END",
}

export const IceHockeyFixtureStatusMap = {
  [IceHockeyPeriod.PERIOD_1]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.END_PERIOD_1]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.PERIOD_2]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.END_PERIOD_2]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.PERIOD_3]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.END_PERIOD_3]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.OVERTIME]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.END_OVERTIME]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.PENALTIES]: FixtureStatus.IN_PLAY,
  [IceHockeyPeriod.END]: FixtureStatus.END,
};

export type IceHockeyScore = {
  home: number;
  away: number;
};

export type IceHockeyClock = {
  period?: IceHockeyPeriod;
};

export type IceHockeyPeriodScore = {
  score?: IceHockeyScore;
  period?: IceHockeyPeriod;
};

export type IceHockeyFixture = FixtureCommon & {
  typename: "IceHockeyFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: IceHockeyScore;
  clock?: IceHockeyClock;
  periodScores?: IceHockeyPeriodScore[];
  opponentsNames?: FixtureOpponentNames;
};

export type IceHockeyFixtures = {
  [urn: string]: IceHockeyFixture;
};
