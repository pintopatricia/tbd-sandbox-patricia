import type { JSX } from "react";
import { forwardRef } from "react";
import { ScrollView, View, StyleProp, ViewStyle } from "react-native";
import { MatchStats, Text } from "@ppb/the-wall-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { IncidentEvents } from "../IncidentEvents/IncidentEvents.native";
import { MinuteByMinute } from "../MinuteByMinute/MinuteByMinute.native";
import { MatchTimeline } from "../MatchTimeline/MatchTimeline.native";
import { MinuteIncidentsProps } from "../MinuteIncidents/MinuteIncidents.types";
import { MatchTimelineViewMode } from "../MatchTimeline/MatchTimeline.types";
import {
  MATCH_TIMELINE_DETAILS,
  MTD_MATCH_TIMELINE,
  MTD_INCIDENT_EVENTS,
  MTD_MINUTE_BY_MINUTE,
  MTD_MINUTE_BY_MINUTE_TITLE,
  MTD_MBM_EXTRA_TIME_SH,
  MTD_MBM_EXTRA_TIME_FH,
  MTD_MBM_SECOND_HALF,
  MTD_MBM_FIRST_HALF,
  MTD_MATCH_STATS,
  MTD_EXTRA_END_CONTAINER,
  MTD_EXTRA_FH_END_CONTAINER,
  MTD_FULL_TIME_END_CONTAINER,
  MTD_HALF_TIME_END_CONTAINER,
} from "./MatchTimelineDetails.native.selectors";
import { PeriodStatusNotification } from "../PeriodStatusNotification/PeriodStatusNotification.native";

import { MatchTimelineDetailsProps, MatchTimelineDetailsStats } from "./MatchTimelineDetails.types";
import styles from "./MatchTimelineDetails.native.styles";

const buildPeriod = (
  matchStatsSelector: string,
  minutesByMinutesSelector: string,
  isThereNextMinByMin: boolean,
  isToExtendLineBelow: boolean,
  matchStats?: MatchTimelineDetailsStats,
  minutesByMinutes?: MinuteIncidentsProps[],
): JSX.Element | null => {
  const extendedLineStyles: StyleProp<ViewStyle> = [];
  const minByMinContainerStyles: StyleProp<ViewStyle> = [];

  if (!matchStats && !minutesByMinutes) {
    return null;
  }

  if (matchStats) {
    extendedLineStyles.push(styles.lineExtensionTop);
  } else if (isThereNextMinByMin) {
    minByMinContainerStyles.push(styles.sequentialMinByMin);
  }

  if (isToExtendLineBelow) {
    extendedLineStyles.push(styles.lineExtensionBottom);
  }

  return (
    <>
      {!!matchStats && (
        <View style={styles.periodEndContainer} {...getTestProps(matchStatsSelector, false)}>
          <PeriodStatusNotification {...matchStats.periodStat} />
          {!!matchStats.stats?.length && (
            <View {...getTestProps(MTD_MATCH_STATS, false)} style={styles.matchStatsContainer}>
              <MatchStats barStats={matchStats.stats} />
            </View>
          )}
        </View>
      )}

      {!!minutesByMinutes?.length && (
        <View {...getTestProps(minutesByMinutesSelector, false)} style={minByMinContainerStyles}>
          <MinuteByMinute incidents={minutesByMinutes} lineExtensionStyle={extendedLineStyles} />
        </View>
      )}
    </>
  );
};

export const MatchTimelineDetails = forwardRef<View, MatchTimelineDetailsProps>(
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
    const hasIncidents = incidentEvents.homeIncidents.length > 0 || incidentEvents.awayIncidents.length > 0;

    return (
      <ScrollView {...getTestProps(MATCH_TIMELINE_DETAILS, false)}>
        <View {...getTestProps(MTD_MATCH_TIMELINE, false)}>
          <MatchTimeline {...matchTimeline} viewMode={MatchTimelineViewMode.NORMAL} />
        </View>

        {hasIncidents && (
          <View style={styles.incidentEvents} {...getTestProps(MTD_INCIDENT_EVENTS, false)}>
            <IncidentEvents {...incidentEvents} />
          </View>
        )}

        {displayMinuteByMinute && (
          <View {...getTestProps(MTD_MINUTE_BY_MINUTE, false)}>
            <Text style={styles.minuteByMinuteTitle} ref={ref} {...getTestProps(MTD_MINUTE_BY_MINUTE_TITLE, false)}>
              {i18N.minuteByMinuteTitle}
            </Text>

            {buildPeriod(
              MTD_EXTRA_END_CONTAINER,
              MTD_MBM_EXTRA_TIME_SH,
              false, // there is never a min by min above extra time second half
              !!matchStatsExtraFH,
              matchStatsExtraEnd,
              minutesByMinutesExtraTimeSH,
            )}

            {buildPeriod(
              MTD_EXTRA_FH_END_CONTAINER,
              MTD_MBM_EXTRA_TIME_FH,
              !!minutesByMinutesExtraTimeSH,
              !!matchStatsFullTime,
              matchStatsExtraFH,
              minutesByMinutesExtraTimeFH,
            )}

            {buildPeriod(
              MTD_FULL_TIME_END_CONTAINER,
              MTD_MBM_SECOND_HALF,
              !!minutesByMinutesExtraTimeFH,
              !!matchStatsHalfTime,
              matchStatsFullTime,
              minutesByMinutesSecondHalf,
            )}

            {buildPeriod(
              MTD_HALF_TIME_END_CONTAINER,
              MTD_MBM_FIRST_HALF,
              !!minutesByMinutesSecondHalf,
              false, // the first half min by min line is never extended to the bottom
              matchStatsHalfTime,
              minutesByMinutesFirstHalf,
            )}
          </View>
        )}
      </ScrollView>
    );
  },
);

MatchTimelineDetails.displayName = "MatchTimelineDetails";
