import { FootballMatchStatus } from "../../../entities";
import { ObbParticipant } from "../../../entities/obb-legs/ObbLegs.types";
import URN from "../../URN";
import { ViewLink } from "../ViewLink.types";

export type ObbCreatedBetsCards = {
  [urn: string]: ObbCreatedBetsCard;
};

export type ObbCreatedBetsCard = {
  typename: "ObbCreatedBetsCard";
  urn: URN;
  fixture: URN;
  sportEvent: URN;
  eventViewLink: ViewLink;
  footerViewLink: ViewLink;
  bettingOpportunities: RawObbBettingOpportunity[];
};

export type RawObbBettingOpportunity = {
  participants: string[];
  legId: string;
};

export type SelectorObbCreatedBetsCard = {
  typename: "ObbCreatedBetsCard";
  urn: URN;
  fixture: ObbFixture;
  sportEvent: {
    urn: URN;
    name: string;
  };
  eventViewLink: ViewLink;
  footerViewLink: ViewLink;
  bettingOpportunities: ObbBettingOpportunity[];
};

export type ObbBettingOpportunity = {
  participants: ObbParticipant[];
  legId: string;
};

export type ObbFixture = {
  urn: URN;
  status?: FootballMatchStatus;
  scheduledAt?: Date;
};
