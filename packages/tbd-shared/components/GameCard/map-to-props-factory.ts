import { MapStateToPropsFactory } from "react-redux";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";

import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { getGameByURN } from "@ppb/tbd-store/state/entities/games/game-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { isGameFavourite } from "@ppb/tbd-store/state/entities/favouriteGames/user-favourite-games-selector";
import URN from "@ppb/tbd-store/state/layout/URN";
import { GameCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  LaunchGame,
  NavigateToGameInfoView,
  UI__LAUNCH_GAME,
  UI__NAVIGATE_TO_GAME_INFO_VIEW,
  UI__LAUNCH_GAME_FROM_WIDGET,
  LaunchGameFromWidget,
} from "@ppb/tbd-store/actions/navigation";
import {
  ADD_USER_FAVOURITE_GAME,
  REMOVE_USER_FAVOURITE_GAME,
  CLEAR_USER_FAVOURITE_GAMES_ERROR,
  ClearUserFavouriteGamesErrorAction,
} from "@ppb/tbd-store/actions/user-favourite-games";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import {
  SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  SubscribeToUpdateGameFeedResultsAction,
  GameLaunchAction,
  GAME_LAUNCH,
  UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  UnsubscribeToUpdateGameFeedResultsAction,
} from "@ppb/tbd-store/actions/game-feeds";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { Jurisdiction, jurisdictionToTopLevelDomainMap } from "@ppb/tbd-store/config/Jurisdiction";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { BadgeType } from "@ppb/the-wall-web/types";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGameCardViewModel, getPropsForGameInfo } from "../../view-model-factories/game";
import { getEndpoint } from "../../config/endpoints";
import { GameTileProps } from "./snowflakes/GameTile/GameTile.types";
import { GameTileContainerLayout } from "../GamesCardGroup/snowflakes/GameTileContainer/GameTileContainerLayout.types";
import { GameInfoProps } from "../GameInfo/snowflakes/GameInfo/GameInfo.types";
import { getCurrencySymbol } from "../../formatters/currency-formatters";

export type ContainerProps = {
  urn: string;
  layout?: GameTileContainerLayout;
  isRoundGameTile?: boolean;
  visible?: boolean;
  theme?: string;
};

export type CardProps = {
  urn: string;
  gameTileProps: GameTileProps;
  gameLaunchId: string;
  gameName: string;
  gameProviderName: string;
  providerUid: string;
  mainProduct: string;
  gameInfoViewUrl: ViewLink;
  gameInfoProps: GameInfoProps;
  layout?: GameTileContainerLayout;
  isRoundGameTile?: boolean;
  currencyCode: string;
  currencySymbol: string;
  localeCodeBcp47: string;
  jackpotAmount: string | false | undefined;
  isBetslipContainerDisplayed: boolean;
  gameUrn: string;
  tableNames?: string[];
  isLoggedIn: boolean;
  topLevelDomain: string;
  inputSearchTerm?: string;
  isFavourite?: boolean;
  isFavouriteGamesEnabled?: boolean;
  uid: string;
  favouriteGamesErrorState: {
    timestamp: number | null;
    gameId: string | null;
  };
  isGameWidget?: boolean;
  isXmallGameTile?: boolean;
  isGameTileRefined?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGameCard = createCardByURNSelector<GameCards, URN>();
  const getGameCardViewModel = createGameCardViewModel();

  return function mapStateToProps(
    state: ApplicationState,
    { urn, layout = GameTileContainerLayout.RECTANGLE, isRoundGameTile = false, theme }: ContainerProps,
  ): StateProps {
    try {
      const userDetails = <UserDetails>getUserDetails(state);
      const { localeCodeBcp47, currencyCode, loggedIn, jurisdiction } = userDetails;
      const currencySymbol = getCurrencySymbol(userDetails) || "";
      const topLevelDomain = jurisdictionToTopLevelDomainMap[jurisdiction.jurisdiction as Jurisdiction];
      const getSportsbookSimpleSelectionsCounter = createSimpleSelectionsCounterSelector();
      const gameCard = getGameCard(state.layouts.cards.games, urn);
      if (!gameCard) {
        return {};
      }

      const game = getGameByURN(state.entities.games, gameCard.game);

      if (!game) {
        return {};
      }

      const gamingSearchState = state.layouts.gamingSearch;

      const matchingEntry = Object.values(gamingSearchState ?? {}).find(
        ({ result }) => Array.isArray(result) && result.some((searchedGame) => searchedGame?.urn === urn),
      );

      const inputSearchTerm = matchingEntry?.inputSearchTerm || "";

      const gameTileProps = getGameCardViewModel(game);
      if (!gameTileProps) {
        return {};
      }
      const { launchId, provider, mainProduct, feedData, viewLink: gameInfoViewUrl, uid } = game;
      const gameInfoProps = getPropsForGameInfo(game);

      const shouldDisplayJackpotBanner = gameInfoProps?.badge?.type === BadgeType.JACKPOT;
      const jackpotAmount = shouldDisplayJackpotBanner && gameInfoProps?.badge?.label;

      const hasExchangeContext = getBetslipExchangeContext(state);
      const hasPlacedCombinations = !!getSportsbookPlacedCombinations(state);
      const totalSportsbookSelections = getSportsbookSimpleSelectionsCounter(state);
      const isBetslipContainerDisplayed =
        !!hasExchangeContext || hasPlacedCombinations || totalSportsbookSelections !== 0;

      const getThrottle = createGetThrottleSelector();
      const isFavouriteGamesThrottleActive = getThrottle(state.entities.throttles, "USER_FAVOURITE_GAMES")?.isActive;
      const isGameTileRefined = !!getThrottle(state.entities.throttles, "GAME_TILE_REFINED_DESIGN")?.isActive;

      return {
        urn,
        gameTileProps,
        gameLaunchId: launchId,
        gameName: game.name,
        gameProviderName: provider.name,
        providerUid: provider.uid,
        mainProduct,
        gameInfoViewUrl,
        gameInfoProps,
        layout,
        isRoundGameTile,
        currencyCode,
        currencySymbol,
        localeCodeBcp47,
        gameUrn: gameCard.game,
        tableNames: feedData?.tableNames,
        jackpotAmount,
        isBetslipContainerDisplayed,
        isLoggedIn: loggedIn,
        inputSearchTerm,
        topLevelDomain,
        isFavourite:
          isFavouriteGamesThrottleActive && loggedIn ? isGameFavourite(state?.userFavouriteGames, uid) : false,
        isFavouriteGamesEnabled: !!isFavouriteGamesThrottleActive,
        uid,
        favouriteGamesErrorState: {
          timestamp: state.userFavouriteGames?.lastErrorTimestamp,
          gameId: state.userFavouriteGames?.lastErrorGameId,
        },
        isXmallGameTile: theme === "GAMING_SMALL_TILES",
        isGameTileRefined,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchLaunchGame = (
  launchGameViewLink: ViewLink,
  gameUrn: string,
  urn: string,
  platformType: PlatformType,
): LaunchGame => ({
  type: UI__LAUNCH_GAME,
  payload: {
    href: launchGameViewLink.viewUrl,
    gameUrn,
    cardUrn: urn,
    platformType,
  },
});

const dispatchLaunchGameFromWidget = (
  launchGameViewLink: ViewLink,
  gameUrn: string,
  urn: string,
  platformType: PlatformType,
): LaunchGameFromWidget => ({
  type: UI__LAUNCH_GAME_FROM_WIDGET,
  payload: {
    href: launchGameViewLink.viewUrl,
    gameUrn,
    cardUrn: urn,
    platformType,
  },
});

const dispatchNavigateToGameInfoView = (
  gameInfoViewLink: ViewLink,
  gameUrn: string,
  urn: string,
): NavigateToGameInfoView => ({
  type: UI__NAVIGATE_TO_GAME_INFO_VIEW,
  payload: { href: gameInfoViewLink.viewUrl, gameUrn, cardUrn: urn },
});

const dispatchAddToFavouriteGames = (
  gameLaunchId: string,
  product: string,
  gameName?: string,
  gameProvider?: string,
  urn?: string,
  cardGroupUrn?: string,
  segmentedCardGroupUrn?: string,
): any => ({
  type: ADD_USER_FAVOURITE_GAME,
  payload: {
    gameId: gameLaunchId,
    product,
    gameName,
    gameProvider,
    urn,
    cardGroupUrn,
    segmentedCardGroupUrn,
  },
});

const dispatchRemoveFromFavouriteGames = (
  gameLaunchId: string,
  product: string,
  gameName?: string,
  gameProvider?: string,
  urn?: string,
  cardGroupUrn?: string,
  segmentedCardGroupUrn?: string,
): any => ({
  type: REMOVE_USER_FAVOURITE_GAME,
  payload: {
    gameId: gameLaunchId,
    product,
    gameName,
    gameProvider,
    urn,
    cardGroupUrn,
    segmentedCardGroupUrn,
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchSubscribeToUpdateGameFeedResults = (
  gameUrn: string,
  tableNames?: string[],
  currencyCode = "GBP",
): SubscribeToUpdateGameFeedResultsAction => ({
  type: SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  payload: { urn: gameUrn, tableNames, endpoint: getEndpoint("LIVE_DEALER_EVENT_SOURCE"), currencyCode },
});

const dispatchUnsubscribeToUpdateGameFeedResults = (
  gameUrn: string,
  tableNames?: string[],
  currencyCode = "GBP",
): UnsubscribeToUpdateGameFeedResultsAction => ({
  type: UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  payload: { urn: gameUrn, tableNames, endpoint: getEndpoint("LIVE_DEALER_EVENT_SOURCE"), currencyCode },
});

const dispatchGameLaunchRefresh = (launchedGame: PartialItem): GameLaunchAction => ({
  type: GAME_LAUNCH,
  payload: { ...launchedGame },
});

const dispatchClearFavouriteGamesError = (): ClearUserFavouriteGamesErrorAction => ({
  type: CLEAR_USER_FAVOURITE_GAMES_ERROR,
});

export type DispatchProps = {
  dispatchLaunchGame: typeof dispatchLaunchGame;
  dispatchLaunchGameFromWidget: typeof dispatchLaunchGameFromWidget;
  dispatchNavigateToGameInfoView: typeof dispatchNavigateToGameInfoView;
  dispatchRemoveFromFavouriteGames: typeof dispatchRemoveFromFavouriteGames;
  dispatchAddToFavouriteGames: typeof dispatchAddToFavouriteGames;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchSubscribeToUpdateGameFeedResults: typeof dispatchSubscribeToUpdateGameFeedResults;
  dispatchGameLaunchRefresh: typeof dispatchGameLaunchRefresh;
  dispatchUnsubscribeToUpdateGameFeedResults: typeof dispatchUnsubscribeToUpdateGameFeedResults;
  dispatchClearFavouriteGamesError: typeof dispatchClearFavouriteGamesError;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchLaunchGame,
  dispatchLaunchGameFromWidget,
  dispatchNavigateToGameInfoView,
  dispatchRemoveFromFavouriteGames,
  dispatchAddToFavouriteGames,
  dispatchPushAction,
  dispatchSubscribeToUpdateGameFeedResults,
  dispatchGameLaunchRefresh,
  dispatchUnsubscribeToUpdateGameFeedResults,
  dispatchClearFavouriteGamesError,
};
