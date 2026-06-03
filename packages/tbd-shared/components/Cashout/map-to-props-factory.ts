import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  CashoutButtonTapAction,
  CashoutButtonTapActionAutoConfirm,
  TakeCashoutAction,
  NETWORK__CASHOUT_TAKE,
  UI__CASHOUT_BUTTON_TAP,
  UI__CASHOUT_BUTTON_TAP_AUTO_CONFIRM,
  CASHOUT__RESET_CONFIRMATION_STEP,
  CashoutResetConfirmationStepAction,
} from "@ppb/tbd-store/actions/cashout";
import { createGetThrottleSelector } from "@ppb/tbd-store";
import { createExchangeCashoutQuoteSelector } from "@ppb/tbd-store/state/betting/exchange-cashouts/exchange-cashout-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createSportsbookCashoutQuoteSelector } from "@ppb/tbd-store/state/betting/sportsbook-cashouts/sportsbook-cashout-selectors";
import { createExchangeMarketBetSelector } from "@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { SportsbookCashoutQuote } from "@ppb/tbd-store/state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import { CashoutStep, Jurisdiction } from "@ppb/tbd-store/state/constants";

import {
  cashoutViewModel,
  getEmptyCashoutViewModel,
  getExchangeCashoutViewModel,
  getSportsbookCashoutViewModel,
} from "./cashout-view-model";

export type StateProps = cashoutViewModel | Record<string, never>;

export type ContainerProps = {
  cashoutURN: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getExchangeCashoutQuoteByURN = createExchangeCashoutQuoteSelector();
  const getSportsbookCashoutQuoteByURN = createSportsbookCashoutQuoteSelector();
  const getExchangeMarketByURN = createExchangeMarketSelector();
  const getExchangeMarketBetByURN = createExchangeMarketBetSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, ownProps: ContainerProps): StateProps => {
    try {
      const { cashoutURN } = ownProps;

      if (!cashoutURN) {
        return getEmptyCashoutViewModel();
      }

      const userDetails = <UserDetails>getUserDetails(state);

      // Confirm cashout step should always be shown for Brazil jurisdiction, regardless of the user preference
      let { confirmCashout } = getUserPreferencesWithProductSwitcher(state.entities.preferences);
      if (userDetails.jurisdiction.jurisdiction === Jurisdiction.BRAZIL) {
        confirmCashout = true;
      }

      // EXCHANGE
      if (cashoutURN.includes(EntityType.ExchangeCashoutQuote)) {
        const excQuote = getExchangeCashoutQuoteByURN(state.betting.exchangecashouts, cashoutURN);

        if (!excQuote || excQuote.step === CashoutStep.HIDE) {
          return getEmptyCashoutViewModel();
        }

        const market = getExchangeMarketByURN(state.entities.exchangemarkets, excQuote.marketURN);
        const marketBet = getExchangeMarketBetByURN(state, excQuote.marketBetURN);

        return getExchangeCashoutViewModel(cashoutURN, confirmCashout, userDetails, excQuote, market, marketBet);
      }

      // SPORTSBOOK
      const sbkQuote = getSportsbookCashoutQuoteByURN(
        state.betting.sportsbookcashouts,
        cashoutURN,
      ) as SportsbookCashoutQuote;

      if (!sbkQuote || sbkQuote.step === CashoutStep.HIDE) {
        return getEmptyCashoutViewModel();
      }

      const CASHOUT_SUSPENSION_REASONS = getThrottle(state.entities.throttles, "CASHOUT_SUSPENSION_REASONS")?.isActive;

      return getSportsbookCashoutViewModel(
        cashoutURN,
        confirmCashout,
        userDetails,
        sbkQuote,
        CASHOUT_SUSPENSION_REASONS,
      );
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

export type DispatchProps = {
  dispatchCashoutTap: (cashoutUrn: string, confirmCashout: boolean) => void;
  dispatchCashoutTransaction: (cashoutUrn: string) => void;
  dispatchUndoConfirm: (cashoutUrn: string) => void;
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchCashoutTap: (cashoutUrn: string, confirmCashout: boolean) => {
    dispatch<CashoutButtonTapAction>({
      type: UI__CASHOUT_BUTTON_TAP,
      payload: {
        cashoutUrn,
        confirmCashout,
      },
    });

    if (!confirmCashout) {
      dispatch<CashoutButtonTapActionAutoConfirm>({
        type: UI__CASHOUT_BUTTON_TAP_AUTO_CONFIRM,
        payload: { cashoutUrn },
      });
    }
  },
  dispatchCashoutTransaction: (cashoutUrn: string) => {
    dispatch<TakeCashoutAction>({
      type: NETWORK__CASHOUT_TAKE,
      payload: {
        cashoutUrn,
      },
    });
  },
  dispatchUndoConfirm: (cashoutUrn: string) => {
    dispatch<CashoutResetConfirmationStepAction>({
      type: CASHOUT__RESET_CONFIRMATION_STEP,
      payload: {
        cashoutUrn,
      },
    });
  },
});
