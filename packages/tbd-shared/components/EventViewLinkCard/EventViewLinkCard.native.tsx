import { FunctionComponent, useCallback } from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { GestureResponderEvent } from "react-native";
import { navigate } from "@ppb/tbd-router/native";
import styles from "./EventViewLinkCard.native.styles";
import { ComponentProps } from "./props";
import { SecondaryEventCard } from "./snowflakes/SecondaryEventCard/SecondaryEventCard.native";

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
}) => {
  const onPressHandler = useCallback(
    (_event: GestureResponderEvent | null, viewLink: ViewLink, urn: URN): void => {
      const { viewUrl } = viewLink;
      dispatchClickCard(urn, sportEventURN, viewUrl, fixtureURN);
      navigate(viewLink);
    },
    [dispatchClickCard, fixtureURN, sportEventURN],
  );
  if (!viewlink) return null;
  return <SecondaryEventCard onTap={onPressHandler} style={styles.linkCard} {...viewlink} />;
};

export default EventViewLinkCard;
