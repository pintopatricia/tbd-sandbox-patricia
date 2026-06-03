import { MouseEvent } from "react";
import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  ADD_USER_FAVOURITE_GAME,
  REMOVE_USER_FAVOURITE_GAME,
  CLEAR_USER_FAVOURITE_GAMES_ERROR,
  ClearUserFavouriteGamesErrorAction,
} from "@ppb/tbd-store/actions/user-favourite-games";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { BadgeType } from "@ppb/the-wall-common/types";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { isGameFavourite } from "@ppb/tbd-store/state/entities/favouriteGames/user-favourite-games-selector";
import URN from "@ppb/tbd-store/state/layout/URN";
import { GameInfoCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { getGameByURN } from "@ppb/tbd-store/state/entities/games/game-selectors";
import { LaunchGame, UI__LAUNCH_GAME } from "@ppb/tbd-store/actions/navigation";
import {
  SUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
  SubscribeToUpdateGameFeedResultsAction,
  UnsubscribeToUpdateGameFeedResultsAction,
  UNSUBSCRIBE_TO_UPDATE_GAME_FEED_RESULTS,
} from "@ppb/tbd-store/actions/game-feeds";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import {
  getBetslipExchangeContext,
  getSportsbookPlacedCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getPropsForGameInfo } from "../../view-model-factories/game";
import { getEndpoint } from "../../config/endpoints";
import type { GameInfoProps } from "./snowflakes/GameInfo/GameInfo.types";
import { getCurrencySymbol } from "../../formatters/currency-formatters";

export type ContainerProps = { urn: string; visible?: boolean };

export type CardProps = {
  currencySymbol: string;
  currencyCode: string;
  localeCodeBcp47: string;
  gameLaunchId: string;
  gameName: string;
  gameProviderName: string;
  providerUid: string;
  mainProduct: string;
  urn: string;
  gameInfoProps: GameInfoProps;
  jackpotAmount: string | false | undefined;
  tableNames?: string[];
  isBetslipContainerDisplayed: boolean;
  isLoggedIn: boolean;
  isFavourite?: boolean;
  isFavouriteGamesEnabled?: boolean;
  onFavouritesButtonClick?: (event: MouseEvent) => void;
  uid: string;
  favouriteGamesErrorState?: {
    timestamp: number | null;
    gameId: string | null;
  };
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGameInfoCard = createCardByURNSelector<GameInfoCards, URN>();
  const getSportsbookSimpleSelectionsCounter = createSimpleSelectionsCounterSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    try {
      const gameInfoCard = getGameInfoCard(state.layouts.cards.gameinfos, urn);
      const userDetails = <UserDetails>getUserDetails(state);
      const { localeCodeBcp47, currencyCode, loggedIn } = userDetails;
      const currencySymbol = getCurrencySymbol(userDetails) || "";

      if (!gameInfoCard) {
        return {};
      }
      const game = getGameByURN(state.entities.games, gameInfoCard.game);
      if (!game) {
        return {};
      }

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
      const isFavourite =
        isFavouriteGamesThrottleActive && loggedIn ? isGameFavourite(state.userFavouriteGames, game.launchId) : false;

      return {
        urn: game.urn,
        gameInfoProps,
        currencyCode,
        currencySymbol,
        localeCodeBcp47,
        gameLaunchId: game.launchId,
        gameName: game.name,
        gameProviderName: game.provider.name,
        providerUid: game.provider.uid,
        mainProduct: game.mainProduct,
        jackpotAmount,
        tableNames: game.feedData?.tableNames,
        isBetslipContainerDisplayed,
        isLoggedIn: loggedIn,
        isFavourite,
        isFavouriteGamesEnabled: !!isFavouriteGamesThrottleActive,
        uid: game.uid,
        favouriteGamesErrorState: {
          timestamp: state.userFavouriteGames?.lastErrorTimestamp,
          gameId: state.userFavouriteGames?.lastErrorGameId,
        },
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

const dispatchClearFavouriteGamesError = (): ClearUserFavouriteGamesErrorAction => ({
  type: CLEAR_USER_FAVOURITE_GAMES_ERROR,
});

export type DispatchProps = {
  dispatchLaunchGame: typeof dispatchLaunchGame;
  dispatchSubscribeToUpdateGameFeedResults: typeof dispatchSubscribeToUpdateGameFeedResults;
  dispatchUnsubscribeToUpdateGameFeedResults: typeof dispatchUnsubscribeToUpdateGameFeedResults;
  dispatchAddToFavouriteGames?: typeof dispatchAddToFavouriteGames;
  dispatchRemoveFromFavouriteGames?: typeof dispatchRemoveFromFavouriteGames;
  dispatchClearFavouriteGamesError?: typeof dispatchClearFavouriteGamesError;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchLaunchGame,
  dispatchSubscribeToUpdateGameFeedResults,
  dispatchUnsubscribeToUpdateGameFeedResults,
  dispatchAddToFavouriteGames,
  dispatchRemoveFromFavouriteGames,
  dispatchClearFavouriteGamesError,
};
