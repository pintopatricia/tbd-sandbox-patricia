import { FunctionComponent, useCallback, MouseEvent, useState } from "react";
import { Link } from "@ppb/the-wall-web";
import { BadgeType, ViewLink } from "@ppb/the-wall-common/types";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { GameTile } from "./snowflakes/GameTile/GameTile.web";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { getStoredNewestReleasedGames, updateSeenGames } from "../../helpers/gaming-new-releases.web";
import useTicker from "../../hooks/useTicker";
import { ComponentProps } from "./props";
import { getLaunchUrl } from "../../view-model-factories/game";
import { getImagePath } from "../../view-model-factories/game.web";
import { i18n } from "../../helpers/i18n";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import styles from "./GameCard.web.css";
import { getBasePath } from "../../config/endpoints";
import QuickViewGameInfo from "./components/QuickViewGameInfo.web";
import { QuickViewGameInfoProps } from "./components/QuickViewGameInfo.types";
import { updateGamingSearchHistory } from "../../helpers/search-history-helper.web";
import { useFavouriteGamesErrorToast } from "../../hooks/useFavouriteGamesErrorToast";
import { ErrorToast } from "../ErrorToast/ErrorToast.web";

const GameCard: FunctionComponent<ComponentProps> = ({
  urn,
  gameTileProps,
  gameLaunchId,
  gameName,
  gameProviderName,
  providerUid,
  mainProduct,
  gameInfoViewUrl,
  gameInfoProps,
  isRoundGameTile,
  currencyCode,
  currencySymbol,
  localeCodeBcp47,
  gameUrn,
  dispatchLaunchGame,
  dispatchLaunchGameFromWidget,
  dispatchNavigateToGameInfoView,
  dispatchRemoveFromFavouriteGames,
  dispatchAddToFavouriteGames,
  dispatchPushAction,
  dispatchSubscribeToUpdateGameFeedResults,
  dispatchUnsubscribeToUpdateGameFeedResults,
  tableNames,
  isBetslipContainerDisplayed,
  isLoggedIn,
  inputSearchTerm,
  isFavourite,
  isFavouriteGamesEnabled,
  uid,
  favouriteGamesErrorState,
  isGameWidget,
  dispatchClearFavouriteGamesError,
  isXmallGameTile,
}) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [previousScrollY, setPreviousScrollY] = useState(0);

  const { isVisible: isErrorVisible, hideToast } = useFavouriteGamesErrorToast({
    errorTimestamp: favouriteGamesErrorState.timestamp,
    errorGameId: favouriteGamesErrorState.gameId,
    gameId: uid,
    onDismiss: dispatchClearFavouriteGamesError,
  });

  const handleErrorToastClose = useCallback(() => {
    hideToast();
    dispatchClearFavouriteGamesError();
  }, [hideToast, dispatchClearFavouriteGamesError]);

  const closeQuickView = () => {
    setShowQuickView(false);
    window.scrollTo(0, previousScrollY);
  };

  updateSeenGames(gameUrn.split("/")[1]);

  const viewLink = {
    viewUrn: "ppb:tbd:view:external",
    viewUrl: getLaunchUrl(gameLaunchId, providerUid, mainProduct, false, window.location.href),
  };
  const onClickHandler = useCallback(
    (url?: ViewLink) => {
      if (url) {
        if (isGameWidget) {
          dispatchLaunchGameFromWidget(url, gameUrn, urn, PlatformType.Web);
        } else {
          dispatchLaunchGame(url, gameUrn, urn, PlatformType.Web);
        }
      }
      if (inputSearchTerm) updateGamingSearchHistory(inputSearchTerm.trim());
    },
    [dispatchLaunchGame, dispatchLaunchGameFromWidget, gameUrn, urn, inputSearchTerm, isGameWidget],
  );

  const onInfoButtonClick = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault();
      event.stopPropagation();
      if (!isLoggedIn) {
        dispatchNavigateToGameInfoView(gameInfoViewUrl, gameUrn, urn);
        dispatchPushAction(gameInfoViewUrl);
      } else {
        setPreviousScrollY(window.scrollY);
        setShowQuickView(true);
      }
    },
    [dispatchNavigateToGameInfoView, dispatchPushAction, gameInfoViewUrl, gameUrn, urn, isLoggedIn],
  );

  const onFavouritesButtonClick = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault();
      event.stopPropagation();

      if (isFavourite) {
        dispatchRemoveFromFavouriteGames(uid, mainProduct, gameName, gameProviderName, urn);
      } else {
        dispatchAddToFavouriteGames(uid, mainProduct, gameName, gameProviderName, urn);
      }
    },
    [
      dispatchRemoveFromFavouriteGames,
      dispatchAddToFavouriteGames,
      uid,
      isFavourite,
      mainProduct,
      gameName,
      gameProviderName,
      urn,
    ],
  );

  const { observe } = useVisibilityObserver({
    onShow: (refUrn) => dispatchSubscribeToUpdateGameFeedResults(refUrn, tableNames, currencyCode),
    onHide: () => dispatchUnsubscribeToUpdateGameFeedResults(gameUrn, tableNames, currencyCode),
  });

  const shouldDisplayJackpotBanner = gameTileProps?.badge?.type === BadgeType.JACKPOT;
  const jackpotAmount = shouldDisplayJackpotBanner && gameTileProps?.badge?.label;
  const { ticker } = useTicker(jackpotAmount ? Number(jackpotAmount) : 0, 300, false);

  const jackpotLogo = getImagePath(gameTileProps?.jackpotLogo);
  let newGameTileProps = { ...gameTileProps, jackpotLogo };

  if (shouldDisplayJackpotBanner) {
    const incremental = currencyFormatWithDecimalPlaces({
      currencyCode,
      localeCodeBcp47,
      value: ticker,
    });

    newGameTileProps = {
      ...gameTileProps,
      jackpotLogo,
      badge: {
        type: BadgeType.JACKPOT,
        label: jackpotAmount ? incremental : i18n({ key: "I18N.GAME_CARD.BADGE.JACKPOT" }),
      },
    };
  }

  if (getStoredNewestReleasedGames().includes(gameUrn.split("/")[1])) {
    newGameTileProps = {
      ...gameTileProps,
      jackpotLogo,
      badge: {
        type: BadgeType.NEW_REGULAR,
        label: i18n({ key: "I18N.GAME_CARD.BADGE.JUST_LANDED" }),
      },
    };
  }

  const gameDetailsUrl = getBasePath() + (gameInfoViewUrl?.viewUrl ?? "");
  const quickViewProps: QuickViewGameInfoProps = {
    gameInfoProps,
    onClose: closeQuickView,
    urn,
    gameUrn,
    mainProduct,
    gameLaunchId,
    providerUid,
    currencyCode,
    currencySymbol,
    localeCodeBcp47,
    jackpotAmount,
    tableNames: tableNames || [],
    isBetslipContainerDisplayed,
    dispatchLaunchGame,
    dispatchSubscribeToUpdateGameFeedResults,
    dispatchUnsubscribeToUpdateGameFeedResults,
    isLoggedIn,
    isFavourite,
    isFavouriteGamesEnabled,
    onFavouritesButtonClick,
    uid,
    gameName,
    gameProviderName,
    favouriteGamesErrorState,
    dispatchClearFavouriteGamesError,
  };

  return (
    <div
      className={styles.container}
      ref={(node) => {
        observe(node, gameUrn);
      }}
    >
      <Link
        item={{ viewLink, target: `${viewLink.viewUrl?.includes("switchedToNewTab") ? "_blank" : "_self"}` }}
        onClick={() => onClickHandler(viewLink)}
      >
        <GameTile
          {...newGameTileProps}
          isGameWidget={isGameWidget}
          isRoundGameTile={isRoundGameTile}
          gameDetailsUrl={gameDetailsUrl}
          onInfoButtonClick={onInfoButtonClick}
          onFavouritesButtonClick={onFavouritesButtonClick}
          isFavourite={isFavourite}
          isFavouriteGamesEnabled={isFavouriteGamesEnabled}
          isLoggedIn={isLoggedIn}
          isXmallGameTile={isXmallGameTile}
        />
      </Link>
      {showQuickView && <QuickViewGameInfo data-testid="quick-view-info" {...quickViewProps} />}
      {isErrorVisible && (
        <ErrorToast message={i18n({ key: "I18N.FAVOURITE_GAMES.ERROR_MESSAGE" })} onClose={handleErrorToastClose} />
      )}
    </div>
  );
};

export default GameCard;
