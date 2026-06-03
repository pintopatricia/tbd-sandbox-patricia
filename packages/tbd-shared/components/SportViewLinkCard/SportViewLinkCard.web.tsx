import { MouseEvent, useCallback } from "react";
import * as React from "react";
import { IconButton } from "@ppb/the-wall-web";
import { getSportIcon } from "@ppb/the-wall-icons/SportIcon/sports-icon-helper";
import { ComponentProps } from "./props";
import styles from "./SportViewLinkCard.web.css";

const SportViewLinkCard: React.FC<ComponentProps> = ({
  urn,
  sportId,
  sportName,
  sportViewLink,
  dispatchRouterPushAction,
  dispatchNavigationViewFromFavourites,
  isSportsRibbonHighlighted,
}) => {
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      dispatchNavigationViewFromFavourites(urn, sportName, sportViewLink.viewUrl);
      dispatchRouterPushAction(sportViewLink);
    },
    [sportViewLink, urn, sportName, dispatchNavigationViewFromFavourites, dispatchRouterPushAction],
  );

  return (
    <div className={styles.container}>
      <IconButton
        icon={getSportIcon(sportId)}
        text={sportName}
        isLargeIcon
        isHighlighted={isSportsRibbonHighlighted}
        onPress={onClick}
      />
    </div>
  );
};

export default SportViewLinkCard;
