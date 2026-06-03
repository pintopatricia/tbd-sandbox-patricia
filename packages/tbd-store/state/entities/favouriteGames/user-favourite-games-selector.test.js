import { getFavouriteGameIds, isGameFavourite } from "./user-favourite-games-selector";

describe("user favourite games selectors", () => {
  const stateMock = {
    favouriteGameIds: ["game1", "game2", "game3"],
  };

  const emptyStateMock = {
    favouriteGameIds: [],
  };

  describe("getFavouriteGameIds", () => {
    it("should return the favouriteGameIds array", () => {
      const result = getFavouriteGameIds(stateMock);

      expect(result).toEqual(["game1", "game2", "game3"]);
    });

    it("should return an empty array when no favourites exist", () => {
      const result = getFavouriteGameIds(emptyStateMock);

      expect(result).toEqual([]);
    });
  });

  describe("isGameFavourite", () => {
    it("should return true when the game is in favourites", () => {
      const result = isGameFavourite(stateMock, "game2");

      expect(result).toBe(true);
    });

    it("should return false when the game is not in favourites", () => {
      const result = isGameFavourite(stateMock, "game99");

      expect(result).toBe(false);
    });

    it("should return false when favourites array is empty", () => {
      const result = isGameFavourite(emptyStateMock, "game1");

      expect(result).toBe(false);
    });

    it("should be case sensitive", () => {
      const result = isGameFavourite(stateMock, "Game1");

      expect(result).toBe(false);
    });
  });
});
