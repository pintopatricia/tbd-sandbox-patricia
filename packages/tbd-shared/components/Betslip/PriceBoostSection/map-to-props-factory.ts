import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapDispatchToProps, MapStateToProps } from "react-redux";

export type StateProps = Record<string, never>;

export type ContainerProps = {
  boostedCombinationIds: string[];
  failedCombinationGroupIds: string[];
  shouldFocusStakeField?: boolean;
  betControlsExperimentVariant?: string;
};

export const mapStateToProps: MapStateToProps<StateProps, ContainerProps, ApplicationState> = () => ({});

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
