import { MouseEvent } from "react";
import { ViewLink } from "@ppb/the-wall-common/types";
import { LaunchGame } from "@ppb/tbd-store/actions/navigation";
import {
  UnsubscribeToUpdateGameFeedResultsAction,
  SubscribeToUpdateGameFeedResultsAction,
} from "@ppb/tbd-store/actions/game-feeds";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { GameInfoProps } from "../../GameInfo/snowflakes/GameInfo/GameInfo.types";
import { TranslationKey } from "../../../translations/keys";

export type QuickViewGameInfoProps = {
  urn: string;
  gameUrn: string;
  isLoggedIn: boolean;
  mainProduct: string;
  gameLaunchId: string;
  providerUid: string;
  currencyCode: string;
  currencySymbol: string;
  localeCodeBcp47: string;
  jackpotAmount: string | false | undefined;
  tableNames: string[];
  isBetslipContainerDisplayed: boolean;
  gameInfoProps: GameInfoProps;
  dispatchLaunchGame: (
    launchGameViewLink: ViewLink,
    gameUrn: string,
    urn: string,
    platformType: PlatformType,
  ) => LaunchGame;
  dispatchSubscribeToUpdateGameFeedResults: (
    gameUrn: string,
    tableNames?: string[],
    currencyCode?: string,
  ) => SubscribeToUpdateGameFeedResultsAction;
  dispatchUnsubscribeToUpdateGameFeedResults: (
    gameUrn: string,
    tableNames?: string[],
    currencyCode?: string,
  ) => UnsubscribeToUpdateGameFeedResultsAction;
  onClose: () => void;
  isFavourite?: boolean;
  isFavouriteGamesEnabled?: boolean;
  onFavouritesButtonClick?: (event: MouseEvent) => void;
  uid: string;
  gameName: string;
  gameProviderName: string;
  favouriteGamesErrorState?: {
    timestamp: number | null;
    gameId: string | null;
  };
  dispatchClearFavouriteGamesError?: () => void;
};

export type TableProperties = {
  gameTheme: string;
  gameStudio: string;
  jackpotType: string;
  minStake: string;
  maxStake: string;
  gameMechanics: string;
};

export type InfoPair<T> = {
  key: keyof TranslationKey;
  prop: keyof T;
};
