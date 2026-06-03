import URN from "../layout/URN";

/**
 * Generic data model type
 * holding data about a Generic
 */
export type Generic = {
  /** Generic URN */
  urn: URN;
  /** Generic url */
  url: string;
  /** title */
  title: string | null;
};

/**
 * Data model holding a key-value structure where the key is a unique identifier (Generic URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type Generics = {
  [urn: string]: Generic;
};
