import { call, delay, takeLatest, put, select, all } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { PUSH } from "../actions/router";
import {
  FetchExchangeMarketUpdatesSuccessAction,
  SubscribeExchangeMarketUpdatesAction,
  UnsubscribeExchangeMarketUpdatesAction,
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
} from "../actions/exchange-markets";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";
import exchangeService, { ExchangeServiceGetPricesResult } from "../services/exchange-market-service";
import { getInterval } from "../config";
import { getMarketPositionViews } from "../services/live-bet-reporting-service";
import { FETCH_EXC_OPEN_BETS_SUCCESS, FetchExchangeOpenBetsSuccessAction } from "../actions/exchange-open-bets";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { FetchExchangeByMarketAuthFailure, NETWORK__EXC_BY_MARKET_AUTH_FAILURE } from "../actions/betslip";
import { MarketId } from "../state/entities/Common.types";
import { ExchangeMarketsPosition } from "../state/betting/exchange-orders/ExchangeOrder.types";
import { ExchangeMarketStatus } from "../clients/catalogue/catalogue-response-types";

const ERO_SUBSCRIPTIONS = new Map<MarketId, number>();
const LBR_SUBSCRIPTIONS = new Map<MarketId, number>();
const subscriptionsResults = new Set<MarketId>();

function* requestMarketPrices(marketIds: string[]): SagaIterator {
  const { currencyCode, localeCode } = yield select(getUserDetails);
  const withMarketDescription = !marketIds.every((marketId) => subscriptionsResults.has(marketId));

  try {
    return yield call(exchangeService.getPrices, marketIds, localeCode, currencyCode, withMarketDescription);
  } catch (error) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.warn(`Error fetching exchange market prices (${marketIds.join(", ")}): ${error.message}`);

      if (isHttpUnauthorizedError(error)) {
        yield put<FetchExchangeByMarketAuthFailure>({
          type: NETWORK__EXC_BY_MARKET_AUTH_FAILURE,
        });
      }
    }
    // eslint-disable-next-line no-console
    console.warn(`Unknown error fetching exchange market prices (${marketIds.join(", ")}): ${error}`);
    return undefined;
  }
}

function* requestMarketPosition(marketIds: string[]): SagaIterator {
  const { loggedIn } = yield select(getUserDetails);
  try {
    return loggedIn ? yield call(getMarketPositionViews, marketIds) : undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      error instanceof Error
        ? `Error fetching exchange market positions (${marketIds.join(", ")}): ${error.message}`
        : `Unknown error fetching exchange market positions (${marketIds.join(", ")}): ${error}`,
    );
    return undefined;
  }
}

/**
 * Request data and put the payload
 */
function* requestMarketUpdates(): SagaIterator {
  const eroMarketIds = [...ERO_SUBSCRIPTIONS.keys()];
  const lbrMarketIds = [...LBR_SUBSCRIPTIONS.keys()];

  const requests = [call(requestMarketPrices, eroMarketIds)];

  if (lbrMarketIds.length) {
    requests.push(call(requestMarketPosition, lbrMarketIds));
  }

  const [marketsUpdates, positionsUpdates]: [
    ExchangeServiceGetPricesResult | undefined,
    ExchangeMarketsPosition | undefined,
  ] = yield all(requests);

  if (marketsUpdates) {
    yield put<FetchExchangeMarketUpdatesSuccessAction>({
      type: FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
      payload: marketsUpdates,
    });

    // stop subscribing closed markets
    marketsUpdates.markets.forEach((market) => {
      if (market.status === ExchangeMarketStatus.Closed) {
        ERO_SUBSCRIPTIONS.delete(market.marketId);
        LBR_SUBSCRIPTIONS.delete(market.marketId);
        subscriptionsResults.delete(market.marketId);
      } else {
        subscriptionsResults.add(market.marketId);
      }
    });
  }

  if (positionsUpdates) {
    yield put<FetchExchangeOpenBetsSuccessAction>({
      type: FETCH_EXC_OPEN_BETS_SUCCESS,
      payload: {
        markets: positionsUpdates,
      },
    });
  }
}

/**
 * Method that will handle the price polling subscriptions from ERO
 *
 * @param action Intercepted action
 */
function subscribeExchangeMarketUpdates(action: SubscribeExchangeMarketUpdatesAction): void {
  const { marketId, isInline } = action.payload;
  const eroSubsCount = ERO_SUBSCRIPTIONS.get(marketId) || 0;
  ERO_SUBSCRIPTIONS.set(marketId, eroSubsCount + 1);

  if (!isInline) {
    const lbrSubsCount = LBR_SUBSCRIPTIONS.get(marketId) || 0;
    LBR_SUBSCRIPTIONS.set(marketId, lbrSubsCount + 1);
  }
}

/**
 * Method that will handle the price polling from ERO
 */
export function* startExchangeMarketUpdates(): SagaIterator {
  // Delay function so we can wait to every component. The value for delay is the same use
  // by relay batching middleware: https://github.com/relay-tools/react-relay-network-layer
  yield delay(0);

  // Polling
  while (ERO_SUBSCRIPTIONS.size) {
    yield call(requestMarketUpdates);
    yield delay(getInterval("ERO"));
  }
}

/**
 * Remove all markets subscriptions
 */
function unsubscribeAll(): void {
  ERO_SUBSCRIPTIONS.clear();
  LBR_SUBSCRIPTIONS.clear();
}

function unsubscribeExchangeMarketUpdates(action: UnsubscribeExchangeMarketUpdatesAction): void {
  const { marketId, isInline } = action.payload;
  const eroSubsCount = ERO_SUBSCRIPTIONS.get(marketId);
  const lbrSubsCount = isInline ? undefined : LBR_SUBSCRIPTIONS.get(marketId);

  if (eroSubsCount !== undefined) {
    if (eroSubsCount <= 1) {
      ERO_SUBSCRIPTIONS.delete(marketId);
    } else {
      ERO_SUBSCRIPTIONS.set(marketId, eroSubsCount - 1);
    }
  }

  if (lbrSubsCount !== undefined) {
    if (lbrSubsCount <= 1) {
      LBR_SUBSCRIPTIONS.delete(marketId);
    } else {
      LBR_SUBSCRIPTIONS.set(marketId, lbrSubsCount - 1);
    }
  }
}

/**
 * Saga that takes every `SUBSCRIBE_EXCHANGE_MARKET_UPDATES` request and
 * trigger the polling
 * It also clears the SUBSCRIPTIONS if the route changes or product switches
 */
export function* exchangeMarketSaga(): SagaIterator {
  yield takeLatest(SUBSCRIBE_EXCHANGE_MARKET_UPDATES, subscribeExchangeMarketUpdates);
  yield takeLatest(UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES, unsubscribeExchangeMarketUpdates);
  yield takeLatest([PUSH, UI__SWITCH_PRODUCT_PREFERENCE], unsubscribeAll);
}
