import { forwardRef } from "react";

import { MatchStats } from "@ppb/the-wall-web";

import { MatchTimelineViewMode } from "../MatchTimeline/MatchTimeline.types";
import { MatchTimelineDetailsProps } from "./MatchTimelineDetails.types";

import { IncidentEvents } from "../IncidentEvents/IncidentEvents.web";
import { MinuteByMinute } from "../MinuteByMinute/MinuteByMinute.web";
import { MatchTimeline } from "../MatchTimeline/MatchTimeline.web";
import { PeriodStatusNotification } from "../PeriodStatusNotification/PeriodStatusNotification.web";

import styles from "./MatchTimelineDetails.web.css";

export const MatchTimelineDetails = forwardRef<HTMLDivElement, MatchTimelineDetailsProps>(
  (
    {
      matchTimeline,
      incidentEvents,
      minutesByMinutesFirstHalf,
      minutesByMinutesSecondHalf,
      minutesByMinutesExtraTimeFH,
      minutesByMinutesExtraTimeSH,
      matchStatsHalfTime,
      matchStatsFullTime,
      matchStatsExtraFH,
      matchStatsExtraEnd,
      i18N,
    },
    ref,
  ) => {
    const displayMinuteByMinute = minutesByMinutesFirstHalf.length >= 4;
    return (
      <div className={styles.matchTimelineDetails}>
        <div className={styles.matchTimelineWrapper}>
          <MatchTimeline {...matchTimeline} viewMode={MatchTimelineViewMode.NORMAL} />
        </div>
        <div className={styles.incidentEventsWrapper}>
          <IncidentEvents {...incidentEvents} />
        </div>

        {displayMinuteByMinute && (
          <div className={styles.minuteByMinuteTitle} ref={ref}>
            {i18N.minuteByMinuteTitle}
          </div>
        )}

        {displayMinuteByMinute && matchStatsExtraEnd && (
          <div className={styles.matchStats}>
            <PeriodStatusNotification {...matchStatsExtraEnd.periodStat} />
          </div>
        )}

        {displayMinuteByMinute && minutesByMinutesExtraTimeSH && (
          <div className={styles.minuteByMinute}>
            <MinuteByMinute incidents={minutesByMinutesExtraTimeSH} />
          </div>
        )}

        {displayMinuteByMinute && matchStatsExtraFH && (
          <div className={styles.matchStats}>
            <PeriodStatusNotification {...matchStatsExtraFH.periodStat} />
            {matchStatsExtraFH.stats && matchStatsExtraFH?.stats?.length > 0 && (
              <MatchStats barStats={matchStatsExtraFH.stats} />
            )}
          </div>
        )}

        {displayMinuteByMinute && minutesByMinutesExtraTimeFH && (
          <div className={styles.minuteByMinute}>
            <MinuteByMinute incidents={minutesByMinutesExtraTimeFH} />
          </div>
        )}

        {displayMinuteByMinute && matchStatsFullTime && (
          <div className={styles.matchStats}>
            <PeriodStatusNotification {...matchStatsFullTime.periodStat} />
            {matchStatsFullTime.stats && matchStatsFullTime?.stats?.length > 0 && (
              <MatchStats barStats={matchStatsFullTime.stats} />
            )}
          </div>
        )}

        {displayMinuteByMinute && minutesByMinutesSecondHalf && (
          <div className={styles.minuteByMinute}>
            <MinuteByMinute incidents={minutesByMinutesSecondHalf} />
          </div>
        )}

        {displayMinuteByMinute && matchStatsHalfTime && (
          <div className={styles.matchStats}>
            <PeriodStatusNotification {...matchStatsHalfTime.periodStat} />
            {matchStatsHalfTime.stats && matchStatsHalfTime?.stats?.length > 0 && (
              <MatchStats barStats={matchStatsHalfTime.stats} />
            )}
          </div>
        )}

        {displayMinuteByMinute && minutesByMinutesFirstHalf && (
          <div className={styles.minuteByMinute}>
            <MinuteByMinute incidents={minutesByMinutesFirstHalf} />
          </div>
        )}
      </div>
    );
  },
);

MatchTimelineDetails.displayName = "MatchTimelineDetails";
