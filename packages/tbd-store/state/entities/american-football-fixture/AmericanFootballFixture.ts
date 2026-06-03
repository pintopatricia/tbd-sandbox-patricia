import { FixtureStatus } from "../../constants";
import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export enum AmericanFootballPeriod {
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

export const AmericanFootballFixtureStatusMap = {
  [AmericanFootballPeriod.PERIOD_1]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.END_PERIOD_1]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.PERIOD_2]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.END_PERIOD_2]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.PERIOD_3]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.END_PERIOD_3]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.PERIOD_4]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.END_PERIOD_4]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.OVERTIME]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.END_OVERTIME]: FixtureStatus.IN_PLAY,
  [AmericanFootballPeriod.END]: FixtureStatus.END,
};

export type AmericanFootballScore = {
  home: number;
  away: number;
};

export type AmericanFootballClock = {
  period?: AmericanFootballPeriod;
  timeElapsed?: number;
  timeRemaining?: number;
};

export type AmericanFootballQuarterScore = {
  period?: AmericanFootballPeriod;
  score?: AmericanFootballScore;
};

export type AmericanFootballFixture = FixtureCommon & {
  typename: "AmericanFootballFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: AmericanFootballScore;
  clock?: AmericanFootballClock;
  quarterScores?: AmericanFootballQuarterScore[];
  opponentsNames?: FixtureOpponentNames;
};

export type AmericanFootballFixtures = {
  [urn: string]: AmericanFootballFixture;
};
