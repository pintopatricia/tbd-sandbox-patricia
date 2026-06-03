import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import URN from "../state/layout/URN";
import { ExchangeMarket, SportsbookMarket } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  MARKET_TRANSITIONED_STATUS,
  MarketTransitionedStatusAction,
  MarketTransitions,
  SUBSCRIBE_MAIN_MARKET_TRANSITIONS,
  SubscribeMainMarketTransitions,
} from "../actions/market-transitions";
import { createSportsbookMarketByURNSelector } from "../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import { getMarketStatus } from "./market-transitions-monitor-saga";
import { PUSH } from "../actions/router";
import catalogueService from "../services/catalogue/catalogue-service";
import {
  FETCH_MAIN_MARKETS_UPDATES_FAILURE,
  FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
  FetchMainMarketsUpdatesFailureAction,
  FetchMainMarketsUpdatesSuccessAction,
} from "../actions/catalogue";
import {
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
} from "../actions/sportsbook-markets";
import { SUBSCRIBE_EXCHANGE_MARKET_UPDATES, SubscribeExchangeMarketUpdatesAction } from "../actions/exchange-markets";
import { TransformedLayout } from "../services/catalogue/catalogue-types";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";

const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();
const getExchangeMarketByURN = createExchangeMarketSelector();

type MarketSubscription = {
  urn: string;
  status: MarketTransitions;
};

type SubscribedMarkets = {
  [marketUrn: string]: MarketSubscription;
};

type MarketSubscriptions = {
  [cardUrn: string]: {
    displayMarkets: SubscribedMarkets;
    mainMarkets: SubscribedMarkets;
  };
};

let SUBSCRIBED_MARKETS: MarketSubscriptions = {};

const getContextForBFF = createContextForBFFSelector();

function* request(cardUrn: URN, withFixtureUpdates: boolean): SagaIterator {
  const {
    userPreferences,
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  }: ReturnType<typeof getContextForBFF> = yield select((state: ApplicationState) =>
    getContextForBFF(state.entities, state.router),
  );

  try {
    const payload: TransformedLayout = yield call(
      catalogueService.getMainMarketsUpdates,
      [cardUrn],
      withFixtureUpdates,
      userPreferences,
      productExclusions,
      experiments,
      throttleOverrides,
      router,
    );
    yield put<FetchMainMarketsUpdatesSuccessAction>({
      type: FETCH_MAIN_MARKETS_UPDATES_SUCCESS,
      payload,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield put<FetchMainMarketsUpdatesFailureAction>({
        type: FETCH_MAIN_MARKETS_UPDATES_FAILURE,
        error: e.message,
      });
    } else {
      yield put<FetchMainMarketsUpdatesFailureAction>({
        type: FETCH_MAIN_MARKETS_UPDATES_FAILURE,
        error: `Unknown error ${e}`,
      });
    }
  }
}

function* subscribeOtherMarketIfExists(allMarketUrnsForCard: URN[], currentMarketUrn: URN): SagaIterator {
  const otherMarketUrn = allMarketUrnsForCard.find((marketUrnEntry) => marketUrnEntry !== currentMarketUrn);

  // if the other tab exists
  if (otherMarketUrn) {
    // we need to figure out if it is a sbk or exc tab
    const sportsbookMarket: SportsbookMarket | undefined = yield select((state: ApplicationState) =>
      getSportsbookMarketByURN(state.entities.sportsbookmarkets, otherMarketUrn),
    );
    if (sportsbookMarket) {
      // now that we know the other tab is sbk
      // get market id and subscribe the other tab to market updates
      yield put<SubscribeSportsbookMarketUpdatesAction>({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId: sportsbookMarket.marketId,
          subscriberId: "main-markets-monitor-saga",
        },
      });
      return;
    }

    const exchangeMarket: ExchangeMarket | undefined = yield select((state: ApplicationState) =>
      getExchangeMarketByURN(state.entities.exchangemarkets, otherMarketUrn),
    );
    if (exchangeMarket) {
      // now that we know the other tab is exc
      // get market id and subscribe the other tab to market updates
      yield put<SubscribeExchangeMarketUpdatesAction>({
        type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
        payload: {
          marketId: exchangeMarket.marketId,
        },
      });
    }
  }
}

function* getMarketStatusFromMarketURN(marketURN: string): SagaIterator<MarketTransitions> {
  const sportsbookMarket: SportsbookMarket | undefined = yield select((state: ApplicationState) =>
    getSportsbookMarketByURN(state.entities.sportsbookmarkets, marketURN),
  );
  if (sportsbookMarket) {
    return getMarketStatus(sportsbookMarket);
  }

  const exchangeMarket: ExchangeMarket = yield select((state: ApplicationState) =>
    getExchangeMarketByURN(state.entities.exchangemarkets, marketURN),
  );
  return getMarketStatus(exchangeMarket);
}

function* handleMarketStatusTransitionByMarketURN(
  markets: SubscribedMarkets,
  marketURN: URN,
  subscribeUnselectedMarketToPriceUpdates: boolean,
): SagaIterator {
  const marketSubscriptionsEntries = Object.entries(markets);
  let updatedMarket: MarketSubscription | Record<string, never> = {};

  for (let j = 0; j < marketSubscriptionsEntries.length; j += 1) {
    const [marketUrn, marketSub] = marketSubscriptionsEntries[j];

    if (marketSub.urn === marketURN) {
      updatedMarket = {
        urn: marketUrn,
        status: yield call(getMarketStatusFromMarketURN, marketUrn),
      };

      if (subscribeUnselectedMarketToPriceUpdates) {
        // Since we will only poll the selected tab at any one time, once the saga detects that a market has closed, it
        // will automatically subscribe the other market (for example: EXC closes and we subscribe SBK & vice versa)
        yield call(
          subscribeOtherMarketIfExists,
          marketSubscriptionsEntries
            // if we know the other market is closed, we do not need to subscribe to it again
            .filter(([, marketSubEntry]) => marketSubEntry.status !== "CLOSED")
            .map(([marketUrnEntry]) => marketUrnEntry),
          marketURN,
        );
      }
    }
  }

  return updatedMarket;
}

function* handleInplayToClosedTransition(action: MarketTransitionedStatusAction): SagaIterator {
  // filter out irrelevant transitions
  if (action.transition.before !== MarketTransitions.INPLAY || action.transition.after !== MarketTransitions.CLOSED) {
    return;
  }

  // update the market status in our SUBSCRIBED_MARKETS object
  const subscribedMarketsEntries = Object.entries(SUBSCRIBED_MARKETS);
  for (let i = 0; i < Object.keys(SUBSCRIBED_MARKETS).length; i += 1) {
    const [, { displayMarkets, mainMarkets }] = subscribedMarketsEntries[i];

    displayMarkets[action.payload] = yield call(
      handleMarketStatusTransitionByMarketURN,
      displayMarkets,
      action.payload,
      true,
    );
    mainMarkets[action.payload] = yield call(
      handleMarketStatusTransitionByMarketURN,
      mainMarkets,
      action.payload,
      false,
    );
  }

  const itemsToDelete: {
    cardUrn: string;
    allDisplayMarketsAreClosed: boolean;
    allMainMarketsAreClosed: boolean;
  }[] = [];
  // iterate through every key in the subscriptions object
  const subscribedMarketEntries = Object.entries(SUBSCRIBED_MARKETS);
  for (let i = 0; i < subscribedMarketEntries.length; i += 1) {
    const [cardUrn, { displayMarkets, mainMarkets }] = subscribedMarketEntries[i];

    const allDisplayMarketsAreClosed = Object.values(displayMarkets).every(
      (marketEntry) => marketEntry.status === MarketTransitions.CLOSED,
    );
    const allMainMarketsAreClosed = Object.values(mainMarkets).every(
      (marketEntry) => marketEntry.status === MarketTransitions.CLOSED,
    );

    // if there is a card urn, in which every market in the object is CLOSED
    if (allDisplayMarketsAreClosed || allMainMarketsAreClosed) {
      // we request the new main markets for that card urn

      yield call(request, cardUrn, allMainMarketsAreClosed);
      // we also want to stop monitoring that card, now that we've requested new main markets.
      // If we get new main markets, the card will be resubscribed automatically again.
      // We add this itemsToDelete because we are iterating on the object we want to delete keys from and we do not
      // want any inconsistencies or bugs due to us deleting entries whilst iterating.
      itemsToDelete.push({ cardUrn, allDisplayMarketsAreClosed, allMainMarketsAreClosed });
    }
  }

  // delete the keys from the subscriptions object, whose cards we know have already been request again.
  if (itemsToDelete.length) {
    itemsToDelete.forEach(({ cardUrn, allDisplayMarketsAreClosed, allMainMarketsAreClosed }) => {
      if (allDisplayMarketsAreClosed && allMainMarketsAreClosed) {
        delete SUBSCRIBED_MARKETS[cardUrn]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
      } else if (allDisplayMarketsAreClosed) {
        SUBSCRIBED_MARKETS[cardUrn].displayMarkets = {};
      } else if (allMainMarketsAreClosed) {
        SUBSCRIBED_MARKETS[cardUrn].mainMarkets = {};
      }
    });
  }
}

function* addMainMarketsSubscription(action: SubscribeMainMarketTransitions): SagaIterator {
  const {
    payload: { cardURN, marketURNs, withFixtureUpdates },
  } = action;

  // Here, we add the cards and their respective markets to this saga's internal state for monitoring.
  // This is called when a card renders on the screen through a useEffect, or that card's markets are updated.
  if (SUBSCRIBED_MARKETS[cardURN] === undefined) {
    SUBSCRIBED_MARKETS[cardURN] = { displayMarkets: {}, mainMarkets: {} };
  }

  for (let i = 0; i < marketURNs.length; i += 1) {
    const marketURN = marketURNs[i];

    SUBSCRIBED_MARKETS[cardURN][withFixtureUpdates ? "mainMarkets" : "displayMarkets"][marketURN] = {
      urn: marketURN,
      status: yield call(getMarketStatusFromMarketURN, marketURN),
    };
  }
}

function clearSubscriptions(): void {
  SUBSCRIBED_MARKETS = {};
}

/**
 */
export function* mainMarketsMonitorSaga(): SagaIterator {
  // We use takeEvery, because we never want to cancel an action, when a new one arrives.
  // That would cause us to miss transitions.
  yield takeEvery(MARKET_TRANSITIONED_STATUS, handleInplayToClosedTransition);
  yield takeEvery(SUBSCRIBE_MAIN_MARKET_TRANSITIONS, addMainMarketsSubscription);
  yield takeLatest(PUSH, clearSubscriptions);
}
