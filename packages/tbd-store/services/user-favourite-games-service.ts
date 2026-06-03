import { UserFavouriteGamesService } from "@flutter-global/uki-channels-http-clients";
import { createClientFactory } from "./client-factory";
import { getCookie } from "../helpers/cookies";

const userFavouriteGamesClientFactory = createClientFactory(UserFavouriteGamesService);

/**
 * Retrieve user's favourite games for the specified platform and product
 *
 * @param product - The product type (e.g., "arcade")
 * @param platform - The platform type (e.g., "desktop", "mobile")
 * @returns Returns an array of favourite game identifiers (e.g., ["fire-joker-apg", "joker-maxima-abp"])
 */
export async function getFavouriteGames(product = "arcade", platform = "desktop"): Promise<string[]> {
  const client = userFavouriteGamesClientFactory("USER_ACTIVITY");
  const ssoId = getCookie("ssoid") || "";

  const queryParams = {
    product,
    gameIdentifierType: "uid" as const,
    platform,
    withPrismicValidation: false,
  };

  try {
    const favourites = await client.getFavouriteGames(queryParams, ssoId);
    return favourites;
  } catch (error) {
    console.warn("API call failed, returning mock data:", error);
  }
  return [];
  // Mock data for development
}

/**
 * Add a game to user's favourites
 *
 * @param gameCode - The game code to add (e.g., "fire-joker-apg")
 * @param product - The product type (e.g., "arcade")
 * @param platform - The platform type (e.g., "desktop", "mobile")
 * @returns Promise that resolves when the game is added
 * @throws Error if the server returns an error in the response body
 */
export async function addFavouriteGame(gameCode: string, product: string, platform = "desktop"): Promise<void> {
  const client = userFavouriteGamesClientFactory("USER_ACTIVITY");
  const ssoId = getCookie("ssoid") || "";

  const queryParams = {
    product,
    gameIdentifierType: "uid" as const,
    platform,
  };

  try {
    const response = await client.addFavouriteGame(gameCode, queryParams, ssoId);

    // Check if response contains an error (server returns 200 with error in body)
    if (response && typeof response === "object" && "error" in response) {
      const errorMessage = (response as any).error?.message || "Failed to add game to favourites";
      throw new Error(errorMessage);
    }

    console.log(`Successfully added ${gameCode} to favourites`);
  } catch (error) {
    console.warn(`Error adding ${gameCode} to favourites:`, error);
    throw error;
  }
}

/**
 * Remove a game from user's favourites
 *
 * @param gameCode - The game code to remove (e.g., "fire-joker-apg")
 * @param product - The product type (e.g., "arcade")
 * @param platform - The platform type (e.g., "desktop", "mobile")
 * @returns Promise that resolves when the game is removed
 */
export async function removeFavouriteGame(gameCode: string, product: string, platform = "desktop"): Promise<void> {
  const client = userFavouriteGamesClientFactory("USER_ACTIVITY");
  const ssoId = getCookie("ssoid") || "";

  const queryParams = {
    product,
    gameIdentifierType: "uid" as const,
    platform,
  };

  try {
    const response = await client.removeFavouriteGame(gameCode, queryParams, ssoId);

    // Check if response contains an error (server returns 200 with error in body)
    if (response && typeof response === "object" && "error" in response) {
      const errorMessage = (response as any).error?.message || "Failed to remove game from favourites";
      throw new Error(errorMessage);
    }

    console.log(`Successfully removed ${gameCode} from favourites`);
  } catch (error) {
    console.warn(`Error removing ${gameCode} from favourites:`, error);
    throw error;
  }
}
