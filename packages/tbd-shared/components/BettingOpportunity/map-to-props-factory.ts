import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createEntityByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { PopularBettingOpportunities } from "@ppb/tbd-store";

export type ContainerProps = {
  cardUrn: string;
  opportunityUrn: string;
  visible?: boolean;
  showWasPrice?: boolean;
};

export type CardProps = {
  name: string | undefined;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBettingOpportunityByURN = createEntityByURNSelector<PopularBettingOpportunities, URN>();

  return function mapStateToProps(state: ApplicationState, { opportunityUrn }: ContainerProps): StateProps {
    const bettingOpportunity = getBettingOpportunityByURN(state.entities.popularbettingopportunities, opportunityUrn);

    if (!bettingOpportunity?.selections.length) {
      return {};
    }

    return {
      name: bettingOpportunity.name,
    };
  };
};

export type DispatchProps = {};

export const mapDispatchToProps: DispatchProps = {};
