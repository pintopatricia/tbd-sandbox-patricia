import URN from "../../../../../state/layout/URN";
import { ObbParticipant } from "../../../../../state/entities/obb-legs/ObbLegs.types";
import { NormalizedObbLeg } from "../../entities/obb-leg/ObbLeg.types";

export type ObbPopularBettingOpportunity = {
  betCount: number;
  participants: ObbParticipant[];
  leg: NormalizedObbLeg;
};

export type NormalizedObbEventPopularsCard = {
  typename: "ObbEventPopularsCard";
  urn: URN;
  title: string;
  badgeLabel?: string;
  sportEvent: URN;
  showPopularEvidence: boolean;
  showStats: boolean;
  numberOfVisibleBettingOpportunities: number;
  popularBettingOpportunities: ObbPopularBettingOpportunity[];
};
