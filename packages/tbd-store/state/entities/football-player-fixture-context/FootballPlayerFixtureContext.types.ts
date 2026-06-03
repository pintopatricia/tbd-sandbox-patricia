import { FootballTeam } from "../../../clients/catalogue/catalogue-response-types";
import {
  FootballFixture,
  FootballParticipantStats,
  FootballPlayerSub,
  FootballPlayerPosition,
  FootballPlayerStartingType,
} from "../football-fixture/FootballFixture.types";

import { FixtureCommon } from "../Fixture.types";

/**
 * Football Fixture data model type
 */
export type FootballPlayerFixture = FixtureCommon & FootballPlayer;

export type FootballPlayer = {
  id: string | null;
  __typename: string;
  positionDescription?: string;
  formationPlace?: string;
  name?: string;
  matchName?: string;
  shirtNumber?: number;
  position?: FootballPlayerPosition;
  startingType?: FootballPlayerStartingType;
  stats?: FootballParticipantStats[];
  seasonStats?: FootballPlayerSeasonStats;
  substitutions?: FootballPlayerSub[];
};

export type FootballPlayerSeasonStatsDetails = {
  goals?: number;
  redCards?: number;
  shotsOnTarget?: number;
  totalShots?: number;
  yellowCards?: number;
  yellowRedCards?: number;
  fouls?: number;
  foulsWon?: number;
  assists?: number;
  passes?: number;
  foulInvolvements?: number;
};

export type FootballPlayerSeasonStats = {
  matchesPlayed?: number;
  averages?: FootballPlayerSeasonStatsDetails;
  totals?: FootballPlayerSeasonStatsDetails;
};

/**
 * Football Fixture data model type
 */
export type FootballPlayerFixtureContext = {
  urn: string;
  typename: "FootballPlayerFixtureContext";
  player?: FootballPlayerFixture;
  team?: FootballTeam;
  fixture?: FootballFixture;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (event URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type FootballPlayerFixtureContexts = {
  [urn: string]: FootballPlayerFixtureContext;
};
