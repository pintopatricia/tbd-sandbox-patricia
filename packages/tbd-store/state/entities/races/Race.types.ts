import URN from "../../layout/URN";
import { RaceRunnerStatus, RaceStatus, Going, HorseColor, HorseSex, RaceType } from "../../constants";
import { FractionalOdds } from "../SportsbookOdds.types";

export type Weight = {
  stones: string;
};

export type Distance = {
  miles: number;
  furlongs: number;
  yards: number;
};

/**
 * Event data model type
 * holding data about a Race
 */

export type RunnerDetails = {
  jockeyName?: string;
  trainerName?: string;
  saddleCloth: string;
  silk?: string;
  draw?: number;
  weight?: Weight;
  equipmentDescription?: string;
};

export type RaceDetails = {
  scheduledTime: string;
  numberOfRunners?: number;
  // Might be mandatory, review this once SCA support it
  numberOfNonRunners?: number;
  numberOfParticipants?: number;
  raceClass?: number | null;
  raceDetailsTitle?: string | undefined;
  distance: Distance;
  going?: Going;
  status?: RaceStatus;
  raceType?: RaceType;
  resultType?: "QUICK_RESULT" | "FULL_RESULT";
};

type PastRace = {
  details: RaceDetails;
  venue?: string;
  raceUrl?: string;
};

export type Isp = {
  decimal?: number;
  fractional?: FractionalOdds;
  americanOdd?: number;
  favourite?: boolean;
};

export type HorsePerformance = {
  race?: PastRace;
  positionOfficial?: number;
  positionStatusCode?: string;
  distanceBeatenStatus?: string;
  performanceComment?: string;
  isp?: Isp;
  bspAdvantage?: number;
};

type Horse = {
  name: string;
  sireName?: string;
  damName?: string;
  damSireName?: string;
  age: number;
  color: HorseColor;
  sex: HorseSex;
  bred?: string;
  performance?: HorsePerformance;
  pastPerformances?: HorsePerformance[];
};

export type RaceRunner = {
  urn: URN;
  typename: "RaceRunner";
  selectionId: number;
  horse: Horse;
  details: RunnerDetails;
  raceURN: URN;
  rating?: number;
  rating123?: number;
  ratingStars?: number;
  form?: string;
  comments?: string;
  status?: RaceRunnerStatus;
  apprenticeClaim?: number;
  crsDisWinFavText?: string;
};
export type GreyhoundRaceRunner = {
  urn: URN;
  typename: "GreyhoundRaceRunner";
  trap?: number;
  raceURN: URN;
  selectionId: number;
};

export type RacingRunner = RaceRunner | GreyhoundRaceRunner;

export type Race = {
  urn: URN;
  typename: "Race";
  meeting: URN;
  raceId: string;
  startTime: string;
  name: string;
  verdict?: string;
  winningTime?: number;
  runners?: URN[];
  racingRunners?: URN[];
  details?: RaceDetails;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (Race URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type Races = {
  [urn: string]: Race;
};

export type RaceRunners = {
  [urn: string]: RaceRunner;
};

export type GreyhoundRaceRunners = {
  [urn: string]: GreyhoundRaceRunner;
};
