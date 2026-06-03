import URN from "../../layout/URN";

export type PersistenceType = "LAPSE" | "PERSIST" | "MARKET_ON_CLOSE";

export type OrderType = "LIMIT" | "LIMIT_ON_CLOSE" | "MARKET_ON_CLOSE";

export type BetEngineSide = "BACK" | "LAY";

export type ExchangeOrder = {
  marketId: string;
  marketUrn: URN;
  betId: string;
  selectionId: number;
  handicap: number;
  price: number;
  size: number;
  isFreeBet: boolean;
  bspLiability: number;
  averagePriceMatched?: number;
  persistenceType: PersistenceType;
  orderType: OrderType;
  sizeMatched?: number;
  sizeRemaining?: number;
  side: BetEngineSide;
};

export type ExchangeMarketPositionViewResult = {
  market: URN;
  marketId: string;
  orders: ExchangeOrder[];
  settledProfit: number;
};

export type ExchangeMarketsPosition = {
  [market: string]: ExchangeMarketPositionViewResult;
};
