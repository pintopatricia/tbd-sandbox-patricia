import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export enum DartsFixtureType {
  LEGS = "LEGS",
  SETS = "SETS",
}

export type DartsScore = {
  home?: number;
  away?: number;
};

export type DartsSet = {
  number?: number;
  score?: DartsScore;
};

export type DartsFixture = FixtureCommon & {
  typename: "DartsFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  type?: DartsFixtureType;
  score?: DartsScore;
  currentSet?: DartsSet;
  previousSets?: DartsSet[];
  opponentsNames?: FixtureOpponentNames;
};

export type DartsFixtures = {
  [urn: string]: DartsFixture;
};
