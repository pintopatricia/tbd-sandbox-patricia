import { call, debounce, ForkEffect, put, select, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import catalogueService from "../services/catalogue/catalogue-service";
import { INPUT_LENGTH_SEARCH_TRIGGER } from "../config/common-config";

import {
  AppendGamingSearchResultsAction,
  FetchGamingSearchResultsSuccessAction,
  FetchMoreGamingSearchResultsAction,
  FetchMoreGamingSearchResultsRequestAction,
  GamingSearchInputChangeAction,
  NETWORK__APPEND_GAMING_SEARCH_RESULTS,
  NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
  NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST,
  UI__GAMING__FETCH_MORE_SEARCH_RESULTS,
  UI__GAMING__SEARCH_INPUT_CHANGE,
} from "../actions/gaming-search";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../actions";
import { buildGamingSearchCardsLayout } from "../services/catalogue/cards-mapper";
import { GameCardNode, GamingSearchResultItem } from "../state/layout/gaming-search/GamingSearch.types";
import { ApplicationState } from "../state/ApplicationState.types";

const INITIAL_BATCH_SIZE = 30;
const NEXT_BATCH_SIZE = 30;

export function* fetchGamingSearchResults(action: GamingSearchInputChangeAction): SagaIterator {
  if (action.payload.text.length >= INPUT_LENGTH_SEARCH_TRIGGER) {
    try {
      const results = yield call(catalogueService.getGamingSearchResults, action.payload.text, INITIAL_BATCH_SIZE);

      const gamingSearchResults: GamingSearchResultItem[] = results.GamingSearch.edges.map((game: GameCardNode) => {
        const mappedResults: GamingSearchResultItem = {
          type: "GAMING_SEARCH_RESULT_ITEM",
          urn: game?.node.urn,
        };
        return mappedResults;
      });

      yield put<FetchGamingSearchResultsSuccessAction>({
        type: NETWORK__FETCH_GAMING_SEARCH_RESULTS_SUCCESS,
        payload: {
          urn: action.payload.urn,
          inputSearchTerm: action.payload.text,
          gamingSearchResults,
          hasNextPage: results.GamingSearch.pageInfo?.hasNextPage ?? false,
          endCursor: results.GamingSearch.pageInfo?.endCursor ?? null,
          totalCount: results.GamingSearch.totalCount ?? gamingSearchResults.length,
        },
      });

      const payload = buildGamingSearchCardsLayout(results);

      yield put<FetchCatalogueSuccessAction>({
        type: FETCH_CATALOGUE_SUCCESS,
        payload,
      });
    } catch (error) {
      console.warn(error);
    }
  }
}

export function* fetchMoreGamingSearchResults(action: FetchMoreGamingSearchResultsAction): SagaIterator {
  try {
    const state: ApplicationState = yield select();
    const gamingSearchState = state.layouts.gamingSearch[action.payload.urn];

    if (!gamingSearchState || !gamingSearchState.hasNextPage || gamingSearchState.isLoadingMore) {
      return;
    }

    yield put<FetchMoreGamingSearchResultsRequestAction>({
      type: NETWORK__FETCH_MORE_GAMING_SEARCH_RESULTS_REQUEST,
      payload: {
        urn: action.payload.urn,
      },
    });

    const results = yield call(
      catalogueService.getGamingSearchResults,
      gamingSearchState.inputSearchTerm,
      NEXT_BATCH_SIZE,
      gamingSearchState.endCursor || undefined,
    );

    const gamingSearchResults: GamingSearchResultItem[] = results.GamingSearch.edges.map((game: GameCardNode) => ({
      type: "GAMING_SEARCH_RESULT_ITEM",
      urn: game?.node.urn,
    }));

    yield put<AppendGamingSearchResultsAction>({
      type: NETWORK__APPEND_GAMING_SEARCH_RESULTS,
      payload: {
        urn: action.payload.urn,
        gamingSearchResults,
        hasNextPage: results.GamingSearch.pageInfo?.hasNextPage ?? false,
        endCursor: results.GamingSearch.pageInfo?.endCursor ?? null,
      },
    });

    const payload = buildGamingSearchCardsLayout(results);

    yield put<FetchCatalogueSuccessAction>({
      type: FETCH_CATALOGUE_SUCCESS,
      payload,
    });
  } catch (error) {
    console.warn(error);
  }
}

export function* fetchGamingSearchResultsSaga(): IterableIterator<ForkEffect> {
  yield debounce(400, UI__GAMING__SEARCH_INPUT_CHANGE, fetchGamingSearchResults);
  yield takeLatest(UI__GAMING__FETCH_MORE_SEARCH_RESULTS, fetchMoreGamingSearchResults);
}
