import type { SagaIterator } from "redux-saga";
import { call, put, select, takeEvery, takeLeading } from "redux-saga/effects";

import { FETCH_CATALOGUE_SUCCESS, type FetchCatalogueSuccessAction } from "../actions";
import {
  DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS,
  SET_FAVOURITE_MARKET_MUTATION_FAILURE,
  SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS,
  SET_FAVOURITE_MARKET_MUTATION_SUCCESS,
  UI__FAVOURITE_MARKETS_LIMIT_REACHED,
  UI__FAVOURITE_MARKETS_LIMIT_REACHED_MESSAGE_CLOSE,
  UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
  type DeleteFavouriteMarketsNavigationTabsAction,
  type FavouriteMarketsLimitReachedAction,
  type FavouriteMarketsLimitReachedMessageCloseAction,
  type FavouriteMarketsToggleFavouriteAction,
  type SetFavouriteMarketMutationFailureAction,
  type SetFavouriteMarketMutationInProgressAction,
  type SetFavouriteMarketMutationSuccessAction,
} from "../actions/favourite-markets";
import { UI__MESSAGING_REMOVE, type MessagingUIRemove } from "../actions/messaging";
import type { FavouriteMarketsCountMetadata } from "../clients/catalogue/catalogue-response-types";
import catalogueService from "../services/catalogue/catalogue-service";
import type { SetFavouriteMarketMutationResult } from "../services/catalogue/favourite-markets-mapper";
import type { ApplicationState, ThrottleOverrides } from "../state";
import { getOverridenThrottles, MessageCode } from "../state";

function* handleSetFavouriteMarketSoftError(softError: string): SagaIterator {
  switch (softError) {
    case "LIMIT_EXCEEDED":
      yield put<FavouriteMarketsLimitReachedAction>({ type: UI__FAVOURITE_MARKETS_LIMIT_REACHED });

      break;
    default:
      break;
  }
}

const isLimitReached = (metadatas: FavouriteMarketsCountMetadata[]): boolean =>
  metadatas.some((metadata): boolean => metadata.currentCount >= metadata.limit);

function* handleSetFavouriteMarketUpdate(action: FavouriteMarketsToggleFavouriteAction): SagaIterator {
  yield put<SetFavouriteMarketMutationInProgressAction>({ type: SET_FAVOURITE_MARKET_MUTATION_IN_PROGRESS });

  const { contentSectionURN, isFavourite, favouriteMarketsURN } = action.payload;
  const throttleOverrides = yield select(
    (state: ApplicationState): ThrottleOverrides => getOverridenThrottles(state.entities),
  );

  try {
    const payload: SetFavouriteMarketMutationResult = yield call(
      catalogueService.setFavouriteMarket,
      contentSectionURN,
      isFavourite,
      throttleOverrides,
    );

    yield put<DeleteFavouriteMarketsNavigationTabsAction>({ type: DELETE_FAVOURITE_MARKETS_NAVIGATION_TABS });

    yield put<FetchCatalogueSuccessAction>({ type: FETCH_CATALOGUE_SUCCESS, payload });

    if (payload.softError) {
      yield call(handleSetFavouriteMarketSoftError, payload.softError);
    }

    if (payload.data.FavouriteMarketsCountMetadata && isLimitReached(payload.data.FavouriteMarketsCountMetadata)) {
      yield put<FavouriteMarketsLimitReachedAction>({ type: UI__FAVOURITE_MARKETS_LIMIT_REACHED });
    }

    yield put<SetFavouriteMarketMutationSuccessAction>({ type: SET_FAVOURITE_MARKET_MUTATION_SUCCESS });
  } catch (error) {
    yield put<FavouriteMarketsToggleFavouriteAction>({
      type: UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE,
      payload: { contentSectionURN, isFavourite: !isFavourite, favouriteMarketsURN },
    });

    yield put<SetFavouriteMarketMutationFailureAction>({
      type: SET_FAVOURITE_MARKET_MUTATION_FAILURE,
      payload: { error: `${error}` },
    });
  }
}

function* handleFavouriteMarketsSnackbarMessage(action: MessagingUIRemove): SagaIterator {
  if (action.payload.code === MessageCode.FAVOURITE_MARKETS_LIMIT_REACHED) {
    yield put<FavouriteMarketsLimitReachedMessageCloseAction>({
      type: UI__FAVOURITE_MARKETS_LIMIT_REACHED_MESSAGE_CLOSE,
    });
  }
}

export function* favouriteMarketsSaga(): SagaIterator {
  yield takeLeading(UI__FAVOURITE_MARKETS_TOGGLE_FAVOURITE, handleSetFavouriteMarketUpdate);
  yield takeEvery(UI__MESSAGING_REMOVE, handleFavouriteMarketsSnackbarMessage);
}
