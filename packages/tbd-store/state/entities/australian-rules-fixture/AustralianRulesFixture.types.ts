import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export enum AustralianRulesPeriod {
  UNKNOWN_PERIOD = "UNKNOWN_PERIOD",
  PERIOD_1 = "PERIOD_1",
  PERIOD_2 = "PERIOD_2",
  PERIOD_3 = "PERIOD_3",
  PERIOD_4 = "PERIOD_4",
}

export type AustralianRulesScoreBoard = {
  goals?: AustralianRulesScore;
  behinds?: AustralianRulesScore;
  points?: AustralianRulesScore;
};

export type AustralianRulesScore = {
  home?: number;
  away?: number;
};

export type AustralianRulesPeriodScore = {
  score?: AustralianRulesScoreBoard;
  period?: AustralianRulesPeriod;
};

export type AustralianRulesFixture = FixtureCommon & {
  typename: "AustralianRulesFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: AustralianRulesScoreBoard;
  periodScores?: AustralianRulesPeriodScore[];
  opponentsNames?: FixtureOpponentNames;
};

export type AustralianRulesFixtures = {
  [urn: string]: AustralianRulesFixture;
};
