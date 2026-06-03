import { call, debounce, ForkEffect, put, select, takeLatest } from "redux-saga/effects";
import { codecs } from "@ppb/tbd-urn-codecs";
import { SagaIterator } from "redux-saga";
import URN from "../state/layout/URN";
import { ApplicationState } from "../state/ApplicationState.types";
import catalogueService, { CatalogueServiceLayout } from "../services/catalogue/catalogue-service";
import gamingGlobalSearch from "../services/gaming-global-search";
import {
  UI__SEARCH_INPUT_CHANGE,
  NETWORK__FETCH_SEARCH_RESULTS_SUCCESS,
  UI__FETCH_MORE_SEARCH_RESULTS,
  DispatchMoreSearchResults,
  SearchInputChangeAction,
  FetchSearchResultsSuccessAction,
  UI__DELETE_ITEMS_FROM_SEARCH_RESULTS,
  DeleteGamesFromSearchResults,
} from "../actions/browse";
import { INPUT_LENGTH_SEARCH_TRIGGER, FILLED_CARDS_PER_CARD_GROUP } from "../config/common-config";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import {
  FETCH_CATALOGUE_FAILURE,
  FETCH_CATALOGUE_SUCCESS,
  FetchCatalogueFailureAction,
  FetchCatalogueSuccessAction,
} from "../actions/catalogue";
import { createPartialCardsBySearchCardGroupSelector } from "../state/layout/views/browse-view/browse-view-selectors";
import { createContextForBFFSelector } from "../state/entities/isomorphic-selectors";
import { getOverridenThrottles } from "../state/entities/throttles/throttles-selectors";
import { SearchResult } from "../state/layout/views/browse-view/Browse.types";
import { BrowseTab } from "../state/layout/views/browse-view/browse-view-reducer";

const DISPLAY_INITIAL_SEARCH_RESULTS_GAMES = 8;
const FETCH_NEXT_PARTIALS_SEARCH_RESULTS = 4;

const getContextForBFF = createContextForBFFSelector();

export function* fetchSearchResults(action: SearchInputChangeAction): SagaIterator {
  if (action.payload.text.length >= INPUT_LENGTH_SEARCH_TRIGGER) {
    if (action.payload.urn === codecs.browseView.encode(BrowseTab.Sports).uid || !action.payload.urn) {
      const {
        userPreferences,
        productExclusions,
        experiments,
        throttleOverrides,
      }: ReturnType<typeof getContextForBFF> = yield select((state: ApplicationState) =>
        getContextForBFF(state.entities, state.router),
      );

      try {
        const searchResults: SearchResult = yield call(
          catalogueService.getSearchResults,
          action.payload.text,
          userPreferences,
          productExclusions,
          experiments,
          throttleOverrides,
        );

        yield put<FetchSearchResultsSuccessAction>({
          type: NETWORK__FETCH_SEARCH_RESULTS_SUCCESS,
          payload: {
            urn: action.payload.urn,
            results: searchResults,
          },
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }
    } else if (action.payload.urn === codecs.browseView.encode(BrowseTab.Gaming).uid) {
      try {
        const { localeCode, jurisdiction } = yield select(getUserDetails);
        const throttleOverrides = yield select((state: ApplicationState) => getOverridenThrottles(state.entities));

        const searchResult: SearchResult = yield call(
          gamingGlobalSearch.getGamingSearchResults,
          action.payload.text,
          localeCode,
          jurisdiction?.jurisdiction,
        );
        yield put<FetchSearchResultsSuccessAction>({
          type: NETWORK__FETCH_SEARCH_RESULTS_SUCCESS,
          payload: {
            urn: action.payload.urn,
            results: searchResult,
          },
        });

        const cardsToRequest = searchResult.items
          .slice(0, DISPLAY_INITIAL_SEARCH_RESULTS_GAMES + (searchResult.items.length % 2))
          .map((item) => item.urn);

        const router = yield select((state: ApplicationState) => state.router);

        const payload = yield call(
          catalogueService.getCards,
          cardsToRequest,
          FILLED_CARDS_PER_CARD_GROUP,
          undefined,
          undefined,
          undefined,
          throttleOverrides,
          router,
          undefined,
          undefined,
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
            payload: {
              error: new Error(`Unknown error ${e}`),
            },
          });
        }
      }
    }
  }
}

export function* fetchMoreForSearchResults(action: DispatchMoreSearchResults): SagaIterator {
  const getPartialCardsByCardGroup = createPartialCardsBySearchCardGroupSelector();
  const partialUrns = yield select((state: ApplicationState) =>
    getPartialCardsByCardGroup(state, action.payload.urn, FETCH_NEXT_PARTIALS_SEARCH_RESULTS),
  );
  const {
    userPreferences,
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  }: ReturnType<typeof getContextForBFF> = yield select((state: ApplicationState) =>
    getContextForBFF(state.entities, state.router),
  );

  if (!partialUrns.length) return;

  try {
    const payload: CatalogueServiceLayout = yield call(
      catalogueService.getCards,
      partialUrns,
      FILLED_CARDS_PER_CARD_GROUP,
      userPreferences,
      productExclusions,
      experiments,
      throttleOverrides,
      router,
      undefined,
      undefined,
    );

    const cards = payload.data.Game || [];
    const returnedURNs = cards.map((game) => game.urn);
    const notReturnedURNs = partialUrns.filter((urn: URN) => !returnedURNs.includes(urn));

    if (notReturnedURNs.length) {
      yield put<DeleteGamesFromSearchResults>({
        type: UI__DELETE_ITEMS_FROM_SEARCH_RESULTS,
        payload: {
          urn: action.payload.urn,
          itemsUrnsToDelete: notReturnedURNs,
        },
      });
    }
    if (returnedURNs?.length) {
      yield put<FetchCatalogueSuccessAction>({
        type: FETCH_CATALOGUE_SUCCESS,
        payload,
      });
    }

    // if we get 0 elements, we immediately want to fetch the next partial set
    // if we get only 1 element back, we also want to fetch immediately as we could be on the last element of the swimlane
    // // and would lose the ability to fetch more after that
    if (returnedURNs?.length < 2) {
      yield put<DispatchMoreSearchResults>({
        type: UI__FETCH_MORE_SEARCH_RESULTS,
        payload: {
          urn: action.payload.urn,
        },
      });
    }
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

export function* fetchSearchResultsSaga(): IterableIterator<ForkEffect> {
  yield debounce(400, UI__SEARCH_INPUT_CHANGE, fetchSearchResults);
  yield takeLatest(UI__FETCH_MORE_SEARCH_RESULTS, fetchMoreForSearchResults);
}
