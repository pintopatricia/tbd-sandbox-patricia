import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { OpenCombinationsListAction, UI__OPEN_COMBINATIONS_LIST } from "@ppb/tbd-store/actions/betslip";
import { createGetReviewCombinationLineIdsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

import { i18n } from "../../../helpers/i18n";

type CardProps = {
  id: string;
  lineIds: string[];
  i18n: {
    title: string;
    odd: string;
    payout: string;
    more: string;
    less: string;
  };
};
export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = { id: string };

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const labels: StateProps["i18n"] = {
    title: i18n({ key: "I18N.BETSLIP.SBK.PREVIEW.TITLE" }),
    odd: i18n({ key: "I18N.BETSLIP.SBK.PREVIEW.ODD" }),
    payout: i18n({ key: "I18N.BETSLIP.SBK.PREVIEW.PAYOUT" }),
    more: i18n({ key: "I18N.BETSLIP.SBK.PREVIEW.MORE" }),
    less: i18n({ key: "I18N.SHOW_LESS" }),
  };
  const getReviewCombinationLineIds = createGetReviewCombinationLineIdsSelector();

  return (state: ApplicationState, { id }: ContainerProps): StateProps => {
    const lineIds = getReviewCombinationLineIds(state, id);

    return {
      id,
      lineIds,
      i18n: labels,
    };
  };
};

export type DispatchActions = OpenCombinationsListAction;

export type DispatchProps = {
  dispatchOnOpen: (combinationId: string) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchOnOpen: (combinationId) => {
    dispatch<OpenCombinationsListAction>({
      type: UI__OPEN_COMBINATIONS_LIST,
      payload: {
        combinationId,
        maxCombinations: 16,
      },
    });
  },
});
