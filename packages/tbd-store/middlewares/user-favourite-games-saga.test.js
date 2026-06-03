import setupSagaMocks from "../saga-jest-setup";
import { getUserDetails } from "../state/entities/user-details/user-details-selectors";
import { getFavouriteGames, addFavouriteGame, removeFavouriteGame } from "../services/user-favourite-games-service";
import {
  FETCH_USER_FAVOURITE_GAMES,
  FETCH_USER_FAVOURITE_GAMES_SUCCESS,
  ADD_USER_FAVOURITE_GAME,
  ADD_USER_FAVOURITE_GAME_SUCCESS,
  ADD_USER_FAVOURITE_GAME_FAILURE,
  REMOVE_USER_FAVOURITE_GAME,
  REMOVE_USER_FAVOURITE_GAME_SUCCESS,
  REMOVE_USER_FAVOURITE_GAME_FAILURE,
} from "../actions/user-favourite-games";

const STATE = {
  entities: {
    userDetails: {
      loggedIn: true,
    },
  },
};

jest.mock("../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(),
}));

jest.mock("../services/user-favourite-games-service", () => ({
  getFavouriteGames: jest.fn(),
  addFavouriteGame: jest.fn(),
  removeFavouriteGame: jest.fn(),
}));

const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

let putActions;
let stopSaga;
let advanceTimersByTime;
let getState;
let dispatch;

const startSaga = () => {
  let saga;

  jest.isolateModules(() => {
    ({ userFavouriteGamesSaga: saga } = require("./user-favourite-games-saga"));
  });

  ({ putActions, advanceTimersByTime, stopSaga, getState, dispatch } = setupSagaMocks(saga));

  getState.mockReturnValue(STATE);
};

const triggerFetchFavouriteGames = async () => {
  await putActions([
    {
      type: FETCH_USER_FAVOURITE_GAMES,
    },
  ]);

  await advanceTimersByTime(0);
};

const triggerAddFavouriteGame = async (gameId, product) => {
  await putActions([
    {
      type: ADD_USER_FAVOURITE_GAME,
      payload: {
        gameId,
        product,
      },
    },
  ]);

  await advanceTimersByTime(0);
};

const triggerRemoveFavouriteGame = async (gameId, product) => {
  await putActions([
    {
      type: REMOVE_USER_FAVOURITE_GAME,
      payload: {
        gameId,
        product,
      },
    },
  ]);

  await advanceTimersByTime(0);
};

describe("userFavouriteGamesSaga", () => {
  afterEach(() => {
    stopSaga();
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  describe("when FETCH_USER_FAVOURITE_GAMES triggers", () => {
    describe("and user is logged in", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: true });
      });

      it("should call getFavouriteGames service", async () => {
        const mockFavouriteGameIds = ["game1", "game2", "game3"];
        getFavouriteGames.mockResolvedValue(mockFavouriteGameIds);

        startSaga();
        await triggerFetchFavouriteGames();

        expect(getFavouriteGames).toHaveBeenCalledWith("arcade", "desktop");
      });

      it("should dispatch FETCH_USER_FAVOURITE_GAMES_SUCCESS", async () => {
        const mockFavouriteGameIds = ["game1", "game2", "game3"];
        getFavouriteGames.mockResolvedValue(mockFavouriteGameIds);

        startSaga();
        await triggerFetchFavouriteGames();

        expect(dispatch).toHaveBeenCalledWith({
          type: FETCH_USER_FAVOURITE_GAMES_SUCCESS,
          payload: {
            favouriteGameIds: mockFavouriteGameIds,
          },
        });
      });

      describe("and service throws an error", () => {
        it("should log warning and not dispatch success action", async () => {
          const error = new Error("Failed to fetch favourites");
          getFavouriteGames.mockRejectedValue(error);

          startSaga();
          await triggerFetchFavouriteGames();

          expect(consoleWarnSpy).toHaveBeenCalledWith(error);
          expect(dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
              type: FETCH_USER_FAVOURITE_GAMES_SUCCESS,
            }),
          );
        });
      });
    });

    describe("and user is not logged in", () => {
      beforeEach(() => {
        getUserDetails.mockReturnValue({ loggedIn: false });
      });

      it("should not call getFavouriteGames service", async () => {
        startSaga();
        await triggerFetchFavouriteGames();

        expect(getFavouriteGames).not.toHaveBeenCalled();
      });

      it("should not dispatch any action", async () => {
        startSaga();
        await triggerFetchFavouriteGames();

        expect(dispatch).not.toHaveBeenCalled();
      });
    });
  });

  describe("when ADD_USER_FAVOURITE_GAME triggers", () => {
    const gameId = "game1";
    const product = "arcade";

    it("should call addFavouriteGame service with correct parameters", async () => {
      addFavouriteGame.mockResolvedValue(undefined);

      startSaga();
      await triggerAddFavouriteGame(gameId, product);

      expect(addFavouriteGame).toHaveBeenCalledWith(gameId, product, "desktop");
    });

    it("should dispatch ADD_USER_FAVOURITE_GAME_SUCCESS", async () => {
      addFavouriteGame.mockResolvedValue(undefined);

      startSaga();
      await triggerAddFavouriteGame(gameId, product);

      expect(dispatch).toHaveBeenCalledWith({
        type: ADD_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId,
          product,
        },
      });
    });

    describe("when product has language code", () => {
      it("should trim language code from product in success action", async () => {
        addFavouriteGame.mockResolvedValue(undefined);

        startSaga();
        await triggerAddFavouriteGame(gameId, "gaming-de-de");

        expect(dispatch).toHaveBeenCalledWith({
          type: ADD_USER_FAVOURITE_GAME_SUCCESS,
          payload: {
            gameId,
            product: "gaming",
          },
        });
      });

      it("should trim language code from product in failure action", async () => {
        const error = new Error("Failed to add favourite");
        addFavouriteGame.mockRejectedValue(error);

        startSaga();
        await triggerAddFavouriteGame(gameId, "arcade-fr-fr");

        expect(dispatch).toHaveBeenCalledWith({
          type: ADD_USER_FAVOURITE_GAME_FAILURE,
          payload: {
            gameId,
            product: "arcade",
            error: `Failed to add game ${gameId} to favourites`,
          },
        });
      });
    });

    describe("when product is vegas-it or vegas-ro", () => {
      it("should not trim vegas-it product in success action", async () => {
        addFavouriteGame.mockResolvedValue(undefined);

        startSaga();
        await triggerAddFavouriteGame(gameId, "vegas-it");

        expect(dispatch).toHaveBeenCalledWith({
          type: ADD_USER_FAVOURITE_GAME_SUCCESS,
          payload: {
            gameId,
            product: "vegas-it",
          },
        });
      });

      it("should not trim vegas-ro product in success action", async () => {
        addFavouriteGame.mockResolvedValue(undefined);

        startSaga();
        await triggerAddFavouriteGame(gameId, "vegas-ro");

        expect(dispatch).toHaveBeenCalledWith({
          type: ADD_USER_FAVOURITE_GAME_SUCCESS,
          payload: {
            gameId,
            product: "vegas-ro",
          },
        });
      });

      it("should not trim vegas-it product in failure action", async () => {
        const error = new Error("Failed to add favourite");
        addFavouriteGame.mockRejectedValue(error);

        startSaga();
        await triggerAddFavouriteGame(gameId, "vegas-it");

        expect(dispatch).toHaveBeenCalledWith({
          type: ADD_USER_FAVOURITE_GAME_FAILURE,
          payload: {
            gameId,
            product: "vegas-it",
            error: `Failed to add game ${gameId} to favourites`,
          },
        });
      });
    });

    describe("and service throws an error", () => {
      it("should log warning and dispatch ADD_USER_FAVOURITE_GAME_FAILURE action", async () => {
        const error = new Error("Failed to add favourite");
        addFavouriteGame.mockRejectedValue(error);

        startSaga();
        await triggerAddFavouriteGame(gameId, product);

        expect(consoleWarnSpy).toHaveBeenCalledWith("Failed to add game to favourites:", error);
        expect(dispatch).toHaveBeenCalledWith({
          type: ADD_USER_FAVOURITE_GAME_FAILURE,
          payload: {
            gameId,
            product,
            error: "Failed to add game game1 to favourites",
          },
        });
        expect(dispatch).not.toHaveBeenCalledWith(
          expect.objectContaining({
            type: ADD_USER_FAVOURITE_GAME_SUCCESS,
          }),
        );
      });
    });
  });

  describe("when REMOVE_USER_FAVOURITE_GAME triggers", () => {
    const gameId = "game1";
    const product = "arcade";

    it("should call removeFavouriteGame service with correct parameters", async () => {
      removeFavouriteGame.mockResolvedValue(undefined);

      startSaga();
      await triggerRemoveFavouriteGame(gameId, product);

      expect(removeFavouriteGame).toHaveBeenCalledWith(gameId, product, "desktop");
    });

    it("should dispatch REMOVE_USER_FAVOURITE_GAME_SUCCESS", async () => {
      removeFavouriteGame.mockResolvedValue(undefined);

      startSaga();
      await triggerRemoveFavouriteGame(gameId, product);

      expect(dispatch).toHaveBeenCalledWith({
        type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
        payload: {
          gameId,
          product,
        },
      });
    });

    describe("when product has language code", () => {
      it("should trim language code from product in success action", async () => {
        removeFavouriteGame.mockResolvedValue(undefined);

        startSaga();
        await triggerRemoveFavouriteGame(gameId, "gaming-de-de");

        expect(dispatch).toHaveBeenCalledWith({
          type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
          payload: {
            gameId,
            product: "gaming",
          },
        });
      });

      it("should trim language code from product in failure action", async () => {
        const error = new Error("Failed to remove favourite");
        removeFavouriteGame.mockRejectedValue(error);

        startSaga();
        await triggerRemoveFavouriteGame(gameId, "arcade-es-es");

        expect(dispatch).toHaveBeenCalledWith({
          type: REMOVE_USER_FAVOURITE_GAME_FAILURE,
          payload: {
            gameId,
            product: "arcade",
            error: `Failed to remove game ${gameId} from favourites`,
          },
        });
      });
    });

    describe("when product is vegas-it or vegas-ro", () => {
      it("should not trim vegas-it product in success action", async () => {
        removeFavouriteGame.mockResolvedValue(undefined);

        startSaga();
        await triggerRemoveFavouriteGame(gameId, "vegas-it");

        expect(dispatch).toHaveBeenCalledWith({
          type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
          payload: {
            gameId,
            product: "vegas-it",
          },
        });
      });

      it("should not trim vegas-ro product in success action", async () => {
        removeFavouriteGame.mockResolvedValue(undefined);

        startSaga();
        await triggerRemoveFavouriteGame(gameId, "vegas-ro");

        expect(dispatch).toHaveBeenCalledWith({
          type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
          payload: {
            gameId,
            product: "vegas-ro",
          },
        });
      });

      it("should not trim vegas-it product in failure action", async () => {
        const error = new Error("Failed to remove favourite");
        removeFavouriteGame.mockRejectedValue(error);

        startSaga();
        await triggerRemoveFavouriteGame(gameId, "vegas-ro");

        expect(dispatch).toHaveBeenCalledWith({
          type: REMOVE_USER_FAVOURITE_GAME_FAILURE,
          payload: {
            gameId,
            product: "vegas-ro",
            error: `Failed to remove game ${gameId} from favourites`,
          },
        });
      });
    });

    describe("and service throws an error", () => {
      it("should log warning and dispatch REMOVE_USER_FAVOURITE_GAME_FAILURE action", async () => {
        const error = new Error("Failed to remove favourite");
        removeFavouriteGame.mockRejectedValue(error);

        startSaga();
        await triggerRemoveFavouriteGame(gameId, product);

        expect(consoleWarnSpy).toHaveBeenCalledWith("Failed to remove game from favourites:", error);
        expect(dispatch).toHaveBeenCalledWith({
          type: REMOVE_USER_FAVOURITE_GAME_FAILURE,
          payload: {
            gameId,
            product,
            error: "Failed to remove game game1 from favourites",
          },
        });
        expect(dispatch).not.toHaveBeenCalledWith(
          expect.objectContaining({
            type: REMOVE_USER_FAVOURITE_GAME_SUCCESS,
          }),
        );
      });
    });
  });
});
