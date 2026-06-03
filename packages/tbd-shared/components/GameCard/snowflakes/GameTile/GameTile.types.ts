import { BadgeType } from "@ppb/the-wall-common/types/GameTile/Badge.types";
import { RouletteNumber } from "@ppb/the-wall-common/types/Gaming/Gaming.types";
import { CustomLogo } from "./CustomLogo/CustomLogo.types";

export type GameTileBadge = {
  label?: string;
  type: BadgeType;
  rouletteNumbers?: RouletteNumber[];
};

export type GameTileImage = {
  url: string;
  width: number;
  height?: number;
  alt?: string;
};

export type GameTileImages = {
  small?: GameTileImage;
  medium?: GameTileImage;
  large?: GameTileImage;
  alt: string;
};

export type GameTileProps = {
  isRoundGameTile?: boolean;
  background?: GameTileImages;
  title: string;
  badge?: GameTileBadge;
  copyrightText?: string;
  customLogo?: CustomLogo;
  jackpotLogo?: string;
  backgroundColor?: string;
  columns?: number;
  isFavourite?: boolean;
  isFavouriteGamesEnabled?: boolean;
  isGameWidget?: boolean;
  isXmallGameTile?: boolean;
};

export enum GameLaunchMode {
  REAL = "real",
  DEMO = "demo",
}
