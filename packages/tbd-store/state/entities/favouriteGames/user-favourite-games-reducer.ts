import {
  FETCH_USER_FAVOURITE_GAMES_SUCCESS,
  ADD_USER_FAVOURITE_GAME_SUCCESS,
  ADD_USER_FAVOURITE_GAME_FAILURE,
  REMOVE_USER_FAVOURITE_GAME_SUCCESS,
  REMOVE_USER_FAVOURITE_GAME_FAILURE,
  FetchUserFavouriteGamesSuccessAction,
  AddUserFavouriteGameSuccessAction,
  AddUserFavouriteGameFailureAction,
  RemoveUserFavouriteGameSuccessAction,
  RemoveUserFavouriteGameFailureAction,
  CLEAR_USER_FAVOURITE_GAMES_ERROR,
  ClearUserFavouriteGamesErrorAction,
} from "../../../actions/user-favourite-games";

export type UserFavouriteGamesState = {
  favouriteGameIds: string[];
  error: string | null;
  lastErrorTimestamp: number | null;
  lastErrorGameId: string | null; // Track which game caused the error
};

const initialState: UserFavouriteGamesState = {
  favouriteGameIds: [],
  error: null,
  lastErrorTimestamp: null,
  lastErrorGameId: null,
};

type UserFavouriteGamesActions =
  | FetchUserFavouriteGamesSuccessAction
  | AddUserFavouriteGameSuccessAction
  | AddUserFavouriteGameFailureAction
  | RemoveUserFavouriteGameSuccessAction
  | RemoveUserFavouriteGameFailureAction
  | ClearUserFavouriteGamesErrorAction;

export function userFavouriteGamesReducer(
  state = initialState,
  action: UserFavouriteGamesActions,
): UserFavouriteGamesState {
  switch (action.type) {
    case FETCH_USER_FAVOURITE_GAMES_SUCCESS:
      return {
        ...state,
        favouriteGameIds: action.payload.favouriteGameIds,
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      };

    case ADD_USER_FAVOURITE_GAME_SUCCESS:
      return {
        ...state,
        favouriteGameIds: [...state.favouriteGameIds, action.payload.gameId],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      };

    case ADD_USER_FAVOURITE_GAME_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        lastErrorTimestamp: Date.now(),
        lastErrorGameId: action.payload.gameId,
      };

    case REMOVE_USER_FAVOURITE_GAME_SUCCESS:
      return {
        ...state,
        favouriteGameIds: state.favouriteGameIds.filter((id) => id !== action.payload.gameId),
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      };

    case REMOVE_USER_FAVOURITE_GAME_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        lastErrorTimestamp: Date.now(),
        lastErrorGameId: action.payload.gameId,
      };

    case CLEAR_USER_FAVOURITE_GAMES_ERROR:
      return {
        ...state,
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      };

    default:
      return state;
  }
}
