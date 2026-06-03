import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  SetThrottlesAction,
  SET_THROTTLES,
  ResetThrottlesAction,
  RESET_THROTTLES,
} from "@ppb/tbd-store/actions/settings-page";
import { ThrottlesState } from "@ppb/tbd-store/state";
import { createThrottlesBuilder, Throttle } from "../../view-model-factories/connected-throttles";

export type ContainerProps = {};

export type StateProps = {
  throttles: Throttle[];
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const buildThrottles = createThrottlesBuilder();

  return function mapStateToProps(state: ApplicationState) {
    const throttles = buildThrottles(state.entities.throttles);

    return {
      throttles,
    };
  };
};

const dispatchSetThrottlesAction = (throttles: ThrottlesState): SetThrottlesAction => ({
  type: SET_THROTTLES,
  payload: {
    value: throttles,
  },
});

const dispatchResetThrottlesAction = (): ResetThrottlesAction => ({ type: RESET_THROTTLES });

export type DispatchProps = {
  dispatchSetThrottlesAction: typeof dispatchSetThrottlesAction;
  dispatchResetThrottlesAction: typeof dispatchResetThrottlesAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSetThrottlesAction,
  dispatchResetThrottlesAction,
};
