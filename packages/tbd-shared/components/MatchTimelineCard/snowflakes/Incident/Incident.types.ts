import { IncidentIconType } from "@ppb/the-wall-common/types";

export enum IncidentDisplayOrder {
  NORMAL = "NORMAL",
  REVERSED = "REVERSED",
  NORMAL_LINES = "NORMAL_LINES",
  REVERSED_LINES = "REVERSED_LINES",
}

export type IncidentProps = {
  icon?: IncidentIconType;
  /** @deprecated Choose minutes instead */
  minute?: number;
  minutes?: string[];
  player: string;
  displayOrder: IncidentDisplayOrder;
};
