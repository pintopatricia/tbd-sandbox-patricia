import { FunctionComponent, useCallback } from "react";

import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { ComponentProps } from "./props";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { GameInfo } from "./snowflakes/GameInfo/GameInfo.web";
import { getLaunchUrl } from "../../view-model-factories/game";
import { useFavouriteGamesErrorToast } from "../../hooks/useFavouriteGamesErrorToast";
import { ErrorToast } from "../ErrorToast/ErrorToast.web";

const ConnectedGameInfo: FunctionComponent<ComponentProps & { gameUrn: string; actionsClassName?: string }> = ({
  urn,
  gameUrn,
  currencyCode,
  currencySymbol,
  gameLaunchId,
  providerUid,
  mainProduct,
  gameInfoProps,
  dispatchLaunchGame,
  dispatchSubscribeToUpdateGameFeedResults,
  dispatchUnsubscribeToUpdateGameFeedResults,
  dispatchAddToFavouriteGames,
  dispatchRemoveFromFavouriteGames,
  tableNames,
  isBetslipContainerDisplayed,
  actionsClassName,
  isLoggedIn,
  isFavourite,
  isFavouriteGamesEnabled,
  onFavouritesButtonClick,
  uid,
  favouriteGamesErrorState,
  dispatchClearFavouriteGamesError,
}) => {
  const { isVisible: isErrorVisible, hideToast } = useFavouriteGamesErrorToast({
    errorTimestamp: favouriteGamesErrorState?.timestamp ?? null,
    errorGameId: favouriteGamesErrorState?.gameId ?? null,
    gameId: uid,
    onDismiss: dispatchClearFavouriteGamesError,
  });

  const launchUrl = {
    viewUrn: "ppb:tbd:view:external",
    viewUrl: getLaunchUrl(gameLaunchId, providerUid, mainProduct, false, window.location.href),
  };

  const launchUrlDemoMode = {
    viewUrn: "ppb:tbd:view:external",
    viewUrl: getLaunchUrl(gameLaunchId, providerUid, mainProduct, false, window.location.href, true),
  };

  const playNowButtonOnClick = useCallback(
    (isDemo?: boolean) => dispatchLaunchGame(isDemo ? launchUrlDemoMode : launchUrl, urn, gameUrn, PlatformType.Web),
    [dispatchLaunchGame, launchUrl, launchUrlDemoMode, urn, gameUrn],
  );

  const { observe } = useVisibilityObserver({
    onShow: (refUrn) => dispatchSubscribeToUpdateGameFeedResults(refUrn, tableNames, currencyCode),
    onHide: () => dispatchUnsubscribeToUpdateGameFeedResults(urn, tableNames, currencyCode),
  });

  if (!urn) {
    return null;
  }

  return (
    <>
      <GameInfo
        cardRef={(node) => observe(node, urn)}
        {...gameInfoProps}
        currencySymbol={currencySymbol}
        playNowButtonOnClick={playNowButtonOnClick}
        launchUrl={launchUrl}
        urlsTarget={`${launchUrl.viewUrl.includes("switchedToNewTab") ? "_blank" : "_self"}`}
        launchUrlDemoMode={launchUrlDemoMode}
        isBetslipContainerDisplayed={isBetslipContainerDisplayed}
        className={actionsClassName}
        isLoggedIn={isLoggedIn}
        isFavourite={isFavourite}
        isFavouriteGamesEnabled={isFavouriteGamesEnabled}
        onFavouritesButtonClick={onFavouritesButtonClick}
        gameLaunchId={gameLaunchId}
        dispatchAddToFavouriteGames={dispatchAddToFavouriteGames}
        dispatchRemoveFromFavouriteGames={dispatchRemoveFromFavouriteGames}
        mainProduct={mainProduct}
        uid={uid}
      />
      {isErrorVisible && <ErrorToast message={"Failed to update favourite games"} onClose={hideToast} />}
    </>
  );
};

export default ConnectedGameInfo;
