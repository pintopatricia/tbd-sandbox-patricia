import URN from "../../layout/URN";
import { SportsbookMarketStatus } from "../sportsbook-markets/SportsbookMarket.types";

export type VirtualMarket = {
  typename: "VirtualMarket";
  urn: URN;
  marketId: string;
  name: string;
  hasEachWay: boolean;
  eachWayPlaces?: number;
  eachWayFraction?: number;
  sport: URN;
  event: URN;
  runners: URN[];
  marketType: string;
  status: SportsbookMarketStatus;
};

export type VirtualMarkets = {
  [urn: string]: VirtualMarket;
};
