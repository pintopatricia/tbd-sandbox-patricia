import { ExchangeMarketsPosition } from "../state/betting/exchange-orders/ExchangeOrder.types";

export const FETCH_EXC_OPEN_BETS_IN_PROGRESS = "FETCH_EXC_OPEN_BETS_IN_PROGRESS";
export type FetchExchangeOpenBetsInProgressAction = {
  type: typeof FETCH_EXC_OPEN_BETS_IN_PROGRESS;
  payload: Record<string, never>;
};

export const FETCH_EXC_OPEN_BETS_SUCCESS = "FETCH_EXC_OPEN_BETS_SUCCESS";
export type FetchExchangeOpenBetsSuccessPayload = {
  markets: ExchangeMarketsPosition;
};
export type FetchExchangeOpenBetsSuccessAction = {
  type: typeof FETCH_EXC_OPEN_BETS_SUCCESS;
  payload: FetchExchangeOpenBetsSuccessPayload;
};
