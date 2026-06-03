import URN from "../URN";
import { PartialItem } from "../views/PartialItem.types";

/**
 * Search Zone
 */
export type SearchZone = {
  urn: URN;
  typename: "SearchZone";
  items: PartialItem[];
};

export type SearchZones = {
  [urn: string]: SearchZone;
};
