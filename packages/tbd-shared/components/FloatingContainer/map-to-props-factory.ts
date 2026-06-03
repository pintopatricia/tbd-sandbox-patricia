import type { MapStateToPropsFactory } from "react-redux";
import type { ApplicationState } from "@ppb/tbd-store/state";
import { ContainerProps, DispatchProps, StateProps } from "./props";
import { getObbBettingLegs } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { createSimpleSelectionsCounterSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookSimpleSelectionsCounter = createSimpleSelectionsCounterSelector();

  return (state: ApplicationState): StateProps => {
    const obbBetslipHasSelections = Object.keys(getObbBettingLegs(state)).length > 0;
    const sportsbookBetslipHasSelections = getSportsbookSimpleSelectionsCounter(state) > 0;

    return {
      betslipHasSelections: obbBetslipHasSelections || sportsbookBetslipHasSelections,
    };
  };
};

export const mapDispatchToProps: DispatchProps = {};
