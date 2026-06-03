import { SagaIterator } from "redux-saga";
import { put, ForkEffect, takeLatest, select, call, delay, spawn } from "redux-saga/effects";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  FetchExchangeMarketUpdatesSuccessAction,
  FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
} from "../actions/exchange-markets";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import {
  FetchSportsbookMarketUpdatesSuccessAction,
  FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
} from "../actions/sportsbook-markets";
import exchangeService, { ExchangeServiceGetPricesResult } from "../services/exchange-market-service";
import sportsbookService, { SportsbookServiceGetPricesResult } from "../services/sportsbook-market-service";
import { FETCH_CATALOGUE_SUCCESS } from "../actions/catalogue";

let fetchedExchangeMarkets: string[] = [];
let fetchedSportsbookMarkets: string[] = [];
const PRICE_HISTORY = 1;
const MAX_NUMBER_OF_LIVE_MARKETS = 20;

function isNewExchangeMarket(marketId: string): boolean {
  return !fetchedExchangeMarkets.includes(marketId);
}

function* getExchangeMarketPrices(exchangeMarketIds: string[], localeCode: string, currencyCode: string): SagaIterator {
  while (true) {
    const marketIdsToFetch = exchangeMarketIds
      .filter((marketId) => isNewExchangeMarket(marketId))
      .slice(0, MAX_NUMBER_OF_LIVE_MARKETS - 1);
    fetchedExchangeMarkets = [...fetchedExchangeMarkets, ...marketIdsToFetch];

    if (marketIdsToFetch.length) {
      const response: ExchangeServiceGetPricesResult = yield call(
        exchangeService.getPrices,
        marketIdsToFetch,
        localeCode,
        currencyCode,
        true,
      );

      yield put<FetchExchangeMarketUpdatesSuccessAction>({
        type: FETCH_EXCHANGE_MARKET_UPDATES_SUCCESS,
        payload: response,
      });
    } else {
      return;
    }
  }
}

function isNewSportsbookMarket(marketId: string): boolean {
  return !fetchedSportsbookMarkets.includes(marketId);
}

function* getSportsbookMarketPrices(sportsbookMarketIds: string[]): SagaIterator {
  while (true) {
    const marketIdsToFetch = sportsbookMarketIds
      .filter((marketId) => isNewSportsbookMarket(marketId))
      .slice(0, MAX_NUMBER_OF_LIVE_MARKETS - 1);
    fetchedSportsbookMarkets = [...fetchedSportsbookMarkets, ...marketIdsToFetch];

    if (marketIdsToFetch.length) {
      const response: SportsbookServiceGetPricesResult = yield call(
        sportsbookService.getPrices,
        marketIdsToFetch,
        PRICE_HISTORY,
      );

      yield put<FetchSportsbookMarketUpdatesSuccessAction>({
        type: FETCH_SPORTSBOOK_MARKET_UPDATES_SUCCESS,
        payload: response,
      });
    } else {
      return;
    }
  }
}

export function* fetchPrices(): SagaIterator {
  yield delay(0); // The function will run on the next tick, ensuring there's time for the store to be filled.

  const { currencyCode, localeCode } = yield select(getUserDetails);
  const exchangeMarketIds = yield select((state: ApplicationState) =>
    Object.values(state.entities.exchangemarkets).map((market) => market.marketId),
  );

  const sportsbookMarketIds = yield select((state: ApplicationState) =>
    Object.values(state.entities.sportsbookmarkets).map((market) => market.marketId),
  );

  if (window.__CONTENT_LOADING_PARAMETERS__.exchangePrices) {
    yield spawn(getExchangeMarketPrices, exchangeMarketIds, localeCode, currencyCode);
  }
  if (window.__CONTENT_LOADING_PARAMETERS__.sportsbookPrices) {
    yield spawn(getSportsbookMarketPrices, sportsbookMarketIds);
  }
}

export function* incrementalLoadPricesSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(FETCH_CATALOGUE_SUCCESS, fetchPrices);
}
