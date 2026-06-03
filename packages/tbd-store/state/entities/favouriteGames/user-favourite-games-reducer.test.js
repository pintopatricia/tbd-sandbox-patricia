import {
  FETCH_USER_FAVOURITE_GAMES_SUCCESS,
  ADD_USER_FAVOURITE_GAME_SUCCESS,
  ADD_USER_FAVOURITE_GAME_FAILURE,
  REMOVE_USER_FAVOURITE_GAME_SUCCESS,
  REMOVE_USER_FAVOURITE_GAME_FAILURE,
  CLEAR_USER_FAVOURITE_GAMES_ERROR,
} from "../../../actions/user-favourite-games";
import { userFavouriteGamesReducer } from "./user-favourite-games-reducer";

const initialStateMock = {
  favouriteGameIds: [],
  error: null,
  lastErrorTimestamp: null,
  lastErrorGameId: null,
};

const stateMockWithGames = {
  favouriteGameIds: ["game1", "game2", "game3"],
  error: null,
  lastErrorTimestamp: null,
  lastErrorGameId: null,
};

const stateMockWithError = {
  favouriteGameIds: ["game1", "game2"],
  error: "Failed to add game",
  lastErrorTimestamp: 123456789,
  lastErrorGameId: "game3",
};

describe('"userFavouriteGames" reducer', () => {
  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(123456789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("when don't have any action type or the action is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = userFavouriteGamesReducer(undefined, {});
      expect(state).toEqual(initialStateMock);
    });

    it("must return the current state if action type is unknown", () => {
      const state = userFavouriteGamesReducer(stateMockWithGames, { type: "UNKNOWN_ACTION" });
      expect(state).toEqual(stateMockWithGames);
    });
  });

  describe("when action type is FETCH_USER_FAVOURITE_GAMES_SUCCESS", () => {
    it("should set the favouriteGameIds from payload", () => {
      const action = {
        type: FETCH_USER_FAVOURITE_GAMES_SUCCESS,
        payload: {
          favouriteGameIds: ["game1", "game2", "game3"],
        },
      };

      const state = userFavouriteGamesReducer(initialStateMock, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2", "game3"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should replace existing favouriteGameIds with new ones", () => {
      const action = {
        type: FETCH_USER_FAVOURITE_GAMES_SUCCESS,
        payload: {
          favouriteGameIds: ["game4", "game5"],
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithGames, action);

      expect(state).toEqual({
        favouriteGameIds: ["game4", "game5"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should clear error state when fetch succeeds", () => {
      const action = {
        type: FETCH_USER_FAVOURITE_GAMES_SUCCESS,
        payload: {
          favouriteGameIds: ["game1", "game2"],
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithError, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });
  });

  describe("when action type is ADD_USER_FAVOURITE_GAME_SUCCESS", () => {
    it("should add a new gameId to the favouriteGameIds array", () => {
      const action = {
        type: ADD_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId: "game4",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithGames, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2", "game3", "game4"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should add gameId to empty array", () => {
      const action = {
        type: ADD_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId: "game1",
        },
      };

      const state = userFavouriteGamesReducer(initialStateMock, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should clear error state when add succeeds", () => {
      const action = {
        type: ADD_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId: "game3",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithError, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2", "game3"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });
  });

  describe("when action type is ADD_USER_FAVOURITE_GAME_FAILURE", () => {
    it("should set error state with gameId and timestamp", () => {
      const action = {
        type: ADD_USER_FAVOURITE_GAME_FAILURE,
        payload: {
          gameId: "game4",
          product: "arcade",
          error: "Failed to add game game4 to favourites",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithGames, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2", "game3"],
        error: "Failed to add game game4 to favourites",
        lastErrorTimestamp: 123456789,
        lastErrorGameId: "game4",
      });
    });

    it("should update error state when a new failure occurs", () => {
      const action = {
        type: ADD_USER_FAVOURITE_GAME_FAILURE,
        payload: {
          gameId: "game5",
          product: "arcade",
          error: "Failed to add game game5 to favourites",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithError, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2"],
        error: "Failed to add game game5 to favourites",
        lastErrorTimestamp: 123456789,
        lastErrorGameId: "game5",
      });
    });
  });

  describe("when action type is REMOVE_USER_FAVOURITE_GAME_SUCCESS", () => {
    it("should remove the gameId from the favouriteGameIds array", () => {
      const action = {
        type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId: "game2",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithGames, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game3"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should return unchanged favouriteGameIds if gameId is not in the array", () => {
      const action = {
        type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId: "game99",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithGames, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2", "game3"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should handle removing from empty array", () => {
      const action = {
        type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId: "game1",
        },
      };

      const state = userFavouriteGamesReducer(initialStateMock, action);

      expect(state).toEqual({
        favouriteGameIds: [],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should clear error state when remove succeeds", () => {
      const action = {
        type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId: "game1",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithError, action);

      expect(state).toEqual({
        favouriteGameIds: ["game2"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });
  });

  describe("when action type is REMOVE_USER_FAVOURITE_GAME_FAILURE", () => {
    it("should set error state with gameId and timestamp", () => {
      const action = {
        type: REMOVE_USER_FAVOURITE_GAME_FAILURE,
        payload: {
          gameId: "game2",
          product: "arcade",
          error: "Failed to remove game game2 from favourites",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithGames, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2", "game3"],
        error: "Failed to remove game game2 from favourites",
        lastErrorTimestamp: 123456789,
        lastErrorGameId: "game2",
      });
    });

    it("should update error state when a new failure occurs", () => {
      const action = {
        type: REMOVE_USER_FAVOURITE_GAME_FAILURE,
        payload: {
          gameId: "game1",
          product: "arcade",
          error: "Failed to remove game game1 from favourites",
        },
      };

      const state = userFavouriteGamesReducer(stateMockWithError, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2"],
        error: "Failed to remove game game1 from favourites",
        lastErrorTimestamp: 123456789,
        lastErrorGameId: "game1",
      });
    });
  });

  describe("when action type is CLEAR_USER_FAVOURITE_GAMES_ERROR", () => {
    it("should clear error state while preserving favouriteGameIds", () => {
      const action = {
        type: CLEAR_USER_FAVOURITE_GAMES_ERROR,
      };

      const state = userFavouriteGamesReducer(stateMockWithError, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should have no effect on state that already has no error", () => {
      const action = {
        type: CLEAR_USER_FAVOURITE_GAMES_ERROR,
      };

      const state = userFavouriteGamesReducer(stateMockWithGames, action);

      expect(state).toEqual({
        favouriteGameIds: ["game1", "game2", "game3"],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });

    it("should clear error state on initial state", () => {
      const action = {
        type: CLEAR_USER_FAVOURITE_GAMES_ERROR,
      };

      const state = userFavouriteGamesReducer(initialStateMock, action);

      expect(state).toEqual({
        favouriteGameIds: [],
        error: null,
        lastErrorTimestamp: null,
        lastErrorGameId: null,
      });
    });
  });
});
