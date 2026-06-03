import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getActiveBetslipType } from "@ppb/tbd-store/state/betting/betting-selectors";
import {
  getObbBettingPrimeLegs,
  getObbCombinedLegFailures,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import {
  createSimpleSelectionsCounterSelector,
  getSportsbookBettingImplyRunnerFailures,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { MapStateToPropsFactory } from "react-redux";

import { COMBINED_LEGS_FAILURES_BLOCKLIST } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting.constants";
import { hasSGMFailures } from "../../../connected-sportsbook-betslip-mapper";
import { createMinimizedTitleSelector } from "../../vm-builder";

export type CardProps = {
  title: string | null;
  activeBetslipType: BetslipType | null;
  totalSelections: number;
  hasFailures?: boolean;
  isConfirm: boolean;
};
export type StateProps = CardProps | Record<string, never>;

export type DispatchProps = {};
export type ContainerProps = {
  onClick: () => void;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookSimpleSelectionsCounter = createSimpleSelectionsCounterSelector();
  const buildTitle = createMinimizedTitleSelector();

  return (state: ApplicationState): StateProps => {
    const { betslip } = state;

    if (!betslip) {
      return {};
    }

    const { step } = betslip;
    const activeBetslipType = getActiveBetslipType(state);

    let totalSelections = 0;
    let hasFailures = false;

    if (activeBetslipType === BetslipType.OBB) {
      totalSelections = Object.keys(getObbBettingPrimeLegs(state)).length;
      hasFailures = Object.values(getObbCombinedLegFailures(state)).some((legFailure) =>
        COMBINED_LEGS_FAILURES_BLOCKLIST.includes(legFailure),
      );
    } else {
      totalSelections = getSportsbookSimpleSelectionsCounter(state);

      const failedRunners = getSportsbookBettingImplyRunnerFailures(state);
      hasFailures = Object.keys(failedRunners).some((key) => hasSGMFailures(failedRunners[key]));
    }

    return {
      title: buildTitle(state),
      activeBetslipType,
      isConfirm: step === "CONFIRM_POTENTIAL",
      hasFailures,
      totalSelections,
    };
  };
};

export const mapDispatchToProps = {};
