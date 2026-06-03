import { getFavouriteGames, addFavouriteGame, removeFavouriteGame } from "./user-favourite-games-service";
import { getCookie } from "../helpers/cookies";

const mockClient = {
  getFavouriteGames: jest.fn(),
  addFavouriteGame: jest.fn(),
  removeFavouriteGame: jest.fn(),
};

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => jest.fn(() => mockClient)),
}));

jest.mock("../helpers/cookies", () => ({
  getCookie: jest.fn(),
}));

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

describe("user-favourite-games-service", () => {
  const mockSsoId = "test-sso-id";
  const mockQueryParamsForGet = {
    product: "arcade",
    gameIdentifierType: "uid",
    platform: "desktop",
    withPrismicValidation: false,
  };
  const mockQueryParams = {
    product: "arcade",
    gameIdentifierType: "uid",
    platform: "desktop",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getCookie.mockReturnValue(mockSsoId);
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe("getFavouriteGames", () => {
    it("should fetch favourite games successfully", async () => {
      const mockFavourites = ["game1", "game2", "game3"];
      mockClient.getFavouriteGames.mockResolvedValue(mockFavourites);

      const result = await getFavouriteGames("arcade", "desktop");

      expect(getCookie).toHaveBeenCalledWith("ssoid");
      expect(mockClient.getFavouriteGames).toHaveBeenCalledWith(mockQueryParamsForGet, mockSsoId);
      expect(result).toEqual(mockFavourites);
    });

    it("should use default parameters when not provided", async () => {
      const mockFavourites = ["game1"];
      mockClient.getFavouriteGames.mockResolvedValue(mockFavourites);

      await getFavouriteGames();

      expect(mockClient.getFavouriteGames).toHaveBeenCalledWith(mockQueryParamsForGet, mockSsoId);
    });

    it("should handle missing ssoid cookie", async () => {
      getCookie.mockReturnValue("");
      const mockFavourites = ["game1"];
      mockClient.getFavouriteGames.mockResolvedValue(mockFavourites);

      await getFavouriteGames("arcade", "desktop");

      expect(mockClient.getFavouriteGames).toHaveBeenCalledWith(mockQueryParamsForGet, "");
    });

    it("should handle errors and return empty array", async () => {
      const error = new Error("API Error");
      mockClient.getFavouriteGames.mockRejectedValue(error);

      const result = await getFavouriteGames("arcade", "desktop");

      expect(consoleWarnSpy).toHaveBeenCalledWith("API call failed, returning mock data:", error);
      expect(result).toEqual([]);
    });

    it("should work with custom product and platform", async () => {
      const mockFavourites = ["game1"];
      mockClient.getFavouriteGames.mockResolvedValue(mockFavourites);

      await getFavouriteGames("casino", "mobile");

      expect(mockClient.getFavouriteGames).toHaveBeenCalledWith(
        {
          product: "casino",
          gameIdentifierType: "uid",
          platform: "mobile",
          withPrismicValidation: false,
        },
        mockSsoId,
      );
    });
  });

  describe("addFavouriteGame", () => {
    const gameCode = "fire-joker-apg";

    it("should add a game to favourites successfully", async () => {
      mockClient.addFavouriteGame.mockResolvedValue(undefined);

      await addFavouriteGame(gameCode, "arcade", "desktop");

      expect(getCookie).toHaveBeenCalledWith("ssoid");
      expect(mockClient.addFavouriteGame).toHaveBeenCalledWith(gameCode, mockQueryParams, mockSsoId);
      expect(consoleLogSpy).toHaveBeenCalledWith(`Successfully added ${gameCode} to favourites`);
    });

    it("should use default platform when not provided", async () => {
      mockClient.addFavouriteGame.mockResolvedValue(undefined);

      await addFavouriteGame(gameCode, "arcade");

      expect(mockClient.addFavouriteGame).toHaveBeenCalledWith(gameCode, mockQueryParams, mockSsoId);
    });

    it("should handle errors and rethrow", async () => {
      const error = new Error("API Error");
      mockClient.addFavouriteGame.mockRejectedValue(error);

      await expect(addFavouriteGame(gameCode, "arcade", "desktop")).rejects.toThrow(error);

      expect(consoleWarnSpy).toHaveBeenCalledWith(`Error adding ${gameCode} to favourites:`, error);
    });

    it("should handle error in response body and throw", async () => {
      const errorResponse = {
        error: {
          message: "Game already in favourites",
        },
      };
      mockClient.addFavouriteGame.mockResolvedValue(errorResponse);

      await expect(addFavouriteGame(gameCode, "arcade", "desktop")).rejects.toThrow("Game already in favourites");

      expect(consoleWarnSpy).toHaveBeenCalledWith(`Error adding ${gameCode} to favourites:`, expect.any(Error));
    });

    it("should handle error in response body with default message", async () => {
      const errorResponse = {
        error: {},
      };
      mockClient.addFavouriteGame.mockResolvedValue(errorResponse);

      await expect(addFavouriteGame(gameCode, "arcade", "desktop")).rejects.toThrow("Failed to add game to favourites");
    });

    it("should work with custom product and platform", async () => {
      mockClient.addFavouriteGame.mockResolvedValue(undefined);

      await addFavouriteGame(gameCode, "casino", "mobile");

      expect(mockClient.addFavouriteGame).toHaveBeenCalledWith(
        gameCode,
        {
          product: "casino",
          gameIdentifierType: "uid",
          platform: "mobile",
        },
        mockSsoId,
      );
    });
  });

  describe("removeFavouriteGame", () => {
    const gameCode = "fire-joker-apg";

    it("should remove a game from favourites successfully", async () => {
      mockClient.removeFavouriteGame.mockResolvedValue(undefined);

      await removeFavouriteGame(gameCode, "arcade", "desktop");

      expect(getCookie).toHaveBeenCalledWith("ssoid");
      expect(mockClient.removeFavouriteGame).toHaveBeenCalledWith(gameCode, mockQueryParams, mockSsoId);
      expect(consoleLogSpy).toHaveBeenCalledWith(`Successfully removed ${gameCode} from favourites`);
    });

    it("should use default platform when not provided", async () => {
      mockClient.removeFavouriteGame.mockResolvedValue(undefined);

      await removeFavouriteGame(gameCode, "arcade");

      expect(mockClient.removeFavouriteGame).toHaveBeenCalledWith(gameCode, mockQueryParams, mockSsoId);
    });

    it("should handle errors and rethrow", async () => {
      const error = new Error("API Error");
      mockClient.removeFavouriteGame.mockRejectedValue(error);

      await expect(removeFavouriteGame(gameCode, "arcade", "desktop")).rejects.toThrow(error);

      expect(consoleWarnSpy).toHaveBeenCalledWith(`Error removing ${gameCode} from favourites:`, error);
    });

    it("should handle error in response body and throw", async () => {
      const errorResponse = {
        error: {
          message: "Game not found in favourites",
        },
      };
      mockClient.removeFavouriteGame.mockResolvedValue(errorResponse);

      await expect(removeFavouriteGame(gameCode, "arcade", "desktop")).rejects.toThrow("Game not found in favourites");

      expect(consoleWarnSpy).toHaveBeenCalledWith(`Error removing ${gameCode} from favourites:`, expect.any(Error));
    });

    it("should handle error in response body with default message", async () => {
      const errorResponse = {
        error: {},
      };
      mockClient.removeFavouriteGame.mockResolvedValue(errorResponse);

      await expect(removeFavouriteGame(gameCode, "arcade", "desktop")).rejects.toThrow(
        "Failed to remove game from favourites",
      );
    });

    it("should work with custom product and platform", async () => {
      mockClient.removeFavouriteGame.mockResolvedValue(undefined);

      await removeFavouriteGame(gameCode, "casino", "mobile");

      expect(mockClient.removeFavouriteGame).toHaveBeenCalledWith(
        gameCode,
        {
          product: "casino",
          gameIdentifierType: "uid",
          platform: "mobile",
        },
        mockSsoId,
      );
    });
  });
});
