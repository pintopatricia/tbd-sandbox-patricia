import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import { getBetslipStep } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { BetslipStep } from "@ppb/tbd-store/state/betslip/Betslip.types";

export type StateProps = {
  step: BetslipStep;
};

export type ContainerProps = {};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps | false, ContainerProps, ApplicationState> =
  () => (appState: ApplicationState) => {
    const step = getBetslipStep(appState);

    if (!step) {
      return false;
    }

    return { step };
  };

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
