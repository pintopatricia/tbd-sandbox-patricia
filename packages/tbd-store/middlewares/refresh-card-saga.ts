import { SagaIterator } from "redux-saga";
import { delay, ForkEffect, takeLatest, put, select, call, take, race } from "redux-saga/effects";
import { SportsbookMarket } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import { FetchCardsAction, FETCH_CARDS } from "../actions/catalogue";
import {
  StartRefreshCardAction,
  START_REFRESH_CARD,
  StopRefreshCardAction,
  STOP_REFRESH_CARD,
} from "../actions/refresh";
import { FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS } from "../actions/sportsbook-markets";
import { getInterval } from "../config";
import { GridCard } from "../state/layout/cards/Card.types";
import URN from "../state/layout/URN";

type Subscription = {
  count: number;
  marketIds: Set<string>;
};

/**
 * Stores a count subscription and all market ids that were susbcribed
 */
const SUBSCRIPTION_MAP = new Map<string, Subscription>();

/**
 * Subscribes a card urn to our poller. It keeps a count since we can have the same
 * card multiple times on the same page.
 *
 * @param urn The card urn to subscribe
 */
function subscribe(urn: URN): void {
  const { count, marketIds } = SUBSCRIPTION_MAP.get(urn) || {
    count: 0,
    marketIds: new Set(),
  };

  SUBSCRIPTION_MAP.set(urn, {
    count: count + 1,
    marketIds,
  });
}

/**
 * Unsubscribes a card urn to our poller.
 *
 * @param urn The card urn to subscribe
 */
function unsubscribe(urn: URN): void {
  const { count, marketIds } = SUBSCRIPTION_MAP.get(urn) || {
    count: 0,
    marketIds: new Set(),
  };

  // Deleting the last entry
  if (count <= 1) {
    SUBSCRIPTION_MAP.delete(urn);
    return;
  }

  SUBSCRIPTION_MAP.set(urn, {
    count: count - 1,
    marketIds,
  });
}

/**
 * Method that queries the store to check if grid cards (for now) are listing markets
 * that were already closed.
 *
 * @param urn The Card/CardGroup urn
 * @returns True if this card has closed markets
 */
function* areMarketsClosed(urn: URN): SagaIterator<boolean> {
  const gridCard: GridCard | undefined = yield select((state: ApplicationState) => state.layouts.cards.grids[urn]);

  const items = gridCard?.markets || [];

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    const market: SportsbookMarket | undefined = yield select(
      (state: ApplicationState) => state.entities.sportsbookmarkets[item.urn],
    );

    if (market && market.status === "CLOSED") {
      return true;
    }
  }

  return false;
}

/**
 * Method that checks for the subscribed cards which ones are outdated and need refresh
 *
 * @returns An array with all urns that need refresh
 */
function* getOutdatedCardUrns(): SagaIterator<string[]> {
  const result: string[] = [];

  const subscriptions = Array.from(SUBSCRIPTION_MAP.keys());

  for (let i = 0; i < subscriptions.length; i += 1) {
    const urn = subscriptions[i];
    if (yield call(areMarketsClosed, urn)) {
      result.push(urn);
    }
  }

  return result;
}

/**
 * Schedule a FETCH_CARDS with a force refresh
 *
 * @param urns The list of URNs to be updated
 */
function* fetchCard(urns: string[]): SagaIterator<void> {
  yield delay(getInterval("REFRESH_CARDS"));

  yield put<FetchCardsAction>({
    type: FETCH_CARDS,
    payload: {
      urns,
      forceRefresh: true,
    },
  });
}

/**
 * Add a card to the subscription list and starts a polling that runs every time a new
 * market update is received. If any new market is closed a FETCH_CARDS for those cards
 * will be triggered.
 *
 * @param action The start refresh action
 */
export function* start(action: StartRefreshCardAction): SagaIterator {
  const urn = action.payload;

  // Subscribe this urn
  subscribe(urn);

  while (SUBSCRIPTION_MAP.size) {
    // Wait for a SMP update. Race is used so if all market closes we still check for outdated
    // cards (closed markets are removed from pollers)
    yield race([take(FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS), delay(getInterval("SMP"))]);

    // Determine which of the subscribed urns need refresh
    const urns = yield call(getOutdatedCardUrns);

    // Fetch
    if (urns.length) {
      yield call(fetchCard, urns);
    }
  }
}

/**
 * Remove a card from the refresh polling
 *
 * @param action Intercepted action
 */
export function stop(action: StopRefreshCardAction): void {
  unsubscribe(action.payload);
}

/**
 * Saga that takes every `START_REFRESH_CARD` and `STOP_REFRESH_CARD` and triggers the polling/refresh
 */
export function* refreshCardSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(START_REFRESH_CARD, start);
  yield takeLatest(STOP_REFRESH_CARD, stop);
}
