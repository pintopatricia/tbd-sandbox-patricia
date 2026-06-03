import { FunctionComponent, useCallback, MouseEvent } from "react";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { SecondaryEventCard } from "./snowflakes/SecondaryEventCard/SecondaryEventCard.web";
import { ComponentProps } from "./props";

/**
 *
 * @param props The props mapped by mapStateToProps
 * @returns The react component
 */
const EventViewLinkCard: FunctionComponent<ComponentProps> = ({
  viewlink,
  fixtureURN,
  sportEventURN,
  dispatchClickCard,
  dispatchPushAction,
}) => {
  const onClickHandler = useCallback(
    (event: MouseEvent, viewLink: ViewLink, cardUrn: string) => {
      const { viewUrl } = viewLink;
      event.preventDefault();

      dispatchClickCard(cardUrn, sportEventURN, viewUrl, fixtureURN);
      dispatchPushAction(viewLink);
    },
    [dispatchClickCard, dispatchPushAction, fixtureURN, sportEventURN],
  );
  return <SecondaryEventCard onTap={onClickHandler} {...viewlink} />;
};

export default EventViewLinkCard;
