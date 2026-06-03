import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import { getBetslipStep } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { BetslipStep } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { RefObject } from "react";

export type ContainerProps = {
  drawerRef?: RefObject<HTMLDivElement | null>;
};

export type StateProps = {
  step: BetslipStep;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps | false, ContainerProps, ApplicationState> =
  () => (state) => {
    const step = getBetslipStep(state);
    if (!step) {
      return false;
    }

    return { step };
  };
