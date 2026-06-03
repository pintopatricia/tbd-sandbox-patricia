import { FunctionComponent, useCallback, useMemo } from "react";
import { navigate } from "@ppb/tbd-router/native";
import { MarketPromoSignposting } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

import { RaceLink } from "./snowflakes/RaceLink/RaceLink.native";
import { ComponentProps } from "./props";
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
  dispatchClickAction,
}) => {
  const handleLinkPress = useCallback(() => {
    dispatchClickAction(urn, viewLink.viewUrl, title, isRaceClosed);
    navigate(viewLink);
  }, [dispatchClickAction, isRaceClosed, title, urn, viewLink]);

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
    <RaceLink
      item={item}
      onPress={handleLinkPress}
      iconStates={iconStates}
      isDetailed={isHorseRacing}
      isGrid={isGrid}
    />
  );
};

export default RaceByTimeRangeCard;
