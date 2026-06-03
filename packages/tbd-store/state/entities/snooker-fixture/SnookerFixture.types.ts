import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export type SnookerScore = {
  home: number;
  away: number;
};

export type SnookerFixture = FixtureCommon & {
  typename: "SnookerFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: SnookerScore;
  opponentsNames?: FixtureOpponentNames;
};

export type SnookerFixtures = {
  [urn: string]: SnookerFixture;
};
