import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export type RugbyUnionScore = {
  home: number;
  away: number;
};

export type RugbyUnionFixture = FixtureCommon & {
  typename: "RugbyUnionFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: RugbyUnionScore;
  halfTimeScore?: RugbyUnionScore;
  opponentsNames?: FixtureOpponentNames;
};

export type RugbyUnionFixtures = {
  [urn: string]: RugbyUnionFixture;
};
