import URN from "../../layout/URN";

/**
 * Event data model type
 * holding data about a Sport
 */
export type Sport = {
  /** Sport URN */
  urn: URN;
  /** Sport typename */
  typename: "Sport";
  /** Sport name */
  name: string;
  /** Sport short name */
  shortName?: string;
  /** Sport id */
  sportId: number;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (sport URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type Sports = {
  [urn: string]: Sport;
};

export { RacingSport } from "../../constants";
