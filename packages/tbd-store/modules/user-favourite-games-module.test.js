import { FETCH_USER_FAVOURITE_GAMES } from "../actions/user-favourite-games";
import { getUserFavouriteGamesModule } from "./user-favourite-games-module";

jest.mock("../middlewares/user-favourite-games-saga", () => ({
  userFavouriteGamesSaga: "userFavouriteGamesSaga",
}));

jest.mock("../state/entities/favouriteGames/user-favourite-games-reducer", () => ({
  userFavouriteGamesReducer: "userFavouriteGamesReducer",
}));

describe("getUserFavouriteGamesModule", () => {
  it("should return the user favourite games module", () => {
    expect(getUserFavouriteGamesModule()).toEqual({
      id: "user-favourite-games-module",
      reducerMap: {
        userFavouriteGames: "userFavouriteGamesReducer",
      },
      middlewares: [],
      sagas: ["userFavouriteGamesSaga"],
      initialActions: [
        {
          type: FETCH_USER_FAVOURITE_GAMES,
        },
      ],
    });
  });
});
