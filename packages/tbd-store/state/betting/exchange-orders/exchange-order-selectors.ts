import { ExchangeOrder } from "./ExchangeOrder.types";
import { ApplicationState } from "../../ApplicationState.types";
import URN from "../../layout/URN";

export const getExchangeOrder = (state: ApplicationState, market: URN, betId: string): ExchangeOrder | null => {
  const marketPositionView = state.betting.exchangeorders[market];

  if (!marketPositionView) {
    return null;
  }

  return marketPositionView.orders.find((order) => order.betId === betId) || null;
};
