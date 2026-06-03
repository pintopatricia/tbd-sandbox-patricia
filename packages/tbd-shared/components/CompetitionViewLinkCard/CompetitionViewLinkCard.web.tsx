import { FunctionComponent, MouseEvent, useCallback } from "react";

import { CircularImageSize } from "./snowflakes/CircularImage/CircularImage.types";
import { CircularImage } from "./snowflakes/CircularImage/CircularImage.web";

import { ComponentProps } from "./props";
import styles from "./CompetitionViewLinkCard.web.css";

const CompetitionViewLinkCard: FunctionComponent<ComponentProps> = ({
  urn,
  viewLink,
  name,
  logo,
  fallbackIcon,
  dispatchNavigateToCompetitionView,
  dispatchRouterPushAction,
}) => {
  const onCompetitionLinkClick = useCallback(
    (e: MouseEvent): void => {
      e.preventDefault();

      if (viewLink) {
        dispatchNavigateToCompetitionView(viewLink.viewUrl, name, urn);
        dispatchRouterPushAction(viewLink);
      }
    },
    [viewLink, dispatchNavigateToCompetitionView, name, urn, dispatchRouterPushAction],
  );

  return (
    <a key={urn} className={styles.container} href={viewLink.viewUrl} onClick={onCompetitionLinkClick}>
      <CircularImage
        imageURL={logo}
        imageAlt={name}
        fallbackIcon={fallbackIcon}
        text={name}
        size={CircularImageSize.Small}
      />
    </a>
  );
};

export default CompetitionViewLinkCard;
