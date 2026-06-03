import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/Layout.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { VirtualCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import {
  SUBSCRIBE_VIRTUALS_CARD,
  SubscribeVirtualsCard,
  UNSUBSCRIBE_VIRTUALS_CARD,
  UnsubscribeVirtualsCard,
} from "@ppb/tbd-store/actions/virtuals";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

export type ContainerProps = {
  urn: string;
  visible?: boolean;
};

export type CardProps = {
  items: PartialItem[];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getVirtualCardGroupByURN = createCardGroupByURNSelector<VirtualCardGroups, URN>();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const virtualCardGroup = getVirtualCardGroupByURN(state.layouts.cardgroups.virtualcardgroups, urn);

    if (!virtualCardGroup) {
      return {};
    }

    return {
      items: virtualCardGroup?.items || [],
    };
  };
};

const dispatchVirtualsSubscribe = (urn: URN): SubscribeVirtualsCard => ({
  type: SUBSCRIBE_VIRTUALS_CARD,
  payload: {
    urn,
  },
});

const dispatchVirtualsUnsubscribe = (): UnsubscribeVirtualsCard => ({
  type: UNSUBSCRIBE_VIRTUALS_CARD,
});

export type DispatchProps = {
  dispatchVirtualsSubscribe: typeof dispatchVirtualsSubscribe;
  dispatchVirtualsUnsubscribe: typeof dispatchVirtualsUnsubscribe;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = {
  dispatchVirtualsSubscribe,
  dispatchVirtualsUnsubscribe,
};
