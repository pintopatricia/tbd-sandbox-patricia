import { ViewLink } from "@ppb/the-wall-common/types/ViewLink.types";

export enum RaceLinkIcon {
  RaceClosed = "RACE_CLOSED",
  Promotion = "MONEY_BACK",
  ExtraPlaces = "EXTRA_PLACES",
}

export type RaceLinkCommonProps = {
  item: { viewLink: ViewLink; title: string; subtitle?: string };
  iconStates: RaceLinkIcon[];
  isDetailed?: boolean;
  isGrid: boolean;
};
