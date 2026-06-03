import { ISagaModule } from "redux-dynamic-modules-saga";
import { ApplicationState } from "../state/ApplicationState.types";
import { userFavouriteGamesSaga } from "../middlewares/user-favourite-games-saga";
import { userFavouriteGamesReducer } from "../state/entities/favouriteGames/user-favourite-games-reducer";
import { FETCH_USER_FAVOURITE_GAMES, FetchUserFavouriteGamesAction } from "../actions/user-favourite-games";

export const getUserFavouriteGamesModule = (): ISagaModule<ApplicationState> => ({
  id: "user-favourite-games-module",
  reducerMap: {
    userFavouriteGames: userFavouriteGamesReducer,
  } as any,
  middlewares: [],
  sagas: [userFavouriteGamesSaga],
  initialActions: [
    {
      type: FETCH_USER_FAVOURITE_GAMES,
    } as FetchUserFavouriteGamesAction,
  ],
});
