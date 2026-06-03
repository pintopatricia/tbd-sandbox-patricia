import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { MarketBetCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type StateProps = {
  items: PartialItem[];
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardGroupByURN = createCardGroupByURNSelector<MarketBetCardGroups, URN>();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const cardGroup = getCardGroupByURN(state.layouts.cardgroups.marketbetcardgroups, urn);

    return {
      items: cardGroup?.items || [],
    };
  };
};
