/**
 * Exchange persistence enum
 * Persistence types allowed on exchange bets: LAPSE, PERSIST and MARKET_ON_CLOSE
 */
export type ExchangePersistenceType =
  /** LAPSE - Cancels the bet if not matched until market start */
  | "LAPSE"
  /** PERSIST - Keeps the bet if not matched even after market start */
  | "PERSIST"
  /** MARKET_ON_CLOSE - Takes the BSP on market start */
  | "MARKET_ON_CLOSE";
