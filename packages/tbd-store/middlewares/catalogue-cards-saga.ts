import { SagaIterator } from "redux-saga";
import { call, ForkEffect, put, delay, select, takeEvery, take, race } from "redux-saga/effects";
import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService from "../services/catalogue/catalogue-service";
import {
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueFailureAction,
  FetchCatalogueSuccessAction,
  FETCH_CARDS_FROM_LIST,
  FetchCardsFromListAction,
  DeleteViewItems,
  DELETE_VIEW_ITEMS,
  FETCH_CATALOGUE_CLEAN_UP,
  FetchCatalogueCleanUpAction,
  FETCH_CARDS,
  FetchCardsAction,
  FETCH_FULL_CARD,
  FetchFullCardAction,
  FetchCatalogueAuthFailureAction,
  FETCH_CATALOGUE_AUTH_FAILURE,
} from "../actions/catalogue";
import { UI__SWITCH_PRODUCT_PREFERENCE } from "../actions/preferences";
import { createFindViewItemByURNSelector } from "../state/layout/views/view-selectors";
import { FILLED_CARDS_PER_CARD_GROUP, FILLED_CARDS_PER_LAZY_LOAD } from "../config/common-config";
import { isHttpUnauthorizedError } from "../helpers/error-parsing";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";
import { APOLLO_MIGRATED_CARDS } from "../state/layout/cards/Card.types";

const CARDS_FETCHING = new Set<string>();

const getViewItemByURN = createFindViewItemByURNSelector();

/**
 * Find the current urn index
 *
 * @param list The list of all URNS
 * @param urn The URN that trigger the request
 */
function getCardIndex(list: string[], urn: string): number {
  const index = list.indexOf(urn);

  return index > -1 ? index : 0;
}

const getContextForBFF = createContextForBFFSelector();

/**
 * Generator function to fetch a full card
 *
 * @param urn The URN to fetch
 */
export function* requestFullCard(urn: string): SagaIterator {
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
    const payload = yield call(
      catalogueService.getFullCard,
      urn,
      userPreferences,
      productExclusions,
      experiments,
      throttleOverrides,
      router,
    );

    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (isHttpUnauthorizedError(error)) {
        yield put<FetchCatalogueAuthFailureAction>({
          type: FETCH_CATALOGUE_AUTH_FAILURE,
          urn,
        });
      } else {
        yield put<FetchCatalogueFailureAction>({
          type: FETCH_CATALOGUE_FAILURE,
          payload: {
            error,
          },
        });
      }
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: {
          error: new Error(`Unknown error ${error}`),
        },
      });
    }
  }
}

/**
 * Generator function to fetch all URNs and dispatch the output
 *
 * @param urns The list of URNs to fetch
 * @param forceRefresh true if we really want to refresh a card
 * @param forceRefreshComponent true if we want pass along (to the reducers/slices) the information in the response that items within the card should be refreshed.
 */
export function* requestCards(
  urns: string[],
  first?: number,
  cursor?: string,
  forceRefresh = false,
  forceRefreshComponent = false,
): SagaIterator {
  const requestUrns: string[] = [];
  const {
    userPreferences,
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  }: ReturnType<typeof getContextForBFF> = yield select((state: ApplicationState) =>
    getContextForBFF(state.entities, state.router),
  );

  if (!forceRefresh) {
    for (let i = 0; i < urns.length; i += 1) {
      const card = yield select((state: ApplicationState) => getViewItemByURN(state.layouts, urns[i]));
      if (!card) {
        requestUrns.push(urns[i]);
      }
    }
  } else {
    requestUrns.push(...urns);
  }

  if (requestUrns.length) {
    try {
      const payload = yield call(
        catalogueService.getCards,
        requestUrns,
        FILLED_CARDS_PER_CARD_GROUP,
        userPreferences,
        productExclusions,
        experiments,
        throttleOverrides,
        router,
        first,
        cursor,
      );

      yield put<FetchCatalogueSuccessAction>({
        type: FETCH_CATALOGUE_SUCCESS,
        payload: {
          ...payload,
          forceRefreshComponent,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        if (isHttpUnauthorizedError(error)) {
          yield put<FetchCatalogueAuthFailureAction>({
            type: FETCH_CATALOGUE_AUTH_FAILURE,
          });
        } else {
          yield put<FetchCatalogueFailureAction>({
            type: FETCH_CATALOGUE_FAILURE,
            payload: {
              error,
            },
          });
        }
      } else {
        yield put<FetchCatalogueFailureAction>({
          type: FETCH_CATALOGUE_FAILURE,
          payload: {
            error: new Error(`Unknown error ${error}`),
          },
        });
      }
    }

    // Trigger a clean up to run after store is updated
    yield put<FetchCatalogueCleanUpAction>({
      type: FETCH_CATALOGUE_CLEAN_UP,
      payload: urns,
    });
  }
}

/**
 * Fetch a list of urns
 *
 * @param action FETCH_CARDS
 */
export function* fetchCards(action: FetchCardsAction): SagaIterator {
  const { urns, forceRefresh, first, cursor, forceRefreshComponent } = action.payload;

  yield call(requestCards, urns, first, cursor, forceRefresh, forceRefreshComponent);
}

/**
 * Fetch a full card
 *
 * @param action FETCH_FULL_CARD
 */
export function* fetchFullCard(action: FetchFullCardAction): SagaIterator {
  const urn = action.payload;

  yield call(requestFullCard, urn);
}

/**
 * Generator function gather urns to be fetched.
 *
 * @param action FETCH_CARDS_FROM_LIST
 */
export function* fetchCardsFromList(action: FetchCardsFromListAction): SagaIterator {
  const { urn, partials, numberOfCards = FILLED_CARDS_PER_LAZY_LOAD, ignoreFetchedCard = true } = action.payload;
  const cardsToFetch = new Set<string>();

  const viewItem = yield select((state: ApplicationState) => getViewItemByURN(state.layouts, urn));

  // Somehow this item is already fetching or fetched
  if (ignoreFetchedCard && (viewItem || CARDS_FETCHING.has(urn))) {
    return;
  }

  const nonMigratedPartialsList = partials
    .filter(({ typename }) => !APOLLO_MIGRATED_CARDS.includes(typename))
    .map((partial) => partial.urn);

  if (!nonMigratedPartialsList.includes(urn)) return;

  for (let i = getCardIndex(nonMigratedPartialsList, urn); i < nonMigratedPartialsList.length; i += 1) {
    const fetchUrn = nonMigratedPartialsList[i];
    const result = yield select((state: ApplicationState) => getViewItemByURN(state.layouts, fetchUrn));

    // Not fetched or fetching
    if (!result && !CARDS_FETCHING.has(fetchUrn)) {
      cardsToFetch.add(fetchUrn);
      CARDS_FETCHING.add(fetchUrn);
    }

    // Limit the fetch to a maximum
    if (cardsToFetch.size >= numberOfCards) {
      break;
    }
  }

  if (cardsToFetch.size) {
    yield call(requestCards, Array.from(cardsToFetch));
  }
}

/**
 * Clean up all fetched URN that were not mapped
 *
 * @param action payload with all fetched urns
 */
export function* cleanCards(action: FetchCatalogueCleanUpAction): SagaIterator {
  // Force the clean up to run on the next tick. This will ensure that store is already filled.
  yield delay(0);

  const urns = action.payload;
  const cardsToDelete = [];

  // We can clean these urns from fetching cache list
  urns.forEach((urn) => CARDS_FETCHING.delete(urn));

  for (let i = 0; i < urns.length; i += 1) {
    const fetchUrn = urns[i];

    const result = yield select((state: ApplicationState) => getViewItemByURN(state.layouts, fetchUrn));

    if (!result) {
      cardsToDelete.push(fetchUrn);
    }
  }

  if (cardsToDelete.length) {
    yield put<DeleteViewItems>({
      type: DELETE_VIEW_ITEMS,
      payload: cardsToDelete,
    });
  }
}

/**
 * Generator function gather urns to be fetched. It is canceled when product switcher action is dispatched
 *
 * @param action FETCH_CARDS_FROM_LIST
 */
export function* fetchCardsFromListCancellable(action: FetchCardsFromListAction): SagaIterator {
  yield race([call(fetchCardsFromList, action), take(UI__SWITCH_PRODUCT_PREFERENCE)]);
}

/**
 * Clean up all fetched URN, to avoid showing up different product card on other product
 */
export function cleanFetchingCards() {
  CARDS_FETCHING.clear();
}

export function* cardsCatalogueSaga(): IterableIterator<ForkEffect> {
  yield takeEvery(FETCH_CARDS, fetchCards);
  yield takeEvery(FETCH_FULL_CARD, fetchFullCard);
  yield takeEvery(FETCH_CARDS_FROM_LIST, fetchCardsFromListCancellable);
  yield takeEvery(FETCH_CATALOGUE_CLEAN_UP, cleanCards);
  yield takeEvery(UI__SWITCH_PRODUCT_PREFERENCE, cleanFetchingCards);
}
