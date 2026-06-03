import { call, debounce, ForkEffect, put, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService from "../services/catalogue/catalogue-service";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "../config/common-config";

import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";
import {
  FetchSearchBarResultsSuccessAction,
  NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS,
  SearchBarInputChangeAction,
  SearchBarResultsClearAction,
  UI__SEARCH_BAR_INPUT_CHANGE,
  UI__SEARCH_BAR_RESULTS_CLEAR,
} from "../actions/search-bar-state";
import { SearchBarStateResult } from "../state/layout/search-bar-state/SearchBarState.types";

const getContextForBFF = createContextForBFFSelector();

export function* fetchSearchBarResults(action: SearchBarInputChangeAction): SagaIterator {
  if (action.payload.text.length >= INPUT_LENGTH_SEARCH_TRIGGER) {
    const { userPreferences, productExclusions, experiments, throttleOverrides }: ReturnType<typeof getContextForBFF> =
      yield select((state: ApplicationState) => getContextForBFF(state.entities, state.router));

    try {
      const searchResults: SearchBarStateResult = yield call(
        catalogueService.getSearchResults,
        action.payload.text,
        userPreferences,
        productExclusions,
        experiments,
        throttleOverrides,
      );
      yield put<FetchSearchBarResultsSuccessAction>({
        type: NETWORK__FETCH_SEARCH_BAR_RESULTS_SUCCESS,
        payload: {
          urn: action.payload.urn,
          results: searchResults,
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  } else {
    yield put<SearchBarResultsClearAction>({
      type: UI__SEARCH_BAR_RESULTS_CLEAR,
      payload: { urn: action.payload.urn, text: action.payload.text },
    });
  }
}

export function* fetchSearchBarResultsSaga(): IterableIterator<ForkEffect> {
  yield debounce(400, UI__SEARCH_BAR_INPUT_CHANGE, fetchSearchBarResults);
}
