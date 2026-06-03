import { ViewLink } from "@ppb/the-wall-common/types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ObbFormattedQuote, ObbLegTemplateId } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { ObbPositionType } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";

export type ContainerProps = {
  urn: URN;
  fullWidth: boolean;
  cardIndex: number;
};

export type ObbCreatedBetsCardBettingOpportunities = {
  legId: string;
  legTemplateId: ObbLegTemplateId;
  title: string;
  statsLabel: string | null;
  subtitle: string;
  quote: ObbFormattedQuote;
};

export type ObbCreatedBetsCardProps = {
  fixtureUrn: URN;
  eventUrn: URN;
  eventName: string;
  eventViewLink: ViewLink;
  footerViewLink: ViewLink;
  footerLabel: string;
  isEventInPlay: boolean;
  position: ObbPositionType;
  bettingOpportunities: ObbCreatedBetsCardBettingOpportunities[];
};

export type StateProps = ObbCreatedBetsCardProps | Record<string, never>;

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

export type DispatchProps = {
  dispatchInactiveObbBetButtonClick: (legTemplateId?: ObbLegTemplateId) => void;
  dispatchPushAction: (viewLink: ViewLink) => void;
  dispatchLinkClick: (viewLink: ViewLink, urn: URN, label?: string, eventName?: string, cardIndex?: number) => void;
};
