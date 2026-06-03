import { SagaIterator } from "redux-saga";
import { put, ForkEffect, takeLatest, select, delay, spawn, call } from "redux-saga/effects";
import URN from "../state/layout/URN";
import { ApplicationState } from "../state/ApplicationState.types";
import { FETCH_CATALOGUE_SUCCESS, FETCH_CARDS, FetchCardsAction } from "../actions/catalogue";
import { getViewbyURN } from "../state/layout/views/event-view/event-view-selectors";
import { createFindViewItemByURNSelector } from "../state/layout/views/view-selectors";

const getViewItemByURN = createFindViewItemByURNSelector();

const REQUESTED_CARDS = new Set<string>();

const MAX_NUMBER_OF_CARDS = 5;

let viewURN: URN;

/**
 * Fetch a list of urns
 *
 * @param action FETCH_CARDS
 */
export function* fetchCards(cards: string[]): SagaIterator {
  cards.forEach((card) => {
    REQUESTED_CARDS.add(card);
  });

  yield put<FetchCardsAction>({
    type: FETCH_CARDS,
    payload: {
      urns: cards,
    },
  });
}

function* getUrns(item: any, urns: Set<string>): SagaIterator {
  if (item) {
    urns.add(item.urn);

    if ("items" in item) {
      for (let i = 0; i < item.items.length; i += 1) {
        const edge = item.items[i];

        const result = yield select((state: ApplicationState) => getViewItemByURN(state.layouts, edge.urn));

        if (result) {
          yield call(getUrns, result, urns);
        } else {
          urns.add(edge.urn);
        }
      }
    }
  }
}

export function* addItems(): SagaIterator {
  yield delay(0); // The function will run on the next tick, ensuring there's time for the store to be filled.

  const VIEW_CARDS = new Set<string>();

  const viewElements = yield select((state: ApplicationState) => {
    viewURN = state.router.currentUrn || "";
    return getViewbyURN(state.layouts.views, viewURN);
  });

  if (viewElements) {
    yield call(getUrns, viewElements, VIEW_CARDS);

    VIEW_CARDS.delete(viewURN);

    while (VIEW_CARDS.size > REQUESTED_CARDS.size) {
      const cardsToFetch = [...new Set([...VIEW_CARDS].filter((card) => !REQUESTED_CARDS.has(card)))].slice(
        0,
        MAX_NUMBER_OF_CARDS - 1,
      );

      if (cardsToFetch.length) {
        yield spawn(fetchCards, cardsToFetch);
      }
    }
  }
}

export function* updatePrerenderFlag(): SagaIterator {
  /**
   * On localhost the worst case scenario was about 1500 ms between requests, so this value should be enough
   */
  yield delay(2000);

  window.prerenderReady = true;
}

export function* incrementalLoadSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(FETCH_CATALOGUE_SUCCESS, addItems);
  yield takeLatest(FETCH_CATALOGUE_SUCCESS, updatePrerenderFlag);
}
