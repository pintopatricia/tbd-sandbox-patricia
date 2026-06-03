import { Market } from "../Market.types";
import { FractionalOdds } from "../SportsbookOdds.types";

/**
 * SportsbookMarket data model holding data that is specific to Sportsbook markets.
 *
 * New properties will be added in the future
 */
export type SportsbookMarket = {
  typename: "SportsbookMarket";
  status?: SportsbookMarketStatus;
  inplay?: boolean;
  isOddsboostMarketType?: boolean;
  isAutomaticEachWayMarketType?: boolean;
  marketType: string;
  marketTypeName: string | null;
  isSuperSub: boolean;
  eachWayAvailable?: boolean;
  eachWayPlaces?: number;
  eachWayPlaceFraction?: FractionalOdds;
  guaranteedPriceAvailable?: boolean;
  turnInPlayEnabled: boolean | null;
  bspMarket: boolean | null;
  isAccaFreezeEligible?: boolean;
} & Market;

/**
 * Data model holding a key-value structure where the key is a unique identifier (market URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type SportsbookMarkets = {
  [market: string]: SportsbookMarket;
};

export type SportsbookMarketStatus = "OPEN" | "SUSPENDED" | "CLOSED";
