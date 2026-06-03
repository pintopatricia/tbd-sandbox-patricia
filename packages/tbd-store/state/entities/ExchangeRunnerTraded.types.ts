import { ExchangeBetAvailability } from "./ExchangeBetAvailability.types";
import URN from "../layout/URN";

export type RunnerStartingPrice = {
  nearPrice?: number;
  farPrice?: number;
};

/**
 * Data model that represent a merge between common market runner attributes and specific exchange runner attributes.
 */
export type ExchangeRunnerTraded = {
  typename: "RunnerMarketGraph";
  /** Runner URN */
  urn: URN;
  /** associated selection id */
  selectionId: number;
  /** associated selection handicap value */
  handicap?: number;
  /** A set of all odds available for back bets - bets in favour of the runner we are betting */
  back: ExchangeBetAvailability[];
  /** A set of odds all available for lay bets - bets against the runner we are betting */
  lay: ExchangeBetAvailability[];
  /** A set of all odds and respective amount traded for each odd */
  traded: ExchangeBetAvailability[];
  /** The last exchange runner price matched */
  lastPriceTraded?: number;
  /** The runner total matched */
  totalMatched?: number;
  /** The runner near and far prices. Only available if runner is in an open bsp market */
  sp?: RunnerStartingPrice;
};

/**
 * A key-value structure where the key is a unique identifier (runner URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": {
 *      id: "myUniqueId",
 *      name: "",
 *      ...
 *    }
 *  }
 */
export type ExchangeRunnersTraded = {
  [urn: string]: ExchangeRunnerTraded;
};
