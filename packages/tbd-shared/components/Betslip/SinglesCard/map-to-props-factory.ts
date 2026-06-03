import {
  getSingleCombinationIds,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { getSportsbookConfirmationLegs } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { isLotteries } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { BetslipSportsbookConfirmationBet } from "@ppb/tbd-store";
import { createIsConfirmStep, getSingleCombinationIdsConfirm } from "../sportsbook-betslip-confirm-mapper";

type Combination = {
  combinationId: string;
  isOneLineBet: boolean;
};

export type StateProps = {
  combinations: Combination[];
};

export type ContainerProps = {
  hasAvailabilityHints: boolean;
  showCustomKeyboard?: boolean;
  applyBoxShadow?: boolean;
  shouldFocusStakeField?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> =
  () => (appState: ApplicationState) => {
    const isConfirmStep = createIsConfirmStep();
    const combinationsState = getSportsbookBettingCombinations(appState);
    let combinationIds: string[];
    let legs: BetslipSportsbookConfirmationBet["legs"];

    if (isConfirmStep(appState)) {
      combinationIds = getSingleCombinationIdsConfirm(appState);
      legs = getSportsbookConfirmationLegs(appState);
    } else {
      combinationIds = getSingleCombinationIds(appState);
      legs = getSportsbookBettingLegs(appState);
    }

    const combinations: Combination[] = Object.values(combinationsState)
      .sort((combinationA, combinationB): number => combinationA.creationTimestamp - combinationB.creationTimestamp)
      .map((combination) => ({
        combinationId: combinationIds.find((combinationId) => combinationId === combination.id),
        isOneLineBet: isLotteries(combination, legs),
      }))
      .filter((combination) => combination.combinationId !== undefined) as Combination[];

    return {
      combinations,
    };
  };

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
