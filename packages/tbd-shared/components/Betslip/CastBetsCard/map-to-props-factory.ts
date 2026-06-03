import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store";
import { createGetCastGroupIdsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

import { createIsConfirmStep, createGetConfirmationCastGroupIdsSelector } from "../sportsbook-betslip-confirm-mapper";

export type StateProps = {
  castGroupIds: string[];
};

export type ContainerProps = {
  shouldFocusStakeField?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getIsConfirmStep = createIsConfirmStep();
  const getCastGroupIds = createGetCastGroupIdsSelector();
  const getConfirmationCastGroupsIds = createGetConfirmationCastGroupIdsSelector();

  return (state: ApplicationState) => {
    const isConfirmStep = getIsConfirmStep(state);

    const castGroupIds = isConfirmStep ? getConfirmationCastGroupsIds(state) : getCastGroupIds(state);

    return { castGroupIds };
  };
};

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
