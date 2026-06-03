import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

export type ContainerProps = {
  selectionUrn: string;
};

export type StateProps = {
  isEnabled: boolean;
  oddsRange: { min: number; max: number } | null;
  label: string;
};

export type DispatchProps = {
  onToggle: () => void;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  return function mapStateToProps(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _state: ApplicationState,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ownProps: ContainerProps,
  ): StateProps {
    return {
      isEnabled: false,
      oddsRange: null,
      label: "MatchMe",
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({
  onToggle: () => {},
});
