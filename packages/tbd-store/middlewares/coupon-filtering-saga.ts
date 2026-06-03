import { SagaIterator } from "redux-saga";
import { call, ForkEffect, put, takeEvery, select } from "redux-saga/effects";

import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService from "../services/catalogue/catalogue-service";
import {
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueFailureAction,
  FetchCatalogueSuccessAction,
  FETCH_FILTERED_COUPON,
  FetchFilteredCouponAction,
} from "../actions/catalogue";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";

const FILLED_CARDS_PER_FILTERED_CARDGROUP = 3; // allmatchesraces view allows for 3 coupon cards to be visible on load

const getContextForBFF = createContextForBFFSelector();

/**
 * Generator function to fetch all URNs and dispatch the output
 *
 * @param urns The list of URNs to fetch
 */
export function* fetchFilteredCard(action: FetchFilteredCouponAction): SagaIterator {
  const {
    userPreferences,
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  }: ReturnType<typeof getContextForBFF> = yield select((state: ApplicationState) =>
    getContextForBFF(state.entities, state.router),
  );
  const { urn, sortBy, filterBy } = action.payload;

  try {
    const payload = yield call(
      catalogueService.getFilteredCoupon,
      urn,
      filterBy,
      sortBy,
      FILLED_CARDS_PER_FILTERED_CARDGROUP,
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
  } catch (e) {
    if (e instanceof Error) {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: {
          error: e,
        },
      });
    } else {
      yield put<FetchCatalogueFailureAction>({
        type: FETCH_CATALOGUE_FAILURE,
        payload: {
          error: new Error(`Unknown error ${e}`),
        },
      });
    }
  }
}

export function* couponFilteredSaga(): IterableIterator<ForkEffect> {
  yield takeEvery(FETCH_FILTERED_COUPON, fetchFilteredCard);
}
