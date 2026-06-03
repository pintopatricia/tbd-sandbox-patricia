import type { JSX } from "react";
import { FunctionComponent } from "react";
import classnames from "classnames";

import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import { TimelineBarIncident, TimelineBarProps, TimelineBarViewMode } from "./TimelineBar.types";
import styles from "./TimelineBar.web.module.css";

function getProportion(x: number, length: number): number {
  return (x * 100) / length;
}

function renderIncidents(incidents: TimelineBarIncident[], periodLength: number): JSX.Element[] {
  return incidents.map((incident) => {
    // compute the incident position on the timeline
    let position = 0;
    if (incident.minute > 1) {
      position = getProportion(incident.minute, periodLength);
    }
    const positionStyle = {
      left: `${position.toFixed(1)}%`,
    };
    return (
      <span key={incident.minute} className={styles.incident} style={positionStyle}>
        {incident.icon && <IncidentIcon type={incident.icon} />}
      </span>
    );
  });
}

export const TimelineBar: FunctionComponent<TimelineBarProps> = ({
  periodLength,
  minute,
  homeIncidents = [],
  awayIncidents = [],
  caption,
  viewMode = TimelineBarViewMode.CONDENSED,
}) => {
  const inPlayLengthStyle = {
    width: `${getProportion(minute, periodLength).toFixed(1)}%`,
  };
  const classNameTimelineBar = classnames(styles.timelineBar, {
    [styles.condensed]: viewMode === TimelineBarViewMode.CONDENSED,
  });

  return (
    <div className={classNameTimelineBar}>
      <div className={styles.wrapper}>
        <div className={styles.incidents}>{renderIncidents(homeIncidents, periodLength)}</div>
        <div className={styles.bar}>
          <div className={`${styles.bar} ${styles.inplay}`} style={inPlayLengthStyle}></div>
        </div>
        <div className={styles.incidents}>{renderIncidents(awayIncidents, periodLength)}</div>
      </div>
      {caption && viewMode === TimelineBarViewMode.NORMAL && (
        <div className={`typography-h120 ${styles.caption}`}>{caption}</div>
      )}
    </div>
  );
};
