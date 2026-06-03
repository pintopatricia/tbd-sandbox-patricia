import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import {
  BettingSbkDepositSuccessful,
  BETTING__SBK_DEPOSIT_SUCCESSFUL,
  BettingExcPlaceDepositSuccessful,
  BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
  BettingExcEditDepositSuccessful,
  BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL,
} from "@ppb/tbd-store/actions/betting";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ActiveProduct, BetslipStep } from "@ppb/tbd-store/state/betslip/Betslip.types";
import URN from "@ppb/tbd-store/state/layout/URN";

import { i18n } from "../../../helpers/i18n";

export type StateProps = {
  labels: {
    depositSuccessful: string;
    placingBet: string;
  };
  isDepositRedirect: boolean;
  activeProduct: ActiveProduct;
  origin?: BetslipStep;
  excRunner?: URN;
  excMarket?: URN;
  excBetId?: string;
};

export type ContainerProps = Record<string, unknown>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const labels = {
    depositSuccessful: i18n({ key: "I18N.DEPOSIT.DEPOSIT_SUCCESSFUL" }),
    placingBet: i18n({ key: "I18N.BETSLIP.PLACING_BET" }),
  };

  return (state: ApplicationState): StateProps => {
    // TODO: update ApplicationState type to make betslip optional
    // it's currently being lazy loaded, not available on app start
    const hasLoadedBettingModule = !!state.betslip;
    if (!hasLoadedBettingModule) {
      return {
        labels,
        isDepositRedirect: false,
        activeProduct: "NONE",
      };
    }

    const { exchangeContext, exchangeEdit, step } = state.betslip;

    return {
      labels,
      isDepositRedirect: state.betslip.isDepositRedirect,
      activeProduct: state.betslip.activeProduct,
      origin: step,
      excRunner: exchangeContext?.runner,
      excMarket: exchangeContext?.market,
      excBetId: exchangeEdit?.betId,
    };
  };
};

export type DispatchProps = {
  dispatchSbkDepositSuccessful(): void;
  dispatchExcDepositSuccessful(origin: "PLACE_POTENTIAL" | "CONFIRM_POTENTIAL", runner: URN): void;
  dispatchExcDepositSuccessful(origin: "EDIT_UNMATCHED", runner: URN, market: URN, betId: string): void;
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchSbkDepositSuccessful: () => {
    dispatch<BettingSbkDepositSuccessful>({ type: BETTING__SBK_DEPOSIT_SUCCESSFUL });
  },
  dispatchExcDepositSuccessful: (
    origin: "PLACE_POTENTIAL" | "EDIT_UNMATCHED" | "CONFIRM_POTENTIAL",
    runner: URN,
    market?: URN,
    betId?: string,
  ) => {
    if (origin === "PLACE_POTENTIAL" || origin === "CONFIRM_POTENTIAL") {
      dispatch<BettingExcPlaceDepositSuccessful>({
        type: BETTING__EXC_PLACE_DEPOSIT_SUCCESSFUL,
        payload: { runner },
      });
      return;
    }

    if (origin === "EDIT_UNMATCHED" && market && betId) {
      dispatch<BettingExcEditDepositSuccessful>({
        type: BETTING__EXC_EDIT_DEPOSIT_SUCCESSFUL,
        payload: { runner, market, betId },
      });
    }
  },
});
