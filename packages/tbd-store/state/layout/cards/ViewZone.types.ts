import URN from "../URN";
import { PartialItem } from "../views/PartialItem.types";

/**
 * View Zone
 */
export type ViewZone = {
  urn: URN;
  typename: "ViewZone";
  title: string;
  items: PartialItem[];
};

export type ViewZones = {
  [urn: string]: ViewZone;
};
