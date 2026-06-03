import { FunctionComponent, MouseEvent, useCallback } from "react";

import { CardIconTypes } from "@ppb/the-wall-common/types";
import { HighlightedLinkCard } from "@ppb/the-wall-web";

import { getStoredNewestReleasedGames, initNewReleases } from "../../helpers/gaming-new-releases.web";

import { LoadedComponentProps } from "./props";
import styles from "./GamingLinkCard.web.css";

const GamingLinkCard: FunctionComponent<LoadedComponentProps> = ({
  urn,
  viewLink,
  name,
  icon,
  zoneTitle,
  games,
  dispatchPushAction,
  dispatchNavigateToGameCategoryViewAction,
}) => {
  const onTapHandler = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      dispatchPushAction(viewLink);

      dispatchNavigateToGameCategoryViewAction(viewLink, urn, zoneTitle, name);
    },
    [dispatchPushAction, viewLink, dispatchNavigateToGameCategoryViewAction, urn, zoneTitle, name],
  );

  let newlyReleasedGames;

  if (games.length > 0) {
    newlyReleasedGames = initNewReleases(games);
  } else if (getStoredNewestReleasedGames().length > 0 && icon === CardIconTypes.New) {
    initNewReleases([]);
  }

  return (
    <HighlightedLinkCard
      onTap={onTapHandler}
      viewLink={viewLink}
      label={name}
      urn={urn}
      games={newlyReleasedGames?.new.length}
      cardIcon={icon}
      className={styles.linkCard}
    />
  );
};

export default GamingLinkCard;
