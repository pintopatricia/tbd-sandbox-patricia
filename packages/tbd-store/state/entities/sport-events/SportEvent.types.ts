import URN from "../../layout/URN";

/**
 * Event data model type
 * holding data about a Sport Event
 */
export type SportEvent = {
  /** Event URN */
  urn: URN;
  /** Event typename */
  typename: "SportsEvent";
  /** Event name */
  name: string;
  /** Event id */
  eventId?: number;
  /** Competition URN */
  competition?: string; // TEMP: SHOULD BE URN
  openDate?: string;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (event URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type SportEvents = {
  [urn: string]: SportEvent;
};
