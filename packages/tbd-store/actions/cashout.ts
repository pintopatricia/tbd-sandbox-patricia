import { ExchangeCashouts } from "../state/betting/exchange-cashouts/ExchangeCashouts.types";
import { SportsbookCashouts } from "../state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import { Receipt, Product } from "../state/entities";
import URN from "../state/layout/URN";

export const UI__CASHOUT_BUTTON_TAP = "UI/CASHOUT_BUTTON_TAP";
export const UI__CASHOUT_BUTTON_TAP_AUTO_CONFIRM = "UI/CASHOUT_BUTTON_TAP_AUTO_CONFIRM";
export const NETWORK__CASHOUT_TAKE = "NETWORK/CASHOUT_TAKE";
export const NETWORK__CASHOUT_TAKE_SUCCESS = "NETWORK/CASHOUT_TAKE_SUCCESS";
export const NETWORK__CASHOUT_TAKE_IN_PROGRESS = "NETWORK/CASHOUT_TAKE_IN_PROGRESS";
export const NETWORK__CASHOUT_TAKE_FAILURE = "NETWORK/CASHOUT_TAKE_FAILURE";
export const SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES = "SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES";
export const UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES = "UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES";
export const NETWORK__FETCH_EXC_QUOTES_SUCCESS = "NETWORK/FETCH_EXC_QUOTES_SUCCESS";
export const NETWORK__FETCH_EXC_QUOTES_FAILURE = "NETWORK/FETCH_EXC_QUOTES_FAILURE";
export const NETWORK__FETCH_SBK_QUOTES_SUCCESS = "NETWORK/FETCH_SBK_QUOTES_SUCCESS";
export const NETWORK__FETCH_SBK_QUOTES_FAILURE = "NETWORK/FETCH_SBK_QUOTES_FAILURE";
export const CASHOUT__RESET_CONFIRMATION_STEP = "CASHOUT/RESET_CONFIRMATION_STEP";
export const CASHOUT__RECEIPT_CLOSE_ALL = "CASHOUT/RECEIPT_CLOSE_ALL";
export const NETWORK__CASHOUT_TAKE_FAILURE_SBK = "NETWORK/CASHOUT_TAKE_FAILURE_SBK";
export const NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE = "NETWORK/FETCH_SBK_QUOTES_AUTH_FAILURE";
export const NETWORK__CASHOUT_TAKE_AUTH_FAILURE_SBK = "NETWORK/CASHOUT_TAKE_AUTH_FAILURE_SBK";

export type CashoutButtonTapAction = {
  type: typeof UI__CASHOUT_BUTTON_TAP;
  payload: {
    cashoutUrn: string;
    confirmCashout: boolean;
  };
};

export type CashoutButtonTapActionAutoConfirm = {
  type: typeof UI__CASHOUT_BUTTON_TAP_AUTO_CONFIRM;
  payload: {
    cashoutUrn: string;
  };
};

export type CashoutResetConfirmationStepAction = {
  type: typeof CASHOUT__RESET_CONFIRMATION_STEP;
  payload: {
    cashoutUrn: string;
  };
};

export type CashoutReceiptCloseAll = {
  type: typeof CASHOUT__RECEIPT_CLOSE_ALL;
};

export type TakeCashoutAction = {
  type: typeof NETWORK__CASHOUT_TAKE;
  payload: {
    cashoutUrn: URN;
  };
};

export type TakeCashoutInProgressAction = {
  type: typeof NETWORK__CASHOUT_TAKE_IN_PROGRESS;
  payload: {
    cashoutUrn: URN;
  };
};

export type TakeCashoutSuccessAction = {
  type: typeof NETWORK__CASHOUT_TAKE_SUCCESS;
  payload: {
    product: Product;
    receipt: Receipt;
    errorCode: string;
    marketId?: string;
  };
};

export type TakeCashoutFailureAction = {
  type: typeof NETWORK__CASHOUT_TAKE_FAILURE;
  payload: {
    receipt: Receipt;
    errorCode: string;
  };
};

export type SubscribeExchangeCashoutAction = {
  type: typeof SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES;
  payload: {
    marketId: string;
    handicap: number;
  };
};

export type UnsubscribeExchangeCashoutAction = {
  type: typeof UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES;
  payload: {
    marketId: string;
    handicap: number;
  };
};

export type FetchExchangeQuotesSuccessAction = {
  type: typeof NETWORK__FETCH_EXC_QUOTES_SUCCESS;
  payload: ExchangeCashouts | Record<string, never>;
};

export type FetchExchangeQuotesFailureAction = {
  type: typeof NETWORK__FETCH_EXC_QUOTES_FAILURE;
};

export type FetchSportsbookQuotesSuccessAction = {
  type: typeof NETWORK__FETCH_SBK_QUOTES_SUCCESS;
  payload: SportsbookCashouts | Record<string, never>;
};

export type FetchSportsbookQuotesFailureAction = {
  type: typeof NETWORK__FETCH_SBK_QUOTES_FAILURE;
  error: string;
};

export type FetchSportsbookQuotesAuthFailureAction = {
  type: typeof NETWORK__FETCH_SBK_QUOTES_AUTH_FAILURE;
};

export type TakeCashoutFailureSbkAction = {
  type: typeof NETWORK__CASHOUT_TAKE_FAILURE_SBK;
  payload: {
    entityURN: string;
    errorCode: string;
  };
};

export type TakeCashoutAuthFailureSbkAction = {
  type: typeof NETWORK__CASHOUT_TAKE_AUTH_FAILURE_SBK;
};
