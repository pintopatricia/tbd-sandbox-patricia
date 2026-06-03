import URN from "../../../../../state/layout/URN";
import { ObbParticipant } from "../../../../../state/entities/obb-legs/ObbLegs.types";
import { NormalizedObbLeg } from "../../entities/obb-leg/ObbLeg.types";
import { ViewLink } from "../../../../../state/layout/cards/ViewLink.types";

export type ObbBettingOpportunity = {
  participants: ObbParticipant[];
  leg: NormalizedObbLeg;
};

export type NormalizedObbCreatedBetsCard = {
  typename: "ObbCreatedBetsCard";
  urn: URN;
  fixture: URN;
  sportEvent: URN;
  eventViewLink: ViewLink;
  footerViewLink: ViewLink;
  bettingOpportunities: ObbBettingOpportunity[];
};
