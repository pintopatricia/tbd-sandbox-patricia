import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createFindCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";

export type ContainerProps = {
  urn: string;
  typename: string;
} & Pick<PartialItem, "theme">;

export type CardProps = {
  typename: string | null;
  isCardGroupLoaded: boolean;
  visible?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFindCardGroupByURNSelector = createFindCardGroupByURNSelector();

  return (state: ApplicationState, { urn, typename }: ContainerProps): StateProps => {
    const cardgroup = getFindCardGroupByURNSelector(state.layouts.cardgroups, urn);

    return {
      typename: typename || null,
      isCardGroupLoaded: !!cardgroup,
    };
  };
};

export type DispatchProps = Record<string, never>;
