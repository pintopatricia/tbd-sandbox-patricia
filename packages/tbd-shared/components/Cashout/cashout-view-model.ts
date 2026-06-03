import URN from "@ppb/tbd-store/state/layout/URN";
import { ExchangeMarket } from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { CashoutStep } from "@ppb/tbd-store/state/constants";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";

import { ExchangeCashoutQuote } from "@ppb/tbd-store/state/betting/exchange-cashouts/ExchangeCashouts.types";
import { SportsbookCashoutQuote } from "@ppb/tbd-store/state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import { ExchangeMarketBet } from "@ppb/tbd-store/state/betting/exchange-market-bets/ExchangeMarketBet.types";
import {
  ExchangeCashoutQuoteStatus,
  SportsbookCashoutQuoteStatus,
} from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { getExternalLink } from "../../helpers/external-links";

type CashoutState = "default" | "success" | "unavailable";

export type cashoutViewModel = {
  rawSecondaryValue: number;
  cashoutURN: string;
  isVisible: boolean;
  isDisabled: boolean;
  showWhyIsThisLink?: boolean;
  suspendedSupportUrl?: string;
  state: CashoutState;
  buttonLabel: string;
  detailLabel: string;
  formattedSecondaryValueLabel?: string;
  loadingLabel?: string;
  isConfirmStepActive: boolean;
  stopAnimation: boolean;
  step?: CashoutStep;
  betDelay?: number;
};

const CASHOUT_TITLE_LABELS = {
  confirm: i18n({ key: "I18N.CASHOUT.CONFIRM" }),
  title: i18n({ key: "I18N.CASHOUT.TITLE" }),
  successTitle: i18n({ key: "I18N.CASHOUT.SUCCESS_TITLE" }),
  profit: i18n({ key: "I18N.CASHOUT.PROFIT" }),
  cashingOut: i18n({ key: "I18N.CASHOUT.CASHING_OUT" }),
  updating: i18n({ key: "I18N.CASHOUT.UPDATING" }),
};

const CASHOUT_STATUS_LABELS = {
  AVAILABLE: "",
  UNAVAILABLE: i18n({ key: "I18N.CASHOUT.STATUS.UNAVAILABLE" }),
  // Exchange
  LATE_WITHDRAWAL: i18n({ key: "I18N.CASHOUT.STATUS.LATE_WITHDRAWAL" }),
  FAIL: i18n({ key: "I18N.CASHOUT.STATUS.FAIL" }),
  // Sportsbook
  BET_CLOSED: i18n({ key: "I18N.CASHOUT.STATUS.BET_CLOSED" }),
  NOT_ELIGIBLE: i18n({ key: "I18N.CASHOUT.STATUS.UNAVAILABLE" }),
  SUSPENDED: i18n({ key: "I18N.CASHOUT.STATUS.SUSPENDED" }),
  QUOTE_TOO_LOW: i18n({ key: "I18N.CASHOUT.STATUS.QUOTE_TOO_LOW" }),
  QUOTE_TOO_LOW_FREE_BET: i18n({ key: "I18N.CASHOUT.STATUS.QUOTE_TOO_LOW_FREE_BET" }),
  LEG_RESULT_PENDING: i18n({ key: "I18N.CASHOUT.STATUS.LEG_RESULT_PENDING" }),
  PENDING_CASHOUT: i18n({ key: "I18N.CASHOUT.STATUS.UNAVAILABLE" }),
  INPLAY_MARKET_NOT_ELIGIBLE: i18n({ key: "I18N.CASHOUT.STATUS.INPLAY_MARKET_NOT_ELIGIBLE" }),
};

const formatValue = (value: number, userDetails: UserDetails): string =>
  currencyFormatWithDecimalPlaces({
    ...userDetails,
    value,
    decimalPlaces: 2,
  });

export const getCashoutButtonLabels = (
  value: number | undefined,
  profit: number | undefined,
  status: ExchangeCashoutQuoteStatus | SportsbookCashoutQuoteStatus,
  step: CashoutStep | undefined,
  userDetails: UserDetails,
  isSuccessCashout: boolean,
  receiptProfit: number,
  isConfirmStepActive: boolean,
  showWhyIsThisLink?: boolean,
  cashoutSuspensionReasonsActive?: boolean,
): { buttonLabel: string; detailLabel: string; loadingLabel?: string; formattedSecondaryValueLabel?: string } => {
  if (isSuccessCashout) {
    return {
      buttonLabel: CASHOUT_TITLE_LABELS.successTitle,
      detailLabel: CASHOUT_TITLE_LABELS.profit,
      formattedSecondaryValueLabel: formatValue(receiptProfit, userDetails),
    };
  }

  if (value !== undefined && profit !== undefined) {
    const formattedCashoutValue = formatValue(value, userDetails);

    const isConfirmStep = step === CashoutStep.CONFIRM;
    const isDisplayStep = step === CashoutStep.DISPLAY;
    const buttonTitle = isConfirmStep ? CASHOUT_TITLE_LABELS.confirm : CASHOUT_TITLE_LABELS.title;
    const addLoadingLabel =
      (isConfirmStepActive && isConfirmStep) ||
      (!isConfirmStepActive && isDisplayStep) ||
      step === CashoutStep.CASHING_OUT;

    return {
      buttonLabel: `${buttonTitle}: ${formattedCashoutValue}`,
      detailLabel: CASHOUT_TITLE_LABELS.profit,
      loadingLabel: addLoadingLabel ? `${CASHOUT_TITLE_LABELS.cashingOut}: ${formattedCashoutValue}` : undefined,
      formattedSecondaryValueLabel: formatValue(profit, userDetails),
    };
  }

  // TODO: to be deleted upon throttle removal
  if (!cashoutSuspensionReasonsActive && showWhyIsThisLink) {
    return {
      buttonLabel: i18n({ key: "I18N.CASH_OUT_SUSPENSION_MESSAGING_PT_1" }),
      detailLabel: "",
    };
  }

  if (cashoutSuspensionReasonsActive && status === SportsbookCashoutQuoteStatus.Suspended) {
    return {
      buttonLabel: CASHOUT_TITLE_LABELS.updating,
      // TODO: update to CASHOUT_STATUS_LABELS[status] upon throttle removal and Lokalise original SUSPENDED gets updated
      detailLabel: i18n({ key: "I18N.CASHOUT.STATUS.SUSPENDED_NEW" }),
    };
  }

  return {
    buttonLabel: CASHOUT_TITLE_LABELS.title,
    detailLabel: CASHOUT_STATUS_LABELS[status],
  };
};

export const getEmptyCashoutViewModel = (): cashoutViewModel => ({
  cashoutURN: "",
  rawSecondaryValue: 0,
  isVisible: false,
  state: "default",
  isDisabled: true,
  formattedSecondaryValueLabel: "",
  buttonLabel: "",
  detailLabel: "",
  isConfirmStepActive: false,
  stopAnimation: true,
});

export const getExchangeCashoutViewModel = (
  cashoutURN: URN,
  isConfirmStepActive: boolean,
  userDetails: UserDetails,
  quote: ExchangeCashoutQuote,
  market: ExchangeMarket | undefined,
  marketBet: ExchangeMarketBet | undefined,
): cashoutViewModel => {
  const { value, profit, status, step, cashedOutProfit } = quote;
  const { betDelay } = market || marketBet || { betDelay: 0 };

  const isSuccessCashout = step === CashoutStep.RECEIPT;
  const isDisabled = status !== ExchangeCashoutQuoteStatus.Available || isSuccessCashout;
  const receiptProfit = (isSuccessCashout && cashedOutProfit) || 0;

  const labels = getCashoutButtonLabels(
    value,
    profit,
    status,
    step,
    userDetails,
    isSuccessCashout,
    receiptProfit,
    isConfirmStepActive,
  );

  return {
    state: (isSuccessCashout && "success") || (isDisabled && "unavailable") || "default",
    cashoutURN,
    rawSecondaryValue: (isSuccessCashout ? receiptProfit : profit) || 0,
    isVisible: true,
    isDisabled,
    ...labels,
    isConfirmStepActive,
    stopAnimation: step !== CashoutStep.CASHING_OUT,
    step,
    betDelay,
  };
};

export const getSportsbookCashoutViewModel = (
  cashoutURN: URN,
  isConfirmStepActive: boolean,
  userDetails: UserDetails,
  sbkQuote: SportsbookCashoutQuote,
  cashoutSuspensionReasonsActive?: boolean,
): cashoutViewModel => {
  const { stake, quote, status, step, betDelay = 0, cashedOutProfit } = sbkQuote;
  const profit = quote && stake ? quote - stake : 0;
  const suspendedSupportUrl = getExternalLink("CASHOUT_SUSPENDED_WHY_IS_THIS");
  const showWhyIsThisLink =
    !cashoutSuspensionReasonsActive && status === SportsbookCashoutQuoteStatus.Suspended && suspendedSupportUrl !== "";

  const isSuccessCashout = step === CashoutStep.RECEIPT;
  const isDisabled = status !== SportsbookCashoutQuoteStatus.Available || isSuccessCashout;
  const receiptProfit = (isSuccessCashout && cashedOutProfit) || 0;

  const labels = getCashoutButtonLabels(
    quote,
    profit,
    status,
    step,
    userDetails,
    isSuccessCashout,
    receiptProfit,
    isConfirmStepActive,
    showWhyIsThisLink,
    cashoutSuspensionReasonsActive,
  );

  const stopAnimation = step !== CashoutStep.CONFIRM && step !== CashoutStep.CASHING_OUT;

  return {
    state: (isSuccessCashout && "success") || (isDisabled && "unavailable") || "default",
    cashoutURN,
    rawSecondaryValue: (isSuccessCashout ? receiptProfit : profit) || 0,
    isVisible: true,
    isDisabled,
    showWhyIsThisLink,
    suspendedSupportUrl,
    ...labels,
    isConfirmStepActive,
    stopAnimation,
    step,
    betDelay,
  };
};
