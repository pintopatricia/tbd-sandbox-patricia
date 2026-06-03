import { ScrollView, View } from "react-native";
import { FunctionComponent, useEffect, useState, useCallback, useRef } from "react";
import { ActionLink } from "@ppb/the-wall-native";
import { ActionLinkColor } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import {
  MATCH_TIMELINE,
  MATCH_TIMELINE_CONTENT,
  MATCH_TIMELINE_DETAILS_CONTAINER,
  MATCH_TIMELINE_DETAILS_NEW_EVENT_CONTAINER,
} from "./MatchTimelineCard.native.selectors";
import { MatchTimelineDetails } from "./snowflakes/MatchTimelineDetails/MatchTimelineDetails.native";
import styles from "./MatchTimelineCard.native.styles";

const MatchTimelineCard: FunctionComponent<ComponentProps> = ({
  matchTimelineDetailsProps,
  incidentsLength,
  buttonText,
  fixtureURN,
  typename,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
}) => {
  const SCROLL_EVENT_THROTTLE = 250;
  const NEW_EVENTS_OFFSET = 10;
  const [isNewEventDisplayed, setIsNewEventDisplayed] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const timelineRef = useRef<View>(null);
  const previousNrOfIncidents = useRef(incidentsLength);

  const onScrollCb = useCallback(() => {
    timelineRef?.current?.measure((...[, , , height, , pageY]: number[]) => {
      const isIntersecting = pageY - height < 0;
      if (isIntersecting) {
        if (incidentsLength > NEW_EVENTS_OFFSET && incidentsLength !== previousNrOfIncidents.current) {
          setIsNewEventDisplayed(true);
        }
      } else {
        setIsNewEventDisplayed(false);
      }
      previousNrOfIncidents.current = incidentsLength;
    });
  }, [incidentsLength]);

  useEffect(() => {
    onScrollCb();
  }, [incidentsLength, onScrollCb]);

  const newEventOnPressCb = useCallback(() => {
    setIsNewEventDisplayed(false);
    scrollViewRef?.current?.scrollTo({
      y: 0,
    });
  }, []);

  useEffect(() => {
    dispatchSubscribeFixtureUpdates(fixtureURN, typename);

    return function unmount() {
      dispatchUnsubscribeFixtureUpdates(fixtureURN, typename);
    };
  }, []); // eslint-disable-line

  // Empty component
  if (!matchTimelineDetailsProps?.matchTimeline) {
    return null;
  }

  return (
    <View {...getTestProps(MATCH_TIMELINE, false)}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={onScrollCb}
        scrollEventThrottle={SCROLL_EVENT_THROTTLE}
        {...getTestProps(MATCH_TIMELINE_CONTENT, false)}
      >
        <View style={styles.matchTimelineDetailsContainer} {...getTestProps(MATCH_TIMELINE_DETAILS_CONTAINER, false)}>
          <MatchTimelineDetails {...matchTimelineDetailsProps} ref={timelineRef} />
        </View>
      </ScrollView>
      {isNewEventDisplayed && (
        <View
          style={styles.newEventButtonContainer}
          {...getTestProps(MATCH_TIMELINE_DETAILS_NEW_EVENT_CONTAINER, false)}
        >
          <ActionLink text={buttonText} color={ActionLinkColor.Default} onClick={newEventOnPressCb} />
        </View>
      )}
    </View>
  );
};

export default MatchTimelineCard;
