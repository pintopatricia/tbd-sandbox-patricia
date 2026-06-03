import { GameBaseImage } from "@ppb/tbd-store/state/entities/Gaming.types";

type Size = {
  size: number;
  mediaValue: number;
  mediaType: "max-width" | "min-width";
};

export type CustomLogo = {
  name?: string;
  image: GameBaseImage;
};

export type CustomLogoProps = {
  customLogo: CustomLogo;
  isGameInfo: boolean;
  sizes: Size[];
};
