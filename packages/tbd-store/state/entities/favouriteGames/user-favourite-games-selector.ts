import { UserFavouriteGamesState } from "./user-favourite-games-reducer";

export const getFavouriteGameIds = (state: UserFavouriteGamesState): string[] => state.favouriteGameIds;

export const isGameFavourite = (state: UserFavouriteGamesState, gameId: string): boolean =>
  state.favouriteGameIds.includes(gameId);
