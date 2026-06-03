import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ActionLike, ConfirmationCode } from "@ppb/tbd-store/state/confirmation/Confirmation.types";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { RefObject } from "react";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { i18n } from "../../../helpers/i18n";

export type StateProps = {
  title: string;
  subtitle: string;
  refuse: string;
  accept: string;
  refuseActions: ActionLike[];
  acceptActions: ActionLike[];
};

export type ContainerProps = {
  drawerRef?: RefObject<HTMLDivElement | null>;
};

type PartialStateProps = Pick<StateProps, "title" | "subtitle" | "refuse" | "accept">;

type ConfirmationStrategy = Record<ConfirmationCode, (state: ApplicationState) => PartialStateProps>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps | false, ContainerProps, ApplicationState> = () => {
  const LABELS_BY: ConfirmationStrategy = {
    BETTING_GROUP_SWITCH: (state: ApplicationState) => ({
      title: i18n({ key: "I18N.CONFIRMATION.TITLE.CLEAR_BETSLIP" }),
      subtitle: i18n({ key: "I18N.CONFIRMATION.SUBTITLE.CLEAR_BETSLIP" }),
      refuse:
        state.betslip?.group === "VIRTUAL"
          ? i18n({ key: "I18N.CONFIRMATION.KEEP_VIRTUAL_BETSLIP" })
          : i18n({ key: "I18N.CONFIRMATION.KEEP_REAL_BETSLIP" }),
      accept: i18n({ key: "I18N.CONFIRMATION.CLEAR_BETSLIP" }),
    }),
    BETTING_CLEAR: () => ({
      title: i18n({ key: "I18N.BETSLIP.REMOVE_ALL_SELECTIONS" }),
      subtitle: i18n({ key: "I18N.BETSLIP.REMOVE_ALL_QUESTION" }),
      refuse: i18n({ key: "I18N.BETSLIP.NO_KEEP_SELECTION" }),
      accept: i18n({ key: "I18N.BETSLIP.YES_CLEAR_BETSLIP" }),
    }),
    BETTING_BETSLIP_TYPE_SWITCH: (state: ApplicationState) => {
      const activeBetslip = Object.keys(state.betting?.obbBetting.legs).length
        ? BetslipType.OBB
        : BetslipType.SPORTSBOOK;

      const translations = {
        [BetslipType.OBB]: {
          subtitle: i18n({ key: "I18N.CONFIRMATION.SUBTITLE.CLEAR_BETSLIP_OBB" }),
          refuse: i18n({ key: "I18N.CONFIRMATION.KEEP_OBB_BETSLIP" }),
        },
        [BetslipType.SPORTSBOOK]: {
          subtitle: i18n({ key: "I18N.CONFIRMATION.SUBTITLE.CLEAR_BETSLIP_SBK" }),
          refuse: i18n({ key: "I18N.CONFIRMATION.KEEP_SBK_BETSLIP" }),
        },
      };

      return {
        title: i18n({ key: "I18N.CONFIRMATION.TITLE.CLEAR_BETSLIP" }),
        subtitle: translations[activeBetslip].subtitle,
        refuse: translations[activeBetslip].refuse,
        accept: i18n({ key: "I18N.CONFIRMATION.CLEAR_BETSLIP" }),
      };
    },
  };

  return (state: ApplicationState) => {
    const { confirmation } = state;

    if (!confirmation) {
      return false;
    }

    const getLabels = LABELS_BY[confirmation.id];

    return {
      ...getLabels(state),
      refuseActions: confirmation.refuseActions,
      acceptActions: confirmation.acceptActions,
    };
  };
};

export type DispatchProps = {
  dispatchActions: (actions: ActionLike[], actionLabel?: string) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<ActionLike>,
) => ({
  dispatchActions: (actions, actionLabel) =>
    actions.forEach((action) => dispatch({ ...action, payload: { ...action.payload, actionLabel } })),
});
