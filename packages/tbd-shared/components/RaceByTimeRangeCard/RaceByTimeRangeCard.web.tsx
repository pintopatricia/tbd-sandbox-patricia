import { FunctionComponent, MouseEvent, useCallback, useMemo } from "react";
import { MarketPromoSignposting } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { RaceLink } from "./snowflakes/RaceLink/RaceLink.web";
import { ComponentProps } from "./props";
import styles from "./RaceByTimeRangeCard.web.css";
import { RaceLinkIcon } from "./snowflakes/RaceLink/RaceLink.types";

/**
 * Function component that wraps a quick links card
 *
 * @param props The component props
 * @returns The react component
 */
const RaceByTimeRangeCard: FunctionComponent<ComponentProps> = ({
  urn,
  title,
  subtitle,
  viewLink,
  isRaceClosed,
  promotion,
  isHorseRacing,
  isGrid,
  dispatchPush,
  dispatchClickAction,
}) => {
  const handleLinkClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      dispatchClickAction(urn, viewLink.viewUrl, title, isRaceClosed);
      dispatchPush(viewLink);
    },
    [dispatchClickAction, dispatchPush, isRaceClosed, title, urn, viewLink],
  );

  const item = useMemo(() => ({ viewLink, title, subtitle }), [subtitle, title, viewLink]);

  const iconStates: RaceLinkIcon[] = useMemo(() => {
    const icons: RaceLinkIcon[] = [];

    if (isRaceClosed) {
      icons.push(RaceLinkIcon.RaceClosed);
    } else if (promotion) {
      icons.push(promotion === MarketPromoSignposting.ExtraPlaces ? RaceLinkIcon.ExtraPlaces : RaceLinkIcon.Promotion);
    }

    return icons;
  }, [isRaceClosed, promotion]);

  return (
    <div className={styles.cardContainer}>
      <RaceLink
        item={item}
        onLinkClick={handleLinkClick}
        iconStates={iconStates}
        isDetailed={isHorseRacing}
        isGrid={isGrid}
      />
    </div>
  );
};

export default RaceByTimeRangeCard;
