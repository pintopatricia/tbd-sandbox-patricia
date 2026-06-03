import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { BetCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

export type ContainerProps = {
  urn: URN;
};

export type StateProps = {
  items: PartialItem[];
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBetCardGroupByURN = createCardGroupByURNSelector<BetCardGroups, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const betCardGroup = getBetCardGroupByURN(state.layouts.cardgroups.betcardgroups, urn);

    return {
      items: betCardGroup?.items ?? [],
    };
  };
};

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: DispatchProps = {};
