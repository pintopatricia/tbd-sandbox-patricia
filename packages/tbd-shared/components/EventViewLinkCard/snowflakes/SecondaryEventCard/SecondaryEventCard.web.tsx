import { FunctionComponent, MouseEvent } from "react";
import { ViewLink } from "@ppb/the-wall-common/types/ViewLink.types";
import styles from "./SecondaryEventCard.web.css";

import { SecondaryEventCardProps as SecondaryEventCardCommonProps } from "./SecondaryEventCard.types";

type SecondaryEventCardOnTap = (event: MouseEvent, viewLink: ViewLink, urn: string) => void;

type SecondaryEventCardViewModel = {
  onTap?: SecondaryEventCardOnTap;
};

type SecondaryEventCardWebProps = {
  className?: string;
};

export type SecondaryEventCardProps = SecondaryEventCardCommonProps &
  SecondaryEventCardWebProps &
  SecondaryEventCardViewModel;

export const SecondaryEventCard: FunctionComponent<SecondaryEventCardProps> = ({
  viewLink,
  runnerNameHome,
  runnerNameAway,
  className = "",
  date,
  inplay,
  startTime,
  dateTime,
  onTap,
  urn,
}) => (
  <a
    className={`${className} ${styles.secondaryEventCard} typography-h152`}
    href={viewLink.viewUrl}
    onClick={(e) => onTap && onTap(e, viewLink, urn)}
  >
    <span>{runnerNameHome}</span>
    <span className={styles.runnerNameAway}>{runnerNameAway}</span>
    <div className={styles.startTimeContainer}>
      {inplay ? <span className={styles.inplay}>{inplay}</span> : <time dateTime={dateTime}>{date}</time>}
      {startTime && <time dateTime={dateTime}>{`, ${startTime}`}</time>}
    </div>
  </a>
);
