import { GameBaseImage } from "@ppb/tbd-store/state/entities/Gaming.types";
import type { GameTileImages } from "../../../../../GameCard/snowflakes/GameTile/GameTile.types";

export type GameInfoCarouselProps = {
  flattenedImage?: GameTileImages;
  screenshots?: (GameBaseImage | null)[] | null;
};
