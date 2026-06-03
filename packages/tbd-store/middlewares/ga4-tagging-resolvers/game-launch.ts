import { buildGameLaunchEvent, GameLaunchEvent } from "tagging-library";
import { codecs } from "@ppb/tbd-urn-codecs";
import type URN from "../../state/layout/URN";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { Games } from "../../state/entities/Gaming.types";
import {
  LaunchGame,
  LaunchGameFromGameInfoPage,
  LaunchGameFromPN,
  LaunchGameFromPromo,
  LaunchGameFromWidget,
} from "../../actions/navigation";
import { GameType, MAX_URL_LENGTH_FOR_TAGGING, TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { ApplicationState } from "../../state/ApplicationState.types";
import { getLayoutMetadata } from "../../state/layout-snapshot";
import { getGameByURN } from "../../state/entities/games/game-selectors";
import {
  createGamingSearchInterfaceSelector,
  getGamingSearchGamePositionByURN,
} from "../../state/layout/gaming-search/gaming-search-selectors";
import { BottomBarGameLaunchAction } from "../../actions/game-launch";

export const getGameTileClickEvent = (action: LaunchGame, state: ApplicationState): GameLaunchEvent => {
  const getGamingSearchInterface = createGamingSearchInterfaceSelector();
  const { href, gameUrn, cardUrn } = action.payload;

  const metadata = getLayoutMetadata(cardUrn);

  const game = getGameByURN(state.entities.games, gameUrn);
  const { results, inputSearchTerm } = getGamingSearchInterface(
    state,
    codecs.card.gaming.masterConfigElement.encode("search", 0).uid,
  );
  const gamePositionByUrnInSearchResults = getGamingSearchGamePositionByURN(
    state.layouts.gamingSearch,
    codecs.card.gaming.masterConfigElement.encode("search", 0).uid,
    cardUrn,
  );

  const zoneTitle = metadata.viewZoneTitle || "";
  const gameName = game?.name || "";
  const gameProvider = game?.provider.name || "";
  const launchId = game?.launchId || "";
  const gamePosition =
    gamePositionByUrnInSearchResults === -1 ? metadata.horizontalPosition : gamePositionByUrnInSearchResults;
  const verticalPosition = metadata.verticalPosition || undefined;
  const gamingSearchResultsLength = results.length;

  return buildGameLaunchEvent({
    gameId: launchId || "",
    gameName: gameName || "",
    gameProvider: gameProvider || "",
    position: gamePosition !== undefined ? (gamePosition + 1).toString() : "",
    moduleDisplayOrder: verticalPosition !== undefined ? verticalPosition.toString() : "",
    gameState: "",
    gameAction: TaggingAction.CLICKED_PLAY_NOW,
    destinationUrl: href.slice(0, MAX_URL_LENGTH_FOR_TAGGING),
    module: gamingSearchResultsLength > 0 ? "games search" : zoneTitle || "",
    type: GameType.REAL_PLAY,
    gameFilter:
      gamingSearchResultsLength > 0 ? `${gamingSearchResultsLength} results for ${inputSearchTerm}` : undefined,
  });
};

export const getGameLaunchFromGameInfoEvent = (
  action: LaunchGameFromGameInfoPage,
  state: ApplicationState,
): GameLaunchEvent => {
  const { href, gameUrn, isDemo } = action.payload;

  const game = getGameByURN(state.entities.games, gameUrn);

  const gameName = game?.name || "";
  const gameProvider = game?.provider.name || "";
  const launchId = game?.launchId || "";

  return buildGameLaunchEvent({
    gameId: launchId || "",
    gameName: gameName || "",
    gameProvider: gameProvider || "",
    position: "",
    moduleDisplayOrder: "",
    gameState: "",
    gameAction: TaggingAction.CLICKED_PLAY_NOW,
    destinationUrl: href.slice(0, MAX_URL_LENGTH_FOR_TAGGING),
    module: "game info cta",
    type: isDemo ? GameType.DEMO_PLAY : GameType.REAL_PLAY,
  });
};

export const getGameLaunchFromBottomBar = (action: BottomBarGameLaunchAction): GameLaunchEvent => {
  const { path, tile } = action.payload;
  const gameName = tile.toLowerCase();

  return buildGameLaunchEvent({
    gameId: gameName || "",
    gameName: gameName || "",
    gameProvider: "playtech",
    position: "4",
    moduleDisplayOrder: "",
    gameState: "",
    gameAction: TaggingAction.CLICKED_PLAY_NOW,
    destinationUrl: path.slice(0, MAX_URL_LENGTH_FOR_TAGGING),
    module: "bottom bar",
    type: GameType.REAL_PLAY,
  });
};

const getGameUrnFromViewLink = (state: ApplicationState, gameId: string): string | null => {
  try {
    const gameCardUrn = codecs.gaming.game.encode("uid", gameId);
    const getGameCard = createCardByURNSelector<Games, URN>();
    const gameCard = getGameCard(state.entities.games, gameCardUrn.uid);
    return gameCard?.urn ?? null;
  } catch {
    return null;
  }
};

export const getGameLaunchFromPNEvent = (action: LaunchGameFromPN, state: ApplicationState): GameLaunchEvent => {
  const { href, gameId } = action.payload;

  const gameUrn = gameId ? getGameUrnFromViewLink(state, gameId) : null;
  const game = gameUrn ? getGameByURN(state.entities.games, gameUrn) : null;
  const gameName = game?.name ?? "";
  const gameProvider = game?.provider.name ?? "";
  const launchId = game?.launchId ?? "";

  return buildGameLaunchEvent({
    gameId: launchId ?? "",
    gameName: gameName ?? "",
    gameProvider: gameProvider ?? "",
    position: "null",
    moduleDisplayOrder: "",
    gameState: "",
    gameAction: "null",
    destinationUrl: href ? href.slice(0, 100) : "",
    module: "push notification",
    type: GameType.REAL_PLAY,
  });
};

export const getGameLaunchFromPromoEvent = (action: LaunchGameFromPromo, state: ApplicationState): GameLaunchEvent => {
  const { urn, viewUrl } = action.payload;
  const { horizontalPosition, verticalPosition } = getLayoutMetadata(urn);

  let gameId: string | null = null;
  try {
    const parsedUrl = new URL(viewUrl);
    gameId = parsedUrl.searchParams.get("gameId");
  } catch {
    gameId = null;
  }
  const gameUrn = gameId ? getGameUrnFromViewLink(state, gameId) : null;
  const game = gameUrn ? getGameByURN(state.entities.games, gameUrn) : null;
  const gameName = game?.name ?? "";
  const gameProvider = game?.provider?.name ?? "";

  return buildGameLaunchEvent({
    gameId: gameId ?? "",
    gameName,
    gameProvider,
    position: String(horizontalPosition),
    moduleDisplayOrder: String(verticalPosition),
    gameState: "",
    gameAction: TaggingAction.CLICKED_BANNER_CTA,
    destinationUrl: viewUrl.slice(0, MAX_URL_LENGTH_FOR_TAGGING),
    module: "promo cards",
    type: GameType.REAL_PLAY,
  });
};

export const getGameLaunchFromWidgetEvent = (
  action: LaunchGameFromWidget,
  state: ApplicationState,
): GameLaunchEvent => {
  const { href, gameUrn } = action.payload;

  const game = getGameByURN(state.entities.games, gameUrn);

  const gameName = game?.name || "";
  const gameProvider = game?.provider.name || "";
  const launchId = game?.launchId || "";

  return buildGameLaunchEvent({
    gameId: launchId || "",
    gameName: gameName || "",
    gameProvider: gameProvider || "playtech - alias - live",
    position: "0",
    moduleDisplayOrder: "0",
    gameState: "null",
    gameAction: "clicked play now",
    destinationUrl: href.slice(0, MAX_URL_LENGTH_FOR_TAGGING),
    module: "x-sell enhancement - floating icon",
    type: GameType.REAL_PLAY,
    swimlaneType: "null",
    promotionIndicator: "null",
    gameFilter: "null",
  });
};
