import { FixtureCommon } from "../Fixture.types";
import { TeamSide } from "../tennis-fixture/TennisFixture";

export type TableTennisScore = {
  home: number;
  away: number;
};

export type TableTennisSet = {
  number?: number;
  score?: TableTennisScore;
  currentServer?: TeamSide;
};

export type TableTennisFixture = FixtureCommon & {
  typename: "TableTennisFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  currentSet?: TableTennisSet;
  setsWon?: TableTennisScore;
  previousSets?: TableTennisSet[];
};

export type TableTennisFixtures = {
  [urn: string]: TableTennisFixture;
};
