import URN from "@ppb/tbd-store/state/layout/URN";

export type ContainerProps = {
  urn: URN;
};

export type ObbPopularBettingOpportunityProps = {
  title: string;
  subtitle: string;
  stats: string | null;
  legId: string;
  timesBackedLabel?: string;
};

export type ObbEventPopularsCardProps = {
  title: string;
  badgeText?: string;
  showPopularEvidence: boolean;
  showStats: boolean;
  eventName: string;
  initialNumberOfVisibleBettingOpportunities: number;
  hasEventStarted: boolean;
  popularBettingOpportunities: Array<ObbPopularBettingOpportunityProps>;
};

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

export type StateProps = ObbEventPopularsCardProps | Record<string, never>;

export type DispatchProps = {
  dispatchDeleteObbEventPopularsCard: () => void;
  dispatchObbEventPopularsCardToggleShowMore: (cardUrn: string, eventName: string, showMore: boolean) => void;
};
