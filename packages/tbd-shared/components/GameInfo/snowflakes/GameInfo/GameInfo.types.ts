import { GameDescription, GameBaseImage } from "@ppb/tbd-store/state/entities/Gaming.types";
import { ViewLink } from "@ppb/the-wall-common/types";
import type { GameTileBadge, GameTileImages } from "../../../GameCard/snowflakes/GameTile/GameTile.types";
import { CustomLogo } from "../../../GameCard/snowflakes/GameTile/CustomLogo/CustomLogo.types";

export type GameInfoI18N = {
  playNow: string;
  rtp: string;
  description: string;
  glance: string;
  volatility: string;
  gameHelp: string;
  addToFavourites: string;
  removeFromFavourites: string;
};

export type GameInfoProps = {
  title: string;
  uid?: string;
  i18n: GameInfoI18N;
  jackpotLogo?: string;
  customLogo?: CustomLogo;
  flattenedImage?: GameTileImages;
  badge?: GameTileBadge;
  rtp?: string;
  gameType?: string;
  gameVolatility?: string;
  gameTheme?: string;
  jackpotType?: string;
  gameStudio?: string;
  gameHelp?: string;
  minStake?: string;
  maxStake?: string;
  gameMechanics?: string[];
  howToPlayDetails?: GameDescription;
  copyrightText?: string;
  isDemoButtonDisplayed?: boolean;
  showActionButtons?: boolean;
  cardRef?: React.Ref<HTMLDivElement>;
  className?: string;
  screenshots?: (GameBaseImage | null)[] | null;
  isFavourite?: boolean;
  isFavouriteGamesEnabled?: boolean;
};
type PlayNowButtonOnClick = (isDemo?: boolean) => void;

type GameLaunchProps = {
  playNowButtonOnClick: PlayNowButtonOnClick;
  launchUrl: ViewLink;
  urlsTarget?: string;
  launchUrlDemoMode?: ViewLink;
  isBetslipContainerDisplayed: boolean;
  gameLaunchId?: string;
  isLoggedIn?: boolean;
  isFavourite?: boolean;
  isFavouriteGamesEnabled?: boolean;
  onFavouritesButtonClick?: (event: React.MouseEvent) => void;
  dispatchAddToFavouriteGames?: (
    gameId: string,
    product: string,
    gameName?: string,
    gameProvider?: string,
    urn?: string,
    cardGroupUrn?: string,
    segmentedCardGroupUrn?: string,
  ) => void;
  dispatchRemoveFromFavouriteGames?: (
    gameId: string,
    product: string,
    gameName?: string,
    gameProvider?: string,
    urn?: string,
    cardGroupUrn?: string,
    segmentedCardGroupUrn?: string,
  ) => void;
  mainProduct?: string;
  uid?: string;
  gameName?: string;
  gameProviderName?: string;
  urn?: string;
};

export type GameInfoProperties = GameInfoProps &
  GameLaunchProps & {
    currencySymbol: string;
  };
