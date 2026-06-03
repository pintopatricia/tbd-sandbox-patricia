import URN from "../../layout/URN";

/**
 * Event data model type
 * holding data about a Meeting
 */

type Image = {
  small?: string;
  medium?: string;
  large?: string;
};

export type Meeting = {
  urn: URN;
  typename: "Meeting";
  meetingId: string;
  venue: string;
  sportUrn: URN;
  country: string;
  entityName: string;
  countryFlag?: Image;
  date?: string;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (Meeting URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type Meetings = {
  [urn: string]: Meeting;
};
