/**
 * @file Manages exchange live bet reports.
 */
import { LiveBetReporting } from "@flutter-global/uki-channels-http-clients";
import {
  LiveOrderSummaryReport,
  LiveOrderSummary,
} from "@flutter-global/uki-channels-http-clients/src/clients/LiveBetReporting/LiveBetReporting";
import URN from "../state/layout/URN";
import {
  BetEngineSide,
  ExchangeOrder,
  ExchangeMarketsPosition,
  ExchangeMarketPositionViewResult,
  PersistenceType,
} from "../state/betting/exchange-orders/ExchangeOrder.types";
import { createClientFactory } from "./client-factory";
import { prefixLBRBetId, sanitizeBetId } from "./betting";

const liveBetReportingClientFactory = createClientFactory(LiveBetReporting);

/**
 * Search for live orders for a list of given bet ids
 * Bet id as the format `1:betId`
 *
 * @returns Returns the live orders to the specified bet IDs
 */
export async function searchOrders(betIds: string[]): Promise<LiveOrderSummaryReport> {
  if (!betIds.length) {
    throw new Error("no bet IDs were given");
  }

  const prefixedBetIds = betIds.map((betId) => prefixLBRBetId(betId));
  const liveBetReporting = liveBetReportingClientFactory("LBR");
  const orders = await liveBetReporting.searchOrders({ betIds: prefixedBetIds });
  return {
    ...orders,
    liveOrders: orders.liveOrders.map((order) => ({
      ...order,
      betId: sanitizeBetId(order.betId),
    })),
  };
}

/**
 * Maps an order summary to abstract the application data models from the client ones
 */
function mapOrderToExchangeOrder(marketUrn: URN, order: LiveOrderSummary): ExchangeOrder {
  const {
    betId,
    selectionId,
    marketId,
    handicap,
    price,
    size,
    isFreeBet,
    bspLiability,
    averagePriceMatched,
    sizeMatched,
    sizeRemaining,
    side,
    persistenceType,
    orderType,
  } = order;

  return {
    marketId,
    marketUrn,
    betId: sanitizeBetId(betId),
    selectionId,
    handicap,
    price,
    size,
    isFreeBet,
    bspLiability,
    averagePriceMatched,
    sizeMatched,
    sizeRemaining,
    side: side as BetEngineSide,
    persistenceType: persistenceType as PersistenceType,
    orderType,
  };
}

/**
 * Retrieve market positions including settled profit for a given set of markets, indexed by market URN
 */
export async function getMarketPositionViews(marketIds: string[]): Promise<ExchangeMarketsPosition> {
  const liveBetReporting = liveBetReportingClientFactory("LBR");
  const views = await liveBetReporting.getMarketPositionViews(marketIds, { includeSettledProfit: true });

  return views.reduce<ExchangeMarketsPosition>((marketPositionViewsAccumulator, view) => {
    const ordersBySelection = view.selections.map((selection) => selection.orders || []);
    const orders = ordersBySelection.reduce((ordersAccumulator, val) => ordersAccumulator.concat(val), []);
    const market = `ppb:excMarket:${view.marketId}`;
    const viewResult: ExchangeMarketPositionViewResult = {
      market,
      marketId: view.marketId,
      orders: orders.map<ExchangeOrder>((order) => mapOrderToExchangeOrder(market, order)),
      settledProfit: view.settledProfit || 0,
    };

    return {
      ...marketPositionViewsAccumulator,
      [market]: viewResult,
    };
  }, {});
}
