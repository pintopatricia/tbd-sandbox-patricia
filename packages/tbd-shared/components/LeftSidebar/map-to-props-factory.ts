import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";

export type StateProps = {
  items: PartialItem[];
  isDesktop?: boolean;
};

export type ContainerProps = {
  isDesktop?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> =
  () =>
  (state: ApplicationState, { isDesktop }: ContainerProps): StateProps => ({
    items: state.layouts.leftSidebar.items,
    isDesktop,
  });
