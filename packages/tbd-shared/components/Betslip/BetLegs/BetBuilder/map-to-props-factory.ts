import { Dispatch } from "redux";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { BetslipAccordionHeaderClick, UI__BETSLIP_ACCORDION_HEADER_CLICK } from "@ppb/tbd-store/actions/betslip";
import {
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSportsbookConfirmationLegs } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

import { i18n } from "../../../../helpers/i18n";
import { createIsConfirmStep } from "../../sportsbook-betslip-confirm-mapper";
import { hasAnyInvalidSGMCombinationFailure } from "../../connected-sportsbook-betslip-mapper";
import { ContainerProps, DispatchProps, StateProps } from "../props";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getIsConfirmStep = createIsConfirmStep();

  return (state, { legIds, isWarning }) => {
    const isConfirmStep = getIsConfirmStep(state);

    if (!legIds) {
      return { title: "", legIds: [] };
    }

    const legs = isConfirmStep ? getSportsbookConfirmationLegs(state) : getSportsbookBettingLegs(state);
    const failures = getSportsbookBettingImplyRunnerFailures(state);
    const runnerIds = legIds
      .filter((id) => legs[id])
      .map((id) => legs[id].runners)
      .reduce((uniqueRunners, runnersList) => [...uniqueRunners, ...runnersList], []);
    const hasInvalidSGMCombination = Array.from(new Set(runnerIds)).some((runnerId) =>
      hasAnyInvalidSGMCombinationFailure(failures[runnerId]),
    );

    return {
      title: isWarning
        ? i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE" })
        : i18n({
            key: "I18N.BETSLIP.SELECTIONS_COUNT",
            interpolationValues: { numberOfSelections: `${legIds.length}` },
          }),
      description: hasInvalidSGMCombination
        ? i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS_DESCRIPTION" })
        : undefined,
      legIds,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchCollapseToggle: (isExpanded: boolean) => {
    dispatch<BetslipAccordionHeaderClick>({
      type: UI__BETSLIP_ACCORDION_HEADER_CLICK,
      payload: { isExpanded },
    });
  },
});
