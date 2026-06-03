import { SportsbookImplyBetsSuccess } from "../services/sportsbook-imply-bets-service";
import { SportsbookServiceGetPricesResult } from "../services/sportsbook-market-service";
import { MarketId } from "../state/entities/Common.types";
import URN from "../state/layout/URN";

/**
 * Action Types
 */
export const SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES = "SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES";
export const UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES = "UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES";
export const FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS = "FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS";
export const SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES = "SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES";
export const UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES = "UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES";
export const FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS = "FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS";
export const UI__SUSPENDED_SBK_CLICK = "UI/SUSPENDED_SBK_CLICK";
export const UI__CLOSED_SBK_CLICK = "UI/CLOSED_SBK_CLICK";
export const UI__VIRTUAL_SUSPENDED_SBK_CLICK = "UI/VIRTUAL_SUSPENDED_SBK_CLICK";

/**
 * Action for feeding the store with Sportsbook market updates
 */
export type SubscribeSportsbookMarketUpdatesAction = {
  type: typeof SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES;
  payload: {
    marketId: MarketId;
    persist?: boolean;
    subscriberId: string;
  };
};

export type UnsubscribeSportsbookMarketUpdatesAction = {
  type: typeof UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES;
  payload: {
    marketId: MarketId;
    subscriberId: string;
  };
};

/**
 * Action for feeding the store with Sportsbook market updates
 */
export type FetchSportsbookMarketUpdatesSuccessAction = {
  type: typeof FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS;
  payload: SportsbookServiceGetPricesResult;
};

/**
 * Action for feeding the store with Betting Opportunity price updates
 */
export type SubscribeBettingOpportunityPriceUpdates = {
  type: typeof SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES;
  payload: {
    bettingOppportunityUrn: URN;
  };
};

/**
 * Action unsubscribing Betting Opportunity price updates
 */
export type UnsubscribeBettingOpportunityPriceUpdates = {
  type: typeof UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES;
  payload: {
    bettingOppportunityUrn: URN;
  };
};

/**
 * Action for feeding the store with betting opportunities price updates
 */
export type FetchBettingOpportunityPriceUpdatesSuccessAction = {
  type: typeof FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS;
  payload: {
    result: SportsbookImplyBetsSuccess;
    combinationGroups: Record<string | number, URN>;
  };
};

export type SuspendedSbkBetButtonCLickAction = {
  type: typeof UI__SUSPENDED_SBK_CLICK;
};

export type InPlaySbkBetButtonClickAction = {
  type: typeof UI__VIRTUAL_SUSPENDED_SBK_CLICK;
};

export type ClosedSbkBetButtonCLickAction = {
  type: typeof UI__CLOSED_SBK_CLICK;
};
