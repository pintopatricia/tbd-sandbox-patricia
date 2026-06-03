import { IncidentIconType } from "@ppb/the-wall-common/types";
import { TimelineBarProps } from "../TimelineBar/TimelineBar.types";

export type MatchTimelineIncident = {
  minute: number;
  extraMinutes?: string;
  icon?: IncidentIconType;
  label: string;
  player: string;
  team: string;
};

export enum MatchTimelineViewMode {
  CONDENSED = "CONDENSED",
  NORMAL = "NORMAL",
}

export type MatchTimelineI18N = {
  prematch: string;
};

export type MatchTimelineProps = {
  homeCrest?: string;
  awayCrest?: string;
  lastIncident?: MatchTimelineIncident;
  timelines: TimelineBarProps[];
  translations: MatchTimelineI18N;
  viewMode?: MatchTimelineViewMode;
};
