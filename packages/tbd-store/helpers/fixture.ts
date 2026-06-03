import {
  FixtureOpponentNames,
  BasketballFixture,
  CricketFixture,
  TableTennisFixture,
  TennisMatch,
  FootballFixture,
  IceHockeyFixture,
  AmericanFootballFixture,
  RugbyUnionFixture,
  RugbyLeagueFixture,
  SnookerFixture,
  BaseballFixture,
  VolleyballFixture,
  AustralianRulesFixture,
  DartsFixture,
} from "../state/entities";

type Fixture =
  | BaseballFixture
  | BasketballFixture
  | CricketFixture
  | TableTennisFixture
  | TennisMatch
  | FootballFixture
  | IceHockeyFixture
  | AmericanFootballFixture
  | RugbyUnionFixture
  | RugbyLeagueFixture
  | SnookerFixture
  | VolleyballFixture
  | AustralianRulesFixture
  | DartsFixture;

type AmericanFormatScorePayload = { isAmericanFormat: boolean; teamA?: number | string; teamB?: number | string };

type ScoreData = { teamA?: number | string; teamB?: number | string };

export function getOpponentsNames(fixture: Fixture): FixtureOpponentNames {
  if (!fixture.runnerNames) {
    return null;
  }

  const { isAmericanFormat, runnerNames } = fixture;

  if (isAmericanFormat) {
    return {
      teamA: runnerNames.away,
      teamB: `@ ${runnerNames.home}`,
    };
  }

  return {
    teamA: runnerNames.home,
    teamB: runnerNames.away,
  };
}

export const getAmericanFormatScoreData = ({
  isAmericanFormat,
  teamA,
  teamB,
}: AmericanFormatScorePayload): ScoreData => ({
  teamA: isAmericanFormat ? teamB : teamA,
  teamB: isAmericanFormat ? teamA : teamB,
});
