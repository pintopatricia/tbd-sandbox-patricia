/**
 * Data model holding odds for exchange market runners
 */
export type ExchangeBetAvailability = {
  /** Odds available to bet */
  price?: number;
  /** Available amount to match the price */
  liquidity?: number;
  /** Market depth indicator */
  marketDepth?: number;
};
