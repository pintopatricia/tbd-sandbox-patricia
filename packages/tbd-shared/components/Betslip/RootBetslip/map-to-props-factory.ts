import { Dispatch } from "redux";
import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  createSimpleSelectionsCounterSelector,
  createHasMultiplesSelector,
  createQuickBetslipBetPickerSelector,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getObbReport, getSportsbookPlacedCombinations } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { BETTING__OBB_UPDATE_QUOTES, BettingObbUpdateQuotesAction } from "@ppb/tbd-store/actions/betting";
import {
  BetslipStep,
  ActiveProduct,
  BetslipSubType,
  QuickBetslipBet,
} from "@ppb/tbd-store/state/betslip/Betslip.types";
import { BetslipType } from "@ppb/tbd-store/state/constants";
import { getActiveBetslipType } from "@ppb/tbd-store/state/betting/betting-selectors";
import {
  BetslipCollapseToggleAction,
  BetslipHeaderClickAction,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
  UI__BETSLIP_HEADER_CLICK,
  BetslipCloseAction,
  UI__BETSLIP_CLOSE_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import { getObbBettingPrimeLegs } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";

export type CardProps = {
  isClosed: boolean;
  step: BetslipStep;
  activeProduct: ActiveProduct;
  activeBetslipType: BetslipType | null;
  isCollapsed: boolean;
  hasMultiples: boolean;
  hasConfirmation: boolean;
  isGenerosityWalletOpen?: boolean;
  quickBetslipBet: QuickBetslipBet | null;
};
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookSimpleSelectionsCounter = createSimpleSelectionsCounterSelector();
  const hasMultiplesSelector = createHasMultiplesSelector();
  const getQuickBetslipBetSelector = createQuickBetslipBetPickerSelector();

  return (state: ApplicationState): StateProps => {
    const { betslip } = state;

    if (!betslip) {
      return {};
    }

    const activeBetslipType = getActiveBetslipType(state);

    let totalSelections = 0;
    let hasMultiples = false;
    let hasPlacedCombinations = false;
    const hasObbReports = !!getObbReport(state);

    if (activeBetslipType === BetslipType.OBB) {
      totalSelections = Object.keys(getObbBettingPrimeLegs(state)).length;
    } else {
      hasPlacedCombinations = !!getSportsbookPlacedCombinations(state);
      totalSelections = getSportsbookSimpleSelectionsCounter(state);
      hasMultiples = hasMultiplesSelector(state);
    }

    const isClosed = !hasPlacedCombinations && totalSelections === 0 && !hasObbReports;

    const { activeProduct, step, isCollapsed } = betslip;

    const quickBetslipBet = getQuickBetslipBetSelector(state);

    return {
      quickBetslipBet,
      isClosed,
      step,
      activeProduct,
      isCollapsed,
      hasMultiples,
      hasConfirmation: !!state.confirmation,
      activeBetslipType,
      isGenerosityWalletOpen: !!betslip.selectedCombinationId,
    };
  };
};

export type DispatchProps = {
  dispatchHeaderToggle: (isCollapsed: boolean, betslipSubType: BetslipSubType) => void;
  dispatchHeaderCollapse: () => void;
  dispatchDismissClick: () => void;
};
export type ContainerProps = {};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<
    BetslipCloseAction | BetslipHeaderClickAction | BetslipCollapseToggleAction | BettingObbUpdateQuotesAction
  >,
) => ({
  dispatchDismissClick: () =>
    dispatch<BetslipCloseAction>({
      type: UI__BETSLIP_CLOSE_CLICK,
    }),
  dispatchHeaderToggle: (isCollapsed: boolean, betslipSubType: BetslipSubType) => {
    dispatch({
      type: UI__BETSLIP_HEADER_CLICK,
      payload: { isCollapsed: !isCollapsed, betslipSubType },
    });
    dispatch({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: !isCollapsed,
      },
    });
    if (isCollapsed) {
      dispatch<BettingObbUpdateQuotesAction>({
        type: BETTING__OBB_UPDATE_QUOTES,
      });
    }
  },
  dispatchHeaderCollapse: () => {
    dispatch({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: true,
      },
    });
  },
});
