import { ObbMicroPlayerProps, Jersey } from "./ObbMicroPlayer.types";
import { PlayerNames } from "../../helpers/obb";

export const MAX_MULTI_PLAYER_JERSEYS = 7;
export const MAX_PLAYERS_NAME = 3;

export type PlayerNameVariant = "empty" | "single" | "multi";

export const getPlayerNameVariant = (players: PlayerNames[]): PlayerNameVariant => {
  if (players.length === 0) {
    return "empty";
  }
  return players.length === 1 ? "single" : "multi";
};

export const getOverflowPlayersCount = (players: PlayerNames[]): number =>
  Math.max(players.length - MAX_PLAYERS_NAME, 0);

export const areObbMicroPlayerPropsEqual = (
  prevProps: ObbMicroPlayerProps,
  nextProps: ObbMicroPlayerProps,
): boolean => {
  if (prevProps.jerseys.length !== nextProps.jerseys.length) {
    return false;
  }

  if (!prevProps.jerseys.every((jersey, index) => jersey === nextProps.jerseys[index])) {
    return false;
  }

  if (prevProps.variant !== nextProps.variant) {
    return false;
  }

  if (prevProps.hasBackground !== nextProps.hasBackground) {
    return false;
  }

  if (prevProps.players.length !== nextProps.players.length) {
    return false;
  }

  if (
    !prevProps.players.every(
      (player, index) =>
        player.firstName === nextProps.players[index].firstName &&
        player.lastName === nextProps.players[index].lastName,
    )
  ) {
    return false;
  }

  if (prevProps.isActionLinkEnabled !== nextProps.isActionLinkEnabled) {
    return false;
  }

  if (prevProps.onActionLinkClick !== nextProps.onActionLinkClick) {
    return false;
  }

  if (prevProps.jerseySize !== nextProps.jerseySize) {
    return false;
  }

  if (prevProps.onRemovePlayerClick !== nextProps.onRemovePlayerClick) {
    return false;
  }

  return true;
};

export const getJerseyLevel = (isEven: boolean, index: number): number =>
  isEven ? Math.floor(index / 2) : Math.ceil(index / 2);

export const getLimitedMultiPlayerJerseys = (jerseys: Jersey[]): Jersey[] => jerseys.slice(0, MAX_MULTI_PLAYER_JERSEYS);
