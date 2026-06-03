import { FunctionComponent, useCallback, useEffect, useRef, useState, MouseEvent, RefCallback } from "react";
import classnames from "classnames";

import { RaceDetails, Link, StickyHeader, useOnIntersect } from "@ppb/the-wall-web";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import {
  HEADER_CONTAINER_ID,
  HEADER_SPACE_ID,
} from "@ppb/the-wall-web/components/bricks/StickyHeader/StickyHeader.types";

import INTERSECTION_CONFIG from "../../config/cards-intersection";

import { ComponentProps } from "./props";
import styles from "./RaceDetailsCard.web.css";

const RaceDetailsCard: FunctionComponent<ComponentProps> = ({
  countryFlag,
  raceTime,
  meetingName,
  showDuration,
  date,
  dateTime,
  raceName,
  raceStatus,
  raceStatusLabel,
  numberOfRunners,
  raceClass,
  raceDetailsTitle,
  runnersLabel,
  trackGoing,
  showMeetingInfo,
  stickyOnScroll,
  isRaceRunningStatus,
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  raceURN,
  viewLink,
  dispatchPushAction,
  isHighlighted,
}) => {
  const raceDetailsProps = {
    countryFlag,
    raceTime,
    meetingName,
    showDuration,
    date,
    dateTime,
    runnersLabel,
    raceName,
    numberOfRunners,
    raceClass,
    raceDetailsTitle,
    trackGoing,
    raceStatusLabel,
    showMeetingInfo,
    isRaceRunningStatus,
    isHighlighted,
  };

  const isRaceSubscribedToUpdates = useRef(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, INTERSECTION_CONFIG.rootMargin);

  const setRef = useCallback<RefCallback<HTMLDivElement>>((node) => setIsSticky(!!node), []);
  const raceDetailsContainer = classnames(styles.container, {
    [styles.desktopSticky]: stickyOnScroll,
  });

  useEffect(() => {
    if (raceStatus) {
      if ((isIntersecting || isSticky) && !isRaceSubscribedToUpdates.current) {
        dispatchSubscribeRaceUpdates(raceURN);
        isRaceSubscribedToUpdates.current = true;
      } else if (!isIntersecting && !isSticky && isRaceSubscribedToUpdates.current) {
        dispatchUnsubscribeRaceUpdates(raceURN);
        isRaceSubscribedToUpdates.current = false;
      }
    }
  }, [dispatchSubscribeRaceUpdates, dispatchUnsubscribeRaceUpdates, isIntersecting, isSticky, raceStatus, raceURN]);

  const onClickLink = useCallback(
    (link: ViewLink, e: MouseEvent) => {
      e.preventDefault();
      dispatchPushAction(link);
    },
    [dispatchPushAction],
  );

  const baseRaceDetails = (
    <div ref={ref} className={classnames(styles.raceDetailsContainer, styles.nonSticky)}>
      <RaceDetails {...raceDetailsProps} />
    </div>
  );

  const stickyRaceDetails = (
    <div ref={setRef} className={styles.raceDetailsContainer}>
      <RaceDetails {...raceDetailsProps} showMeetingInfo />
    </div>
  );

  const renderRaceDetails = viewLink ? (
    <Link item={{ viewLink }} onClick={(event) => onClickLink(viewLink, event)} style={styles.raceViewLink}>
      {baseRaceDetails}
    </Link>
  ) : (
    baseRaceDetails
  );

  return (
    <div className={raceDetailsContainer}>
      {stickyOnScroll ? (
        <StickyHeader
          stickyView={stickyRaceDetails}
          attachContainerId={HEADER_CONTAINER_ID}
          attachSpaceId={HEADER_SPACE_ID}
        >
          {renderRaceDetails}
        </StickyHeader>
      ) : (
        renderRaceDetails
      )}
    </div>
  );
};

export default RaceDetailsCard;
