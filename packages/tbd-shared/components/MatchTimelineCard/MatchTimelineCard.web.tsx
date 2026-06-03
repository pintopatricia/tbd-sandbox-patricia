import { FunctionComponent, useCallback, useState, useEffect, useRef } from "react";
import { ActionLink } from "@ppb/the-wall-web";

import { MatchTimelineDetails } from "./snowflakes/MatchTimelineDetails/MatchTimelineDetails.web";
import { ComponentProps } from "./props";
import styles from "./MatchTimelineCard.web.css";

const MatchTimelineCard: FunctionComponent<ComponentProps> = ({
  matchTimelineDetailsProps,
  incidentsLength,
  buttonText,
  fixtureURN,
  typename,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
}) => {
  const DISPLAY_NEW_EVENT_AFTER_INCIDENTS = 10;
  const [isNewEventDisplayed, setIsNewEventDisplayed] = useState(false);
  const previousNumberOfIncidents = useRef(incidentsLength);
  const timelineRef = useRef<HTMLDivElement>(null);

  const scrollTimelineIntoView = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [timelineRef]);

  useEffect(() => {
    const cachedRef = timelineRef.current;

    let observer: IntersectionObserver | null = null;

    if (cachedRef) {
      observer = new IntersectionObserver(
        ([e]) => {
          if (e.intersectionRatio < 1) {
            if (
              incidentsLength > DISPLAY_NEW_EVENT_AFTER_INCIDENTS &&
              incidentsLength !== previousNumberOfIncidents.current
            ) {
              setIsNewEventDisplayed(true);
            }
          } else {
            setIsNewEventDisplayed(false);
          }
          previousNumberOfIncidents.current = incidentsLength;
        },
        {
          rootMargin: "0px",
          threshold: [1],
        },
      );

      observer.observe(cachedRef);
    }

    return () => {
      if (cachedRef) {
        observer?.unobserve(cachedRef);
      }
    };
  }, [timelineRef, incidentsLength, setIsNewEventDisplayed]);

  useEffect(() => {
    dispatchSubscribeFixtureUpdates(fixtureURN, typename);

    return () => {
      dispatchUnsubscribeFixtureUpdates(fixtureURN, typename);
    };
  }, []); // eslint-disable-line

  return (
    <div className={styles.matchTimelineCard}>
      <div className={styles.content}>
        <MatchTimelineDetails {...matchTimelineDetailsProps} ref={timelineRef} />
      </div>
      {isNewEventDisplayed && (
        <div className={styles.newEventContainer}>
          <ActionLink text={buttonText} onClick={scrollTimelineIntoView} />
        </div>
      )}
    </div>
  );
};

export default MatchTimelineCard;
