import type { FunctionComponent, JSX } from "react";
import { useCallback } from "react";

import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import styles from "./FavouriteIcon.web.css";
import type { ComponentProps } from "./props";
import classnames from "classnames";

const FavouriteIcon: FunctionComponent<ComponentProps> = ({
  urn,
  contentSectionURN,
  isPressBlocked,
  isFavourite,
  dispatchToggleFavouriteAction,
}): JSX.Element | null => {
  const onIconPress = useCallback(
    (event: React.MouseEvent): void => {
      event.stopPropagation();

      if (isPressBlocked) {
        return;
      }

      dispatchToggleFavouriteAction(contentSectionURN, !isFavourite, urn);
    },
    [contentSectionURN, dispatchToggleFavouriteAction, isFavourite, isPressBlocked, urn],
  );

  if (isFavourite === undefined) {
    return null;
  }

  const icon = isFavourite ? IconsList.FAVOURITE_FILLED : IconsList.FAVOURITE_OUTLINE;
  const iconColor = isFavourite ? "var(--favourite-icon-selected-colour)" : "var(--favourite-icon-unselected-colour)";

  return (
    <div className={classnames(styles.favouriteIcon)}>
      <button className={classnames(styles.buttonContainer)} onClick={onIconPress} data-testid="favourite-icon-button">
        <div className={classnames(styles.iconContainer)}>
          <GenericIcon color={iconColor} name={icon} />
        </div>
      </button>
    </div>
  );
};

export default FavouriteIcon;
