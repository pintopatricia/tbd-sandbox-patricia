import { Runner } from "@ppb/the-wall-web";
import { FunctionComponent } from "react";
import ConnectedBettingOpportunityBetButton from "../BettingOpportunityBetButton";
import BettingOpportunityBetButton from "../BettingOpportunityBetButton/BettingOpportunityBetButton.web";
import { ComponentProps } from "./props";

const BettingOpportunity: FunctionComponent<ComponentProps> = ({ cardUrn, name, opportunityUrn, showWasPrice }) => (
  <Runner name={name}>
    <ConnectedBettingOpportunityBetButton
      component={BettingOpportunityBetButton}
      cardUrn={cardUrn}
      bettingOpportunityUrn={opportunityUrn}
      showWasPrice={showWasPrice}
      short
    />
  </Runner>
);

export default BettingOpportunity;
