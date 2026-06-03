import { MouseEvent, useCallback } from "react";
import * as React from "react";
import { CasinoIconName, NavigationIconName, SystemIconName } from "@ppb/the-wall-icons/types";
import { IconButton } from "@ppb/the-wall-web";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { CardIconTypes } from "@ppb/the-wall-common/types";
import { getStoredNewestReleasedGames, initNewReleases } from "../../helpers/gaming-new-releases.web";
import {
  getFavouritesNotificationCount,
  clearFavouritesNotifications,
} from "../../helpers/gaming-favourites-notifications.web";

import { ComponentProps } from "./props";
import styles from "./GamingRibbonCard.web.css";

const GamingRibbonCard: React.FC<ComponentProps> = ({
  urn,
  label,
  icon,
  viewLink,
  games,
  dispatchPushAction,
  dispatchNavigateToGameCategoryViewAction,
  isGamesRibbonHighlighted,
}) => {
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (icon === CardIconTypes.Favourites) {
        clearFavouritesNotifications();
      }

      dispatchPushAction(viewLink);

      dispatchNavigateToGameCategoryViewAction(viewLink, urn, label);
    },
    [dispatchPushAction, viewLink, dispatchNavigateToGameCategoryViewAction, urn, label, icon],
  );

  const GamingRibbonCardIcon: Record<string, Icons> = {
    GAMES: CasinoIconName.MY_GAMES,
    SLOTS: CasinoIconName.SLOTS,
    INSTANTWINS: CasinoIconName.INSTA_WIN,
    ROULETTE: CasinoIconName.ROULETTE,
    BLACKJACK: CasinoIconName.BLACKJACK,
    JACKPOTS: CasinoIconName.TOURNAMENTS,
    LIVECASINO: CasinoIconName.LIVE_CASINO,
    SLINGO: CasinoIconName.BINGO,
    NEW: CasinoIconName.NEW,
    PROMOTIONS: CasinoIconName.PROMOTIONS,
    CRASHGAMES: CasinoIconName.CRASH_GAMES,
    CASINO: NavigationIconName.CASINO,
    FAVOURITES: SystemIconName.HEART_OUTLINE,
  };
  const iconName = GamingRibbonCardIcon[icon];

  let notificationCount;

  if (icon === CardIconTypes.New) {
    if (games?.length > 0) {
      const newReleases = initNewReleases(games);
      notificationCount = newReleases?.new.length;
    } else if (getStoredNewestReleasedGames().length > 0) {
      initNewReleases([]);
    }
  }
  if (icon === CardIconTypes.Favourites) {
    const favouritesCount = getFavouritesNotificationCount();
    if (favouritesCount > 0) {
      notificationCount = favouritesCount;
    }
  }

  return (
    <div className={styles.container}>
      <IconButton
        icon={iconName || CasinoIconName.MY_GAMES}
        text={label}
        isLargeIcon
        isHighlighted={isGamesRibbonHighlighted}
        onPress={onClick}
        notificationCount={notificationCount}
      />
    </div>
  );
};

export default GamingRibbonCard;
