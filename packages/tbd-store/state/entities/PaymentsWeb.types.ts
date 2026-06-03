import { PYWEventActions, PYWEventStatus } from "../constants";

export type PYWBalanceRefreshEvent = {
  action: PYWEventActions.BALANCE_REFRESHED;
  payload: {};
};

export type PYWCancelDepositEvent = {
  action: PYWEventActions.CANCEL_DEPOSIT;
  payload: {};
};

export type PYWDepositFailedEvent = {
  action: PYWEventActions.DEPOSIT_FAILED;
  payload: {
    is3DS: boolean;
    errorCode: string;
    errorMessage: string;
  };
};

export type PYWDepositSuccessEvent = {
  action: PYWEventActions.DEPOSIT_SUCCESS;
  payload: {
    message: string;
    deposited: number;
    fee: number;
    currency: string;
    status: PYWEventStatus;
    firstDeposit: boolean;
    methodType: string;
    transactionId: string;
  };
};

export type PYWPageLoadEvent = {
  action: PYWEventActions.PAGE_LOAD;
  payload: {
    data: number;
  };
};

export type PYWResizeEvent = {
  action: PYWEventActions.RESIZE;
  payload: {
    data: number;
  };
};

export type PYWUserCanDepositEvent = {
  action: PYWEventActions.USER_CAN_DEPOSIT;
  payload: {
    data: boolean;
    errorCode?: string;
    errorMessage?: string;
  };
};

export type PYWEvents =
  | PYWBalanceRefreshEvent
  | PYWCancelDepositEvent
  | PYWDepositFailedEvent
  | PYWDepositSuccessEvent
  | PYWPageLoadEvent
  | PYWResizeEvent
  | PYWUserCanDepositEvent;

export { PYWEventActions, PYWEventStatus } from "../constants";
