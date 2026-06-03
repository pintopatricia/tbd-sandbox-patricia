import { FixtureCommon, FixtureOpponentNames } from "../Fixture.types";

export type RugbyLeagueScore = {
  home: number;
  away: number;
};

export type RugbyLeagueFixture = FixtureCommon & {
  typename: "RugbyLeagueFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: RugbyLeagueScore;
  halfTimeScore?: RugbyLeagueScore;
  opponentsNames?: FixtureOpponentNames;
};

export type RugbyLeagueFixtures = {
  [urn: string]: RugbyLeagueFixture;
};
