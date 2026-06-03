import { SagaIterator } from "redux-saga";
import { call, ForkEffect, put, select, takeLatest } from "redux-saga/effects";

import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService, { CatalogueServiceLayout } from "../services/catalogue/catalogue-service";
import {
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueFailureAction,
  FetchCatalogueSuccessAction,
  FetchFilteredSelectableItemsAction,
  FETCH_FILTERED_SELECTABLE_ITEMS,
} from "../actions/catalogue";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";

const getContextForBFF = createContextForBFFSelector();

/**
 * Generator function to fetch all URNs and dispatch the output
 *
 * @param urns The list of URNs to fetch
 */
export function* fetchFilteredCardGroup(action: FetchFilteredSelectableItemsAction): SagaIterator {
  const { userPreferences, productExclusions, experiments, throttleOverrides }: ReturnType<typeof getContextForBFF> =
    yield select((state: ApplicationState) => getContextForBFF(state.entities, state.router));

  const { urn, filterBy } = action.payload;

  try {
    const payload: CatalogueServiceLayout = yield call(
      catalogueService.getFilteredSelectableItems,
      urn,
      filterBy.country,
      userPreferences,
      productExclusions,
      experiments,
      throttleOverrides,
    );

    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload,
    });
  } catch (e) {
    if (e instanceof Error) {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error: e },
      });
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { error: new Error(`Unknown error ${e}`) },
      });
    }
  }
}

export function* selectableItemsFilteredSaga(): IterableIterator<ForkEffect> {
  yield takeLatest(FETCH_FILTERED_SELECTABLE_ITEMS, fetchFilteredCardGroup);
}
