import { createSelector } from "reselect";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { Game, GameImage, JackpotLogo, Label } from "@ppb/tbd-store/state/entities/Gaming.types";
import { BadgeType } from "@ppb/the-wall-common/types";
import { getEndpoint } from "../config/endpoints";
import { i18n } from "../helpers/i18n";
import type { GameInfoProps } from "../components/GameInfo/snowflakes/GameInfo/GameInfo.types";
import {
  GameLaunchMode,
  GameTileBadge,
  GameTileImages,
} from "../components/GameCard/snowflakes/GameTile/GameTile.types";

export const normalizeJackpotName = (name: JackpotLogo | undefined): string =>
  name ? name.toLowerCase().replace(/\s+/gim, "_") : "";

function getImage(image: GameImage): GameTileImages {
  const imageToReturn: GameTileImages = {
    alt: image.small?.alt || image.medium?.alt || "",
  };

  imageToReturn.small = image.small
    ? {
        url: image.small?.url || "",
        width: image.small?.dimensions?.width || 225,
        height: image.small?.dimensions?.height || 225,
      }
    : undefined;

  imageToReturn.medium = image.medium
    ? {
        url: image.medium?.url || "",
        width: image.medium?.dimensions?.width || 225,
        height: image.medium?.dimensions?.height || 225,
      }
    : undefined;

  return imageToReturn;
}

function buildAvailableSeatsLabel(availableSeats: number): string {
  if (availableSeats === 0)
    return `${i18n({ key: "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.FULL_TABLE" })} - ${i18n({
      key: "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.BET_BEHIND_NOW",
    })}`;
  return `${i18n({
    key:
      availableSeats === 1
        ? "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.SEAT"
        : "I18N.GAME_TILE.BADGE.AVAILABLE_SEATS.SEAT_plural",
    interpolationValues: { count: availableSeats },
  })}`;
}

function getGameLabel(label: string): string {
  switch (label) {
    case "EXCLUSIVE":
      return i18n({ key: "I18N.GAME_CARD.BADGE.EXCLUSIVE" });
    case "PREMIER":
      return i18n({ key: "I18N.GAME_CARD.BADGE.PREMIER" });
    case "RECOMMENDED":
      return i18n({ key: "I18N.GAME_CARD.BADGE.RECOMMENDED" });
    case "UPGRADED":
      return i18n({ key: "I18N.GAME_CARD.BADGE.UPGRADED" });
    case "PLAY IT HERE FIRST":
      return i18n({ key: "I18N.GAME_CARD.BADGE.PLAY_IT_HERE_FIRST" });
    default:
      return label;
  }
}

function getBadge(game: Game): GameTileBadge | undefined {
  const BF_GAMING_BLACK_DECORATION = "BF-Gaming-black";
  if (game?.feedData?.lastNumbers) {
    return {
      type: BadgeType.ROULETTE_NUMBERS,
      rouletteNumbers: game?.feedData?.lastNumbers,
    };
  }
  // We don't want to display this label for Evolution games for the moment
  if (game?.feedData?.availableSeats !== undefined && game.provider.uid !== "gp-ev") {
    return {
      type: BadgeType.SEATS_AVAILABLE,
      label: buildAvailableSeatsLabel(game.feedData.availableSeats),
    };
  }
  if (game.label === Label.JACKPOT) {
    return {
      type: BadgeType.JACKPOT,
      label: game.feedData?.jackpot ? `${game.feedData?.jackpot}` : undefined,
    };
  }
  if (game.label === Label.NEW) {
    if (game.decoration && game.decoration === BF_GAMING_BLACK_DECORATION) {
      return {
        type: BadgeType.NEW,
        label: i18n({ key: "I18N.GAME_CARD.BADGE.NEW" }),
      };
    }
    return {
      type: BadgeType.NEW_REGULAR,
      label: i18n({ key: "I18N.GAME_CARD.BADGE.NEW" }),
    };
  }
  if (game.label === Label.FEATURED) {
    return {
      type: BadgeType.FEATURED,
      label: i18n({ key: "I18N.GAME_CARD.BADGE.FEATURED" }),
    };
  }
  if (game?.label) {
    return {
      type: BadgeType.REGULAR,
      label: getGameLabel(game.label.toUpperCase()),
    };
  }
  return undefined;
}

export const createGameCardViewModel = () =>
  createSelector([(game) => game], (game) => ({
    background: game.flattened ? getImage(game.flattened) : undefined,
    badge: getBadge(game),
    title: game.name,
    copyrightText: game.copyrightText,
    jackpotLogo: normalizeJackpotName(game.jackpotLogo),
    customLogo: game.customLogo,
    backgroundColor: game.backgroundColor ? game.backgroundColor : "",
    columns: 1,
    gameMechanics: game.gameMechanics,
    gameHelp: game.gameHelp,
    gameStudio: game.gameStudio,
    gameTheme: game.gameTheme,
    gameType: game.gameType,
    gameVolatility: game.gameVolatility,
    jackpotType: game.jackpotType,
    minStake: game.minStake,
    maxStake: game.maxStake,
  }));

export function getLaunchUrl(
  gameLaunchId: string,
  providerUid: string,
  mainProduct: string,
  isNative: boolean,
  returnURL: string,
  isDemoMode = false,
): string {
  // remove the language from product other than vegas-it
  const trimmedMainProduct = ["vegas-it", "vegas-ro"].some((product) => product === mainProduct)
    ? mainProduct
    : mainProduct.split("-")[0];
  const launchParams = {
    gameId: gameLaunchId,
    channel: providerUid.includes("pt-") ? "lottery" : "y",
    returnURL: encodeURIComponent(returnURL),
    launchProduct: trimmedMainProduct,
    RPBucket: trimmedMainProduct,
    mode: isDemoMode ? GameLaunchMode.DEMO : GameLaunchMode.REAL,
    statusBar: false,
    dismissButtonPosition: "topRight",
    dataChannel: getEndpoint("GAME_LAUNCHER").includes(Brand.Skybet) ? "sportsgaming" : "rebuild",
    dataContext: isNative ? "native" : "web",
    switchedToNewTab: ["pt-alias-live"].includes(providerUid),
  };
  return `${getEndpoint("GAME_LAUNCHER")}?gameId=${launchParams.gameId}&channel=${launchParams.channel}&returnURL=${
    launchParams.returnURL
  }&launchProduct=${launchParams.launchProduct}&RPBucket=${launchParams.RPBucket}&mode=${launchParams.mode}&statusBar=${
    launchParams.statusBar
  }&dismissButtonPosition=${launchParams.dismissButtonPosition}&dataChannel=${launchParams.dataChannel}&dataContext=${
    launchParams.dataContext
  }${launchParams.switchedToNewTab ? `&switchedToNewTab=${launchParams.switchedToNewTab}` : ""}`;
}

export function getPropsForGameInfo(game: Game): GameInfoProps {
  return {
    flattenedImage: game.flattened ? getImage(game.flattened) : undefined,
    badge: getBadge(game),
    rtp: game.rtp,
    gameType: game.gameType,
    gameVolatility: game.gameVolatility,
    gameTheme: game.gameTheme,
    jackpotType: game.jackpotType,
    gameStudio: game.gameStudio,
    minStake: game.minStake,
    maxStake: game.maxStake,
    gameMechanics: game.gameMechanics,
    gameHelp: game.gameHelp,
    title: game.name,
    jackpotLogo: normalizeJackpotName(game.jackpotLogo),
    customLogo: game.customLogo,
    howToPlayDetails: game.description,
    copyrightText: game.copyrightText,
    uid: game.uid,
    i18n: {
      playNow: i18n({ key: "I18N.GAME_TILE.PLAY_NOW_BUTTON" }),
      rtp: i18n({ key: "I18N.GAME_TILE.RTP" }),
      description: i18n({ key: "I18N.GAME_INFO.DESCRIPTION" }),
      glance: i18n({ key: "I18N.GAME_INFO.GLANCE" }),
      volatility: i18n({ key: "I18N.GAME_INFO.VOLATILITY" }),
      gameHelp: i18n({ key: "I18N.GAME_INFO.GAME_HELP" }),
      addToFavourites: i18n({ key: "I18N.FAVOURITE_GAMES.ADD_TO_FAVS" }),
      removeFromFavourites: i18n({ key: "I18N.FAVOURITE_GAMES.REMOVE_FROM_FAVS" }),
    },
    isDemoButtonDisplayed: game.hasDemo,
    screenshots: game.screenshots,
  };
}
