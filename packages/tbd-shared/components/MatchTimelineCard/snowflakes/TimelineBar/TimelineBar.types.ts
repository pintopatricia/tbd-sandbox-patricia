import { IncidentIconType } from "@ppb/the-wall-common/types";

export type TimelineBarIncident = {
  minute: number;
  icon: IncidentIconType;
};

export enum TimelineBarViewMode {
  CONDENSED = "CONDENSED",
  NORMAL = "NORMAL",
}

export type TimelineBarProps = {
  periodLength: number; // represents the length of the timeline in minutes. 45 for a regular football half or 15 for extra half
  minute: number; // represents the current period time.
  homeIncidents: TimelineBarIncident[];
  awayIncidents: TimelineBarIncident[];
  caption?: string;
  viewMode?: TimelineBarViewMode;
};
