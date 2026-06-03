import URN from "../../layout/URN";

type Country = {
  urn: string;
  code: string;
  flag?: string;
};

/**
 * Event data model type
 * holding data about a Competition
 */
export type Competition = {
  /** Competition URN */
  urn: URN;
  /** Competition typename */
  typename: "Competition";
  /** Competition name */
  name: string;
  /** Competition id */
  competitionId?: number;
  /** Sport URN */
  sport: string; // TEMP: SHOULD BE URN
  logo?: Logo;
  country?: Country;
  isHighlighted?: boolean;
};

export type Logo = {
  vector: string | null;
  small: string | null;
  medium: string | null;
  large: string | null;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (competition URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type Competitions = {
  [urn: string]: Competition;
};
