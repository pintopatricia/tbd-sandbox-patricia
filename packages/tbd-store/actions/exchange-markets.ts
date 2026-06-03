import { ExchangeServiceGetPricesResult, RunnerExchangePrices } from "../services/exchange-market-service";
import { MarketId } from "../state/entities/Common.types";

export const SUBSCRIBE_EXCHANGE_MARKET_UPDATES = "SUBSCRIBE_EXCHANGE_MARKET_UPDATES";
export const UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES = "UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES";
export const FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS = `FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS`;

export const FETCH_MARKET_GRAPH_SUCCESS = "FETCH_MARKET_GRAPH_SUCCESS";
export const FETCH_MARKET_GRAPH_FAILURE = "FETCH_MARKET_GRAPH_FAILURE";
export const SUBSCRIBE_MARKET_GRAPH = "SUBSCRIBE_MARKET_GRAPH";
export const UNSUBSCRIBE_MARKET_GRAPH = "UNSUBSCRIBE_MARKET_GRAPH";

/**
 * Action for feeding the store with Exchange market updates
 */
export type FetchExchangeMarketUpdatesSuccessAction = {
  type: typeof FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS;
  payload: ExchangeServiceGetPricesResult;
};

/**
 * Action for feeding the store with Exchange market updates
 */
export type SubscribeExchangeMarketUpdatesAction = {
  type: typeof SUBSCRIBE_EXCHANGE_MARKET_UPDATES;
  payload: {
    marketId: MarketId;
    isInline?: boolean;
  };
};

export type UnsubscribeExchangeMarketUpdatesAction = {
  type: typeof UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES;
  payload: {
    marketId: MarketId;
    isInline?: boolean;
  };
};

/**
 * Actions for feeding the store with Exchange Runner Prices for Market Graph
 */
export type SubscribeMarketGraph = {
  type: typeof SUBSCRIBE_MARKET_GRAPH;
  payload: {
    marketId: MarketId;
    localeCode: string;
    currencyCode: string;
    selectionId: number;
  };
};

export type UnsubscribeMarketGraph = {
  type: typeof UNSUBSCRIBE_MARKET_GRAPH;
};

export type FetchMarketGraphSuccessAction = {
  type: typeof FETCH_MARKET_GRAPH_SUCCESS;
  payload: RunnerExchangePrices;
};

export type FetchMarketGraphFailureAction = {
  type: typeof FETCH_MARKET_GRAPH_FAILURE;
  error: string;
};
