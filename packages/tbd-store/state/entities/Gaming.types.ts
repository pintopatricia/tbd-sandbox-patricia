import { JackpotLogo, Label, RouletteNumberColor } from "../constants";
import URN from "../layout/URN";
import { ViewLink } from "../layout/cards/ViewLink.types";

export type GameImageDimension = {
  width: number;
  height: number;
};

export type GameBaseImage = {
  url: string;
  alt?: string | null;
  dimensions: GameImageDimension;
};

export type GameImage = {
  small?: GameBaseImage;
  medium?: GameBaseImage;
};

export type Provider = {
  name: string;
  uid: string;
};

export type CustomLogo = {
  name?: string;
  image: GameBaseImage;
};

export type FeedData = {
  jackpot?: number;
  availableSeats?: number;
  lastNumbers?: RouletteNumber[];
  tableNames?: string[];
};

export type RouletteNumber = {
  number: string;
  color: RouletteNumberColor;
};

export type SeoMetaData = {
  metaTitle: string | null;
  metaDescription: string | null;
} | null;

/**
 * Game data model type
 */
export type Game = {
  urn: URN;
  uid: string;
  typename: "Game";
  viewLink: ViewLink;
  name: string;
  launchId: string;
  rgsCodeMobile: string;
  label?: Label;
  provider: Provider;
  mainProduct: string;
  flattened?: GameImage;
  jackpotLogo?: JackpotLogo;
  customLogo?: CustomLogo;
  seoMetaData?: SeoMetaData;
  gameType?: string;
  gameVolatility?: string;
  gameTheme?: string;
  gameHelp?: string;
  jackpotType?: string;
  gameStudio?: string;
  minStake?: string;
  maxStake?: string;
  gameMechanics?: string[];
  feedData?: FeedData;
  copyrightText?: string;
  backgroundColor?: string;
  description?: GameDescription;
  rtp?: string;
  decoration?: string;
  hasDemo?: boolean;
  screenshots?: (GameBaseImage | null)[] | null;
};

export type GameWithReleaseDate = {
  releaseDate: string | null;
  uid: string;
};

export type NewReleaseStorage = {
  new: string[];
  seen: string[];
};

export type GameDescription = {
  headline?: string;
  content: RichText[];
};

export type GameInfoCarouselImage = {
  src: string;
  srcSet?: string;
  alt?: string;
};

export type RichTextStyle = "span" | "p" | "strong" | "hyperlink" | "em";

export type RichText = {
  type: string;
  text: string;
  spans?: RichTextSpan[];
};

export type RichTextSpan = {
  start: number;
  end: number;
  style: RichTextStyle;
  url?: string;
  viewLink?: ViewLink;
};

export type Jackpot = {
  typename: "GamingJackpot";
  urn: string;
  name: string;
  value: number;
  state: JackpotState;
  progress: number;
  dropValue?: number;
  dropTime?: string;
  dropText?: string;
};

export type JackpotProps = {
  title: string;
  value: string;
  description: string;
  state: JackpotState;
  progress?: number;
  hasBigTitle?: boolean;
};

export type JackpotWithType = {
  type: string;
  props: JackpotProps;
};

export type Jackpots = {
  [urn: string]: Jackpot;
};

export type JackpotState = "COLD" | "HOT";

/**
 * Data model holding a key-value structure where the key is a unique identifier (event URN in this case) stored on the value too
 *
 * @example
 *  {
 *    "myUniqueId": { id: "myUniqueId", name: "", ... }
 *  }
 */
export type Games = {
  [urn: string]: Game;
};

// TODO: enum refactor
export { JackpotLogo, Label } from "../constants";
