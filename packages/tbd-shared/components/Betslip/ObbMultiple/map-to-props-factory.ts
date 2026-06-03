import {
  BETTING__OBB_CHANGE_STAKE_ACTION,
  BETTING__OBB_REMOVE_LEG_ACTION,
  BettingObbChangeStakeAction,
  BettingObbRemoveLegAction,
} from "@ppb/tbd-store/actions/betting";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  createGetObbCombinedLegsMetadataByPotentialBetIdSelector,
  getObbCombinedLegFailures,
  createGetObbPotentialBetsByIdSelector,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { COMBINED_LEGS_FAILURES_BLOCKLIST } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting.constants";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { i18n } from "../../../helpers/i18n";
import { ContainerProps, DispatchProps, StateProps } from "./props";
import {
  BetslipSliderDisplayedAction,
  BetslipSliderInteractionAction,
  UI__BETSLIP_SLIDER_DISPLAYED,
  UI__BETSLIP_SLIDER_INTERACTION,
} from "@ppb/tbd-store/actions/interface";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBetLegsMetadataByPotentialBetId = createGetObbCombinedLegsMetadataByPotentialBetIdSelector();
  const getPotentialBetById = createGetObbPotentialBetsByIdSelector();

  return (appState: ApplicationState, { potentialBets }: ContainerProps): StateProps => {
    if (!potentialBets?.length) {
      return {};
    }
    try {
      // every potential bet in a multiple group has the same metadata as only the value of x changes

      const obbLegsMetadata = getBetLegsMetadataByPotentialBetId(appState, potentialBets[0].id);

      if (!Object.keys(obbLegsMetadata).length) {
        return {};
      }

      const selectionsTitle = i18n({
        key: "I18N.BETSLIP.SELECTIONS_COUNT",
        interpolationValues: { numberOfSelections: `${Object.entries(obbLegsMetadata).length}` },
      });

      const legs = Object.entries(obbLegsMetadata).map(([legId, metadata]) => ({
        legId,
        participantsDescription: metadata.participantsDescription || "",
        outcomeDescription: metadata.outcomeDescription || "",
      }));

      const obbCombinedLegsFailures = getObbCombinedLegFailures(appState);
      const potentialBet = getPotentialBetById(appState, potentialBets[0].id);

      const hasNotCombinableFailure = Object.entries(obbCombinedLegsFailures).some(
        ([legId, failureCode]) =>
          potentialBet.legs.includes(legId) && COMBINED_LEGS_FAILURES_BLOCKLIST.includes(failureCode),
      );

      const i18nLabels = {
        notCombinableMessage: i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS" }),
        notCombinableAlert: i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE" }),
        selectionsToWin: i18n({ key: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN" }),
      };

      // Assuming that all legs are from the same event
      const eventName = Object.values(obbLegsMetadata)[0].eventName || "";

      const potentialBetWithStake = potentialBets.find(
        (potentialBet) =>
          appState.betting.obbBetting.potentialBets[potentialBet.id] &&
          appState.betting.obbBetting.potentialBets[potentialBet.id].stake,
      );

      return {
        i18n: i18nLabels,
        legs,
        eventName,
        selectionsTitle,
        hasNotCombinableFailure,
        potentialBetWithStake,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

export type DispatchActions =
  | BettingObbRemoveLegAction
  | BetslipSliderInteractionAction
  | BettingObbChangeStakeAction
  | BetslipSliderDisplayedAction;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchRemoveSelectionAction: (legId: string) =>
    dispatch<BettingObbRemoveLegAction>({
      type: BETTING__OBB_REMOVE_LEG_ACTION,
      payload: { legId },
    }),
  dispatchSliderInteraction: (eventName, direction, source) =>
    dispatch<BetslipSliderInteractionAction>({
      type: UI__BETSLIP_SLIDER_INTERACTION,
      payload: { eventName, direction, source },
    }),
  dispatchStakeChange: ({ potentialBetId, newValue }: { potentialBetId: string; newValue?: number }) => {
    dispatch<BettingObbChangeStakeAction>({
      type: BETTING__OBB_CHANGE_STAKE_ACTION,
      payload: { potentialBetId, newValue: newValue || null },
    });
  },
  dispatchSliderDisplayed: (eventName) =>
    dispatch<BetslipSliderDisplayedAction>({
      type: UI__BETSLIP_SLIDER_DISPLAYED,
      payload: { eventName },
    }),
});
