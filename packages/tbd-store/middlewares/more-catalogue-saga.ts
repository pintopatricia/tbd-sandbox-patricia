import { SagaIterator } from "redux-saga";
import { call, ForkEffect, put, takeLatest, select } from "redux-saga/effects";

import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService, { CatalogueServiceLayout } from "../services/catalogue/catalogue-service";
import {
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_IN_PROGRESS,
  FETCH_CATALOGUE_SUCCESS,
  FETCH_MORE_CATALOGUE,
  FetchCatalogueFailureAction,
  FetchCatalogueInProgressAction,
  FetchCatalogueSuccessAction,
  FetchMoreCatalogueAction,
} from "../actions/catalogue";
import { FILLED_CARDS_PER_CARD_GROUP, FILLED_CARDS_PER_VIEW } from "../config/common-config";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";

const withBottomBar = false;
const withLeftSidebar = false;
const withRegulatoryData = false;
const withPageInfo = true;

const getContextForBFF = createContextForBFFSelector();

/**
 * Method that will try to request layout and dispatch the correct
 * actions for each state (success, in progress and failure)
 *
 * @param action Intercepted action
 */
export function* request(action: FetchMoreCatalogueAction): SagaIterator {
  const { urn, cursor, numberOfFilledCardsInView = FILLED_CARDS_PER_VIEW } = action.payload;

  const { userPreferences, productExclusions, experiments, throttleOverrides }: ReturnType<typeof getContextForBFF> =
    yield select((state: ApplicationState) => getContextForBFF(state.entities, state.router));

  try {
    yield put<FetchCatalogueInProgressAction>({
      type: FETCH_CATALOGUE_IN_PROGRESS,
      payload: urn,
    });

    const payload: CatalogueServiceLayout = yield call(
      catalogueService.getLayout,
      urn,
      FILLED_CARDS_PER_CARD_GROUP,
      numberOfFilledCardsInView,
      withBottomBar,
      withLeftSidebar,
      withRegulatoryData,
      withPageInfo,
      cursor,
      userPreferences,
      productExclusions,
      undefined,
      experiments,
      throttleOverrides,
    );

    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload: { ...payload, withPagination: true },
    });
  } catch (e) {
    let message = `Unknown error ${e}`;

    if (e instanceof Error) {
      message = e.message;
    }

    yield put<FetchCatalogueFailureAction>({
      type: FETCH_CATALOGUE_FAILURE,
      payload: {
        error: new Error(message),
      },
    });
  }
}

/**
 * Saga that takes every `FETCH_MORE_CATALOGUE` request and trigger the request
 */
export function* fetchMoreCatalogueSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(FETCH_MORE_CATALOGUE, request);
}
