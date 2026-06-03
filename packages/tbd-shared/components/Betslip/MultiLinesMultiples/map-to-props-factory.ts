import { MapStateToPropsFactory } from "react-redux";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BettingState } from "@ppb/betslip-core";

import { createGetMultipleCombinations } from "../SportsbookPlace/sportsbook-place-mapper";
import { createIsConfirmStep, createGetConfirmationMultipleCombinations } from "../sportsbook-betslip-confirm-mapper";

type CardProps = {
  multiples: BettingState.Combination[];
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  shouldRenderBetLegs?: boolean;
  shouldFocusStakeField?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMultipleCombinations = createGetMultipleCombinations();
  const getConfirmMultipleCombinations = createGetConfirmationMultipleCombinations();
  const getIsConfirmStep = createIsConfirmStep();
  return (appState: ApplicationState): StateProps => {
    const card = getBetslipCard(appState);
    const isConfirmStep = getIsConfirmStep(appState);

    const multipleCombinations = isConfirmStep
      ? getConfirmMultipleCombinations(appState)
      : getMultipleCombinations(appState);

    if (!card || !multipleCombinations?.multiLinesCombinations.length) {
      return {};
    }

    return {
      multiples: multipleCombinations.multiLinesCombinations,
    };
  };
};
