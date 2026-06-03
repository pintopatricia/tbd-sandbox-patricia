import { FootballFixture } from "../../../entities";
import { ObbParticipant } from "../../../entities/obb-legs/ObbLegs.types";
import URN from "../../URN";

export type RawPopularObbBettingOpportunity = {
  betCount: number;
  participants: string[];
  legId: string;
};

export type ObbPopularBettingOpportunity = {
  betCount: number;
  participants: ObbParticipant[];
  legId: string;
};

export type ObbEventPopularsCard = {
  typename: "ObbEventPopularsCard";
  urn: URN;
  title: string;
  badgeLabel?: string;
  sportEvent: URN;
  showPopularEvidence: boolean;
  showStats: boolean;
  numberOfVisibleBettingOpportunities: number;
  popularBettingOpportunities: RawPopularObbBettingOpportunity[];
};

export type SelectorObbEventPopularsCard = {
  typename: "ObbEventPopularsCard";
  urn: URN;
  title: string;
  badgeLabel?: string;
  sportEvent: {
    urn: URN;
    name: string;
  };
  fixture?: FootballFixture;
  showPopularEvidence: boolean;
  showStats: boolean;
  numberOfVisibleBettingOpportunities: number;
  popularBettingOpportunities: ObbPopularBettingOpportunity[];
};

export type ObbEventPopularsCards = {
  [urn: string]: ObbEventPopularsCard;
};
