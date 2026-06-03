import { ViewLink } from "@ppb/the-wall-common/types/ViewLink.types";

export type SecondaryEventCardProps = {
  urn: string;
  viewLink: ViewLink;
  runnerNameHome: string;
  runnerNameAway: string;
  date?: string;
  inplay?: string;
  startTime?: string;
  dateTime?: string;
};
