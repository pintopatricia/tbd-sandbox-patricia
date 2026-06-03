import { SagaIterator } from "redux-saga";
import { takeLatest, put, select, call } from "redux-saga/effects";
import { RouterState } from "../state/router/RouterState.types";
import { ApplicationState } from "../state/ApplicationState.types";
import {
  FETCH_CATALOGUE_SUCCESS,
  PageLoadSuccessAction,
  PAGE_LOAD_SUCCESS,
  FetchCatalogueSuccessAction,
} from "../actions/catalogue";
import { PUSH } from "../actions/router";
import { createFindViewByURNSelector } from "../state/layout/views/view-selectors";
import { generateLayoutSnapshot } from "../state/layout-snapshot";

const getViewByURN = createFindViewByURNSelector();

/**
 * This will be called in two situations: PUSH (a route update) or
 * FETCH_CATALOGUE_SUCCESS from view queries. If the store state does not have
 * the view we just ignore it.
 */
export function* handleNavigation(): SagaIterator {
  const router: RouterState = yield select((state: ApplicationState) => state.router);
  const { currentUrn } = router;

  if (!currentUrn) {
    return;
  }

  const view = yield select((state: ApplicationState) => getViewByURN(state.layouts.views, currentUrn));

  if (view) {
    yield put<PageLoadSuccessAction>({
      type: PAGE_LOAD_SUCCESS,
      payload: currentUrn,
    });
  }
}

/**
 * This will be called everytime BFF responds. Either for a View or Card
 * query. We only want to intercept the View queries here.
 */
export function* handleFetchCatalogueSuccess(action: FetchCatalogueSuccessAction): SagaIterator {
  const router: RouterState = yield select((state: ApplicationState) => state.router);
  const { currentUrn } = router;

  if (currentUrn) {
    // Save/Update the current view's snapshot from the layout
    generateLayoutSnapshot(action.payload, currentUrn);
  }

  // Router only exists on View queries
  if (!action.payload.router) {
    return;
  }

  yield call(handleNavigation);
}

export function* pageLoadSaga(): SagaIterator {
  yield takeLatest(PUSH, handleNavigation);
  yield takeLatest(FETCH_CATALOGUE_SUCCESS, handleFetchCatalogueSuccess);
}
