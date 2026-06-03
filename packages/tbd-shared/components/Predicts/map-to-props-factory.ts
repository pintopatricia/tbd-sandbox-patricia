import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getIsPredictsOpen } from "@ppb/tbd-store/state/predicts";
import { closePredicts } from "@ppb/tbd-store/actions/predicts";

export type CardProps = {
  isOpen: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> =
  () =>
  (state: ApplicationState): StateProps => {
    const isPredictsOpen = getIsPredictsOpen(state);

    if (!isPredictsOpen) {
      return {};
    }

    return { isOpen: isPredictsOpen };
  };

const dispatchClosePredicts = () => closePredicts();

export type DispatchProps = {
  dispatchClosePredicts: typeof dispatchClosePredicts;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchClosePredicts,
};
