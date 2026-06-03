import { BarStatProps } from "@ppb/the-wall-common/types";

import { IncidentEventsProps } from "../IncidentEvents/IncidentEvents.types";
import { MinuteIncidentsProps } from "../MinuteIncidents/MinuteIncidents.types";
import { PeriodStatusNotificationProps } from "../PeriodStatusNotification/PeriodStatusNotification.types";
import { MatchTimelineProps } from "../MatchTimeline/MatchTimeline.types";

type MatchTimelineDetailsI18N = {
  minuteByMinuteTitle: string;
};

export type MatchTimelineDetailsProps = {
  matchTimeline: MatchTimelineProps;
  incidentEvents: IncidentEventsProps;
  minutesByMinutesFirstHalf: MinuteIncidentsProps[];
  minutesByMinutesSecondHalf?: MinuteIncidentsProps[];
  minutesByMinutesExtraTimeFH?: MinuteIncidentsProps[];
  minutesByMinutesExtraTimeSH?: MinuteIncidentsProps[];
  matchStatsHalfTime?: MatchTimelineDetailsStats;
  matchStatsFullTime?: MatchTimelineDetailsStats;
  matchStatsExtraFH?: MatchTimelineDetailsStats;
  matchStatsExtraEnd?: MatchTimelineDetailsStats;
  i18N: MatchTimelineDetailsI18N;
};

export type MatchTimelineDetailsStats = {
  periodStat: PeriodStatusNotificationProps;
  stats?: BarStatProps[];
};
