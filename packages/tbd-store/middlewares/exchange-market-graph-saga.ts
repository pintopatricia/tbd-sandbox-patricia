import { call, delay, spawn, takeLatest, put } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import exchangeService, { RunnerExchangePrices } from "../services/exchange-market-service";
import { getInterval } from "../config";
import {
  SUBSCRIBE_MARKET_GRAPH,
  UNSUBSCRIBE_MARKET_GRAPH,
  FetchMarketGraphSuccessAction,
  FetchMarketGraphFailureAction,
  FETCH_MARKET_GRAPH_SUCCESS,
  FETCH_MARKET_GRAPH_FAILURE,
  SubscribeMarketGraph,
} from "../actions/exchange-markets";
import { MarketId } from "../state/entities/Common.types";

let marketIdSubscribed: MarketId | null;

/**
 * Method that will handle the market graph polling from ERO
 *
 * @param action Intercepted action
 */

function* requestMarketGraph(selectionId: number, localeCode: string, currencyCode: string): SagaIterator {
  if (!marketIdSubscribed) {
    yield put<FetchMarketGraphFailureAction>({
      type: FETCH_MARKET_GRAPH_FAILURE,
      error: "No marketId subscribed",
    });

    return;
  }

  try {
    const payload: RunnerExchangePrices = yield call(
      exchangeService.getRunnerMarketUpdate,
      marketIdSubscribed,
      selectionId,
      localeCode,
      currencyCode,
    );

    yield put<FetchMarketGraphSuccessAction>({
      type: FETCH_MARKET_GRAPH_SUCCESS,
      payload,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield put<FetchMarketGraphFailureAction>({
        type: FETCH_MARKET_GRAPH_FAILURE,
        error: e.message,
      });
    } else {
      yield put<FetchMarketGraphFailureAction>({
        type: FETCH_MARKET_GRAPH_FAILURE,
        error: `Unknown error ${e}`,
      });
    }
  }
}

function* subscribeMarketGraphUpdates(action: SubscribeMarketGraph): SagaIterator {
  const { marketId, selectionId, localeCode, currencyCode } = action.payload;

  marketIdSubscribed = marketId;

  // Polling
  while (marketIdSubscribed !== null) {
    yield spawn(requestMarketGraph, selectionId, localeCode, currencyCode);
    yield delay(getInterval("ERO"));
  }
}

function unsubscribeMarketGraphUpdates(): void {
  marketIdSubscribed = null;
}

/**
 * Saga that takes every `SUBSCRIBE_MARKET_GRAPH` request and
 * trigger the polling
 * clears the SUBSCRIPTIONS on `UNSUBSCRIBE_MARKET_GRAPH`
 */
export function* exchangeMarketGraphSaga(): SagaIterator {
  yield takeLatest(UNSUBSCRIBE_MARKET_GRAPH, unsubscribeMarketGraphUpdates);
  yield takeLatest(SUBSCRIBE_MARKET_GRAPH, subscribeMarketGraphUpdates);
}
