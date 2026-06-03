import type { FunctionComponent, RefCallback } from "react";
import { useCallback, useEffect, useState } from "react";
import classnames from "classnames";
import { RaceDetails, StickyHeader, useOnIntersect } from "@ppb/the-wall-web";
import {
  HEADER_CONTAINER_ID,
  HEADER_SPACE_ID,
} from "@ppb/the-wall-web/components/bricks/StickyHeader/StickyHeader.types";
import { useRaceDetailsCardVM, type RaceDetailsCardProps } from "../viewmodel/RaceDetailsCard.viewmodel";
import SELECTORS from "./RaceDetailsCard.selectors";
import styles from "./RaceDetailsCard.web.module.css";

const RaceDetailsCard: FunctionComponent<RaceDetailsCardProps> = ({
  race,
  meeting,
  locale,
  timezone,
  isHighlighted,
}) => {
  const {
    vm: { data, events },
  } = useRaceDetailsCardVM(race, meeting, locale, timezone);

  const [isSticky, setIsSticky] = useState(false);
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, "210px 100%");
  const setRef = useCallback<RefCallback<HTMLDivElement>>((node) => setIsSticky(!!node), []);

  useEffect(() => {
    if (isIntersecting || isSticky) {
      events.onSubscribe({
        raceUrn: race.raceUrn,
        isHorseRacing: race.isHorseRacing,
      });
    } else {
      events.onUnsubscribe(race.raceUrn);
    }
  }, [isIntersecting, isSticky, race.raceUrn, race.isHorseRacing, events]);

  const baseRaceDetails = (
    <div ref={ref} className={classnames(styles.raceDetailsContainer, styles.nonSticky)}>
      <RaceDetails {...data} isHighlighted={isHighlighted} />
    </div>
  );

  const stickyRaceDetails = (
    <div ref={setRef} className={styles.raceDetailsContainer}>
      <RaceDetails {...data} showMeetingInfo isHighlighted={isHighlighted} />
    </div>
  );

  return (
    <div className={classnames(styles.container, styles.desktopSticky)} data-testid={SELECTORS.TEST_ID}>
      <StickyHeader
        stickyView={stickyRaceDetails}
        attachContainerId={HEADER_CONTAINER_ID}
        attachSpaceId={HEADER_SPACE_ID}
      >
        {baseRaceDetails}
      </StickyHeader>
    </div>
  );
};

export default RaceDetailsCard;
