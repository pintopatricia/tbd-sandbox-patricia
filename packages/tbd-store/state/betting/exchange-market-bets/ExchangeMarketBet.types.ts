import URN from "../../layout/URN";
import { MarketId } from "../../entities/Common.types";
import { ViewLink } from "../../layout/views/ViewLink.types";

/**
 * Data model that represents a exchange market bets.
 */
export type ExchangeMarketBet = {
  urn: URN;
  typename: "MarketBet";
  marketId: MarketId;
  description?: string;
  numOfOrders: number;
  numOfUnmatched: number;
  betURNs?: URN[];
  cashoutQuotesURNs?: URN[];
  liability?: number;
  betDelay?: number;
  isBSP?: boolean;
  bspLiability?: number;
  marketViewLink?: ViewLink;
  exchangeLightMarketViewLink?: ViewLink;
};

/**
 * A key-value structure where the key is a unique identifier (exchange market bets URN in this case)
 */
export type ExchangeMarketBets = {
  [market: string]: ExchangeMarketBet;
};
