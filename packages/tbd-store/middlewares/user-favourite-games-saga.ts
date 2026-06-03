import { call, put, takeLatest, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { getFavouriteGames, addFavouriteGame, removeFavouriteGame } from "../services/user-favourite-games-service";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import {
  FETCH_USER_FAVOURITE_GAMES,
  FETCH_USER_FAVOURITE_GAMES_SUCCESS,
  ADD_USER_FAVOURITE_GAME,
  ADD_USER_FAVOURITE_GAME_SUCCESS,
  ADD_USER_FAVOURITE_GAME_FAILURE,
  REMOVE_USER_FAVOURITE_GAME,
  REMOVE_USER_FAVOURITE_GAME_SUCCESS,
  REMOVE_USER_FAVOURITE_GAME_FAILURE,
  FetchUserFavouriteGamesSuccessAction,
  AddUserFavouriteGameAction,
  AddUserFavouriteGameSuccessAction,
  AddUserFavouriteGameFailureAction,
  RemoveUserFavouriteGameAction,
  RemoveUserFavouriteGameSuccessAction,
  RemoveUserFavouriteGameFailureAction,
} from "../actions/user-favourite-games";
import {
  incrementFavouritesNotification,
  decrementFavouritesNotification,
} from "../helpers/gaming-favourites-notifications";

/**
 * Trims the language suffix from product names, except for vegas-it and vegas-ro
 *
 * @param product - The product name (e.g., "gaming-de-de", "vegas-it", "arcade")
 * @returns The trimmed product name (e.g., "gaming", "vegas-it", "arcade")
 */
export function trimProductLanguage(product: string): string {
  const vegasProducts = ["vegas-it", "vegas-ro"];

  if (vegasProducts.some((p) => p === product)) {
    return product;
  }

  return product.split("-")[0];
}

/**
 * Fetch user's favourite games on page load
 */
export function* fetchUserFavouriteGames(): SagaIterator {
  const { loggedIn } = yield select(getUserDetails);

  if (!loggedIn) {
    return;
  }

  try {
    const favouriteGameIds: string[] = yield call(getFavouriteGames, "arcade", "desktop");

    yield put<FetchUserFavouriteGamesSuccessAction>({
      type: FETCH_USER_FAVOURITE_GAMES_SUCCESS,
      payload: {
        favouriteGameIds,
      },
    });
  } catch (error) {
    console.warn(error);
  }
}

/**
 * Add a game to user's favourites
 */
export function* addUserFavouriteGame(action: AddUserFavouriteGameAction): SagaIterator {
  const { gameId, product } = action.payload;
  const trimmedProduct = trimProductLanguage(product);

  try {
    yield call(addFavouriteGame, gameId, trimmedProduct, "desktop");

    incrementFavouritesNotification(gameId);

    yield put<AddUserFavouriteGameSuccessAction>({
      type: ADD_USER_FAVOURITE_GAME_SUCCESS,
      payload: {
        gameId,
        product: trimmedProduct,
      },
    });
  } catch (error) {
    console.warn("Failed to add game to favourites:", error);

    yield put<AddUserFavouriteGameFailureAction>({
      type: ADD_USER_FAVOURITE_GAME_FAILURE,
      payload: {
        gameId,
        product: trimmedProduct,
        error: `Failed to add game ${gameId} to favourites`,
      },
    });
  }
}

/**
 * Remove a game from user's favourites
 */
export function* removeUserFavouriteGame(action: RemoveUserFavouriteGameAction): SagaIterator {
  const { gameId, product } = action.payload;
  const trimmedProduct = trimProductLanguage(product);

  try {
    yield call(removeFavouriteGame, gameId, trimmedProduct, "desktop");

    decrementFavouritesNotification(gameId);

    yield put<RemoveUserFavouriteGameSuccessAction>({
      type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
      payload: {
        gameId,
        product: trimmedProduct,
      },
    });
  } catch (error) {
    console.warn("Failed to remove game from favourites:", error);

    yield put<RemoveUserFavouriteGameFailureAction>({
      type: REMOVE_USER_FAVOURITE_GAME_FAILURE,
      payload: {
        gameId,
        product: trimmedProduct,
        error: `Failed to remove game ${gameId} from favourites`,
      },
    });
  }
}

/**
 * Root saga for user favourite games
 */
export function* userFavouriteGamesSaga(): SagaIterator {
  yield takeLatest(FETCH_USER_FAVOURITE_GAMES, fetchUserFavouriteGames);
  yield takeLatest(ADD_USER_FAVOURITE_GAME, addUserFavouriteGame);
  yield takeLatest(REMOVE_USER_FAVOURITE_GAME, removeUserFavouriteGame);
}
