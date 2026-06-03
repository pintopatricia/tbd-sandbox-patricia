import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";
import { TeamSide } from "../tennis-fixture/TennisFixture";

export type VolleyballScore = {
  home: number;
  away: number;
};

export type VolleyballSet = {
  number?: number;
  score?: VolleyballScore;
  currentServer?: TeamSide;
};

export type VolleyballFixture = FixtureCommon & {
  typename: "VolleyballFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  currentSet?: VolleyballSet;
  homeScore?: number;
  awayScore?: number;
  previousSets?: VolleyballSet[];
  opponentsNames?: FixtureOpponentNames;
};

export type VolleyballFixtures = {
  [urn: string]: VolleyballFixture;
};
