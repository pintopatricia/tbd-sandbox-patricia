import { FixtureCommon } from "../Fixture.types";
import { TeamSide } from "../tennis-fixture/TennisFixture";

export type CricketInning = {
  runs?: number;
  wickets?: number;
  inningNumber?: number;
};

export type CricketTime = {
  inning?: number;
  over?: number;
};

export type CricketScore = {
  home?: CricketInning[];
  away?: CricketInning[];
};

export type CricketFixture = FixtureCommon & {
  typename: "CricketFixture";
  isAmericanFormat: boolean;
  runnerNames?: {
    home: string;
    away: string;
  };
  score?: CricketScore;
  currentTeamBatting?: TeamSide;
  currentTime?: CricketTime;
};

export type CricketFixtures = {
  [urn: string]: CricketFixture;
};
