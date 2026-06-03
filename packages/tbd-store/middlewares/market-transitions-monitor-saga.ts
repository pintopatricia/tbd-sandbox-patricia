import { put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import URN from "../state/layout/URN";
import { SportsbookMarket, ExchangeMarket } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
  FetchExchangeMarketUpdatesSuccessAction,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UnsubscribeExchangeMarketUpdatesAction,
} from "../actions/exchange-markets";
import {
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
} from "../actions/sportsbook-markets";
import {
  MARKET_TRANSITIONED_STATUS,
  MarketTransitionedStatusAction,
  MarketTransitions,
} from "../actions/market-transitions";
import { ExchangeServiceGetPricesResult } from "../services/exchange-market-service";
import { PUSH } from "../actions/router";
import { getSportsbookMarketById } from "../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createGetExchangeMarketByMarketIdSelector } from "../state/entities/exchange-markets/exchange-market-selectors";

const getExchangeMarketById = createGetExchangeMarketByMarketIdSelector();

const SUBSCRIBED_MARKETS = new Map<URN, MarketTransitions>();

export function getMarketStatus(
  market: Partial<SportsbookMarket> | ExchangeServiceGetPricesResult["markets"][0],
): MarketTransitions {
  if (market.status === "CLOSED") {
    return MarketTransitions.CLOSED;
  }

  if (market.inplay) {
    return MarketTransitions.INPLAY;
  }
  return MarketTransitions.PREPLAY;
}

function* handleMarketTransitions(action: FetchExchangeMarketUpdatesSuccessAction): Generator {
  // for each market in payload
  for (let i = 0; i < action.payload.markets.length; i += 1) {
    const market = action.payload.markets[i];
    const { urn } = market;
    if (SUBSCRIBED_MARKETS.has(urn)) {
      // If the marketUrn is present in subscriptions we want to filter only the transitions
      // and dispatch an action accordingly
      const newStatus = getMarketStatus(market);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const existingStatus = SUBSCRIBED_MARKETS.get(urn)!;
      const hasTransitioned = newStatus !== existingStatus;

      if (hasTransitioned) {
        SUBSCRIBED_MARKETS.set(urn, newStatus);

        yield put<MarketTransitionedStatusAction>({
          type: MARKET_TRANSITIONED_STATUS,
          payload: urn,
          transition: {
            before: existingStatus,
            after: newStatus,
          },
        });
      }
    } else if (getMarketStatus(market) !== MarketTransitions.CLOSED) {
      // If the marketId is not present in subscriptions and is not closed we want to initialize it
      SUBSCRIBED_MARKETS.set(urn, getMarketStatus(market));
    } else {
      // We also need these transitions, to pass to the main markets monitor saga.
      yield put<MarketTransitionedStatusAction>({
        type: MARKET_TRANSITIONED_STATUS,
        payload: urn,
        transition: {
          before: MarketTransitions.INPLAY,
          after: MarketTransitions.CLOSED,
        },
      });
    }
  }
}

function clearSubscriptions(): void {
  SUBSCRIBED_MARKETS.clear();
}

/**
 * When a market is UNSUBSCRIBED we want to remove it from the polling subscriptions so there's no inconsistencies
 */
function* clearSpecificSubscription(
  action: UnsubscribeSportsbookMarketUpdatesAction | UnsubscribeExchangeMarketUpdatesAction,
): SagaIterator {
  const sportsbookMarket: SportsbookMarket | undefined = yield select((state: ApplicationState) =>
    getSportsbookMarketById(state.entities.sportsbookmarkets, action.payload.marketId),
  );

  if (sportsbookMarket && SUBSCRIBED_MARKETS.has(sportsbookMarket.urn)) {
    SUBSCRIBED_MARKETS.delete(sportsbookMarket.urn);
  } else {
    const exchangeMarket: ExchangeMarket | undefined = yield select((state: ApplicationState) =>
      getExchangeMarketById(state.entities.exchangemarkets, action.payload.marketId),
    );

    if (exchangeMarket && SUBSCRIBED_MARKETS.has(exchangeMarket.urn)) {
      SUBSCRIBED_MARKETS.delete(exchangeMarket.urn);
    }
  }
}

/**
 * Saga that monitors market transitions from PREPLAY -> INPLAY and INPLAY -> CLOSED
 * It considers a suspended market as INPLAY
 * It also clears the SUBSCRIPTIONS if the route changes
 */
export function* marketTransitionsMonitorSaga(): SagaIterator {
  yield takeEvery(FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS, handleMarketTransitions);
  yield takeLatest(FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS, handleMarketTransitions);
  yield takeLatest(UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES, clearSpecificSubscription);
  yield takeLatest(UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES, clearSpecificSubscription);
  yield takeLatest(PUSH, clearSubscriptions);
}
