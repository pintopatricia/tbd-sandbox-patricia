import { Market } from "../Market.types";

import { ExchangeMarketStatus } from "../../constants";
import URN from "../../layout/URN";
import { ViewLink } from "../../layout/cards/ViewLink.types";

/**
 * Data model that represent a merge between common market attributes and specific exchange attributes.
 */
export type ExchangeMarket = {
  typename: "ExchangeMarket";
  type: string;
  priceLadderType?: string;
  numberOfWinners?: number;
  bspReconciled?: boolean;
  complete?: boolean;
  baseRate?: number;
  discountAllowed?: boolean;
  eachWayDivisor?: number;
  totalMatched: number;
  status: ExchangeMarketStatus;
  betDelay?: number;
  inplay?: boolean;
  turnInPlayEnabled?: boolean;
  marketType: string;
  marketTypeName: string | null;
  marketRulesViewLink?: ViewLink;
  cashoutQuotesURNs?: URN[];
} & Market;

/**
 * A key-value structure where the key is a unique identifier (market URN in this case) stored on the value too
 *
 * @example
 * {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 * }
 */
export type ExchangeMarkets = {
  [market: string]: ExchangeMarket;
};

export { ExchangeMarketStatus } from "../../constants";
