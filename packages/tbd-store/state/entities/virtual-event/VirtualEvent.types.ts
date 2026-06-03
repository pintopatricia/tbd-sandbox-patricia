import URN from "../../layout/URN";

export type VirtualEvent = {
  typename: "VirtualEvent";
  eventId: number;
  name: string;
  openDate: string;
  sport: URN;
  urn: URN;
  isExpired: boolean;
  venue: string | null;
  duration: number | null;
  distance: string | null;
};

export type VirtualEvents = {
  [urn: string]: VirtualEvent;
};
