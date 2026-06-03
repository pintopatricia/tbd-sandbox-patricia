import URN from "../layout/URN";
import { FixtureStatus, ScoreStyle } from "../constants";

export type FixtureCommon = {
  urn: URN;
  fixtureStatus?: FixtureStatus;
};

export type FixtureOpponentNames = {
  teamA: string;
  teamB: string;
} | null;

export type ScoreData = {
  teamA?: number | string;
  teamB?: number | string;
  style: ScoreStyle;
};

export type TeamType = {
  name: string;
  crestUrl?: string;
  color?: string;
  rank?: number;
};

export enum FixtureTypename {
  BaseballFixture = "BaseballFixture",
  BasketballFixture = "BasketballFixture",
  CricketFixture = "CricketFixture",
  FootballFixture = "FootballFixture",
  TableTennisFixture = "TableTennisFixture",
  TennisMatch = "TennisMatch",
  IceHockeyFixture = "IceHockeyFixture",
  AmericanFootballFixture = "AmericanFootballFixture",
  RugbyUnionFixture = "RugbyUnionFixture",
  RugbyLeagueFixture = "RugbyLeagueFixture",
  SnookerFixture = "SnookerFixture",
  VolleyballFixture = "VolleyballFixture",
  AustralianRulesFixture = "AustralianRulesFixture",
  DartsFixture = "DartsFixture",
}
