import { NavigationTabLabelState } from "@ppb/the-wall-common/types";
import { NavigationTabLabel } from "@ppb/the-wall-web";
import { MouseEvent, useCallback } from "react";
import * as React from "react";
import { ComponentProps } from "./props";
import styles from "./GenericViewLinkCard.web.css";

const GenericViewLinkCard: React.FC<ComponentProps> = ({
  urn,
  viewLink,
  icon,
  title,
  inPlay,
  dispatchRouterPushAction,
  dispatchNavigationViewFromFavourites,
}) => {
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      dispatchNavigationViewFromFavourites(title, viewLink.viewUrl, urn);

      dispatchRouterPushAction(viewLink);
    },
    [dispatchRouterPushAction, viewLink, dispatchNavigationViewFromFavourites, title, urn],
  );

  return (
    <a href={viewLink.viewUrl} onClick={onClick} className={styles.container}>
      <NavigationTabLabel
        id={"1"}
        text={title}
        icon={icon}
        inPlay={inPlay}
        state={NavigationTabLabelState.Active}
      ></NavigationTabLabel>
    </a>
  );
};

export default GenericViewLinkCard;
