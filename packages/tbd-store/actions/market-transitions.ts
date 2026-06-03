import URN from "../state/layout/URN";

export enum MarketTransitions {
  PREPLAY = "PREPLAY",
  INPLAY = "INPLAY",
  CLOSED = "CLOSED",
}

export const MARKET_TRANSITIONED_STATUS = "MARKET_TRANSITIONED_STATUS";
export const SUBSCRIBE_MAIN_MARKET_TRANSITIONS = "SUBSCRIBE_MAIN_MARKET_TRANSITIONS";

export type SubscribeMainMarketTransitions = {
  type: typeof SUBSCRIBE_MAIN_MARKET_TRANSITIONS;
  payload: {
    cardURN: URN;
    marketURNs: URN[];
    withFixtureUpdates?: boolean;
  };
};

export type MarketTransitionedStatusAction = {
  type: typeof MARKET_TRANSITIONED_STATUS;
  payload: URN;
  transition: {
    before: MarketTransitions;
    after: MarketTransitions;
  };
};
