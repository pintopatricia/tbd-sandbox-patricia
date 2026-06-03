import { BettingOpportunityType } from "../../entities";
import URN from "../../layout/URN";

type Selection = {
  marketUrn: URN;
  runnerUrn: URN;
};

export type PopularState = {
  bettingOpportunityId: string;
  bettingOpportunityType?: BettingOpportunityType;
  selections: Selection[];
};

export type PopularBettingState = {
  [opportunityId: string]: PopularState;
};
