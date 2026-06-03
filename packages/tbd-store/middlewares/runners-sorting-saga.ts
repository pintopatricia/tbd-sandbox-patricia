/**
 * This Saga's purpose is to refresh the displayRunners of betting cards in order to have the most recent runners to display.
 *
 * It intercepts the action `MARKET_TRANSITIONED_STATUS` to collect
 * the marketURNs of the markets whose statuses have transitioned.
 * If they are HR markets and are transitioning from PREPLAY -> INPLAY we will capture them.
 *
 * For those who went inplay we'll check which cardUrns they belong so that we can ask for updates of the displayRunners
 */

import { call, ForkEffect, put, select, takeEvery } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import URN from "../state/layout/URN";
import { SportsbookMarket, ExchangeMarket } from "../state/entities";
import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService from "../services/catalogue/catalogue-service";
import {
  FETCH_RUNNERS_ORDER_UPDATES_FAILURE,
  FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
  FetchRunnersOrderUpdatesFailureAction,
  FetchRunnersOrderUpdatesSuccessAction,
} from "../actions/catalogue";
import {
  MarketTransitionedStatusAction,
  MarketTransitions,
  MARKET_TRANSITIONED_STATUS,
} from "../actions/market-transitions";
import { createExchangeMarketSelector } from "../state/entities/exchange-markets/exchange-market-selectors";
import { createSportsbookMarketSelector } from "../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { getSportByURN } from "../state/entities/sports/sport-selectors";
import { TransformedLayout } from "../services/catalogue/catalogue-types";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";
import { EventMarketCard, MarketCard, MarketExtendedCard, RaceMarketCard } from "../state/layout/cards/Card.types";
import { RacingSport } from "../state/constants";

const getExchangeMarketByUrn = createExchangeMarketSelector();
const getSportsbookMarketByUrn = createSportsbookMarketSelector();

const getContextForBFF = createContextForBFFSelector();

function* request(cardUrnsToFetch: URN[], requestForExc: boolean, requestForSbk: boolean): SagaIterator {
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
      catalogueService.getSortableCardsDisplayRunnersUpdates,
      cardUrnsToFetch,
      requestForExc,
      requestForSbk,
      userPreferences,
      productExclusions,
      experiments,
      throttleOverrides,
      router,
    );

    yield put<FetchRunnersOrderUpdatesSuccessAction>({
      type: FETCH_RUNNERS_ORDER_UPDATES_SUCCESS,
      payload,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield put<FetchRunnersOrderUpdatesFailureAction>({
        type: FETCH_RUNNERS_ORDER_UPDATES_FAILURE,
        error: e.message,
      });
    } else {
      yield put<FetchRunnersOrderUpdatesFailureAction>({
        type: FETCH_RUNNERS_ORDER_UPDATES_FAILURE,
        error: `Unknown error ${e}`,
      });
    }
  }
}

function* isHorseRacingSport(marketURN: string): SagaIterator<boolean> {
  let sportUrn: string;

  const exchangeMarket: ExchangeMarket | undefined = yield select((state: ApplicationState) =>
    getExchangeMarketByUrn(state.entities.exchangemarkets, marketURN),
  );
  if (exchangeMarket) {
    sportUrn = exchangeMarket.sport;
  } else {
    const sportsbookMarket: SportsbookMarket = yield select((state: ApplicationState) =>
      getSportsbookMarketByUrn(state, marketURN),
    );
    sportUrn = sportsbookMarket.sport;
  }

  const sportId = yield select((state: ApplicationState) => getSportByURN(state.entities.sports, sportUrn)?.sportId);
  return sportId === RacingSport.HORSE_RACING;
}

function* handlePreplayToInplayTransition(action: MarketTransitionedStatusAction): SagaIterator {
  // filter out irrelevant transitions
  if (action.transition.before !== MarketTransitions.PREPLAY || action.transition.after !== MarketTransitions.INPLAY) {
    return;
  }

  // if sport is horse racing
  const isHorseRacing: boolean = yield call(isHorseRacingSport, action.payload);
  if (!isHorseRacing) {
    return;
  }

  let requestForExc = false;
  let requestForSbk = false;
  const cardUrnsToFetch: URN[] = [];

  type RunnersSortableCards = {
    [urn: string]: MarketCard | RaceMarketCard | MarketExtendedCard | EventMarketCard;
  };
  const sortableCards: RunnersSortableCards = yield select((state: ApplicationState) => ({
    ...state.layouts.cards.markets,
    ...state.layouts.cards.marketsextended,
    ...state.layouts.cards.eventmarkets,
    ...state.layouts.cards.racemarkets,
  }));

  Object.values(sortableCards).forEach(({ urn, displayRunners }) => {
    const { exchange, sportsbook } = displayRunners;

    if (!exchange && !sportsbook) {
      return;
    }

    if (exchange && exchange.market === action.payload) {
      requestForExc = true;
      cardUrnsToFetch.push(urn);
    } else if (sportsbook && sportsbook.market === action.payload) {
      requestForSbk = true;
      cardUrnsToFetch.push(urn);
    }
  });

  if (cardUrnsToFetch.length) {
    yield call(request, cardUrnsToFetch, requestForExc, requestForSbk);
  }
}

export function* fetchRunnersOrderUpdatesSaga(): IterableIterator<ForkEffect> {
  yield takeEvery(MARKET_TRANSITIONED_STATUS, handlePreplayToInplayTransition);
}
