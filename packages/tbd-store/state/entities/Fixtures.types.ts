import { BaseballFixture } from "./baseball-fixture/BaseballFixture";
import { BasketballFixture } from "./basketball-fixture/BasketballFixture";
import { CricketFixture } from "./cricket-fixture/CricketFixture.types";
import { FootballFixture } from "./football-fixture/FootballFixture.types";
import { RugbyUnionFixture } from "./rugby-union-fixture/RugbyUnionFixture";
import { RugbyLeagueFixture } from "./rugby-league-fixture/RugbyLeagueFixture";
import { TableTennisFixture } from "./table-tennis-fixture/TableTennisFixture.types";
import { TennisMatch } from "./tennis-fixture/TennisFixture";
import { IceHockeyFixture } from "./ice-hockey-fixture/IceHockeyFixture";
import { AmericanFootballFixture } from "./american-football-fixture/AmericanFootballFixture";
import { SnookerFixture } from "./snooker-fixture/SnookerFixture.types";
import { VolleyballFixture } from "./volleyball-fixture/VolleyballFixture";
import { AustralianRulesFixture } from "./australian-rules-fixture/AustralianRulesFixture.types";
import { DartsFixture } from "./darts-fixture/DartsFixture";

export type Fixture =
  | BaseballFixture
  | BasketballFixture
  | CricketFixture
  | FootballFixture
  | TableTennisFixture
  | TennisMatch
  | IceHockeyFixture
  | AmericanFootballFixture
  | RugbyUnionFixture
  | RugbyLeagueFixture
  | SnookerFixture
  | VolleyballFixture
  | AustralianRulesFixture
  | DartsFixture
  | undefined;
