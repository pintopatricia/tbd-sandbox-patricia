import URN from "../layout/URN";
import { MarketId } from "./Common.types";

/**
 * Selection data model type
 * holding data related to market selections
 */
export type MarketRunner = {
  /** Runner URN */
  urn: URN;
  /** Selection ID */
  selectionId: number;
  /** Selection name */
  name: string;
  /** handicap value. 0 if there's none */
  handicap: number;
  /** formatted handicap value. add parenthesis between value and plus or minus before (-123), (+123) */
  handicapLabel?: string;
  /** resultType only exists for SBK runners */
  resultType?: string | null;
};

/**
 * Market data model type
 * holding data that is common between both Exchange and Sportsbook markets
 */
export type Market = {
  /** Market ID */
  marketId: MarketId;
  /** Market URN */
  urn: URN;
  /** The sport to which the market belongs */
  sport: URN;
  /** Market name */
  name: string;
  /** An array of market sorted runners */
  runners: MarketRunner[];
  /** The market betting type */
  bettingType: string;
  /** The market hierarchy */
  hierarchy: Hierarchy;
};

export type EventCompetitionHierarchy = {
  competition: URN;
  sportevent: URN;
};

export type EventHierarchy = {
  sportevent: URN;
};

export type RaceHierarchy = {
  meeting: URN;
  race: URN;
};

export type Hierarchy = EventCompetitionHierarchy | RaceHierarchy | EventHierarchy;
