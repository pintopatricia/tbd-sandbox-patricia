import { RefObject } from "react";
import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BetslipStep, RequestStatus } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { getBetslipStep, getBetslipPlaceStatus } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

export type ContainerProps = {
  drawerRef?: RefObject<HTMLDivElement | null>;
};

export type StateProps = {
  step: BetslipStep;
  placeStatus: RequestStatus;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps | false, ContainerProps, ApplicationState> =
  () => (state) => {
    const step = getBetslipStep(state);

    if (!step) {
      return false;
    }

    const placeStatus = getBetslipPlaceStatus(state) || "NONE";

    return {
      step,
      placeStatus,
    };
  };
