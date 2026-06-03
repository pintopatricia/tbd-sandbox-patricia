import { BetslipAccordionHeaderClick, UI__BETSLIP_ACCORDION_HEADER_CLICK } from "@ppb/tbd-store/actions/betslip";
import { createGetSelectionIdsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { LEG_TYPES } from "@ppb/betslip-core";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { i18n } from "../../../../helpers/i18n";
import {
  createGetConfirmationSelectionIdsSelector,
  createIsConfirmStep,
} from "../../sportsbook-betslip-confirm-mapper";
import { ContainerProps, DispatchProps, StateProps } from "../props";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getIsConfirmStep = createIsConfirmStep();
  const getConfirmationSelectionIds = createGetConfirmationSelectionIdsSelector();
  const getSelectionIds = createGetSelectionIdsSelector();

  return (appState: ApplicationState, { legIds }: ContainerProps) => {
    const isConfirmStep = getIsConfirmStep(appState);
    const allLegIds = isConfirmStep
      ? getConfirmationSelectionIds(appState)
      : getSelectionIds(appState.betting.sportsbookBetting.legs);
    const finalLegIds = legIds?.length ? legIds : allLegIds.filter((legid) => !legid.includes(LEG_TYPES.ONE_LINE_BET));

    return {
      title: i18n({
        key: "I18N.BETSLIP.SELECTIONS_COUNT",
        interpolationValues: { numberOfSelections: `${finalLegIds.length}` },
      }),
      legIds: finalLegIds,
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
