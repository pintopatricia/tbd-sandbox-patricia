import { ViewLink } from "@ppb/the-wall-common/types";
import URN from "@ppb/tbd-store/state/layout/URN";

export type ContainerProps = {
  urn: string;
};

export type ObbCreatedBetsCardGroupProps = {
  urn: URN;
  title: string;
  headerBadgeLabel?: string;
  headerViewLinkLabel: string;
  headerViewLink?: ViewLink;
  cards: Array<{ urn: URN }>;
};

export type StateProps = ObbCreatedBetsCardGroupProps | Record<string, never>;

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

export type DispatchProps = {
  dispatchLinkClick: (viewLink: ViewLink, cardGroupUrn: URN, label: string) => void;
  dispatchPushAction: (viewLink: ViewLink) => void;
};
