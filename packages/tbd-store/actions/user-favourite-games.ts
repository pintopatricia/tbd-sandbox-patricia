// Action types
export const FETCH_USER_FAVOURITE_GAMES = "FETCH_USER_FAVOURITE_GAMES";
export const FETCH_USER_FAVOURITE_GAMES_SUCCESS = "FETCH_USER_FAVOURITE_GAMES_SUCCESS";
export const ADD_USER_FAVOURITE_GAME = "ADD_USER_FAVOURITE_GAME";
export const ADD_USER_FAVOURITE_GAME_SUCCESS = "ADD_USER_FAVOURITE_GAME_SUCCESS";
export const ADD_USER_FAVOURITE_GAME_FAILURE = "ADD_USER_FAVOURITE_GAME_FAILURE";
export const REMOVE_USER_FAVOURITE_GAME = "REMOVE_USER_FAVOURITE_GAME";
export const REMOVE_USER_FAVOURITE_GAME_SUCCESS = "REMOVE_USER_FAVOURITE_GAME_SUCCESS";
export const REMOVE_USER_FAVOURITE_GAME_FAILURE = "REMOVE_USER_FAVOURITE_GAME_FAILURE";
export const CLEAR_USER_FAVOURITE_GAMES_ERROR = "CLEAR_USER_FAVOURITE_GAMES_ERROR";

// Action types
export type FetchUserFavouriteGamesAction = {
  type: typeof FETCH_USER_FAVOURITE_GAMES;
};

export type FetchUserFavouriteGamesSuccessAction = {
  type: typeof FETCH_USER_FAVOURITE_GAMES_SUCCESS;
  payload: {
    favouriteGameIds: string[];
  };
};

export type AddUserFavouriteGameAction = {
  type: typeof ADD_USER_FAVOURITE_GAME;
  payload: {
    gameId: string;
    product: string;
    gameName?: string;
    gameProvider?: string;
    urn?: string;
    cardGroupUrn?: string;
    segmentedCardGroupUrn?: string;
  };
};

export type AddUserFavouriteGameSuccessAction = {
  type: typeof ADD_USER_FAVOURITE_GAME_SUCCESS;
  payload: {
    gameId: string;
    product: string;
  };
};

export type RemoveUserFavouriteGameAction = {
  type: typeof REMOVE_USER_FAVOURITE_GAME;
  payload: {
    gameId: string;
    product: string;
    gameName?: string;
    gameProvider?: string;
    urn?: string;
    cardGroupUrn?: string;
    segmentedCardGroupUrn?: string;
  };
};

export type RemoveUserFavouriteGameSuccessAction = {
  type: typeof REMOVE_USER_FAVOURITE_GAME_SUCCESS;
  payload: {
    gameId: string;
    product: string;
  };
};

export type AddUserFavouriteGameFailureAction = {
  type: typeof ADD_USER_FAVOURITE_GAME_FAILURE;
  payload: {
    gameId: string;
    product: string;
    error: string;
  };
};

export type RemoveUserFavouriteGameFailureAction = {
  type: typeof REMOVE_USER_FAVOURITE_GAME_FAILURE;
  payload: {
    gameId: string;
    product: string;
    error: string;
  };
};

// Action creators (optional, but helpful for components)
export const fetchUserFavouriteGames = (): FetchUserFavouriteGamesAction => ({
  type: FETCH_USER_FAVOURITE_GAMES,
});

export const addUserFavouriteGame = (gameId: string, product: string): AddUserFavouriteGameAction => ({
  type: ADD_USER_FAVOURITE_GAME,
  payload: { gameId, product },
});

export const removeUserFavouriteGame = (gameId: string, product: string): RemoveUserFavouriteGameAction => ({
  type: REMOVE_USER_FAVOURITE_GAME,
  payload: { gameId, product },
});

export type ClearUserFavouriteGamesErrorAction = {
  type: typeof CLEAR_USER_FAVOURITE_GAMES_ERROR;
};

export const clearUserFavouriteGamesError = (): ClearUserFavouriteGamesErrorAction => ({
  type: CLEAR_USER_FAVOURITE_GAMES_ERROR,
});
