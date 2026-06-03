import URN from "../../layout/URN";
import { SportsbookOdds } from "../SportsbookOdds.types";

export type BettingOpportunityType =
  | "POPULAR"
  | "POPULAR_MULTIPLES"
  | "MANUAL_MULTIPLES"
  | "CREATED_BETS"
  | "ENTITY"
  | "BOOSTED_BETS";

export type PopularBettingOpportunity = {
  typename: "PopularBettingOpportunity";
  urn: URN;
  id: string;
  type: BettingOpportunityType | null;
  count: number;
  selections: {
    marketUrn: URN;
    runnerUrn: URN;
    silkUrl?: string;
    jockeyName?: string;
    trainerName?: string;
  }[];
  odds?: SportsbookOdds;
  originalOdds?: SportsbookOdds;
  name?: string;
};

export type PopularBettingOpportunities = {
  [urn: string]: PopularBettingOpportunity;
};
