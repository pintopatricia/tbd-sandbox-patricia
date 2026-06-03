import type { JSX } from "react";
import { FunctionComponent } from "react";
import classnames from "classnames";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SportsIconName } from "@ppb/the-wall-icons";

import { TimelineBarProps, TimelineBarViewMode } from "../TimelineBar/TimelineBar.types";
import { MatchTimelineProps, MatchTimelineViewMode } from "./MatchTimeline.types";
import { TimelineBar } from "../TimelineBar/TimelineBar.web";
import { IncidentNotification } from "../IncidentNotification/IncidentNotification.web";

import styles from "./MatchTimeline.web.module.css";

function renderTimelines(timelines: TimelineBarProps[], timelineViewMode: TimelineBarViewMode): JSX.Element[] {
  const matchLength = timelines.reduce(
    (sum: number, timeline: TimelineBarProps): number => sum + timeline.periodLength,
    0,
  );
  return timelines.map((timelineBarProps, index) => {
    const timelineWidth = (timelineBarProps.periodLength * 100) / matchLength;
    const widthStyle = {
      width: `${timelineWidth.toFixed(1)}%`,
    };
    const timelineProps = {
      ...timelineBarProps,
      viewMode: timelineViewMode,
    };
    return (
      <div className={styles.timeline} style={widthStyle} key={index}>
        <TimelineBar {...timelineProps} />
      </div>
    );
  });
}

export const MatchTimeline: FunctionComponent<MatchTimelineProps> = ({
  homeCrest,
  awayCrest,
  lastIncident,
  timelines,
  translations,
  viewMode = MatchTimelineViewMode.NORMAL,
}) => {
  const timelineViewMode =
    viewMode === MatchTimelineViewMode.CONDENSED ? TimelineBarViewMode.CONDENSED : TimelineBarViewMode.NORMAL;

  const classNameMatchTimeline = classnames(styles.matchTimeline, {
    [styles.condensed]: viewMode === MatchTimelineViewMode.CONDENSED,
  });

  return (
    <div className={classNameMatchTimeline}>
      <div className={styles.timelineContainer}>
        <div className={styles.teamCrests}>
          {homeCrest ? (
            <img className={styles.teamCrest} src={homeCrest} alt="" />
          ) : (
            <GenericIcon name={SportsIconName.TEAM_CREST} color={"var(--neutrals-icon-secondary)"} />
          )}
          {viewMode === MatchTimelineViewMode.NORMAL && (
            <div className={`typography-h120 ${styles.prematch}`}>{translations.prematch}</div>
          )}
          {awayCrest ? (
            <img className={styles.teamCrest} src={awayCrest} alt="" />
          ) : (
            <GenericIcon name={SportsIconName.TEAM_CREST} color={"var(--neutrals-icon-secondary)"} />
          )}
        </div>
        <div className={styles.timelines}>{renderTimelines(timelines, timelineViewMode)}</div>
      </div>
      {lastIncident && viewMode === MatchTimelineViewMode.CONDENSED && (
        <IncidentNotification
          minute={`${lastIncident.minute}'`}
          incidentLabel={lastIncident.label}
          playerName={lastIncident.player}
          teamName={lastIncident.team}
        />
      )}
    </div>
  );
};
